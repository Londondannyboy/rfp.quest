import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'SSIP UK Tenders: Safety Schemes in Procurement Explained',
  description: 'SSIP mutual recognition means one H&S assessment works across multiple schemes. Learn how CHAS, SafeContractor, Constructionline Gold and others work together for UK tenders.',
  keywords: 'SSIP UK tenders, Safety Schemes in Procurement, SSIP mutual recognition, SSIP schemes comparison, SSIP government contracts',
  openGraph: {
    title: 'SSIP for UK Tenders: Complete Guide to Safety Schemes in Procurement',
    description: 'SSIP mutual recognition means one H&S assessment works across multiple schemes. Learn how CHAS, SafeContractor, and others work together.',
    url: 'https://rfp.quest/certifications/ssip-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/ssip-uk-tenders',
  },
}

export default function SSIPUKTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'SSIP for UK Tenders: Complete Guide to Safety Schemes in Procurement',
    description: 'SSIP mutual recognition means one H&S assessment works across multiple schemes. Learn how CHAS, SafeContractor, and others work together.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/ssip-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is SSIP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SSIP (Safety Schemes in Procurement) is an umbrella organisation enabling mutual recognition between H&S assessment schemes. Created to eliminate duplicate assessments, SSIP means passing one member scheme (like CHAS or SafeContractor) automatically qualifies you for recognition by other member schemes. This saves contractors time and money while maintaining consistent safety standards across UK procurement.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which schemes are SSIP members?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SSIP has 13 member schemes: CHAS, SafeContractor, Constructionline Gold, SMAS Worksafe, Acclaim, Achilles BuildingConfidence, Avetta, British Safety Council, Contractors Health & Safety Scheme (Wales), EXOR, Safety Management Advisory Services, Supplier Assessment Services, and Quality Safety & Environmental Assistance. All provide mutual recognition of core H&S criteria.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does SSIP certification exist?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'There is no "SSIP certification" itself - SSIP is the mutual recognition framework. You get certified by individual member schemes (CHAS, SafeContractor, etc.) which then provides SSIP recognition. When tenders require "SSIP accreditation", they mean certification from any SSIP member scheme. Always check if specific schemes are mandated.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is SSIP mandatory for government contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SSIP schemes are effectively mandatory for most UK construction and FM government contracts above £10k. The Cabinet Office recommends SSIP to reduce assessment duplication. While not legally required, contracts typically specify "SSIP accreditation required" or name specific schemes. Without SSIP member certification, you cannot bid for most public sector construction work.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can buyers reject SSIP mutual recognition?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, buyers can specify particular schemes despite SSIP mutual recognition. For example, a council may require CHAS specifically even though SafeContractor is SSIP-equivalent. Always check exact tender requirements. Common reasons include client-specific modules, sector preferences, or historical relationships with particular schemes.'
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
            SSIP for UK Tenders: Complete Guide to Safety Schemes in Procurement
          </h1>
          
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 mb-8">
            <p className="text-lg font-semibold text-indigo-900 mb-2">
              🤝 One Assessment, Multiple Recognitions
            </p>
            <p className="text-indigo-800">
              SSIP mutual recognition eliminates duplicate H&S assessments. Pass one member scheme and gain acceptance across 13 schemes covering thousands of buyers. Understanding SSIP is essential for efficient tender qualification.
            </p>
          </div>

          <div className="bg-slate-800/50 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-slate-400">
              [Image: ssip-uk-schemes-overview.jpg - SSIP member schemes logos and mutual recognition framework]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            Safety Schemes in Procurement (SSIP) revolutionised UK construction H&S pre-qualification by creating mutual recognition between assessment schemes. Before SSIP, contractors faced multiple costly assessments for identical H&S requirements. Now, one assessment provides access to thousands of buyers across all member schemes.
          </p>

          <p>
            Established in 2009 following government recommendations, SSIP ensures consistent H&S standards while reducing bureaucracy and costs. The SSIP Forum, managed by Build UK, maintains the Core Criteria that all member schemes assess, ensuring true equivalence regardless of which scheme you choose.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">How SSIP Mutual Recognition Works</h2>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">The SSIP Process</h3>
            <ol className="space-y-3">
              <li><strong>1. Choose any SSIP member scheme</strong> based on your sector, clients, or preference</li>
              <li><strong>2. Pass their H&S assessment</strong> meeting SSIP Core Criteria standards</li>
              <li><strong>3. Receive SSIP recognition</strong> valid across all 13 member schemes</li>
              <li><strong>4. Access opportunities</strong> from any buyer accepting SSIP schemes</li>
              <li><strong>5. Maintain annual certification</strong> with your chosen scheme</li>
            </ol>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <p className="font-semibold mb-2">💡 Key Point: The SSIP "Deeming Provision"</p>
            <p>
              If you hold certification from any SSIP member scheme and a buyer requires a different SSIP scheme, you are "deemed" to meet their requirements. This is the core principle of SSIP - eliminating duplicate assessments for identical criteria.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SSIP Member Schemes Comparison</h2>
          
          <p>
            Understanding each scheme's strengths helps choose the right one for your business:
          </p>

          <table className="min-w-full border-slate-500/50 my-6 text-sm">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="border-slate-500/50 px-3 py-2 text-left">Scheme</th>
                <th className="border-slate-500/50 px-3 py-2 text-left">Best For</th>
                <th className="border-slate-500/50 px-3 py-2 text-left">Cost Range</th>
                <th className="border-slate-500/50 px-3 py-2 text-left">Key Strength</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-slate-500/50 px-3 py-2 font-semibold">CHAS</td>
                <td className="border-slate-500/50 px-3 py-2">Local authorities, NHS</td>
                <td className="border-slate-500/50 px-3 py-2">£198-£750</td>
                <td className="border-slate-500/50 px-3 py-2">130+ council members</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-3 py-2 font-semibold">SafeContractor</td>
                <td className="border-slate-500/50 px-3 py-2">Utilities, FM, retail</td>
                <td className="border-slate-500/50 px-3 py-2">£299-£969</td>
                <td className="border-slate-500/50 px-3 py-2">National Grid required</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-3 py-2 font-semibold">Constructionline Gold</td>
                <td className="border-slate-500/50 px-3 py-2">Major construction</td>
                <td className="border-slate-500/50 px-3 py-2">£285-£2,190</td>
                <td className="border-slate-500/50 px-3 py-2">PQQ + SSIP combined</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-3 py-2 font-semibold">SMAS Worksafe</td>
                <td className="border-slate-500/50 px-3 py-2">General contractors</td>
                <td className="border-slate-500/50 px-3 py-2">£185-£750</td>
                <td className="border-slate-500/50 px-3 py-2">Wide recognition</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-3 py-2 font-semibold">Acclaim</td>
                <td className="border-slate-500/50 px-3 py-2">SME contractors</td>
                <td className="border-slate-500/50 px-3 py-2">£195-£695</td>
                <td className="border-slate-500/50 px-3 py-2">Simple process</td>
              </tr>
              <tr>
                <td className="border-slate-500/50 px-3 py-2 font-semibold">Achilles BuildingConfidence</td>
                <td className="border-slate-500/50 px-3 py-2">Infrastructure</td>
                <td className="border-slate-500/50 px-3 py-2">£395-£1,500</td>
                <td className="border-slate-500/50 px-3 py-2">Rail/utilities focus</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">SSIP Core Criteria</h2>
          
          <p>
            All SSIP schemes assess the same fundamental H&S management elements:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Stage 1: Policy & Organisation</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• H&S policy (signed, dated, current)</li>
                <li>• Organisation for H&S management</li>
                <li>• Arrangements for H&S</li>
                <li>• Competent H&S assistance</li>
                <li>• Employee consultation</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Stage 2: Arrangements</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Risk assessment procedures</li>
                <li>• Method statements</li>
                <li>• Training and competence</li>
                <li>• Accident reporting/investigation</li>
                <li>• Sub-contractor management</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Stage 3: Implementation</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Risk assessments (examples)</li>
                <li>• Safe systems of work</li>
                <li>• Equipment maintenance</li>
                <li>• PPE provision</li>
                <li>• Emergency procedures</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Stage 4: Performance</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Accident statistics (3 years)</li>
                <li>• Enforcement notices</li>
                <li>• Insurance certificates</li>
                <li>• Monitoring and review</li>
                <li>• Continuous improvement</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">When SSIP Mutual Recognition Doesn't Apply</h2>
          
          <div className="bg-amber-900/20 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              ⚠️ Important Exceptions
            </p>
            <p className="text-amber-800 mb-3">
              SSIP mutual recognition has limitations. Always check specific tender requirements:
            </p>
            <ul className="space-y-2 text-amber-800">
              <li>• <strong>Named schemes:</strong> If tender states "CHAS required" (not "SSIP required"), only CHAS accepted</li>
              <li>• <strong>Client modules:</strong> Some schemes have client-specific additions beyond SSIP core</li>
              <li>• <strong>PQQ elements:</strong> SSIP covers H&S only - financial/technical checks separate</li>
              <li>• <strong>Sector preferences:</strong> Utilities often mandate SafeContractor despite SSIP</li>
              <li>• <strong>Framework rules:</strong> Some frameworks pre-select specific schemes</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Choosing the Right SSIP Scheme</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">By Sector Focus</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Public Sector Construction:</p>
                  <ul className="text-slate-300">
                    <li>• 1st choice: CHAS</li>
                    <li>• 2nd choice: Constructionline Gold</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Utilities & Energy:</p>
                  <ul className="text-slate-300">
                    <li>• 1st choice: SafeContractor</li>
                    <li>• 2nd choice: Achilles BuildingConfidence</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Facilities Management:</p>
                  <ul className="text-slate-300">
                    <li>• 1st choice: SafeContractor</li>
                    <li>• 2nd choice: CHAS</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">General Construction:</p>
                  <ul className="text-slate-300">
                    <li>• 1st choice: Constructionline Gold</li>
                    <li>• 2nd choice: SMAS Worksafe</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">By Company Size</h3>
              <ul className="space-y-2">
                <li>• <strong>Sole traders/Micro (1-4 staff):</strong> CHAS or Acclaim - lowest cost</li>
                <li>• <strong>Small (5-49 staff):</strong> CHAS, SafeContractor, or SMAS - good support</li>
                <li>• <strong>Medium (50-249 staff):</strong> Constructionline Gold - combined PQQ value</li>
                <li>• <strong>Large (250+ staff):</strong> Multiple schemes often needed for different divisions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">By Budget</h3>
              <ul className="space-y-2">
                <li>• <strong>Minimum budget:</strong> SMAS Worksafe or Acclaim (£185-£195 start)</li>
                <li>• <strong>Best value:</strong> CHAS (£198+ with widest public sector acceptance)</li>
                <li>• <strong>Premium option:</strong> Constructionline Gold (includes PQQ)</li>
                <li>• <strong>Multiple needs:</strong> Some schemes offer multi-scheme packages</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SSIP Beyond Core Criteria</h2>
          
          <p>
            While SSIP ensures H&S equivalence, schemes differentiate through additional services:
          </p>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Enhanced Modules</h3>
            <ul className="space-y-1">
              <li>• CDM Regulations compliance</li>
              <li>• Environmental management</li>
              <li>• Quality assurance</li>
              <li>• Equality & diversity</li>
              <li>• Modern slavery statements</li>
              <li>• Anti-bribery policies</li>
            </ul>
            <p className="mt-3 text-sm">
              These modules sit above SSIP core but are increasingly required for major contracts.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Value-Added Services</h3>
            <ul className="space-y-1">
              <li>• Tender alerts (Constructionline Platinum)</li>
              <li>• Site verification visits (SafeContractor)</li>
              <li>• Client-specific requirements (multiple schemes)</li>
              <li>• Training discounts (various)</li>
              <li>• H&S consultancy (CHAS, SafeContractor)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common SSIP Misconceptions</h2>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <p className="font-semibold">❌ Myth: "I need multiple SSIP schemes"</p>
              <p className="text-slate-300">✅ Reality: One SSIP scheme provides mutual recognition unless buyers specifically mandate certain schemes</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <p className="font-semibold">❌ Myth: "SSIP certification exists"</p>
              <p className="text-slate-300">✅ Reality: You get certified by member schemes, not SSIP itself</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <p className="font-semibold">❌ Myth: "All schemes cost the same"</p>
              <p className="text-slate-300">✅ Reality: Prices vary significantly - shop around for best value</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
              <p className="font-semibold">❌ Myth: "SSIP replaces ISO 45001"</p>
              <p className="text-slate-300">✅ Reality: SSIP is pre-qualification; ISO 45001 is a management system standard</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">SSIP Assessment Tips</h2>
          
          <ol className="space-y-3">
            <li><strong>1. Choose strategically:</strong> Research your main clients' preferences before selecting a scheme</li>
            <li><strong>2. Prepare thoroughly:</strong> Gather all documents before starting - speeds assessment</li>
            <li><strong>3. Be specific:</strong> Generic risk assessments often fail - use real job examples</li>
            <li><strong>4. Update regularly:</strong> Keep policies signed/dated within 12 months</li>
            <li><strong>5. Track expiry:</strong> Set reminders 60 days before renewal</li>
            <li><strong>6. Consider timing:</strong> Some schemes offer multi-year discounts</li>
            <li><strong>7. Ask about modules:</strong> Additional modules may be worth adding initially</li>
            <li><strong>8. Use support:</strong> Most schemes offer free guidance - take advantage</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10 mb-4">The Future of SSIP</h2>
          
          <p>
            SSIP continues evolving to meet procurement needs:
          </p>

          <ul className="space-y-2">
            <li>• <strong>Common Assessment Standard:</strong> Moving toward single question set across all schemes</li>
            <li>• <strong>Digital integration:</strong> API connections between schemes for seamless data sharing</li>
            <li>• <strong>Broader scope:</strong> Environmental and social governance elements being added</li>
            <li>• <strong>International recognition:</strong> Discussions on EU/global mutual recognition</li>
            <li>• <strong>Real-time verification:</strong> Instant confirmation of certification status</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is SSIP?</h3>
              <p>
                SSIP (Safety Schemes in Procurement) is an umbrella organisation enabling mutual recognition between H&S assessment schemes. Created to eliminate duplicate assessments, SSIP means passing one member scheme (like CHAS or SafeContractor) automatically qualifies you for recognition by other member schemes. This saves contractors time and money while maintaining consistent safety standards across UK procurement.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Which schemes are SSIP members?</h3>
              <p>
                SSIP has 13 member schemes: CHAS, SafeContractor, Constructionline Gold, SMAS Worksafe, Acclaim, Achilles BuildingConfidence, Avetta, British Safety Council, Contractors Health & Safety Scheme (Wales), EXOR, Safety Management Advisory Services, Supplier Assessment Services, and Quality Safety & Environmental Assistance. All provide mutual recognition of core H&S criteria.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Does SSIP certification exist?</h3>
              <p>
                There is no "SSIP certification" itself - SSIP is the mutual recognition framework. You get certified by individual member schemes (CHAS, SafeContractor, etc.) which then provides SSIP recognition. When tenders require "SSIP accreditation", they mean certification from any SSIP member scheme. Always check if specific schemes are mandated.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is SSIP mandatory for government contracts?</h3>
              <p>
                SSIP schemes are effectively mandatory for most UK construction and FM government contracts above £10k. The Cabinet Office recommends SSIP to reduce assessment duplication. While not legally required, contracts typically specify "SSIP accreditation required" or name specific schemes. Without SSIP member certification, you cannot bid for most public sector construction work.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can buyers reject SSIP mutual recognition?</h3>
              <p>
                Yes, buyers can specify particular schemes despite SSIP mutual recognition. For example, a council may require CHAS specifically even though SafeContractor is SSIP-equivalent. Always check exact tender requirements. Common reasons include client-specific modules, sector preferences, or historical relationships with particular schemes.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://ssip.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                SSIP Official Website
              </a>
            </li>
            <li>
              <a href="https://builduk.org/priorities/improving-business-performance/safety-schemes-in-procurement/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Build UK - SSIP Management
              </a>
            </li>
            <li>
              <a href="https://www.hse.gov.uk/construction/safetytopics/procurement.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                HSE Procurement Guidance
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/procurement-policy-note-0821" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Cabinet Office PPN 08/21
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-slate-600/50">
            <h3 className="text-lg font-semibold mb-4">SSIP Member Scheme Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/chas-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  CHAS Certification Guide
                </Link>
                <p className="text-sm text-slate-300 mt-1">Government-owned, 130+ councils</p>
              </div>
              <div>
                <Link href="/certifications/safecontractor-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  SafeContractor Guide
                </Link>
                <p className="text-sm text-slate-300 mt-1">Utilities and FM focused</p>
              </div>
              <div>
                <Link href="/certifications/constructionline-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  Constructionline Gold
                </Link>
                <p className="text-sm text-slate-300 mt-1">PQQ + SSIP combined</p>
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