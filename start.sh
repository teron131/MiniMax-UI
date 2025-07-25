#!/bin/bash

# MiniMax UI Backend Startup Script
echo "Starting MiniMax UI Backend..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Virtual environment not found. Running uv sync..."
    uv sync
fi

# Activate virtual environment and start the server
echo "Starting FastAPI server on http://localhost:8001"
uv run python -m backend.app 