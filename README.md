# Aura Clinic — Executive Voice AI Business Coach MVP

> **V-Unite Voice AI Coach MVP Applicant Challenge**  
> An autonomous Executive Voice & Chat AI Business Coach designed specifically for aesthetic clinic owners and medical directors to accelerate patient retention, high-ticket treatment upsells, and practice revenue.

---

## 🏛️ System Architecture

```
  ┌────────────────────────────────────────────────────────┐
  │         Aura Clinic Executive Web Application          │
  │    (Next.js 14 • Tailwind CSS • Web Audio • Lucide)    │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │                 n8n Orchestration Layer                │
  │              (Railway Production Instance)             │
  ├────────────────────────────────────────────────────────┤
  │ 1. /webhook/chat       -> pgvector RAG + DeepSeek-V3   │
  │ 2. /webhook/ingest     -> Chunking + Jina v3 (1024-dim)│
  │ 3. /webhook/summarize  -> 7-Day Priority Action Plan   │
  └─────────────┬───────────────────────────┬──────────────┘
                │                           │
                ▼                           ▼
  ┌───────────────────────────┐   ┌────────────────────────┐
  │   Supabase Cloud pgvector │   │   DeepSeek-V3 & Fish   │
  │ • 50 Seeded CRM Records   │   │ • 671B Reasoning LLM   │
  │ • 1024-dim Vector Chunks  │   │ • Fish Audio TTS Voice │
  │ • Session Transcripts     │   │ • Web Speech STT       │
  └───────────────────────────┘   └────────────────────────┘
```

---

## 🌟 Key Features

1. **Executive AI Coaching Room:**
   - Real-time conversational AI coach for clinic owners with 4 strategic focus modes: *90-Day Retention*, *High-Ticket Treatment Upselling*, *VIP Reactivation*, and *Staff Booking Utilization*.
   - Live waveform audio visualizer with bidirectional speech input and audio playback via Fish Audio TTS.
2. **Practice CRM Intelligence Dashboard:**
   - 50 seeded aesthetic clinic patient records with cumulative spend, last visit dates, rebooking status, and satisfaction scores.
   - 1-click **"✨ Coach Client"** action to generate personalized clinical outreach scripts and revenue recovery strategies.
3. **RAG Knowledge Base & pgvector Library:**
   - Document chunking and vectorization using **Jina AI v3 (1024-dimensional embeddings)**.
   - "View All Knowledge" library browser to inspect indexed clinical SOPs and consultation guidelines.
4. **7-Day Executive Priority Action Plans:**
   - End-of-session AI synthesis generating structured, numbered 7-day revenue action plans with 1-click Markdown export.
5. **Editorial Luxury Minimalism:**
   - Bespoke ivory and champagne gold aesthetic clinic design, zero noisy AI gradients, and fully mobile-responsive layout.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **AI Backend / Orchestration:** n8n Workflow Automation (Hosted on Railway)
- **Database & Vectors:** Supabase PostgreSQL with `pgvector` extension
- **Embeddings:** Jina AI `jina-embeddings-v3` (1024 dimensions)
- **LLM Reasoning:** DeepSeek-V3 (`deepseek-chat`)
- **Voice / Audio:** Fish Audio TTS API + Web Speech Recognition
- **Testing & QA:** Vitest, Testing Library, Playwright E2E testing
- **CI/CD & DevOps:** GitHub Actions, Docker, Docker Compose

---

## 🧪 Automated Testing & CI/CD

Run the automated test suite locally:

```bash
# Run unit & deterministic clinic logic tests
npm run test

# Run TypeScript type validation
npx tsc --noEmit

# Run Next.js production build
npm run build
```

---

## 🐳 Docker Deployment

Run the entire application in a container with Docker Compose:

```bash
# Start container
docker compose up -d

# Access app
http://localhost:3000
```

---

## 🚀 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/EisenDev/AI-Coach.git
cd AI-Coach

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

---

## 📄 License
MIT License • Built for the V-Unite Voice AI Coach Challenge.
