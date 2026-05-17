# Rekrutrek — Platform Rekrutmen UMKM & Korporat
**Capstone Project CC26-PSU370 | Coding Camp 2026 × DBS Foundation**

## Tech Stack
| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Express.js + PostgreSQL (via `pg`) |
| AI Service | FastAPI (tim AI Engineer) |
| Peta | Leaflet + OpenStreetMap |
| Deployment | Vercel (client) + Render (server) + Supabase (DB) |

## Struktur Folder
```
rekrutrek/
├── client/          # Frontend React + Vite
├── server/          # Backend Express.js
└── ai-service/      # FastAPI (tim AI — repo terpisah)
```

## Quick Start

### 1. Clone & Setup
```bash
git clone <repo-url>
cd rekrutrek
```

### 2. Backend
```bash
cd server
cp .env.example .env   # ← isi DATABASE_URL, JWT_SECRET, dll
npm install
npm run db:init        # jalankan init.sql ke PostgreSQL
npm run dev            # → http://localhost:5000
```

### 3. Frontend
```bash
cd client
cp .env.example .env   # ← atur VITE_API_URL jika perlu
npm install
npm run dev            # → http://localhost:5173
```

## Environment Variables
| File | Variable Penting |
|------|-----------------|
| `server/.env` | `DATABASE_URL`, `JWT_SECRET`, `AI_SERVICE_URL` |
| `client/.env` | `VITE_API_URL`, `VITE_USE_MOCK` |

## Tim
| Peran | Nama |
|-------|------|
| Full-Stack | Liony Dewinta Anggraeni, Naila Atha Syahira |
| AI Engineer | Muhammad Arif Rachmat, Athaya Khalishah |
| Data Scientist | Muhammad Rezki L, Steven Wijaya Lim |
