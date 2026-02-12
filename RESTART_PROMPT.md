# RFP.Quest - Session Restart Prompt

Copy everything below the line to start a new Claude Code session with full project context.

---

## Project: RFP.Quest - UK Government Tender Analysis Platform

**Domain**: https://rfp.quest
**Repo**: https://github.com/Londondannyboy/rfp.quest
**Status**: Active development, core features live

### What It Does
RFP Quest helps UK businesses win government tenders by using AI to analyse procurement documents and generate structured response guidance. Users can search live UK tenders, save favorites, view buyer intelligence, and get AI-powered bid writing insights.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    Vercel (rfp.quest)                           │
│  Next.js 15 + React + Tailwind CSS 4 + CopilotKit               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AGENT BACKEND                               │
│           Railway (rfp-quest-agent-production)                   │
│       FastAPI + LangGraph + Python 3.12                         │
│                                                                  │
│  Endpoints:                                                      │
│  - /buyer-intel/{company_number}     → Companies House + SECR   │
│  - /decision-makers/{num}/profile    → LinkedIn via Apify       │
│  - /company/{num}/news               → Tavily news search       │
│  - /signals/{company_number}         → Growth/risk detection    │
│  - /copilotkit                       → AI chat actions          │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │   Neon     │    │ Companies  │    │   Apify    │
    │ (Postgres) │    │   House    │    │ (LinkedIn) │
    └────────────┘    └────────────┘    └────────────┘
           │
           ▼
    ┌────────────┐
    │ Cloudflare │
    │    R2      │
    │  (PDFs)    │
    └────────────┘
```

---

## Key Files & Directories

```
/Users/dankeegan/rfp.quest/
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx          # Main tender dashboard
│   │   ├── tender/[ocid]/page.tsx      # Tender detail page
│   │   ├── api/
│   │   │   ├── tenders/search/route.ts # Tender search with ocids filter
│   │   │   ├── buyer-intel/route.ts    # Proxy to agent buyer-intel
│   │   │   └── decision-makers/[companyNumber]/profile/route.ts
│   │   └── [slug]/page.tsx             # SEO pages (44 pages)
│   ├── components/
│   │   └── dashboard/
│   │       ├── TenderCard.tsx          # Rich tender card
│   │       ├── BuyerIntelligencePanel.tsx # Companies House data
│   │       └── DecisionMakerInsights.tsx  # LinkedIn profiles
│   └── lib/
│       └── hooks/
│           ├── use-tenders.ts          # Tender search with ocids support
│           ├── use-saved-tenders.ts    # localStorage + DB validation
│           └── use-buyer-intelligence.ts
├── agent/
│   ├── main.py                         # FastAPI endpoints
│   └── tools/
│       ├── companies_house.py          # CH API + SECR extraction
│       └── apify_linkedin.py           # LinkedIn profiling
├── drizzle/schema.ts                   # Database schema
├── CLAUDE.md                           # Full project documentation
└── docs/PRD.md                         # Product requirements
```

---

## Environment Variables

### Frontend (.env.local on Vercel)
```
DATABASE_URL=              # Neon connection string
AGENT_URL=https://rfp-quest-agent-production.up.railway.app
SESSION_SECRET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Agent (.env on Railway)
```
COMPANIES_HOUSE_API_KEY=ec6a1042-73ed-4a38-8352-2bd9e98e5076
TAVILY_API_KEY=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
APIFY_API_TOKEN=apify_api_wxtrMeSwTEgnNQBmxVYriO6FoCMUST2F1yR3
OPENAI_API_KEY=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
PORT=8000
```

---

## What's Working (Completed Features)

### Dashboard
- [x] Tender search with filters (keyword, stage, region, CPV, value range)
- [x] Card-based tender display with match scores
- [x] Saved tenders (localStorage + DB validation)
- [x] Saved views (filter presets)
- [x] Competitor enrichment on hover
- [x] Infinite scroll pagination

### Buyer Intelligence
- [x] Companies House integration (profile, officers, filings)
- [x] SECR extraction from annual accounts (GPT-4o Vision for image PDFs)
- [x] Growth/risk signal detection
- [x] Bid writing insights
- [x] Recent news via Tavily

