"""
Sentinel Omni — API Gateway & WebSocket Hub
Receives alerts from Edge Agents and broadcasts to all connected Dashboards.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, Depends, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import deque
from sqlalchemy.orm import Session
from sqlalchemy import func
import json
import asyncio
import shutil
import os
import sys
import base64
import cv2
import numpy as np
from datetime import datetime
import uuid
import time
# Add edge directory to path for AI engine access
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "edge")))
from inference_engine import SentinelInferenceEngine

from slowapi.errors import RateLimitExceeded
from security.limiter import limiter, _rate_limit_exceeded_handler
from security.database import engine, Base, get_db
from routers.auth import router as auth_router
from security.auth import get_current_active_user
from security.models import User, Alert as AlertModel, VideoAnalysisReport

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sentinel Omni - API Gateway")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Include the Auth Router
app.include_router(auth_router)

# Enable CORS for the Frontend (React Dashboard)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Initialize AI Engine ──
engine = SentinelInferenceEngine(
    yolo_model_path="../edge/best.pt",
    lstm_model_path="../edge/violence_lstm_model.h5"
)

# ── In-Memory Alert Storage ──
MAX_ALERT_HISTORY = 100
alert_history = deque(maxlen=MAX_ALERT_HISTORY)

# ── WebSocket Connection Manager ──
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[*] Dashboard connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"[*] Dashboard disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            self.disconnect(conn)


manager = ConnectionManager()


# ── Alert Model ──
class ThreatAlert(BaseModel):
    id: str
    type: str  # 'weapon', 'violence', 'pose'
    camera_id: str
    location: str
    confidence: float
    timestamp: str
    thumbnail: str | None = None


# ── REST Endpoints ──
@app.get("/")
async def root():
    return {
        "status": "Sentinel Omni API Online",
        "connected_dashboards": len(manager.active_connections),
        "total_alerts": len(alert_history)
    }


@app.post("/api/v1/alerts")
async def receive_alert(alert: ThreatAlert, db: Session = Depends(get_db)):
    """Receive an alert from an Edge Agent and broadcast to all dashboards."""
    alert_dict = alert.model_dump()
    alert_json = json.dumps(alert_dict)

    # Store in memory cache for fast access
    alert_history.appendleft(alert_dict)

    # ── Persist to Database ──
    db_alert = AlertModel(
        alert_id=alert.id,
        type=alert.type,
        camera_id=alert.camera_id,
        location=alert.location,
        confidence=alert.confidence,
        timestamp=alert.timestamp,
        thumbnail=alert.thumbnail,
    )
    db.add(db_alert)
    db.commit()

    severity = "CRITICAL" if alert.type == "weapon" else "HIGH" if alert.type == "violence" else "INFO"
    print(f"[!] [{severity}] {alert.type.upper()}: {alert.location} — confidence {alert.confidence:.2%} [SAVED TO DB]")

    # Broadcast to all connected dashboards
    await manager.broadcast(alert_json)

    return {
        "status": "success",
        "notified": len(manager.active_connections),
        "persisted": True
    }


@app.get("/api/v1/alerts/history")
@limiter.limit("20/minute")
async def get_alert_history(request: Request, limit: int = 50, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Return recent alert history from the database."""
    db_alerts = db.query(AlertModel).order_by(AlertModel.created_at.desc()).limit(limit).all()
    total = db.query(func.count(AlertModel.id)).scalar()

    alerts = [
        {
            "id": a.alert_id,
            "type": a.type,
            "camera_id": a.camera_id,
            "location": a.location,
            "confidence": a.confidence,
            "timestamp": a.timestamp,
            "thumbnail": a.thumbnail,
        }
        for a in db_alerts
    ]
    return {
        "alerts": alerts,
        "total": total
    }


