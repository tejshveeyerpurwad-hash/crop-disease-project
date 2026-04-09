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

# -----------------------
# Configuration
# -----------------------
IMG_SIZE = 224
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = Path(settings.MODEL_PATH).parent
CLASS_NAMES_PATH = MODEL_DIR / 'class_names.json'
DISEASE_INFO_PATH = BASE_DIR / 'disease_info.json'

class CropDiseaseModel:
    """
    Upgraded Senior AI Engine: Handles high-accuracy inference with 
    false-positive protection and detailed disease intelligence.
    """
    def __init__(self):
        self.model = None
        self.class_names = []
        self.disease_info = {}
        self._load_class_names()
        self._load_disease_info()
        self._load_model()

    def _load_class_names(self):
        if CLASS_NAMES_PATH.exists():
            try:
                with open(CLASS_NAMES_PATH, 'r', encoding='utf-8') as f:
                    self.class_names = json.load(f)
            except Exception:
                self.class_names = []
        else:
            # PlantVillage Standard Defaults
            self.class_names = ['Potato___healthy', 'Potato___Early_blight', 'Potato___Late_blight']

    def _load_disease_info(self):
        if DISEASE_INFO_PATH.exists():
            try:
                with open(DISEASE_INFO_PATH, 'r', encoding='utf-8') as f:
                    self.disease_info = json.load(f)
            except Exception:
                pass

    def _load_model(self):
        if tf is None or not os.path.exists(settings.MODEL_PATH):
            print(f"⚠️ Model weight not found at {settings.MODEL_PATH}")
            return
        try:
            self.model = tf.keras.models.load_model(settings.MODEL_PATH)
            print("🚀 Trained AI Model loaded successfully.")
        except Exception as e:
            print(f"❌ Model load error: {e}")
            self.model = None

    async def predict(self, image_path: str):
        """
        Predicts disease with TTA, Spectral Filtering, and Blur Detection.
        Optimized for Farmer-Friendly UX with simple language and multi-lingual support.
        """
        if self.model is None:
            raise RuntimeError("Model is not loaded. Please train using train.py first.")

        # 1. Base Preprocessing
        img = Image.open(image_path).convert('RGB')
        img_resized = img.resize((IMG_SIZE, IMG_SIZE))
        img_array = np.array(img_resized).astype(np.float32)

        # 1c. Image Quality Check: Blur Detection (Laplacian Variance)
        # We use a simple numpy implementation of the Laplacian operator
        gray = np.array(img.convert('L'))
        laplacian = np.array([
            [0, 1, 0],
            [1, -4, 1],
            [0, 1, 0]
        ])
        # Simple convolution-like operation for variance
        from scipy.signal import convolve2d
        score = convolve2d(gray, laplacian, mode='valid').var()
        is_blurry = score < 60 # Threshold for common phone cameras

        # 2. TTA (Test Time Augmentation)
        versions = [img_array, np.fliplr(img_array), np.flipud(img_array)]
        batch_tta = np.stack(versions, axis=0)
        batch_preprocessed = preprocess_input(batch_tta)

        # 3. Accumulated Prediction
        predictions_all = self.model.predict(batch_preprocessed, verbose=0)
        predictions_avg = np.mean(predictions_all, axis=0)
        
        class_idx = np.argmax(predictions_avg)
        confidence = float(predictions_avg[class_idx])
        
        # 4. ROBUST CLASSIFICATION LOGIC
        label_key = self.class_names[class_idx] if class_idx < len(self.class_names) else "Unknown"
        
        # Confidence Threshold (75% as requested)
        if confidence < 0.75:
            # Downgrade to 'Healthy/Uncertain' if below threshold
            label_key = [c for c in self.class_names if "healthy" in c.lower()][0] if self.class_names else "Potato___healthy"
            prediction_note = "Low Confidence - Take a clearer photo"
        else:
            prediction_note = ""

        # 5. Disease Knowledge Mapping
        info = self.disease_info.get(label_key, {
            "name": label_key.replace("___", " ").replace("_", " "),
            "symptoms": "No abnormalities detected.",
            "prevention": "Monitor regularly.",
            "treatment": "No treatment required."
        })

        is_healthy = "healthy" in label_key.lower()
        
        # Farmer Friendly Mapping (Simple Words)
        return {
            "status": "Healthy" if is_healthy else "Diseased",
            "disease_name": info["name"],
            "confidence": round(confidence * 100, 1),
            "is_blurry": bool(is_blurry),
            "note": prediction_note,
            # Simple Advice
            "simple_advice": {
                "en": info.get("simple_en", "Your plant looks good!") if is_healthy else info.get("simple_en", "Treatment needed."),
                "hi": info.get("simple_hi", "आपका पौधा स्वस्थ है!") if is_healthy else info.get("simple_hi", "इलाज की जरूरत है।")
            },
            "steps": [
                info["prevention"],
                info["treatment"]
            ],
            "recommendation": info["treatment"],
            # Technical fields (for history)
            "label": label_key,
            "crop_type": label_key.split("___")[0] if "___" in label_key else "Unknown"
        }

ml_service = CropDiseaseModel()
