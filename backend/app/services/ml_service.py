import os
import json
import numpy as np
from pathlib import Path
from PIL import Image
try:
    import tensorflow as tf
    from tensorflow.keras.applications.efficientnet import preprocess_input
except ImportError:
    tf = None

from app.core.config import settings

# --- CONSTANTS ---
IMG_SIZE = 224
BASE_DIR = Path(__file__).resolve().parent
# We point to the new v3 weight path
MODEL_PATH = Path(settings.MODEL_PATH).parent / 'crop_model_v3.h5'
CLASS_NAMES_PATH = Path(settings.MODEL_PATH).parent / 'class_names.json'
DISEASE_INFO_PATH = BASE_DIR / 'disease_info.json'

class CropDiseaseModel:
    """
    AgriPro Senior AI Engine (v3)
    High-accuracy inference with 'Not a Leaf' detection and 0.75 confidence enforcement.
    """
    def __init__(self):
        self.model = None
        self.class_names = []
        self.disease_info = {}
        self._load_metadata()
        self._load_model()

    def _load_metadata(self):
        # Load Class Names
        if CLASS_NAMES_PATH.exists():
            with open(CLASS_NAMES_PATH, 'r', encoding='utf-8') as f:
                self.class_names = json.load(f)
        else:
            # Fallback if training hasn't run yet
            self.class_names = ["Invalid_Not_A_Leaf", "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy", "Tomato___healthy"]

        # Load Disease Info
        if DISEASE_INFO_PATH.exists():
            with open(DISEASE_INFO_PATH, 'r', encoding='utf-8') as f:
                self.disease_info = json.load(f)

    def _load_model(self):
        if tf is None:
            print("❌ TensorFlow not installed.")
            return

        final_path = str(MODEL_PATH) if MODEL_PATH.exists() else settings.MODEL_PATH
        if os.path.exists(final_path):
            try:
                self.model = tf.keras.models.load_model(final_path)
                print(f"🚀 Optimized AI Core v3 loaded from {final_path}")
            except Exception as e:
                print(f"❌ Model load error: {e}")
        else:
            print(f"⚠️ Warning: Model weights not found at {final_path}")

    async def predict(self, image_path: str):
        """
        Pure neural inference with strict confidence controls.
        """
        if self.model is None:
            # For hackathon/demo purposes if no model is found, return a technical error
            return self._format_response("Technical Error", 0.0, "Model weights missing", "")

        # 1. Preprocessing
        img = Image.open(image_path).convert('RGB')
        img_resized = img.resize((IMG_SIZE, IMG_SIZE))
        img_array = np.array(img_resized)
        
        # Expand for batch and apply EfficientNet preprocessing
        img_preprocessed = preprocess_input(np.expand_dims(img_array, axis=0))

        # 2. Prediction
        preds = self.model.predict(img_preprocessed, verbose=0)[0]
        class_idx = np.argmax(preds)
        confidence = float(preds[class_idx])
        label = self.class_names[class_idx]

        # 3. Validation Logic (High Integrity)
        
        # A. Not a Leaf Check
        if label == "Invalid_Not_A_Leaf":
            return self._format_response(
                "Not a Leaf", 
                confidence, 
                "This doesn't look like a plant leaf. Please upload a clear photo of a crop leaf.", 
                ""
            )

        # B. Confidence Guard (Enforce 0.75 threshold)
        if confidence < 0.75:
            return self._format_response(
                "Uncertain Result", 
                confidence, 
                "The analysis is uncertain. Please provide a clearer photo with better lighting.", 
                ""
            )

        # 4. Success Path
        info = self.disease_info.get(label, {"simple_en": "Unknown crop or disease.", "prevention": "N/A"})
        is_healthy = "healthy" in label.lower()
        
        return self._format_response(
            label if is_healthy else info.get("name", label),
            confidence,
            info.get("simple_en", "Analysis successful."),
            info.get("prevention", "No specific steps found.") if not is_healthy else "No disease detected."
        )

    def _format_response(self, label, confidence, message, prevention):
        """
        Strict output format as requested by requirements.
        """
        return {
            "label": label.replace("___", " ").replace("_", " "),
            "confidence": f"{round(confidence * 100, 1)}%",
            "message": message,
            "prevention": prevention,
            # Internal fields for legacy compatibility (optional but safe)
            "disease_status": "Healthy" if "healthy" in label.lower() else "Diseased",
            "confidence_score": confidence,
            "confidence_pct": round(confidence * 100, 1),
            "disease_info": message,
            "treatment": prevention,
            "crop_type": label.split("___")[0] if "___" in label else "Unknown"
        }

ml_service = CropDiseaseModel()
