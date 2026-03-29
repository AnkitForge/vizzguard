"""
Sentinel Omni - Edge AI Agent
Main loop: captures video, runs AI (YOLO + LSTM), sends alerts to backend.
"""

import cv2
import time
import argparse
from inference_engine import SentinelInferenceEngine
from bridge import SentinelBridge


def run_edge_agent(camera_source=0, yolo_model='best.pt', lstm_model='violence_lstm_model.h5', backend_url='http://localhost:8000', headless=False):
    """
    Main loop for the Edge Inference Agent.
    - Captures video from camera/RTSP
    - Runs YOLO weapon detection + LSTM violence classification
    - Sends real-time alerts to the backend dashboard
    """
    print("=" * 60)
    print("   SENTINEL OMNI — Edge AI Inference Agent")
    print("=" * 60)
    print(f"[*] Camera Source : {camera_source}")
    print(f"[*] YOLO Model   : {yolo_model}")
    print(f"[*] LSTM Model   : {lstm_model}")
    print(f"[*] Backend URL  : {backend_url}")
    print(f"[*] Headless Mode : {headless}")
    print("-" * 60)

    # Initialize AI Engine
    try:
        engine = SentinelInferenceEngine(
            yolo_model_path=yolo_model,
            lstm_model_path=lstm_model
        )
    except Exception as e:
        print(f"[!] Fatal: Engine initialization failed: {e}")
        return

    # Initialize Bridge to Backend
    bridge = SentinelBridge(backend_url=backend_url)

    # Open Camera Stream
    cap = cv2.VideoCapture(camera_source)
    if not cap.isOpened():
        print(f"[!] Error: Could not open camera source '{camera_source}'")
        return

    print(f"\n[+] Stream active. Processing frames... (Press 'q' to quit)")

    # Cooldown tracker to avoid spamming alerts
    last_alert_time = {"weapon": 0, "violence": 0}
    ALERT_COOLDOWN = 5  # seconds between alerts of the same type

    frame_count = 0
    fps_start = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[!] Stream interrupted. Retrying...")
            time.sleep(1)
            continue

        frame_count += 1

        # ── Run AI Inference ──
        detections, processed_frame = engine.process_frame(frame)

        # ── Process Detections & Send Alerts ──
        current_time = time.time()

        for det in detections:
            det_type = det['type']

            if det_type in ('weapon', 'violence'):
                # Check cooldown to avoid alert flooding
                if current_time - last_alert_time.get(det_type, 0) >= ALERT_COOLDOWN:
                    severity = "CRITICAL" if det_type == "weapon" else "HIGH"
                    print(f"\n[{'!' * 3} ALERT — {severity} {'!' * 3}]")
                    print(f"    Type       : {det['label']}")
                    print(f"    Confidence : {det['confidence']:.2%}")
                    print(f"    Sending to dashboard...")

                    bridge.send_alert(
                        alert_type=det_type,
                        label=det['label'],
                        confidence=det['confidence'],
                        camera_id="CAM-01",
                        location="Edge Node Alpha"
                    )
                    last_alert_time[det_type] = current_time

        # ── Local Debug Display ──
        if not headless:
            debug_frame = engine.draw_overlays(processed_frame, detections)

            # Add FPS counter
            elapsed = time.time() - fps_start
            if elapsed > 0:
                fps = frame_count / elapsed
                cv2.putText(debug_frame, f"FPS: {fps:.1f}", (debug_frame.shape[1] - 120, 25),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

            cv2.imshow('Sentinel Omni — Edge AI Debug', debug_frame)

            # Exit on 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            # Simple terminal output in headless mode
            if frame_count % 30 == 0:
                elapsed = time.time() - fps_start
                fps = frame_count / elapsed if elapsed > 0 else 0
                print(f"[*] Processing... FPS: {fps:.1f} (Detections: {len(detections)})", end='\r')

    cap.release()
    if not headless:
        cv2.destroyAllWindows()
    print("\n[*] Edge Agent stopped.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Sentinel Omni — Edge AI Agent')
    parser.add_argument('--source', type=str, default='0',
                        help='Camera source (0 for webcam, or RTSP URL)')
    parser.add_argument('--yolo-model', type=str, default='best.pt',
                        help='Path to YOLO model weights (.pt)')
    parser.add_argument('--lstm-model', type=str, default='violence_lstm_model.h5',
                        help='Path to LSTM violence model (.h5)')
    parser.add_argument('--backend', type=str, default='http://localhost:8000',
                        help='Backend API URL')
    parser.add_argument('--headless', action='store_true',
                        help='Run without GUI debug window')
    args = parser.parse_args()

    # Convert source to int if it's a digit (for local webcam index)
    source = int(args.source) if args.source.isdigit() else args.source

    run_edge_agent(
        camera_source=source,
        yolo_model=args.yolo_model,
        lstm_model=args.lstm_model,
        backend_url=args.backend,
        headless=args.headless
    )
