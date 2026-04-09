# AI Strategy: AgriPro Neural Core Rebuild

This document outlines the engineering steps to fix the model bias, improve accuracy, and implement the "Not a Leaf" detection layer.

## 1. Unified Dataset Construction
We will rebuild the dataset directory structure as follows:
- `data/train/`
    - `Healthy/`
    - `Potato_Early_Blight/`
    - `Potato_Late_Blight/`
    - `Tomato_Diseased/`
    - `Invalid_Not_A_Leaf/` (Images of tractors, tools, soil, etc.)

## 2. Advanced Training Pipeline (`train_v3.py`)
- **Transfer Learning**: Using `EfficientNetB0` for superior feature extraction with fewer parameters than ResNet.
- **Top Layers**:
    - `GlobalAveragePooling2D` to reduce spatial dimensions.
    - `Dense(256)` with `'relu'` and `BatchNormalization`.
    - `Dropout(0.4)` to minimize overfitting.
    - `Softmax` output for multi-label stability.
- **Data Augmentation**: 
    - `RandomFlip("horizontal_and_vertical")`
    - `RandomRotation(0.2)`
    - `RandomContrast(0.1)`

## 3. High-Integrity Inference (`ml_service.py`)
- **Class Filtering**:
    - If the top class is `Invalid_Not_A_Leaf`, return an "Invalid Image" response immediately.
- **Confidence Guard**:
    - If top prediction `confidence < 0.75`, return "Uncertain Result" and advise a clearer photo.
- **Removal of Fallbacks**:
    - Any "default to Early Blight" logic will be scrubbed to ensure the model's authentic output is provided.

## 4. UI/UX Synchronization
- The frontend will be updated to handle "Invalid Image" and "Low Confidence" states with specific instructions for the farmer.
