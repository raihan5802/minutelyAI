<div align="center">

# ⚡ MinutelyAI

### AI-powered meeting intelligence. Paste a transcript or upload audio — get structured summaries, action items, and decisions in seconds.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-minutelyai.vercel.app-black?style=for-the-badge&logo=vercel)](https://minutelyai.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent-blue?style=for-the-badge)](https://langchain-ai.github.io/langgraph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

![MinutelyAI Demo](https://via.placeholder.com/900x500/0a0a0a/ffffff?text=MinutelyAI+Demo+Screenshot)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

MinutelyAI is a full-stack agentic AI application that transforms raw meeting transcripts and audio recordings into structured, actionable intelligence — with no account required, no paywall, and no friction.

Most meeting tools record and transcribe. MinutelyAI goes further: a **LangGraph agent** with four reasoning nodes reads the transcript, understands the context, and autonomously extracts what actually matters — who owns what, what was decided, and what still needs to be resolved.

> Built as an open-source portfolio project demonstrating production-grade agentic AI, full-stack development, and real-world deployment.

---

## ✨ Features

- 🎙️ **Audio transcription** — upload `.mp3`, `.wav`, or `.m4a` files, transcribed locally using OpenAI Whisper
- 📋 **Text input** — paste any meeting transcript directly, no audio required
- 🤖 **Agentic analysis** — LangGraph pipeline with 4 reasoning nodes processes every transcript
- ✅ **Action items** — extracted with owner names and due dates in structured format
- 🏛️ **Decisions** — formally agreed items separated from discussion
- ❓ **Open questions** — unresolved topics automatically surfaced
- 📄 **Markdown export** — download a formatted summary file instantly
- 🔓 **Zero friction** — no login, no signup, no payment, open URL and go

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│                   Next.js + shadcn/ui                       │
│           (Paste transcript or upload audio)                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP POST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                           │
│                   (Railway)                                 │
│                                                             │
│   /api/transcribe/audio        /api/analyze                 │
│          │                           │                      │
│          ▼                           ▼                      │
│   ┌─────────────┐            ┌─────────────────────────┐    │
│   │   Whisper   │            │  LangGraph Agent        │    │
│   │  (tiny)     │───────────►│                         │    │
│   │  local CPU  │ transcript │  Node 1: summarize      │    │
│   └─────────────┘            │  Node 2: action_items   │    │
│                              │  Node 3: decisions      │    │
│                              │  Node 4: open_questions │    │
│                              └──────────┬──────────────┘    │
│                                         │                   │
│                                         ▼                   │
│                                ┌──────────────────┐         │
│                                │   DeepSeek V3    │         │
│                                │  (OpenAI API)    │         │
│                                └──────────────────┘         │
└──────────────────────────────────────┬──────────────────────┘
                                       │ Structured JSON
                                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Results Display                          │
│         Summary │ Action Items │ Decisions │ Questions      │
│                    + Markdown Export                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16, TypeScript | App framework, SSR |
| **Styling** | Tailwind CSS, shadcn/ui | UI components |
| **Backend** | FastAPI, Python 3.11 | REST API |
| **Transcription** | OpenAI Whisper tiny | Audio → text, runs locally |
| **AI Agent** | LangGraph | Multi-node reasoning pipeline |
| **LLM** | DeepSeek V3 | Language model (~$0.0004/meeting) |
| **Frontend Deploy** | Vercel | CDN + hosting |
| **Backend Deploy** | Railway | Container hosting |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.11+
- Node.js 20+
- `ffmpeg` (required for Whisper audio processing)
- A [DeepSeek API key](https://platform.deepseek.com) (~$0.0004 per request)

**Install ffmpeg:**
```bash
# macOS
brew install ffmpeg

# Ubuntu / Railway
apt-get install ffmpeg

# Windows
winget install ffmpeg
```

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/minutelyai.git
cd minutelyai/backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Add your DEEPSEEK_API_KEY to .env

# 5. Start the development server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd ../frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 4. Start development server
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DEEPSEEK_API_KEY` | ✅ Yes | DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com) |
| `NOTION_API_KEY` | ⬜ Optional | Notion integration API key |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend URL (`http://localhost:8000` locally, Railway URL in production) |

---

## 📡 API Reference

### `POST /api/transcribe/audio`

Transcribe an audio file using Whisper tiny.

**Request:** `multipart/form-data`
| Field | Type | Description |
|---|---|---|
| `file` | File | Audio file (mp3, wav, m4a, ogg) — max 25MB |

**Response:**
```json
{
  "transcript": "Sarah opened the meeting and said...",
  "duration_seconds": 183.4,
  "word_count": 312
}
```

---

### `POST /api/transcribe/text`

Accept a plain text transcript.

**Request:** `application/json`
```json
{
  "text": "Your meeting transcript here..."
}
```

**Response:**
```json
{
  "transcript": "Your meeting transcript here...",
  "duration_seconds": 0.0,
  "word_count": 47
}
```

---

### `POST /api/analyze`

Run the LangGraph agent on a transcript.

**Request:** `application/json`
```json
{
  "transcript": "Sarah opened the meeting and said..."
}
```

**Response:**
```json
{
  "summary": "The meeting focused on the Q3 product roadmap...",
  "action_items": [
    "TASK: Update project timeline | OWNER: John | DUE: End of day Friday",
    "TASK: Follow up with finance team | OWNER: Sarah | DUE: Thursday"
  ],
  "decisions": [
    "Product launch date moved to March 15th",
    "Two contractors approved for the engineering team"
  ],
  "open_questions": [
    "Who owns the mobile dashboard scope?",
    "Whether to use paid ads or organic social for launch"
  ],
  "model_used": "DeepSeek V3"
}
```

---

### `GET /health`

Health check endpoint used by Railway.

**Response:**
```json
{
  "status": "ok",
  "model": "whisper-tiny",
  "project": "minutelyai"
}
```

---

## 📁 Project Structure

```
minutelyai/
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   └── meeting_agent.py      # LangGraph agent — 4 reasoning nodes
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py            # Pydantic request/response models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── transcribe.py         # Whisper transcription endpoints
│   │   └── analyze.py            # LangGraph agent endpoint
│   ├── main.py                   # FastAPI app entry point
│   ├── config.py                 # Environment variable loader
│   ├── requirements.txt
│   ├── .env.example
│   └── test_agent.py             # Integration tests
│
└── frontend/
    ├── app/
    │   ├── layout.tsx             # Root layout + metadata
    │   └── page.tsx               # Main page
    ├── components/
    │   ├── UploadForm.tsx         # Audio/text input with loading states
    │   ├── ResultsDisplay.tsx     # Four-section results layout
    │   ├── ActionItems.tsx        # Parsed action items table
    │   └── ResultsSkeleton.tsx    # Loading skeleton UI
    ├── lib/
    │   └── api.ts                 # API utility functions + TypeScript types
    ├── .env.local.example
    └── next.config.ts
```

---

## 🌍 Deployment

### Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Set these environment variables in Railway dashboard:
- `DEEPSEEK_API_KEY` — your DeepSeek key
- `NOTION_API_KEY` — optional, for Notion export

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend folder
cd frontend
vercel deploy
```

Set this environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` — your Railway backend URL

---

## 🗺️ Roadmap

- [x] Audio transcription with Whisper
- [x] LangGraph agent with 4 reasoning nodes
- [x] Next.js frontend with shadcn/ui
- [x] Markdown export
- [ ] Notion integration — auto-create meeting pages
- [ ] Speaker diarization — identify who said what
- [ ] Multi-language support
- [ ] Meeting history — store and search past analyses
- [ ] Slack integration — send summaries to channels

---

## 🤝 Contributing

Contributions are welcome. To get started:

```bash
# Fork the repository
git fork https://github.com/yourusername/minutelyai

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git commit -m "feat: add your feature"

# Push and open a pull request
git push origin feature/your-feature-name
```

Please open an issue first for major changes.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [Raihan Chowdhury](https://github.com/raihanchowdhury)

⭐ Star this repo if you found it useful

</div>
