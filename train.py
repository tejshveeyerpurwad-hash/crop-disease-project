import os
import json
from pathlib import Path
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras import layers, callbacks, models
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import SparseCategoricalCrossentropy

# -----------------------
# Configuration
# -----------------------
BASE_DIR = Path(__file__).resolve().parent
TRAIN_DIR = BASE_DIR / 'dataset' / 'train'
VAL_DIR = BASE_DIR / 'dataset' / 'validation'
MODEL_DIR = BASE_DIR / 'backend' / 'app' / 'services' / 'model_weights'
MODEL_DIR.mkdir(parents=True, exist_ok=True)
MODEL_PATH = MODEL_DIR / 'crop_model.h5'
CLASS_NAMES_PATH = MODEL_DIR / 'class_names.json'
IMG_SIZE = 224
BATCH_SIZE = 32
SEED = 123
INITIAL_EPOCHS = 12
FINE_TUNE_EPOCHS = 12
TOTAL_EPOCHS = INITIAL_EPOCHS + FINE_TUNE_EPOCHS

VALID_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp'}


# -----------------------
# Data cleaning helpers
# -----------------------
def is_image_file(path: Path) -> bool:
    return path.suffix.lower() in VALID_IMAGE_EXTENSIONS


def clean_directory(root_dir: Path):
    print(f'Cleaning dataset directory: {root_dir}')
    if not root_dir.exists():
        return

    for path in root_dir.rglob('*'):
        if path.is_dir():
            continue

        if not is_image_file(path):
            print(f'  Removing non-image file: {path.relative_to(BASE_DIR)}')
            path.unlink()
            continue

        try:
            with Image.open(path) as image_obj:
                image_obj.verify()
        except Exception:
            print(f'  Removing corrupted image: {path.relative_to(BASE_DIR)}')
            path.unlink()


# -----------------------
# Data pipeline helpers
# -----------------------
def build_datasets(train_dir: Path, val_dir: Path):
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        str(train_dir),
        labels='inferred',
        label_mode='int',
        batch_size=BATCH_SIZE,
        image_size=(IMG_SIZE, IMG_SIZE),
        shuffle=True,
        seed=SEED,
    )

    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        str(val_dir),
        labels='inferred',
        label_mode='int',
        batch_size=BATCH_SIZE,
        image_size=(IMG_SIZE, IMG_SIZE),
        shuffle=False,
        seed=SEED,
    )

    class_names = train_ds.class_names
    print('Detected classes:', class_names)
    return train_ds, val_ds, class_names


def compute_class_weights(train_dir: Path, class_names):
    counts = {}
    for idx, class_name in enumerate(class_names):
        class_dir = train_dir / class_name
        if class_dir.exists():
            counts[idx] = sum(1 for path in class_dir.iterdir() if path.is_file() and is_image_file(path))
        else:
            counts[idx] = 0

    total = sum(counts.values())
    class_weight = {
        idx: (total / (len(class_names) * count)) if count > 0 else 1.0
        for idx, count in counts.items()
    }
    print('Class counts:', counts)
    print('Computed class weights:', class_weight)
    return class_weight


def build_model(num_classes: int):
    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))

    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip('horizontal'),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.15),
    ], name='data_augmentation')

    x = data_augmentation(inputs)
    x = layers.Rescaling(1.0 / 255)(x)

    base_model = EfficientNetB0(
        include_top=False,
        weights='imagenet',
        input_tensor=x,
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        pooling='avg'
    )
    base_model.trainable = False

    x = base_model.output
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation='swish')(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs, name='crop_disease_detector')
    model.compile(
        optimizer=Adam(learning_rate=2e-4),
        loss=SparseCategoricalCrossentropy(),
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')],
    )
    return model, base_model


# -----------------------
# Training and evaluation
# -----------------------
def evaluate_model(model, val_ds, class_names):
    print('\nEvaluating on validation set...')
    y_true = []
    y_pred = []

    for images, labels in val_ds:
        preds = model.predict(images, verbose=0)
        y_pred.extend(np.argmax(preds, axis=1).tolist())
        y_true.extend(labels.numpy().tolist())

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    accuracy = np.mean(y_true == y_pred)
    print(f'Validation accuracy: {accuracy:.4f}')

    try:
        from sklearn.metrics import classification_report, confusion_matrix
        print('\nClassification report:')
        print(classification_report(y_true, y_pred, target_names=class_names, digits=4))
        print('Confusion matrix:')
        print(confusion_matrix(y_true, y_pred))
    except ImportError:
        print('sklearn is not installed. Install scikit-learn to print full classification metrics.')


def main():
    clean_directory(TRAIN_DIR)
    clean_directory(VAL_DIR)

    train_ds, val_ds, class_names = build_datasets(TRAIN_DIR, VAL_DIR)
    class_weight = compute_class_weights(TRAIN_DIR, class_names)

    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    model, base_model = build_model(num_classes=len(class_names))

    checkpoint_cb = callbacks.ModelCheckpoint(
        filepath=str(MODEL_PATH),
        monitor='val_accuracy',
        save_best_only=True,
        save_weights_only=False,
        verbose=1,
    )
    early_stopping_cb = callbacks.EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1,
    )
    reduce_lr_cb = callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-6,
        verbose=1,
    )

    print('\nStarting initial training with frozen backbone...')
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=INITIAL_EPOCHS,
        callbacks=[checkpoint_cb, early_stopping_cb, reduce_lr_cb],
        class_weight=class_weight,
    )

    print('\nStarting fine-tuning...')
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=Adam(learning_rate=1e-5),
        loss=SparseCategoricalCrossentropy(),
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')],
    )

    history_fine = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=TOTAL_EPOCHS,
        initial_epoch=history.epoch[-1] + 1,
        callbacks=[checkpoint_cb, early_stopping_cb, reduce_lr_cb],
        class_weight=class_weight,
    )

    model.save(str(MODEL_PATH))
    print(f'✔ Model saved to {MODEL_PATH}')

    with open(CLASS_NAMES_PATH, 'w', encoding='utf-8') as f:
        json.dump(class_names, f, indent=2)
    print(f'✔ Class names saved to {CLASS_NAMES_PATH}')

    evaluate_model(model, val_ds, class_names)


if __name__ == '__main__':
    main()
