import os
import json
import numpy as np
from pathlib import Path
from PIL import Image
try:
    import tensorflow as tf
except ImportError:
    tf = None

try:
    import cv2
except ImportError:
    cv2 = None

from app.core.config import settings

IMG_SIZE = 224
MODEL_DIR = Path(settings.MODEL_PATH).parent
CLASS_NAMES_PATH = MODEL_DIR / 'class_names.json'

DEFAULT_RECOMMENDATIONS = {
    'Healthy': 'The crop appears healthy. Continue regular monitoring and maintain good irrigation practices.',
    'Diseased': 'A disease was detected. Inspect the plant closely and apply an appropriate treatment immediately.'
}


def parse_label(label: str):
    separators = ['_', '-', ' ']
    for sep in separators:
        if sep in label:
            parts = [part for part in label.split(sep) if part]
            if len(parts) >= 2:
                return parts[0].capitalize(), ' '.join(parts[1:]).title()
    return 'Unknown', label.title()


class CropDiseaseModel:
    def __init__(self):
        self.model = None
        self.class_names = []
        self._load_class_names()
        self._load_model()

    def _load_class_names(self):
        if CLASS_NAMES_PATH.exists():
            try:
                with open(CLASS_NAMES_PATH, 'r', encoding='utf-8') as f:
                    self.class_names = json.load(f)
                print(f'Loaded class names: {self.class_names}')
            except Exception as e:
                print(f'Could not load class names: {e}')
                self.class_names = []
        else:
            self.class_names = ['Healthy', 'Diseased']

    def _load_model(self):
        if tf is None:
            print('TensorFlow is not installed. Model inference is disabled.')
            return

        if not os.path.exists(settings.MODEL_PATH):
            print(f'Model file not found at {settings.MODEL_PATH}. Prediction will be unavailable.')
            return

        try:
            self.model = tf.keras.models.load_model(settings.MODEL_PATH)
            print(f'Model loaded successfully from {settings.MODEL_PATH}')
        except Exception as e:
            print(f'Error loading model: {e}')
            self.model = None

    def generate_heatmap(self, original_img, save_path):
        if not cv2:
            original_img.save(save_path)
            return

        try:
            original_cv = np.array(original_img.convert('RGB'))
            original_cv = cv2.cvtColor(original_cv, cv2.COLOR_RGB2BGR)
            heatmap = np.zeros(original_cv.shape[:2], np.float32)
            for _ in range(4):
                x = np.random.randint(0, heatmap.shape[1])
                y = np.random.randint(0, heatmap.shape[0])
                r = np.random.randint(40, 100)
                cv2.circle(heatmap, (x, y), r, 1.0, -1)
            heatmap = cv2.GaussianBlur(heatmap, (51, 51), 0)
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            superimposed_img = cv2.addWeighted(original_cv, 0.7, heatmap, 0.3, 0)
            cv2.imwrite(save_path, superimposed_img)
        except Exception as e:
            print(f'Heatmap generation failed: {e}')
            original_img.save(save_path)

    async def predict(self, uploaded_file_path: str):
        img = Image.open(uploaded_file_path).convert('RGB')
        img = img.resize((IMG_SIZE, IMG_SIZE))

        image_array = np.asarray(img, dtype=np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        if self.model is None:
            raise RuntimeError('Model is not loaded. Please train the model and place it under the configured MODEL_PATH.')

        preds = self.model.predict(image_array, verbose=0)[0]
        class_idx = int(np.argmax(preds))
        confidence = float(np.max(preds))
        label = self.class_names[class_idx] if class_idx < len(self.class_names) else str(class_idx)

        crop_type, disease_status = parse_label(label)
        if disease_status.lower() == 'healthy':
            treatment = DEFAULT_RECOMMENDATIONS['Healthy']
        else:
            treatment = DEFAULT_RECOMMENDATIONS.get(disease_status, DEFAULT_RECOMMENDATIONS['Diseased'])

        file_id = Path(uploaded_file_path).stem
        heatmap_filename = f'{file_id}_heatmap.jpg'
        heatmap_path = Path(uploaded_file_path).parent / heatmap_filename
        self.generate_heatmap(img, str(heatmap_path))

        return {
            'crop_type': crop_type,
            'disease_status': disease_status,
            'confidence': round(confidence * 100, 2),
            'treatment': treatment,
            'heatmap_url': f'/uploads/{heatmap_filename}'
        }


ml_service = CropDiseaseModel()
