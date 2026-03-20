#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

interface CertPage {
  url: string
  primaryKeyword: string
  secondaryKeywords: string[]
  h1: string
  metaTitle: string
  metaDescription: string
  facts: string[]
  sections: { title: string; content: string }[]
  faq: { q: string; a: string }[]
  externalLinks: { text: string; url: string }[]
  relatedPages: string[]
  searchVolume: number
  priority: number
}

const certPages: CertPage[] = [
  // CLUSTER 1: Defence and Aerospace
  {
    url: '/certifications/joscar-defence-tenders',
    primaryKeyword: 'JOSCAR defence tenders',
    secondaryKeywords: ['JOSCAR certification UK', 'JOSCAR aerospace supply chain', 'Rolls-Royce JOSCAR', 'BAE Systems supply chain qualification'],
    h1: 'JOSCAR for UK Defence Tenders: Supply Chain Certification Guide',
    metaTitle: 'JOSCAR Defence Tenders UK: Supply Chain Cert Guide 2026',
    metaDescription: 'JOSCAR is the mandatory pre-qualification for UK defence and aerospace supply chains. Required by BAE Systems, Rolls-Royce, Airbus UK. Complete 2026 guide.',
    searchVolume: 720,
    priority: 1,
    facts: [
      'JOSCAR = Joint Supply Chain Accreditation Register',
      'Operated by Hellios Information Ltd',
      'Mandatory for suppliers to BAE Systems, Rolls-Royce, Airbus UK, GKN Aerospace, Leonardo, MBDA, Thales, Safran, Raytheon UK',
      'Two tiers: Self-Assessment and Full Assessment (audited)',
      'Covers H&S, environmental, quality, financial, ethical trading, cybersecurity',
      'Self-assessment: free; Full Assessment: £500-£1,500+/year',
      'Timeline: self-assessment immediate; full assessment 4-8 weeks',
      'Without JOSCAR: cannot appear in Hellios supplier search'
    ],
    sections: [
      {
        title: 'What is JOSCAR and who requires it?',
        content: `JOSCAR (Joint Supply Chain Accreditation Register) is the unified pre-qualification system used by the UK's aerospace and defence prime contractors. Originally developed by ADS Group (the trade association for UK aerospace, defence, security and space sectors), JOSCAR is now operated by Hellios Information Ltd.

The system was created to eliminate duplication in supply chain qualification. Instead of completing separate pre-qualification questionnaires for each prime contractor, suppliers complete JOSCAR once and share their data with multiple buyers. This reduces the administrative burden on both suppliers and buyers while ensuring consistent standards across the defence supply chain.

Major UK defence companies that require JOSCAR include BAE Systems, Rolls-Royce, Airbus UK, Leonardo, MBDA UK, Thales UK, GKN Aerospace, Safran Helicopter Engines UK, Raytheon UK, and QinetiQ. If you want to supply any of these organisations, JOSCAR registration is typically the first step in their supplier onboarding process.`
      },
      {
        title: 'JOSCAR vs SSIP: different sectors, different schemes',
        content: `While JOSCAR and SSIP (Safety Schemes in Procurement) might seem similar, they serve completely different sectors and are not interchangeable. SSIP is primarily for construction and general health & safety pre-qualification, while JOSCAR is specifically designed for aerospace and defence supply chains.

JOSCAR goes far beyond health and safety, covering quality management, environmental compliance, financial stability, ethical trading, information security, and sector-specific requirements like ITAR (International Traffic in Arms Regulations) compliance and export control awareness. The assessment criteria are tailored to the unique requirements of defence manufacturing and aerospace engineering.

You cannot use SSIP certification to satisfy JOSCAR requirements, nor vice versa. If you work across both construction and defence sectors, you'll need both certifications.`
      },
      {
        title: 'Which UK defence companies use JOSCAR?',
        content: `The JOSCAR system is used by virtually all major UK defence and aerospace prime contractors. Here's a comprehensive list of organisations that require or prefer JOSCAR:

**Tier 1 Primes:** BAE Systems (all UK divisions), Rolls-Royce (Defence Aerospace), Airbus UK, Leonardo UK, MBDA UK, Thales UK, Babcock International, QinetiQ, Raytheon UK, General Dynamics UK.

**Aerospace Manufacturers:** GKN Aerospace, Safran Landing Systems UK, Safran Helicopter Engines UK, Collins Aerospace UK, Spirit AeroSystems Belfast, Marshall Aerospace and Defence Group.

**Defence Systems:** Ultra Electronics, Cobham (now part of Advent International), Meggitt (now part of Parker Hannifin), Martin-Baker Aircraft, L3Harris Technologies UK.

**Support Services:** Serco Defence, KBR UK, Lockheed Martin UK, Northrop Grumman UK, Boeing Defence UK.

Each organisation may have different minimum requirements within JOSCAR. For example, BAE Systems might require Full Assessment for direct suppliers but accept Self-Assessment for lower-tier suppliers.`
      },
      {
        title: 'Self-assessment vs Full Assessment: which do you need?',
        content: `JOSCAR offers two levels of accreditation, and choosing the right one depends on your customer requirements and contract values.

**Self-Assessment (Entry Level):**
- Online questionnaire completed by supplier
- Covers basic compliance areas
- No external verification
- Free to complete
- Suitable for: lower-risk supplies, indirect materials, small contract values
- Valid for 12 months
- Can be completed in 1-2 days

**Full Assessment (Verified):**
- Self-assessment PLUS independent audit
- Desktop or on-site verification by approved auditor
- Required for: direct production suppliers, safety-critical components, high-value contracts
- Cost: £500-£1,500+ depending on company size and complexity
- Timeline: 4-8 weeks including audit scheduling
- Valid for 12-months with surveillance visits

Most prime contractors specify which level they require in their supplier requirements. As a general rule, if you're supplying components that go into aircraft, weapons systems, or safety-critical applications, expect to need Full Assessment. For supplies of commercial off-the-shelf items, tooling, or support services, Self-Assessment may suffice.`
      },
      {
        title: 'JOSCAR and government defence contracts',
        content: `While JOSCAR is primarily a requirement of defence prime contractors rather than the MOD directly, it plays a crucial role in government defence contracts through the supply chain.

When the MOD awards major contracts to prime contractors like BAE Systems or Rolls-Royce, these primes are responsible for managing their supply chains. They use JOSCAR as their primary tool for ensuring supply chain compliance with MOD requirements including:

- Defence Standards (DEF STANs)
- Security requirements (including personnel security)
- Export control and ITAR compliance
- Quality standards (AS9100 for aerospace)
- Cyber security requirements (Cyber Essentials, DEFSTAN 05-138)
- Modern Slavery Act compliance
- Anti-bribery and corruption policies

If you're bidding for MOD contracts as a prime contractor, you won't need JOSCAR. However, if you're planning to be a subcontractor to a prime on MOD programmes, JOSCAR is almost certainly required. This creates a two-tier system where JOSCAR acts as the gateway to the defence supply chain below prime contractor level.`
      }
    ],
    faq: [
      {
        q: 'Is JOSCAR mandatory for all UK defence contracts?',
        a: 'JOSCAR is mandatory for supplying to major UK defence primes including BAE Systems, Rolls-Royce, Airbus UK, Leonardo, and MBDA. While not required for direct MOD contracts, it\'s essential for subcontracting to defence primes. Without JOSCAR, you won\'t appear in the Hellios supplier database these companies use for sourcing.'
      },
      {
        q: 'How much does JOSCAR certification cost?',
        a: 'JOSCAR Self-Assessment is free. Full Assessment costs £500-£1,500+ per year depending on company size and audit complexity. Additional costs may include consultant support (£1,000-£3,000) if you need help preparing for assessment. Annual renewal fees apply for maintaining your registration.'
      },
      {
        q: 'How long does JOSCAR accreditation take?',
        a: 'Self-Assessment can be completed in 1-2 days if you have all documentation ready. Full Assessment takes 4-8 weeks: 1-2 weeks for self-assessment completion, 2-4 weeks for audit scheduling, 1-2 days for the audit itself, and 1 week for report and certification. Having quality, environmental and H&S systems already in place speeds up the process.'
      },
      {
        q: 'What\'s the difference between JOSCAR and AS9100?',
        a: 'JOSCAR is a pre-qualification system covering multiple compliance areas (quality, H&S, environment, security, ethics). AS9100 is specifically an aerospace quality management standard. Many defence contractors require both: JOSCAR for pre-qualification and AS9100 for quality assurance. JOSCAR Full Assessment often verifies that you have AS9100 but doesn\'t replace it.'
      },
      {
        q: 'Can I use JOSCAR for non-defence contracts?',
        a: 'JOSCAR is primarily recognised within aerospace and defence sectors. While the accreditation demonstrates good business practices, it\'s not typically recognised in other sectors like construction, utilities, or general manufacturing. For those sectors, you\'ll need relevant schemes like CHAS, Achilles UVDB, or SafeContractor.'
      }
    ],
    externalLinks: [
      { text: 'Hellios Information (JOSCAR operator)', url: 'https://hellios.com' },
      { text: 'ADS Group (UK Aerospace, Defence & Security)', url: 'https://www.adsgroup.org.uk' },
      { text: 'Defence and Security Accelerator', url: 'https://www.gov.uk/government/organisations/defence-and-security-accelerator' }
    ],
    relatedPages: ['/certifications/as9100-aerospace-tenders', '/certifications/security-clearance-uk-defence-tenders', '/certifications/defstan-05-138-defence-cyber']
  },

  // Priority 1: RISQS for Rail
  {
    url: '/certifications/risqs-rail-tenders',
    primaryKeyword: 'RISQS rail tenders UK',
    secondaryKeywords: ['RISQS certification cost', 'railway supplier qualification', 'Network Rail supplier qualification', 'RISQS vs CHAS'],
    h1: 'RISQS for UK Rail Tenders: Railway Supplier Qualification Guide',
    metaTitle: 'RISQS Rail Tenders UK: Supplier Qualification Guide 2026',
    metaDescription: 'RISQS is the mandatory entry point for UK rail industry tenders. Required by Network Rail, TfL and all major rail operators. Cost from £400. 2026 guide.',
    searchVolume: 890,
    priority: 1,
    facts: [
      'RISQS = Railway Industry Supplier Qualification Scheme',
      'Operated by RSSB (Rail Safety and Standards Board)',
      'Mandatory for Network Rail, TfL, HS2, all rail operators',
      'Covers H&S, quality, environmental, financial standing',
      'Two components: RISQS registration + RISQS Audit',
      'Registration from £400/year; Audit additional cost',
      'Timeline: 4-6 weeks for full qualification',
      'NOT the same as CHAS or SSIP - rail-specific'
    ],
    sections: [
      {
        title: 'What is RISQS and who needs it?',
        content: `RISQS (Railway Industry Supplier Qualification Scheme) is the mandatory pre-qualification system for any company wanting to work in the UK rail industry. Operated by RSSB (Rail Safety and Standards Board), RISQS acts as the single entry point for suppliers to the entire UK rail sector.

The scheme was established to streamline supplier assessment across the rail industry. Instead of completing different pre-qualification questionnaires for each rail company, suppliers complete RISQS once and share their verified data with multiple buyers. This creates efficiency for both suppliers and rail infrastructure managers while ensuring consistent safety and quality standards.

You need RISQS if you want to supply to: Network Rail (infrastructure owner), Transport for London (TfL/London Underground), HS2, CrossRail/Elizabeth Line, National Rail train operating companies (TOCs), freight operating companies (FOCs), rolling stock companies (ROSCOs), light rail and metro systems (Manchester Metrolink, Edinburgh Trams, etc.), or any principal contractors working on rail projects.

Without RISQS, you cannot tender for rail contracts, appear on approved supplier lists, or work on rail infrastructure - even as a subcontractor.`
      },
      {
        title: 'RISQS registration vs RISQS audit: what\'s the difference?',
        content: `RISQS has two distinct components that often cause confusion. Understanding the difference is crucial for proper compliance and budgeting.

**RISQS Registration (Basic Qualification):**
This is the online questionnaire covering company information, financial data, insurances, health and safety policies, quality management, environmental policies, and competency/experience evidence. Registration alone allows you to be visible to buyers and tender for lower-risk work. Cost: from £400/year for small companies, scaling with turnover.

**RISQS Audit (Verified Qualification):**
This is an independent on-site audit to verify your management systems against rail industry standards. The audit is mandatory for higher-risk work including: all track-side work, signalling and telecoms, electrical work, work affecting train operations, principal contractor roles, and safety-critical activities. Audit costs vary by scope (typically £1,500-£5,000) and are additional to registration fees.

Many suppliers start with registration only, then add audit capability as they win contracts requiring it. However, for most infrastructure work, both registration AND audit are required from day one.`
      },
      {
        title: 'Which UK rail organisations require RISQS?',
        content: `Virtually every organization in UK rail requires RISQS from their suppliers. Here\'s the comprehensive list:

**Infrastructure Owners:**
- Network Rail (all routes and regions)
- HS2 Ltd
- London Underground/TfL
- Nexus (Tyne and Wear Metro)
- Strathclyde Partnership for Transport

**Train Operating Companies (all require RISQS):**
Avanti West Coast, CrossCountry, East Midlands Railway, Great Western Railway, LNER, Northern, ScotRail, Southeastern, Southern, South Western Railway, TransPennine Express, Transport for Wales, West Midlands Railway, and all others.

**Freight Operators:**
DB Cargo UK, Freightliner, GB Railfreight, Direct Rail Services, Colas Rail

**Rolling Stock Companies:**
Angel Trains, Eversholt Rail, Porterbrook, Rock Rail

**Major Principal Contractors:**
All Tier 1 contractors working on rail projects require their subcontractors to have RISQS, including: Balfour Beatty Rail, Babcock Rail, Colas Rail, VolkerRail, Alstom, Siemens Mobility, and Network Rail\'s own commercial projects division.`
      },
      {
        title: 'RISQS cost UK 2026',
        content: `RISQS costs vary based on company size, scope of work, and audit requirements. Here\'s the detailed breakdown for 2026:

**Registration Fees (Annual):**
- Micro (turnover <£500k): £400 + VAT
- Small (£500k-£2m): £650 + VAT
- Medium (£2m-£10m): £1,200 + VAT
- Large (£10m-£50m): £2,400 + VAT
- Enterprise (>£50m): £4,800 + VAT

**Audit Costs (Every 2-3 years):**
- Basic audit (single discipline): £1,500-£2,500
- Multi-discipline audit: £2,500-£5,000
- Complex/multi-site audit: £5,000-£10,000
- Surveillance visits (between audits): £800-£1,500

**Additional Costs:**
- Sentinel card sponsor status: £350/year
- Additional product/service codes: £100 each
- Fast-track processing: +50% fee
- Consultant support: £500-£1,500/day

**Total Year 1 Investment:**
Small company, basic scope: £2,000-£3,500
Medium company, multiple disciplines: £4,000-£8,000
Large company, complex operations: £8,000-£15,000`
      },
      {
        title: 'RISQS vs CHAS vs SSIP: different sectors, different schemes',
        content: `A common mistake is assuming CHAS or SSIP membership covers rail work. It doesn\'t. Here\'s why:

**RISQS (Rail-specific):**
Mandatory for all rail sector work. Includes rail-specific requirements like track safety, PTS competency, rail-specific method statements, Rule Book compliance, and fatigue management standards. Not recognised outside rail sector.

**CHAS (Multi-sector H&S):**
General health and safety scheme used mainly in construction, facilities management, and local authorities. While CHAS covers general H&S, it doesn\'t address rail-specific requirements. Rail companies will not accept CHAS as an alternative to RISQS.

**SSIP (Safety Schemes in Procurement):**
Umbrella organisation for H&S schemes with mutual recognition between members. RISQS is NOT part of SSIP. While SSIP schemes (CHAS, SafeContractor, etc.) recognise each other, none are accepted for rail work.

If you work across rail and construction, you need both RISQS (for rail) and CHAS/SSIP scheme (for construction). The assessments don\'t overlap, though having one can help prepare for the other as both require similar management systems.`
      },
      {
        title: 'RISQS and HS2: special requirements',
        content: `HS2 has additional requirements beyond standard RISQS that suppliers must understand:

**HS2-Specific Requirements:**
While RISQS registration is the baseline, HS2 adds its own pre-qualification through the HS2 Supplier Information Management System (SIMS). You need both RISQS AND separate HS2 approval. HS2 also requires enhanced vetting including: higher insurance levels (typically £10m+), specific HS2 induction training, commitment to HS2\'s EDI and Skills agenda, and carbon management planning.

**Innovation and Social Value:**
HS2 places unusual emphasis on innovation and social value in supplier selection. Your RISQS profile should highlight: apprenticeship programmes, local employment initiatives, carbon reduction innovations, and diversity/inclusion policies. These factors can be weighted up to 20% in HS2 tender evaluations.

**Security Clearance:**
Many HS2 contracts require Baseline Personnel Security Standard (BPSS) or higher clearance for staff. This isn\'t part of RISQS but must be arranged separately through your HR processes. Allow 2-4 weeks for BPSS clearance.`
      }
    ],
    faq: [
      {
        q: 'Is RISQS mandatory for all UK rail work?',
        a: 'Yes, RISQS is mandatory for virtually all UK rail work. Network Rail, TfL, HS2 and all train operators require it. Even small subcontractors need RISQS if their work could affect rail operations or safety. The only exceptions are pure consultancy or design work with no site presence.'
      },
      {
        q: 'How much does RISQS cost per year?',
        a: 'RISQS registration costs from £400/year for micro companies up to £4,800/year for large enterprises. Audit costs (required for most work) add £1,500-£5,000 every 2-3 years. Total Year 1 costs typically range from £2,000-£8,000 depending on company size and work scope.'
      },
      {
        q: 'Can I use CHAS instead of RISQS for rail work?',
        a: 'No, CHAS cannot replace RISQS for rail work. RISQS is the only accepted scheme for UK rail. While CHAS covers general health and safety, RISQS includes rail-specific requirements like track safety and PTS competency. You need both if you work across rail and construction sectors.'
      },
      {
        q: 'How long does RISQS qualification take?',
        a: 'RISQS registration typically takes 2-3 weeks if you have documentation ready. If audit is required, add another 2-4 weeks for scheduling and completion. Total timeline: 4-6 weeks for full qualification. Fast-track options available for urgent contracts (additional 50% fee).'
      },
      {
        q: 'What happens if my RISQS expires?',
        a: 'If RISQS expires, you immediately lose the ability to tender for new rail contracts and may be suspended from current contracts. Buyers receive automatic notifications of expired suppliers. Renewal must be completed before expiry - there\'s no grace period. Set reminders 3 months before expiry date.'
      }
    ],
    externalLinks: [
      { text: 'RISQS Official Website', url: 'https://www.risqs.org' },
      { text: 'RSSB (Scheme Operator)', url: 'https://www.rssb.co.uk' },
      { text: 'Network Rail Supplier Information', url: 'https://www.networkrail.co.uk/suppliers' }
    ],
    relatedPages: ['/certifications/achilles-uk-tenders', '/certifications/iso-45001-uk-tenders', '/certifications/iso-9001-uk-tenders']
  },

  // Priority 1: BRCGS for Food
  {
    url: '/certifications/brcgs-food-tenders-uk',
    primaryKeyword: 'BRCGS food tenders UK',
    secondaryKeywords: ['BRC certification UK', 'food safety standard tenders', 'BRCGS AA grade requirements', 'food supplier qualification UK'],
    h1: 'BRCGS for UK Food Supply Chain Tenders: Certification Guide 2026',
    metaTitle: 'BRCGS Food Tenders UK: Safety Standard Requirements 2026',
    metaDescription: 'BRCGS (formerly BRC) is mandatory for most UK food retail and public sector catering contracts. AA grade required for major retailers. Cost and process guide.',
    searchVolume: 650,
    priority: 1,
    facts: [
      'BRCGS = Brand Reputation through Compliance Global Standards',
      'Formerly BRC (British Retail Consortium Global Standards)',
      'Current version: BRCGS Food Safety Issue 9',
      'Mandatory for UK supermarkets and NHS catering',
      'Grades: AA, A, B, C, D - major retailers require minimum A',
      'Required for NHS Supply Chain food frameworks',
      'Cost: £1,500-£4,000/year for audits',
      'Timeline: 6-12 months to achieve AA grade'
    ],
    sections: [
      {
        title: 'What is BRCGS and why does it matter for food tenders?',
        content: `BRCGS (Brand Reputation through Compliance Global Standards), formerly known as BRC, is the leading global food safety certification programme. Originally developed by UK retailers to ensure food safety in their supply chains, BRCGS has become the de facto standard for food suppliers to UK retail and public sector.

The standard was created by the British Retail Consortium but is now owned and operated by LGC, a global science company. Despite the ownership change, the standard remains the primary requirement for UK food supply chains. BRCGS Food Safety Issue 9 (current version as of 2026) covers all aspects of food safety management including HACCP, quality management, factory environment standards, product control, process control, and personnel requirements.

For UK food businesses, BRCGS certification is not optional if you want to supply: major supermarkets (Tesco, Sainsbury\'s, Asda, Morrisons, Waitrose), public sector catering (NHS trusts, schools, prisons, armed forces), food service companies (Compass Group, Sodexo, ISS), or most food wholesalers and distributors. Without BRCGS, you\'re effectively locked out of mainstream food supply chains.`
      },
      {
        title: 'BRCGS grades: what AA, A, B, C, D mean for tender eligibility',
        content: `BRCGS uses a grading system that directly impacts your ability to win contracts. Understanding these grades is crucial for tender success.

**Grade AA (Highest):**
Announced audit with no non-conformities. Required by premium retailers (Waitrose, M&S) and increasingly by others. Audit frequency: 12 months. This is the gold standard that opens all doors.

**Grade A:**
Announced audit with 5 or fewer minor non-conformities. Accepted by most retailers and public sector buyers. Audit frequency: 12 months. This is the minimum for major supply contracts.

**Grade B:**
Up to 10 minor non-conformities or one major. May be accepted for non-critical supplies or during improvement periods. Audit frequency: 6 months. Limited tender opportunities.

**Grade C:**
Up to 20 minor non-conformities or one critical. Generally not accepted for retail supply. Requires improvement action plan. Audit frequency: 6 months.

**Grade D:**
More than 20 minors or multiple majors. Certificate suspended pending improvements. Cannot supply BRCGS customers.

Most public sector food frameworks specify "BRCGS Grade A minimum" in their requirements. Premium contracts often specify AA grade only. Your grade directly affects your tender competitiveness - even one minor non-conformity can lose you business.`
      },
      {
        title: 'Public sector food contracts requiring BRCGS',
        content: `BRCGS is extensively required across UK public sector food procurement. Here are the key frameworks and buyers:

**NHS Supply Chain Food Framework:**
All suppliers must have BRCGS Grade A minimum. This covers all NHS trusts in England, worth £500m+ annually. Categories include fresh produce, dairy, meat, frozen foods, ambient goods, and patient nutrition products.

**Crown Commercial Service (CCS) Food Frameworks:**
CCS manages multiple food frameworks for central government, including catering services, food products, and vending. BRCGS is mandatory for product suppliers, though service-only contractors may be exempt.

**Ministry of Defence (MOD):**
Defence Catering Services requires BRCGS for all food suppliers to military bases, operations, and training facilities. Higher grades (AA/A) preferred due to operational criticality.

**Education Sector:**
School food frameworks (via local authorities or academy trusts) typically require BRCGS. This includes suppliers to council-run schools, academy chains, and universities.

**Justice System:**
HM Prison Service food suppliers must have BRCGS due to the controlled environment and vulnerable population considerations.

Without BRCGS, you cannot bid for these frameworks or their call-off contracts, regardless of other qualifications or competitive pricing.`
      },
      {
        title: 'BRCGS Food Safety vs BRCGS Packaging: which do you need?',
        content: `BRCGS operates multiple standards, and choosing the right one is crucial for compliance and cost management.

**BRCGS Food Safety:**
For manufacturers of food products intended for human consumption. This is what retailers and public sector food buyers require. Covers everything from raw material handling to finished product release. If you make, process, or pack food, this is your standard.

**BRCGS Packaging:**
For manufacturers of packaging materials used in food contact applications. Required if you supply packaging to food manufacturers but don\'t handle food yourself. Major packaging converters and printers need this standard.

**When you need both:**
Some operations require both standards. For example, if you manufacture food AND produce your own printed packaging on-site, you may need dual certification. However, most food businesses only need Food Safety - purchasing compliant packaging from BRCGS Packaging certified suppliers.

**Other BRCGS Standards:**
BRCGS also offers Agents & Brokers (for traders/importers), Storage & Distribution (for logistics providers), and Consumer Products (for non-food items). These are separate from Food Safety and not typically required for food tenders unless you operate in those specific sectors.`
      },
      {
        title: 'BRCGS certification cost UK 2026',
        content: `BRCGS costs vary significantly based on company size, complexity, and current compliance level. Here\'s the detailed breakdown:

**Certification Body Audit Fees:**
- Small site (<50 employees): £1,500-£2,500 per audit
- Medium site (50-250 employees): £2,500-£3,500 per audit
- Large site (250+ employees): £3,500-£5,000 per audit
- Multi-site additional: £1,000-£2,000 per additional site

**BRCGS License Fees:**
- BRCGS Participation: £450/year (mandatory)
- BRCGS Directory listing: Included
- Additional modules: £100-£300 each

**Preparation and Consultancy:**
- Gap analysis: £500-£1,500
- Implementation consultancy: £600-£1,200/day
- Internal auditor training: £400-£600 per person
- Documentation templates: £500-£2,000

**Additional Costs:**
- Pre-audit assessment (recommended): £800-£1,500
- Laboratory testing: £2,000-£10,000/year
- Infrastructure improvements: Variable (often £10,000-£100,000)

**Total Investment Estimates:**
- Year 1 (achieving certification): £10,000-£50,000
- Ongoing annual costs: £3,000-£15,000

The wide range reflects that BRCGS often requires significant infrastructure investment (segregation, metal detection, allergen controls) beyond just the audit costs.`
      }
    ],
    faq: [
      {
        q: 'Is BRCGS mandatory for NHS food suppliers?',
        a: 'Yes, BRCGS Grade A minimum is mandatory for all NHS Supply Chain food framework suppliers. This applies to all product categories from fresh produce to patient nutrition. Service-only contractors (without food handling) may be exempt, but any company supplying food products must have BRCGS certification.'
      },
      {
        q: 'How much does BRCGS certification cost per year?',
        a: 'BRCGS typically costs £3,000-£15,000 annually for established certified sites (audit plus license fees). First-year costs are higher at £10,000-£50,000 including gap analysis, consultancy, training, and often infrastructure improvements. Large complex sites can exceed these estimates.'
      },
      {
        q: 'What\'s the difference between BRCGS and SALSA?',
        a: 'BRCGS is the premium standard required by major retailers and large public sector frameworks. SALSA is a more accessible standard for smaller producers, accepted by local authorities and independent retailers. BRCGS is more rigorous and costly but opens more doors. You cannot use SALSA where BRCGS is specified.'
      },
      {
        q: 'How long does it take to get BRCGS certified?',
        a: 'Achieving BRCGS typically takes 6-12 months from start to certification. This includes gap analysis (Month 1), implementation (Months 2-5), internal audits (Month 6), and certification audit. Achieving Grade AA often takes an additional year of continuous improvement after initial certification.'
      },
      {
        q: 'Can I get BRCGS if I work from home or a small unit?',
        a: 'BRCGS has strict infrastructure requirements that are difficult to meet in home or micro settings. You need dedicated facilities, segregation, pest control, changing facilities, and documented cleaning programmes. Most home-based food businesses choose SALSA instead, which is designed for smaller operations. BRCGS is really for commercial food production facilities.'
      }
    ],
    externalLinks: [
      { text: 'BRCGS Official Website', url: 'https://www.brcgs.com' },
      { text: 'NHS Supply Chain Food Procurement', url: 'https://www.supplychain.nhs.uk' },
      { text: 'Food Standards Agency', url: 'https://www.food.gov.uk' }
    ],
    relatedPages: ['/certifications/salsa-food-tenders-uk', '/certifications/smeta-sedex-uk-tenders', '/certifications/iso-22000-uk-tenders']
  },

  // Priority 1: ISO 22301 Business Continuity
  {
    url: '/certifications/iso-22301-uk-tenders',
    primaryKeyword: 'ISO 22301 UK tenders',
    secondaryKeywords: ['business continuity certification UK government', 'ISO 22301 critical services tenders', 'resilience certification public sector'],
    h1: 'ISO 22301 for UK Tenders: Business Continuity Certification Guide',
    metaTitle: 'ISO 22301 UK Tenders: Business Continuity Cert Guide 2026',
    metaDescription: 'ISO 22301 business continuity is required for critical services, NHS, emergency and utilities tenders in the UK. Cost from £3,000. Requirements guide 2026.',
    searchVolume: 480,
    priority: 1,
    facts: [
      'ISO 22301: Business Continuity Management Systems',
      'Required for critical national infrastructure',
      'Mandatory for many NHS and emergency services contracts',
      'Increasingly required for data centres and cloud services',
      'Cost: £3,000-£12,000 Year 1',
      'Timeline: 4-8 months to certification',
      'Often paired with ISO 27001 for resilience',
      'NCSC recommends for critical sectors'
    ],
    sections: [
      {
        title: 'What is ISO 22301 and when is it required?',
        content: `ISO 22301 is the international standard for Business Continuity Management Systems (BCMS). It provides a framework for organisations to plan, establish, implement, operate, monitor, review, maintain and continually improve a documented management system to protect against, reduce the likelihood of, and ensure recovery from disruptive incidents.

The standard is increasingly mandated in UK public sector procurement, particularly for services where interruption could cause significant harm to citizens, the economy, or national security. This includes contracts for critical national infrastructure (energy, water, transport, telecommunications), NHS services (especially urgent care, patient records, medical supplies), emergency services support, financial services, and data centres/cloud services.

Unlike general quality standards, ISO 22301 specifically addresses an organisation\'s ability to continue delivering products and services at acceptable predefined levels following disruptive incidents. This could range from cyber attacks and natural disasters to pandemic responses and supply chain failures. For buyers, ISO 22301 certification provides assurance that suppliers have robust plans to maintain service delivery during crises.`
      },
      {
        title: 'ISO 22301 requirements for UK government contracts',
        content: `Government procurement of critical services increasingly specifies ISO 22301 as either mandatory or highly advantageous. Here\'s where you\'ll encounter requirements:

**NHS and Healthcare:**
ISO 22301 is commonly required for NHS IT services, patient transport, medical equipment maintenance, pharmaceutical distribution, and facilities management. The NHS expects suppliers to demonstrate they can maintain services during major incidents, whether cyber attacks, severe weather, or infrastructure failures.

**Central Government:**
Crown Commercial Service frameworks for mission-critical services often mandate ISO 22301. This includes IT disaster recovery, contact centre services, critical telecommunications, and security services. The Cabinet Office\'s resilience standards specifically reference ISO 22301 as best practice.

**Local Government:**
Local authorities require ISO 22301 for emergency planning support, social care provision, waste management (statutory service), and housing management systems. Following COVID-19, resilience requirements have significantly increased.

**Utilities and Infrastructure:**
Water companies, energy providers, and transport operators require ISO 22301 from critical suppliers. This reflects their own regulatory obligations under the Civil Contingencies Act and sector-specific resilience requirements from regulators like Ofgem and Ofwat.`
      },
      {
        title: 'ISO 22301 and ISO 27001: complementary standards',
        content: `ISO 22301 (business continuity) and ISO 27001 (information security) are increasingly required together, particularly for digital and data-heavy contracts. Understanding how they complement each other is crucial for tender success.

**Where they overlap:**
Both standards require risk assessment and treatment, incident management procedures, management review processes, and continual improvement. If you have one, implementing the other is significantly easier as you can build on existing management systems.

**Key differences:**
ISO 27001 focuses on protecting information assets through confidentiality, integrity, and availability controls. ISO 22301 focuses on maintaining critical business functions during and after disruptions. While 27001 might prevent a cyber attack, 22301 ensures you can still operate if one succeeds.

**Combined requirements:**
NHS digital services, G-Cloud suppliers, financial services, and critical infrastructure contracts often require both certifications. Having both demonstrates comprehensive resilience - you can prevent incidents (27001) and recover from them (22301).

**Implementation synergies:**
Many organisations implement both standards simultaneously, using an Integrated Management System (IMS) approach. This reduces duplication, audit costs, and management overhead. Approximately 60% of the requirements overlap, making combined implementation efficient.`
      },
      {
        title: 'Cost and timeline for ISO 22301 certification',
        content: `ISO 22301 implementation costs and timelines vary based on organisation size and existing resilience maturity. Here\'s what to expect:

**Certification Costs (Year 1):**
- Small organisations (<50 staff): £3,000-£6,000
- Medium organisations (50-250): £6,000-£10,000
- Large organisations (250+): £10,000-£20,000

**Breakdown of Costs:**
- Gap analysis: £1,000-£2,000
- Consultancy support: £600-£1,200/day (typically 5-15 days needed)
- Training (lead implementer): £1,500-£2,500
- Internal audit: £800-£1,500
- Certification audit: £2,000-£4,000 (Stage 1 + Stage 2)
- Annual surveillance: £1,000-£2,000

**Implementation Timeline:**
- Month 1: Gap analysis and planning
- Month 2-3: Business Impact Analysis (BIA) and risk assessment
- Month 3-4: Strategy and plan development
- Month 4-5: Testing and exercising
- Month 5-6: Internal audit and management review
- Month 6-7: Stage 1 audit (documentation review)
- Month 7-8: Stage 2 audit (implementation audit)

**Critical Success Factors:**
The timeline assumes dedicated resources and management commitment. Organisations with existing ISO standards (9001, 14001, 27001) can typically achieve certification 30% faster due to familiar processes.`
      },
      {
        title: 'Business Impact Analysis: the heart of ISO 22301',
        content: `The Business Impact Analysis (BIA) is the cornerstone of ISO 22301 and often the most challenging element for organisations. It determines which activities are critical and must be recovered first after a disruption.

**What the BIA identifies:**
- Critical activities that must continue or be quickly resumed
- Maximum tolerable period of disruption (MTPD) for each activity
- Recovery time objectives (RTO) and recovery point objectives (RPO)
- Resources needed for recovery (people, premises, technology, information)
- Internal and external dependencies
- Impacts of disruption over time (financial, reputational, regulatory, contractual)

**Why tender evaluators focus on the BIA:**
Your BIA demonstrates understanding of what matters most to service delivery. For public sector contracts, evaluators want evidence that you\'ve identified and can protect the services they\'re buying. A robust BIA shows you understand their critical requirements and have planned accordingly.

**Common BIA mistakes to avoid:**
- Making everything "critical" (shows lack of genuine analysis)
- Ignoring supply chain dependencies
- Unrealistic recovery timeframes
- Not aligning with customer requirements
- Failing to test assumptions through exercises`
      }
    ],
    faq: [
      {
        q: 'Is ISO 22301 mandatory for NHS contracts?',
        a: 'ISO 22301 is mandatory for many NHS critical service contracts including IT services, patient transport, and medical supplies. It\'s strongly advantageous for all NHS suppliers as business continuity is weighted highly in tender evaluations, especially post-COVID. Check specific tender requirements as mandates vary by service criticality.'
      },
      {
        q: 'How much does ISO 22301 certification cost?',
        a: 'ISO 22301 certification costs £3,000-£6,000 for small organisations, £6,000-£10,000 for medium, and £10,000-£20,000 for large organisations in Year 1. This includes gap analysis, consultancy, training, and audit fees. Annual surveillance audits cost £1,000-£2,000. Costs are lower if you already have other ISO standards.'
      },
      {
        q: 'Can I implement ISO 22301 and ISO 27001 together?',
        a: 'Yes, implementing ISO 22301 and ISO 27001 together is highly recommended. Approximately 60% of requirements overlap, making combined implementation efficient. Many NHS and government contracts require both. Use an Integrated Management System approach to minimize duplication and reduce costs by about 30% versus separate implementation.'
      },
      {
        q: 'How long does ISO 22301 take to implement?',
        a: 'ISO 22301 typically takes 4-8 months from start to certification. This includes Business Impact Analysis (1-2 months), plan development (1-2 months), testing (1 month), and audits (2 months). Organisations with existing ISO standards can achieve it faster (3-6 months) by building on existing management systems.'
      },
      {
        q: 'What\'s the difference between ISO 22301 and a basic business continuity plan?',
        a: 'ISO 22301 is a comprehensive management system requiring ongoing improvement, regular testing, and independent certification. A basic plan might sit on a shelf; ISO 22301 requires active management, regular exercises, management reviews, and annual audits. Tender evaluators recognize this distinction - certification proves your continuity capability is actively maintained, not just documented.'
      }
    ],
    externalLinks: [
      { text: 'ISO 22301 Standard Information', url: 'https://www.iso.org/standard/75106.html' },
      { text: 'Cabinet Office Resilience Standards', url: 'https://www.gov.uk/government/organisations/cabinet-office' },
      { text: 'Business Continuity Institute', url: 'https://www.thebci.org' }
    ],
    relatedPages: ['/certifications/iso-27001-uk-tenders', '/certifications/iso-9001-uk-tenders', '/certifications/cyber-essentials-uk-tenders']
  },

  // Priority 1: G-Cloud Framework
  {
    url: '/certifications/g-cloud-uk-digital-tenders',
    primaryKeyword: 'G-Cloud UK digital tenders',
    secondaryKeywords: ['G-Cloud 15 requirements', 'G-Cloud supplier registration', 'Crown Commercial Service cloud framework'],
    h1: 'G-Cloud for UK Digital Tenders: Supplier Registration Guide 2026',
    metaTitle: 'G-Cloud UK Digital Tenders: Supplier Registration Guide 2026',
    metaDescription: 'G-Cloud 15 is the primary route to selling cloud and digital services to UK government. Cyber Essentials mandatory. Complete supplier registration guide.',
    searchVolume: 920,
    priority: 1,
    facts: [
      'G-Cloud is a CCS framework, not a certification',
      'Current iteration: G-Cloud 15 (2026)',
      'Cyber Essentials mandatory for most lots',
      'Three lots: Cloud Hosting, Cloud Software, Cloud Support',
      'Worth £multi-billions in government spend',
      'Annual application windows',
      'Free to apply but competitive',
      'Gateway to government digital contracts'
    ],
    sections: [
      {
        title: 'What is G-Cloud and why does it matter?',
        content: `G-Cloud is the UK government\'s primary procurement framework for cloud computing services. Managed by Crown Commercial Service (CCS), it\'s not a certification but a commercial framework that pre-approves suppliers to sell cloud services to the public sector. Being on G-Cloud is essentially mandatory for selling digital services to UK government.

The framework exists because traditional procurement was too slow for cloud services. Instead of running separate tenders for every cloud purchase, public sector buyers can select from pre-approved G-Cloud suppliers through the Digital Marketplace. This reduces procurement time from months to weeks while ensuring suppliers meet government standards.

G-Cloud opens doors to the entire UK public sector: central government departments, NHS trusts, local authorities, emergency services, schools, and arm\'s length bodies. Without G-Cloud, you\'re excluded from most government cloud opportunities as buyers are directed to use the framework for all cloud purchases under £20 million. The framework represents billions in annual government cloud spend.`
      },
      {
        title: 'G-Cloud 15 requirements and application process',
        content: `G-Cloud 15 (current as of 2026) has specific requirements that suppliers must meet. Understanding these is crucial for successful application.

**Mandatory Requirements (all suppliers):**
- UK registered company or public body
- Cyber Essentials certification (must be valid at application)
- Public liability insurance (minimum £1m)
- Professional indemnity insurance (minimum £1m)
- GDPR compliance documentation
- Modern Slavery statement (if turnover >£36m)
- Service descriptions meeting CCS standards

**Lot-Specific Requirements:**
- Cloud Hosting: ISO 27001 often required, data centre locations must be specified
- Cloud Software: WCAG 2.1 AA accessibility for user-facing services
- Cloud Support: May need ISO 20000 for managed services

**Application Process:**
G-Cloud opens annually (typically September/October) for 4-6 weeks. You submit service descriptions through the Digital Marketplace Supplier portal. Each service needs detailed specifications including pricing, security standards, support levels, and terms. CCS reviews applications for compliance, not quality - if you meet requirements, you\'re approved.

**Common Rejection Reasons:**
- Expired Cyber Essentials certificate
- Incomplete service descriptions
- Non-compliant pricing (must include all costs)
- Missing insurance evidence
- Vague security assertions`
      },
      {
        title: 'G-Cloud lots explained: Hosting, Software, Support',
        content: `G-Cloud divides services into three lots. Choosing the right lot(s) is crucial for success.

**Lot 1 - Cloud Hosting:**
Infrastructure and platform services including IaaS, PaaS, Content Delivery Networks, storage, compute, and network services. This is for raw infrastructure - servers, databases, storage, platforms. Examples: AWS, Azure, Google Cloud resellers, UK hosting providers, specialist government cloud platforms. Buyers use this for infrastructure to build or host their applications.

**Lot 2 - Cloud Software:**
Finished software applications delivered as SaaS, including CRM systems, HR software, finance applications, collaboration tools, specialist government applications. This is for ready-to-use applications accessed via browser or API. If users log in and use your application directly, it\'s Cloud Software.

**Lot 3 - Cloud Support:**
Professional services supporting cloud adoption including migration services, optimisation, training, managed services, DevOps support. This is for human expertise around cloud services. Often purchased alongside Lots 1 or 2 for implementation.

**Which lot(s) should you apply for?**
Apply only for lots matching your actual services. Many suppliers offer services across multiple lots - that\'s fine, but each service must be in the correct lot. Putting services in wrong lots causes rejection. When in doubt, CCS provides classification guidance during application windows.`
      },
      {
        title: 'Digital Marketplace and call-off process',
        content: `Once on G-Cloud, you sell through the Digital Marketplace, the government\'s online catalogue for cloud services. Understanding how buyers use it is crucial for winning business.

**How buyers find services:**
Buyers search the Digital Marketplace using keywords and filters (price, security levels, support, features). Your service descriptions become your shop window - they must be clear, keyword-optimised, and specification-rich. Poor descriptions mean no visibility, regardless of service quality.

**The call-off process:**
1. Buyer searches Digital Marketplace for services meeting their needs
2. Creates shortlist based on service descriptions and pricing
3. May request clarifications through the messaging system
4. Awards contract based on catalogue information (no separate tender)
5. Contract formed using G-Cloud terms (you can\'t change these)

**Pricing and commercial terms:**
Your prices are publicly visible and must include all costs - no hidden fees. You can\'t negotiate prices after listing (though you can reduce them annually). Payment terms are fixed at 30 days. G-Cloud takes no commission but you must report monthly sales to CCS.

**Competition on G-Cloud:**
With 5000+ suppliers, standing out requires excellent service descriptions, competitive pricing, relevant case studies, and security credentials beyond minimum requirements. Many buyers filter by advanced certifications (ISO 27001, ISO 22301) even when not mandatory.`
      },
      {
        title: 'Beyond G-Cloud: DOS, Crown Marketplace, and other frameworks',
        content: `While G-Cloud is the largest, understanding related frameworks maximises opportunities.

**Digital Outcomes and Specialists (DOS) - Now Closed:**
DOS was for digital specialists and projects but closed in 2023, replaced by new frameworks. If you provided developers, designers, or delivery managers, you now need alternative routes like Crown Marketplace or direct appointment under IR35 rules.

**Crown Marketplace:**
The new platform replacing various professional services frameworks. Unlike G-Cloud\'s catalogue model, Crown Marketplace uses dynamic purchasing for complex requirements. You may need both G-Cloud (for products) and Crown Marketplace (for services).

**NHS Frameworks:**
NHS has separate frameworks through NHS Shared Business Services. While NHS bodies can use G-Cloud, specialist health frameworks like Health Systems Support Framework offer NHS-specific terms and requirements.

**Vertical Integration:**
Successful government suppliers often maintain presence across multiple frameworks. G-Cloud for cloud services, Crown Marketplace for professional services, specialist frameworks for vertical sectors. This maximises opportunity visibility and allows bundled solutions.`
      }
    ],
    faq: [
      {
        q: 'Is G-Cloud mandatory for selling to UK government?',
        a: 'While not legally mandatory, G-Cloud is effectively required for most government cloud sales. Procurement rules direct buyers to use G-Cloud for cloud services under £20m. Without it, you\'re excluded from Digital Marketplace where most opportunities are advertised. Direct awards outside frameworks are rare and heavily scrutinised.'
      },
      {
        q: 'How much does it cost to join G-Cloud?',
        a: 'G-Cloud application is free - no fees to CCS. However, you need Cyber Essentials (£350-£600), insurances (£1,000-£5,000/year), and potentially ISO 27001 (£3,000-£10,000) depending on services. Time investment is significant: expect 40-80 hours preparing service descriptions. No commission on sales but monthly reporting required.'
      },
      {
        q: 'When can I apply for G-Cloud?',
        a: 'G-Cloud opens annually, typically September/October for 4-6 weeks. G-Cloud 15 runs through 2026; G-Cloud 16 applications expected September 2026. You cannot join mid-cycle - missing the window means waiting a full year. Monitor Crown Commercial Service announcements from August. Have Cyber Essentials ready before the window opens.'
      },
      {
        q: 'Can foreign companies apply for G-Cloud?',
        a: 'Companies must be legally established in the UK (registered at Companies House) or be a Crown body. Foreign parents are fine, but you need a UK entity. You also need UK bank accounts for payment and UK-based support during UK business hours. Data residency requirements may apply depending on services offered.'
      },
      {
        q: 'What happens if my G-Cloud application is rejected?',
        a: 'Rejection means waiting until next year\'s application window - there\'s no appeals process or mid-cycle entry. Common rejection reasons: expired Cyber Essentials, incomplete service descriptions, wrong lot classification. CCS provides feedback on rejections. You can reapply next cycle after addressing issues. Meanwhile, consider subcontracting to existing G-Cloud suppliers.'
      }
    ],
    externalLinks: [
      { text: 'Digital Marketplace', url: 'https://www.digitalmarketplace.service.gov.uk' },
      { text: 'Crown Commercial Service G-Cloud', url: 'https://www.crowncommercial.gov.uk/agreements/RM1557.13' },
      { text: 'G-Cloud Supplier Guidance', url: 'https://www.gov.uk/guidance/g-cloud-suppliers-guide' }
    ],
    relatedPages: ['/certifications/cyber-essentials-uk-tenders', '/certifications/iso-27001-uk-tenders', '/certifications/ccs-frameworks-uk-tenders']
  }
]

