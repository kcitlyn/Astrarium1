#!/bin/bash

echo "========================================"
echo "Astrarium Installation Script"
echo "========================================"
echo ""

echo "[1/3] Installing frontend dependencies..."
cd Astrarium_Frontend
pnpm install
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend installation failed"
    exit 1
fi

echo ""
echo "[2/3] Setting up Python virtual environment..."
cd ../Astrarium_Backend
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Virtual environment creation failed"
    exit 1
fi

echo ""
echo "[3/3] Installing backend dependencies..."
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Backend installation failed"
    exit 1
fi

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "IMPORTANT: Before running, create Astrarium_Backend/.env with:"
echo "  OPENAI_API_KEY=your_key_here"
echo "  DATABASE_URL=sqlite:///./astral_pet.db"
echo "  ALLOWED_ORIGINS=http://localhost:3000"
echo ""
echo "To start the app:"
echo "  1. Terminal 1: cd Astrarium_Backend"
echo "                 source venv/bin/activate"
echo "                 uvicorn app.main:app --reload --port 8000"
echo "  2. Terminal 2: cd Astrarium_Frontend"
echo "                 pnpm dev"
echo "  3. Open: http://localhost:3000"
echo ""
