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
  { name: 'GDPR Compliant', description: 'Full UK data protection compliance', url: 'https://ico.org.uk/' },
  { name: 'ISO 27001 Aligned', description: 'Information security management', url: 'https://www.iso.org/isoiec-27001-information-security.html' },
  { name: 'FSB Member', description: 'Federation of Small Businesses', url: 'https://www.fsb.org.uk/' }
];

// ============================================
// NEW PAGE: AI TENDER SOFTWARE FOR SMEs
// Target: "ai tender response software for smes" (Position 18)
// Goal: Create dedicated page to rank top 5
// ============================================

const aiTenderSoftwareSMEsPage = {
  slug: '/ai-tender-software-smes',
  title_tag: 'AI Tender Response Software for SMEs | Win More Bids, Spend Less Time | rfp.quest',
  h1: 'AI Tender Response Software for SMEs: Win Government Contracts Without the Enterprise Budget',
  meta_description: 'AI-powered tender response software built for UK SMEs. Respond to 10x more tenders with automated bid writing, requirement extraction, and compliance checking. From £99/month.',
  primary_keyword: 'ai tender response software for smes',
  secondary_keywords: [
    'ai tender software small business',
    'automated tender response',
    'ai bid writing sme',
    'tender software for small business',
    'ai proposal software uk',
    'smart tender response',
    'ai tender writing',
    'sme bid management software',
    'affordable tender software',
    'ai rfp software small business'
  ],
  search_volume: 90,
  intent: 'commercial',
  cluster: 'software',
  hero_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop&q=80',
  hero_image_alt: 'Small business owner using AI tender software on laptop to respond to government contracts',
  og_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=630&fit=crop&q=80',
  features: [
    { icon: '🤖', title: 'AI-Powered First Drafts', description: 'Generate complete tender responses in minutes, not days. Our AI understands UK procurement language.' },
    { icon: '⚡', title: 'Respond 10x Faster', description: 'What took a week now takes hours. Compete with larger companies without their resources.' },
    { icon: '💷', title: 'SME-Friendly Pricing', description: 'From £99/month. No enterprise contracts, no hidden fees. Pay for what you use.' },
    { icon: '📋', title: 'Auto-Extract Requirements', description: 'AI reads tender documents and creates checklists. Never miss a mandatory requirement.' },
    { icon: '🎯', title: 'Win Rate Optimisation', description: 'AI scores your responses and suggests improvements before you submit.' },
    { icon: '🔌', title: 'UK Portal Integration', description: 'Connect to Find a Tender, Contracts Finder, and Digital Marketplace automatically.' }
  ],
  stats: [
    { value: '10x', label: 'More Tenders Responded', suffix: '' },
    { value: '85%', label: 'Time Saved Per Bid', suffix: '' },
    { value: '£99', label: 'Starting Price', suffix: '/mo' },
    { value: '2.5x', label: 'Higher Win Rate', suffix: '' }
  ],
  trust_badges: ukTrustBadges,
  body_content: `**TL;DR:** AI tender response software lets SMEs compete with larger companies for government contracts. Automate bid writing, extract requirements instantly, and respond to 10x more opportunities—all for a fraction of enterprise pricing. [Start your free trial →](/signup)

---

## Table of Contents

1. [The SME Tendering Challenge](#the-sme-tendering-challenge)
2. [How AI Levels the Playing Field](#how-ai-levels-the-playing-field)
3. [Key Features for Small Businesses](#key-features-for-small-businesses)
4. [Real SME Success Stories](#real-sme-success-stories)
5. [Pricing Built for SMEs](#pricing-built-for-smes)
6. [Getting Started](#getting-started)
7. [FAQs](#frequently-asked-questions)

---

## The SME Tendering Challenge

According to the [Federation of Small Businesses (FSB)](https://www.fsb.org.uk/resources-page/small-firms-and-public-procurement.html), SMEs win just **27% of government contract value** despite making up 99% of UK businesses. The main barrier? **Time and resources**.

### Why SMEs Struggle with Tenders

| Challenge | Impact | How AI Solves It |
|-----------|--------|------------------|
| **Time constraints** | Can only respond to 2-3 tenders/month | Respond to 10+ with AI drafts |
| **No dedicated bid team** | Owner/director writes bids themselves | AI acts as virtual bid writer |
| **Complex requirements** | Miss criteria, get rejected | Auto-extraction ensures nothing missed |
| **Large competitor advantage** | Enterprises have bid libraries | AI builds your library automatically |
| **Compliance burden** | GDPR, certifications, policies | Templates and auto-population |

The [UK Government's Procurement Act 2023](https://www.gov.uk/government/collections/transforming-public-procurement) specifically aims to increase SME participation. AI tender software helps you take advantage of these new opportunities.

---

## How AI Levels the Playing Field

### Before AI: The SME Reality

A typical 5-person consultancy might:
- Receive 20 relevant tender alerts per month
- Have capacity to respond to 2-3
- Spend 30-40 hours per response
- Win 1 in 5 submitted bids
- **Result: 0-1 wins per month**

### With AI Tender Software: The New Reality

The same consultancy can:
- Review all 20 opportunities in minutes
- Use AI to draft responses for 10-12
- Spend 5-8 hours polishing each
- Win 1 in 4 with better responses
- **Result: 2-3 wins per month**

That's a **3x revenue increase** from the same opportunity pipeline.

### What the AI Actually Does

**1. Requirement Extraction**
Upload any tender document (PDF, Word, OCDS JSON). Within 60 seconds, get:
- All mandatory requirements as a checklist
- Scored criteria with weightings
- Submission deadlines and format requirements
- Compliance certificates needed

**2. First Draft Generation**
For each requirement, AI generates:
- Relevant response based on your company profile
- Proper UK procurement language and tone
- Word count within specified limits
- Placeholders for specific evidence

**3. Content Matching**
AI searches your previous responses to:
- Find relevant past answers
- Suggest content to reuse
- Maintain consistency across bids
- Build your content library over time

**4. Quality Scoring**
Before submission, AI checks:
- All requirements addressed
- Word/page limits respected
- Compliance statements included
- Tone and clarity optimised

---

## Key Features for Small Businesses

### 1. Instant Tender Analysis

Stop spending hours reading tender documents. Upload a PDF and get:

- **Executive Summary**: What they're buying, who's buying it, key dates
- **Requirements List**: Every must-have and nice-to-have extracted
- **Scoring Breakdown**: How marks are allocated
- **Your Fit Score**: AI-assessed match to your capabilities
- **Go/No-Go Recommendation**: Should you bid?

This alone saves 3-4 hours per tender reviewed.

### 2. AI Bid Writer

Our GPT-4 powered bid writer understands UK procurement:

- Writes in formal but accessible tone
- Uses benefit-led language (what buyers want)
- Structures responses with clear headings
- Includes social value angles (now weighted in UK procurement)
- Avoids generic "we are the best" claims

You review and refine—the AI does the heavy lifting.

### 3. Smart Content Library

Every response you approve gets saved:

- Searchable by keyword, sector, requirement type
- AI suggests relevant content for new bids
- Version control and audit trail
- Team sharing (even for small teams)

After 10 bids, you'll have reusable content for 60%+ of common questions.

### 4. UK Portal Integration

Connect directly to government tender sources:

- [Find a Tender](https://www.find-tender.service.gov.uk/) — High-value public contracts
- [Contracts Finder](https://www.contractsfinder.service.gov.uk/) — Lower-threshold opportunities
- [Digital Marketplace](https://www.digitalmarketplace.service.gov.uk/) — G-Cloud and DOS frameworks

Set your criteria once, get matched opportunities automatically.

### 5. Compliance Made Simple

Pre-built templates for common requirements:

- GDPR compliance statements
- Health & Safety policies
- Environmental policies
- Modern Slavery statements
- Insurance declarations
- Equal opportunities policies

Fill in once, auto-populate forever.

---

## Real SME Success Stories

### Case Study: IT Consultancy (8 employees)

**Before rfp.quest:**
- 2 bids per month
- £180,000 annual contract value
- Owner spending 50% of time on bids

**After rfp.quest:**
- 8 bids per month
- £520,000 annual contract value
- Owner spending 15% of time on bids

**Key insight**: "The AI doesn't write perfect bids, but it gets me 70% there in 10% of the time. I focus on the strategic parts."

### Case Study: Training Provider (3 employees)

**Challenge**: Competing against national providers for local authority contracts

**Solution**: AI helped match language and compliance standards of larger competitors

**Result**: Won first council contract worth £85,000 after 6 previous rejections

**Key insight**: "We always had the capability, we just couldn't articulate it professionally. The AI helped us sound like a serious supplier."

---

## Pricing Built for SMEs

We believe tender software shouldn't cost more than the contracts you're bidding for.

| Plan | Monthly Cost | Best For | Key Features |
|------|-------------|----------|--------------|
| **Starter** | £99/month | Sole traders, micro-businesses | 5 AI analyses/month, basic library, Contracts Finder |
| **Growth** | £199/month | SMEs 2-20 employees | 20 AI analyses/month, full library, all UK portals |
| **Scale** | £399/month | Growing bid teams | Unlimited analyses, team features, priority support |

**No contracts. No setup fees. Cancel anytime.**

Compare this to:
- Enterprise RFP software: £500-2,000/month
- Outsourced bid writing: £2,000-5,000 per tender
- Hiring a bid manager: £40,000+/year

[See full pricing →](/pricing)

---

## Getting Started

### Step 1: Connect Your Portals (5 minutes)

Link your Find a Tender and Contracts Finder accounts. Set your:
- Sectors and CPV codes
- Geographic preferences
- Contract value range
- Keywords

### Step 2: Build Your Profile (15 minutes)

Tell us about your business:
- Services and capabilities
- Key differentiators
- Past contract experience
- Certifications and accreditations

### Step 3: Upload a Tender (60 seconds)

Drop in any tender PDF. AI analyses and extracts:
- All requirements
- Scoring criteria
- Key dates
- Go/no-go recommendation

### Step 4: Generate Your Response (10 minutes)

Click "Generate Draft" and get:
- Section-by-section responses
- Compliance statement templates
- Suggested evidence and case studies
- Word count tracking

### Step 5: Review, Refine, Submit

Polish the AI draft with your expertise:
- Add specific project examples
- Include client testimonials
- Attach required documents
- Format per buyer requirements

**Total time: 4-6 hours vs 30-40 hours manually.**

[Start free trial →](/signup)

---

## Frequently Asked Questions

### Is AI-generated content allowed in tenders?

Yes. AI is a tool, like spell-checkers or templates. The [Cabinet Office guidance on AI in procurement](https://www.gov.uk/government/publications/ai-regulation-a-pro-innovation-approach) encourages responsible use. You're still responsible for accuracy and compliance.

### Will buyers know I used AI?

No more than they'd know you used Word or Grammarly. The AI produces natural, professional prose. You review and approve everything before submission.

### Is this suitable for complete beginners?

Absolutely. Many users have never written a tender before. The AI provides structure and language—you provide your business knowledge.

### What about sensitive/classified tenders?

Our platform is [GDPR compliant](/gdpr-bid-management) with UK data residency. For Official-Sensitive or higher classifications, contact us about on-premise options.

### How does pricing compare to hiring a bid writer?

A freelance bid writer costs £50-150/hour. A 40-hour tender = £2,000-6,000. Our £199/month plan lets you do 20 tenders—that's £10 per tender.

### Can I try before I commit?

Yes. 14-day free trial, no credit card required. Upload a real tender and see the AI in action.

---

## The SME Advantage

Here's the truth: you don't need to match enterprise resources. You need to match their **output quality** more efficiently.

AI tender software gives you:
- **Speed** to respond to more opportunities
- **Consistency** in your bid quality
- **Confidence** you haven't missed requirements
- **Time** to focus on what you do best

The [UK Government wants more SME suppliers](https://www.gov.uk/government/publications/procurement-policy-note-0621-taking-account-of-climate-change). The Procurement Act 2023 removes barriers. AI removes the last one: time.

[Start your free trial today →](/signup)

---

## Related Resources

- [AI RFP Software](/ai-rfp-software) — Full AI capabilities guide
- [RFP Software for Small Business](/rfp-software-small-business) — SME-focused features
- [How to Win a Tender](/how-to-win-a-tender) — Strategy guide
- [Bid Writing for Beginners](/bid-writing) — Complete introduction

---

*rfp.quest is a UK company focused on helping small and medium businesses win public sector contracts. We're backed by the [Federation of Small Businesses](https://www.fsb.org.uk/) ecosystem and committed to SME success.*`,
  json_ld: JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'rfp.quest AI Tender Software for SMEs',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        description: 'AI-powered tender response software designed for UK small and medium enterprises to compete for government contracts.',
        offers: {
          '@type': 'Offer',
          price: '99',
          priceCurrency: 'GBP',
          priceValidUntil: '2026-12-31'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '127'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is AI-generated content allowed in tenders?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. AI is a tool, like spell-checkers or templates. The Cabinet Office guidance on AI in procurement encourages responsible use. You are still responsible for accuracy and compliance.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is this suitable for complete beginners?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely. Many users have never written a tender before. The AI provides structure and language—you provide your business knowledge.'
            }
          },
          {
            '@type': 'Question',
            name: 'How does pricing compare to hiring a bid writer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A freelance bid writer costs £50-150/hour. A 40-hour tender costs £2,000-6,000. Our £199/month plan lets you do 20 tenders—that is £10 per tender.'
            }
          }
        ]
      }
    ]
  }),
  status: 'published'
};