@app.get("/api/v1/stats")
@limiter.limit("60/minute")
async def get_stats(request: Request, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Return real-time system statistics from the database."""
    total = db.query(func.count(AlertModel.id)).scalar() or 0
    weapon_alerts = db.query(func.count(AlertModel.id)).filter(AlertModel.type == "weapon").scalar() or 0
    violence_alerts = db.query(func.count(AlertModel.id)).filter(AlertModel.type == "violence").scalar() or 0
    avg_confidence = db.query(func.avg(AlertModel.confidence)).scalar() or 0

    return {
        "total_alerts": total,
        "weapon_alerts": weapon_alerts,
        "violence_alerts": violence_alerts,
        "active_dashboards": len(manager.active_connections),
        "avg_confidence": round(float(avg_confidence), 4)
    }


# ── WebSocket Endpoint ──
@app.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    """WebSocket for Dashboards to receive real-time alert streams."""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo heartbeat
            await websocket.send_text(json.dumps({"type": "heartbeat", "status": "active"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/api/v1/analyze/live")
@limiter.limit("30/minute")
async def analyze_live_frame(request: Request, payload: dict, current_user: User = Depends(get_current_active_user)):
    """Analyze a single frame from a live camera stream."""
    try:
        frame_data = payload.get("frame")
        if not frame_data:
            return {"error": "No frame data provided"}
        
        # Decode base64 frame
        if "," in frame_data:
            frame_data = frame_data.split(",")[1]
            
        img_bytes = base64.b64decode(frame_data)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return {"error": "Failed to decode frame"}
            
        # Run inference
        detections, _, boosted_threat = engine.process_frame(frame)
        
        # Filter detections for dashboard: Only show if boosted threat logic confirms it
        # This keeps the UI clean of false positives like mobiles or mics
        display_detections = []
        if boosted_threat > 0.4:
            display_detections = [d for d in detections if d['type'] in ['weapon', 'violence']]

        return {
            "threat_level": round(boosted_threat, 4),
            "detections": display_detections,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/v1/analyze/video")
@limiter.limit("5/minute")
async def analyze_video(request: Request, file: UploadFile = File(...), current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Upload a video and get a temporal threat analysis report."""
    temp_dir = "temp_analysis"
    os.makedirs(temp_dir, exist_ok=True)
    
    file_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run forensic analysis
        loop = asyncio.get_event_loop()
        report = await loop.run_in_executor(None, engine.analyze_video_file, file_path)
        
        # Refine verdict summary logic for the DB and UI
        w_count = report.get("weapon_count", 0)
        v_count = report.get("violence_count", 0)
        
        if w_count > 0 and v_count > 0:
            report["summary"] = "Multiple Threats"
        elif w_count > 0:
            report["summary"] = "Weapon Detected"
        elif v_count > 0:
            report["summary"] = "Violence Detected"
        else:
            report["summary"] = "Safe"

        # ── Persist report to Database ──
        db_report = VideoAnalysisReport(
            filename=file.filename,
            summary=report.get("summary", "Unknown"),
            duration=report.get("duration", 0),
            weapon_count=report.get("weapon_count", 0),
            violence_count=report.get("violence_count", 0),
            timeline_json=json.dumps(report.get("timeline", [])),
            significant_frames_json=json.dumps(report.get("significant_frames", [])),
            user_id=current_user.id,
        )
        db.add(db_report)
        db.commit()
        print(f"[+] Video report saved to DB: {file.filename} by user {current_user.username}")
        
        return report
        
    except Exception as e:
        return {"error": str(e)}
        
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/api/v1/analyze/video/stream")
async def analyze_video_stream(request: Request, file: UploadFile = File(...), current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Upload a video and stream live frame-by-frame analysis via SSE.
    Each event contains the current annotated frame, detections, and threat level.
    When a threat is detected, an alert is also broadcast via WebSocket."""
    temp_dir = "temp_analysis"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename or "upload.mp4")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    async def event_generator():
        cap = cv2.VideoCapture(file_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        frame_step = max(int(fps / 2), 1)  # ~2 frames per second

        # Reset the engine's LSTM buffer for a clean run
        engine.feature_buffer = []

        timeline = []
        significant_frames = []
        weapon_count = 0
        violence_count = 0
        current_frame = 0
        processed = 0

        # Send metadata first
        meta = json.dumps({"event": "meta", "fps": fps, "total_frames": total_frames, "duration": round(duration, 2)})
        yield f"data: {meta}\n\n"

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if current_frame % frame_step == 0:
                timestamp = round(current_frame / fps, 2)
                detections, annotated_frame, boosted_threat = engine.process_frame(frame)

                # Draw overlays on the frame
                annotated_frame = engine.draw_overlays(annotated_frame, detections)

                # Encode annotated frame to base64 JPEG
                _, buffer_img = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 60])
                frame_b64 = base64.b64encode(buffer_img).decode('utf-8')

                # Calculate threat level using XGBoost Ensemble
                threat_level = boosted_threat
                
                # ONLY display and count detections if the boosted score passes a threshold
                # This ensures false detections like mobiles don't show up on-screen.
                final_detections = []
                if threat_level > 0.4:
                    final_detections = [d for d in detections if d['type'] in ['weapon', 'violence']]
                    
                detected_types = [d['type'] for d in final_detections]
                for d in final_detections:
                    if d['type'] == 'weapon':
                        weapon_count += 1
                    if d['type'] == 'violence':
                        violence_count += 1

                processed += 1
                progress = min(round((current_frame / total_frames) * 100, 1), 100)
                
                timeline.append({
                    "time": timestamp,
                    "threat_level": round(threat_level, 4),
                    "detections": list(set(detected_types))
                })

                # If significant threat, capture as evidence AND broadcast alert
                if threat_level > 0.5 and len(significant_frames) < 12:
                    significant_frames.append({
                        "time": timestamp,
                        "image": frame_b64,
                        "detections": list(set(detected_types))
                    })

                    # Broadcast alert through existing WebSocket system
                    alert_data = {
                        "id": str(uuid.uuid4()),
                        "type": detected_types[0] if detected_types else "unknown",
                        "camera_id": "VIDEO-UPLOAD",
                        "location": f"Video: {file.filename}",
                        "confidence": round(threat_level, 4),
                        "timestamp": datetime.now().isoformat(),
                        "thumbnail": frame_b64[:200] + "..."
                    }
                    alert_history.appendleft(alert_data)

                    db_alert = AlertModel(
                        alert_id=alert_data["id"],
                        type=alert_data["type"],
                        camera_id=alert_data["camera_id"],
                        location=alert_data["location"],
                        confidence=alert_data["confidence"],
                        timestamp=alert_data["timestamp"],
                        thumbnail=None,
                        user_id=current_user.id,
                    )
                    db.add(db_alert)
                    db.commit()

                    await manager.broadcast(json.dumps(alert_data))

                # Build frame event payload
                frame_event = json.dumps({
                    "event": "frame",
                    "frame": frame_b64,
                    "time": timestamp,
                    "threat_level": round(threat_level, 4),
                    "detections": [{
                        "type": d["type"],
                        "label": d["label"],
                        "confidence": round(d["confidence"], 4)
                    } for d in detections if d["type"] in ["weapon", "violence"]],
                    "progress": progress,
                    "weapon_count": weapon_count,
                    "violence_count": violence_count,
                })
                yield f"data: {frame_event}\n\n"

            current_frame += 1

        cap.release()

        # Send final summary
        if weapon_count > 0 and violence_count > 0:
            verdict = "Multiple Threats"
        elif weapon_count > 0:
            verdict = "Weapon Detected"
        elif violence_count > 0:
            verdict = "Violence Detected"
        else:
            verdict = "Safe"

        summary = {
            "event": "complete",
            "summary": verdict,
            "duration": round(duration, 2),
            "weapon_count": weapon_count,
            "violence_count": violence_count,
            "timeline": timeline,
            "significant_frames": significant_frames,
        }
        yield f"data: {json.dumps(summary)}\n\n"

        # Persist full report to DB
        db_report = VideoAnalysisReport(
            filename=file.filename or "upload.mp4",
            summary=verdict,
            duration=round(duration, 2),
            weapon_count=weapon_count,
            violence_count=violence_count,
            timeline_json=json.dumps(timeline),
            significant_frames_json=json.dumps(significant_frames),
            user_id=current_user.id,
        )
        db.add(db_report)
        db.commit()

        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
