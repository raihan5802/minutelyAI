# AI Meeting Copilot

> A free, open-access web app that turns any meeting transcript or audio file into structured summaries, action items, decisions, and Notion exports — powered by a LangGraph AI agent.

---

## What is it?

The AI Meeting Copilot is a full-stack AI application where anyone can paste a meeting transcript or upload an audio file and instantly receive:

- A clean **summary** of the meeting
- **Action items** with owners and due dates extracted automatically
- **Key decisions** that were made
- **Open questions** that were left unanswered
- A one-click **export to Notion** or a downloadable **markdown file**

No account required. No payment. No login. Just open the URL and go.

The "agentic" part is what makes it more than a summarizer — a **LangGraph agent** reasons through the transcript step by step, identifying who said what, what was decided vs just discussed, and what tasks were assigned to whom.

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI / Transcription | OpenAI Whisper tiny (local, free) |
| AI Agent | LangGraph + DeepSeek V3 (~$0.0004 per meeting, OpenAI-compatible API) |
| Backend API | FastAPI + WebSockets |
| Frontend | React + Tailwind CSS |
| Notion Integration | Notion API |
| Backend Deploy | Railway (free tier) |
| Frontend Deploy | Vercel (free tier) |

---

## Architecture Overview

```
User
 │
 ▼
React Frontend (Vercel)
 │  upload audio / paste transcript
 ▼
FastAPI Backend (Railway)
 │
 ├──► Whisper (local)
 │     audio → raw transcript text
 │
 └──► LangGraph Agent
       │
       ├── Node 1: summarize
       ├── Node 2: extract_action_items
       ├── Node 3: identify_decisions
       └── Node 4: find_open_questions
             │
             ▼
        Structured JSON output
             │
   ┌─────────┼──────────┐
   ▼         ▼          ▼
Notion API  Email     Markdown
 export    digest     download
```

---

## Build Plan

### Phase 1 — Transcription Core
**Timeline: Days 1–3**

Get audio in, clean text out. The foundation everything else is built on.

**Tasks:**
1. Set up FastAPI project — scaffold `/upload` and `/transcript` endpoints
2. Integrate local Whisper — `whisper.load_model("tiny")`, accept audio file upload, return raw transcript
3. Add text input fallback — accept plain text POST so users can paste a transcript directly
4. Test with a real meeting — record a 5-min mock meeting, run it through, verify quality

**Key dependencies:**
```
openai-whisper
fastapi
uvicorn
python-multipart
ffmpeg-python
```

**Whisper model choice:**

| Model | RAM needed | Speed | Accuracy |
|---|---|---|---|
| `tiny` | ~400MB | Fastest | Good |
| `base` | ~1GB | Fast | Better |
| `small` | ~2GB | Moderate | Best for free |

> Using `tiny` model — ~400MB RAM, fastest inference, ideal for Railway free tier.

**What to show recruiters:** After day 3 you have a working demo — audio in, clean text out. This alone is deployable.

---

### Phase 2 — LangGraph Agent
**Timeline: Days 4–7**

**Status: ✅ Complete**

The agentic AI core. A LangGraph agent with 4 reasoning nodes extracts structured information from meeting transcripts using DeepSeek V3.

**LLM: DeepSeek V3 — near free, OpenAI-compatible**

Sign up at `platform.deepseek.com`. New accounts get free credits. After that the cost is $0.14 per 1M input tokens and $0.28 per 1M output tokens — roughly **$0.0004 per meeting analysis**. $1 covers 2,500 meetings.

| Feature | Detail |
|---|---|
| Model | deepseek-chat (DeepSeek V3) |
| Input cost | $0.14 per 1M tokens |
| Output cost | $0.28 per 1M tokens |
| Cost per meeting | ~$0.0004 |
| API compatibility | OpenAI-compatible |
| Signup | platform.deepseek.com |

**LLM setup:**
```python
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="deepseek-chat",
    openai_api_key=os.getenv("DEEPSEEK_API_KEY"),
    openai_api_base="https://api.deepseek.com/v1",
    temperature=0
)
```

**4 agent nodes:**
- `summarize` — 3–5 sentence meeting summary
- `extract_action_items` — tasks with owner and due date in TASK/OWNER/DUE format
- `identify_decisions` — formally agreed items only
- `find_open_questions` — unresolved issues

**Confirmed output quality from test transcript:**
```json
{
  "summary": "The meeting focused on the product launch timeline, budget approval, and marketing strategy...",
  "action_items": [
    "TASK: Update the project timeline | OWNER: John | DUE: End of day Friday",
    "TASK: Follow up with finance team | OWNER: Sarah | DUE: Thursday"
  ],
  "decisions": ["The product launch date is moved to March 15th."],
  "open_questions": ["Whether to use paid ads or organic social for the launch."],
  "model_used": "DeepSeek V3"
}
```

