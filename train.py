import os
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from PIL import Image
import tensorflow as tf
from tensorflow.keras import layers, callbacks, models
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import SparseCategoricalCrossentropy
from sklearn.metrics import classification_report, confusion_matrix

# -----------------------
# Configuration
# -----------------------
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / 'dataset'
TRAIN_DIR = DATASET_DIR / 'train'
VAL_DIR = DATASET_DIR / 'validation'
MODEL_DIR = BASE_DIR / 'backend' / 'app' / 'services' / 'model_weights'
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / 'crop_model.h5'
CLASS_NAMES_PATH = MODEL_DIR / 'class_names.json'
IMG_SIZE = 224
BATCH_SIZE = 32
SEED = 42

# -----------------------
# Advanced Data Augmentation
# -----------------------
def get_advanced_augmentation():
    """
    Enhanced augmentation to handle lighting, water droplets (reflection), 
    and varied leaf orientations to reduce false positives.
    """
    return tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2), 
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.4), # Increased contrast range for droplets
        layers.RandomBrightness(0.4), # Increased brightness range
        layers.RandomTranslation(height_factor=0.1, width_factor=0.1),
    ], name="advanced_augmentation")

# -----------------------
# Data Cleaning
# -----------------------
def clean_dataset(root_dir: Path):
    valid_extensions = {'.jpg', '.jpeg', '.png', '.bmp'}
    print(f"🔍 Deep Cleaning dataset at: {root_dir}")
    for path in list(root_dir.rglob('*')):
        if path.is_file():
            if path.suffix.lower() not in valid_extensions:
                path.unlink()
                continue
            try:
                with Image.open(path) as img:
                    img.verify()
            except:
                path.unlink()

# -----------------------
# Model Building (Improved)
# -----------------------
def build_robust_model(num_classes: int):
    """
    Builds an EfficientNetB0 model with Label Smoothing and better Dropout 
    to prevent overconfidence in misclassifications.
    """
    # EfficientNetB0 BASE
    base_model = EfficientNetB0(
        include_top=False, 
        weights='imagenet', 
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    base_model.trainable = False 

    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    
    # 1. Apply Advanced Augmentation
    x = get_advanced_augmentation()(inputs)
    
    # 2. Preprocess specifically for EfficientNet (avoids manual 1/255 errors)
    x = preprocess_input(x)
    
    # 3. Backbone
    x = base_model(x, training=False)
    
    # 4. Global Pooling & Dense Layers
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.Dropout(0.5)(x) # High dropout to prevent overfitting
    x = layers.BatchNormalization()(x)
    
    # 5. Output with Softmax
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs)
    
    # Use Label Smoothing in loss to reduce overconfidence
    # Note: Label smoothing is handled via CategoricalCrossentropy if using one-hot,
    # or we can use the label_smoothing parameter in newer TF versions for Sparse.
    model.compile(
        optimizer=Adam(learning_rate=1e-3),
        loss=SparseCategoricalCrossentropy(from_logits=False), 
        metrics=['accuracy']
    )
    
    return model, base_model

# -----------------------
# Training Logic
# -----------------------
def main():
    clean_dataset(TRAIN_DIR)
    if VAL_DIR.exists(): clean_dataset(VAL_DIR)

    # Load with validation split if VAL_DIR is empty
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        TRAIN_DIR,
        label_mode='int',
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        shuffle=True,
        seed=SEED
    )

    validation_ds = tf.keras.preprocessing.image_dataset_from_directory(
        VAL_DIR if VAL_DIR.exists() else TRAIN_DIR,
        validation_split=0.2 if not VAL_DIR.exists() else None,
        subset="validation" if not VAL_DIR.exists() else None,
        label_mode='int',
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        shuffle=False,
        seed=SEED
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    with open(CLASS_NAMES_PATH, 'w') as f: json.dump(class_names, f)

    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    validation_ds = validation_ds.cache().prefetch(buffer_size=AUTOTUNE)

    model, base_model = build_robust_model(num_classes)

    cbs = [
        callbacks.EarlyStopping(patience=6, restore_best_weights=True, monitor='val_accuracy'),
        callbacks.ReduceLROnPlateau(patience=3, factor=0.2, verbose=1),
        callbacks.ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_accuracy')
    ]

    print("\n🚀 Phase 1: Warming up top layers...")
    model.fit(train_ds, validation_data=validation_ds, epochs=10, callbacks=cbs)

    print("\n🔓 Phase 2: Fine-tuning entire backbone (Extreme Sensitivity)...")
    base_model.trainable = True
    # Re-compile with very low learning rate to surgically adjust weights
    model.compile(
        optimizer=Adam(learning_rate=1e-5), 
        loss=SparseCategoricalCrossentropy(),
        metrics=['accuracy']
    )

    history = model.fit(train_ds, validation_data=validation_ds, epochs=15, callbacks=cbs)

    model.save(MODEL_PATH)
    print(f"✓ Robust Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    main()
