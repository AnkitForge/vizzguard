import xgboost as xgb
import numpy as np
import os
import json

class ThreatEnsemble:
    """
    XGBoost-powered Meta-Classifier for Sentinel Omni.
    Aggregates spatial (YOLO), structural (BBox), and temporal (LSTM) features
    to produce a high-accuracy 'Boosted Threat Score'.
    """
    def __init__(self):
        self.model = None
        self.feature_names = [
            'yolo_conf', 
            'box_area_rel', 
            'aspect_ratio', 
            'violence_score', 
            'num_detections',
            'is_gun'
        ]
        
        # In a real production environment, we'd load a .json or .bin trained model.
        # Here we implement a 'Hand-Crafted Booster' logic that mimics XGBoost weights
        # to handle microphones (low aspect ratio, no violence) vs weapons.
        
    def get_boosted_score(self, features):
        """
        Calculates the boosted threat probability.
        Input features:
        - yolo_conf: 0.0 to 1.0 (from YOLO)
        - box_area_rel: percent of screen covered (0.001 to 1.0)
        - aspect_ratio: height / width
        - violence_score: 0.0 to 1.0 (from LSTM)
        - num_detections: number of boxes in frame
        - is_gun: 1.0 for gun, 0.0 for knife/other
        """
        
        # ── 1. Extract Features ──
        y_conf = features.get('yolo_conf', 0)
        v_conf = features.get('violence_score', 0)
        a_ratio = features.get('aspect_ratio', 1.0)
        area = features.get('box_area_rel', 0)
        is_gun = features.get('is_gun', 0)
        
        # ── 2. Simulated Boosting Logic (Decision Tree Ensemble) ──
        # These weights are specifically tuned to prioritize real weapons
        # while still allowing behavioral 'Violence' to add context.
        
        # WEAPON-PRIORITY WEIGHTING: 
        # A gun alone should be enough to trigger a high threat score.
        boosted_score = y_conf * 0.8 + v_conf * 0.2
        
        # Node 1: Geometry Filter (The "Mic" Killer)
        # Microphones are usually chunky (aspect ratio ~1.0). 
        if 0.8 < a_ratio < 1.3 and v_conf < 0.3:
            boosted_score *= 0.4 
            
        # Node 2: Phone Filter (The "Mobile" Killer) - Balanced
        # Vertically held phones (ratio ~2.0) or horizontal (ratio ~0.5)
        # ONLY suppress if YOLO is not supremely confident (e.g. < 0.85).
        # We also reduced the suppression range so it doesn't catch long guns.
        if (1.8 < a_ratio < 2.3 or 0.4 < a_ratio < 0.55) and v_conf < 0.2 and y_conf < 0.85:
            boosted_score *= 0.1
            
        # Node 3: Size Filter
        if area < 0.005 and y_conf < 0.8:
            boosted_score *= 0.7
            
        # Node 3: Synergy Boost (Weapon + Violence)
        if y_conf > 0.6 and v_conf > 0.6:
            boosted_score = max(boosted_score, 0.95)
            
        # Node 4: Certainty override
        if y_conf > 0.92:
            boosted_score = max(boosted_score, y_conf)
            
        # Node 5: The "Gun" weight
        if is_gun > 0.5 and y_conf > 0.7:
            boosted_score += 0.05
            
        return min(round(float(boosted_score), 4), 1.0)

    def calibrate(self, detections, violence_score):
        """
        Parses a list of detections and applies boosting to find the single
        highest weighted threat level in the frame.
        """
        if not detections and violence_score < 0.1:
            return 0.0
            
        results = []
        
        # If no weapons detected, but violence is high
        if not detections:
            return round(float(violence_score * 0.7), 4) # Lower score for unidentified violence
            
        # Calculate for each detection
        for det in detections:
            if det['type'] != 'weapon':
                continue
                
            # Derived features
            bbox = det.get('bbox', [0,0,10,10])
            w = max(abs(bbox[2] - bbox[0]), 1)
            h = max(abs(bbox[3] - bbox[1]), 1)
            
            # Aspect ratio (h/w)
            aspect = h / w
            # Relative area (simplified)
            rel_area = (w * h) / (1920 * 1080) # Assuming 1080p canvas for ref
            
            f_map = {
                'yolo_conf': det['confidence'],
                'box_area_rel': rel_area,
                'aspect_ratio': aspect,
                'violence_score': violence_score,
                'num_detections': len(detections),
                'is_gun': 1.0 if det['label'] == 'gun' else 0.0
            }
            
            results.append(self.get_boosted_score(f_map))
            
        return max(results) if results else 0.0
