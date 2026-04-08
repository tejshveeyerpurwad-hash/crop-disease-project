
# 🌾 Crop Disease Detector - Reactive Application

A modern, fully reactive web application for crop disease detection using AI/ML with real-time WebSocket communication.

## Features

### Backend (FastAPI)
- ✅ **Async/Await Architecture** - Non-blocking I/O operations
- ✅ **WebSocket Support** - Real-time updates and live status
- ✅ **Async File Handling** - Fast file uploads without blocking
- ✅ **TensorFlow Integration** - AI-powered predictions
- ✅ **CORS Enabled** - Cross-origin requests for frontend
- ✅ **Health Checks** - Endpoint monitoring

### Frontend (React + Vite)
- ✅ **Real-time WebSocket Connection** - Live server updates
- ✅ **Drag-and-Drop Upload** - User-friendly image selection
- ✅ **Live Activity Stream** - See all operations in real-time
- ✅ **Instant Feedback** - Immediate visual response
- ✅ **Modern UI** - Gradient backgrounds, smooth animations
- ✅ **Responsive Design** - Works on all devices
- ✅ **Status Indicator** - Connection status monitoring

## Project Structure

```
crop-disease-project/
├── main.py                 # FastAPI backend (async)
├── train.py               # Model training script
├── requirements.txt       # Python dependencies
├── model/
│   └── crop_model.h5     # Trained TensorFlow model
├── uploads/              # User uploaded images
├── frontend/             # React application
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── components/
│           ├── ImageUploader.jsx
│           ├── ResultDisplay.jsx
│           └── StatusIndicator.jsx
└── dataset/              # Training data
```

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to project directory
cd crop-disease-project

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Return to root
cd ..
```

## Running the Application

### Start Backend (Async FastAPI Server)

```bash
# From project root
python main.py
```

Backend will run on: `http://localhost:8000`
- API Docs available at: `http://localhost:8000/docs`
- WebSocket endpoint: `ws://localhost:8000/ws`

### Start Frontend (React + Vite)

```bash
# From frontend directory
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

### For Production Build

```bash
# Frontend
cd frontend
npm run build

# This creates optimized static files in frontend/dist/
```

## API Endpoints

### REST Endpoints

#### Health Check
```
GET /health
Response: { "status": "healthy", "model_loaded": true, ... }
```

#### Predict Image
```
POST /predict
Content-Type: multipart/form-data
Body: { "file": <image_file> }

Response: {
  "prediction": "Healthy" | "Diseased",
  "confidence": 0.95,
  "file_id": "uuid",
  "filename": "image.jpg",
  "upload_time": "2024-01-20T10:30:00",
  "image_path": "/uploads/uuid.jpg"
}
```

#### Get Uploaded Image
```
GET /uploads/{file_path}
Response: <image_file>
```

### WebSocket Endpoint

```
WS /ws
```

**Message Types:**

1. **Status Update**
```json
{
  "type": "status",
  "message": "Processing: image.jpg",
  "timestamp": "2024-01-20T10:30:00"
}
```

2. **Upload Complete**
```json
{
  "type": "upload_complete",
  "filename": "image.jpg",
  "timestamp": "2024-01-20T10:30:01"
}
```

3. **Prediction Complete**
```json
{
  "type": "prediction_complete",
  "data": { ...prediction_data... },
  "timestamp": "2024-01-20T10:30:02"
}
```

4. **Error**
```json
{
  "type": "error",
  "data": { "error": "Message..." },
  "timestamp": "2024-01-20T10:30:00"
}
```

## How It Works

### User Flow

1. **Upload Image** → User drags/drops or selects image
2. **WebSocket Connected** → Real-time connection established
3. **File Uploaded** → Async file handling (non-blocking)
4. **Status Updates** → Live progress via WebSocket
5. **Prediction Made** → AI model analyzes image
6. **Results Displayed** → Real-time result display with confidence
7. **History Tracked** → All events logged in activity stream

### Reactive Features

- **Drag-and-Drop**: Instant visual feedback
- **Live Progress**: See every step via WebSocket
- **Async Processing**: Non-blocking server
- **Real-time Status**: Connection indicator always visible
- **Instant Results**: Results push to client via WebSocket
- **Activity Stream**: See all operations in real-time

## Performance Features

✨ **Why it's Reactive:**
- FastAPI's async capabilities handle multiple requests simultaneously
- WebSocket for low-latency bidirectional communication
- React hooks for efficient state management
- Vite for lightning-fast frontend builds
- Non-blocking file I/O with aiofiles
- Event-driven architecture

## Training Models

To train a new model:

```bash
# Ensure dataset is in dataset/train and dataset/validation

python train.py
# Model will be saved as model/crop_model.h5
```

## Troubleshooting

### Issue: "Model not found"
- Ensure `model/crop_model.h5` exists
- Run `python train.py` first

### Issue: WebSocket connection fails
- Check if backend is running on port 8000
- Verify CORS settings in `main.py`

### Issue: Port already in use
```bash
# Kill process on port 8000:
# Windows: netstat -ano | findstr :8000
# macOS/Linux: lsof -i :8000
```

### Issue: Frontend not loading
- Ensure `npm install` completed successfully
- Check Node.js version (requires 16+)

## Dependencies

### Backend
- FastAPI - Web framework
- Uvicorn - ASGI server
- TensorFlow - ML model
- aiofiles - Async file handling
- python-socketio - WebSocket support

### Frontend
- React 18 - UI library
- Vite - Build tool
- Axios - HTTP client

## License

This project is open source.

## Future Enhancements

- [ ] Database integration for result history
- [ ] User authentication
- [ ] Batch image processing
- [ ] Model comparison
- [ ] Docker containerization
- [ ] Real-time analytics dashboard
- [ ] Mobile app
