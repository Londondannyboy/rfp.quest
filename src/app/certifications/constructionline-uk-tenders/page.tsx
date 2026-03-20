import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Constructionline UK Tenders: Gold & Silver Certification Guide',
  description: 'Constructionline is the UK government\'s official PQQ database for construction. Learn about Gold/Silver levels, costs (from £185), and which frameworks require Constructionline.',
  keywords: 'Constructionline UK tenders, Constructionline Gold certification, Constructionline Silver, PQQ database construction, Constructionline government contracts',
  openGraph: {
    title: 'Constructionline for UK Government Contracts: Complete Certification Guide',
    description: 'Constructionline is the UK government\'s official PQQ database. Learn about Gold/Silver levels, costs, and which frameworks require certification.',
    url: 'https://rfp.quest/certifications/constructionline-uk-tenders',
    siteName: 'rfp.quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/constructionline-uk-tenders',
  },
}

export default function ConstructionlineUKTendersPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Constructionline for UK Government Contracts: Complete Certification Guide',
    description: 'Constructionline is the UK government\'s official PQQ database. Learn about Gold/Silver levels, costs, and which frameworks require certification.',
    author: {
      '@type': 'Organization',
      name: 'rfp.quest',
      url: 'https://rfp.quest'
    },
    publisher: {
      '@type': 'Organization',
      name: 'rfp.quest',
      url: 'https://rfp.quest'
    },
    datePublished: '2024-03-20',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: 'https://rfp.quest/certifications/constructionline-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Constructionline certification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Constructionline is the UK government\'s official pre-qualification questionnaire (PQQ) database for construction contractors and consultants. It verifies financial stability, insurance, H&S compliance, and other credentials. With 8,000+ buyers and 30,000+ suppliers, it\'s the largest construction procurement database in the UK. Certification levels include Silver (PQQ only) and Gold (PQQ + SSIP H&S).'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does Constructionline cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Constructionline Silver costs from £185+VAT (under £200k turnover) to £1,470+VAT (over £25M turnover). Gold certification adds £100-£720 to these prices. Platinum membership with tender alerts costs £2,190-£4,500+VAT. All prices are annual. Multi-year deals offer 10% discounts. Additional services like Environmental & Quality add £150-£300 each.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between Constructionline Silver and Gold?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Constructionline Silver provides PQQ verification only - financial checks, insurance validation, and company information. Gold includes everything in Silver PLUS full SSIP health and safety assessment, equivalent to CHAS or SafeContractor. Most construction contracts require Gold. Silver is suitable only for low-risk professional services or where buyers explicitly accept Silver level.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Constructionline mandatory for government construction contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Constructionline is effectively mandatory for most UK government construction frameworks including Crown Commercial Service, NHS ProCure, and major infrastructure projects. Over 8,000 buyers use it as their primary supplier database. While not legally required, contracts often state "Constructionline Gold required" or use it for shortlisting. Without it, you miss automated tender notifications.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does Constructionline certification take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Constructionline Silver takes 2-5 working days after document submission. Gold takes 10-15 working days due to H&S assessment. Fast-track options available: 24-hour Silver (£150 extra) and 5-day Gold (£300 extra). Renewal is quicker at 1-2 days for Silver, 5-7 days for Gold. Account activation is immediate upon payment, allowing profile visibility while assessment continues.'
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
            Constructionline for UK Government Contracts: Complete Certification Guide
          </h1>
          
          <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-8">
            <p className="text-lg font-semibold text-purple-900 mb-2">
              🏗️ UK's Official Construction Procurement Database
            </p>
            <p className="text-purple-800">
              Constructionline connects 30,000+ verified suppliers with 8,000+ buyers including all major government frameworks. Gold certification combines PQQ and SSIP H&S in one assessment, opening doors to £billions in opportunities.
            </p>
          </div>

          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: constructionline-uk-certification.jpg - Constructionline Gold and Silver certification badges for UK contractors]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            Constructionline is the UK government's official supplier pre-qualification system, owned by the Department for Business and Trade. Originally created to streamline construction procurement and reduce duplication, it has become the single source of supplier intelligence for UK public sector construction buyers.
          </p>

          <p>
            Unlike standalone H&S schemes, Constructionline provides comprehensive supplier verification covering financial stability, insurance, technical capability, H&S compliance, environmental management, quality assurance, and equality & diversity. It's essentially a one-stop-shop for contractor pre-qualification.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Constructionline Certification Levels</h2>
          
          <p>
            Understanding the three membership levels helps choose the right one:
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Level</th>
                <th className="border border-gray-300 px-4 py-2 text-left">What's Included</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Best For</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Annual Cost Range</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Silver</td>
                <td className="border border-gray-300 px-4 py-2">
                  • PQQ verification<br/>
                  • Financial checks<br/>
                  • Insurance validation<br/>
                  • Company information
                </td>
                <td className="border border-gray-300 px-4 py-2">Consultants, low-risk services</td>
                <td className="border border-gray-300 px-4 py-2">£185 - £1,470</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Gold ⭐</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Everything in Silver<br/>
                  • SSIP H&S assessment<br/>
                  • CDM compliance<br/>
                  • Risk assessments review
                </td>
                <td className="border border-gray-300 px-4 py-2">Most contractors (recommended)</td>
                <td className="border border-gray-300 px-4 py-2">£285 - £2,190</td>
              </tr>
              <tr className="bg-purple-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Platinum</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Everything in Gold<br/>
                  • Live tender alerts<br/>
                  • Buyer search tools<br/>
                  • Enhanced profile
                </td>
                <td className="border border-gray-300 px-4 py-2">Active bidders, main contractors</td>
                <td className="border border-gray-300 px-4 py-2">£2,190 - £4,500</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              💡 Important: Most Contracts Require Gold
            </p>
            <p className="text-amber-800">
              90% of construction contracts require Gold level (or explicitly state "Constructionline with SSIP"). Silver is only acceptable for professional services or where buyers specifically allow it. When in doubt, choose Gold.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Detailed Cost Breakdown</h2>
          
          <p>
            Constructionline pricing is based on company turnover:
          </p>

          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Annual Turnover</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Silver</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Gold</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Platinum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Under £200k</td>
                <td className="border border-gray-300 px-4 py-2">£185 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£285 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£2,190 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">£200k - £650k</td>
                <td className="border border-gray-300 px-4 py-2">£340 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£440 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£2,345 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">£650k - £1.5M</td>
                <td className="border border-gray-300 px-4 py-2">£475 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£650 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£2,555 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">£1.5M - £3M</td>
                <td className="border border-gray-300 px-4 py-2">£615 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£885 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£2,790 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">£3M - £6.5M</td>
                <td className="border border-gray-300 px-4 py-2">£790 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£1,170 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£3,075 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">£6.5M - £25M</td>
                <td className="border border-gray-300 px-4 py-2">£1,090 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£1,610 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£3,515 + VAT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Over £25M</td>
                <td className="border border-gray-300 px-4 py-2">£1,470 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£2,190 + VAT</td>
                <td className="border border-gray-300 px-4 py-2">£4,500 + VAT</td>
              </tr>
            </tbody>
          </table>

          <p>
            Additional modules and services:
          </p>
          <ul>
            <li>• Environmental verification: £150 + VAT</li>
            <li>• Quality verification: £150 + VAT</li>
            <li>• Equality & Diversity: £100 + VAT</li>
            <li>• Anti-bribery: £100 + VAT</li>
            <li>• Modern Slavery: £100 + VAT</li>
            <li>• Fast-track assessment: £150-£300 + VAT</li>
            <li>• Desktop support: £250-£500 + VAT</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Who Uses Constructionline?</h2>
          
          <p>
            Major buyers requiring Constructionline include:
          </p>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Government Frameworks</h3>
            <ul className="space-y-2">
              <li>• Crown Commercial Service (all construction frameworks)</li>
              <li>• NHS ProCure23 and ProCure2020</li>
              <li>• Ministry of Justice construction</li>
              <li>• DfE school building programmes</li>
              <li>• Homes England frameworks</li>
              <li>• Network Rail suppliers</li>
              <li>• Highways England supply chain</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Local Authorities</h3>
            <ul className="space-y-2">
              <li>• All UK councils use Constructionline</li>
              <li>• SCAPE framework authorities</li>
              <li>• Pagabo framework members</li>
              <li>• YORbuild and YORhub users</li>
              <li>• London Construction Programme</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Major Contractors</h3>
            <ul className="space-y-2">
              <li>• Tier 1 contractors (Balfour Beatty, Kier, Morgan Sindall)</li>
              <li>• Main contractors requiring subcontractor verification</li>
              <li>• Framework contractors cascading requirements</li>
              <li>• Joint venture pre-qualification</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">The Assessment Process</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Step 1: Online Application</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Create account and choose membership level</li>
              <li>• Complete company information sections</li>
              <li>• Declare work categories (up to 20 included)</li>
              <li>• Upload required documents</li>
              <li>• Pay membership fee</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Step 2: Document Verification (Silver)</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Insurance certificates checked (PL, EL, PI)</li>
              <li>• Financial accounts verified via credit check</li>
              <li>• Company registration confirmed</li>
              <li>• VAT registration validated</li>
              <li>• Professional memberships verified</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Step 3: H&S Assessment (Gold only)</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• H&S policy review (signed within 12 months)</li>
              <li>• Risk assessments evaluation</li>
              <li>• Method statements checked</li>
              <li>• Training records verified</li>
              <li>• Accident history reviewed</li>
              <li>• CDM compliance confirmed</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Step 4: Certification</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Assessment complete notification</li>
              <li>• Certificate and logo provided</li>
              <li>• Profile visible to all buyers</li>
              <li>• Tender alerts activated (Platinum)</li>
              <li>• Annual renewal reminders set</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Documents Required</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">For All Levels:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Company registration certificate</li>
                <li>• VAT certificate (if registered)</li>
                <li>• Employers' Liability Insurance</li>
                <li>• Public Liability Insurance</li>
                <li>• Professional Indemnity (if applicable)</li>
                <li>• Latest accounts or financial reference</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Additional for Gold:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Health & Safety Policy</li>
                <li>• Risk assessments (2+ examples)</li>
                <li>• Method statements</li>
                <li>• Training certificates</li>
                <li>• Accident records (3 years)</li>
                <li>• CDM competency evidence</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Benefits Beyond Certification</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Automatic Tender Notifications</h3>
            <p>
              Platinum members receive instant alerts for relevant opportunities from 8,000+ buyers. Filters by location, value, and work type ensure you only see suitable tenders. Average member receives 20-50 relevant opportunities monthly.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Single Assessment Recognition</h3>
            <p>
              Constructionline Gold includes SSIP assessment, meaning you don't need separate CHAS, SafeContractor, or other H&S schemes for most contracts. One assessment, multiple recognitions, significant cost savings.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Framework Pre-qualification</h3>
            <p>
              Many frameworks use Constructionline as their supplier database. Being registered means automatic inclusion in framework searches. Some frameworks only invite Constructionline Gold members to tender.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common Pitfalls to Avoid</h2>
          
          <ol className="space-y-3">
            <li><strong>1. Choosing Silver when Gold needed:</strong> Check specific requirements - "Constructionline required" usually means Gold</li>
            <li><strong>2. Wrong work categories:</strong> Select all relevant categories (up to 20 free) to avoid missing opportunities</li>
            <li><strong>3. Underestimating insurance needs:</strong> Many contracts need £10M public liability</li>
            <li><strong>4. Letting certification lapse:</strong> Renewal notices sent 30 days before expiry - don't miss them</li>
            <li><strong>5. Incomplete profile:</strong> Buyers filter by capabilities - complete all sections</li>
            <li><strong>6. Ignoring additional modules:</strong> Environmental and Quality modules increasingly required</li>
            <li><strong>7. Not updating information:</strong> Keep insurance, financials, and contacts current</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10 mb-4">Constructionline vs Alternatives</h2>
          
          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Constructionline</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CHAS/SafeContractor</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Achilles BuildingConfidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">PQQ included</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">❌ No (H&S only)</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">SSIP H&S</td>
                <td className="border border-gray-300 px-4 py-2">✅ Gold level</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Government owned</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                <td className="border border-gray-300 px-4 py-2">✅/❌ Mixed</td>
                <td className="border border-gray-300 px-4 py-2">❌ Private</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Buyer numbers</td>
                <td className="border border-gray-300 px-4 py-2">8,000+</td>
                <td className="border border-gray-300 px-4 py-2">500+</td>
                <td className="border border-gray-300 px-4 py-2">300+</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Tender alerts</td>
                <td className="border border-gray-300 px-4 py-2">✅ Platinum</td>
                <td className="border border-gray-300 px-4 py-2">❌ No</td>
                <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is Constructionline certification?</h3>
              <p>
                Constructionline is the UK government's official pre-qualification questionnaire (PQQ) database for construction contractors and consultants. It verifies financial stability, insurance, H&S compliance, and other credentials. With 8,000+ buyers and 30,000+ suppliers, it's the largest construction procurement database in the UK. Certification levels include Silver (PQQ only) and Gold (PQQ + SSIP H&S).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does Constructionline cost?</h3>
              <p>
                Constructionline Silver costs from £185+VAT (under £200k turnover) to £1,470+VAT (over £25M turnover). Gold certification adds £100-£720 to these prices. Platinum membership with tender alerts costs £2,190-£4,500+VAT. All prices are annual. Multi-year deals offer 10% discounts. Additional services like Environmental & Quality add £150-£300 each.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What is the difference between Constructionline Silver and Gold?</h3>
              <p>
                Constructionline Silver provides PQQ verification only - financial checks, insurance validation, and company information. Gold includes everything in Silver PLUS full SSIP health and safety assessment, equivalent to CHAS or SafeContractor. Most construction contracts require Gold. Silver is suitable only for low-risk professional services or where buyers explicitly accept Silver level.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is Constructionline mandatory for government construction contracts?</h3>
              <p>
                Constructionline is effectively mandatory for most UK government construction frameworks including Crown Commercial Service, NHS ProCure, and major infrastructure projects. Over 8,000 buyers use it as their primary supplier database. While not legally required, contracts often state "Constructionline Gold required" or use it for shortlisting. Without it, you miss automated tender notifications.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does Constructionline certification take?</h3>
              <p>
                Constructionline Silver takes 2-5 working days after document submission. Gold takes 10-15 working days due to H&S assessment. Fast-track options available: 24-hour Silver (£150 extra) and 5-day Gold (£300 extra). Renewal is quicker at 1-2 days for Silver, 5-7 days for Gold. Account activation is immediate upon payment, allowing profile visibility while assessment continues.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.constructionline.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Constructionline Official Website
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/organisations/crown-commercial-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Crown Commercial Service
              </a>
            </li>
            <li>
              <a href="https://www.ssip.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                SSIP Mutual Recognition
              </a>
            </li>
            <li>
              <a href="https://procure23.nhs.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NHS ProCure23 Framework
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/guidance/public-sector-procurement-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Public Sector Procurement Policy
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/chas-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  CHAS Certification
                </Link>
                <p className="text-sm text-gray-600 mt-1">H&S pre-qualification only</p>
              </div>
              <div>
                <Link href="/certifications/pas-91-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  PAS 91
                </Link>
                <p className="text-sm text-gray-600 mt-1">Standard PQQ question set</p>
              </div>
              <div>
                <Link href="/certifications/ssip-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  SSIP Overview
                </Link>
                <p className="text-sm text-gray-600 mt-1">Understanding all H&S schemes</p>
              </div>
              <div>
                <Link href="/certifications/" className="text-blue-600 hover:underline font-medium">
                  All Certifications
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