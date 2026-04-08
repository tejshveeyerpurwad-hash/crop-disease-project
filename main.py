from fastapi import FastAPI, WebSocket, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import asyncio
import json
from pathlib import Path
import aiofiles
from datetime import datetime
import uuid
from PIL import Image
import numpy as np

app = FastAPI(title="Crop Disease Detector API")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None

# Try to load model if available
def load_model():
    global model
    try:
        import tensorflow as tf
        if os.path.exists("model/crop_model.h5"):
            model = tf.keras.models.load_model("model/crop_model.h5")
            print("✓ Model loaded successfully")
        else:
            print("⚠ Model not found - using demo mode")
            model = None
    except Exception as e:
        print(f"⚠ Could not load model: {e}")
        model = None

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class ConnectionManager:
    """Manages WebSocket connections"""
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"✓ Client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"✓ Client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending message: {e}")

manager = ConnectionManager()

async def predict_async(img_path: str) -> dict:
    """Async prediction - works with or without model"""
    try:
        # Load image
        img = Image.open(img_path)
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        if model is not None:
            # Use real model
            import tensorflow as tf
            pred = model.predict(img_array, verbose=0)
            confidence = float(np.max(pred))
            prediction = "Healthy" if np.argmax(pred) == 0 else "Diseased"
        else:
            # Demo prediction (random but consistent)
            import hashlib
            hash_val = int(hashlib.md5(img_array.tobytes()).hexdigest(), 16)
            confidence = 0.75 + (hash_val % 20) / 100
            prediction = "Healthy" if hash_val % 2 == 0 else "Diseased"

        return {
            "prediction": prediction,
            "confidence": confidence
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"prediction": "Error", "confidence": 0.0}

@app.on_event("startup")
async def startup():
    """Initialize on startup"""
    load_model()
    print("🌾 Crop Disease Detector API Started")

@app.get("/")
async def read_root():
    """API info endpoint"""
    return {
        "message": "🌾 Crop Disease Detector API",
        "version": "2.0 - Reactive",
        "model_loaded": model is not None,
        "endpoints": {
            "websocket": "ws://localhost:8000/ws",
            "predict": "POST /predict",
            "health": "GET /health",
            "api_docs": "http://localhost:8000/docs"
        }
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            # Echo status back
            await manager.broadcast({
                "type": "status",
                "message": f"Ready to process: {message.get('filename', 'image')}",
                "timestamp": datetime.now().isoformat()
            })
    except Exception as e:
        manager.disconnect(websocket)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Async prediction endpoint"""
    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())[:8]
        file_extension = Path(file.filename).suffix
        save_path = os.path.join(UPLOAD_FOLDER, f"{file_id}{file_extension}")

        # Save file
        contents = await file.read()
        async with aiofiles.open(save_path, 'wb') as f:
            await f.write(contents)

        # Broadcast upload complete
        await manager.broadcast({
            "type": "upload_complete",
            "filename": file.filename,
            "timestamp": datetime.now().isoformat()
        })

        # Run prediction in thread to avoid blocking
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, asyncio.run, predict_async(save_path))

        # Add metadata
        result.update({
            "file_id": file_id,
            "filename": file.filename,
            "upload_time": datetime.now().isoformat(),
            "image_path": f"/uploads/{file_id}{file_extension}"
        })

        # Broadcast prediction complete
        await manager.broadcast({
            "type": "prediction_complete",
            "data": result,
            "timestamp": datetime.now().isoformat()
        })

        return result

    except Exception as e:
        error_msg = {
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        await manager.broadcast({
            "type": "error",
            "data": error_msg
        })
        return error_msg

@app.get("/uploads/{file_path:path}")
async def get_upload(file_path: str):
    """Serve uploaded files"""
    file_full_path = os.path.join(UPLOAD_FOLDER, file_path)
    if os.path.exists(file_full_path):
        return FileResponse(file_full_path)
    return {"error": "File not found"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "🟢 healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...\n")
    load_model()
    uvicorn.run(app, host="0.0.0.0", port=8000)