**Environment variable:**
```
DEEPSEEK_API_KEY=your_key_from_platform.deepseek.com
```

**Key dependencies:**
```
langgraph
langchain-openai
langchain-core
python-dotenv
```

**What to show recruiters:** Multi-step agentic reasoning across 4 nodes, structured JSON output, near-zero cost at $0.0004 per request. Mention LangGraph and DeepSeek V3 by name — both are hot topics in 2026 AI hiring.

---

### Phase 3 — React Frontend
**Timeline: Days 8–11**

A clean, minimal UI that makes the output look polished and professional.

**Tasks:**
1. Scaffold with Vite + Tailwind — `npm create vite@latest copilot -- --template react`
2. Build the upload UI — drag-and-drop audio zone + text paste area, loading spinner while processing
3. Build the results view with 4 sections:
   - Summary card
   - Action items table (task / owner / due date columns)
   - Decisions list
   - Open questions list
4. Add markdown export — download button that converts JSON output to a formatted `.md` file client-side

**What to show recruiters:** Keep it clean and minimal. A polished UI signals product thinking, not just engineering.

---

### Phase 4 — Notion Integration
**Timeline: Days 12–14**

The "agentic action" moment — the app goes beyond analysis and actually does something in the real world.

**Tasks:**
1. Create a Notion integration at [notion.so/my-integrations](https://notion.so/my-integrations), get the API key
2. Build `/export/notion` FastAPI endpoint — creates a new Notion page with structured output formatted as blocks
3. Add "Send to Notion" button to the React UI — user pastes their Notion page ID, one click, done
4. Test the full end-to-end flow: audio → transcript → agent → Notion page
5. **Record a Loom of this moment** — this is your hero demo clip

**Key dependency:**
```
notion-client
```

**What to show recruiters:** The Notion integration is the clearest demonstration of agentic behaviour — the agent reads a meeting and autonomously creates a structured page in another tool.

---

### Phase 5 — Deploy and Ship
**Timeline: Days 15–17**

Make it live. Get real users. Collect numbers.

**Tasks:**
1. Deploy backend to Railway:
   ```bash
   railway init
   railway up
   ```
   Add environment variables: `DEEPSEEK_API_KEY`, and optionally `NOTION_API_KEY`

2. Deploy frontend to Vercel:
   ```bash
   vercel deploy
   ```
   Set `VITE_API_URL` to your Railway backend URL

3. Write the README with:
   - Problem statement (1 paragraph)
   - Live demo URL
   - Architecture diagram (screenshot)
   - Loom demo link (60 seconds, full flow)
   - Setup instructions

4. Share it:
   - LinkedIn post with the Loom video
   - `r/MachineLearning` and `r/learnprogramming`
   - Product Hunt launch

**What to show recruiters:** A live URL + GitHub stars + a Loom demo is the most impressive recruiter package you can have. Note real usage numbers in your README — "500+ meetings processed."

---

## What Makes This Project Impressive in 2026

- **Agentic AI** — not a chatbot, not a summarizer. A multi-step reasoning agent that takes autonomous action across tools.
- **Real deployment** — live URL anyone can open in 30 seconds. No signup, no friction.
- **Full-stack breadth** — Python/ML on the backend, React on the frontend, real API integrations.
- **Product thinking** — designed around a specific user problem with a clear output, not a tech demo.
- **Zero cost to run** — Whisper runs locally on Railway, Vercel and Railway free tiers handle hosting. Sustainable indefinitely.

---

## Estimated Timeline

| Phase | Focus | Days |
|---|---|---|
| 1 | Transcription core | 1–3 |
| 2 | LangGraph agent | 4–7 |
| 3 | React frontend | 8–11 |
| 4 | Notion integration | 12–14 |
| 5 | Deploy and ship | 15–17 |

**Total: ~17 days** from zero to live demo.

---

## What to Say in Interviews

> "I built a full-stack agentic AI app called MinutelyAI that takes meeting audio, transcribes it locally with Whisper tiny, then runs it through a LangGraph agent with four reasoning nodes to extract action items, decisions, and open questions. For the LLM I used DeepSeek V3 — an OpenAI-compatible API that costs about $0.0004 per meeting analysis, so the whole project runs for pennies. It's deployed live on Railway and Vercel, zero friction for anyone to try."

That answer covers: Python, ML, FastAPI, LangGraph, DeepSeek V3, React, deployment, and cost-conscious engineering — exactly what hiring managers want to hear in 2026.
