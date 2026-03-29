# Sentinel Omni: Edge AI Inference Agent

The Edge Agent is responsible for processing live video streams locally and sending real-time alerts to the dashboard.

## 🚀 Setup Instructions

1.  **Place Your Trained Model**:
    *   Rename your trained YOLO model (e.g., `best.pt`) to **`best.pt`**.
    *   Place it inside this `/edge` directory.

2.  **Install Dependencies**:
    *   Ensure you have Python 3.9+ installed.
    *   Run: `pip install -r requirements.txt`

3.  **Run the Agent**:
    *   **Using Webcam (Default)**: `python main.py`
    *   **Using RTSP Camera**: `python main.py --source rtsp://username:password@camera_ip:port/stream`
    *   **Using Custom Model**: `python main.py --model my_custom_weights.pt`

## 🛠 Features
- **Weapon Detection**: Powered by YOLOv11 for identifying knives, firearms, and suspicious objects.
- **Violence Detection**: Powered by MediaPipe Pose for identifying aggressive stances or altercations.
- **Low Latency**: Processes video locally at the source to minimize alert delay.
- **Dashboard Support**: (WIP) Will send JSON metadata and thumbnails to the Sentinel Omni Dashboard.
