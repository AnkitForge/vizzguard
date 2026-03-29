# 🛡️ Sentinel Omni: Azure-Optimized AI Engine
# Use Python 3.12-slim for a smaller and more secure image
FROM python:3.12-slim

# Install system dependencies for OpenCV and AI libraries
# libgl1 and libglib2 are required for Computer Vision (YOLO/Mediapipe)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory to /app
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ /app/backend/

# Copy the edge AI core and models
# This packages the YOLO models (best.pt) and LSTM within the container.
COPY edge/ /app/edge/

# ── Azure-Specific Memory Optimizations ──
# MALLOC_ARENA_MAX reduces memory fragmentation for long-running AI containers
ENV MALLOC_ARENA_MAX=2
# PYTHONPATH ensures Python finds both backend and edge modules
ENV PYTHONPATH="/app/backend:/app/edge:${PYTHONPATH}"
ENV PYTHONUNBUFFERED=1

# Change directory to backend to run app.py
WORKDIR /app/backend

# Azure Container Apps uses PORT 8000 by default in our app, but it is dynamic
EXPOSE 8000
CMD ["python", "app.py"]
