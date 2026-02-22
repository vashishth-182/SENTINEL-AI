# 📟 Sentinel AI - Frontend Dashboard

This is the Next.js 14 frontend for the **Sentinel AI** platform. It provides a real-time monitoring dashboard with live AI overlays, camera management, and security alerts.

## 🚀 Key Modules

- **App Router (`/app`)**: Modern layouts for Dashboard, Analytics, and Settings.
- **Neural Components (`/components/video`)**: Custom video players with Canvas overlays for AI bounding boxes.
- **API Client (`/lib/api.ts`)**: Axios-based communication with the FastAPI backend.
- **WebSocket Hooks**: Real-time detection state management.

## 🛠️ Tech Stack

- **Next.js 14** (TypeScript)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide Icons**
- **SWR / Axios** (Data Fetching)

## 🏁 Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment**:
   Ensure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` are set in your `.env` (pointing to the backend).

3. **Run development server**:
   ```bash
   npm run dev
   ```

---

*For full project setup instructions, please refer to the [Root README](../README.md).*
