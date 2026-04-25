import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'SafeContractor UK Tenders: SSIP Certification Guide 2026',
  description: 'SafeContractor is a leading SSIP scheme for UK utilities, FM and construction contracts. Learn costs (from £299), timeline, and which sectors require SafeContractor accreditation.',
  keywords: 'SafeContractor UK tenders, SafeContractor certification, SSIP SafeContractor, Alcumus SafeContractor, SafeContractor government contracts',
  openGraph: {
    title: 'SafeContractor for UK Government Contracts: Complete SSIP Guide',
    description: 'SafeContractor is a leading SSIP scheme for UK utilities, FM and construction. Learn costs, timeline, and which sectors require accreditation.',
    url: 'https://rfp.quest/certifications/safecontractor-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/safecontractor-uk-tenders',
  },
}

export default function SafeContractorUKTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'SafeContractor for UK Government Contracts: Complete SSIP Guide',
    description: 'SafeContractor is a leading SSIP scheme for UK utilities, FM and construction. Learn costs, timeline, and which sectors require accreditation.',
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
    datePublished: '2024-03-20',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: 'https://rfp.quest/certifications/safecontractor-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is SafeContractor certification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SafeContractor is a leading SSIP (Safety Schemes in Procurement) health and safety assessment scheme owned by Alcumus Group. It pre-qualifies contractors by verifying H&S policies, procedures, and competence. With 35,000+ contractor members and 850+ client organisations, it\'s particularly strong in utilities, FM, retail, and manufacturing sectors. As an SSIP member, SafeContractor certification is mutually recognised by other schemes.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does SafeContractor cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SafeContractor costs from £299+VAT for companies with 1-9 employees, rising to £969+VAT for 100+ employees. This includes assessment and 12-month certification. Additional modules like CDM cost £60 each. Fast-track 3-day service adds £250. Combined SafeContractor + ISO packages available from £1,499. Annual renewal required at same price. Multi-year deals offer 10% discount.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between SafeContractor and CHAS?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Both SafeContractor and CHAS are SSIP schemes assessing H&S competence. Key differences: SafeContractor is privately owned by Alcumus, stronger in private sector (utilities, FM, retail). CHAS is government-owned, preferred by 130+ councils. SafeContractor includes contractor verification visits, CHAS is desktop-only. Both are mutually recognised under SSIP, but some buyers specifically require one or the other.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is SafeContractor mandatory for utilities contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SafeContractor is effectively mandatory for most UK utilities contracts. Major utilities including National Grid, UK Power Networks, SGN, Cadent Gas, and Thames Water require SafeContractor from all contractors. Water companies under Water UK framework mandate it. Without SafeContractor, you cannot access utilities sector opportunities worth billions annually.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does SafeContractor assessment take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SafeContractor assessment typically takes 3-4 weeks: 1-2 days to complete application and upload documents, 10-15 working days for assessment review, 3-5 days for remedial actions if required. Fast-track 3-day service available for urgent requirements (£250 extra). Renewal is quicker at 5-10 days. Approved status visible immediately upon certification.'
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-slate-100">
            SafeContractor for UK Government Contracts: Complete SSIP Guide
          </h1>
          
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 mb-8">
            <p className="text-lg font-semibold text-orange-900 mb-2">
              ⚡ Essential for Utilities & FM Sectors
            </p>
            <p className="text-orange-800">
              SafeContractor is required by National Grid, UK Power Networks, and most utilities companies. With 850+ major clients and SSIP mutual recognition, it opens doors across private and public sectors.
            </p>
          </div>

          <div className="bg-slate-800/50 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-slate-400">
              [Image: safecontractor-uk-certification.jpg - SafeContractor logo and SSIP accreditation for UK contractors]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            SafeContractor, owned by Alcumus Group, is one of the UK's largest health and safety assessment schemes with over 35,000 accredited contractors. Originally developed for the utilities sector, it has expanded to become the preferred H&S pre-qualification system for facilities management, retail, manufacturing, and increasingly, public sector contracts.
          </p>

          <p>
            As a founding member of SSIP (Safety Schemes in Procurement), SafeContractor offers mutual recognition with other schemes while maintaining its own rigorous assessment standards. Its strength lies in sector-specific expertise, particularly in high-risk industries where comprehensive H&S validation is critical.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Who Requires SafeContractor?</h2>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Utilities Sector (Primary)</h3>
            <ul className="space-y-2">
              <li>• <strong>National Grid:</strong> Mandatory for all contractors</li>
              <li>• <strong>UK Power Networks:</strong> Required for approved suppliers</li>
              <li>• <strong>SGN (Scotia Gas Networks):</strong> Essential for gas works</li>
              <li>• <strong>Cadent Gas:</strong> All supply chain partners</li>
              <li>• <strong>Northern Powergrid:</strong> Framework contractors</li>
              <li>• <strong>Thames Water:</strong> Approved contractor scheme</li>
              <li>• <strong>Severn Trent:</strong> Capital delivery partners</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Facilities Management</h3>
            <ul className="space-y-2">
              <li>• Major FM companies (Mitie, Serco, Sodexo)</li>
              <li>• Retail maintenance (Tesco, Sainsbury's, ASDA)</li>
              <li>• Commercial property services</li>
              <li>• Shopping centre contractors</li>
              <li>• Office cleaning and maintenance</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Transport & Infrastructure</h3>
            <ul className="space-y-2">
              <li>• Network Rail supply chain</li>
              <li>• Transport for London contractors</li>
              <li>• Airport operators (Heathrow, Gatwick)</li>
              <li>• Port authorities</li>
              <li>• Highways maintenance contractors</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Public Sector (Growing)</h3>
            <ul className="space-y-2">
              <li>• NHS Property Services</li>
              <li>• Ministry of Defence estates</li>
              <li>• Police and fire service facilities</li>
              <li>• Some local authorities (50+ councils)</li>
              <li>• Universities and colleges</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SafeContractor Certification Costs</h2>
          
          <p>
            Pricing is based on number of employees:
          </p>

          <table className="min-w-full border-slate-500/50 my-6">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="border-slate-500/50 px-4 py-2 text-left">Company Size</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Annual Cost</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">3-Year Deal</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Fast-Track</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">1-9 employees</td>
                <td className="border-slate-500/50 px-4 py-2">£299 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£807 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£549 + VAT</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">10-19 employees</td>
                <td className="border-slate-500/50 px-4 py-2">£449 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£1,212 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£699 + VAT</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">20-49 employees</td>
                <td className="border-slate-500/50 px-4 py-2">£599 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£1,617 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£849 + VAT</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">50-99 employees</td>
                <td className="border-slate-500/50 px-4 py-2">£799 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£2,157 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£1,049 + VAT</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">100+ employees</td>
                <td className="border-slate-500/50 px-4 py-2">£969 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£2,616 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">£1,219 + VAT</td>
              </tr>
            </tbody>
          </table>

          <p>
            Additional modules and services:
          </p>
          <ul>
            <li>• CDM Regulations module: £60 + VAT</li>
            <li>• Environmental module: £60 + VAT</li>
            <li>• Quality assurance module: £60 + VAT</li>
            <li>• Contractor Plus (enhanced profile): £150 + VAT</li>
            <li>• Desktop support package: £350 + VAT</li>
            <li>• Site verification visit: £450 + VAT</li>
            <li>• Combined ISO + SafeContractor: From £1,499 + VAT</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">The SafeContractor Assessment Process</h2>
          
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 1: Registration & Application</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Create online account</li>
              <li>• Complete company details questionnaire</li>
              <li>• Select relevant trade categories</li>
              <li>• Identify client-specific requirements</li>
              <li>• Pay assessment fee</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 2: Document Upload</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Health & Safety Policy (signed/dated)</li>
              <li>• Insurance certificates (EL, PL, PI)</li>
              <li>• Risk assessments (minimum 3)</li>
              <li>• Method statements</li>
              <li>• Training records and certificates</li>
              <li>• Accident/incident records</li>
              <li>• Equipment inspection certificates</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 3: Assessment Review</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Expert assessor reviews documentation</li>
              <li>• Legal compliance check</li>
              <li>• Risk assessment quality evaluation</li>
              <li>• Training adequacy verification</li>
              <li>• Sector-specific requirements checked</li>
              <li>• Feedback provided if improvements needed</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 4: Certification Decision</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Pass: Certificate issued immediately</li>
              <li>• Remedial action: Specific improvements required</li>
              <li>• 14-day window for corrections</li>
              <li>• Re-assessment at no extra cost</li>
              <li>• Profile activated in database</li>
              <li>• Client notifications sent</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SafeContractor Plus Features</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Contractor Verification Visits</h3>
            <p>
              Unlike most SSIP schemes, SafeContractor offers optional site verification visits. An assessor physically inspects your premises, equipment, and documentation. This enhanced verification is valued by high-risk sectors and can differentiate you from competitors. Particularly important for utilities and rail contractors.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Client-Specific Modules</h3>
            <p>
              SafeContractor allows major clients to add bespoke requirements. For example, National Grid contractors must complete additional electrical safety modules. Thames Water requires water hygiene assessments. These client-specific elements are integrated into your main assessment, avoiding duplication.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Alcumus Safe System</h3>
            <p>
              SafeContractor members get discounted access to Alcumus's wider compliance tools including StaySafe lone worker app, Sypol H&S management software, and IOSH training courses. Integration with these systems can streamline compliance management and reduce administrative burden.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common SafeContractor Requirements by Sector</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Utilities Specific</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Permit to work procedures</li>
                <li>• Confined space entry protocols</li>
                <li>• Excavation and reinstatement methods</li>
                <li>• Service strike prevention</li>
                <li>• Emergency response procedures</li>
                <li>• NRSWA streetworks qualifications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">FM & Cleaning Specific</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• COSHH assessments for all chemicals</li>
                <li>• Lone working procedures</li>
                <li>• Key holding and security protocols</li>
                <li>• Waste management procedures</li>
                <li>• BICSc training evidence</li>
                <li>• Equipment PAT testing records</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Construction Specific</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• CDM 2015 compliance evidence</li>
                <li>• Asbestos awareness training</li>
                <li>• Working at height procedures</li>
                <li>• Lifting operations plans</li>
                <li>• Scaffold inspection records</li>
                <li>• CSCS card register</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SafeContractor vs Other SSIP Schemes</h2>
          
          <table className="min-w-full border-slate-500/50 my-6">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="border-slate-500/50 px-4 py-2 text-left">Feature</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">SafeContractor</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">CHAS</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">SMAS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Ownership</td>
                <td className="border-slate-500/50 px-4 py-2">Alcumus (Private)</td>
                <td className="border-slate-500/50 px-4 py-2">LGA (Government)</td>
                <td className="border-slate-500/50 px-4 py-2">SSIP Ltd</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Primary sectors</td>
                <td className="border-slate-500/50 px-4 py-2">Utilities, FM, Retail</td>
                <td className="border-slate-500/50 px-4 py-2">Local authorities</td>
                <td className="border-slate-500/50 px-4 py-2">General construction</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Site visits available</td>
                <td className="border-slate-500/50 px-4 py-2">✅ Yes</td>
                <td className="border-slate-500/50 px-4 py-2">❌ No</td>
                <td className="border-slate-500/50 px-4 py-2">❌ No</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Client customisation</td>
                <td className="border-slate-500/50 px-4 py-2">✅ Extensive</td>
                <td className="border-slate-500/50 px-4 py-2">Limited</td>
                <td className="border-slate-500/50 px-4 py-2">Basic</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">Number of clients</td>
                <td className="border-slate-500/50 px-4 py-2">850+</td>
                <td className="border-slate-500/50 px-4 py-2">130+ councils</td>
                <td className="border-slate-500/50 px-4 py-2">400+</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2">SSIP recognition</td>
                <td className="border-slate-500/50 px-4 py-2">✅ Full member</td>
                <td className="border-slate-500/50 px-4 py-2">✅ Full member</td>
                <td className="border-slate-500/50 px-4 py-2">✅ Full member</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">Tips for SafeContractor Success</h2>
          
          <ol className="space-y-3">
            <li><strong>1. Check client requirements:</strong> Major clients have specific modules - add these during application</li>
            <li><strong>2. Use sector-specific examples:</strong> Tailor risk assessments to your actual work activities</li>
            <li><strong>3. Include all insurances:</strong> Contract Works, Tools cover often needed beyond basic EL/PL</li>
            <li><strong>4. Evidence specialist training:</strong> NRSWA, confined spaces, first aid, etc.</li>
            <li><strong>5. Document near misses:</strong> Shows proactive safety culture</li>
            <li><strong>6. Update expiry dates:</strong> Insurance, training, equipment inspections</li>
            <li><strong>7. Consider verification visit:</strong> Adds credibility for high-value contracts</li>
            <li><strong>8. Complete all trade categories:</strong> Don't limit opportunities</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common Failure Points</h2>
          
          <div className="bg-amber-900/20 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              ⚠️ Top Reasons for SafeContractor Rejection
            </p>
            <ul className="space-y-2 text-amber-800">
              <li>• Generic risk assessments not matching declared activities</li>
              <li>• Insufficient public liability insurance (many need £10M)</li>
              <li>• Missing trade-specific training certificates</li>
              <li>• No young person risk assessment (if employ under-18s)</li>
              <li>• Inadequate sub-contractor management procedures</li>
              <li>• Equipment inspection certificates expired</li>
              <li>• No drug and alcohol policy (required for utilities)</li>
              <li>• Missing client-specific requirements</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SafeContractor for Small Businesses</h2>
          
          <p>
            SafeContractor offers support for smaller contractors:
          </p>

          <ul className="space-y-2">
            <li>• Template H&S policies available</li>
            <li>• Example risk assessments provided</li>
            <li>• Helpdesk support included</li>
            <li>• Payment plans available</li>
            <li>• Group schemes through trade associations</li>
          </ul>

          <p>
            Many sole traders and micro-businesses successfully achieve SafeContractor. The key is demonstrating proportionate H&S management appropriate to your business size and risk profile.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is SafeContractor certification?</h3>
              <p>
                SafeContractor is a leading SSIP (Safety Schemes in Procurement) health and safety assessment scheme owned by Alcumus Group. It pre-qualifies contractors by verifying H&S policies, procedures, and competence. With 35,000+ contractor members and 850+ client organisations, it's particularly strong in utilities, FM, retail, and manufacturing sectors. As an SSIP member, SafeContractor certification is mutually recognised by other schemes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does SafeContractor cost?</h3>
              <p>
                SafeContractor costs from £299+VAT for companies with 1-9 employees, rising to £969+VAT for 100+ employees. This includes assessment and 12-month certification. Additional modules like CDM cost £60 each. Fast-track 3-day service adds £250. Combined SafeContractor + ISO packages available from £1,499. Annual renewal required at same price. Multi-year deals offer 10% discount.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What is the difference between SafeContractor and CHAS?</h3>
              <p>
                Both SafeContractor and CHAS are SSIP schemes assessing H&S competence. Key differences: SafeContractor is privately owned by Alcumus, stronger in private sector (utilities, FM, retail). CHAS is government-owned, preferred by 130+ councils. SafeContractor includes contractor verification visits, CHAS is desktop-only. Both are mutually recognised under SSIP, but some buyers specifically require one or the other.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is SafeContractor mandatory for utilities contracts?</h3>
              <p>
                SafeContractor is effectively mandatory for most UK utilities contracts. Major utilities including National Grid, UK Power Networks, SGN, Cadent Gas, and Thames Water require SafeContractor from all contractors. Water companies under Water UK framework mandate it. Without SafeContractor, you cannot access utilities sector opportunities worth billions annually.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does SafeContractor assessment take?</h3>
              <p>
                SafeContractor assessment typically takes 3-4 weeks: 1-2 days to complete application and upload documents, 10-15 working days for assessment review, 3-5 days for remedial actions if required. Fast-track 3-day service available for urgent requirements (£250 extra). Renewal is quicker at 5-10 days. Approved status visible immediately upon certification.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.safecontractor.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                SafeContractor Official Website
              </a>
            </li>
            <li>
              <a href="https://www.alcumus.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Alcumus Group
              </a>
            </li>
            <li>
              <a href="https://www.ssip.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                SSIP Mutual Recognition
              </a>
            </li>
            <li>
              <a href="https://www.nationalgrid.com/suppliers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                National Grid Supplier Requirements
              </a>
            </li>
            <li>
              <a href="https://www.hse.gov.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                HSE Health & Safety Executive
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-slate-600/50">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/chas-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  CHAS Certification
                </Link>
                <p className="text-sm text-slate-300 mt-1">Government-owned alternative</p>
              </div>
              <div>
                <Link href="/certifications/ssip-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  SSIP Overview
                </Link>
                <p className="text-sm text-slate-300 mt-1">Understanding all schemes</p>
              </div>
              <div>
                <Link href="/certifications/constructionline-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  Constructionline Gold
                </Link>
                <p className="text-sm text-slate-300 mt-1">Combined PQQ + SSIP</p>
              </div>
              <div>
                <Link href="/certifications/iso-45001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 45001
                </Link>
                <p className="text-sm text-slate-300 mt-1">International H&S standard</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/certifications/" className="text-blue-600 hover:underline font-medium">
                ← Back to All UK Procurement Certifications
              </Link>
            </div>
          </nav>
        </section>
      </article>
    </>
  )
}