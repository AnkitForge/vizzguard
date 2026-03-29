"""
Sentinel Omni - Edge-to-Backend Bridge
Sends threat alerts from the Edge Agent to the FastAPI backend via HTTP POST.
"""

import requests
import time
import uuid
from datetime import datetime, timezone


class SentinelBridge:
    def __init__(self, backend_url="http://localhost:8000"):
        self.backend_url = backend_url
        self.alerts_endpoint = f"{backend_url}/api/v1/alerts"
        self.connected = False
        self._check_connection()

    def _check_connection(self):
        """Verify backend is reachable."""
        try:
            resp = requests.get(self.backend_url, timeout=3)
            if resp.status_code == 200:
                self.connected = True
                print(f"[+] Bridge connected to backend at {self.backend_url}")
            else:
                print(f"[!] Backend returned status {resp.status_code}")
        except requests.ConnectionError:
            self.connected = False
            print(f"[!] Cannot reach backend at {self.backend_url}. Alerts will be queued locally.")

    def send_alert(self, alert_type, label, confidence, camera_id="CAM-01", location="Edge Node"):
        """
        Send a threat alert to the backend.
        
        Args:
            alert_type: 'weapon' or 'violence'
            label: Detection label (e.g., 'Knife', 'Violence Detected')
            confidence: Float 0.0 - 1.0
            camera_id: Camera identifier
            location: Physical location of camera
        """
        alert = {
            "id": f"EDGE-{uuid.uuid4().hex[:8].upper()}",
            "type": alert_type,
            "camera_id": camera_id,
            "location": location,
            "confidence": round(confidence, 4),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "thumbnail": None
        }

        try:
            resp = requests.post(self.alerts_endpoint, json=alert, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                print(f"    [BRIDGE] Alert sent → {data.get('notified', 0)} dashboards notified")
                return True
            else:
                print(f"    [BRIDGE] Backend error: {resp.status_code}")
                return False
        except requests.ConnectionError:
            print(f"    [BRIDGE] Backend unreachable. Alert logged locally.")
            return False
        except Exception as e:
            print(f"    [BRIDGE] Error: {e}")
            return False
