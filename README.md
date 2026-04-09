# 🌱 AgriSmart AI - Advanced Crop Disease Detector

An enterprise-grade, highly scalable platform for detecting crop diseases in real-time, built for farmers and agricultural experts. It leverages Transfer Learning (EfficientNet/ResNet) and provides Explainable AI features with a modern Hackathon-winning UI.

## 🌟 Key Features

- **Advanced AI Diagnostics:** Uses deep learning for multi-class classification across various crops (Tomato, Potato, Corn, etc.).
- **Explainable AI (Grad-CAM):** View exact visual heatmaps of the diseased parts of the leaf for maximum diagnostic confidence.
- **Farmer Recommendation System:** In-depth treatment plans and fertilization strategies instantly generated alongside predictions.
- **Real-Time Analytics:** WebSockets power real-time updates and notifications during AI processing without page reloads.
- **Secure Architecture:** Complete authentication system (JWT), role-based access, and robust data isolation.
- **Rich Dashboard UI:** Lightning fast dynamic React UI styled with Tailwind CSS, supporting interactive drag-and-drop.
- **History Tracker:** A comprehensive dashboard to revisit previous analyses and track crop health history over time.

## 🛠 Tech Stack

### 🚀 Backend
- **FastAPI:** Lightning fast Python backend framework.
- **TensorFlow/Keras:** For powering deep learning inferences.
- **SQLAlchemy:** For scalable database migrations and ORM.
- **OpenCV & Pillow:** For image manipulation and heatmap generations.

### 🎨 Frontend
- **React (Vite):** Blazing fast frontend.
- **Tailwind CSS:** Modern utility-first styling system.
- **Framer Motion:** High-quality component micro-animations.
- **React Router & Context API:** For routing and global state management.

### 🐳 Deployment
- **Docker & Docker Compose:** Containerized solution for one-click deployment to any VPS or cloud (Render/Railway).

## 🚀 Setup Instructions

### 1️⃣ Clone and Prepare
```bash
git clone https://github.com/yourusername/crop-disease-project.git
cd crop-disease-project
```

### 2️⃣ Run with Docker (Recommended)
You can launch the full system immediately:
```bash
docker-compose up --build
```
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### ✨ Manual Local Setup

#### Backend setup:
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend setup:
```bash
cd frontend
npm install
npm run dev
```

## 📚 API Endpoints
- `POST /api/v1/predict/` : Process imagery and return AI inferences based on TF weights.
- `GET /api/v1/history/` : Retreive a user's previous requests and diagnostic records.
- `POST /api/v1/auth/login` : Return a Bearer authentication token.
- `POST /api/v1/auth/register` : Creates a new farmer account.
- `WS /api/v1/ws/status` : Real-time pipeline status and pinging system.

---

> Built with ❤️ for Global Hackathons and Future Farmers.
