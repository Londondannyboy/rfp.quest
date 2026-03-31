import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'CHAS UK Tenders: Contractors Health & Safety Assessment 2026',
  description: 'CHAS is the leading SSIP scheme for UK construction and FM contracts. Learn costs (from £198), timeline (2-4 weeks), and which councils require CHAS accreditation.',
  keywords: 'CHAS UK tenders, CHAS certification, CHAS accreditation, SSIP scheme, CHAS government contracts, contractors health and safety assessment',
  openGraph: {
    title: 'CHAS Certification for UK Tenders: Complete Contractor Guide',
    description: 'CHAS is the leading SSIP scheme for UK construction and FM contracts. Learn costs, timeline, and which councils require CHAS accreditation.',
    url: 'https://rfp.quest/certifications/chas-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/chas-uk-tenders',
  },
}

export default function CHASUKTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'CHAS Certification for UK Tenders: Complete Contractor Guide',
    description: 'CHAS is the leading SSIP scheme for UK construction and FM contracts. Learn costs, timeline, and which councils require CHAS accreditation.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/chas-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is CHAS certification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CHAS (Contractors Health and Safety Assessment Scheme) is a SSIP (Safety Schemes in Procurement) accreditation that demonstrates health and safety competence. It pre-qualifies contractors for UK public sector work by verifying H&S policies, risk assessments, method statements, insurance, and competency. CHAS is government-owned and the most widely recognised SSIP scheme.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does CHAS certification cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CHAS costs from £198+VAT for micro companies (1-4 employees) up to £750+VAT for large organisations (250+ employees). Additional services like CHAS Plus (£450+) and CHAS Elite (£995+) offer enhanced credibility. Assessment support services cost £200-£500. Annual renewal is required at the same price. Multi-year discounts of 10-15% are available.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is CHAS mandatory for council contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CHAS is effectively mandatory for most local authority construction and FM contracts. Over 130 UK councils specifically require CHAS, including all London boroughs, Birmingham, Manchester, Edinburgh, and Cardiff. While some accept alternative SSIP schemes, CHAS has the widest acceptance. Without CHAS or equivalent, you cannot bid for most council construction work.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between CHAS and SafeContractor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CHAS and SafeContractor are both SSIP schemes but differ in ownership and focus. CHAS is government-owned with 130+ council members and focuses on public sector. SafeContractor is privately owned by Alcumus and stronger in utilities and FM. Both are mutually recognised under SSIP, but some buyers specifically require one or the other. Check tender requirements carefully.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does CHAS assessment take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CHAS assessment typically takes 2-4 weeks: 1-2 days to complete the application, 5-10 working days for assessment, and 3-5 days for any remedial actions if required. Fast-track 48-hour service is available for urgent tenders at additional cost (£150-£300). Renewal is quicker at 1-2 weeks as most information carries forward.'
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
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            CHAS Certification for UK Tenders: Complete Contractor Guide
          </h1>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
            <p className="text-lg font-semibold text-green-900 mb-2">
              ✅ Essential for Council & NHS Contracts
            </p>
            <p className="text-green-800">
              CHAS is required by 130+ UK councils and most NHS trusts. As the government-owned SSIP scheme with the widest public sector acceptance, CHAS opens doors to thousands of construction and FM opportunities.
            </p>
          </div>

          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: chas-uk-tenders-certification.jpg - CHAS logo and certification process for UK government contractors]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            CHAS (Contractors Health and Safety Assessment Scheme) is the UK's leading health and safety pre-qualification scheme, owned by the Local Government Association. With over 130 local authority members and 85,000 registered suppliers, CHAS has become the de facto standard for demonstrating H&S competence in public sector contracts.
          </p>

          <p>
            Established in 1997 following construction industry fatalities, CHAS pioneered the concept of H&S pre-qualification. Now part of SSIP (Safety Schemes in Procurement), CHAS certification proves your organisation meets the Core Criteria for health and safety management - saving time and cost versus individual assessments for each contract.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">When CHAS is Required for UK Tenders</h2>
          
          <p>
            CHAS has become essential for winning certain types of public sector contracts:
          </p>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Local Authority Contracts</h3>
            <ul className="space-y-2">
              <li>• 130+ councils specifically require CHAS</li>
              <li>• All 32 London boroughs mandate CHAS</li>
              <li>• Construction, maintenance and repair work</li>
              <li>• Facilities management and cleaning</li>
              <li>• Grounds maintenance and landscaping</li>
              <li>• Social housing repairs and upgrades</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">NHS & Healthcare</h3>
            <ul className="space-y-2">
              <li>• NHS Property Services frameworks</li>
              <li>• Hospital maintenance contracts</li>
              <li>• NHS capital projects under £1M</li>
              <li>• Primary care property services</li>
              <li>• Healthcare facilities management</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Education Sector</h3>
            <ul className="space-y-2">
              <li>• School maintenance and repairs</li>
              <li>• Academy trust approved suppliers</li>
              <li>• University term contractors</li>
              <li>• Further education college works</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Housing Associations</h3>
            <ul className="space-y-2">
              <li>• Repairs and maintenance contracts</li>
              <li>• Planned works programmes</li>
              <li>• Void property refurbishment</li>
              <li>• Estate services and grounds</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">CHAS Certification Levels</h2>
          
          <p>
            CHAS offers different certification levels to match contract requirements:
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Level</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Coverage</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Annual Cost</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">CHAS Standard</td>
                <td className="border border-gray-300 px-4 py-2">Core H&S assessment</td>
                <td className="border border-gray-300 px-4 py-2">£198 - £750</td>
                <td className="border border-gray-300 px-4 py-2">Most contractors</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">CHAS Plus</td>
                <td className="border border-gray-300 px-4 py-2">Standard + PAS 91 modules</td>
                <td className="border border-gray-300 px-4 py-2">£450 - £1,200</td>
                <td className="border border-gray-300 px-4 py-2">Complex projects</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">CHAS Elite</td>
                <td className="border border-gray-300 px-4 py-2">Plus + Quality/Environmental</td>
                <td className="border border-gray-300 px-4 py-2">£995 - £1,995</td>
                <td className="border border-gray-300 px-4 py-2">Major contractors</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">CHAS Premium</td>
                <td className="border border-gray-300 px-4 py-2">All modules + consultancy</td>
                <td className="border border-gray-300 px-4 py-2">£1,500 - £3,000</td>
                <td className="border border-gray-300 px-4 py-2">Strategic suppliers</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">CHAS Standard Certification Costs</h2>
          
          <p>
            CHAS pricing is based on company size (employee count):
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Company Size</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Annual Fee</th>
                <th className="border border-gray-300 px-4 py-2 text-left">3-Year Deal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">1-4 employees</td>
                <td className="border border-gray-300 px-4 py-2">£198 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£505 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">5-9 employees</td>
                <td className="border border-gray-300 px-4 py-2">£265 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£675 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">10-19 employees</td>
                <td className="border border-gray-300 px-4 py-2">£350 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£892 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">20-49 employees</td>
                <td className="border border-gray-300 px-4 py-2">£450 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£1,147 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">50-249 employees</td>
                <td className="border border-gray-300 px-4 py-2">£595 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£1,517 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">250+ employees</td>
                <td className="border border-gray-300 px-4 py-2">£750 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£1,912 + VAT</td>
              </tr>
            </tbody>
          </table>

          <p>
            Additional services and costs:
          </p>
          <ul>
            <li>• Fast-track 48-hour assessment: £150-£300 extra</li>
            <li>• Desktop support during assessment: £200-£500</li>
            <li>• Document templates package: £99</li>
            <li>• Remedial action support: £50-£100/hour</li>
            <li>• CDM compliance add-on: £195</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">The CHAS Assessment Process</h2>
          
          <p>
            Understanding the assessment helps ensure first-time success:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 1: Application (Days 1-2)</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Complete online application form</li>
              <li>• Upload H&S policy (signed and dated)</li>
              <li>• Provide organisation and contact details</li>
              <li>• Declare work categories (construction trades)</li>
              <li>• Pay assessment fee</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 2: Document Submission (Days 2-3)</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Insurance certificates (PL, EL, Professional)</li>
              <li>• Risk assessments (minimum 2 examples)</li>
              <li>• Method statements (job-specific)</li>
              <li>• Training records and competency evidence</li>
              <li>• Accident records (3 years)</li>
              <li>• Enforcement notices (if any)</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 3: Assessment (Days 4-14)</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Assessor reviews all documentation</li>
              <li>• Checks policy meets legal requirements</li>
              <li>• Verifies insurance levels adequate</li>
              <li>• Reviews risk assessment quality</li>
              <li>• May request additional information</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Stage 4: Outcome (Days 14-21)</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Pass - certificate issued immediately</li>
              <li>• Remedial action required - specific feedback given</li>
              <li>• Submit improvements within 14 days</li>
              <li>• Re-assessment if needed (no extra cost)</li>
              <li>• Certificate valid for 12 months</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common CHAS Failure Points</h2>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              ⚠️ Top Reasons for CHAS Rejection
            </p>
            <ul className="space-y-2 text-amber-800">
              <li>• H&S policy not signed or dated within 12 months</li>
              <li>• Risk assessments too generic (not job-specific)</li>
              <li>• Missing employer's liability insurance</li>
              <li>• No evidence of employee H&S training</li>
              <li>• Method statements lacking detail</li>
              <li>• No accident reporting procedure</li>
              <li>• Inadequate sub-contractor management</li>
              <li>• Missing first aid and emergency arrangements</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">CHAS vs Other SSIP Schemes</h2>
          
          <p>
            Understanding how CHAS compares helps choose the right scheme:
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CHAS</th>
                <th className="border border-gray-300 px-4 py-2 text-left">SafeContractor</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Constructionline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Owner</td>
                <td className="border border-gray-300 px-4 py-2">LGA (Government)</td>
                <td className="border border-gray-300 px-4 py-2">Alcumus (Private)</td>
                <td className="border border-gray-300 px-4 py-2">Government</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Council acceptance</td>
                <td className="border border-gray-300 px-4 py-2">130+ councils</td>
                <td className="border border-gray-300 px-4 py-2">50+ councils</td>
                <td className="border border-gray-300 px-4 py-2">All UK councils</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Focus</td>
                <td className="border border-gray-300 px-4 py-2">H&S only</td>
                <td className="border border-gray-300 px-4 py-2">H&S only</td>
                <td className="border border-gray-300 px-4 py-2">H&S + PQQ</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Cost range</td>
                <td className="border border-gray-300 px-4 py-2">£198 - £750</td>
                <td className="border border-gray-300 px-4 py-2">£299 - £969</td>
                <td className="border border-gray-300 px-4 py-2">£185 - £2,190</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Assessment time</td>
                <td className="border border-gray-300 px-4 py-2">2-3 weeks</td>
                <td className="border border-gray-300 px-4 py-2">3-4 weeks</td>
                <td className="border border-gray-300 px-4 py-2">2-3 weeks</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">SSIP Mutual Recognition</h3>
            <p>
              Under SSIP, CHAS certification is recognised by other member schemes including SafeContractor, SMAS, and Acclaim. However, some buyers specifically require CHAS regardless of SSIP recognition. Always check tender requirements - if it says "CHAS required", alternative SSIP schemes may not be accepted.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Documents Required for CHAS</h2>
          
          <p>
            Prepare these documents before starting your application:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Essential Documents</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Health & Safety Policy (signed, dated within 12 months)</li>
                <li>• Employers' Liability Insurance (minimum £5M)</li>
                <li>• Public Liability Insurance (minimum £1M, often £5M-£10M needed)</li>
                <li>• Risk assessments (2+ job-specific examples)</li>
                <li>• Method statements (matching risk assessments)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Supporting Evidence</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Training certificates (H&S, trade-specific)</li>
                <li>• Accident book/records (3 years)</li>
                <li>• HSE enforcement notices (if applicable)</li>
                <li>• Sub-contractor management procedures</li>
                <li>• Equipment inspection records</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Additional for Larger Companies</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• H&S management organisation chart</li>
                <li>• Employee consultation evidence</li>
                <li>• Internal audit reports</li>
                <li>• H&S performance data</li>
                <li>• CDM compliance evidence</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Tips for First-Time CHAS Success</h2>
          
          <ol className="space-y-3">
            <li><strong>1. Update your H&S policy:</strong> Must be signed and dated within the last 12 months</li>
            <li><strong>2. Use job-specific risk assessments:</strong> Generic templates often fail</li>
            <li><strong>3. Match method statements to risks:</strong> Every significant risk needs a control method</li>
            <li><strong>4. Check insurance levels:</strong> Many contracts need £10M public liability</li>
            <li><strong>5. Evidence training:</strong> Include certificates for all relevant staff</li>
            <li><strong>6. Document near-misses:</strong> Shows proactive safety management</li>
            <li><strong>7. Include sub-contractor procedures:</strong> Essential even if rarely used</li>
            <li><strong>8. Use CHAS templates:</strong> Available after registration</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10 mb-4">CHAS for Different Trades</h2>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Construction Trades</h3>
            <p>
              Electricians, plumbers, roofers, and general builders form CHAS's core membership. Your risk assessments must cover specific trade hazards: working at height, electrical safety, confined spaces, manual handling. Include CSCS cards and trade-specific qualifications.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Facilities Management</h3>
            <p>
              Cleaning, catering, security, and maintenance contractors need CHAS for most public buildings. Focus on COSHH assessments for cleaning chemicals, lone working procedures, and site-specific inductions. Include BICSc or equivalent training evidence.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Professional Services</h3>
            <p>
              Consultants, designers, and surveyors increasingly need CHAS. While office-based work has fewer risks, include DSE assessments, driving for work policies, and site visit procedures. Professional indemnity insurance is essential.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is CHAS certification?</h3>
              <p>
                CHAS (Contractors Health and Safety Assessment Scheme) is a SSIP (Safety Schemes in Procurement) accreditation that demonstrates health and safety competence. It pre-qualifies contractors for UK public sector work by verifying H&S policies, risk assessments, method statements, insurance, and competency. CHAS is government-owned and the most widely recognised SSIP scheme.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does CHAS certification cost?</h3>
              <p>
                CHAS costs from £198+VAT for micro companies (1-4 employees) up to £750+VAT for large organisations (250+ employees). Additional services like CHAS Plus (£450+) and CHAS Elite (£995+) offer enhanced credibility. Assessment support services cost £200-£500. Annual renewal is required at the same price. Multi-year discounts of 10-15% are available.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is CHAS mandatory for council contracts?</h3>
              <p>
                CHAS is effectively mandatory for most local authority construction and FM contracts. Over 130 UK councils specifically require CHAS, including all London boroughs, Birmingham, Manchester, Edinburgh, and Cardiff. While some accept alternative SSIP schemes, CHAS has the widest acceptance. Without CHAS or equivalent, you cannot bid for most council construction work.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What is the difference between CHAS and SafeContractor?</h3>
              <p>
                CHAS and SafeContractor are both SSIP schemes but differ in ownership and focus. CHAS is government-owned with 130+ council members and focuses on public sector. SafeContractor is privately owned by Alcumus and stronger in utilities and FM. Both are mutually recognised under SSIP, but some buyers specifically require one or the other. Check tender requirements carefully.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does CHAS assessment take?</h3>
              <p>
                CHAS assessment typically takes 2-4 weeks: 1-2 days to complete the application, 5-10 working days for assessment, and 3-5 days for any remedial actions if required. Fast-track 48-hour service is available for urgent tenders at additional cost (£150-£300). Renewal is quicker at 1-2 weeks as most information carries forward.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.chas.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                CHAS Official Website
              </a>
            </li>
            <li>
              <a href="https://ssip.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                SSIP Portal - Safety Schemes in Procurement
              </a>
            </li>
            <li>
              <a href="https://www.hse.gov.uk/construction/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                HSE Construction Guidance
              </a>
            </li>
            <li>
              <a href="https://www.local.gov.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Local Government Association
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/procurement-policy-note-0821" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                PPN 08/21 - Health & Safety Requirements
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/safecontractor-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  SafeContractor
                </Link>
                <p className="text-sm text-gray-600 mt-1">Alternative SSIP scheme</p>
              </div>
              <div>
                <Link href="/certifications/constructionline-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  Constructionline
                </Link>
                <p className="text-sm text-gray-600 mt-1">PQQ + H&S combined</p>
              </div>
              <div>
                <Link href="/certifications/iso-45001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 45001
                </Link>
                <p className="text-sm text-gray-600 mt-1">International H&S standard</p>
              </div>
              <div>
                <Link href="/certifications/ssip-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  SSIP Overview
                </Link>
                <p className="text-sm text-gray-600 mt-1">Understanding all SSIP schemes</p>
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