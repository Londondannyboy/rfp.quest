# RFP Quest - Product Requirements Document

## Product Vision

RFP Quest helps UK businesses win government tenders by using AI to analyse procurement documents and generate structured response guidance. It transforms complex tender PDFs and OCDS JSON data into clear, actionable breakdowns: what's required, how it's scored, what gaps exist, and how to respond effectively.

## Target Users

**Primary**: Small-to-medium UK businesses that bid on government contracts
- Typically 5-50 person companies
- Bid writers, business development managers, procurement specialists
- May handle 5-20 tender responses per year
- Currently spend 3-5 days manually reading and planning each tender response

**Secondary**: Freelance bid consultants who manage responses for multiple clients

## User Personas

### Sarah - Bid Manager at a 30-person IT services company
- Reviews 10-15 tenders per month to assess suitability
- Spends 2 days per tender creating response plans
- Needs: Quick assessment of whether a tender is winnable, structured breakdown of what to write

### Marcus - Owner of a small construction firm
- New to government tendering
- Overwhelmed by procurement jargon and complex scoring
- Needs: Plain-English explanation of what's required, guidance on what to emphasise

---

## Features

### Phase 1 (MVP)

#### F1: User Authentication
**Description**: Email/password registration and login with session-based auth.

**User Stories**:
- As a new user, I can register with my email and password so I can access the platform
- As a registered user, I can log in to access my team's tender workspace
- As a logged-in user, I can log out from any device

**Acceptance Criteria**:
- Registration requires email (unique), password (min 8 chars), and name
- Login sets a secure HTTP-only session cookie
- Sessions expire after 7 days of inactivity
- Password is hashed with bcrypt before storage
- Invalid credentials show a generic "Invalid email or password" error

---

#### F2: Team Creation
**Description**: On registration, a team is automatically created. The registering user becomes the team admin.

**User Stories**:
- As a new user, when I register, a team is created for me so I have a workspace immediately
- As a team admin, I can rename my team
- As a team admin, I can invite members by email (Phase 2)

**Acceptance Criteria**:
- Team is created with the user's name + "'s Team" as default name
- Team slug is auto-generated from the name (URL-safe)
- Registering user gets `admin` role
- Team name is editable from settings

---

#### F3: PDF Upload
**Description**: Users can upload tender PDFs which are stored and parsed for AI analysis.

**User Stories**:
- As a user, I can upload a tender PDF so the AI can analyse it
- As a user, I can see a list of tenders I've uploaded
- As a user, I can delete a tender I no longer need

**Acceptance Criteria**:
- Accepts PDF files up to 50MB
- File is uploaded to Cloudflare R2 with a unique key
- Upload progress indicator shown during transfer
- Tender record created in database with status "pending"
- User provides a title (optional - auto-extracted from PDF if possible)
- PDF text is extracted server-side for the AI agent
- Invalid file types show an error message

---

#### F4: AI Tender Analysis
**Description**: An AI agent analyses the uploaded tender and produces a structured breakdown. The analysis runs asynchronously and results are displayed when complete.

**User Stories**:
- As a user, I can trigger AI analysis on an uploaded tender
- As a user, I can see the analysis progress (which stage is running)
- As a user, I can view the completed analysis in a structured format

**Acceptance Criteria**:
- Analysis is triggered by clicking "Analyse" on a pending tender
- Tender status changes: pending → analyzing → analyzed (or error)
- Progress shows current stage name (e.g., "Extracting requirements...")
- Analysis produces:
  - **Executive Summary**: 2-3 sentence overview of the tender
  - **Requirements**: List of all requirements, marked as mandatory/desirable
  - **Scoring Criteria**: Evaluation criteria with percentage weights
  - **Gaps**: What the bidder needs to provide/evidence, with severity levels
  - **Deadlines**: Key dates extracted from the document
  - **Categorization**: Tender type, sector, region
- Analysis completes within 2 minutes for a typical 50-page tender
- Errors are displayed with a "Retry" option
- Analysis results are persisted to the database

---

#### F5: Analysis Results View
**Description**: A structured display of the AI analysis, organised into clear sections.

**User Stories**:
- As a user, I can view requirements in a filterable table
- As a user, I can see scoring criteria as a weighted list
- As a user, I can review gaps ordered by severity
- As a user, I can see all key deadlines at a glance

**Acceptance Criteria**:
- Requirements table with columns: requirement text, type (mandatory/desirable), section reference
- Scoring criteria list with visual weight indicators (e.g., progress bars)
- Gaps list with severity badges: Critical (red), Important (amber), Minor (grey)
- Deadline list sorted chronologically with relative time ("in 3 weeks")
- Summary displayed prominently at the top
- All sections collapsible for easy scanning

---

#### F6: Tender Library
**Description**: A list view of all tenders in the team workspace.

**User Stories**:
- As a user, I can see all my team's tenders in a list
- As a user, I can filter tenders by status (pending, analyzing, analyzed)
- As a user, I can search tenders by title
- As a user, I can sort tenders by date or deadline

**Acceptance Criteria**:
- Paginated list (20 per page)
- Shows: title, status badge, buyer name, deadline, upload date
- Click to navigate to tender detail
- Filter chips for status
- Search by title (client-side for MVP)
- Sort by: newest first (default), deadline soonest, alphabetical

---

