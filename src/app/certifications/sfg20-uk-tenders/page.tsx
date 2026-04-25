import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'SFG20 UK FM Tenders: Building Maintenance Standards Guide',
  description: 'SFG20 is the UK standard for building maintenance specifications. Learn how it\'s required for FM contracts, costs, implementation, and compliance for facilities management tenders.',
  keywords: 'SFG20 standard, SFG20 facilities management, building maintenance specifications, SFG20 compliance, FM maintenance standards',
  openGraph: {
    title: 'SFG20 for UK Facilities Management: Complete Standards Guide',
    description: 'SFG20 provides industry-standard maintenance specifications for UK buildings. Essential for FM contracts and compliance.',
    url: 'https://rfp.quest/certifications/sfg20-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/sfg20-uk-tenders',
  },
}

export default function SFG20UKTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'SFG20 for UK Facilities Management: Complete Standards Guide',
    description: 'SFG20 provides industry-standard maintenance specifications for UK buildings. Essential for FM contracts and compliance.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/sfg20-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is SFG20?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SFG20 is the industry standard for building maintenance specifications in the UK, developed by BESA (Building Engineering Services Association). It provides comprehensive maintenance schedules and frequencies for building services including HVAC, electrical, plumbing, and fabric. Used by facilities managers, it ensures compliance with legal requirements, manufacturer guidelines, and best practice while demonstrating maintenance due diligence.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is SFG20 mandatory for FM contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SFG20 is not legally mandatory but is effectively required for most public sector FM contracts. NHS trusts, local authorities, universities, and government departments typically specify SFG20 compliance in tenders. It demonstrates maintenance meets statutory requirements, supports compliance defence, and provides transparent maintenance standards. Private sector adoption is growing, especially for critical facilities.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does SFG20 cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SFG20 access costs from £595/year for small contractors to £2,995/year for large FM companies. Implementation costs include: CAFM software integration £5,000-£50,000, staff training £1,000-£5,000, asset surveys £10,000-£100,000, and process updates £5,000-£20,000. Total first-year costs typically £20,000-£150,000 depending on portfolio size. ROI through reduced failures and compliance.'
        }
      },
      {
        '@type': 'Question',
        name: 'What does SFG20 cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SFG20 covers 400+ maintenance schedules across all building services: HVAC systems (70+ schedules), electrical systems including HV/LV, fire and security systems, water services and Legionella control, building fabric and roofing, lifts and escalators, catering equipment, and specialist systems. Each schedule includes task frequencies, procedures, competency requirements, and compliance references.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does SFG20 support compliance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SFG20 incorporates all relevant legislation and standards including Health & Safety at Work Act, L8 Legionella requirements, F-Gas regulations, PSSR, LOLER, and building regulations. It provides a "compliance defence" by demonstrating maintenance meets recognised standards. Updates reflect regulatory changes, helping FM providers maintain compliance across their portfolio and reduce liability risks.'
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
            SFG20 for UK Facilities Management: Complete Standards Guide
          </h1>
          
          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-6 mb-8">
            <p className="text-lg font-semibold text-cyan-900 mb-2">
              🏢 The FM Industry's Maintenance Bible
            </p>
            <p className="text-cyan-800">
              SFG20 provides 400+ standardised maintenance schedules covering every building system. Essential for winning FM contracts and demonstrating compliance, it's the foundation of professional facilities management in the UK.
            </p>
          </div>

          <div className="bg-slate-800/50 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-slate-400">
              [Image: sfg20-facilities-management.jpg - SFG20 maintenance standards dashboard for UK building services]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            SFG20, maintained by the Building Engineering Services Association (BESA), has become the definitive standard for building maintenance specifications across the UK. Born from the need to standardise maintenance practices and ensure compliance, it provides detailed maintenance schedules that satisfy legal requirements, manufacturer recommendations, and industry best practice.
          </p>

          <p>
            For facilities management providers, SFG20 isn't just about compliance - it's about demonstrating professionalism, reducing risk, and optimising maintenance efficiency. With increasing scrutiny on building safety post-Grenfell and growing emphasis on asset performance, SFG20 compliance has become a key differentiator in FM procurement.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Who Requires SFG20 Compliance?</h2>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Public Sector</h3>
            <ul className="space-y-2">
              <li>• <strong>NHS Trusts:</strong> Standard for all estates maintenance</li>
              <li>• <strong>Local Authorities:</strong> Corporate property and housing</li>
              <li>• <strong>Universities:</strong> Campus facilities management</li>
              <li>• <strong>Government Estate:</strong> Crown Commercial Service FM</li>
              <li>• <strong>MOD:</strong> Defence estate maintenance</li>
              <li>• <strong>Schools:</strong> PFI and academy trusts</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Private Sector</h3>
            <ul className="space-y-2">
              <li>• Commercial property managers</li>
              <li>• Data centres and critical facilities</li>
              <li>• Retail chains and shopping centres</li>
              <li>• Banking and financial services</li>
              <li>• Manufacturing facilities</li>
              <li>• Hotel and leisure operators</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">What SFG20 Covers</h2>
          
          <p>
            SFG20 provides comprehensive maintenance schedules across all building disciplines:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Mechanical Services</h3>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Air handling units and ventilation</li>
                <li>• Chillers and cooling towers</li>
                <li>• Boilers and heating systems</li>
                <li>• Pumps and pressurisation</li>
                <li>• BMS and controls</li>
                <li>• Pipework and insulation</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Electrical Services</h3>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• HV and LV distribution</li>
                <li>• Switchgear and transformers</li>
                <li>• Emergency lighting</li>
                <li>• UPS and generators</li>
                <li>• Lightning protection</li>
                <li>• Fixed wiring testing</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Specialist Systems</h3>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Fire detection and alarm</li>
                <li>• Sprinklers and suppression</li>
                <li>• Security and access control</li>
                <li>• CCTV systems</li>
                <li>• Lifts and escalators</li>
                <li>• Building automation</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Building Fabric</h3>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Roofing and gutters</li>
                <li>• Windows and doors</li>
                <li>• Internal finishes</li>
                <li>• External fabric</li>
                <li>• Drainage systems</li>
                <li>• Car parks and roads</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Key Features of SFG20</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Frequency Specifications</h3>
            <p>
              Every maintenance task has defined frequencies based on:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Statutory requirements (legal minimum)</li>
              <li>• Manufacturer recommendations</li>
              <li>• Industry best practice</li>
              <li>• Asset criticality adjustments</li>
            </ul>
            <p className="mt-3 text-sm">
              Frequencies range from daily checks to 10-yearly major overhauls, all justified by source references.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Compliance Mapping</h3>
            <p>
              Each schedule references relevant legislation and standards:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Health & Safety regulations</li>
              <li>• British Standards</li>
              <li>• HSE guidance (L8, HSG274)</li>
              <li>• Building Regulations</li>
              <li>• Insurance requirements</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Task Specifications</h3>
            <p>
              Detailed task descriptions include:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Step-by-step procedures</li>
              <li>• Tools and equipment needed</li>
              <li>• Competency requirements</li>
              <li>• Safety precautions</li>
              <li>• Recording requirements</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SFG20 Implementation Costs</h2>
          
          <table className="min-w-full border-slate-500/50 my-6">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="border-slate-500/50 px-4 py-2 text-left">Component</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Cost Range</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">SFG20 License</td>
                <td className="border-slate-500/50 px-4 py-2">£595 - £2,995/year</td>
                <td className="border-slate-500/50 px-4 py-2">Based on company size</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">CAFM Integration</td>
                <td className="border-slate-500/50 px-4 py-2">£5,000 - £50,000</td>
                <td className="border-slate-500/50 px-4 py-2">Software and setup</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Asset Surveys</td>
                <td className="border-slate-500/50 px-4 py-2">£10,000 - £100,000</td>
                <td className="border-slate-500/50 px-4 py-2">Portfolio dependent</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Staff Training</td>
                <td className="border-slate-500/50 px-4 py-2">£1,000 - £5,000</td>
                <td className="border-slate-500/50 px-4 py-2">Engineers and managers</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Process Update</td>
                <td className="border-slate-500/50 px-4 py-2">£5,000 - £20,000</td>
                <td className="border-slate-500/50 px-4 py-2">Documentation and QA</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Consultancy</td>
                <td className="border-slate-500/50 px-4 py-2">£10,000 - £30,000</td>
                <td className="border-slate-500/50 px-4 py-2">Implementation support</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">SFG20 Subscription Tiers</h2>
          
          <table className="min-w-full border-slate-500/50 my-6">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="border-slate-500/50 px-4 py-2 text-left">Tier</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Annual Cost</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Suitable For</th>
                <th className="border-slate-500/50 px-4 py-2 text-left">Features</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Essential</td>
                <td className="border-slate-500/50 px-4 py-2">£595 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">Small contractors</td>
                <td className="border-slate-500/50 px-4 py-2">Core schedules, 1 user</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Professional</td>
                <td className="border-slate-500/50 px-4 py-2">£1,295 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">Medium FM providers</td>
                <td className="border-slate-500/50 px-4 py-2">All schedules, 5 users</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Enterprise</td>
                <td className="border-slate-500/50 px-4 py-2">£2,995 + VAT</td>
                <td className="border-slate-500/50 px-4 py-2">Large FM companies</td>
                <td className="border-slate-500/50 px-4 py-2">Unlimited users, API</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-4 py-2 font-semibold">Corporate</td>
                <td className="border-slate-500/50 px-4 py-2">POA</td>
                <td className="border-slate-500/50 px-4 py-2">National providers</td>
                <td className="border-slate-500/50 px-4 py-2">Custom integration</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">Implementing SFG20 Successfully</h2>
          
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Phase 1: Assessment (Month 1)</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Gap analysis of current maintenance</li>
              <li>• Asset register validation</li>
              <li>• Identify applicable schedules</li>
              <li>• Resource requirements review</li>
              <li>• CAFM readiness assessment</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Phase 2: Planning (Month 2)</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Select implementation approach</li>
              <li>• Customise schedules for assets</li>
              <li>• Define criticality adjustments</li>
              <li>• Plan CAFM integration</li>
              <li>• Develop training programme</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Phase 3: Implementation (Months 3-6)</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Load schedules into CAFM</li>
              <li>• Train engineering teams</li>
              <li>• Update work procedures</li>
              <li>• Pilot on selected sites</li>
              <li>• Refine and adjust</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Phase 4: Rollout (Months 6-12)</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Phased deployment across portfolio</li>
              <li>• Monitor compliance rates</li>
              <li>• Address resource gaps</li>
              <li>• Client communication</li>
              <li>• Continuous improvement</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SFG20 and Compliance Defence</h2>
          
          <div className="bg-amber-900/20 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              ⚖️ Legal Protection Through SFG20
            </p>
            <p className="text-amber-800 mb-3">
              SFG20 compliance provides a "statutory defence" in legal proceedings. By following industry-recognised standards, you demonstrate:
            </p>
            <ul className="space-y-2 text-amber-800">
              <li>• Due diligence in maintenance planning</li>
              <li>• Compliance with statutory requirements</li>
              <li>• Adherence to manufacturer guidelines</li>
              <li>• Industry best practice implementation</li>
              <li>• Transparent maintenance standards</li>
            </ul>
            <p className="mt-3 text-amber-800">
              Courts and insurers recognise SFG20 as the benchmark for building maintenance standards.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SFG20 Integration with FM Systems</h2>
          
          <p>
            Major CAFM systems offer SFG20 integration:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">CAFM Platforms</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Concept Evolution (built-in)</li>
                <li>• Planon (integration module)</li>
                <li>• Maximo (custom integration)</li>
                <li>• CAFM Explorer (SFG20 module)</li>
                <li>• Concerto (API integration)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Integration Benefits</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Automated PPM scheduling</li>
                <li>• Compliance tracking</li>
                <li>• Resource planning</li>
                <li>• Cost forecasting</li>
                <li>• Performance reporting</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common SFG20 Challenges</h2>
          
          <div className="bg-red-900/20 border-l-4 border-red-400 p-6 my-8">
            <p className="font-semibold text-red-900 mb-2">
              🚫 Implementation Pitfalls
            </p>
            <ul className="space-y-2 text-red-800">
              <li>• Applying all schedules without criticality assessment</li>
              <li>• Not customising for specific asset types</li>
              <li>• Underestimating resource requirements</li>
              <li>• Poor CAFM integration planning</li>
              <li>• Inadequate engineer training</li>
              <li>• Not updating for estate changes</li>
              <li>• Ignoring manufacturer variations</li>
              <li>• Over-maintenance of low-criticality assets</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SFG20 Benefits for FM Providers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900/20 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Operational Benefits</h3>
              <ul className="space-y-2">
                <li>✅ Standardised maintenance across portfolio</li>
                <li>✅ Reduced asset failures</li>
                <li>✅ Optimised resource allocation</li>
                <li>✅ Clear performance metrics</li>
                <li>✅ Improved first-time fix rates</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Commercial Benefits</h3>
              <ul className="space-y-2">
                <li>✅ Tender compliance demonstration</li>
                <li>✅ Reduced insurance premiums</li>
                <li>✅ Lower liability risk</li>
                <li>✅ Client confidence</li>
                <li>✅ Competitive differentiation</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SFG20 Updates and Evolution</h2>
          
          <p>
            SFG20 continuously evolves to reflect:
          </p>

          <ul className="space-y-2">
            <li>• <strong>Regulatory changes:</strong> New legislation and standards</li>
            <li>• <strong>Technology advances:</strong> IoT, smart buildings, renewable energy</li>
            <li>• <strong>Industry feedback:</strong> User experience improvements</li>
            <li>• <strong>Sustainability focus:</strong> Energy efficiency and net zero</li>
            <li>• <strong>Post-Grenfell requirements:</strong> Enhanced fire safety</li>
            <li>• <strong>Pandemic learnings:</strong> Ventilation and hygiene</li>
          </ul>

          <p className="mt-4">
            Annual updates ensure compliance with latest requirements. Subscribers receive automatic updates and change notifications.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is SFG20?</h3>
              <p>
                SFG20 is the industry standard for building maintenance specifications in the UK, developed by BESA (Building Engineering Services Association). It provides comprehensive maintenance schedules and frequencies for building services including HVAC, electrical, plumbing, and fabric. Used by facilities managers, it ensures compliance with legal requirements, manufacturer guidelines, and best practice while demonstrating maintenance due diligence.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is SFG20 mandatory for FM contracts?</h3>
              <p>
                SFG20 is not legally mandatory but is effectively required for most public sector FM contracts. NHS trusts, local authorities, universities, and government departments typically specify SFG20 compliance in tenders. It demonstrates maintenance meets statutory requirements, supports compliance defence, and provides transparent maintenance standards. Private sector adoption is growing, especially for critical facilities.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does SFG20 cost?</h3>
              <p>
                SFG20 access costs from £595/year for small contractors to £2,995/year for large FM companies. Implementation costs include: CAFM software integration £5,000-£50,000, staff training £1,000-£5,000, asset surveys £10,000-£100,000, and process updates £5,000-£20,000. Total first-year costs typically £20,000-£150,000 depending on portfolio size. ROI through reduced failures and compliance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What does SFG20 cover?</h3>
              <p>
                SFG20 covers 400+ maintenance schedules across all building services: HVAC systems (70+ schedules), electrical systems including HV/LV, fire and security systems, water services and Legionella control, building fabric and roofing, lifts and escalators, catering equipment, and specialist systems. Each schedule includes task frequencies, procedures, competency requirements, and compliance references.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How does SFG20 support compliance?</h3>
              <p>
                SFG20 incorporates all relevant legislation and standards including Health & Safety at Work Act, L8 Legionella requirements, F-Gas regulations, PSSR, LOLER, and building regulations. It provides a "compliance defence" by demonstrating maintenance meets recognised standards. Updates reflect regulatory changes, helping FM providers maintain compliance across their portfolio and reduce liability risks.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.sfg20.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                SFG20 Official Website
              </a>
            </li>
            <li>
              <a href="https://www.thebesa.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                BESA - Building Engineering Services Association
              </a>
            </li>
            <li>
              <a href="https://www.bifm.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                IWFM - Institute of Workplace and Facilities Management
              </a>
            </li>
            <li>
              <a href="https://www.hse.gov.uk/pubns/books/l8.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                HSE L8 Legionella Guidance
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/soft-landings-framework" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Government Soft Landings
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-slate-600/50">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/iso-9001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 9001 Quality Management
                </Link>
                <p className="text-sm text-slate-300 mt-1">Quality systems for FM</p>
              </div>
              <div>
                <Link href="/certifications/iso-14001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 14001 Environmental
                </Link>
                <p className="text-sm text-slate-300 mt-1">Environmental management</p>
              </div>
              <div>
                <Link href="/certifications/iso-45001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 45001 Health & Safety
                </Link>
                <p className="text-sm text-slate-300 mt-1">H&S management systems</p>
              </div>
              <div>
                <Link href="/certifications/" className="text-blue-600 hover:underline font-medium">
                  All UK Certifications
                </Link>
                <p className="text-sm text-slate-300 mt-1">Complete certification guide</p>
              </div>
            </div>
          </nav>
        </section>
      </article>
    </>
  )
}