import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'PAS 91 UK Construction Tenders: Standard PQQ Framework Guide',
  description: 'PAS 91 is the standardised pre-qualification questionnaire for UK construction. Learn how it reduces tender costs, which frameworks use it, and how to complete PAS 91 efficiently.',
  keywords: 'PAS 91 construction, PAS 91 PQQ, construction pre-qualification questionnaire, PAS 91 requirements, standard PQQ construction',
  openGraph: {
    title: 'PAS 91 for UK Construction: Complete PQQ Standardisation Guide',
    description: 'PAS 91 standardises construction pre-qualification across UK public sector. Learn how it reduces costs and streamlines tender processes.',
    url: 'https://rfp.quest/certifications/pas-91-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/pas-91-uk-tenders',
  },
}

export default function PAS91UKTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'PAS 91 for UK Construction: Complete PQQ Standardisation Guide',
    description: 'PAS 91 standardises construction pre-qualification across UK public sector. Learn how it reduces costs and streamlines tender processes.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/pas-91-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is PAS 91?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PAS 91:2017 is a Publicly Available Specification that standardises pre-qualification questionnaires (PQQs) for construction tenders. Developed by BSI with industry stakeholders, it provides a common question set covering company information, financial standing, health & safety, quality, environmental management, and technical capability. It eliminates duplicate PQQs, reducing tender costs for both buyers and suppliers.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is PAS 91 mandatory for construction tenders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PAS 91 is strongly recommended but not legally mandatory. The UK Government Construction Strategy encourages its use to reduce procurement costs. Most major public sector frameworks including Crown Commercial Service, NHS ProCure, and Homes England use PAS 91. Many local authorities have adopted it as standard. Private sector adoption is growing but varies by client.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does PAS 91 relate to Constructionline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Constructionline uses PAS 91 as its core question set. When you complete Constructionline Silver or Gold certification, you\'re essentially completing PAS 91 modules. Constructionline stores your PAS 91 data, allowing buyers to access pre-validated information. This means one PAS 91 submission through Constructionline can work for multiple tenders, saving significant time and cost.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are PAS 91 modules?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PAS 91 consists of core modules (mandatory for all) plus optional modules buyers can select: Core covers company info, insurance, financial, H&S policy. Optional modules include CDM capability, environmental management, quality management, equality & diversity, BIM capability, anti-bribery, and project-specific questions. Buyers should only request relevant modules to avoid gold-plating.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does PAS 91 cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The PAS 91 document costs £202 from BSI. However, main costs are indirect: completing comprehensive PQQs takes 20-40 hours (£1,000-£3,000 staff time), maintaining updated information annually (£500-£1,500), or using Constructionline for pre-validation (£185-£2,190/year). The standardisation saves money by eliminating multiple bespoke PQQs - estimated industry savings of £1 billion annually.'
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
            PAS 91 for UK Construction: Complete PQQ Standardisation Guide
          </h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-400 p-6 mb-8">
            <p className="text-lg font-semibold text-teal-900 mb-2">
              📋 One PQQ to Rule Them All
            </p>
            <p className="text-teal-800">
              PAS 91 standardises construction pre-qualification questionnaires across the UK public sector. Complete once, use many times - saving thousands in tender costs while ensuring consistent, proportionate assessment.
            </p>
          </div>

          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: pas-91-construction-pqq.jpg - PAS 91 standardised questionnaire framework for UK construction tenders]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            PAS 91:2017 represents a breakthrough in construction procurement efficiency. Before its introduction, contractors faced different pre-qualification questionnaires for every tender - answering essentially the same questions in slightly different formats. This duplication cost the UK construction industry an estimated £1 billion annually in wasted effort.
          </p>

          <p>
            Developed by BSI in collaboration with government, contractors, and industry bodies, PAS 91 provides a single, standardised question set that satisfies pre-qualification requirements across the public sector and increasingly, private sector construction procurement.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">What PAS 91 Covers</h2>
          
          <p>
            The standard is structured in modules - core questions everyone must answer, plus optional modules for specific requirements:
          </p>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Core Modules (Mandatory)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Company Information</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Legal status and ownership</li>
                  <li>• Contact details and key personnel</li>
                  <li>• Company registration numbers</li>
                  <li>• Parent/subsidiary relationships</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Financial Information</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Annual accounts (3 years)</li>
                  <li>• Turnover breakdown</li>
                  <li>• Banking references</li>
                  <li>• Credit ratings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Insurance</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Employers' liability</li>
                  <li>• Public liability</li>
                  <li>• Professional indemnity</li>
                  <li>• Contract works cover</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Health & Safety</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• H&S policy</li>
                  <li>• SSIP certification</li>
                  <li>• Accident statistics</li>
                  <li>• Enforcement history</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Optional Modules (Select as Required)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Technical Capability</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Relevant experience</li>
                  <li>• Case studies</li>
                  <li>• References</li>
                  <li>• Technical resources</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">CDM Compliance</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Principal contractor capability</li>
                  <li>• Designer competence</li>
                  <li>• CDM procedures</li>
                  <li>• Safety critical roles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Environmental</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• ISO 14001 certification</li>
                  <li>• Environmental policy</li>
                  <li>• Sustainability measures</li>
                  <li>• Waste management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quality Management</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• ISO 9001 certification</li>
                  <li>• Quality procedures</li>
                  <li>• Defects management</li>
                  <li>• Customer satisfaction</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">BIM Capability</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• BIM Level 2 compliance</li>
                  <li>• Software capabilities</li>
                  <li>• Information management</li>
                  <li>• Collaboration tools</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Modern Standards</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Modern slavery statement</li>
                  <li>• Anti-bribery policy</li>
                  <li>• Equality & diversity</li>
                  <li>• Social value measures</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Benefits of PAS 91 Standardisation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">For Contractors</h3>
              <ul className="space-y-2">
                <li>✅ Complete PQQ once, use multiple times</li>
                <li>✅ Reduced tender costs (save £5k-£20k/year)</li>
                <li>✅ Consistent questions across buyers</li>
                <li>✅ Proportionate to contract value</li>
                <li>✅ Clear understanding of requirements</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">For Buyers</h3>
              <ul className="space-y-2">
                <li>✅ Industry-standard best practice</li>
                <li>✅ Reduced evaluation time</li>
                <li>✅ Comparable responses</li>
                <li>✅ Legal compliance built-in</li>
                <li>✅ Access to pre-validated suppliers</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Who Uses PAS 91?</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Government Frameworks</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Crown Commercial Service construction frameworks</li>
                <li>• NHS ProCure23 and ProCure2020</li>
                <li>• Homes England delivery partners</li>
                <li>• Ministry of Justice frameworks</li>
                <li>• Department for Education construction</li>
                <li>• Defence Infrastructure Organisation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Local Authorities</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• SCAPE framework members</li>
                <li>• Pagabo framework users</li>
                <li>• YORbuild participants</li>
                <li>• London Construction Programme</li>
                <li>• Most individual councils</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Private Sector (Growing Adoption)</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Major contractors for supply chain</li>
                <li>• Property developers</li>
                <li>• Registered providers (housing associations)</li>
                <li>• Some commercial clients</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">PAS 91 and Value Thresholds</h2>
          
          <p>
            PAS 91 includes proportionality - requirements scale with contract value:
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Contract Value</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Typical Requirements</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Modules Used</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Under £100k</td>
                <td className="border border-gray-300 px-4 py-2">Minimal PQQ</td>
                <td className="border border-gray-300 px-4 py-2">Core only, simplified</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">£100k - £1M</td>
                <td className="border border-gray-300 px-4 py-2">Standard PQQ</td>
                <td className="border border-gray-300 px-4 py-2">Core + relevant optional</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">£1M - £10M</td>
                <td className="border border-gray-300 px-4 py-2">Comprehensive PQQ</td>
                <td className="border border-gray-300 px-4 py-2">Most modules required</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Over £10M</td>
                <td className="border border-gray-300 px-4 py-2">Full assessment</td>
                <td className="border border-gray-300 px-4 py-2">All relevant modules</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">OJEU threshold+</td>
                <td className="border border-gray-300 px-4 py-2">Selection questionnaire</td>
                <td className="border border-gray-300 px-4 py-2">PAS 91 + ESPD</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">Completing PAS 91 Efficiently</h2>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              💡 Pro Tip: Use Constructionline
            </p>
            <p className="text-amber-800">
              The most efficient way to handle PAS 91 is through Constructionline. Complete it once there, get it validated, then buyers can access your pre-approved PAS 91 data. This eliminates repetitive form-filling and ensures your information is always current. Constructionline Gold includes SSIP assessment too.
            </p>
            <p className="mt-2">
              <Link href="/certifications/constructionline-uk-tenders" className="text-amber-700 hover:underline">
                Learn about Constructionline certification →
              </Link>
            </p>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">PAS 91 Master Document Strategy</h3>
          
          <p>
            If not using Constructionline, create a master PAS 91 document:
          </p>

          <ol className="space-y-3">
            <li><strong>1. Download PAS 91:2017</strong> from BSI (£202) - essential for correct format</li>
            <li><strong>2. Create master responses</strong> for all modules, even optional ones</li>
            <li><strong>3. Maintain quarterly updates</strong> - accounts, insurance, certificates</li>
            <li><strong>4. Version control</strong> - track changes for consistency</li>
            <li><strong>5. Evidence library</strong> - centralised certificates and policies</li>
            <li><strong>6. Tailor for tenders</strong> - adjust project-specific sections only</li>
            <li><strong>7. Regular reviews</strong> - ensure compliance with latest standards</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common PAS 91 Pitfalls</h2>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-6 my-8">
            <p className="font-semibold text-red-900 mb-2">
              ⚠️ Avoid These Mistakes
            </p>
            <ul className="space-y-2 text-red-800">
              <li>• Using outdated PAS 91:2013 version (2017 is current)</li>
              <li>• Incomplete financial information (all 3 years needed)</li>
              <li>• Expired insurance certificates</li>
              <li>• Missing SSIP certification for H&S module</li>
              <li>• Generic experience examples (be specific to buyer needs)</li>
              <li>• Ignoring proportionality (over-providing for small contracts)</li>
              <li>• Not updating annually (information becomes stale)</li>
              <li>• Forgetting project-specific questions</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">PAS 91 vs Bespoke PQQs</h2>
          
          <p>
            Despite PAS 91's adoption, some buyers still use bespoke PQQs:
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                <th className="border border-gray-300 px-4 py-2 text-left">PAS 91</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Bespoke PQQ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Standardisation</td>
                <td className="border border-gray-300 px-4 py-2">✅ Industry standard</td>
                <td className="border border-gray-300 px-4 py-2">❌ Unique each time</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Completion time</td>
                <td className="border border-gray-300 px-4 py-2">✅ 2-4 hours (if prepared)</td>
                <td className="border border-gray-300 px-4 py-2">❌ 20-40 hours</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Reusability</td>
                <td className="border border-gray-300 px-4 py-2">✅ High</td>
                <td className="border border-gray-300 px-4 py-2">❌ Low</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Legal compliance</td>
                <td className="border border-gray-300 px-4 py-2">✅ Built-in</td>
                <td className="border border-gray-300 px-4 py-2">Variable</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Cost to industry</td>
                <td className="border border-gray-300 px-4 py-2">✅ Lower</td>
                <td className="border border-gray-300 px-4 py-2">❌ Higher</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">The Future: PAS 91+</h2>
          
          <p>
            PAS 91 continues evolving to meet industry needs:
          </p>

          <ul className="space-y-2">
            <li>• <strong>Digital integration:</strong> Moving from PDFs to structured data</li>
            <li>• <strong>Common Assessment Standard:</strong> Alignment with broader reforms</li>
            <li>• <strong>Net zero modules:</strong> Carbon reporting and sustainability metrics</li>
            <li>• <strong>Social value measurement:</strong> Standardised TOMs framework</li>
            <li>• <strong>MMC capability:</strong> Modern methods of construction assessment</li>
            <li>• <strong>API connectivity:</strong> Direct integration with procurement platforms</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Supporting Standards and Certifications</h2>
          
          <p>
            PAS 91 references these certifications - having them simplifies completion:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Essential</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• SSIP certification (CHAS, SafeContractor)</li>
                <li>• Adequate insurance levels</li>
                <li>• Company accounts filed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Advantageous</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• ISO 9001 (quality)</li>
                <li>• ISO 14001 (environmental)</li>
                <li>• ISO 45001 (H&S management)</li>
                <li>• BIM Level 2 accreditation</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is PAS 91?</h3>
              <p>
                PAS 91:2017 is a Publicly Available Specification that standardises pre-qualification questionnaires (PQQs) for construction tenders. Developed by BSI with industry stakeholders, it provides a common question set covering company information, financial standing, health & safety, quality, environmental management, and technical capability. It eliminates duplicate PQQs, reducing tender costs for both buyers and suppliers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is PAS 91 mandatory for construction tenders?</h3>
              <p>
                PAS 91 is strongly recommended but not legally mandatory. The UK Government Construction Strategy encourages its use to reduce procurement costs. Most major public sector frameworks including Crown Commercial Service, NHS ProCure, and Homes England use PAS 91. Many local authorities have adopted it as standard. Private sector adoption is growing but varies by client.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How does PAS 91 relate to Constructionline?</h3>
              <p>
                Constructionline uses PAS 91 as its core question set. When you complete Constructionline Silver or Gold certification, you're essentially completing PAS 91 modules. Constructionline stores your PAS 91 data, allowing buyers to access pre-validated information. This means one PAS 91 submission through Constructionline can work for multiple tenders, saving significant time and cost.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What are PAS 91 modules?</h3>
              <p>
                PAS 91 consists of core modules (mandatory for all) plus optional modules buyers can select: Core covers company info, insurance, financial, H&S policy. Optional modules include CDM capability, environmental management, quality management, equality & diversity, BIM capability, anti-bribery, and project-specific questions. Buyers should only request relevant modules to avoid gold-plating.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does PAS 91 cost?</h3>
              <p>
                The PAS 91 document costs £202 from BSI. However, main costs are indirect: completing comprehensive PQQs takes 20-40 hours (£1,000-£3,000 staff time), maintaining updated information annually (£500-£1,500), or using Constructionline for pre-validation (£185-£2,190/year). The standardisation saves money by eliminating multiple bespoke PQQs - estimated industry savings of £1 billion annually.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.bsigroup.com/en-GB/pas-91-construction-prequalification-questionnaires/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                BSI PAS 91:2017 Official Page
              </a>
            </li>
            <li>
              <a href="https://www.constructionline.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Constructionline (PAS 91 Platform)
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/government-construction-strategy-2016-2020" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Government Construction Strategy
              </a>
            </li>
            <li>
              <a href="https://builduk.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Build UK Industry Guidance
              </a>
            </li>
            <li>
              <a href="https://www.crowncommercial.gov.uk/agreements/RM6088" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                CCS Construction Frameworks
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/constructionline-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  Constructionline
                </Link>
                <p className="text-sm text-gray-600 mt-1">PAS 91 validation platform</p>
              </div>
              <div>
                <Link href="/certifications/ssip-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  SSIP Schemes
                </Link>
                <p className="text-sm text-gray-600 mt-1">H&S module requirement</p>
              </div>
              <div>
                <Link href="/certifications/iso-9001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 9001
                </Link>
                <p className="text-sm text-gray-600 mt-1">Quality module support</p>
              </div>
              <div>
                <Link href="/certifications/" className="text-blue-600 hover:underline font-medium">
                  All UK Certifications
                </Link>
                <p className="text-sm text-gray-600 mt-1">Complete certification guide</p>
              </div>
            </div>
          </nav>
        </section>
      </article>
    </>
  )
}