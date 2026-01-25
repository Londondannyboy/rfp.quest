# RFP Quest - Technical Implementation Plan

## Architecture Overview

RFP Quest is a UK government tender analysis platform. Users upload tender documents (PDF or OCDS JSON), and an AI agent dissects them to produce structured breakdowns: requirements, scoring criteria, gaps, and response talking points.

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                         │
│  Next.js App (React + CopilotKit hooks)                 │
│  - useCoAgent() for analysis state                      │
│  - useCoAgentStateRender() for progressive UI           │
│  - useCopilotReadable() for context sync                │
└──────────────────────┬──────────────────────────────────┘
                       │ AG-UI Protocol (SSE)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel (Next.js API Routes)                  │
│  /api/copilotkit  → CopilotRuntime proxy                │
│  /api/tenders     → CRUD operations (Neon)              │
│  /api/auth        → Session management                  │
│  /api/gov-api     → UK API proxy (Phase 2)              │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Railway (FastAPI + LangGraph Agent)               │
│  Persistent process - no cold starts                     │
│  CopilotKitSDK handles AG-UI event streaming            │
│  LangGraph StateGraph runs analysis pipeline            │
└──────────────────────┬──────────────────────────────────┘
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
         ┌────────┐ ┌──────┐ ┌────────────┐
         │  Neon  │ │  R2  │ │ OpenAI API │
         │Postgres│ │Files │ │  (GPT-4o)  │
         └────────┘ └──────┘ └────────────┘
