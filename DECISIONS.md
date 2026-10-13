# Engineering Decisions & Assumptions

### 1. Database Architecture
- **Decision:** SQLite via `better-sqlite3` running locally in WAL mode at `data/dating.db`.
- **Rationale:** Self-contained, zero external database setup requirement, instantaneous local read/write, fully mirrors the requested relational schema (`people`, `profiles`, `screens`, `dates`, `rankings`, `jobs`, `rate_limits`).

### 2. LLM Provider Routing
- **Decision:** Provider-agnostic OpenAI-compatible adapter in `lib/llm.ts`, pointed to Groq (`https://api.groq.com/openai/v1`).
- **Models:**
  - Strong Model (Synthesis, Date Conversations, Debrief): `openai/gpt-oss-120b`
  - Fast Model (Pairwise Screening, Identity Checks): `qwen/qwen3.8-27b`
  - Vision Model: `openai/gpt-oss-120b`

### 3. Image Storage
- **Decision:** Downloaded Instagram CDN images are written immediately to `public/uploads/` and served statically via Next.js `/uploads/...`.
- **Rationale:** Avoids Instagram CDN URL expiration without requiring external Supabase S3 bucket configuration.

### 4. Asynchronous Pipeline & Real-Time Telemetry
- **Decision:** SSE (Server-Sent Events) via `GET /api/jobs/[id]/stream` with polling fallback on `GET /api/jobs/[id]`.
- **Rationale:** Ensures fluid 60fps-style telemetry updates in the UI during date generation without WebSocket overhead.

### 5. UI Design System Integration
- **Decision:** Direct mapping of Stitch design tokens and screen layouts (`Synthetic Affinity` theme from Google Stitch project `5695540746916414938`) into Next.js App Router components.
- **Aesthetic:** Dark obsidian base (`#09090b`), translucent glass surfaces, glowing violet/rose neon gradients, and tabular telemetry typography.
