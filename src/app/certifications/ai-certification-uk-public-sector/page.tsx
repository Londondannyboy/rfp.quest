import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'AI Certification for UK Public Sector: ISO 42001 & EU AI Act Guide',
  description: 'How ISO 42001 and EU AI Act compliance will reshape UK public sector AI procurement. Learn certification requirements, timelines, costs, and implementation strategies for 2026.',
  keywords: 'ISO 42001 UK, AI certification public sector, EU AI Act UK, AI management system, algorithmic impact assessment, AI procurement standards',
  openGraph: {
    title: 'AI Certification for UK Public Sector: Preparing for ISO 42001 & EU AI Act',
    description: 'The August 2026 EU AI Act deadline will transform UK AI procurement. Learn how ISO 42001 certification ensures compliance.',
    url: 'https://rfp.quest/certifications/ai-certification-uk-public-sector',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/ai-certification-uk-public-sector',
  },
}

export default function AICertificationUKPublicSectorPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'AI Certification for UK Public Sector: Preparing for ISO 42001 & EU AI Act',
    description: 'The August 2026 EU AI Act deadline will transform UK AI procurement. Learn how ISO 42001 certification ensures compliance.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/ai-certification-uk-public-sector'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is ISO 42001?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 42001:2023 is the world\'s first international standard for AI management systems. Published in December 2023, it provides a framework for establishing, implementing, maintaining, and improving AI systems responsibly. It covers governance, risk management, fairness, transparency, and accountability. For UK public sector suppliers, ISO 42001 certification will likely become essential as the government adopts AI assurance frameworks aligned with international standards.'
        }
      },
      {
        '@type': 'Question',
        name: 'Will the EU AI Act apply to UK companies?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, the EU AI Act will apply to UK companies in three scenarios: (1) If they place AI systems on the EU market, (2) If their AI system outputs are used in the EU, or (3) If they provide AI systems to EU public authorities. With August 2026 as the full enforcement date, UK public sector suppliers working with EU data or cross-border projects must comply. The UK is developing its own AI regulation, likely to align closely with EU standards.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the costs of ISO 42001 certification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 42001 certification costs vary by organisation size and AI maturity: Initial gap assessment £5,000-£15,000, consultancy support £15,000-£50,000, implementation £20,000-£100,000, certification audit £10,000-£30,000, and annual surveillance £5,000-£15,000. Total first-year costs typically range from £55,000-£210,000. Additional costs include staff training, documentation systems, and potential technical improvements to AI systems for compliance.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which UK public sector contracts will require AI certification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI certification will likely be required for: NHS AI diagnostic tools and patient data analytics, police facial recognition and predictive policing systems, DWP benefits decision systems, HMRC fraud detection, local authority service automation, education assessment tools, and any high-risk AI applications. The Procurement Act 2023 enables mandatory AI standards, and government frameworks are expected to require ISO 42001 from 2025 onwards.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does ISO 42001 implementation take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 42001 implementation typically takes 6-12 months: 1-2 months for gap assessment and planning, 2-3 months for framework development, 2-3 months for implementation and testing, 1-2 months for internal audit and improvements, and 1-2 months for certification audit. Fast-track implementation in 4-6 months is possible with strong existing governance and dedicated resources. The August 2026 EU AI Act deadline makes early adoption crucial.'
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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">
              ⏰ Critical Deadline: EU AI Act enforcement begins August 2026
            </p>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            AI Certification for UK Public Sector: Preparing for ISO 42001 & the EU AI Act
          </h1>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400 p-6 mb-8">
            <p className="text-lg font-semibold text-purple-900 mb-2">
              🤖 The AI Compliance Revolution is Coming
            </p>
            <p className="text-purple-800">
              With the EU AI Act taking full effect in August 2026 and the UK developing its own AI framework, ISO 42001 certification is becoming essential for public sector AI suppliers. Early adopters will dominate the £2.5 billion UK government AI market.
            </p>
          </div>

          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: ai-certification-iso-42001-uk.jpg - ISO 42001 AI management system certification framework for UK public sector]
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            The AI regulatory landscape is transforming rapidly. With the EU AI Act becoming fully enforceable in August 2026 and the UK government accelerating its AI assurance programme, public sector AI suppliers face unprecedented compliance requirements. ISO 42001, the world's first AI management system standard, has emerged as the cornerstone of AI certification - offering a pathway to demonstrate responsible AI practices and regulatory compliance.
          </p>

          <p>
            For UK companies supplying AI systems to government, NHS, police, and local authorities, the message is clear: certification is no longer optional. Those who act now will be positioned to capture the growing public sector AI market, while late adopters risk exclusion from major contracts.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">The Regulatory Timeline: Why August 2026 Matters</h2>
          
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Key Dates for AI Compliance</h3>
            <table className="min-w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-semibold text-purple-600">December 2023</td>
                  <td className="py-3">ISO 42001 published - first international AI standard</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold text-purple-600">March 2024</td>
                  <td className="py-3">EU AI Act approved by European Parliament</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold text-purple-600">August 2024</td>
                  <td className="py-3">EU AI Act enters into force (20 days after publication)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold text-purple-600">February 2025</td>
                  <td className="py-3">Prohibited AI systems banned (6 months after entry)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold text-purple-600">August 2025</td>
                  <td className="py-3">Codes of practice and governance (12 months)</td>
                </tr>
                <tr className="border-b bg-red-50">
                  <td className="py-3 font-semibold text-red-600">August 2026</td>
                  <td className="py-3 font-semibold">Full AI Act application - all systems must comply (24 months)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold text-purple-600">2025-2026</td>
                  <td className="py-3">UK AI Bill expected (aligning with EU standards)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">ISO 42001: The Gold Standard for AI Management</h2>
          
          <p>
            ISO 42001:2023 provides a comprehensive framework for responsible AI development and deployment:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Core Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li>• AI governance structure</li>
                <li>• Risk management framework</li>
                <li>• Data governance and quality</li>
                <li>• Algorithm transparency</li>
                <li>• Human oversight mechanisms</li>
                <li>• Performance monitoring</li>
                <li>• Continuous improvement</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Key Principles</h3>
              <ul className="space-y-2 text-sm">
                <li>• Fairness and non-discrimination</li>
                <li>• Transparency and explainability</li>
                <li>• Accountability and liability</li>
                <li>• Privacy and data protection</li>
                <li>• Robustness and safety</li>
                <li>• Human agency and oversight</li>
                <li>• Societal and environmental wellbeing</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">UK Public Sector AI Requirements</h2>
          
          <div className="bg-white border rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold mb-4">Current Government AI Initiatives</h3>
            <ul className="space-y-3">
              <li>
                <strong>Algorithmic Transparency Standard:</strong> Requires public sector organisations to publish information about algorithmic decision-making
              </li>
              <li>
                <strong>AI Assurance Framework:</strong> CDDO/CDEI developing mandatory standards for government AI procurement
              </li>
              <li>
                <strong>NHS AI Lab Standards:</strong> Clinical safety, effectiveness, and ethics requirements for healthcare AI
              </li>
              <li>
                <strong>Police AI Guidelines:</strong> College of Policing standards for law enforcement AI use
              </li>
              <li>
                <strong>Data Ethics Framework:</strong> Cross-government principles for responsible data use
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">High-Risk AI Applications in UK Public Sector</h2>
          
          <p>
            Under EU AI Act definitions (likely to influence UK regulation), these public sector uses are high-risk:
          </p>

          <div className="bg-red-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Critical Infrastructure</h3>
            <ul className="space-y-1">
              <li>• Energy grid management</li>
              <li>• Water supply systems</li>
              <li>• Transport networks</li>
              <li>• Digital infrastructure</li>
            </ul>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Essential Services</h3>
            <ul className="space-y-1">
              <li>• Healthcare diagnosis and treatment</li>
              <li>• Emergency services dispatch</li>
              <li>• Benefits and social assistance</li>
              <li>• Education assessment and access</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-3">Law Enforcement & Justice</h3>
            <ul className="space-y-1">
              <li>• Predictive policing</li>
              <li>• Risk assessment in criminal justice</li>
              <li>• Biometric identification</li>
              <li>• Evidence evaluation</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">ISO 42001 Implementation Roadmap</h2>
          
          <div className="bg-gradient-to-b from-purple-50 to-white p-8 rounded-lg my-8">
            <h3 className="text-xl font-bold mb-6">12-Month Implementation Timeline</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Months 1-2: Gap Assessment</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Current AI inventory and risk assessment</li>
                    <li>• ISO 42001 requirements mapping</li>
                    <li>• Resource and budget planning</li>
                    <li>• Stakeholder engagement</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Months 3-5: Framework Development</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• AI management system design</li>
                    <li>• Policy and procedure creation</li>
                    <li>• Risk management framework</li>
                    <li>• Governance structure establishment</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Months 6-8: Implementation</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Process deployment</li>
                    <li>• Training programmes</li>
                    <li>• Technical controls implementation</li>
                    <li>• Documentation and evidence gathering</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Months 9-10: Testing & Validation</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Internal audit</li>
                    <li>• Management review</li>
                    <li>• Corrective actions</li>
                    <li>• Performance measurement</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Months 11-12: Certification</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Stage 1 audit (documentation)</li>
                    <li>• Stage 2 audit (implementation)</li>
                    <li>• Certification decision</li>
                    <li>• Continuous improvement plan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Cost Analysis: ISO 42001 Investment</h2>
          
          <table className="min-w-full border border-gray-300 my-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Organisation Size</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Year 1 Costs</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Annual Maintenance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>SME AI Vendor</strong><br/>
                  <span className="text-sm text-gray-600">(10-50 employees)</span>
                </td>
                <td className="border border-gray-300 px-4 py-2">£55,000 - £85,000</td>
                <td className="border border-gray-300 px-4 py-2">£15,000 - £25,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>Mid-size AI Company</strong><br/>
                  <span className="text-sm text-gray-600">(50-250 employees)</span>
                </td>
                <td className="border border-gray-300 px-4 py-2">£85,000 - £150,000</td>
                <td className="border border-gray-300 px-4 py-2">£25,000 - £45,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>Enterprise AI Provider</strong><br/>
                  <span className="text-sm text-gray-600">(250+ employees)</span>
                </td>
                <td className="border border-gray-300 px-4 py-2">£150,000 - £300,000</td>
                <td className="border border-gray-300 px-4 py-2">£45,000 - £80,000</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mt-10 mb-4">Competitive Advantage Through Early Adoption</h2>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-6 my-8">
            <p className="font-semibold text-green-900 mb-2">
              ✅ Benefits of ISO 42001 Certification Now
            </p>
            <ul className="space-y-2 text-green-800">
              <li>• <strong>Market differentiation:</strong> Currently fewer than 50 UK companies certified</li>
              <li>• <strong>Tender readiness:</strong> Meet requirements before they become mandatory</li>
              <li>• <strong>Trust signal:</strong> Demonstrate AI responsibility to risk-averse public sector</li>
              <li>• <strong>EU market access:</strong> Compliance pathway for cross-border opportunities</li>
              <li>• <strong>Insurance benefits:</strong> Reduced premiums for certified AI systems</li>
              <li>• <strong>Investment attraction:</strong> ESG compliance for funding rounds</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Practical Steps for Public Sector AI Suppliers</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-4">Immediate Actions (Q1 2025)</h3>
            <ol className="space-y-3">
              <li>
                <strong>1. AI System Audit:</strong> Catalogue all AI systems and classify risk levels under EU AI Act criteria
              </li>
              <li>
                <strong>2. Gap Assessment:</strong> Evaluate current practices against ISO 42001 requirements
              </li>
              <li>
                <strong>3. Business Case:</strong> Calculate ROI of certification vs. lost tender opportunities
              </li>
              <li>
                <strong>4. Partner Selection:</strong> Identify ISO 42001 consultants and certification bodies
              </li>
              <li>
                <strong>5. Pilot Programme:</strong> Start with one AI system for certification
              </li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-4">Strategic Preparations (2025-2026)</h3>
            <ol className="space-y-3">
              <li>
                <strong>6. Documentation:</strong> Build comprehensive AI governance documentation
              </li>
              <li>
                <strong>7. Training Programme:</strong> Upskill teams on responsible AI practices
              </li>
              <li>
                <strong>8. Technical Alignment:</strong> Implement explainability and bias detection tools
              </li>
              <li>
                <strong>9. Supply Chain:</strong> Ensure third-party AI components comply
              </li>
              <li>
                <strong>10. Certification:</strong> Complete ISO 42001 by Q2 2026 (before August deadline)
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">UK-Specific Considerations</h2>
          
          <p>
            While the UK isn't bound by EU law, several factors make compliance essential:
          </p>

          <ul className="space-y-3">
            <li>
              <strong>Northern Ireland:</strong> The Windsor Framework may require EU AI Act compliance for NI operations
            </li>
            <li>
              <strong>Data adequacy:</strong> UK-EU data flows depend on aligned standards
            </li>
            <li>
              <strong>Market pressure:</strong> UK government unlikely to accept lower standards than EU
            </li>
            <li>
              <strong>International trade:</strong> Global clients expect EU-level compliance
            </li>
            <li>
              <strong>Regulatory convergence:</strong> UK AI Bill expected to mirror EU approach
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Sector-Specific Requirements</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">NHS and Healthcare</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• MHRA Software as Medical Device regulations</li>
                <li>• NHS AI Lab algorithmic impact assessments</li>
                <li>• Clinical safety standards (DCB0129/DCB0160)</li>
                <li>• NICE evidence standards framework</li>
                <li>• Information governance toolkit requirements</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Law Enforcement</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Home Office biometric strategy compliance</li>
                <li>• Surveillance camera code of practice</li>
                <li>• RIPA and investigatory powers framework</li>
                <li>• College of Policing APP guidelines</li>
                <li>• Information Commissioner's Office guidance</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Central Government</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• GDS Service Standard requirements</li>
                <li>• Algorithmic transparency standard</li>
                <li>• Green Book appraisal guidance</li>
                <li>• NAO value for money criteria</li>
                <li>• Cabinet Office spend controls</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">The ROI of AI Certification</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <h3 className="font-semibold mb-4">Quantifiable Benefits</h3>
            <table className="min-w-full">
              <tbody>
                <tr className="border-b border-blue-200">
                  <td className="py-2 font-medium">Tender win rate increase</td>
                  <td className="py-2 text-right">25-40%</td>
                </tr>
                <tr className="border-b border-blue-200">
                  <td className="py-2 font-medium">Contract value premium</td>
                  <td className="py-2 text-right">15-20%</td>
                </tr>
                <tr className="border-b border-blue-200">
                  <td className="py-2 font-medium">Compliance cost reduction</td>
                  <td className="py-2 text-right">30-50%</td>
                </tr>
                <tr className="border-b border-blue-200">
                  <td className="py-2 font-medium">Incident risk reduction</td>
                  <td className="py-2 text-right">60-70%</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Time to market improvement</td>
                  <td className="py-2 text-right">20-30%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Common Certification Challenges</h2>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
            <p className="font-semibold text-amber-900 mb-2">
              ⚠️ Implementation Pitfalls to Avoid
            </p>
            <ul className="space-y-2 text-amber-800">
              <li>• Underestimating documentation requirements</li>
              <li>• Insufficient stakeholder buy-in</li>
              <li>• Treating it as purely technical (it's organisational)</li>
              <li>• Ignoring third-party AI components</li>
              <li>• Not planning for continuous monitoring</li>
              <li>• Focusing on compliance over effectiveness</li>
              <li>• Delaying until requirements are mandatory</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is ISO 42001?</h3>
              <p>
                ISO 42001:2023 is the world's first international standard for AI management systems. Published in December 2023, it provides a framework for establishing, implementing, maintaining, and improving AI systems responsibly. It covers governance, risk management, fairness, transparency, and accountability. For UK public sector suppliers, ISO 42001 certification will likely become essential as the government adopts AI assurance frameworks aligned with international standards.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Will the EU AI Act apply to UK companies?</h3>
              <p>
                Yes, the EU AI Act will apply to UK companies in three scenarios: (1) If they place AI systems on the EU market, (2) If their AI system outputs are used in the EU, or (3) If they provide AI systems to EU public authorities. With August 2026 as the full enforcement date, UK public sector suppliers working with EU data or cross-border projects must comply. The UK is developing its own AI regulation, likely to align closely with EU standards.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What are the costs of ISO 42001 certification?</h3>
              <p>
                ISO 42001 certification costs vary by organisation size and AI maturity: Initial gap assessment £5,000-£15,000, consultancy support £15,000-£50,000, implementation £20,000-£100,000, certification audit £10,000-£30,000, and annual surveillance £5,000-£15,000. Total first-year costs typically range from £55,000-£210,000. Additional costs include staff training, documentation systems, and potential technical improvements to AI systems for compliance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Which UK public sector contracts will require AI certification?</h3>
              <p>
                AI certification will likely be required for: NHS AI diagnostic tools and patient data analytics, police facial recognition and predictive policing systems, DWP benefits decision systems, HMRC fraud detection, local authority service automation, education assessment tools, and any high-risk AI applications. The Procurement Act 2023 enables mandatory AI standards, and government frameworks are expected to require ISO 42001 from 2025 onwards.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does ISO 42001 implementation take?</h3>
              <p>
                ISO 42001 implementation typically takes 6-12 months: 1-2 months for gap assessment and planning, 2-3 months for framework development, 2-3 months for implementation and testing, 1-2 months for internal audit and improvements, and 1-2 months for certification audit. Fast-track implementation in 4-6 months is possible with strong existing governance and dedicated resources. The August 2026 EU AI Act deadline makes early adoption crucial.
              </p>
            </div>
          </div>

          <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-8 my-12">
            <h2 className="text-2xl font-bold mb-4">Action Required: Start Your ISO 42001 Journey</h2>
            <p className="text-lg mb-6">
              With less than 18 months until the EU AI Act deadline and UK regulations imminent, now is the time to act. Early certification provides competitive advantage and ensures compliance readiness.
            </p>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-3">Next Steps:</h3>
              <ol className="space-y-2">
                <li>1. Download ISO 42001:2023 standard (£198 from BSI)</li>
                <li>2. Conduct initial gap assessment</li>
                <li>3. Engage ISO 42001 consultant</li>
                <li>4. Develop implementation roadmap</li>
                <li>5. Begin certification process</li>
              </ol>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">External Resources</h2>
          
          <ul className="space-y-2">
            <li>
              <a href="https://www.iso.org/standard/81230.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                ISO 42001:2023 Official Standard
              </a>
            </li>
            <li>
              <a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                EU AI Act Official Information
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/publications/ai-regulation-a-pro-innovation-approach" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                UK Government AI Regulation Approach
              </a>
            </li>
            <li>
              <a href="https://www.gov.uk/government/collections/algorithmic-transparency-standard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                UK Algorithmic Transparency Standard
              </a>
            </li>
            <li>
              <a href="https://www.nhsx.nhs.uk/ai-lab/ai-lab-programmes/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NHS AI Lab Standards and Guidance
              </a>
            </li>
            <li>
              <a href="https://www.bsigroup.com/en-GB/iso-42001-ai-management-system/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                BSI ISO 42001 Certification Services
              </a>
            </li>
          </ul>

          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Link href="/certifications/iso-27001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 27001 Information Security
                </Link>
                <p className="text-sm text-gray-600 mt-1">Foundation for AI data governance</p>
              </div>
              <div>
                <Link href="/certifications/cyber-essentials-plus-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  Cyber Essentials Plus
                </Link>
                <p className="text-sm text-gray-600 mt-1">Security baseline for AI systems</p>
              </div>
              <div>
                <Link href="/certifications/iso-9001-uk-tenders" className="text-blue-600 hover:underline font-medium">
                  ISO 9001 Quality Management
                </Link>
                <p className="text-sm text-gray-600 mt-1">Quality framework for AI development</p>
              </div>
              <div>
                <Link href="/certifications/" className="text-blue-600 hover:underline font-medium">
                  All UK Procurement Certifications
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