```

### Deployment Model

| Component | Platform | Why |
|-----------|----------|-----|
| Next.js frontend + API routes | Vercel | Already deployed, native Next.js 15 support |
| FastAPI + LangGraph agent | Railway | Persistent process needed (no cold starts), LangGraph analysis runs 30-60s |
| Database | Neon | Serverless Postgres, existing familiarity |
| File storage (PDFs) | Cloudflare R2 | S3-compatible, no egress fees |
| LLM | OpenAI (GPT-4o) | Best quality for structured extraction, via LangChain |

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router) - existing project foundation
- **CopilotKit** - React hooks for agent state sync, generative UI, chat
- **Tailwind CSS 4** - already configured
- **shadcn/ui** - component primitives (to add)
- **Drizzle ORM** - type-safe Postgres queries from Next.js API routes

### Agent Backend
- **FastAPI** - async Python web framework
- **LangGraph** - stateful agent workflow graphs
- **LangChain** - document loaders (PyPDFLoader), LLM integration
- **CopilotKit Python SDK** - bridges agent state to frontend via AG-UI
- **Pydantic** - structured output models

### Infrastructure
- **Neon** - serverless Postgres (auth, teams, tenders, analyses)
- **Cloudflare R2** - PDF file storage
- **Railway** - agent hosting (persistent, auto-scaling)

---

## Project Structure

```
rfp.quest/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page (existing, evolve)
│   │   ├── layout.tsx                  # Root layout (add CopilotKit provider)
│   │   ├── globals.css                 # Styles (existing)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          # Email/password login
│   │   │   ├── register/page.tsx       # Registration + team creation
│   │   │   └── layout.tsx             # Auth layout (centered card)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Dashboard shell (sidebar + header)
│   │   │   ├── page.tsx                # Dashboard home (recent tenders, stats)
│   │   │   ├── tenders/
│   │   │   │   ├── page.tsx            # Tender library (list/grid)
│   │   │   │   ├── new/page.tsx        # Upload PDF or import from API
│   │   │   │   └── [id]/page.tsx       # Tender detail + AI analysis view
│   │   │   ├── browse/page.tsx         # Search govt APIs (Phase 2)
│   │   │   └── team/page.tsx           # Team management
│   │   └── api/
│   │       ├── copilotkit/route.ts     # CopilotRuntime -> Railway agent
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── register/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── me/route.ts
│   │       ├── tenders/
│   │       │   ├── route.ts            # GET (list), POST (create)
│   │       │   ├── [id]/route.ts       # GET, DELETE
│   │       │   ├── [id]/analyze/route.ts  # POST trigger analysis
│   │       │   └── upload/route.ts     # POST multipart file upload
│   │       ├── gov-api/                # Phase 2
│   │       │   ├── find-a-tender/route.ts
│   │       │   └── contracts-finder/route.ts
│   │       └── team/
│   │           ├── route.ts            # GET, PUT team
│   │           ├── members/route.ts    # GET members
│   │           └── invite/route.ts     # POST invite
│   ├── components/
│   │   ├── ui/                         # shadcn/ui (Button, Card, Input, etc.)
│   │   ├── copilot/
│   │   │   ├── tender-analysis-renderer.tsx  # useCoAgentStateRender
│   │   │   ├── analysis-progress.tsx         # Stage progress indicator
│   │   │   └── agent-chat.tsx                # CopilotChat wrapper
│   │   ├── tenders/
│   │   │   ├── tender-upload-form.tsx
│   │   │   ├── tender-card.tsx
│   │   │   ├── tender-list.tsx
│   │   │   ├── requirements-table.tsx
│   │   │   ├── scoring-criteria.tsx
│   │   │   ├── gaps-analysis.tsx
│   │   │   └── talking-points.tsx
│   │   └── layout/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── nav-links.tsx
│   ├── lib/
│   │   ├── db.ts                       # Neon + Drizzle client
│   │   ├── auth.ts                     # Session helpers, middleware
│   │   ├── gov-api.ts                  # Find a Tender / Contracts Finder client
│   │   └── upload.ts                   # R2 upload helpers
│   └── hooks/
│       ├── use-tender-analysis.ts      # useCoAgent wrapper
│       └── use-auth.ts                 # Auth state hook
├── drizzle/
│   ├── schema.ts                       # Full database schema
│   ├── migrations/                     # Generated migrations
│   └── drizzle.config.ts
├── agent/                              # Python (deployed to Railway)
│   ├── pyproject.toml                  # Dependencies (uv/poetry)
│   ├── main.py                         # FastAPI app + CopilotKitSDK setup
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── tender_agent.py             # LangGraph StateGraph definition
│   │   └── state.py                    # TenderAnalysisState TypedDict
│   ├── nodes/
│   │   ├── __init__.py
│   │   ├── document_parser.py          # PDF/JSON ingestion
│   │   ├── structure_extractor.py      # Identify sections/clauses
│   │   ├── requirements_analyzer.py    # Extract requirements
│   │   ├── scoring_analyzer.py         # Extract evaluation criteria
│   │   ├── gaps_identifier.py          # Identify what bidder must provide
│   │   ├── talking_points.py           # Generate response suggestions
│   │   └── categorizer.py             # Classify tender type/sector
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── pdf_loader.py              # LangChain PyPDFLoader
│   │   └── json_loader.py            # OCDS JSON parser
│   ├── prompts/
│   │   ├── __init__.py
│   │   ├── extraction.py              # Requirement extraction prompts
│   │   ├── scoring.py                 # Scoring analysis prompts
│   │   ├── gaps.py                    # Gap identification prompts
│   │   └── talking_points.py          # Response suggestion prompts
│   ├── models/
│   │   ├── __init__.py
│   │   ├── tender.py                  # Pydantic models for tender data
│   │   └── analysis.py               # Pydantic models for analysis output
│   ├── config.py                       # Environment config
│   ├── Dockerfile                      # Railway deployment
│   └── tests/
│       ├── test_agent.py
│       ├── test_nodes.py
│       └── fixtures/
│           ├── sample_tender.pdf
│           └── sample_ocds.json
├── docs/
│   ├── plan.md                         # This file
│   └── PRD.md                          # Product requirements
├── CLAUDE.md                           # Claude Code project context
├── docker-compose.yml                  # Local dev (runs agent + optional local PG)
├── .env.example                        # Environment variable template
├── .gitignore                          # Updated for Python + Node
├── package.json                        # Existing + new deps
├── next.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

---

## Database Schema

### SQL Definition (Neon/Postgres)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auth & Teams
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    find_a_tender_api_key TEXT,           -- Encrypted
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE team_role AS ENUM ('admin', 'member');

CREATE TABLE team_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    role team_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, team_id)
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenders
CREATE TYPE tender_source AS ENUM ('upload_pdf', 'upload_json', 'find_a_tender', 'contracts_finder');
CREATE TYPE tender_status AS ENUM ('pending', 'analyzing', 'analyzed', 'error');

CREATE TABLE tenders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    reference_number VARCHAR(255),
    ocid VARCHAR(255),                    -- OCDS contract ID
    external_url TEXT,
    source tender_source NOT NULL,
    status tender_status NOT NULL DEFAULT 'pending',
    buyer_name VARCHAR(500),
    sector VARCHAR(255),
    cpv_codes TEXT[],
    region VARCHAR(255),
    value_low DECIMAL(15,2),
    value_high DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'GBP',
    deadline TIMESTAMPTZ,
    published_date TIMESTAMPTZ,
    raw_document_url TEXT,                -- R2 URL for uploaded PDF
    raw_json JSONB,
    parsed_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenders_team_id ON tenders(team_id);
CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_tenders_deadline ON tenders(deadline);

-- AI Analysis
CREATE TABLE tender_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    model_used VARCHAR(100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    summary TEXT,
    requirements JSONB,                   -- [{requirement, type, mandatory, section}]
    scoring_criteria JSONB,               -- [{criterion, weight, description}]
    mandatory_criteria JSONB,             -- [{criterion, description}]
    gaps JSONB,                           -- [{gap, severity, suggestion}]
    talking_points JSONB,                 -- [{section, points[]}]
    deadlines JSONB,                      -- [{description, date, type}]
    budget_info JSONB,
    categorization JSONB,                 -- {type, sector, cpv_codes, keywords}
    raw_agent_output JSONB,               -- Full agent state (debug/audit)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_tender_id ON tender_analyses(tender_id);
```

---

## LangGraph Agent Design

### Agent State

```python
from typing import TypedDict, Optional, Literal
from typing_extensions import Annotated
from langgraph.graph import add_messages

class TenderAnalysisState(TypedDict):
    # Input
    tender_id: str
    raw_text: Optional[str]
    raw_json: Optional[dict]
    source_type: Literal["pdf", "json"]

    # Progress tracking (streamed to UI)
    current_stage: str

    # Analysis outputs (built up across nodes)
    document_structure: Optional[dict]
    summary: Optional[str]
    requirements: Optional[list[dict]]
    mandatory_criteria: Optional[list[dict]]
    scoring_criteria: Optional[list[dict]]
    gaps: Optional[list[dict]]
    talking_points: Optional[list[dict]]
    deadlines: Optional[list[dict]]
    budget_info: Optional[dict]
    categorization: Optional[dict]

    # Agent communication (CopilotKit chat)
    messages: Annotated[list, add_messages]
    error: Optional[str]
```

### Pipeline Graph

```python
from langgraph.graph import StateGraph, START, END

def build_tender_agent():
    graph = StateGraph(TenderAnalysisState)

    graph.add_node("parse_document", parse_document_node)
    graph.add_node("extract_structure", extract_structure_node)
    graph.add_node("analyze_requirements", analyze_requirements_node)
    graph.add_node("analyze_scoring", analyze_scoring_node)
    graph.add_node("identify_gaps", identify_gaps_node)
    graph.add_node("generate_talking_points", generate_talking_points_node)
    graph.add_node("categorize", categorize_node)
    graph.add_node("compile_summary", compile_summary_node)

    graph.add_edge(START, "parse_document")
    graph.add_edge("parse_document", "extract_structure")
    graph.add_edge("extract_structure", "analyze_requirements")
    graph.add_edge("analyze_requirements", "analyze_scoring")
    graph.add_edge("analyze_scoring", "identify_gaps")
    graph.add_edge("identify_gaps", "generate_talking_points")
    graph.add_edge("generate_talking_points", "categorize")
    graph.add_edge("categorize", "compile_summary")
    graph.add_edge("compile_summary", END)

    return graph.compile()
```

### Node Responsibilities

| Node | Purpose | Updates State |
|------|---------|---------------|
| `parse_document` | Load PDF (PyPDFLoader) or parse OCDS JSON | `raw_text`, `current_stage` |
| `extract_structure` | Identify sections, headings, clause numbers | `document_structure` |
| `analyze_requirements` | Extract functional/technical requirements | `requirements`, `mandatory_criteria` |
| `analyze_scoring` | Extract evaluation criteria and weightings | `scoring_criteria` |
| `identify_gaps` | Determine what the bidder must provide | `gaps` |
| `generate_talking_points` | Suggest response content per section | `talking_points` |
| `categorize` | Classify type, sector, CPV codes | `categorization` |
| `compile_summary` | Executive summary of full analysis | `summary` |

### FastAPI Setup

```python
# agent/main.py
from fastapi import FastAPI
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent
from agents.tender_agent import build_tender_agent

app = FastAPI()
tender_agent = build_tender_agent()

sdk = CopilotKitSDK(
    agents=[
        LangGraphAgent(
            name="tender_analyzer",
            description="Analyzes UK government tender documents",
            agent=tender_agent,
        )
    ]
)

add_fastapi_endpoint(app, sdk, "/copilotkit")

@app.get("/health")
async def health():
    return {"status": "ok"}
```

---

## CopilotKit Integration

### Next.js Middleware Route

```typescript
// src/app/api/copilotkit/route.ts
import { CopilotRuntime } from "@copilotkit/runtime";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const runtime = new CopilotRuntime({
    remoteEndpoints: [
      { url: process.env.AGENT_URL + "/copilotkit" },
    ],
  });
  return runtime.handleRequest(req);
}
```

### Frontend Hooks

```typescript
// src/hooks/use-tender-analysis.ts
import { useCoAgent } from "@copilotkit/react-core";

