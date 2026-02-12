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
src/app/[slug]/       → Dynamic SEO pages (database-driven)
src/components/       → React components (ui/, copilot/, tenders/, layout/)
src/components/seo/   → SEO page components (FeatureGrid, StatsBar, TrustBadges, CTABanner)
src/lib/              → Shared utilities (db, auth, upload, gov-api)
src/hooks/            → Custom React hooks
scripts/              → Database seeding scripts for content management
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
- Key tables: users, teams, team_memberships, sessions, tenders, tender_analyses, company_profiles, competitor_enrichments, saved_views
- Analysis results stored as JSONB columns for flexibility

### Dashboard System (Card-Based)
The dashboard uses a visual card-based layout instead of tables:

**Components** (`src/components/dashboard/`):
- `TenderCard.tsx` - Rich card showing match %, sector, buyer, value, deadline, competitors
- `TenderCardGrid.tsx` - Responsive grid with infinite scroll
- `MatchScoreGauge.tsx` - Circular gauge showing profile match percentage
- `CompetitorPreview.tsx` - Shows competitors and incumbent with badges
- `SectorIndicator.tsx` - Clickable CPV sector badges with icons
- `QuickActionButtons.tsx` - View, Save, Analyze, Dismiss buttons
- `ProfileGate.tsx` - Blocks dashboard until profile is complete
- `SavedViewsPanel.tsx` - Sidebar list of saved filter views
- `SaveViewModal.tsx` - Modal for saving/editing filter views
- `SectorFilterTree.tsx` - Hierarchical CPV sector filter with checkboxes

**Hooks** (`src/lib/hooks/`):
- `use-profile-completeness.ts` - Checks if profile has companyName, CPV divisions, regions
- `use-competitors.ts` - Fetches competitor data with lazy loading on hover
- `use-saved-views.ts` - CRUD operations for saved filter views

**API Routes**:
- `GET /api/competitors?ocid=X&buyerName=Y&sector=Z` - Competitor enrichment with 24h cache
- `GET/POST /api/saved-views` - List/create saved views
- `PUT/DELETE /api/saved-views/[id]` - Update/delete individual views

**CPV Hierarchy** (`src/lib/cpv-hierarchy.ts`):
- Full CPV code structure with divisions, groups, classes
- Icons and colors for each sector
- Helper functions: `getDivisionInfo()`, `getCpvLabel()`, `searchCpvCodes()`

### SEO Pages System
All marketing/SEO pages are database-driven via the `pages` table:

**Route**: `src/app/[slug]/page.tsx` - Dynamic catch-all for SEO pages

**Pages Table Schema**:
```
slug              → URL path (e.g., '/proposal-software')
title_tag         → <title> tag content
h1                → Page heading
meta_description  → Meta description
primary_keyword   → Main target keyword
secondary_keywords→ Array of related keywords
body_content      → Markdown content (rendered with react-markdown)
hero_image        → Unsplash hero image URL
hero_image_alt    → Alt text for hero image
og_image          → OpenGraph image URL
features          → JSONB array of feature cards
stats             → JSONB array of statistics
trust_badges      → JSONB array of authority badges
json_ld           → Structured data (SoftwareApplication, FAQPage schemas)
cluster           → Content cluster category
intent            → 'commercial' | 'informational'
status            → 'draft' | 'published'
search_volume     → Monthly search volume
```

**SEO Components** (`src/components/seo/`):
- `FeatureGrid` - Responsive feature cards (2/3/4 columns)
- `StatsBar` - Statistics display with gradient variant
- `TrustBadges` - Authority trust indicators with links
- `CTABanner` - Call-to-action sections

**Content Seeding Scripts** (`scripts/`):
```bash
npx tsx scripts/seed-new-pages.ts           # Create initial pages
npx tsx scripts/enhance-pages.ts            # Update hero images + content
npx tsx scripts/add-enhanced-data.ts        # Add features, stats, badges
npx tsx scripts/phase2-enhancements.ts      # Enhance + create bid writing pages
npx tsx scripts/audit-links.ts              # Audit internal link structure
npx tsx scripts/fix-internal-links.ts       # Fix orphaned pages, update homepage
npx tsx scripts/seo-optimization-jan2026.ts # Add rfp-platform, bid-versioning, gdpr pages
```

**Current SEO Pages** (44 pages, ~8,565 monthly searches):

*Software Cluster (28 pages):*
- /rfp-platform, /proposal-software, /bid-management-software, /tender-software
- /tender-management-software, /proposal-management-software
- /rfp-management-software, /rfp-response-software, /ai-rfp-software
- /bid-writing-software, /government-tender-software, /procurement-software-uk
- /construction-bid-management-software, /pqq-software, /itt-response-software
- /tender-library-software, /tender-management-software-uk, /best-rfp-software
- /rfp-automation-software, /rfp-tools, /proposal-writing-software
- /free-rfp-software, /rfp-software-small-business
- /proposal-software-accountants, /bid-writing-services, /ai-bid-writing
- /bid-versioning, /gdpr-bid-management

