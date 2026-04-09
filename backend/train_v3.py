import os
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.applications import EfficientNetB0
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
import json

# --- CONFIGURATION ---
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 25
DATA_DIR = "data/dataset" # Expected path to organized PlantVillage + Background classes
MODEL_SAVE_PATH = "app/services/model_weights/crop_model_v3.h5"
CLASS_NAMES_PATH = "app/services/model_weights/class_names.json"

def build_model(num_classes):
    """
    Builds a high-accuracy classifier using EfficientNetB0 as the backbone.
    """
    base_model = EfficientNetB0(include_top=False, weights='imagenet', input_shape=(IMG_SIZE, IMG_SIZE, 3))
    base_model.trainable = False # Start with frozen base

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.4),
        layers.Dense(num_classes, activation='softmax')
    ])

    return model

def train():
    if not os.path.exists(DATA_DIR):
        print(f"❌ Error: Dataset directory {DATA_DIR} not found.")
        print("Please ensure your data is organized into subfolders by class name.")
        return

    # 1. Load Data with Augmentation
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        label_mode='categorical'
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        label_mode='categorical'
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    
    # Save class names for inference
    os.makedirs(os.path.dirname(CLASS_NAMES_PATH), exist_ok=True)
    with open(CLASS_NAMES_PATH, 'w') as f:
        json.dump(class_names, f)

    # 2. Augmentation Layer
    data_augmentation = models.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.1),
    ])

    # 3. Model Prep
    model = build_model(num_classes)
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # 4. Callbacks
    early_stop = callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    reduce_lr = callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-6)
    checkpoint = callbacks.ModelCheckpoint(MODEL_SAVE_PATH, monitor='val_accuracy', save_best_only=True)

    # 5. Training
    print(f"🚀 Starting training for {num_classes} classes: {class_names}")
    history = model.fit(
        train_ds.map(lambda x, y: (data_augmentation(x), y)),
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=[early_stop, reduce_lr, checkpoint]
    )

    # 6. Final Fine-tuning (Optional but recommended)
    print("🔄 Fine-tuning the top layers of EfficientNet...")
    model.layers[0].trainable = True
    # Freeze all but the last 20 layers
    for layer in model.layers[0].layers[:-20]:
        layer.trainable = False
        
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    model.fit(
        train_ds.map(lambda x, y: (data_augmentation(x), y)),
        validation_data=val_ds,
        epochs=5,
        callbacks=[early_stop, checkpoint]
    )

    print(f"✅ Training complete. Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train()