export function useTenderAnalysis(tenderId: string) {
  const { state, run } = useCoAgent({
    name: "tender_analyzer",
    initialState: { tender_id: tenderId, current_stage: "idle" },
  });
  return { analysisState: state, startAnalysis: run };
}
```

```typescript
// In tender detail page:
useCopilotReadable({
  description: "Current tender metadata",
  value: { title, reference, buyer, deadline },
});
```

### State Rendering

```typescript
// src/components/copilot/tender-analysis-renderer.tsx
useCoAgentStateRender({
  name: "tender_analyzer",
  render: ({ state }) => (
    <div>
      <AnalysisProgress stage={state.current_stage} />
      {state.requirements && <RequirementsTable data={state.requirements} />}
      {state.scoring_criteria && <ScoringCriteria data={state.scoring_criteria} />}
      {state.gaps && <GapsAnalysis data={state.gaps} />}
      {state.talking_points && <TalkingPoints data={state.talking_points} />}
    </div>
  ),
});
```

---

## UK Government API Integration (Phase 2)

### Find a Tender
- **Base URL**: `https://www.find-tender.service.gov.uk/api/1.0/`
- **Auth**: API key in `Authorization` header (CDP org key)
- **Format**: OCDS JSON (v1.1.5)
- **Key endpoints**:
  - `GET /ocdsReleasePackages` - Search notices
  - `GET /ocdsReleasePackages/{ocid}` - Get specific notice
- **Data**: Full lifecycle from Feb 2025 (Procurement Act 2023)

### Contracts Finder
- **Base URL**: `https://www.contractsfinder.service.gov.uk/api/`
- **Auth**: None required (public)
- **Format**: JSON or XML
- **Key endpoints**:
  - `POST /Searches/Search` - Search notices with filters

Both APIs proxied through Next.js API routes to keep keys server-side.

---

## Phased Delivery

### Phase 1 (MVP)
- Email/password auth with sessions
- Single team per account (created at registration)
- PDF upload to R2, parse with PyPDFLoader
- Core AI analysis pipeline (requirements, scoring, gaps)
- Analysis results page (rendered after completion)
- Tender library (list of analyzed tenders)
- CopilotKit chat for follow-up questions about tenders

### Phase 2
- Real-time streaming analysis UI (progressive rendering as nodes complete)
- Find a Tender + Contracts Finder API integration
- Browse/search government tenders within the app
- Team invitations + role management (admin/member)
- OCDS JSON file upload support
- Talking points generation node

### Phase 3
- Tender watchlists (saved search criteria, periodic checking)
- Export analysis as PDF/DOCX
- Multi-team support (users in multiple teams)
- Side-by-side tender comparison view
- Historical analytics (sector trends, analysis stats)

---

## Environment Variables

```env
# Next.js (Vercel)
DATABASE_URL=postgres://user:pass@ep-xxx.eu-west-2.aws.neon.tech/rfpquest
AGENT_URL=https://rfp-quest-agent.up.railway.app
SESSION_SECRET=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=rfp-quest-uploads

# Agent (Railway)
OPENAI_API_KEY=sk-...
FIND_A_TENDER_API_KEY=...
```

---

## Local Development

```yaml
# docker-compose.yml
services:
  agent:
    build: ./agent
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./agent:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Run frontend: `npm run dev` (port 3000)
Run agent: `docker compose up agent` or `cd agent && uvicorn main:app --reload`

Set `AGENT_URL=http://localhost:8000` in `.env.local` for local dev.

---

## Dependencies to Add

### package.json (frontend)
```json
{
  "dependencies": {
    "@copilotkit/react-core": "latest",
    "@copilotkit/react-ui": "latest",
    "@copilotkit/runtime": "latest",
    "@neondatabase/serverless": "latest",
    "drizzle-orm": "latest",
    "@aws-sdk/client-s3": "latest",
    "bcryptjs": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest"
  }
}
```

### pyproject.toml (agent)
```toml
[project]
dependencies = [
    "fastapi>=0.115",
    "uvicorn>=0.34",
    "copilotkit>=0.1",
    "langgraph>=0.3",
    "langchain>=0.3",
    "langchain-openai>=0.3",
    "langchain-community>=0.3",
    "pypdf>=5.0",
    "pydantic>=2.0",
]
```
