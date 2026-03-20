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
  // Priority 2: Achilles UVDB
  {
    url: '/certifications/achilles-uk-tenders',
    primaryKeyword: 'Achilles accreditation UK tenders',
    secondaryKeywords: ['Achilles UVDB utilities', 'Achilles Link-Up rail', 'Achilles supply chain qualification UK'],
    h1: 'Achilles Accreditation for UK Tenders: UVDB, Link-Up and Supply-Line',
    metaTitle: 'Achilles UK Tenders: UVDB, Link-Up & Supply-Line Guide 2026',
    metaDescription: 'Achilles is the pre-qualification scheme for UK utilities, rail and energy. UVDB for utilities, Link-Up for rail. Cost and requirements guide 2026.',
    searchVolume: 520,
    priority: 2,
    facts: [
      'Achilles = global supplier qualification and risk management',
      'UVDB for UK utilities (gas, water, electricity)',
      'Link-Up for rail sector (works with RISQS)',
      'Supply-Line for oil, gas, offshore',
      'Cost: £500-£2,500/year depending on audit level',
      'Timeline: 4-6 weeks for assessment',
      'Required by National Grid, Thames Water, Cadent',
      'Covers SHEQ + Corporate Social Responsibility'
    ],
    sections: [
      {
        title: 'What is Achilles and which UK sectors use it?',
        content: `Achilles is a global supplier qualification and risk management company that operates sector-specific pre-qualification communities. In the UK, Achilles manages critical supply chain qualification for utilities, rail, and energy sectors through distinct but interconnected platforms.

Unlike single-sector schemes like RISQS (rail-only) or JOSCAR (defence-only), Achilles operates multiple communities that share common assessment methodologies but have sector-specific requirements. This creates efficiency for suppliers working across multiple sectors while ensuring each industry's unique compliance needs are met.

The three main UK Achilles communities are UVDB (Utilities Vendor Database) for gas, water and electricity companies; Link-Up for rail infrastructure; and Supply-Line for oil, gas and offshore. Each community has its own buyer members, assessment criteria, and audit requirements, but they share core SHEQ (Safety, Health, Environment, Quality) elements.`
      },
      {
        title: 'UVDB: the utilities sector qualification',
        content: `UVDB (Utilities Vendor Database) is the mandatory pre-qualification system for UK utilities. Without UVDB, you cannot work for most UK gas, water, and electricity companies.

**Who requires UVDB:**
National Grid, Cadent Gas, SGN (Scotia Gas Networks), Wales & West Utilities, Northern Gas Networks, Thames Water, Severn Trent Water, United Utilities, Anglian Water, Yorkshire Water, UK Power Networks, Western Power Distribution, Northern Powergrid, Scottish Power Energy Networks, SSE Networks.

**UVDB assessment covers:**
Health and Safety management, Environmental management, Quality management, Corporate Social Responsibility, Financial stability, Insurance verification, Competency and training records, Equipment and resource capability.

**UVDB Verify audit:**
Beyond basic registration, UVDB Verify provides independent on-site audit verification. Many utilities require Verify status for higher-risk work including gas network operations, HV electrical work, water treatment, and principal contractor roles. Verify audits occur every 1-3 years depending on risk level.`
      },
      {
        title: 'Link-Up: rail sector integration with RISQS',
        content: `Achilles Link-Up serves the rail sector but works differently from RISQS. While RISQS is mandatory for UK rail, Link-Up provides additional value through broader supply chain visibility and reduced assessment duplication for multi-national rail operators.

**Link-Up vs RISQS:**
RISQS is UK-specific and mandatory for Network Rail. Link-Up is used by international rail companies and some UK operators for broader visibility. Many suppliers maintain both - RISQS for UK compliance, Link-Up for international opportunities. The systems can share data to reduce duplication.

**Who uses Link-Up in UK rail:**
Some Train Operating Companies for non-infrastructure suppliers, International rolling stock companies, Cross-border operators (Eurostar, Eurotunnel), Rail consultancies working internationally, Companies supplying both UK and European rail markets.

If you only work in UK rail, RISQS is sufficient. Link-Up becomes valuable when you work across borders or want visibility to international rail opportunities.`
      },
      {
        title: 'Supply-Line: oil, gas and offshore qualification',
        content: `Supply-Line is Achilles' community for oil, gas, and offshore industries. It's particularly strong in North Sea operations and UK offshore wind.

**Who requires Supply-Line:**
Shell UK, BP, TotalEnergies, Equinor, CNR International, TAQA, Harbour Energy, Centrica, Major offshore wind developers, Offshore Energies UK members.

**Supply-Line specific requirements:**
Beyond standard SHEQ, Supply-Line emphasises: offshore competency standards (OPITO, GWO), marine and helicopter operations, emergency response capabilities, asset integrity management, process safety management, environmental impact (especially marine), decommissioning capability.

**Audit levels:**
Desktop Assessment (basic qualification), Verified Assessment (remote audit), Site Assessment (full on-site audit for high-risk suppliers). Major operators typically require Site Assessment for critical suppliers.`
      },
      {
        title: 'Achilles costs and timeline',
        content: `Achilles costs vary by community, company size, and audit level required.

**Registration costs (annual):**
- Small company (<£1m turnover): £500-£800/year
- Medium company (£1-10m): £800-£1,500/year  
- Large company (>£10m): £1,500-£2,500/year
- Multi-community discount: 20-30% for second community

**Audit costs (additional):**
- Desktop verification: £500-£1,000
- Remote audit: £1,000-£2,000
- On-site audit: £2,000-£5,000
- Surveillance visits: £800-£1,500

**Timeline:**
- Registration: 1-2 weeks (self-assessment)
- Desktop verification: 2-3 weeks
- Full audit scheduling: 4-6 weeks
- Total to full compliance: 6-8 weeks

**Hidden costs to consider:**
- Staff time for data input (40-80 hours initially)
- Document preparation and system updates
- Potential consultant support (£500-£1,000/day)
- Annual data maintenance (10-20 hours)

Most companies start with basic registration then add audit levels as contract requirements demand.`
      }
    ],
    faq: [
      {
        q: 'Do I need both Achilles and RISQS for rail work?',
        a: 'For UK rail, RISQS is mandatory and sufficient. Achilles Link-Up adds value if you work internationally or want broader visibility, but it doesn\'t replace RISQS for Network Rail contracts. Some suppliers maintain both to maximise opportunities, with data sharing reducing duplication.'
      },
      {
        q: 'How much does Achilles UVDB cost per year?',
        a: 'Achilles UVDB costs £500-£2,500/year for registration depending on company size, plus £1,000-£5,000 for audits if required. Small utilities contractors typically pay £800-£1,500 annually. Additional costs include staff time (40-80 hours initially) and potential consultancy support.'
      },
      {
        q: 'Which utilities require Achilles UVDB?',
        a: 'Major UK utilities requiring UVDB include National Grid, all gas distribution networks (Cadent, SGN, Wales & West), most water companies (Thames Water, Severn Trent, United Utilities), and electricity networks (UK Power Networks, Western Power). Without UVDB, you cannot tender for these companies\' contracts.'
      },
      {
        q: 'What\'s the difference between UVDB and UVDB Verify?',
        a: 'UVDB is the basic registration and self-assessment. UVDB Verify adds independent audit verification of your management systems. Basic UVDB suits low-risk supplies; Verify is required for operational work on gas networks, HV electrical, water treatment, or principal contractor roles. Verify costs an additional £2,000-£5,000.'
      },
      {
        q: 'Can I use Achilles for construction tenders?',
        a: 'Achilles is specific to utilities, rail, and energy sectors - not general construction. For construction, you need CHAS, Constructionline, or other SSIP schemes. However, if you\'re doing construction work for utilities (e.g., laying gas pipes), you\'ll need both Achilles UVDB and construction accreditations.'
      }
    ],
    externalLinks: [
      { text: 'Achilles Information', url: 'https://www.achilles.com' },
      { text: 'National Grid Supplier Information', url: 'https://www.nationalgrid.com/suppliers' },
      { text: 'Offshore Energies UK', url: 'https://oeuk.org.uk' }
    ],
    relatedPages: ['/certifications/risqs-rail-tenders', '/certifications/iso-45001-uk-tenders', '/certifications/iso-14001-uk-tenders']
  },

  // Priority 2: ISO 13485 Medical Devices
  {
    url: '/certifications/iso-13485-uk-tenders',
    primaryKeyword: 'ISO 13485 UK tenders',
    secondaryKeywords: ['medical device quality management UK', 'ISO 13485 NHS supply', 'UKCA medical devices certification'],
    h1: 'ISO 13485 for UK NHS and Medical Tenders: Certification Guide 2026',
    metaTitle: 'ISO 13485 UK NHS Tenders: Medical Device Cert Guide 2026',
    metaDescription: 'ISO 13485 is mandatory for all medical device suppliers to the NHS and UK healthcare sector. UKCA marking, MDR compliance and tender requirements guide.',
    searchVolume: 410,
    priority: 2,
    facts: [
      'ISO 13485: Quality management for medical devices',
      'Mandatory for NHS medical device suppliers',
      'Links to UKCA marking requirements',
      'Regulated by MHRA',
      'Cost: £3,000-£15,000 Year 1',
      'Timeline: 6-12 months',
      'Required for all device classifications',
      'Covers full product lifecycle'
    ],
    sections: [
      {
        title: 'What is ISO 13485 and when is it required?',
        content: `ISO 13485:2016 is the international standard for quality management systems specific to medical devices. Unlike ISO 9001 which covers general quality management, ISO 13485 is tailored to the unique regulatory requirements of medical device design, development, production, installation, and servicing.

In the UK, ISO 13485 is effectively mandatory for any organisation involved in the medical device supply chain. This includes manufacturers, importers, distributors, and service providers. The standard is recognised by the MHRA (Medicines and Healthcare products Regulatory Agency) as demonstrating compliance with UK MDR 2002 (Medical Devices Regulations) and the new UKCA (UK Conformity Assessed) marking requirements.

For NHS procurement, ISO 13485 is explicitly required in tender specifications for medical devices, medical equipment maintenance, medical device distribution, and increasingly for digital health products that qualify as medical devices. Without ISO 13485, you cannot participate in NHS Supply Chain medical device frameworks or supply medical devices to any UK healthcare organisation.`
      },
      {
        title: 'ISO 13485 and UKCA marking requirements',
        content: `Since Brexit, the UK has its own medical device regulatory framework with UKCA marking replacing CE marking. ISO 13485 certification is a cornerstone of UKCA compliance.

**UKCA timeline:**
CE marks are accepted until 30 June 2028 (extended from 2024). After this date, all medical devices need UKCA marking for the UK market. ISO 13485 certification from a UK-recognised body is essential for UKCA marking.

**How ISO 13485 supports UKCA:**
The standard provides the quality management system framework required by UK regulations. Your ISO 13485 certificate demonstrates to MHRA and Approved Bodies that you have adequate quality systems. Technical documentation required for UKCA builds on ISO 13485 processes. Post-market surveillance requirements in ISO 13485 align with UKCA obligations.

**Classification matters:**
Class I devices (low risk): ISO 13485 recommended but not legally required. Class IIa/IIb devices (medium risk): ISO 13485 effectively mandatory. Class III devices (high risk): ISO 13485 absolutely mandatory. In vitro diagnostic devices: ISO 13485 required for all but Class A.

NHS procurement typically requires ISO 13485 regardless of classification, as it demonstrates professional capability.`
      },
      {
        title: 'NHS Supply Chain medical device requirements',
        content: `NHS Supply Chain manages national procurement for medical devices across multiple frameworks. ISO 13485 is a fundamental requirement across all medical device categories.

**NHS Supply Chain frameworks requiring ISO 13485:**
Capital Equipment Solutions (imaging, surgical equipment), Patient Safety Products (sharps, infection control), Wound Care and Continence, Rehabilitation and Therapy Products, Diagnostic Products and Services, Digital Health and Software as Medical Device (SaMD).

**Additional NHS requirements beyond ISO 13485:**
Clinical evidence and NICE compliance, NHS sustainability requirements (carbon footprint), Social value commitments, Cyber security for connected devices (often ISO 27001), Business continuity planning (sometimes ISO 22301), Modern Slavery Act compliance.

**Evaluation criteria:**
ISO 13485 is typically a pass/fail requirement - without it, your bid won\'t be evaluated. However, the maturity of your quality system can score points. Demonstrating excellence beyond basic compliance (e.g., advanced risk management, robust post-market surveillance) can differentiate your bid.`
      },
      {
        title: 'Digital health and Software as Medical Device (SaMD)',
        content: `The intersection of ISO 13485 with digital health is increasingly important as more software qualifies as a medical device.

**When software needs ISO 13485:**
Software that diagnoses, treats, or monitors medical conditions qualifies as SaMD. This includes clinical decision support systems, diagnostic algorithms, treatment planning software, remote patient monitoring platforms, and some health apps. If your software makes medical claims or influences clinical decisions, it likely needs ISO 13485.

**ISO 13485 for software companies:**
Traditional software companies often struggle with ISO 13485 as it was written for physical devices. Key challenges include: design controls and documentation requirements, risk management per ISO 14971, clinical evaluation of algorithms, post-market surveillance for software, cybersecurity integration with quality systems.

**NHS Digital Health Frameworks:**
The NHS increasingly procures digital health through specific frameworks. These require both ISO 13485 (for the medical device aspect) and often ISO 27001 (for information security) plus compliance with NHS Digital clinical safety standards (DCB0129/DCB0160).`
      },
      {
        title: 'Cost and timeline for ISO 13485 certification',
        content: `ISO 13485 costs vary significantly based on company size, device classification, and existing quality systems.

**Certification costs (Year 1):**
- Small company (Class I devices): £3,000-£6,000
- Medium company (Class II devices): £6,000-£12,000
- Large company (Class III devices): £12,000-£25,000

**Cost breakdown:**
- Gap analysis: £1,500-£3,000
- QMS documentation: £2,000-£5,000
- Consultant support: £600-£1,200/day (typically 10-30 days)
- Training (lead auditor): £1,500-£2,500
- Stage 1 & 2 audit: £3,000-£8,000
- Annual surveillance: £1,500-£3,000

**Implementation timeline:**
Months 1-2: Gap analysis and planning
Months 3-4: QMS documentation development
Months 5-6: Design controls implementation
Months 7-8: Risk management system (ISO 14971)
Months 9-10: Internal audit and management review
Months 11-12: Certification audit

**Critical success factors:**
Having technical documentation ready accelerates certification. Companies with ISO 9001 can upgrade faster (typically 6-9 months). Software companies often need longer due to design control requirements.`
      }
    ],
    faq: [
      {
        q: 'Is ISO 13485 mandatory for all NHS medical device suppliers?',
        a: 'Yes, ISO 13485 is mandatory for virtually all NHS medical device suppliers. NHS Supply Chain frameworks explicitly require it, regardless of device classification. Even Class I (low risk) device suppliers need ISO 13485 for NHS contracts, though it\'s not legally required for UKCA marking of Class I devices.'
      },
      {
        q: 'What\'s the difference between ISO 13485 and ISO 9001?',
        a: 'ISO 13485 is specifically for medical devices with additional requirements for design controls, risk management, regulatory compliance, and traceability. ISO 9001 is for general quality management. You cannot substitute ISO 9001 for ISO 13485 in medical device tenders - they\'re different standards with different regulatory recognition.'
      },
      {
        q: 'How much does ISO 13485 certification cost in the UK?',
        a: 'ISO 13485 typically costs £3,000-£6,000 for small companies with simple devices, £6,000-£12,000 for medium companies, and £12,000-£25,000 for large companies or complex devices in Year 1. Annual surveillance adds £1,500-£3,000. These costs exclude any product testing or regulatory submission fees.'
      },
      {
        q: 'Do digital health apps need ISO 13485?',
        a: 'Digital health apps need ISO 13485 if they qualify as medical devices (Software as Medical Device - SaMD). This includes apps that diagnose conditions, calculate treatment doses, or influence clinical decisions. Wellness apps without medical claims don\'t need ISO 13485. When in doubt, MHRA provides classification guidance.'
      },
      {
        q: 'Can I use CE marking instead of UKCA for NHS supplies?',
        a: 'CE marking is accepted alongside UKCA until 30 June 2028. After this date, only UKCA marking will be valid for the UK market. NHS buyers accept both currently, but planning for UKCA transition is essential. ISO 13485 certification supports both marking schemes.'
      }
    ],
    externalLinks: [
      { text: 'MHRA Medical Devices Regulation', url: 'https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency' },
      { text: 'NHS Supply Chain', url: 'https://www.supplychain.nhs.uk' },
      { text: 'ISO 13485 Standard Information', url: 'https://www.iso.org/standard/59752.html' }
    ],
    relatedPages: ['/certifications/iso-9001-uk-tenders', '/certifications/dsp-toolkit-nhs-tenders', '/certifications/iso-27001-uk-tenders']
  },

  // Priority 2: PCI DSS
  {
    url: '/certifications/pci-dss-uk-tenders',
    primaryKeyword: 'PCI DSS UK government tenders',
    secondaryKeywords: ['PCI DSS compliance public sector', 'payment card security certification UK', 'PCI DSS Level 1 tenders'],
    h1: 'PCI DSS for UK Tenders: Payment Security Compliance Guide',
    metaTitle: 'PCI DSS UK Tenders: Payment Card Security Guide 2026',
    metaDescription: 'PCI DSS compliance is mandatory for any UK tender involving card payment processing. Level 1, 2, 3 requirements and how to demonstrate compliance.',
    searchVolume: 380,
    priority: 2,
    facts: [
      'PCI DSS = Payment Card Industry Data Security Standard',
      'Required for any card payment processing',
      'Four levels based on transaction volume',
      'Annual compliance requirement',
      'Cost varies from £500 to £40,000+',
      'Most SMEs are Level 3 or 4',
      'Mandatory for council payment systems',
      'Applies to both online and terminal payments'
    ],
    sections: [
      {
        title: 'What is PCI DSS and when is it required?',
        content: `PCI DSS (Payment Card Industry Data Security Standard) is the global security standard for any organisation that accepts, processes, stores, or transmits credit card information. In UK public sector procurement, PCI DSS compliance is mandatory for any contract involving payment card handling.

The standard was created by major card brands (Visa, Mastercard, American Express, Discover, JCB) and is enforced through contractual obligations rather than law. However, for UK public sector contracts, PCI DSS has become a de facto regulatory requirement. Any supplier handling card payments on behalf of public bodies must demonstrate current PCI DSS compliance.

Common scenarios requiring PCI DSS in public sector include: online payment portals for councils, parking payment systems, leisure centre booking systems, council tax and business rate payments, court fine payments, NHS patient payment systems, university fee payments, and any Software-as-a-Service that processes payments.`
      },
      {
        title: 'PCI DSS Levels explained',
        content: `PCI DSS has four compliance levels based on annual transaction volume. Understanding your level is crucial for tender compliance.

**Level 1 (>6 million transactions/year):**
Requires annual on-site assessment by Qualified Security Assessor (QSA). Most expensive and rigorous level. Quarterly network scans by Approved Scanning Vendor (ASV). Cost: £15,000-£40,000+ annually.

**Level 2 (1-6 million transactions/year):**
Annual Self-Assessment Questionnaire (SAQ) with quarterly network scans. May require QSA assessment depending on acquirer. Cost: £5,000-£15,000 annually.

**Level 3 (20,000-1 million transactions/year):**
Annual SAQ with quarterly network scans. Most common for SME service providers. Cost: £2,000-£5,000 annually.

**Level 4 (<20,000 transactions/year):**
Annual SAQ, quarterly scans often optional. Common for small suppliers. Cost: £500-£2,000 annually.

**Which SAQ type?**
Different Self-Assessment Questionnaires apply: SAQ A (card-not-present, fully outsourced), SAQ A-EP (e-commerce, partially outsourced), SAQ B (terminal only, no storage), SAQ C (payment application systems), SAQ D (full assessment, any storage).

Most SaaS providers complete SAQ D regardless of level.`
      },
      {
        title: 'Public sector payment processing requirements',
        content: `UK public sector has specific requirements beyond basic PCI DSS compliance.

**Council requirements:**
Local authorities typically require Level 1 or Level 2 compliance for main payment providers. Even small transaction volumes may require higher-level compliance due to reputational risk. Annual Attestation of Compliance (AOC) must be provided. Compliance must cover all payment channels (online, phone, face-to-face).

**NHS requirements:**
NHS trusts handling patient payments require PCI DSS for any system touching card data. Integration with NHS spine services adds complexity. Patient data protection (beyond PCI DSS) must be demonstrated. Often paired with ISO 27001 requirements.

**Central government:**
Government Payment Service (GPS) has specific PCI DSS requirements. Suppliers must be on the GPS framework or demonstrate equivalent standards. Regular compliance audits beyond annual PCI DSS assessment. Incident reporting obligations to Cabinet Office.

**Evidence required in tenders:**
Current AOC (Attestation of Compliance) signed by QSA or company officer, Recent ASV scan reports showing no critical vulnerabilities, Certificate of compliance from acquirer/payment processor, Detailed network diagram if processing payments directly, Incident response plan for payment card breaches.`
      },
      {
        title: 'Cloud services and PCI DSS responsibility',
        content: `Understanding PCI DSS responsibilities in cloud environments is crucial for modern tenders.

**Shared responsibility model:**
Your cloud provider (AWS, Azure, Google Cloud) handles physical security and infrastructure compliance. You remain responsible for your application security, access controls, and data handling. Both parties need PCI DSS compliance for full coverage.

**SaaS provider obligations:**
If you provide SaaS that handles payments, you typically need SAQ D compliance. You must provide AOC to all customers annually. Your compliance level depends on total transactions across all customers. Customer-specific security requirements may exceed basic PCI DSS.

**Using third-party payment providers:**
Services like Stripe, PayPal, or Worldpay can reduce PCI DSS scope. You still need compliance (usually SAQ A or SAQ A-EP). Must verify your payment provider\'s PCI DSS compliance. Redirect or iframe integration affects your compliance requirements.

**Common cloud pitfalls:**
Assuming cloud provider compliance covers you (it doesn\'t). Not securing application logs containing card data. Inadequate access controls to cloud management consoles. Missing encryption for card data in transit between services. Insufficient network segmentation in cloud environments.`
      },
      {
        title: 'Cost and timeline for PCI DSS compliance',
        content: `PCI DSS costs vary dramatically based on compliance level and current security posture.

**Level 1 costs (QSA required):**
Initial assessment: £10,000-£25,000
Remediation: £10,000-£100,000+ depending on gaps
Annual reassessment: £10,000-£20,000
Quarterly ASV scans: £500-£2,000/year
Total Year 1: £25,000-£150,000+

**Level 3-4 costs (SAQ):**
Initial gap assessment: £2,000-£5,000
Documentation and policies: £1,000-£3,000
Vulnerability scanning setup: £500-£2,000
Annual ASV scans: £500-£1,500
Total Year 1: £4,000-£11,500

**Additional costs:**
Consultant support: £800-£1,500/day
Security tools (WAF, IDS): £500-£5,000/month
Penetration testing: £5,000-£15,000
Security training: £500-£2,000 per staff
Cyber insurance premium increase: 10-30%

**Timeline:**
Level 4 SAQ: 1-2 months
Level 3 SAQ: 2-3 months
Level 2: 3-6 months
Level 1: 6-12 months

Timeline assumes no major infrastructure changes required. Legacy systems can add months.`
      }
    ],
    faq: [
      {
        q: 'Is PCI DSS legally required for UK public sector contracts?',
        a: 'PCI DSS is contractually required by card brands, not law. However, UK public sector treats it as mandatory for any payment processing contracts. Councils, NHS trusts, and government departments all require PCI DSS compliance from payment service providers. Non-compliance means exclusion from payment-related tenders.'
      },
      {
        q: 'What PCI DSS level do councils typically require?',
        a: 'Councils typically require Level 1 or Level 2 compliance for main payment providers, even if transaction volumes suggest Level 3 or 4. This is due to reputational risk and the sensitive nature of citizen data. Smaller suppliers might provide Level 3/4 compliance if they\'re using tokenization or redirecting to compliant payment gateways.'
      },
      {
        q: 'How much does PCI DSS compliance cost?',
        a: 'PCI DSS costs range from £500-£2,000 annually for Level 4 (small merchants) to £25,000-£150,000+ for Level 1 compliance in Year 1. Most SMEs providing payment services fall into Level 3 (£4,000-£11,500 Year 1). Costs include assessment, scanning, remediation, and tools. Ongoing compliance is typically 30-50% of initial costs.'
      },
      {
        q: 'Can I use Stripe/PayPal instead of getting PCI DSS?',
        a: 'Using payment providers like Stripe or PayPal reduces but doesn\'t eliminate PCI DSS requirements. You still need SAQ A or SAQ A-EP compliance depending on integration method. For public sector contracts, you must provide your own AOC (Attestation of Compliance) even when using compliant third parties. The good news: SAQ A is much simpler and cheaper than full compliance.'
      },
      {
        q: 'Does ISO 27001 cover PCI DSS requirements?',
        a: 'No, ISO 27001 doesn\'t replace PCI DSS. While both cover information security, PCI DSS has specific requirements for card data protection that ISO 27001 doesn\'t address. Many public sector tenders require both: ISO 27001 for general infosec and PCI DSS for payment security. Having ISO 27001 makes PCI DSS easier but doesn\'t replace it.'
      }
    ],
    externalLinks: [
      { text: 'PCI Security Standards Council', url: 'https://www.pcisecuritystandards.org' },
      { text: 'UK Government Payment Service', url: 'https://www.gov.uk/government/groups/government-banking-service' },
      { text: 'NCSC Payment Security Guidance', url: 'https://www.ncsc.gov.uk' }
    ],
    relatedPages: ['/certifications/iso-27001-uk-tenders', '/certifications/cyber-essentials-uk-tenders', '/certifications/soc-2-uk-government-tenders']
  },

  // Priority 2: SMETA/Sedex
  {
    url: '/certifications/smeta-sedex-uk-tenders',
    primaryKeyword: 'SMETA Sedex UK tenders',
    secondaryKeywords: ['ethical trade audit UK tenders', 'social audit procurement', 'Sedex membership supply chain', 'SMETA 4 Pillar'],
    h1: 'SMETA and Sedex for UK Tenders: Ethical Trade Audit Guide 2026',
    metaTitle: 'SMETA Sedex UK Tenders: Ethical Trade Audit Guide 2026',
    metaDescription: 'SMETA ethical trade audits are required by major retailers and NHS Supply Chain for food and goods tenders. Sedex membership and 2-Pillar vs 4-Pillar guide.',
    searchVolume: 340,
    priority: 2,
    facts: [
      'SMETA = Sedex Members Ethical Trade Audit',
      'Sedex = Supplier Ethical Data Exchange platform',
      'Required by major UK retailers and NHS',
      '2-Pillar: Labour and H&S only',
      '4-Pillar: adds Environment and Business Ethics',
      'Sedex membership: £350-£500/year',
      'SMETA audit: £800-£2,500',
      'Links to Modern Slavery Act compliance'
    ],
    sections: [
      {
        title: 'What is SMETA and why do UK buyers require it?',
        content: `SMETA (Sedex Members Ethical Trade Audit) is one of the world\'s most widely used social audit formats, providing a standardised approach to ethical and responsible business practices. The audit is conducted using the Sedex platform, which allows buyers and suppliers to share ethical data efficiently.

UK buyers require SMETA to demonstrate supply chain compliance with ethical standards, particularly around modern slavery, labour rights, and responsible sourcing. Since the Modern Slavery Act 2015, UK companies must demonstrate due diligence in their supply chains. SMETA provides independently verified evidence of ethical compliance.

Major UK retailers (Tesco, Sainsbury\'s, ASDA, M&S), NHS Supply Chain, and many public sector frameworks now require SMETA audits from suppliers. This is particularly common in sectors with complex global supply chains: food and drink, textiles and clothing, manufacturing, and logistics. Without SMETA, suppliers are increasingly excluded from major supply contracts.`
      },
      {
        title: '2-Pillar vs 4-Pillar SMETA: which do you need?',
        content: `SMETA offers two audit options, and choosing the right one depends on your buyer requirements and sector.

**2-Pillar SMETA covers:**
Labour Standards (wages, working hours, child labour, discrimination, regular employment), Health and Safety (workplace safety, emergency procedures, first aid, protective equipment). This is the minimum for most supply chains and focuses on core worker welfare issues.

**4-Pillar SMETA adds:**
Environment (environmental management, waste, emissions, resource use), Business Ethics (anti-corruption, data protection, whistleblowing, sub-contracting). This comprehensive approach is increasingly required by leading retailers and public sector.

**Which to choose:**
NHS Supply Chain typically requires 4-Pillar for direct suppliers. Major supermarkets generally require 4-Pillar for food suppliers, 2-Pillar for non-food. Public sector frameworks increasingly specify 4-Pillar to cover sustainability. Manufacturing and logistics might start with 2-Pillar. Environmental impact sectors need 4-Pillar.

The trend is strongly toward 4-Pillar as buyers focus on net-zero commitments and ESG requirements. Starting with 4-Pillar future-proofs your compliance.`
      },
      {
        title: 'Sedex membership and platform requirements',
        content: `Before conducting a SMETA audit, you must be a Sedex member. Understanding the platform is crucial for compliance.

**Sedex membership tiers:**
- Basic (AB): £350-£500/year for suppliers
- Advanced (A): £500-£1,000/year with additional features
- Buyer membership: £5,000-£50,000/year (for those checking suppliers)

**What Sedex membership includes:**
Access to online platform for sharing audit data, Self-Assessment Questionnaire (SAQ), Audit report storage and sharing, Corrective action plan management, Connection with multiple buyers, Risk assessment tools.

**Platform obligations:**
Complete and maintain your SAQ (updates required when circumstances change). Upload all audit reports within 10 days. Manage corrective actions with timeline updates. Respond to buyer queries and information requests. Keep company information current.

**Buyer visibility:**
Your Sedex profile is visible to all connected buyers. Poor audit results or overdue corrective actions are visible. Buyers can compare your performance against peers. Platform analytics show engagement levels. Non-participation or poor maintenance affects buyer confidence.`
      },
      {
        title: 'NHS and public sector SMETA requirements',
        content: `Public sector increasingly requires SMETA, driven by Modern Slavery Act obligations and social value procurement policies.

**NHS Supply Chain:**
Requires SMETA for food frameworks (patient catering, retail), textiles (uniforms, linen), facilities management, logistics providers. Typically specifies 4-Pillar SMETA. Must be conducted within last 3 years. Corrective actions must be closed or progressing.

**Local authorities:**
Council procurement increasingly scores SMETA in social value evaluation. Required for: school uniform suppliers, catering contracts, construction materials with overseas supply chains, facilities management. Weights 5-10% of tender score under social value.

**Modern Slavery Act connection:**
SMETA provides evidence for Modern Slavery Act compliance. Public sector cannot contract with non-compliant suppliers. SMETA demonstrates due diligence in supply chain. Audit reports feed into mandatory modern slavery statements.

**Procurement Act 2023:**
New act strengthens social value requirements. SMETA helps demonstrate \"public benefit\" criteria. Expected to increase weighting of ethical compliance.`
      },
      {
        title: 'SMETA audit process and costs',
        content: `Understanding the SMETA audit process helps manage costs and timelines effectively.

**Audit costs:**
- 2-Pillar audit: £800-£1,500 (1 day on-site)
- 4-Pillar audit: £1,500-£2,500 (1-2 days on-site)
- Follow-up audit: £600-£1,000 (half day)
- Desktop review: £300-£500

**Additional costs:**
- Sedex membership: £350-£500/year
- Consultant preparation: £500-£1,500
- Translator (if needed): £300-£500/day
- Corrective action implementation: Variable
- Annual maintenance: £1,000-£2,000

**Audit process:**
1. Preparation (4-6 weeks): Document review, worker interviews prep, site preparation
2. Audit (1-2 days): Opening meeting, document review, site tour, worker interviews, closing meeting
3. Report (2 weeks): Auditor issues report with non-conformances
4. Corrective actions (ongoing): Address findings within agreed timescales
5. Verification: Follow-up audit or desktop review

**Validity period:**
SMETA audits are typically valid for 3 years, but many buyers require audits within 2 years. Annual surveillance encouraged. Major non-conformances may trigger earlier re-audit.`
      }
    ],
    faq: [
      {
        q: 'Is SMETA mandatory for NHS suppliers?',
        a: 'SMETA is mandatory for many NHS Supply Chain frameworks, particularly food, textiles, and goods with complex supply chains. It\'s part of NHS modern slavery and social value requirements. Service-only contracts may not require SMETA, but any physical goods supply increasingly needs it. Check specific framework requirements.'
      },
      {
        q: 'What\'s the difference between Sedex and SMETA?',
        a: 'Sedex is the online platform for sharing ethical data. SMETA is the audit methodology conducted through Sedex. You need Sedex membership first (£350-£500/year), then arrange a SMETA audit (£800-£2,500). Think of Sedex as the system and SMETA as the audit standard.'
      },
      {
        q: 'How much does SMETA certification cost in total?',
        a: 'Total Year 1 costs typically range from £1,500-£4,000 including Sedex membership (£350-£500), SMETA audit (£800-£2,500), and preparation support. 4-Pillar audits cost more than 2-Pillar. Ongoing costs are lower: annual Sedex membership plus periodic re-audits every 2-3 years.'
      },
      {
        q: 'Should I get 2-Pillar or 4-Pillar SMETA?',
        a: 'Go straight for 4-Pillar SMETA if possible. While 2-Pillar covers basic labour and H&S, most major buyers now require 4-Pillar which adds environment and business ethics. The cost difference is modest (£500-£700 more) but 4-Pillar opens more opportunities and avoids re-auditing later.'
      },
      {
        q: 'Can SMETA replace other ethical certifications?',
        a: 'SMETA is widely accepted but doesn\'t replace all ethical certifications. Some buyers also require SA8000, BSCI, or sector-specific standards. However, SMETA is the most commonly accepted in UK retail and public sector. Many buyers accept SMETA as equivalent to their proprietary audits, reducing audit burden.'
      }
    ],
    externalLinks: [
      { text: 'Sedex Platform', url: 'https://www.sedex.com' },
      { text: 'NHS Supply Chain Ethical Standards', url: 'https://www.supplychain.nhs.uk' },
      { text: 'Modern Slavery Act Guidance', url: 'https://www.gov.uk/guidance/modern-slavery-act' }
    ],
    relatedPages: ['/certifications/brcgs-food-tenders-uk', '/certifications/iso-14001-uk-tenders', '/certifications/living-wage-accreditation-uk-tenders']
  },

  // Priority 2: AS9100 Aerospace
  {
    url: '/certifications/as9100-aerospace-tenders',
    primaryKeyword: 'AS9100 aerospace UK tenders',
    secondaryKeywords: ['AS9100 certification cost UK', 'aerospace quality management standard', 'AS9100 vs ISO 9001'],
    h1: 'AS9100 for UK Aerospace Tenders: Quality Standard Guide 2026',
    metaTitle: 'AS9100 Aerospace UK Tenders: Quality Certification Guide 2026',
    metaDescription: 'AS9100 is the aerospace quality management standard required for UK aerospace supply chains. Supersedes ISO 9001 for aviation. Cost, timeline and requirements.',
    searchVolume: 290,
    priority: 2,
    facts: [
      'AS9100 Rev D: aerospace-specific quality standard',
      'Required by Airbus, BAE, Rolls-Royce, Boeing UK',
      'Includes all ISO 9001 plus aerospace additions',
      'Mandatory for flight-critical components',
      'Cost: £3,000-£15,000 Year 1',
      'Timeline: 6-12 months',
      'OASIS database registration included',
      'UKAS accreditation essential'
    ],
    sections: [
      {
        title: 'What is AS9100 and who requires it?',
        content: `AS9100 is the international quality management standard specifically designed for the aerospace industry. Built upon ISO 9001, it adds over 100 additional requirements specific to aviation, space, and defense. The current version, AS9100 Rev D (aligned with ISO 9001:2015), is recognised globally as the benchmark for aerospace quality.

In the UK aerospace sector, AS9100 is effectively mandatory for any company manufacturing, designing, or servicing aircraft components. Major aerospace companies including Airbus UK, BAE Systems, Rolls-Royce, Leonardo, GKN Aerospace, Boeing UK operations, Bombardier Belfast, and all Tier 1 aerospace suppliers require AS9100 from their supply chain.

The standard goes beyond general quality management to address aerospace-specific concerns: configuration management, risk management for flight safety, first article inspection requirements, prevention of counterfeit parts, control of critical items, foreign object debris (FOD) prevention, and special processes validation. Without AS9100, you cannot enter the aerospace supply chain, regardless of your technical capabilities or competitive pricing.`
      },
      {
        title: 'AS9100 vs ISO 9001: understanding the differences',
        content: `While AS9100 incorporates all ISO 9001 requirements, the aerospace additions make it significantly more demanding.

**What AS9100 adds to ISO 9001:**
Configuration Management: Strict control of product configuration throughout lifecycle. Risk Management: Formal risk assessment for product safety and reliability. Product Safety: Explicit requirements for safety-critical items. Counterfeit Prevention: Systems to detect and prevent counterfeit parts. Special Processes: Validation of processes like welding, plating, heat treatment. First Article Inspection (FAI): Detailed verification of first production items. Critical Items: Enhanced controls for flight-critical components.

**Documentation requirements:**
AS9100 requires extensive documentation beyond ISO 9001: Production Part Approval Process (PPAP), Advanced Product Quality Planning (APQP), Failure Mode and Effects Analysis (FMEA), Control Plans for all products, Statistical Process Control (SPC) data, Measurement System Analysis (MSA).

**Why you can\'t use ISO 9001 for aerospace:**
Aerospace buyers explicitly require AS9100. ISO 9001 alone is never acceptable for aerospace manufacturing. The OASIS database (aerospace supplier register) only lists AS9100 certified companies. Insurance and liability requirements reference AS9100 compliance.`
      },
      {
        title: 'OASIS database and aerospace supplier visibility',
        content: `OASIS (Online Aerospace Supplier Information System) is the global database of AS9100 certified organisations. Registration is automatic with AS9100 certification and crucial for aerospace business development.

**How OASIS works:**
When you achieve AS9100, your certification body registers you in OASIS. Aerospace buyers search OASIS to find qualified suppliers. Your certification scope, locations, and special processes are listed. Buyers can verify your certification status in real-time. Database includes audit scores and certification history.

**Why OASIS matters:**
Major aerospace companies only source from OASIS-listed suppliers. RFQs often require OASIS ID number. Buyers pre-screen suppliers using OASIS before tender invitations. Your OASIS profile is your aerospace credibility.

**Maximising OASIS visibility:**
Ensure certification scope accurately reflects capabilities. List all special processes and approvals. Keep contact information current. Add customer approvals and flow-downs. Include any NADCAP special process certifications.

Without OASIS listing (via AS9100), you\'re invisible to aerospace procurement teams.`
      },
      {
        title: 'Special processes and NADCAP requirements',
        content: `Many aerospace contracts require special process certifications beyond AS9100, particularly NADCAP accreditation.

**What is NADCAP:**
NADCAP (National Aerospace and Defense Contractors Accreditation Program) provides standardised special process certification. Managed by PRI (Performance Review Institute). Required by most aerospace primes for special processes.

**Common NADCAP requirements:**
Heat Treating, Chemical Processing, Welding, Non-Destructive Testing (NDT), Surface Enhancement (shot peening, plating), Composites, Material Testing.

**AS9100 and NADCAP relationship:**
AS9100 is the quality system foundation. NADCAP validates specific technical processes. You need AS9100 first, then add NADCAP as required. Both certifications required for special process suppliers.

**Cost implications:**
Each NADCAP process costs £10,000-£25,000 for initial certification. Annual audits required (£5,000-£15,000). Multiple processes multiply costs significantly. Budget £25,000-£75,000 annually for AS9100 plus NADCAP.

Special process suppliers should factor NADCAP costs when planning AS9100 implementation.`
      },
      {
        title: 'Cost and timeline for AS9100 certification',
        content: `AS9100 costs mirror ISO 9001 but with aerospace-specific additions that increase complexity and cost.

**Certification costs (Year 1):**
- Small company (<25 employees): £3,000-£8,000
- Medium company (25-100): £8,000-£15,000
- Large company (100+): £15,000-£30,000

**Cost breakdown:**
- Gap analysis: £1,500-£3,000
- AS9100 documentation: £3,000-£6,000
- Consultant support: £800-£1,500/day (typically 15-30 days)
- Internal auditor training: £1,500-£2,500
- Stage 1 & 2 audit: £3,000-£8,000
- OASIS registration: Included
- Annual surveillance: £2,000-£4,000

**Implementation timeline:**
Months 1-2: Gap analysis and planning
Months 3-4: Quality manual and procedures
Months 5-6: Risk management and special processes
Months 7-8: Implementation and training
Months 9-10: Internal audits and management review
Months 11-12: Certification audit

**Critical success factors:**
Having ISO 9001 reduces timeline by 3-4 months. Aerospace experience in team accelerates implementation. Customer-specific requirements may add complexity. Allow extra time for special process validation.`
      }
    ],
    faq: [
      {
        q: 'Is AS9100 mandatory for all aerospace suppliers?',
        a: 'AS9100 is mandatory for manufacturing or assembling aircraft components, especially flight-critical items. Design organisations and special process suppliers also need it. Pure commercial off-the-shelf suppliers might not need AS9100, but it\'s increasingly expected. Check your customer\'s supplier requirements - most aerospace companies mandate AS9100.'
      },
      {
        q: 'Can I use ISO 9001 instead of AS9100 for aerospace?',
        a: 'No, ISO 9001 cannot replace AS9100 for aerospace work. AS9100 includes all ISO 9001 requirements plus 100+ aerospace-specific additions. Aerospace companies explicitly require AS9100 and won\'t accept ISO 9001 alone. You also need AS9100 to appear in the OASIS supplier database.'
      },
      {
        q: 'How much does AS9100 certification cost?',
        a: 'AS9100 typically costs £3,000-£8,000 for small companies, £8,000-£15,000 for medium, and £15,000-£30,000 for large companies in Year 1. Annual surveillance adds £2,000-£4,000. If you need NADCAP special process certifications, add £10,000-£25,000 per process.'
      },
      {
        q: 'What\'s the difference between AS9100 and AS9120?',
        a: 'AS9100 is for manufacturers and maintainers who add value to products. AS9120 is for distributors and stockists who don\'t manufacture or alter products. If you machine, assemble, or modify parts, you need AS9100. If you only store and distribute, AS9120 is appropriate.'
      },
      {
        q: 'Do I need NADCAP if I have AS9100?',
        a: 'AS9100 is the quality system foundation, but NADCAP may be required for special processes like heat treatment, plating, welding, or NDT. Check your customer requirements - most aerospace primes require both AS9100 and relevant NADCAP certifications for special process suppliers. NADCAP is additional to, not instead of, AS9100.'
      }
    ],
    externalLinks: [
      { text: 'IAQG (AS9100 Standard Owner)', url: 'https://www.iaqg.org' },
      { text: 'OASIS Database', url: 'https://www.iaqg.org/oasis/login' },
      { text: 'PRI (NADCAP)', url: 'https://www.pri-network.org' }
    ],
    relatedPages: ['/certifications/joscar-defence-tenders', '/certifications/iso-9001-uk-tenders', '/certifications/iso-14001-uk-tenders']
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
}

async function main() {
  console.log('🚀 Starting expanded certification page generation...')
  console.log(`📝 Processing ${certPages.length} Priority 2 certification pages`)
  
  for (const page of certPages) {
    await createPage(page)
  }
  
  console.log('\n✨ Priority 2 certification pages complete!')
  console.log(`📊 Total pages created: ${certPages.length}`)
}

main().catch(console.error)