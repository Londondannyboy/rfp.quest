# CLAUDE.md - Project Context for Claude Code

## Project Overview

RFP Quest is a UK government tender analysis platform. Users upload tender documents (PDF or OCDS JSON) and an AI agent provides structured breakdowns: requirements, scoring criteria, gaps, and response talking points.

**Domain**: rfp.quest
**Status**: Early development (Coming Soon landing page live)

## Architecture

- **Frontend**: Next.js 15 (App Router) + CopilotKit + Tailwind CSS 4
- **Agent Backend**: FastAPI + LangGraph (Python) in `agent/` directory
- **Database**: Neon (Postgres) via Drizzle ORM
- **File Storage**: Cloudflare R2
- **Deployment**: Frontend on Vercel, Agent on Railway (persistent process)

The frontend communicates with the agent via CopilotKit's AG-UI protocol. The Next.js route `/api/copilotkit` proxies to the FastAPI agent on Railway.

## Project Structure

```
src/app/              → Next.js pages and API routes
src/components/       → React components (ui/, copilot/, tenders/, layout/)
src/lib/              → Shared utilities (db, auth, upload, gov-api)
src/hooks/            → Custom React hooks
drizzle/              → Database schema and migrations
agent/                → Python FastAPI + LangGraph (deployed separately)
agent/nodes/          → LangGraph pipeline nodes
agent/prompts/        → LLM prompt templates
docs/                 → plan.md, PRD.md
```

## Commands

### Frontend (Next.js)
```bash
npm run dev           # Start dev server (port 3000)
npm run build         # Production build
npm run start         # Start production server
npx drizzle-kit push  # Push schema to Neon
npx drizzle-kit generate  # Generate migration
```

### Agent (Python)
```bash
cd agent
uv run uvicorn main:app --reload --port 8000   # Start agent dev server
uv run pytest                                    # Run agent tests
docker compose up agent                          # Run via Docker
```

## Key Integration Points

### CopilotKit
- `/src/app/api/copilotkit/route.ts` - Middleware route (proxy to agent)
- `useCoAgent("tender_analyzer")` - Triggers and tracks analysis
- `useCopilotReadable` - Syncs tender context to agent
- `useCoAgentStateRender` - Progressive UI rendering

### LangGraph Agent
- `agent/agents/tender_agent.py` - StateGraph definition
- `agent/agents/state.py` - TenderAnalysisState TypedDict
- Pipeline: parse → structure → requirements → scoring → gaps → talking_points → categorize → summary

### Database
- Schema defined in `drizzle/schema.ts`
- Key tables: users, teams, team_memberships, sessions, tenders, tender_analyses
- Analysis results stored as JSONB columns for flexibility

## Conventions

### Frontend
- Use App Router (not Pages Router)
- Components in kebab-case files: `tender-card.tsx`
- Use shadcn/ui for base components (in `src/components/ui/`)
- Tailwind CSS 4 (already configured with PostCSS)
- Type imports: `import type { X } from "..."`
- Server Components by default, `"use client"` only when needed
- API routes return `NextResponse.json()`

### Agent (Python)
- Python 3.12+
- Type hints on all functions
- Pydantic models for structured outputs
- Each LangGraph node is a pure function: `(state) -> partial_state`
- Prompts separated from logic (in `agent/prompts/`)

### Database
- UUIDs for all primary keys
- `created_at` / `updated_at` timestamps on all tables
- JSONB for flexible analysis output fields
- Enums for fixed-set columns (tender_source, tender_status, team_role)

### Git
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Branch from main: `feature/xxx`, `fix/xxx`

## Environment Variables

### Frontend (.env.local)
```
DATABASE_URL=           # Neon connection string
AGENT_URL=              # Railway agent URL (or http://localhost:8000)
SESSION_SECRET=         # Random secret for session signing
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Agent (.env)
```
OPENAI_API_KEY=         # For GPT-4o via LangChain
FIND_A_TENDER_API_KEY=  # Optional, for gov API access
```

## UK Government APIs

- **Find a Tender**: REST, OCDS JSON format, API key required
  - Docs: https://www.find-tender.service.gov.uk/apidocumentation
- **Contracts Finder**: REST, JSON/XML, public access
  - Docs: https://www.contractsfinder.service.gov.uk/apidocumentation
- Data under Open Government Licence

## Development Workflow

1. Frontend: `npm run dev` (port 3000)
2. Agent: `cd agent && uv run uvicorn main:app --reload --port 8000`
3. Set `AGENT_URL=http://localhost:8000` in `.env.local`
4. CopilotKit connects frontend to agent automatically

## Important Notes

- The agent runs as a persistent process (Railway). It must NOT cold-start.
- Analysis can take 30-60s for large PDFs. The AG-UI protocol streams state updates.
- All tender data is team-scoped. Queries must filter by `team_id`.
- Uploaded PDFs go to R2, not the database. Only the R2 URL is stored.
- Analysis JSONB structure may evolve. Don't assume fixed schemas for analysis output.