async function generatePageComponent(page: CertPage): Promise<string> {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'rfp.quest'
    },
    publisher: {
      '@type': 'Organization',
      name: 'rfp.quest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rfp.quest/logo.png'
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString()
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }

  return `import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '${page.metaTitle}',
  description: '${page.metaDescription}',
  openGraph: {
    title: '${page.metaTitle}',
    description: '${page.metaDescription}',
    type: 'article',
  },
}

export default function ${page.url.slice(15).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(${JSON.stringify(schemaMarkup)}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(${JSON.stringify(faqSchema)}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ${page.h1}
          </h1>
          <p className="text-xl text-slate-600">
            ${page.metaDescription}
          </p>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Facts</h2>
            <ul className="space-y-2 text-slate-700">
              ${page.facts.map(fact => `<li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>${fact}</span>
              </li>`).join('\n              ')}
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          ${page.sections.map(section => `
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">${section.title}</h2>
          ${section.content.split('\n\n').map(para => `<p className="text-slate-700 leading-relaxed mb-4">${para}</p>`).join('\n          ')}`).join('\n')}
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            ${page.externalLinks.map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              ${link.text}
            </a>`).join('')}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            ${page.faq.map(item => `
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">${item.q}</h3>
              <p className="text-slate-700 leading-relaxed">${item.a}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            ${page.relatedPages.map(url => `
            <Link href="${url}" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                ${url.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </Link>`).join('')}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With ${page.primaryKeyword.split(' ')[0]}?
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Get expert guidance on certification requirements and tender preparation
          </p>
          <Link href="/contact" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            Get Expert Advice
          </Link>
        </div>
      </section>
    </div>
  )
}
`
}

async function createPage(page: CertPage) {
  const dirPath = path.join(process.cwd(), 'src/app', page.url)
  const filePath = path.join(dirPath, 'page.tsx')
  
  // Create directory if it doesn't exist
  await fs.mkdir(dirPath, { recursive: true })
  
  // Generate and write the component
  const component = await generatePageComponent(page)
  await fs.writeFile(filePath, component, 'utf-8')
  
  console.log(`✅ Created: ${page.url}`)
  
  // Insert into database
  const dbData = {
    slug: page.url,
    title_tag: page.metaTitle,
    h1: page.h1,
    meta_description: page.metaDescription,
    primary_keyword: page.primaryKeyword,
    secondary_keywords: page.secondaryKeywords,
    cluster: 'certifications',
    intent: 'commercial',
    search_volume: page.searchVolume,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  try {
    await sql`
      INSERT INTO certifications (
        page_url, title_tag, h1, meta_description, primary_keyword, 
        secondary_keywords, cluster, intent, search_volume, status
      ) VALUES (
        ${dbData.slug}, ${dbData.title_tag}, ${dbData.h1}, 
        ${dbData.meta_description}, ${dbData.primary_keyword},
        ${dbData.secondary_keywords}, ${dbData.cluster}, 
        ${dbData.intent}, ${dbData.search_volume}, ${dbData.status}
      )
      ON CONFLICT (page_url) DO UPDATE SET
        title_tag = EXCLUDED.title_tag,
        h1 = EXCLUDED.h1,
        meta_description = EXCLUDED.meta_description,
        updated_at = NOW()
    `
    console.log(`   📊 Added to database: ${page.url}`)
  } catch (err) {
    console.error(`   ❌ Database error for ${page.url}:`, err)
  }
}

async function main() {
  console.log('🚀 Starting certification page generation...')
  console.log(`📝 Processing ${certPages.length} certification pages`)
  
  // Process by priority
  const priority1Pages = certPages.filter(p => p.priority === 1)
  const priority2Pages = certPages.filter(p => p.priority === 2)
  const priority3Pages = certPages.filter(p => p.priority === 3)
  
  console.log('\n=== PRIORITY 1 PAGES ===')
  for (const page of priority1Pages) {
    await createPage(page)
  }
  
  if (priority2Pages.length > 0) {
    console.log('\n=== PRIORITY 2 PAGES ===')
    for (const page of priority2Pages) {
      await createPage(page)
    }
  }
  
  if (priority3Pages.length > 0) {
    console.log('\n=== PRIORITY 3 PAGES ===')
    for (const page of priority3Pages) {
      await createPage(page)
    }
  }
  
  console.log('\n✨ Certification page generation complete!')
  console.log(`📊 Total pages created: ${certPages.length}`)
}

main().catch(console.error)