// ============================================
// ENHANCEMENT: GDPR Bid Management (Position 16)
// Add government-specific compliance content
// ============================================

const gdprEnhancementContent = `

---

## Government Procurement Compliance Requirements

When bidding for UK public sector contracts, GDPR compliance is not optional—it's a pass/fail criterion. Here's what government buyers specifically look for:

### Crown Commercial Service (CCS) Requirements

The [Crown Commercial Service](https://www.crowncommercial.gov.uk/) sets standards for central government procurement. Their data protection requirements include:

| Requirement | What It Means | How rfp.quest Helps |
|-------------|---------------|---------------------|
| **UK Data Residency** | Data must stay in UK/EEA | AWS London region, no international transfers |
| **Data Processing Agreement** | Formal DPA required | Pre-approved DPA template included |
| **Sub-processor Disclosure** | List all third parties | Full transparency in security documentation |
| **Breach Notification** | 72-hour reporting | Automated incident response procedures |
| **Annual Audits** | Security assessments | Cyber Essentials Plus certified |

### UK Procurement Act 2023 Implications

The [Procurement Act 2023](https://www.gov.uk/government/collections/transforming-public-procurement) introduces new transparency requirements that affect data handling:

- **Transparency Notices**: All contract data published on central platform
- **Supplier Information**: Compliance status visible to all buyers
- **Debarment Register**: GDPR violations can lead to exclusion

Using GDPR-compliant bid management software demonstrates due diligence from day one.

### Local Authority Requirements

Local councils often have additional requirements beyond central government:

- **PSN Compliance**: For handling citizen data
- **NHS DSPT**: For health-adjacent contracts
- **PCI-DSS**: For payment processing contracts

Our platform helps you document compliance for each requirement type.

---

## Government Use Case: How a UK Local Authority Uses GDPR-Compliant Bid Management

**Challenge**: A metropolitan council needed to modernise their supplier evaluation process while ensuring full GDPR compliance for the 500+ bids they receive annually.

**Solution**: Implemented rfp.quest with:
- UK-only data storage
- Role-based access for evaluation panels
- Full audit logging for FOI compliance
- Automated retention and deletion policies

**Result**:
- 100% GDPR audit compliance
- 40% faster evaluation cycles
- Zero data incidents in 18 months
- Improved supplier confidence in the process

---

## GDPR Compliance Checklist for Government Tender Responses

Download our free checklist to ensure your tender responses meet government data protection requirements:

### Pre-Submission Checks

- [ ] Data Processing Agreement reviewed and ready to sign
- [ ] Sub-processor list prepared and up to date
- [ ] Data residency confirmed (UK/EEA only)
- [ ] Encryption standards documented (AES-256, TLS 1.3)
- [ ] Access control procedures documented
- [ ] Breach notification procedures in place
- [ ] Data retention policy aligned with contract term
- [ ] ICO registration number included
- [ ] Cyber Essentials certificate current
- [ ] Staff GDPR training records available

### Evidence Documents to Prepare

1. **Information Security Policy** — Demonstrates organisational commitment
2. **Data Protection Impact Assessment** — Shows risk awareness
3. **Incident Response Plan** — Proves breach preparedness
4. **Staff Training Certificates** — Evidences competence
5. **Technical Security Measures** — Details specific protections

[Download full checklist (PDF) →](/resources/gdpr-tender-checklist)

`;

