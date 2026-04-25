import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'UK Procurement Certifications Guide 2026 | RFP Platform Quest',
  description: 'Which certifications do you need to win UK government tenders? Complete guide to ISO, Cyber Essentials, CHAS, and more. Updated 2026.',
  keywords: 'UK procurement certifications, UK tender certifications, ISO certification tenders, government contract certifications, public sector certifications UK',
  openGraph: {
    title: 'UK Procurement Certifications: Complete Guide for Tender Bidders',
    description: 'Which certifications do you need to win UK government tenders? Complete guide to ISO, Cyber Essentials, CHAS, and more.',
    url: 'https://rfp.quest/certifications/',
    siteName: 'RFP Platform Quest',
    type: 'website',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/',
  },
}

export default function CertificationsHubPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'UK Procurement Certifications: Complete Guide for Tender Bidders',
    description: 'Which certifications do you need to win UK government tenders? Complete guide to ISO, Cyber Essentials, CHAS, and more. Updated 2026.',
    author: {
      '@type': 'Organization',
      name: 'RFP Platform Quest',
      url: 'https://rfp.quest'
    },
    publisher: {
      '@type': 'Organization',
      name: 'RFP Platform Quest',
      url: 'https://rfp.quest'
    },
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: 'https://rfp.quest/certifications/'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which certifications are most commonly required for UK government tenders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The most commonly required certifications for UK government tenders are ISO 9001 (quality management) appearing in 40% of tenders, Cyber Essentials for any contracts handling data, ISO 14001 and ISO 45001 for works and construction contracts, and health and safety schemes like CHAS or SafeContractor. The specific requirements depend on the contract type, with digital contracts often requiring ISO 27001 and construction requiring SSIP-accredited schemes.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are certifications mandatory for UK public sector contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'While few certifications are strictly legally mandatory, many are effectively required to win contracts. Cyber Essentials is mandatory for central government contracts handling sensitive data (PPN 014), G-Cloud 15 requires it for many lots, and the Common Assessment Standard (replacing PAS 91) is expected for construction. Most other certifications are listed as "advantageous" but significantly impact scoring - contracts without them rarely win.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much do UK procurement certifications typically cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Certification costs vary widely by standard and organisation size. Basic schemes like Cyber Essentials start from £320+VAT, CHAS from £429+VAT annually, and SafeContractor from £419+VAT. ISO certifications are more expensive: ISO 9001 typically £5,000-15,000 in Year 1, ISO 27001 £15,000-40,000, and the new ISO 42001 for AI £8,000-50,000. These include consultancy, certification body fees, and training. Annual surveillance audits add ongoing costs.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does it take to get certified for UK tenders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Certification timelines vary significantly. Quick certifications include Cyber Essentials (1-4 weeks), CHAS (3-10 days once documents submitted), and SafeContractor (2-4 weeks). ISO standards take longer: ISO 9001 typically 3-6 months, ISO 14001 2-4 months, ISO 27001 6-12 months, and ISO 42001 4-6 months for SMEs. Having existing certifications or management systems can reduce these timelines.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is SSIP and which scheme should I choose?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SSIP (Safety Schemes in Procurement) provides mutual recognition between member schemes, meaning one certification is recognised by all members. Major SSIP schemes include CHAS, Constructionline, SafeContractor, and SMAS. Choose based on your primary clients: CHAS for local authorities, Constructionline for major construction, SafeContractor for facilities management. The Common Assessment Standard at the highest tier of these schemes meets PPN 03/24 requirements.'
        }
      }
    ]
  }

  const certifications = [
    // Core ISO Standards
    {
      name: 'ISO 9001',
      sectors: 'All sectors',
      status: 'Advantageous/Mandatory',
      cost: '£5k-£15k',
      time: '3-6 months',
      link: '/certifications/iso-9001-uk-tenders'
    },
    {
      name: 'ISO 14001',
      sectors: 'Works, FM, Infrastructure',
      status: 'Advantageous',
      cost: '£3k-£10k',
      time: '2-4 months',
      link: '/certifications/iso-14001-uk-tenders'
    },
    {
      name: 'ISO 27001',
      sectors: 'Digital, IT, Data',
      status: 'Mandatory (data contracts)',
      cost: '£15k-£40k',
      time: '6-12 months',
      link: '/certifications/iso-27001-uk-tenders'
    },
    {
      name: 'ISO 45001',
      sectors: 'Construction, FM',
      status: 'Mandatory (works)',
      cost: '£3k-£12k',
      time: '3-6 months',
      link: '/certifications/iso-45001-uk-tenders'
    },
    {
      name: 'ISO 42001',
      sectors: 'AI, Digital Services',
      status: 'Emerging requirement',
      cost: '£8k-£50k',
      time: '4-6 months',
      link: '/certifications/iso-42001-uk-tenders'
    },
    {
      name: 'ISO 22301',
      sectors: 'Critical Services',
      status: 'Mandatory (critical)',
      cost: '£3k-£12k',
      time: '4-8 months',
      link: '/certifications/iso-22301-uk-tenders'
    },
    {
      name: 'ISO 13485',
      sectors: 'Medical/NHS',
      status: 'Mandatory (medical)',
      cost: '£3k-£15k',
      time: '6-12 months',
      link: '/certifications/iso-13485-uk-tenders'
    },
    // Cyber Security
    {
      name: 'Cyber Essentials',
      sectors: 'All (data handling)',
      status: 'Mandatory (gov data)',
      cost: '£320-£600',
      time: '1-4 weeks',
      link: '/certifications/cyber-essentials-uk-tenders'
    },
    {
      name: 'Cyber Essentials Plus',
      sectors: 'NHS, MOD, High-risk',
      status: 'Mandatory (specific)',
      cost: '£1.5k-£5k',
      time: '2-8 weeks',
      link: '/certifications/cyber-essentials-plus-uk-tenders'
    },
    // Construction & Safety
    {
      name: 'CHAS',
      sectors: 'Construction, FM',
      status: 'De facto required',
      cost: '£429-£909/year',
      time: '3-10 days',
      link: '/certifications/chas-uk-tenders'
    },
    {
      name: 'Constructionline',
      sectors: 'Construction',
      status: 'Widely required',
      cost: '£498+/year',
      time: '1-2 weeks',
      link: '/certifications/constructionline-uk-tenders'
    },
    {
      name: 'SafeContractor',
      sectors: 'FM, Construction',
      status: 'SSIP recognised',
      cost: '£419+/year',
      time: '2-4 weeks',
      link: '/certifications/safecontractor-uk-tenders'
    },
    // Sector-Specific
    {
      name: 'JOSCAR',
      sectors: 'Defence/Aerospace',
      status: 'Mandatory',
      cost: '£500-£1.5k/yr',
      time: '4-8 weeks',
      link: '/certifications/joscar-defence-tenders'
    },
    {
      name: 'RISQS',
      sectors: 'Rail',
      status: 'Mandatory',
      cost: '£400+/yr',
      time: '4-6 weeks',
      link: '/certifications/risqs-rail-tenders'
    },
    {
      name: 'Achilles UVDB',
      sectors: 'Utilities',
      status: 'Mandatory',
      cost: '£500-£2.5k/yr',
      time: '4-6 weeks',
      link: '/certifications/achilles-uk-tenders'
    },
    {
      name: 'BRCGS',
      sectors: 'Food',
      status: 'Mandatory',
      cost: '£1.5k-£4k/yr',
      time: '6-12 months',
      link: '/certifications/brcgs-food-tenders-uk'
    },
    {
      name: 'AS9100',
      sectors: 'Aerospace',
      status: 'Mandatory',
      cost: '£3k-£15k',
      time: '6-12 months',
      link: '/certifications/as9100-aerospace-tenders'
    },
    // Healthcare
    {
      name: 'DSP Toolkit',
      sectors: 'NHS, Healthcare',
      status: 'Mandatory (NHS data)',
      cost: 'Free (time cost)',
      time: 'Annual cycle',
      link: '/certifications/dsp-toolkit-nhs-tenders'
    },
    // Facilities Management
    {
      name: 'SFG20',
      sectors: 'FM, Maintenance',
      status: 'Required (NHS estates)',
      cost: '£500+/year',
      time: 'Subscription',
      link: '/certifications/sfg20-uk-tenders'
    },
    // Payment & Data
    {
      name: 'PCI DSS',
      sectors: 'Payments',
      status: 'Mandatory',
      cost: '£2k-£15k',
      time: '3-6 months',
      link: '/certifications/pci-dss-uk-tenders'
    },
    // Social Value
    {
      name: 'SMETA/Sedex',
      sectors: 'Food/Goods',
      status: 'Mandatory (retail)',
      cost: '£350-£2.5k/yr',
      time: '1-3 days',
      link: '/certifications/smeta-sedex-uk-tenders'
    },
    // Frameworks
    {
      name: 'G-Cloud',
      sectors: 'Digital/Cloud',
      status: 'Entry requirement',
      cost: 'Free (apply)',
      time: '4-6 weeks',
      link: '/certifications/g-cloud-uk-digital-tenders'
    }
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }}
      />
      
      <article className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-slate-100">
            UK Procurement Certifications: Complete Guide for Tender Bidders
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-lg text-blue-900">
              <strong>2026 Update:</strong> The Procurement Act 2023 is now in force, replacing MEAT 
              with Most Advantageous Tenders (MAT). Social value and environmental certifications 
              now carry increased weighting. ISO 42001 for AI systems is emerging as a critical 
              requirement ahead of EU AI Act enforcement in August 2026.
            </p>
          </div>

          {/* TODO: Add hero image */}
          <div className="bg-slate-800/50 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-slate-400">
              [Image: uk-procurement-certifications-uk.jpg - UK procurement certifications requirements for UK government tenders]
            </p>
          </div>
        </header>

        {/* Introduction */}
        <section className="prose prose-lg max-w-none mb-12">
          <p className="lead text-xl mb-6">
            Certifications can make or break your UK public sector tender submissions. With the 
            Procurement Act 2023 now in effect and Most Advantageous Tenders (MAT) replacing the 
            old MEAT evaluation, having the right certifications is more critical than ever for 
            winning government contracts.
          </p>

          <p>
            This comprehensive guide covers every certification commonly required in UK government 
            tenders, from established ISO standards to emerging requirements like ISO 42001 for AI 
            systems. Whether you're bidding for NHS contracts, local authority frameworks, or 
            central government digital services, you'll find the certification requirements, costs, 
            and timelines you need to plan your compliance strategy.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">
            Why Certifications Matter in UK Public Procurement
          </h2>

          <p>
            Under the Procurement Act 2023 and the shift to Most Advantageous Tenders (MAT), 
            certifications serve multiple critical functions in the evaluation process:
          </p>

          <ul className="space-y-3 my-6">
            <li>
              <strong>Qualify you for more opportunities</strong> - Many tenders list specific 
              certifications as mandatory requirements. Without them, your bid won't even be evaluated.
            </li>
            <li>
              <strong>Increase your evaluation scores</strong> - Certifications often carry 
              significant points in quality assessments, particularly under the new social value 
              and environmental weightings.
            </li>
            <li>
              <strong>Demonstrate credibility</strong> - Third-party certifications show you meet 
              industry best practices and can deliver to required standards.
            </li>
            <li>
              <strong>Reduce buyer risk</strong> - Pre-vetted standards give procurement teams 
              confidence in your capabilities and compliance.
            </li>
          </ul>

          <p>
            The financial impact is significant: organisations with appropriate certifications see 
            win rates 40-65% higher than those without. For framework agreements worth millions, 
            the ROI on certification investment is clear.
          </p>
        </section>

        {/* Comprehensive Certification Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Complete UK Tender Certification Requirements Table
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border-slate-500/50">
              <thead className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
                <tr>
                  <th className="border-slate-500/50 px-4 py-3 text-left font-semibold">Certification</th>
                  <th className="border-slate-500/50 px-4 py-3 text-left font-semibold">Sectors</th>
                  <th className="border-slate-500/50 px-4 py-3 text-left font-semibold">Status</th>
                  <th className="border-slate-500/50 px-4 py-3 text-left font-semibold">Cost</th>
                  <th className="border-slate-500/50 px-4 py-3 text-left font-semibold">Time</th>
                  <th className="border-slate-500/50 px-4 py-3 text-left font-semibold">Guide</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((cert, index) => (
                  <tr key={cert.name} className={index % 2 === 0 ? 'bg-slate-900/60 backdrop-blur-xl border-slate-700/50' : 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'}>
                    <td className="border-slate-500/50 px-4 py-3 font-medium">{cert.name}</td>
                    <td className="border-slate-500/50 px-4 py-3 text-sm">{cert.sectors}</td>
                    <td className="border-slate-500/50 px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        cert.status.includes('Mandatory') ? 'bg-red-100 text-red-800' :
                        cert.status.includes('De facto') ? 'bg-orange-100 text-orange-800' :
                        cert.status.includes('Emerging') ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="border-slate-500/50 px-4 py-3 text-sm">{cert.cost}</td>
                    <td className="border-slate-500/50 px-4 py-3 text-sm">{cert.time}</td>
                    <td className="border-slate-500/50 px-4 py-3">
                      <Link href={cert.link} className="text-blue-600 hover:underline">
                        Guide →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-300 mt-4">
            <strong>Note:</strong> Costs are approximate and vary by organisation size, complexity, 
            and certification body. Times shown are typical for SMEs. Get quotes from UKAS-accredited 
            bodies for accurate pricing.
          </p>
        </section>

        {/* Detailed Sections */}
        <section className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mt-12 mb-4">
            ISO Standards for UK Tenders
          </h2>

          <p>
            ISO (International Organization for Standardization) standards form the backbone of 
            quality and compliance requirements in UK public procurement. Understanding which ISO 
            standards apply to your sector is crucial for tender success.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">ISO 9001 - Quality Management</h3>
          <p>
            The most widely requested certification, appearing in over 40% of UK government tenders. 
            ISO 9001 demonstrates your organisation's commitment to quality management and continuous 
            improvement. While rarely strictly mandatory, it's often the difference between winning 
            and losing competitive tenders.
          </p>
          <p>
            <Link href="/certifications/iso-9001-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete ISO 9001 guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">ISO 14001 - Environmental Management</h3>
          <p>
            With the Procurement Act's emphasis on environmental considerations, ISO 14001 has 
            become crucial for works, facilities management, and infrastructure contracts. Often 
            paired with ISO 45001 as a joint requirement for physical work contracts.
          </p>
          <p>
            <Link href="/certifications/iso-14001-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete ISO 14001 guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">ISO 27001 - Information Security</h3>
          <p>
            Increasingly mandatory for NHS digital contracts, central government IT services, and 
            any contract involving personal or sensitive data. Note that ISO 27001 does NOT replace 
            Cyber Essentials - UK government policy requires both for many contracts.
          </p>
          <p>
            <Link href="/certifications/iso-27001-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete ISO 27001 guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">ISO 45001 - Health & Safety</h3>
          <p>
            The replacement for OHSAS 18001, ISO 45001 is essential for construction, civil 
            engineering, facilities management, and any contract involving physical work. Often 
            mandatory for works contracts above threshold values.
          </p>
          <p>
            <Link href="/certifications/iso-45001-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete ISO 45001 guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">ISO 42001 - AI Management (New)</h3>
          <p>
            The world's first AI management standard, published in 2023. With EU AI Act enforcement 
            beginning August 2026 and UK government guidelines recommending ISO 42001 conformity, 
            this is becoming essential for AI and digital service providers.
          </p>
          <p>
            <Link href="/certifications/iso-42001-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete ISO 42001 guide →
            </Link>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">
            Cyber Security Certifications
          </h2>

          <p>
            The UK government's approach to cyber security in procurement involves two key schemes 
            that serve different purposes and are often both required.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Cyber Essentials</h3>
          <p>
            Managed by the National Cyber Security Centre (NCSC), Cyber Essentials is mandatory 
            for central government contracts handling sensitive or personal data. G-Cloud 15 now 
            requires it for many supplier lots. The basic scheme costs from £320+VAT and can be 
            completed in 1-4 weeks.
          </p>
          <p>
            <Link href="/certifications/cyber-essentials-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete Cyber Essentials guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Cyber Essentials Plus</h3>
          <p>
            The higher tier includes independent technical verification of your cyber security. 
            Required for NHS digital contracts, MOD supply chain, and high-risk data contracts. 
            Significantly more expensive (£1,500-5,000) due to the hands-on audit requirement.
          </p>
          <p>
            <Link href="/certifications/cyber-essentials-plus-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete Cyber Essentials Plus guide →
            </Link>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">
            Health & Safety Schemes (SSIP)
          </h2>

          <p>
            The Safety Schemes in Procurement (SSIP) umbrella provides mutual recognition between 
            member schemes, meaning one certification is recognised by all members. This prevents 
            duplication and reduces costs for contractors.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Understanding SSIP</h3>
          <p>
            SSIP mutual recognition means you only need ONE of these certifications to meet most 
            health and safety requirements. Choose based on your primary clients and contract types. 
            The Common Assessment Standard at the highest tier meets PPN 03/24 requirements.
          </p>
          <p>
            <Link href="/certifications/ssip-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete SSIP comparison guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">CHAS</h3>
          <p>
            The Contractors Health and Safety Assessment Scheme is particularly popular with local 
            authorities and housing associations. Three tiers available: Standard (£429+VAT), 
            Advanced (£659+VAT), and Elite (£909+VAT) which covers the Common Assessment Standard.
          </p>
          <p>
            <Link href="/certifications/chas-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete CHAS guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Constructionline</h3>
          <p>
            The UK's largest pre-qualification system for construction, used by over 30,000 buyers. 
            Bronze, Silver, and Gold tiers available, with Gold covering the Common Assessment 
            Standard. Includes PAS 91 compliance built-in.
          </p>
          <p>
            <Link href="/certifications/constructionline-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete Constructionline guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">SafeContractor</h3>
          <p>
            Run by Alcumus, SafeContractor is widely recognised across facilities management and 
            construction sectors. Standard certification from £419+VAT annually. Popular with 
            commercial clients who also bid public sector work.
          </p>
          <p>
            <Link href="/certifications/safecontractor-uk-tenders" className="text-blue-600 hover:underline">
              Read our complete SafeContractor guide →
            </Link>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">
            Sector-Specific Requirements
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">NHS and Healthcare</h3>
          <p>
            NHS contracts have unique requirements including the Data Security and Protection (DSP) 
            Toolkit for any organisation handling patient data. This annual assessment is mandatory 
            and links to ISO 27001 and Cyber Essentials requirements.
          </p>
          <p>
            <Link href="/certifications/dsp-toolkit-nhs-tenders" className="text-blue-600 hover:underline">
              Read our DSP Toolkit guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Facilities Management</h3>
          <p>
            FM contracts often require SFG20 compliance - the industry standard for building 
            maintenance specifications. While not a traditional certification, compliance means 
            aligning your maintenance schedules with SFG20 standards, particularly for NHS estates.
          </p>
          <p>
            <Link href="/certifications/sfg20-uk-tenders" className="text-blue-600 hover:underline">
              Read our SFG20 guide →
            </Link>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Construction and Infrastructure</h3>
          <p>
            The Common Assessment Standard has replaced PAS 91 as the construction prequalification 
            standard. Available through CHAS Elite, Constructionline Gold, and other top-tier SSIP 
            schemes. Understanding this transition is crucial for construction contractors.
          </p>
          <p>
            <Link href="/certifications/pas-91-uk-tenders" className="text-blue-600 hover:underline">
              Read about PAS 91 and Common Assessment Standard →
            </Link>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">
            Certification Strategy and Prioritisation
          </h2>

          <p>
            With limited resources and time, prioritising your certification investments is crucial. 
            Here's how to develop your certification roadmap:
          </p>

          <ol className="list-decimal pl-6 space-y-4 my-6">
            <li>
              <strong>Analyse your target market</strong><br/>
              Review the last 20 tenders in your sector. Which certifications appear most frequently? 
              Which are mandatory versus advantageous?
            </li>
            <li>
              <strong>Start with the essentials</strong><br/>
              For most organisations, Cyber Essentials (£320, 1-4 weeks) and an appropriate SSIP 
              scheme (£400-900, days to weeks) provide immediate qualification for many tenders.
            </li>
            <li>
              <strong>Build your ISO portfolio strategically</strong><br/>
              ISO 9001 opens the most doors. Add ISO 14001 and 45001 for physical work contracts, 
              ISO 27001 for digital/data contracts. ISO 42001 for AI-related work.
            </li>
            <li>
              <strong>Consider integrated management systems</strong><br/>
              Implementing ISO 9001, 14001, and 45001 together can save 30-40% on costs and time 
              through shared audits and documentation.
            </li>
            <li>
              <strong>Plan for renewal cycles</strong><br/>
              Most certifications require annual renewal or surveillance. Budget for ongoing costs 
              and schedule reviews to prevent lapses during critical tender periods.
            </li>
          </ol>

          <h2 className="text-2xl font-bold mt-12 mb-4">
            Cost-Benefit Analysis
          </h2>

          <p>
            Understanding the return on certification investment helps justify the expense:
          </p>

          <div className="bg-blue-900/20 p-6 rounded-lg my-6">
            <h3 className="text-lg font-semibold mb-3">Typical ROI Metrics</h3>
            <ul className="space-y-2">
              <li><strong>Win rate improvement:</strong> 40-65% higher with appropriate certifications</li>
              <li><strong>Tender qualification rate:</strong> Access to 3-5x more opportunities</li>
              <li><strong>Premium pricing ability:</strong> 5-15% higher rates with ISO certifications</li>
              <li><strong>Framework access:</strong> Multi-million pound opportunities requiring specific certifications</li>
              <li><strong>Reduced tender costs:</strong> 20+ hours saved per tender through pre-qualification</li>
            </ul>
          </div>

          <p>
            For an organisation bidding regularly on public sector work, the typical payback period 
            for certification investment is 6-18 months, often recovered with just 1-2 successful 
            tenders.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">
            Future Trends and Emerging Requirements
          </h2>

          <p>
            Stay ahead of the curve by preparing for emerging certification requirements:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">AI and Automation</h3>
          <p>
            ISO 42001 for AI management systems will become increasingly important as public sector 
            AI adoption grows. The EU AI Act enforcement in August 2026 will accelerate this trend. 
            Early adopters will have significant competitive advantage.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Net Zero and Sustainability</h3>
          <p>
            Beyond ISO 14001, expect requirements for carbon neutrality certification, Science-Based 
            Targets validation, and B Corp certification to become more common, particularly for 
            high-value, long-term contracts.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Social Value</h3>
          <p>
            The Procurement Act's emphasis on social value will drive demand for certifications 
            like Social Enterprise Mark, Living Wage accreditation, and Disability Confident 
            employer status.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Digital and Data</h3>
          <p>
            As government digital transformation continues, expect new requirements around API 
            security standards, cloud security certifications, and data ethics frameworks beyond 
            traditional ISO 27001.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 p-6 rounded-lg shadow-sm border-slate-600/50">
              <h3 className="text-lg font-semibold mb-2">
                Which certifications are most commonly required for UK government tenders?
              </h3>
              <p>
                The most commonly required certifications are ISO 9001 (40% of tenders), Cyber 
                Essentials (mandatory for data-handling contracts), ISO 14001 and ISO 45001 for 
                works contracts, and SSIP health and safety schemes like CHAS or SafeContractor. 
                Requirements vary by sector, with digital contracts often requiring ISO 27001 and 
                construction requiring Constructionline or similar.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 p-6 rounded-lg shadow-sm border-slate-600/50">
              <h3 className="text-lg font-semibold mb-2">
                Are certifications mandatory for UK public sector contracts?
              </h3>
              <p>
                Few certifications are strictly legally mandatory, but many are effectively required. 
                Cyber Essentials is mandatory for central government data contracts (PPN 014), the 
                DSP Toolkit is mandatory for NHS data handlers, and health and safety schemes are 
                de facto required for construction. Most others are "advantageous" but significantly 
                impact scoring.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 p-6 rounded-lg shadow-sm border-slate-600/50">
              <h3 className="text-lg font-semibold mb-2">
                How much do UK procurement certifications typically cost?
              </h3>
              <p>
                Costs vary widely. Basic schemes: Cyber Essentials £320+, CHAS £429+, SafeContractor 
                £419+ annually. ISO standards are more expensive: ISO 9001 £5k-15k, ISO 27001 £15k-40k, 
                ISO 42001 £8k-50k in Year 1 including consultancy. Annual surveillance adds ongoing costs. 
                Always get quotes from UKAS-accredited bodies.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 p-6 rounded-lg shadow-sm border-slate-600/50">
              <h3 className="text-lg font-semibold mb-2">
                How long does it take to get certified?
              </h3>
              <p>
                Quick certifications: Cyber Essentials 1-4 weeks, CHAS 3-10 days, SafeContractor 
                2-4 weeks. ISO standards take longer: ISO 9001 3-6 months, ISO 14001 2-4 months, 
                ISO 27001 6-12 months, ISO 42001 4-6 months for SMEs. Existing management systems 
                can reduce these timelines.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 p-6 rounded-lg shadow-sm border-slate-600/50">
              <h3 className="text-lg font-semibold mb-2">
                What is SSIP and which scheme should I choose?
              </h3>
              <p>
                SSIP provides mutual recognition between health and safety schemes - one certification 
                covers all members. Choose based on your clients: CHAS for local authorities, 
                Constructionline for major construction, SafeContractor for FM. The top tier (CHAS Elite, 
                Constructionline Gold) meets Common Assessment Standard requirements.
              </p>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-12 space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Check What Certifications Your Next Tender Needs</h2>
            <p className="mb-6">
              Our bid intelligence platform automatically identifies certification requirements in 
              tender documents and alerts you to gaps in your compliance profile.
            </p>
            <Link
              href="/"
              className="inline-block bg-slate-900/60 backdrop-blur-xl border-slate-700/50 text-blue-600 px-6 py-3 rounded font-semibold hover:bg-slate-800/50 transition"
            >
              Try RFP Platform Quest Free →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8 rounded-lg border-slate-600/50">
            <h2 className="text-2xl font-bold mb-4">Get Help with Certification</h2>
            <p className="mb-6">
              Need guidance on which certifications to prioritise for your sector? Our experts can 
              review your tender history and recommend a certification roadmap.
            </p>
            <Link
              href="/certifications/get-help"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
            >
              Get Certification Advice →
            </Link>
          </div>
        </section>

        {/* Internal Links */}
        <nav className="mt-12 pt-8 border-t border-slate-600/50">
          <h3 className="text-lg font-semibold mb-4">Certification Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map(cert => (
              <Link
                key={cert.name}
                href={cert.link}
                className="text-blue-600 hover:underline"
              >
                {cert.name} for UK tenders →
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/" className="text-blue-600 hover:underline">
              RFP Platform Quest - UK RFP intelligence platform
            </Link>
          </div>
        </nav>

        {/* External Links */}
        <div className="mt-8 p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Official Resources</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.gov.uk/government/collections/procurement-policy-notes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline external-link"
              >
                UK Government Procurement Policy Notes
              </a>
            </li>
            <li>
              <a
                href="https://www.ukas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline external-link"
              >
                UKAS - Find accredited certification bodies
              </a>
            </li>
            <li>
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline external-link"
              >
                NCSC Cyber Essentials scheme
              </a>
            </li>
            <li>
              <a
                href="https://ssip.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline external-link"
              >
                SSIP - Safety Schemes in Procurement
              </a>
            </li>
          </ul>
        </div>
      </article>
    </>
  )
}