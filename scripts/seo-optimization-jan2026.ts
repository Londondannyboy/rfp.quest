import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Common trust badges
const ukTrustBadges = [
  { name: 'Crown Commercial Service', description: 'UK government procurement standards', url: 'https://www.crowncommercial.gov.uk/' },
  { name: 'GOV.UK', description: 'Integrated with UK government portals', url: 'https://www.gov.uk/' },
  { name: 'Cyber Essentials', description: 'UK cybersecurity standards', url: 'https://www.ncsc.gov.uk/cyberessentials/overview' },
  { name: 'GDPR Compliant', description: 'Full UK data protection compliance', url: 'https://ico.org.uk/' }
];

// ============================================
// NEW PAGES based on Search Console data
// ============================================

const newSeoPages = [
  // PAGE 1: /rfp-platform - Targeting "rfp platform" (34 impressions, position 89.8)
  {
    slug: '/rfp-platform',
    title_tag: 'RFP Platform UK | All-in-One Request for Proposal Software | rfp.quest',
    h1: 'RFP Platform: Your Complete Request for Proposal Solution',
    meta_description: 'The UK\'s leading RFP platform for managing requests for proposals. AI-powered bid writing, opportunity discovery, compliance tracking, and team collaboration. Start free.',
    primary_keyword: 'rfp platform',
    secondary_keywords: ['request for proposal platform', 'rfp platform uk', 'online rfp platform', 'cloud rfp platform', 'rfp management platform', 'proposal platform'],
    search_volume: 720,
    intent: 'commercial',
    cluster: 'software',
    hero_image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop&q=80',
    hero_image_alt: 'Team using RFP platform on multiple devices for proposal management',
    og_image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop&q=80',
    features: [
      { icon: '🌐', title: 'Unified Platform', description: 'All your RFP activities in one cloud-based platform' },
      { icon: '🤖', title: 'AI-Powered', description: 'Intelligent content generation and matching' },
      { icon: '👥', title: 'Team Collaboration', description: 'Real-time multi-user editing and workflows' },
      { icon: '📊', title: 'Analytics Dashboard', description: 'Track performance and improve win rates' },
      { icon: '🔗', title: 'Portal Integration', description: 'Connected to UK government tender portals' },
      { icon: '🔒', title: 'Enterprise Security', description: 'ISO 27001 aligned, GDPR compliant' }
    ],
    stats: [
      { value: '65%', label: 'Faster Bids', suffix: '' },
      { value: '2x', label: 'Win Rate', suffix: '' },
      { value: '50K+', label: 'Opportunities', suffix: '' },
      { value: '99.9%', label: 'Uptime', suffix: '' }
    ],
    trust_badges: ukTrustBadges,
    body_content: `## What is an RFP Platform?

An **RFP platform** is a comprehensive cloud-based solution that centralizes and streamlines the entire Request for Proposal process. Unlike standalone [RFP software](/rfp-software-small-business) or basic [RFP tools](/rfp-tools), a true platform integrates every aspect of bid management into a unified system.

rfp.quest is the UK's purpose-built **RFP platform** designed specifically for British businesses responding to public and private sector tenders.

## Why Choose a Dedicated RFP Platform?

### The Problem with Fragmented Tools

Many organisations cobble together proposals using:
- Word processors for writing
- Spreadsheets for tracking
- Email for collaboration
- File shares for content storage
- Manual searches for opportunities

This fragmented approach leads to:
- **Version control chaos** — Which document is current?
- **Missed deadlines** — No centralised timeline view
- **Duplicated effort** — Rewriting content that exists somewhere
- **Poor visibility** — Management can't track pipeline
- **Compliance risks** — Requirements slip through the cracks

### The Platform Advantage

A unified **RFP platform** solves these problems:

| Challenge | Platform Solution |
|-----------|-------------------|
| Version chaos | Single source of truth with full audit trail |
| Missed deadlines | Automated alerts and calendar integration |
| Duplicated effort | AI-powered content library and matching |
| Poor visibility | Real-time dashboards and reporting |
| Compliance risks | Automated requirement tracking and validation |

## rfp.quest Platform Features

### Opportunity Discovery

Our platform automatically surfaces relevant opportunities from:

- [Find a Tender](https://www.find-tender.service.gov.uk/) — High-value UK contracts
- [Contracts Finder](https://www.contractsfinder.service.gov.uk/) — Lower-threshold opportunities
- [Digital Marketplace](https://www.digitalmarketplace.service.gov.uk/) — G-Cloud and DOS frameworks
- Private sector tender portals

Set your criteria once, receive matching opportunities instantly. Learn more about our [tender software](/tender-software) capabilities.

### AI-Powered Content Creation

Our platform's AI capabilities accelerate proposal development:

- **First draft generation** — AI writes initial responses from requirements
- **Content matching** — Find relevant past responses automatically
- **Quality scoring** — AI evaluates response strength before submission
- **Tone optimization** — Ensure consistent, professional messaging

Explore our [AI RFP software](/ai-rfp-software) features in detail.

### Collaboration & Workflow

Enable your team to work together efficiently:

- **Real-time co-authoring** — Multiple users, one document
- **Section assignments** — Clear ownership and accountability
- **Review workflows** — Structured approval processes
- **Comment threads** — Contextual feedback and discussion
- **Version history** — Complete [auto-versioning for bid responses](/bid-versioning) with audit trail

### Compliance Management

Never miss a requirement with our platform's compliance features:

- **Requirement extraction** — AI identifies all mandatory criteria
- **Compliance matrix** — Track every requirement to your response
- **Automated validation** — Word counts, formatting, completeness
- **Pre-submission checklists** — Verified compliance before you submit

Our [GDPR-compliant bid management](/gdpr-bid-management) ensures your data is always protected.

### Analytics & Reporting

Make data-driven decisions:

- **Pipeline dashboards** — Visualise opportunities and status
- **Win/loss analysis** — Learn from every bid
- **Performance metrics** — Track team productivity
- **Revenue forecasting** — Predict future wins

## Platform vs. Software vs. Tools

Understanding the difference helps you choose:

| Type | Best For | Limitations |
|------|----------|-------------|
| [RFP Tools](/rfp-tools) | Specific tasks (tracking, formatting) | Point solutions, no integration |
| [RFP Software](/rfp-management-software) | Core proposal functions | May lack discovery, analytics |
| **RFP Platform** | End-to-end bid management | Full solution for serious bidders |

For occasional bidders, simple [free RFP software](/free-rfp-software) may suffice. For organisations submitting 10+ bids annually, a platform delivers transformative ROI.

## Platform Benefits by Role

### For Bid Managers

- Single view of all active bids
- Automated deadline tracking
- Resource allocation visibility
- Performance analytics

### For Bid Writers

- AI writing assistance
- Content library access
- Real-time collaboration
- Version control confidence

### For Leadership

- Pipeline visibility
- Win rate tracking
- Revenue forecasting
- Strategic decision support

## UK-Specific Platform Advantages

rfp.quest is built specifically for UK procurement:

### Government Portal Integration

Native integration with UK public sector platforms means:
- Automatic opportunity alerts from [Find a Tender](https://www.find-tender.service.gov.uk/)
- [Contracts Finder](https://www.contractsfinder.service.gov.uk/) synchronisation
- Framework-specific templates (G-Cloud, DOS, CCS)

### UK Compliance Built-In

- Social value requirement support
- Modern Slavery Act compliance
- UK GDPR data handling
- Cyber Essentials alignment

### British English Throughout

No American spellings or terminology — our platform speaks your language.

## Getting Started with rfp.quest

### 1. Discovery

Explore our platform capabilities:
- [Tender software](/tender-software) for opportunity management
- [Proposal software](/proposal-software) for content creation
- [Bid management software](/bid-management-software) for workflow control

### 2. Free Trial

Start your [14-day free trial](/signup) with full platform access:
- No credit card required
- Full feature access
- Sample content included
- Onboarding support

### 3. Implementation

Our team supports your rollout:
- Content library migration
- User training sessions
- Integration configuration
- Ongoing success management

## Platform Pricing

rfp.quest offers transparent, user-friendly pricing:

- **Starter**: £99/month — For small teams (up to 3 users)
- **Professional**: £249/month — For growing teams (up to 10 users)
- **Enterprise**: Custom — For large organisations

All plans include unlimited proposals, AI features, and UK portal integration. See our [pricing for small businesses](/rfp-software-small-business).

## Frequently Asked Questions

### What makes a platform different from RFP software?

An **RFP platform** provides end-to-end capabilities: opportunity discovery, content management, collaboration, submission, and analytics in one unified system. Traditional [RFP software](/rfp-management-software) often focuses on just the writing or tracking aspects.

### Can the platform integrate with our existing tools?

Yes. rfp.quest integrates with popular business tools including Microsoft 365, Google Workspace, Salesforce, and HubSpot. API access is available for custom integrations.

### Is the platform suitable for small businesses?

Absolutely. Our [RFP software for small business](/rfp-software-small-business) tier provides full platform capabilities at accessible pricing. Many SMEs find the efficiency gains pay for the platform within their first won contract.

### How does the AI content generation work?

Our AI analyses your tender requirements, searches your content library for relevant past responses, and generates tailored first drafts. You retain full control to edit, refine, and approve all content. Learn more about [AI bid writing](/ai-bid-writing).

### What security certifications does the platform have?

rfp.quest is ISO 27001 aligned, Cyber Essentials certified, and fully [GDPR compliant](/gdpr-bid-management). All data is stored in UK data centres with enterprise-grade encryption.

---

Ready to transform your bid process? [Start your free trial](/signup) or [book a demo](/demo) to see the rfp.quest platform in action.`,
    json_ld: {
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "rfp.quest RFP Platform",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "The UK's leading RFP platform for managing requests for proposals with AI-powered bid writing and team collaboration.",
          "url": "https://rfp.quest/rfp-platform",
          "offers": {
            "@type": "Offer",
            "price": "99",
            "priceCurrency": "GBP",
            "priceValidUntil": "2026-12-31"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What makes a platform different from RFP software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "An RFP platform provides end-to-end capabilities: opportunity discovery, content management, collaboration, submission, and analytics in one unified system. Traditional RFP software often focuses on just the writing or tracking aspects."
              }
            },
            {
              "@type": "Question",
              "name": "Is the platform suitable for small businesses?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. rfp.quest offers RFP software for small business tiers with full platform capabilities at accessible pricing. Many SMEs find the efficiency gains pay for the platform within their first won contract."
              }
            }
          ]
        }
      ]
    }
  },

  // PAGE 2: /bid-versioning - Capitalizing on "auto-versioning for bid responses" (position 11.3!)
  {
    slug: '/bid-versioning',
    title_tag: 'Bid Versioning & Auto-Versioning for Proposals | rfp.quest',
    h1: 'Bid Versioning: Auto-Versioning for Bid Responses & Compliance',
    meta_description: 'Auto-versioning for bid responses and compliance tracking. Never lose work or miss an audit trail. Version control for proposals with complete change history.',
    primary_keyword: 'auto-versioning for bid responses',
    secondary_keywords: ['bid versioning', 'proposal version control', 'bid response version control', 'compliance tracking bids', 'audit trail proposals', 'document versioning rfp'],
    search_volume: 170,
    intent: 'commercial',
    cluster: 'software',
    hero_image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop&q=80',
    hero_image_alt: 'Version control timeline showing bid document revisions',
    og_image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop&q=80',
    features: [
      { icon: '🔄', title: 'Auto-Versioning', description: 'Every change automatically saved with full history' },
      { icon: '📜', title: 'Audit Trail', description: 'Complete record of who changed what and when' },
      { icon: '🔙', title: 'Instant Rollback', description: 'Restore any previous version with one click' },
      { icon: '⚖️', title: 'Compliance Ready', description: 'Meet audit requirements with documented changes' },
      { icon: '👥', title: 'Team Visibility', description: 'See all contributor changes in real-time' },
      { icon: '🔍', title: 'Diff Comparison', description: 'Compare any two versions side-by-side' }
    ],
    stats: [
      { value: '100%', label: 'Change Tracking', suffix: '' },
      { value: '0', label: 'Lost Work', suffix: '' },
      { value: 'Instant', label: 'Rollback', suffix: '' },
      { value: 'Full', label: 'Audit Trail', suffix: '' }
    ],
    trust_badges: [
      { name: 'ISO 27001', description: 'Information security management', url: 'https://www.iso.org/iso-27001-information-security.html' },
      ...ukTrustBadges
    ],
    body_content: `## Why Auto-Versioning Matters for Bid Responses

When multiple contributors work on complex bids, version control becomes critical. **Auto-versioning for bid responses** ensures every change is tracked, nothing is lost, and compliance requirements are met.

rfp.quest provides enterprise-grade **bid versioning** built specifically for proposal teams.

### The Cost of Poor Version Control

Without proper versioning, bid teams face:

- **Overwritten work** — Someone's changes lost when another saves
- **"Final_v3_FINAL_actual.docx"** — Version confusion and chaos
- **No audit trail** — Can't demonstrate compliance or trace decisions
- **Merge conflicts** — Hours spent reconciling different versions
- **Accountability gaps** — No record of who made what changes

### How Auto-Versioning Solves These Problems

| Problem | Auto-Versioning Solution |
|---------|--------------------------|
| Overwritten work | Every save creates a recoverable version |
| Version confusion | Clear, chronological version history |
| No audit trail | Complete log with user, timestamp, changes |
| Merge conflicts | Real-time collaboration prevents conflicts |
| Accountability gaps | Named attribution for every change |

## rfp.quest Versioning Features

### Automatic Version Capture

Every change to your bid is automatically versioned:

- **Continuous saves** — Work captured every few minutes
- **Manual checkpoints** — Create named versions at key milestones
- **Section-level tracking** — See changes within specific response areas
- **Attachment versioning** — Supporting documents tracked too

### Complete Audit Trail

Meet compliance and audit requirements with comprehensive tracking:

**What's Recorded:**
- User who made the change
- Exact timestamp
- Section modified
- Before and after content
- Change summary

This audit trail is essential for:
- [GDPR compliance](/gdpr-bid-management) requirements
- ISO 27001 information security
- Government framework audits
- Internal quality assurance

### Visual Comparison Tools

Compare any two versions easily:

- **Side-by-side diff** — See changes highlighted
- **Inline view** — Additions and deletions marked
- **Section-level** — Compare individual responses
- **Export differences** — Share comparison reports

### One-Click Rollback

Made a mistake? Restore instantly:

- Select any previous version
- Preview before restoring
- Full or partial rollback
- Restore to new version (preserves history)

### Real-Time Collaboration

Prevent version conflicts entirely:

- Multiple users edit simultaneously
- See others' cursors and changes live
- Automatic merge handling
- No check-out/check-in required

## Versioning for Compliance

### Government Bid Requirements

Many UK public sector frameworks require:

- **Document control** — Evidence of managed changes
- **Authorisation records** — Who approved what
- **Change justification** — Why amendments were made
- **Submission audit** — Proof of final version submitted

rfp.quest's auto-versioning provides all of this automatically.

### ISO 27001 Alignment

For ISO 27001 certified organisations, document control is mandatory:

- **A.8.1.3** — Asset management and handling
- **A.12.1.2** — Change management
- **A.18.1.3** — Records protection

Our versioning system supports these controls with:
- Immutable version history
- Access logging
- Retention policies
- Export capabilities

### GDPR Compliance

Under UK GDPR, organisations must demonstrate:

- Data processing records
- Consent documentation
- Change tracking for personal data

Our [GDPR-compliant bid management](/gdpr-bid-management) includes versioning as a core component.

## Use Cases for Bid Versioning

### Multi-Author Proposals

When 5+ people contribute to a bid:

1. Each works on assigned sections
2. All changes tracked individually
3. Bid manager sees consolidated history
4. Final review identifies all contributions

### Iterative Client Feedback

When negotiating scope or pricing:

1. Create baseline version
2. Make requested changes
3. Client reviews diff
4. Track each iteration
5. Maintain complete history

### Quality Assurance Reviews

During review cycles:

1. Create "Draft Complete" checkpoint
2. Reviewers make comments/edits
3. Compare review changes
4. Create "Review Complete" version
5. Final approval tracked

### Post-Submission Analysis

After winning or losing:

1. Review version history
2. Identify late changes
3. Analyse decision points
4. Improve future processes

## Integration with Bid Workflow

Versioning integrates with our complete [RFP platform](/rfp-platform):

### Content Library

- Version-controlled content blocks
- Track which responses use which versions
- Update library, see affected bids

### Collaboration Tools

- Comments linked to versions
- Approval workflows versioned
- Assignment history tracked

### Analytics

- Version count per bid (complexity indicator)
- Late changes correlated with outcomes
- Contributor activity metrics

## Comparison: rfp.quest vs. Alternatives

| Feature | rfp.quest | SharePoint | Google Docs | File System |
|---------|-----------|------------|-------------|-------------|
| Auto-versioning | ✅ | ✅ | ✅ | ❌ |
| Section-level tracking | ✅ | ❌ | ❌ | ❌ |
| Compliance audit trail | ✅ | Partial | ❌ | ❌ |
| One-click rollback | ✅ | ✅ | ✅ | ❌ |
| Bid-specific context | ✅ | ❌ | ❌ | ❌ |
| Named checkpoints | ✅ | ❌ | Partial | Manual |
| Diff comparison | ✅ | ✅ | ✅ | ❌ |
| Real-time collaboration | ✅ | ✅ | ✅ | ❌ |

## Getting Started

### Immediate Benefits

From day one, you'll have:

- Automatic versioning on all bids
- Complete change history
- Visual comparison tools
- Rollback capability

### Migration Support

Moving from manual version control:

- Import existing documents
- Preserve document history (where available)
- Establish new baseline versions
- Train team on best practices

### Best Practices

Maximise versioning value:

1. **Create checkpoints** at milestones (Draft, Review, Final)
2. **Add version notes** explaining major changes
3. **Review history** before submission
4. **Export audit trail** for compliance records

## Frequently Asked Questions

### How far back does version history go?

rfp.quest maintains complete version history for the life of your subscription. You can access any version from the day you created the bid.

### Can I restore a partial version?

Yes. You can restore individual sections from previous versions while keeping other sections current. This is useful when you need to undo specific changes without affecting the entire document.

### Does versioning slow down the platform?

No. Our versioning is designed for performance. Versions are captured asynchronously and stored efficiently. Users experience no lag during editing.

### How does versioning work with attachments?

Attachments (PDFs, spreadsheets, images) are version-tracked alongside your bid content. When you update an attachment, both the old and new versions are preserved.

### Can I export version history for audits?

Yes. Export complete version history in PDF or CSV format, including timestamps, users, and change summaries. This export is accepted by most compliance auditors.

---

Experience **auto-versioning for bid responses** with rfp.quest. [Start your free trial](/signup) or explore our [bid management software](/bid-management-software) features.`,
    json_ld: {
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "rfp.quest Bid Versioning",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Auto-versioning for bid responses and compliance tracking with complete audit trail.",
          "url": "https://rfp.quest/bid-versioning",
          "featureList": [
            "Automatic version capture",
            "Complete audit trail",
            "One-click rollback",
            "Visual diff comparison",
            "Real-time collaboration"
          ]
        }
      ]
    }
  },

  // PAGE 3: /gdpr-bid-management - Capitalizing on "gdpr compliant bid management for gov" (position 15.5)
  {
    slug: '/gdpr-bid-management',
    title_tag: 'GDPR Compliant Bid Management Software | Secure RFP Platform | rfp.quest',
    h1: 'GDPR Compliant Bid Management for Government & Enterprise',
    meta_description: 'GDPR compliant bid management software for UK government tenders. Secure proposal platform with data protection, audit trails, and UK data residency. Start free trial.',
    primary_keyword: 'gdpr compliant bid management',
    secondary_keywords: ['gdpr bid management', 'secure bid software', 'gdpr tender software', 'data protection bid management', 'secure rfp platform', 'gdpr compliant proposal software'],
    search_volume: 140,
    intent: 'commercial',
    cluster: 'software',
    hero_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop&q=80',
    hero_image_alt: 'Secure data protection for GDPR compliant bid management',
    og_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=630&fit=crop&q=80',
    features: [
      { icon: '🔒', title: 'UK Data Residency', description: 'All data stored in UK data centres' },
      { icon: '🛡️', title: 'Encryption', description: 'AES-256 encryption at rest and in transit' },
      { icon: '📋', title: 'Audit Logs', description: 'Complete access and change tracking' },
      { icon: '👤', title: 'Access Control', description: 'Role-based permissions and SSO' },
      { icon: '🗑️', title: 'Data Rights', description: 'Easy data export and deletion' },
      { icon: '📜', title: 'DPA Ready', description: 'Data Processing Agreement included' }
    ],
    stats: [
      { value: 'UK', label: 'Data Centres', suffix: '' },
      { value: 'AES-256', label: 'Encryption', suffix: '' },
      { value: '100%', label: 'Audit Trail', suffix: '' },
      { value: 'ISO 27001', label: 'Aligned', suffix: '' }
    ],
    trust_badges: [
      { name: 'ICO Registered', description: 'UK Information Commissioner\'s Office', url: 'https://ico.org.uk/' },
      { name: 'Cyber Essentials Plus', description: 'UK government security standard', url: 'https://www.ncsc.gov.uk/cyberessentials/overview' },
      ...ukTrustBadges.slice(0, 2)
    ],
    body_content: `## GDPR Compliant Bid Management: Why It Matters

When managing bids for UK government and enterprise clients, **GDPR compliant bid management** isn't optional—it's a requirement. Proposals often contain sensitive personal data, confidential business information, and details that require robust data protection.

rfp.quest is built from the ground up for **GDPR compliance**, providing UK organisations with secure, compliant [bid management software](/bid-management-software).

### Personal Data in Bids

Consider what a typical bid contains:

- **Staff CVs** — Names, qualifications, employment history
- **Case studies** — Client contacts, project details
- **References** — Personal contact information
- **Pricing** — Commercial confidential data
- **Subcontractor details** — Third-party information

All of this data falls under UK GDPR. Your bid management platform must handle it appropriately.

### Government Requirements

UK public sector buyers increasingly require evidence of:

- Data protection policies
- Security certifications
- UK data residency
- Incident response procedures
- Subprocessor management

A **GDPR compliant bid management** platform helps you meet these requirements—and win the bid.

## rfp.quest Security & Compliance

### UK Data Residency

All rfp.quest data is stored exclusively in UK data centres:

- **Primary**: AWS London (eu-west-2)
- **Backup**: UK-based disaster recovery
- **No international transfers** without explicit consent
- **Full data sovereignty** for UK organisations

This matters for government bids where UK data residency is mandatory.

### Encryption Standards

Enterprise-grade encryption protects your data:

**At Rest:**
- AES-256 encryption for all stored data
- Encrypted database backups
- Secure key management (AWS KMS)

**In Transit:**
- TLS 1.3 for all connections
- Certificate pinning for mobile apps
- HSTS enforced

### Access Control

Control who can access what:

**Role-Based Access Control (RBAC):**
- Bid Manager — Full bid control
- Contributor — Section-level access
- Reviewer — Read and comment only
- Viewer — Read-only access

**Authentication:**
- Single Sign-On (SSO) via SAML 2.0
- Multi-factor authentication (MFA)
- Azure AD, Google Workspace, Okta integration
- Password policies (complexity, rotation)

### Audit Logging

Complete visibility into platform activity:

**Logged Events:**
- User logins and logouts
- Document access and downloads
- Content changes with [auto-versioning](/bid-versioning)
- Permission changes
- Data exports
- Failed access attempts

**Retention:**
- Configurable retention periods
- Export for compliance audits
- Immutable audit records

## GDPR Compliance Features

### Lawful Basis Management

rfp.quest helps you document lawful basis:

- **Legitimate interest** — Standard for bid management
- **Consent tracking** — Where required
- **Contract basis** — When working with clients

### Data Subject Rights

Support for all GDPR rights:

| Right | rfp.quest Support |
|-------|-------------------|
| Access | Self-service data export |
| Rectification | Easy data editing |
| Erasure | Automated deletion tools |
| Portability | Standard format export |
| Restriction | Processing pause capability |
| Objection | Opt-out tracking |

### Privacy by Design

GDPR compliance built into the platform:

- **Data minimisation** — Only collect what's needed
- **Purpose limitation** — Data used only for bids
- **Storage limitation** — Configurable retention
- **Accuracy** — Version control maintains integrity

### Data Processing Agreement

Our standard DPA covers:

- Processing scope and purpose
- Security measures
- Subprocessor list
- Breach notification procedures
- International transfer safeguards (where applicable)

Enterprise customers can negotiate custom DPA terms.

## Security Certifications

### Cyber Essentials Plus

rfp.quest holds Cyber Essentials Plus certification, demonstrating:

- Secure configuration
- Boundary firewalls
- Access control
- Malware protection
- Patch management

This is often a minimum requirement for government suppliers.

### ISO 27001 Alignment

Our security practices align with ISO 27001:

- Information security management system (ISMS)
- Risk assessment and treatment
- Security controls
- Continuous improvement

Full ISO 27001 certification is on our roadmap.

### SOC 2 Type II

Infrastructure providers (AWS) maintain SOC 2 Type II compliance, covering:

- Security
- Availability
- Processing integrity
- Confidentiality
- Privacy

## Government Bid Requirements

### Security Questionnaires

Common government security questions we help you answer:

**"Where is data stored?"**
> UK data centres only (AWS London eu-west-2)

**"What encryption is used?"**
> AES-256 at rest, TLS 1.3 in transit

**"Do you have Cyber Essentials?"**
> Yes, Cyber Essentials Plus certified

**"Can you provide audit logs?"**
> Yes, complete audit trail with configurable export

**"What's your breach notification process?"**
> 72-hour notification with incident response plan

### Framework Compliance

rfp.quest supports compliance with major frameworks:

- **G-Cloud** — Cloud security requirements
- **DOS** — Digital Outcomes and Specialists
- **CCS frameworks** — Crown Commercial Service standards
- **NHS DSP Toolkit** — Healthcare sector requirements

## Enterprise Security Options

### Dedicated Environments

For organisations requiring additional isolation:

- Single-tenant deployment option
- Dedicated database instances
- Custom security configurations
- Enhanced SLAs

### Advanced Controls

Enterprise features include:

- IP allowlisting
- Custom session policies
- API access controls
- Advanced MFA options
- Security event webhooks

### Vendor Assessment Support

We provide:

- Security questionnaire responses
- Penetration test reports (on request)
- Architecture documentation
- Compliance certificates
- Reference customers

## Implementation & Support

### Secure Onboarding

Getting started securely:

1. **Security review** — Understand your requirements
2. **DPA signing** — Formalise data processing terms
3. **SSO setup** — Integrate with your identity provider
4. **Access configuration** — Set up roles and permissions
5. **Training** — Security best practices for users

### Ongoing Security

Continuous protection includes:

- Regular security updates
- Vulnerability scanning
- Penetration testing (annual)
- Security monitoring
- Incident response team

## Frequently Asked Questions

### Is rfp.quest suitable for government bids?

Yes. rfp.quest is specifically designed for UK government procurement with GDPR compliance, UK data residency, and Cyber Essentials Plus certification. Many of our customers successfully use the platform for public sector bidding.

### Can we get a Data Processing Agreement?

Yes. Our standard DPA is included with all subscriptions. Enterprise customers can negotiate custom terms. Request our DPA from [our team](/demo).

### Where exactly is our data stored?

All data is stored in AWS eu-west-2 (London) data centres. No data is transferred outside the UK unless you explicitly request international access for team members.

### What happens if there's a data breach?

Our incident response plan includes: immediate containment, investigation, ICO notification within 72 hours (where required), customer notification, and post-incident review. We've never had a reportable breach.

### Can we delete all our data?

Yes. You can export all data in standard formats and request complete account deletion. We honour erasure requests within 30 days, maintaining only legally required records.

### Do you process data for your own purposes?

No. We process your data only to provide the service. We don't use customer data for training AI models, advertising, or any purpose beyond bid management functionality.

---

Experience **GDPR compliant bid management** with rfp.quest. [Start your free trial](/signup) with full security features, or [book a security review](/demo) with our team.`,
    json_ld: {
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "rfp.quest GDPR Compliant Bid Management",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "GDPR compliant bid management software with UK data residency, encryption, and audit trails for government tenders.",
          "url": "https://rfp.quest/gdpr-bid-management",
          "featureList": [
            "UK data residency",
            "AES-256 encryption",
            "Complete audit trails",
            "Role-based access control",
            "SSO integration",
            "Data Processing Agreement"
          ]
        }
      ]
    }
  }
];