### Decision Maker Profiling
- [x] LinkedIn profile search via Apify (no cookies)
- [x] Post analysis for topics/priorities
- [x] Bid writing tips based on public statements
- [x] UI component with lazy loading

### SEO
- [x] 44 database-driven pages (~8,565 monthly searches)
- [x] Dynamic sitemap
- [x] Internal linking structure

---

## What's Not Yet Built (Planned)

### Phase 2
- [ ] On-demand tender enrichment with rate limiting (5/user/day)
- [ ] Usage tracking (usage_events table)
- [ ] Enrichment caching (tender_enrichments table)
- [ ] Framework knowledge base (SECR, ISO, Cyber Essentials, G-Cloud)

### Phase 3
- [ ] Tender watchlists with notifications
- [ ] Export analysis as PDF/DOCX
- [ ] Tender comparison side-by-side

---

## Recent Session Work (Feb 2026)

1. **Bug Fixes**
   - Fixed: Saved tenders not displaying (was filtering from current API response)
   - Fixed: "Tender Not Found" on click (stale localStorage entries)
   - Solution: Added `ocids` param to `/api/tenders/search`, validation on load

2. **Decision Maker LinkedIn Profiling**
   - Created: `agent/tools/apify_linkedin.py`
   - Created: `POST /decision-makers/{company_number}/profile` endpoint
   - Created: `DecisionMakerInsights.tsx` component
   - Integrated into BuyerIntelligencePanel

3. **Documentation**
   - Updated CLAUDE.md with data architecture, OCID explanation
   - Updated PRD.md with F7f, F7g features

---

## Commands

```bash
# Frontend development
cd /Users/dankeegan/rfp.quest
npm run dev                    # Start on port 3000

# Agent development
cd /Users/dankeegan/rfp.quest/agent
uv run uvicorn main:app --reload --port 8000

# Database
npx drizzle-kit push          # Push schema changes
npx drizzle-kit generate      # Generate migration

# Railway (agent deployment)
cd /Users/dankeegan/rfp.quest/agent
railway status                 # Check project link
railway variables              # View env vars
railway redeploy               # Trigger redeploy
railway logs --lines 50        # View recent logs

# Testing agent endpoints
curl https://rfp-quest-agent-production.up.railway.app/
curl https://rfp-quest-agent-production.up.railway.app/buyer-intel/07524813
curl -X POST "https://rfp-quest-agent-production.up.railway.app/decision-makers/07524813/profile?max_directors=3"
```

---

## Key Concepts

### OCID (Open Contracting ID)
Unique identifier for UK government tenders: `ocds-b5fd17-abc123`
- Used as primary key across APIs
- Enables linking to original tender notices

### SECR (Streamlined Energy and Carbon Reporting)
UK mandatory carbon reporting for large companies:
- Scope 1: Direct emissions (company vehicles, on-site fuel)
- Scope 2: Indirect emissions (purchased electricity)
- Net Zero Year: Target date for carbon neutrality
- Extracted from annual accounts PDF using GPT-4o Vision

### CPV Codes (Common Procurement Vocabulary)
EU standard for classifying procurement:
- 2-digit divisions (e.g., 72 = IT services)
- Used for filtering and matching

---

## Useful Test Data

**Rolls-Royce Holdings PLC**
- Company Number: 07524813
- Has SECR data in accounts
- 10+ directors for LinkedIn testing
- CEO Tufan Erginbilgic has "Rolls-Royce" in LinkedIn headline

---

## Related Projects

- `/Users/dankeegan/companies_house_extractor` - Standalone CH extraction tool (reference implementation)

---

## Next Steps (Suggested)

1. **Rate-Limited Enrichment** - Implement on-demand enrichment with 5/day limit
2. **Framework Knowledge Base** - Add explanations for SECR, ISO, Cyber Essentials
3. **Improve LinkedIn Matching** - Better company name matching for director profiles
4. **Usage Analytics** - Track enrichment usage per user/team

---

Read CLAUDE.md for full technical documentation.
Read docs/PRD.md for complete product requirements.