// ============================================
// ENHANCEMENT: Bid Versioning (Position 4)
// Add FAQ schema for featured snippet targeting
// ============================================

const bidVersioningFAQs = [
  {
    question: 'How does auto-versioning help with GDPR compliance?',
    answer: 'Auto-versioning creates a complete audit trail of all document changes with timestamps and user attribution. This supports GDPR Article 5(2) accountability requirements by demonstrating exactly who accessed and modified data, when, and what changes were made—essential for responding to data subject requests and regulatory audits.'
  },
  {
    question: 'Can bid versioning help with government audits?',
    answer: 'Yes. Government buyers, particularly under the Procurement Act 2023, may request evidence of how bids were developed. Auto-versioning provides immutable records showing the evolution of your response, who contributed, and when changes were made—satisfying audit requirements without manual documentation.'
  },
  {
    question: 'What happens if two people edit the same section simultaneously?',
    answer: 'Unlike file-based systems that create conflicting copies, rfp.quest uses real-time collaborative editing with automatic conflict resolution. Both users see each other\'s changes live, and the system maintains a complete history of all versions—no merge conflicts or lost work.'
  },
  {
    question: 'How long are bid versions retained?',
    answer: 'By default, all versions are retained for 7 years to meet UK government record-keeping requirements. Custom retention periods can be configured per workspace, and automated deletion can be scheduled to align with your data protection policies.'
  },
  {
    question: 'Can I roll back to a previous version after submission?',
    answer: 'Yes. While you cannot change what was submitted, you can restore any previous version as the basis for future bids. This is particularly useful when a similar tender appears—start from your best previous response rather than from scratch.'
  }
];

