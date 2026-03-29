# Sentinel Omni: Project Development History & Conversation Log

This document serves as a comprehensive record of the development of **Sentinel Omni**, a high-performance interactive security control panel with real-time AI threat detection.

---

## 📝 Project Objective
The goal was to build a state-of-the-art surveillance dashboard featuring:
1.  **Interactive Threat Map**: A high-performance map of India with traffic-style threat intensity markers.
2.  **Live Video Surveillance**: AI-enhanced camera feeds with dynamic bounding boxes.
3.  **Real-Time Alerts**: A seamless bridge between edge AI models and the monitoring dashboard.
4.  **Premium Aesthetics**: Modern dark-themed UI with glassmorphism and smooth animations.

---

## 🛠️ Phase 1: Interactive Dashboard UI/UX

### 1. High-Performance Threat Map
- **Technology**: Leaflet.js with `preferCanvas: true` to eliminate lag.
- **Features**: 
    - 16 strategic locations across India (Delhi, Mumbai, etc.).
    - **Traffic-Style Severity Gradient**: Green (Low) → Yellow (Medium) → Orange (High) → Red (Critical).
    - **Pulsing Animations**: Critical threats pulse with a red glow.
    - **Theme Management**: Simplified to "Light" and "Dark" with Google Maps-style thumbnail preview.
    - **Google Maps Interaction**: Implemented `grab`/`grabbing` cursors and interactive marker pointers.

### 2. Live Feed System
- **Layout**: Dynamic 6-feed grid with smooth fullscreen toggling.
- **AI Overlays**: Animated "AI Bounding Boxes" (Red for weapons, Pulse for motion) with confidence scores.
- **Scanner Effect**: CSS-based `scanDown` animation to simulate active neural processing.

### 3. Analytics & Global Alerts
- **Charts**: Integrated Recharts for 24-hour threat trends and regional distribution.
- **Notification Panel**: Slide-in system linked to the header bell icon, categorizing alerts by severity.

---

## 🧠 Phase 2: Edge AI & System Architecture

The project was transitioned from a "UI Mockup" to a "Functional System" by implementing the **Sentinel Bridge Architecture**.

### 1. Edge AI Inference Agent (`/edge`)
- **Core**: Python-based engine designed to load your **trained YOLOv11** models.
- **Processing**: Ingests RTSP/USB streams, runs object detection and MediaPipe pose estimation locally.
- **Bridge**: Sends JSON threat metadata to the central server.

### 2. Backend Relay Server (`/backend`)
- **Core**: FastAPI-based API Gateway.
- **WebSocket Hub**: Instantly rebroadcasts threats from the Edge to all connected Frontends.
- **Latency**: Targeted at <200ms end-to-end.

---

## 🚀 Final Setup & Environment Guide

### 📂 Directory Map
- `frontend/`: React + TypeScript + Vite Dashboard.
- `backend/`: FastAPI Relay Server.
- `edge/`: Python AI Agent (Inference Engine).

### ⚙️ How to Run
1.  **Place Weights**: Rename your trained model to `best.pt` and place it in the `/edge` folder.
2.  **Start Backend**: `cd backend && pip install -r requirements.txt && python app.py`
3.  **Start Edge Agent**: `cd edge && pip install -r requirements.txt && python main.py`
4.  **Start Dashboard**: `cd frontend && npm run dev`

---

## 📈 Key Technical Milestones Accomplished
- ✅ Eliminated map lagging with Canvas rendering.
- ✅ Implemented Google Maps-style cursor interactions.
- ✅ Created a premium Light/Dark theme system.
- ✅ Developed the Edge-to-Frontend WebSocket bridge.
- ✅ Integrated real-time AI detections into the UI alert system.

---
**Date of Completion**: March 28, 2026
**Lead Architecture**: Antigravity AI
