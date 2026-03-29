"""
Sentinel Omni - AI Inference Engine
Combines YOLO (weapon detection) + MobileNetV2 (Feature Extractor) + LSTM (Violence Classification)
"""

import cv2
import numpy as np
import time
import os
import base64

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from ultralytics import YOLO
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from threat_ensemble import ThreatEnsemble

# Fix for loading models with 'quantization_config' error in different Keras versions
class CustomDense(tf.keras.layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        super().__init__(*args, **kwargs)


class SentinelInferenceEngine:
    def __init__(self, yolo_model_path='best.pt', lstm_model_path='violence_lstm_model.h5'):
        print(f"[*] Initializing Sentinel Inference Engine...")
        
        self.ensemble = ThreatEnsemble()

        # ── YOLO Model (Weapon Detection) ──
        self.yolo_loaded = False
        if os.path.exists(yolo_model_path):
            try:
                self.yolo_model = YOLO(yolo_model_path)
                self.yolo_loaded = True
                print(f"[+] YOLO model loaded: {yolo_model_path}")
            except Exception as e:
                print(f"[!] YOLO failed to load: {e}")
        else:
            print(f"[~] YOLO model not found at '{yolo_model_path}' — weapon detection disabled.")

        # ── MobileNetV2 Model (Feature Extractor) ──
        print("[*] Loading MobileNetV2 backbone for feature extraction...")
        try:
            self.feature_extractor = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')
            self.cnn_loaded = True
            print("[+] MobileNetV2 backbone ready.")
        except Exception as e:
            print(f"[!] MobileNetV2 failed to load: {e}")
            self.cnn_loaded = False

        # ── LSTM Model (Violence Detection) ──
        self.lstm_loaded = False
        self.lstm_model = None
        self.sequence_length = 20  # Matched to your model summary
        self.num_features = 1280   # Matched to MobileNetV2 output
        self.feature_buffer = []   # Rolling buffer for CNN features
        self.violence_threshold = 0.65  # Confidence threshold

        if os.path.exists(lstm_model_path):
            try:
                tf.get_logger().setLevel('ERROR')
                # Load with CustomDense to ignore serialization errors
                self.lstm_model = tf.keras.models.load_model(
                    lstm_model_path, 
                    custom_objects={'Dense': CustomDense}
                )
                self.lstm_loaded = True

                # Detect model input shape from loaded model
                input_shape = self.lstm_model.input_shape
                if input_shape and len(input_shape) == 3:
                    self.sequence_length = input_shape[1] if input_shape[1] else self.sequence_length
                    self.num_features = input_shape[2] if input_shape[2] else self.num_features

                print(f"[+] LSTM Violence model loaded: {lstm_model_path}")
                print(f"    Expected Input: ({self.sequence_length}, {self.num_features})")
            except Exception as e:
                print(f"[!] LSTM model failed to load: {e}")
        else:
            print(f"[~] LSTM model not found at '{lstm_model_path}' — violence classification disabled.")

        print("[+] Sentinel AI Core Ready.")

    def _extract_cnn_features(self, frame):
        """Extract a 1280-dimension feature vector using MobileNetV2."""
        if not self.cnn_loaded:
            return None
        
        # Resize to 224x224 for MobileNetV2
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        resized_frame = cv2.resize(rgb_frame, (224, 224))
        img_array = np.expand_dims(resized_frame, axis=0)
        img_array = preprocess_input(img_array)
        
        # Extract features
        features = self.feature_extractor.predict(img_array, verbose=0)
        return features.flatten()

    def _classify_violence(self):
        """Run LSTM inference on the buffered feature sequence."""
        if not self.lstm_loaded or len(self.feature_buffer) < self.sequence_length:
            return False, 0.0

        # Take the last N frames as input sequence
        sequence = np.array(self.feature_buffer[-self.sequence_length:])
        sequence = np.expand_dims(sequence, axis=0)  # Shape: (1, seq_len, 1280)

        try:
            prediction = self.lstm_model.predict(sequence, verbose=0)
            
            # Multi-class output: [no_violence_prob, violence_prob]
            if prediction.shape[-1] > 1:
                confidence = float(prediction[0][1])  # Assume index 1 is violence
            else:
                confidence = float(prediction[0][0])

            is_violent = confidence >= self.violence_threshold
            return is_violent, confidence
        except Exception as e:
            print(f"[!] LSTM inference error: {e}")
            return False, 0.0

    def process_frame(self, frame):
        """Runs full inference on a single frame."""
        detections = []

        # ── 1. YOLO Detection (Weapon) ──
        if self.yolo_loaded:
            # Baseline confidence lowered back to 0.65 to ensure real weapons aren't missed
            # Higher precision is now handled by the XGBoost Ensemble layer
            results = self.yolo_model.predict(frame, conf=0.65, verbose=False)
            for r in results:
                for box in r.boxes:
                    coords = box.xyxy[0].tolist()
                    conf = float(box.conf[0])
                    label = self.yolo_model.names[int(box.cls[0])]
                    detections.append({
                        "type": "weapon",
                        "label": label,
                        "confidence": conf,
                        "bbox": coords
                    })

        # ── 2. CNN Feature Extraction & LSTM Classification (Violence) ──
        if self.cnn_loaded and self.lstm_loaded:
            features = self._extract_cnn_features(frame)
            if features is not None:
                self.feature_buffer.append(features)

                # Keep buffer capped to sequence length
                if len(self.feature_buffer) > self.sequence_length:
                    self.feature_buffer = self.feature_buffer[-self.sequence_length:]

                # ── Inference ──
                if len(self.feature_buffer) == self.sequence_length:
                    is_violent, violence_conf = self._classify_violence()

                    if is_violent:
                        detections.append({
                            "type": "violence",
                            "label": "Violence Detected",
                            "confidence": violence_conf,
                            "bbox": None
                        })
                    else:
                        detections.append({
                            "type": "pose",  # Label as activity for generic display
                            "label": "Scanning Activity",
                            "confidence": 0.99,
                            "landmarks": False
                        })

        # ── 3. XGBoost Boosting (Accuracy Logic) ──
        # In this frame-by-frame mode, we pass detections and violence score to XGBoost
        # to calculate the official 'Boosted' threat level.
        violence_score = 0.0
        for d in detections:
            if d['type'] == 'violence':
                violence_score = d['confidence']
                break
                
        boosted_threat = self.ensemble.calibrate(detections, violence_score)
        
        return detections, frame, boosted_threat

    def draw_overlays(self, frame, detections):
        """Draw bounding boxes and status overlays."""
        for det in detections:
            if det['type'] == 'weapon' and det.get('bbox'):
                x1, y1, x2, y2 = map(int, det['bbox'])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(frame, f"{det['label']} {det['confidence']:.2f}",
                            (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            elif det['type'] == 'violence':
                cv2.rectangle(frame, (0, 0), (frame.shape[1], 40), (0, 0, 200), -1)
                cv2.putText(frame, f"!! VIOLENCE DETECTED ({det['confidence']:.0%}) !!",
                            (10, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            elif det['type'] == 'pose':
                cv2.putText(frame, f"System Active: Analyzing Stream",
                            (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        return frame

    def analyze_video_file(self, video_path, sample_rate=2):
        """
        Processes a video file and returns a temporal threat analysis.
        sample_rate: number of frames to process per second.
        """
        if not os.path.exists(video_path):
            return {"error": "File not found"}

        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        
        # Calculate frame step based on sample rate
        frame_step = int(fps / sample_rate) if fps > 0 and sample_rate > 0 else 1
        
        print(f"[*] Starting forensic analysis: {video_path}")
        print(f"[*] Duration: {duration:.2f}s | Sampling every {frame_step} frames")

        timeline = []
        significant_frames = []
        weapon_count = 0
        violence_count = 0
        self.feature_buffer = []

        current_frame = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # ── 1. DENSE FEATURE SAMPLING (For Violence Context) ──
            # We must sample the LSTM feature extraction more densely (every 3 frames)
            # than the YOLO object detection to capture behavioral motion.
            if current_frame % 3 == 0:
                features = self._extract_cnn_features(frame)
                if features is not None:
                    self.feature_buffer.append(features)
                    if len(self.feature_buffer) > self.sequence_length:
                        self.feature_buffer = self.feature_buffer[-self.sequence_length:]

            # ── 2. SPARSE OBJECT DETECTION (For Speed) ──
            if current_frame % frame_step == 0:
                timestamp = current_frame / fps
                
                # YOLO detection (We only run the object detector sparsely)
                detections = []
                if self.yolo_loaded:
                    results = self.yolo_model.predict(frame, conf=0.65, verbose=False)
                    for r in results:
                        for box in r.boxes:
                            coords = box.xyxy[0].tolist()
                            conf = float(box.conf[0])
                            label = self.yolo_model.names[int(box.cls[0])]
                            detections.append({
                                "type": "weapon",
                                "label": label,
                                "confidence": conf,
                                "bbox": coords
                            })

                # Check LSTM for violence (Only if buffer is now ready)
                is_violent = False
                violence_conf = 0.0
                if len(self.feature_buffer) == self.sequence_length:
                    is_violent, violence_conf = self._classify_violence()
                    if is_violent:
                        detections.append({
                            "type": "violence",
                            "label": "Violence Detected",
                            "confidence": violence_conf,
                            "bbox": [0, 0, frame.shape[1], frame.shape[0]]
                        })

                # Final Threat Score via Ensemble (Dummy or Logic)
                # Pass features to Ensemble logic for forensic frames
                # For forensic analysis, we'll use a simplified ensemble score calculation
                threat_level = violence_conf * 0.7 + (max([d['confidence'] for d in detections if d['type'] == 'weapon'] + [0]) * 0.3)
                
                detected_types = []
                has_weapon = False
                has_violence_frame = False
                
                for d in detections:
                    if d['type'] in ['weapon', 'violence']:
                        detected_types.append(d['type'])
                        if d['type'] == 'weapon': 
                            weapon_count += 1
                            has_weapon = True
                        if d['type'] == 'violence': 
                            violence_count += 1
                            has_violence_frame = True

                # Record significant frame
                if threat_level > 0.4 and len(significant_frames) < 12:
                    _, buffer = cv2.imencode('.jpg', frame)
                    img_base64 = base64.b64encode(buffer).decode('utf-8')
                    significant_frames.append({
                        "time": round(timestamp, 2),
                        "image": img_base64,
                        "detections": list(set(detected_types))
                    })

                timeline.append({
                    "time": round(timestamp, 2),
                    "threat_level": round(threat_level, 4),
                    "detections": list(set(detected_types))
                })

            current_frame += 1

        cap.release()
        
        # Summary logic: Specific verdicts based on counts
        if weapon_count > 0 and violence_count > 0:
            verdict = "Multiple Threats"
        elif weapon_count > 0:
            verdict = "Weapon Detected"
        elif violence_count > 0:
            verdict = "Violence Detected"
        else:
            verdict = "Safe"
        
        return {
            "summary": verdict,
            "duration": round(duration, 2),
            "weapon_count": weapon_count,
            "violence_count": violence_count,
            "timeline": timeline,
            "significant_frames": significant_frames
        }
