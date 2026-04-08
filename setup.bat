@echo off
REM Crop Disease Detector - Auto Setup Script (Windows)

echo.
echo ====================================
echo Crop Disease Detector - Setup Script
echo ====================================
echo.

REM Check Python
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    pause
    exit /b 1
)
echo ✓ Python found

REM Check Node.js
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Create virtual environment
echo [3/4] Setting up Python environment...
if not exist venv (
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

REM Activate and install
call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1
echo ✓ Python dependencies installed

REM Install frontend
echo [4/4] Setting up frontend...
cd frontend
if not exist node_modules (
    npm install >nul 2>&1
    echo ✓ Frontend dependencies installed
) else (
    echo ✓ Frontend dependencies already exist
)
cd ..

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   python main.py
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