*How-To Cluster (11 pages):*
- /bid-writing (1,900/mo), /tender-process (1,000/mo)
- /what-is-bid-writing (880/mo), /writing-a-tender-bid (590/mo)
- /bid-writing-courses (480/mo), /how-to-write-a-tender (140/mo)
- /how-to-win-a-tender (110/mo), /rfp-tender (70/mo)
- /how-to-write-a-tender-proposal, /how-to-write-a-tender-response
- /rfp-software-development

*Templates Cluster (4 pages):*
- /sample-rfp-software, /bid-writing-examples
- /rfp-software-template, /rfp-for-software-development-template

**Internal Linking**: All pages linked from homepage, no orphans
**Sitemap**: Auto-generated from database (`src/app/sitemap.ts`)

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
- **Companies House**: REST, JSON, API key required
  - Docs: https://developer-specs.company-information.service.gov.uk/
  - Rate limit: 600 requests/hour (50 per 5 minutes)
- Data under Open Government Licence

## Data Architecture

### Storage Strategy
| Data Type | Storage | Details |
|-----------|---------|---------|
| Tender metadata | Neon (Postgres) | Title, buyer, value, dates, CPV codes, OCID |
| PDF documents | Cloudflare R2 | Object storage, URL stored in DB |
| Analysis results | Neon (JSONB) | Extracted requirements, scoring, gaps |
| Saved tenders | Browser localStorage | Client-side with DB validation |
| Enrichments | Neon (JSONB) | Buyer intel, competitor research |

### OCID (Open Contracting ID)
Every UK government tender has a unique OCID following the Open Contracting Data Standard:
```
ocds-b5fd17-abc123-xyz
```
- Used as primary identifier across APIs and database
- Enables linking to original tender notices
- The `ocids` filter in `/api/tenders/search` fetches specific tenders by ID

### Saved Tenders System
- Stored in browser localStorage (`rfp-quest-saved-tenders`)
- Validated against database on page load (removes stale entries)
- Fetched directly by OCID when "Show Saved" is clicked
- Hook: `src/lib/hooks/use-saved-tenders.ts`

---

## Companies House / Buyer Intelligence

The agent includes tools for fetching UK company data to enrich bid writing.

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /company/{number}` | Basic company info (name, SIC codes, status) |
| `GET /company/{number}/officers` | Directors and secretaries (decision makers) |
| `GET /company/{number}/filings` | Filing history (accounts, etc.) |
| `GET /company/{number}/news` | Recent news via Tavily |
| `GET /company/{number}/decision-makers` | Officers + LinkedIn search |
| `GET /buyer-intel/{number}` | Full buyer intelligence with bid insights |
| `GET /buyer-intel-enhanced/{number}` | Buyer intel + news + LinkedIn enrichment |
| `GET /search/company?q={query}` | Search companies by name |
| `GET /signals/{number}` | Growth/risk signals for opportunity detection |
| `POST /decision-makers/{number}/profile` | LinkedIn profiling via Apify (top 5 directors) |

### Environment Variables

```bash
COMPANIES_HOUSE_API_KEY=  # Required for buyer intelligence
TAVILY_API_KEY=           # Enables news search
APIFY_API_TOKEN=          # Enables LinkedIn decision maker profiling
OPENAI_API_KEY=           # For PDF Vision extraction & post analysis
```

### Tools

**`agent/tools/companies_house.py`**:
- `get_company_info` - Company profile from CH API
- `get_company_officers` - Directors/secretaries for decision maker discovery
- `get_filing_history` - Accounts and other filings
- `get_buyer_intelligence` - Combined intelligence with PDF analysis (SECR extraction)
- `search_company_by_name` - Find company number from name
- `get_opportunity_signals` - Growth/risk detection

**`agent/tools/apify_linkedin.py`**:
- `search_linkedin_profile` - Find LinkedIn URL by name + company
- `get_linkedin_posts` - Fetch recent posts (no cookies required)
- `analyze_director_content` - GPT-4o analysis of posts for bid insights
- `profile_decision_maker` - Full profiling pipeline

### Frontend Components

**`src/components/dashboard/BuyerIntelligencePanel.tsx`**:
- Displays company profile, SECR data, signals
- Expandable sections for decision makers, sustainability, risks
- Integrates DecisionMakerInsights component

**`src/components/dashboard/DecisionMakerInsights.tsx`**:
- Lazy-loads LinkedIn profiles on expand
- Shows headline, location, LinkedIn link
- Displays topics, priorities, bid writing tips (when posts available)

### API Routes (Frontend)

| Route | Description |
|-------|-------------|
| `GET /api/buyer-intel?buyerName=X` | Proxy to agent buyer-intel endpoint |
| `POST /api/decision-makers/[companyNumber]/profile` | LinkedIn profiling |

### Usage in Bid Writing

1. When tender uploaded, extract buyer organization name
2. Search Companies House for company number
3. Fetch buyer intelligence (profile, officers, SECR data)
4. Profile decision makers on LinkedIn (topics, priorities)
5. Use insights to tailor bid response

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