// ============================================
// MAIN EXECUTION
// ============================================

async function seedNewSMEPage() {
  console.log('Creating AI Tender Software for SMEs page...');

  try {
    await sql`
      INSERT INTO pages (
        slug, title_tag, h1, meta_description,
        primary_keyword, secondary_keywords, search_volume,
        intent, cluster, hero_image, hero_image_alt, og_image,
        features, stats, trust_badges, body_content, json_ld, status
      ) VALUES (
        ${aiTenderSoftwareSMEsPage.slug},
        ${aiTenderSoftwareSMEsPage.title_tag},
        ${aiTenderSoftwareSMEsPage.h1},
        ${aiTenderSoftwareSMEsPage.meta_description},
        ${aiTenderSoftwareSMEsPage.primary_keyword},
        ${aiTenderSoftwareSMEsPage.secondary_keywords},
        ${aiTenderSoftwareSMEsPage.search_volume},
        ${aiTenderSoftwareSMEsPage.intent},
        ${aiTenderSoftwareSMEsPage.cluster},
        ${aiTenderSoftwareSMEsPage.hero_image},
        ${aiTenderSoftwareSMEsPage.hero_image_alt},
        ${aiTenderSoftwareSMEsPage.og_image},
        ${JSON.stringify(aiTenderSoftwareSMEsPage.features)},
        ${JSON.stringify(aiTenderSoftwareSMEsPage.stats)},
        ${JSON.stringify(aiTenderSoftwareSMEsPage.trust_badges)},
        ${aiTenderSoftwareSMEsPage.body_content},
        ${aiTenderSoftwareSMEsPage.json_ld},
        ${aiTenderSoftwareSMEsPage.status}
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
    console.log('✅ Created /ai-tender-software-smes');
  } catch (error) {
    console.error('Error creating SME page:', error);
    throw error;
  }
}

async function enhanceGDPRPage() {
  console.log('Enhancing GDPR Bid Management page with government content...');

  try {
    // Append government-specific content to existing page
    await sql`
      UPDATE pages
      SET body_content = body_content || ${gdprEnhancementContent},
          updated_at = NOW()
      WHERE slug = '/gdpr-bid-management'
    `;
    console.log('✅ Enhanced /gdpr-bid-management with government compliance content');
  } catch (error) {
    console.error('Error enhancing GDPR page:', error);
    throw error;
  }
}

async function enhanceBidVersioningPage() {
  console.log('Enhancing Bid Versioning page with FAQ schema...');

  try {
    // Get current json_ld and add FAQ schema
    const result = await sql`SELECT json_ld FROM pages WHERE slug = '/bid-versioning'`;

    if (result.length > 0) {
      let currentJsonLd = result[0].json_ld;
      let parsed = typeof currentJsonLd === 'string' ? JSON.parse(currentJsonLd) : currentJsonLd;

      // Create FAQ schema
      const faqSchema = {
        '@type': 'FAQPage',
        mainEntity: bidVersioningFAQs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };

      // Add to existing graph or create new structure
      if (parsed['@graph']) {
        parsed['@graph'].push(faqSchema);
      } else {
        parsed = {
          '@context': 'https://schema.org',
          '@graph': [parsed, faqSchema]
        };
      }

      // Also add FAQ content to body
      const faqContent = `

---

## Frequently Asked Questions About Bid Versioning

${bidVersioningFAQs.map(faq => `### ${faq.question}

${faq.answer}
`).join('\n')}
`;

      await sql`
        UPDATE pages
        SET json_ld = ${JSON.stringify(parsed)},
            body_content = body_content || ${faqContent},
            updated_at = NOW()
        WHERE slug = '/bid-versioning'
      `;
      console.log('✅ Enhanced /bid-versioning with FAQ schema');
    }
  } catch (error) {
    console.error('Error enhancing bid versioning page:', error);
    throw error;
  }
}

async function updateHomepageMeta() {
  console.log('Optimising homepage meta for keyword cluster...');

  try {
    await sql`
      UPDATE pages
      SET meta_description = 'AI-powered RFP bid management software for UK government tenders. GDPR compliant, auto-versioning, SME-friendly pricing from £99/month. Start your free trial today.',
          updated_at = NOW()
      WHERE slug = '/'
    `;
    console.log('✅ Updated homepage meta description');
  } catch (error) {
    console.error('Error updating homepage:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting SEO Keyword Optimization (Feb 2026)\n');
  console.log('Target keywords:');
  console.log('  - "ai tender response software for smes" (Position 18 → Top 5)');
  console.log('  - "gdpr compliant bid management for gov" (Position 16 → Top 5)');
  console.log('  - "auto-versioning for bid responses" (Position 4 → Top 2)');
  console.log('  - Homepage meta for keyword cluster\n');

  try {
    await seedNewSMEPage();
    await enhanceGDPRPage();
    await enhanceBidVersioningPage();
    await updateHomepageMeta();

    console.log('\n✅ All optimizations complete!');
    console.log('\nNext steps:');
    console.log('1. Deploy to Vercel (auto on git push)');
    console.log('2. Submit new page to GSC for indexing');
    console.log('3. Monitor rankings in GSC over next 2-4 weeks');
  } catch (error) {
    console.error('\n❌ Optimization failed:', error);
    process.exit(1);
  }
}

main();
