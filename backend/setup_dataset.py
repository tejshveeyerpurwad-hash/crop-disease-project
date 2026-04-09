import os
import shutil
import random

# Base dataset directory
BASE_DATA_DIR = "data/dataset"

# Classes we want
CLASSES = [
    "Healthy",
    "Potato_Early_Blight",
    "Potato_Late_Blight",
    "Tomato_Healthy",
    "Tomato_Diseased",
    "Invalid_Not_A_Leaf"
]

def prepare_dummy_data():
    """
    Creates a skeleton directory structure for the student to fill with actual images.
    If images are already in a standard PlantVillage format, this script can be modified 
    to move them into the clean unified structure.
    """
    os.makedirs(BASE_DATA_DIR, exist_ok=True)
    
    for cls in CLASSES:
        cls_path = os.path.join(BASE_DATA_DIR, cls)
        os.makedirs(cls_path, exist_ok=True)
        print(f"📁 Created folder: {cls_path}")
        
    print("\n✅ Dataset structure ready.")
    print("👉 ACTION: Place your PlantVillage leaf images into the respective folders.")
    print("👉 ACTION: Place non-leaf images (tractors, tools, etc.) into 'Invalid_Not_A_Leaf'.")
    print("👉 Then run: python train_v3.py")

if __name__ == "__main__":
    prepare_dummy_data()
