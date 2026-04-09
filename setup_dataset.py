import os
from pathlib import Path

def setup_structure():
    base_path = Path('dataset')
    splits = ['train', 'validation']
    
    # PlantVillage standard naming convention: Crop___Disease
    classes = [
        'Potato___Early_blight',
        'Potato___Late_blight',
        'Potato___healthy',
        'Tomato___Bacterial_spot',
        'Tomato___Leaf_Mold',
        'Tomato___healthy'
    ]
    
    print(f"📁 Creating dataset structure in '{base_path}'...")
    
    for split in splits:
        for cls in classes:
            path = base_path / split / cls
            path.mkdir(parents=True, exist_ok=True)
            # Create a placeholder .gitkeep to ensure empty dirs are tracked if needed
            (path / '.gitkeep').touch()
            
    print("\n✅ Structure created successfully!")
    print("\nNext Steps:")
    print("1. Download the PlantVillage dataset.")
    print("2. Move images into their respective folders:")
    print("   Example: Move early blight potato images to 'dataset/train/Potato___Early_blight'")
    print("3. Run 'python train.py' to start training.")

if __name__ == "__main__":
    setup_structure()
