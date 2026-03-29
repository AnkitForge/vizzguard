# Use Python 3.12 Slim for a smaller image
FROM python:3.12-slim

# Install system dependencies for OpenCV and AI libraries
# libgl1-mesa-glx: Required for OpenCV
# libglib2.0-0: Required for YOLO and others
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
# This ensures best.pt and violence_lstm_model.h5 are packaged in the image
COPY edge/ /app/edge/

# Set environment variables
ENV PYTHONPATH="/app/backend:/app/edge:${PYTHONPATH}"
ENV PYTHONUNBUFFERED=1

# Change directory to backend to run app.py
WORKDIR /app/backend

# Use the dynamic PORT provided by Render
EXPOSE 8000
CMD ["python", "app.py"]
