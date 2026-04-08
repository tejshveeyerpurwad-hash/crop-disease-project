# Setup & Running Guide

## Quick Start (5 minutes)

### Terminal 1 - Backend
```bash
# From project root
python -m venv venv
venv\Scripts\activate  # Windows; macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Open browser to `http://localhost:3000`

## What's Reactive?

### Backend Improvements
- **FastAPI** instead of Flask (async by default)
- **Async/await** for non-blocking operations
- **WebSockets** for real-time bidirectional communication
- **Concurrent request handling** without threading complexity
- **Automatic async file I/O** with aiofiles

### Frontend Improvements
- **React Hooks** for reactive state management
- **WebSocket client** for live server updates
- **Real-time activity stream** showing all events
- **Drag-and-drop** with visual feedback
- **Live status indicator** for server connection
- **Instant result display** via WebSocket push
- **Responsive animations** for smooth UX

## Key Features

✅ **Real-time WebSocket Connection** - See updates as they happen
✅ **Non-blocking Server** - Handle multiple uploads simultaneously
✅ **Live Activity Feed** - Track every operation
✅ **Instant Results** - Server pushes predictions to client
✅ **Beautiful UI** - Modern gradients and smooth animations
✅ **Full Responsiveness** - Works on mobile too

## Architecture

```
Browser (React)
    ↓
WebSocket (Real-time)
    ↓
FastAPI (Async)
    ↓
TensorFlow (AI Model)
```

All communication is event-driven and non-blocking!
