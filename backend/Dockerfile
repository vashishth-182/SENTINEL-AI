FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV and building python packages
# standard OpenCV dependencies for slim images
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Assume Uvicorn runs via command in docker-compose, but provide default here
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
