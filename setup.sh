#!/bin/bash

# Crop Disease Detector - Auto Setup Script (macOS/Linux)

echo ""
echo "===================================="
echo "Crop Disease Detector - Setup Script"
echo "===================================="
echo ""

# Check Python
echo "[1/4] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 not found. Please install Python 3.8+"
    exit 1
fi
echo "✓ Python found"

# Check Node.js
echo "[2/4] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install Node.js 16+"
    exit 1
fi
echo "✓ Node.js found"

# Create virtual environment
echo "[3/4] Setting up Python environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate and install
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
echo "✓ Python dependencies installed"

# Install frontend
echo "[4/4] Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install > /dev/null 2>&1
    echo "✓ Frontend dependencies installed"
else
    echo "✓ Frontend dependencies already exist"
fi
cd ..

echo ""
echo "===================================="
echo "Setup Complete!"
echo "===================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