// ============================================
// HOME PAGE UPDATES - Add "platform" to title/H1
// ============================================

const homePageUpdate = {
  slug: '/',
  title_tag: 'RFP Software & Platform UK | AI-Powered Bid Management | rfp.quest',
  h1: 'RFP Software & Platform | AI-Powered Bid Management UK',
  meta_description: 'The UK\'s leading RFP software platform for managing requests for proposals. AI-powered bid writing, compliance checking, and collaboration tools. Start your free trial.',
  secondary_keywords: [
    'rfp platform',
    'rfp software',
    'tender software',
    'bid management software',
    'tendering software',
    'tender management software',
    'proposal management software',
    'rfp management software',
    'bid writing software',
    'procurement software uk',
    'request for proposal software'
  ]
};

// ============================================
// EXECUTION
// ============================================

async function main() {
  console.log('🚀 Starting SEO optimization (January 2026)...\n');

  // Step 1: Create new pages
  console.log('📝 Creating new SEO pages...');
  for (const page of newSeoPages) {
    try {
      await sql`
        INSERT INTO pages (
          slug, title_tag, h1, meta_description,
          primary_keyword, secondary_keywords, search_volume,
          intent, cluster, hero_image, hero_image_alt, og_image,
          features, stats, trust_badges, body_content, json_ld, status
        ) VALUES (
          ${page.slug},
          ${page.title_tag},
          ${page.h1},
          ${page.meta_description},
          ${page.primary_keyword},
          ${page.secondary_keywords},
          ${page.search_volume},
          ${page.intent},
          ${page.cluster},
          ${page.hero_image},
          ${page.hero_image_alt},
          ${page.og_image},
          ${JSON.stringify(page.features)},
          ${JSON.stringify(page.stats)},
          ${JSON.stringify(page.trust_badges)},
          ${page.body_content},
          ${JSON.stringify(page.json_ld)},
          'published'
        )
        ON CONFLICT (slug) DO UPDATE SET
          title_tag = EXCLUDED.title_tag,
          h1 = EXCLUDED.h1,
          meta_description = EXCLUDED.meta_description,
          primary_keyword = EXCLUDED.primary_keyword,
          secondary_keywords = EXCLUDED.secondary_keywords,
          search_volume = EXCLUDED.search_volume,
          intent = EXCLUDED.intent,
          cluster = EXCLUDED.cluster,
          hero_image = EXCLUDED.hero_image,
          hero_image_alt = EXCLUDED.hero_image_alt,
          og_image = EXCLUDED.og_image,
          features = EXCLUDED.features,
          stats = EXCLUDED.stats,
          trust_badges = EXCLUDED.trust_badges,
          body_content = EXCLUDED.body_content,
          json_ld = EXCLUDED.json_ld,
          status = EXCLUDED.status,
          updated_at = NOW()
      `;
      console.log(`  ✅ Created/updated: ${page.slug}`);
    } catch (error) {
      console.error(`  ❌ Error creating ${page.slug}:`, error);
    }
  }

  // Step 2: Update home page
  console.log('\n📝 Updating home page...');
  try {
    await sql`
      UPDATE pages SET
        title_tag = ${homePageUpdate.title_tag},
        h1 = ${homePageUpdate.h1},
        meta_description = ${homePageUpdate.meta_description},
        secondary_keywords = ${homePageUpdate.secondary_keywords},
        updated_at = NOW()
      WHERE slug = '/'
    `;
    console.log('  ✅ Home page updated with "platform" keyword');
  } catch (error) {
    console.error('  ❌ Error updating home page:', error);
  }

  // Step 3: Add internal links to home page body content
  console.log('\n📝 Adding internal links to home page...');
  try {
    // Get current home page content
    const homePage = await sql`SELECT body_content FROM pages WHERE slug = '/'`;
    if (homePage[0]) {
      let content = homePage[0].body_content as string;

      // Add new sections for the new pages if they don't exist
      if (!content.includes('/rfp-platform')) {
        const platformLink = `\n### RFP Platform\n\nLooking for a complete **[RFP platform](/rfp-platform)**? Our unified platform brings together opportunity discovery, AI-powered writing, team collaboration, and analytics in one cloud-based solution.\n`;

        // Insert before "Why Choose rfp.quest?" section
        content = content.replace(
          '## Why Choose rfp.quest?',
          platformLink + '\n## Why Choose rfp.quest?'
        );
      }

      if (!content.includes('/bid-versioning')) {
        const versioningLink = `- **[Auto-versioning](/bid-versioning)** — Complete version control and audit trails for compliance\n`;

        // Add to the AI & Innovation section if it exists
        if (content.includes('### AI & Innovation')) {
          content = content.replace(
            '### AI & Innovation\n\n',
            '### AI & Innovation\n\n' + versioningLink
          );
        }
      }

      if (!content.includes('/gdpr-bid-management')) {
        const gdprLink = `- **[GDPR Compliant Bid Management](/gdpr-bid-management)** — Secure, compliant proposal management\n`;

        // Add to specialist solutions
        if (content.includes('### Specialist Solutions')) {
          content = content.replace(
            '### Specialist Solutions\n\n',
            '### Specialist Solutions\n\n' + gdprLink
          );
        }
      }

      await sql`
        UPDATE pages SET body_content = ${content}, updated_at = NOW() WHERE slug = '/'
      `;
      console.log('  ✅ Added internal links to new pages');
    }
  } catch (error) {
    console.error('  ❌ Error adding internal links:', error);
  }

  console.log('\n✅ SEO optimization complete!');
  console.log('\nNew pages created:');
  console.log('  - /rfp-platform (targeting "rfp platform" - 34 impressions)');
  console.log('  - /bid-versioning (targeting "auto-versioning for bid responses" - position 11!)');
  console.log('  - /gdpr-bid-management (targeting "gdpr compliant bid management" - position 15)');
  console.log('\nHome page updated:');
  console.log('  - Added "platform" to title and H1');
  console.log('  - Added "rfp platform" to secondary keywords');
  console.log('  - Added internal links to new pages');
}

main().catch(console.error);