#### F7: CopilotKit Chat
**Description**: An AI chat interface on the tender detail page for asking follow-up questions about the analysed tender.

**User Stories**:
- As a user, I can ask questions about a specific tender's requirements
- As a user, I can ask for clarification on scoring criteria
- As a user, I can ask "How should I respond to section X?"

**Acceptance Criteria**:
- Chat panel on the tender detail page (collapsible sidebar or bottom drawer)
- Agent has context of the current tender and its analysis
- Responses reference specific sections/requirements from the tender
- Chat history persists within the session
- Markdown rendering in chat responses

---

### Phase 2

#### F8: Real-Time Streaming Analysis
**Description**: Analysis results appear progressively as each pipeline node completes, rather than waiting for the full analysis.

**User Stories**:
- As a user, I can see requirements appear as soon as they're extracted (before scoring is done)
- As a user, I can start reading the analysis before it's fully complete

**Acceptance Criteria**:
- Each analysis section renders as its node completes
- Skeleton loaders for sections not yet analysed
- Smooth transitions as new sections appear
- Stage indicator shows which node is currently running

---

#### F9: Government API Integration
**Description**: Search and pull tenders directly from Find a Tender and Contracts Finder within the app.

**User Stories**:
- As a user, I can search for live UK government tenders by keyword, sector, or region
- As a user, I can import a tender from search results directly into my workspace
- As a user, I can view tender details from the government source before importing

**Acceptance Criteria**:
- Search interface with filters: keyword, sector, CPV code, region, value range, deadline range
- Results show: title, buyer, deadline, value, source (FaT/CF)
- "Import" button creates a tender record from the OCDS JSON data
- Imported tenders show source badge and link to original notice
- Find a Tender requires team-level API key (configured in settings)
- Contracts Finder works without API key (public access)

---

#### F10: OCDS JSON Upload
**Description**: Users can upload OCDS JSON files (downloaded from government portals) in addition to PDFs.

**Acceptance Criteria**:
- Accepts .json files containing valid OCDS release data
- Automatically extracts metadata (title, buyer, deadline, value) from OCDS fields
- Parsed more reliably than PDF (structured data)

---

#### F11: Team Invitations
**Description**: Team admins can invite new members by email.

**Acceptance Criteria**:
- Admin enters email + role (admin/member)
- Invitation email sent with a unique link (expires in 7 days)
- Invited user can register or log in to accept
- Team members list shows pending invitations
- Admin can revoke pending invitations

---

#### F12: Talking Points Generation
**Description**: AI-generated suggested response content for each tender section.

**Acceptance Criteria**:
- For each major section, 3-5 bullet points suggesting what to emphasise
- Points reference scoring criteria and mandatory requirements
- Tone is advisory ("Consider highlighting...", "Evidence your...")
- Displayed in an accordion per section

---

### Phase 3

#### F13: Tender Watchlists
**Description**: Saved search criteria that automatically check for new matching tenders.

**Acceptance Criteria**:
- User saves a search with filters as a "watchlist"
- System checks for new matches periodically (daily)
- New matches shown in dashboard with notification badge
- User can auto-import and analyse new matches

---

#### F14: Export Analysis
**Description**: Export the structured analysis as a formatted PDF or DOCX for offline use.

**Acceptance Criteria**:
- Export as PDF with branded header, all analysis sections
- Export as DOCX for editing in Word
- Includes: summary, requirements table, scoring, gaps, talking points

---

#### F15: Tender Comparison
**Description**: Compare two or more tenders side-by-side.

**Acceptance Criteria**:
- Select 2-3 tenders from the library
- Side-by-side view of key metrics: deadline, value, sector, gap count
- Helps users prioritise which tenders to respond to

---

## Non-Functional Requirements

### Performance
- Page load (dashboard): < 2s
- PDF upload (50MB): < 30s including parsing
- AI analysis (50-page PDF): < 2 minutes
- Search results (gov API): < 5s

### Security
- Passwords hashed with bcrypt (cost factor 12)
- Sessions stored server-side, HTTP-only cookies
- All API keys encrypted at rest in Neon
- File uploads validated (PDF/JSON only, size limits)
- Rate limiting on auth endpoints (5 attempts/minute)
- CORS restricted to the frontend domain
- R2 files not publicly accessible (signed URLs)

### Reliability
- Agent errors don't crash the frontend (graceful fallback)
- Failed analyses can be retried
- File uploads resume on network interruption (R2 multipart)

### Data
- All data belongs to the team, not individual users
- Deleting a tender deletes the associated analysis and uploaded file
- GDPR: users can request full data deletion
- Tender data is Open Government Licence (no IP concerns)

---

## Success Metrics

### MVP
- Users can upload a PDF and receive a useful analysis within 2 minutes
- Analysis accuracy: 80%+ of requirements correctly identified (validated against 10 sample tenders)
- System handles 50+ page PDFs without timeout

### Phase 2
- 50% of tenders imported via API (vs manual upload)
- Users engage with chat for follow-up questions on 30%+ of analyses

### Phase 3
- Watchlists generate 3+ relevant matches per month per team
- Users export analyses for 40%+ of completed tenders

---

## Out of Scope (Explicitly Not Building)

- Full tender response document generation (we advise, not write)
- Integration with e-submission portals
- Bid/no-bid scoring algorithm
- Financial modelling or pricing tools
- Document version control
- Supplier pre-qualification management
- Contract management post-award
