# 🛡️ Sentinel AI - Advanced Neural Surveillance

Sentinel AI is a high-performance, real-time AI surveillance platform designed for modern security needs. It leverages state-of-the-art computer vision models to provide object detection, human presence monitoring, and security alerts across multiple video streams.

![Sentinel AI Dashboard](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070)

## 🚀 Key Features

- **Real-time Neural Processing**: Powered by YOLOv8 for sub-millisecond object detection.
- **Multi-Stream Orchestration**: Parallel processing of multiple video sources (Webcams/RTSP/Static) using a dedicated background thread system.
- **Live Monitoring Dashboard**: High-fidelity UI built with Next.js 14 and Tailwind CSS featuring dynamic AI overlays and scanline effects.
- **Intelligent Alerting System**: Automatic detection of unauthorized person presence with high-severity logging and visual alerts.
- **Cyber-Aesthetic UI**: Modern, dark-mode interface with glassmorphism and micro-animations.
- **Scalable Architecture**: Fully containerized with Docker, optimized for low-latency streaming.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript, Framer Motion, Lucide Icons.
- **Backend**: FastAPI (Python 3.11), SQLAlchemy, Pydantic, WebSockets.
- **AI/ML Engine**: PyTorch, Ultralytics YOLOv8, PyTorchVideo (Experimental Action Recognition).
- **Data Stores**: PostgreSQL (Persistence), Redis (Task Queueing/Cache).
- **Infrastructure**: Docker Compose, Nginx (Reverse Proxy).

---

## 🏁 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose
- (Optional) NVIDIA GPU with CUDA support for accelerated inference.

### ⚙️ Quick Start (Docker)

1. **Clone & Enter**
   ```bash
   git clone https://github.com/vashishth-182/SENTINEL.git
   cd sentinel-ai
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update NEXTAUTH_SECRET and SECRET_KEY in .env
   ```

3. **Launch Stack**
   ```bash
   docker-compose up --build
   ```

4. **Access**
   - **Main UI**: [http://localhost:3000](http://localhost:3000)
   - **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 👨‍💻 Local Development Setup

If you want to run the components individually without Docker:

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
python setup_database.py  # Interactive DB setup
python seed_user.py       # Create admin@sentinel.ai / admin123
python main.py            # Start FastAPI server
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ System Architecture

Sentinel AI follows a decoupled architecture pattern:

1. **Neural Orchestrator**: A dedicated thread pool in the backend that manages individual OpenCV captures for each active stream.
2. **Inference pipeline**: Frames are passed through the YOLOv8 engine every N frames to optimize CPU usage while maintaining tracking accuracy.
3. **Observation Loop**: Detection events are committed to PostgreSQL and broadcasted via WebSockets for real-time UI updates.
4. **Proxy Layer**: Nginx acts as the unified entry point, routing traffic between the Next.js frontend and the Python backend.

---

## 📁 Project Structure

```text
sentinel-ai/
├── backend/            # FastAPI Intelligence Layer
│   ├── api/            # Route controllers & WebSockets
│   ├── core/           # Configuration & DB setup
│   ├── models/         # SQLAlchemy DB Models
│   ├── services/       # YOLO Detection & Video Processing
│   └── ai_worker.py    # Multi-threaded orchestrator
├── frontend/           # Next.js 14 Dashboard
│   ├── app/            # App router & pages
│   ├── components/     # UI & Video Feed components
│   └── lib/            # Utility functions
├── nginx/              # Reverse Proxy configuration
└── docker-compose.yml  # Orchestration manifest
```

## 🧠 Model Configuration

You can tune the AI behavior via `.env` or the Dashboard Settings:
- `DETECTION_THRESHOLD`: Confidence floor (default: 0.5).
- `PROCESS_EVERY_N_FRAME`: Speed/Accuracy tradeoff (default: 5).
- `ALERT_COOLDOWN`: Seconds between successive alerts for the same object (default: 30).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

Built with ❤️ by [Vashishth](https://github.com/vashishth-182)
