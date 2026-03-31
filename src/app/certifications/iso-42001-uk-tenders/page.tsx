import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'ISO 42001 UK Tenders: AI Cert Guide 2026 | RFP Platform Quest',
  description: 'ISO 42001 AI management certification is now required for UK AI contracts. EU AI Act enforcement begins Aug 2026. Costs from £8,000. Complete guide.',
  keywords: 'ISO 42001 UK tenders, AI management certification UK government, ISO 42001 cost UK, AI governance certification public sector, ISO 42001 procurement',
  openGraph: {
    title: 'ISO 42001 UK Tenders: AI Certification Guide 2026',
    description: 'ISO 42001 AI management certification is now required for UK AI contracts. EU AI Act enforcement begins Aug 2026. Complete guide.',
    url: 'https://rfp.quest/certifications/iso-42001-uk-tenders',
    siteName: 'RFP Platform Quest',
    type: 'article',
  },
  alternates: {
    canonical: 'https://rfp.quest/certifications/iso-42001-uk-tenders',
  },
}

export default function ISO42001Page() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'ISO 42001 for UK Tenders: AI Certification Requirements in 2026',
    description: 'ISO 42001 AI management certification is now required for UK AI contracts. EU AI Act enforcement begins Aug 2026. Costs from £8,000. Complete guide.',
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
    mainEntityOfPage: 'https://rfp.quest/certifications/iso-42001-uk-tenders'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is ISO 42001 mandatory for UK government AI contracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 42001 is rapidly moving from "advantageous" to effectively required for UK government AI contracts. The UK government procurement guidelines published in January 2025 explicitly recommend evaluators require ISO 42001 evidence from AI vendors. While not yet legally mandatory, it is becoming a de facto requirement for public sector AI work, especially with the EU AI Act enforcement deadline of August 2026 approaching.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does ISO 42001 certification cost in the UK?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 42001 certification costs for UK SMEs start from £8,000 for small companies, with typical ranges of £8,000 to £50,000 in Year 1 depending on the complexity and number of AI systems in scope. This includes consultant support, which is often necessary due to the shortage of UK consultants who bridge both ISO management systems and AI governance expertise. Costs are approximate and vary by organisation size, complexity, and certification body.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does ISO 42001 certification take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 42001 certification typically takes 4 to 6 months for SMEs and 6 to 12 months for larger organisations. The timeline depends on the complexity of your AI systems, existing management systems in place, and the readiness of your documentation and processes. Having other ISO certifications like ISO 27001 can accelerate the process due to shared framework elements.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need both ISO 42001 and ISO 27001?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For AI systems handling sensitive or personal data in UK government contracts, you will likely need both ISO 42001 and ISO 27001. ISO 42001 addresses AI-specific governance and risk management, while ISO 27001 covers broader information security requirements. The standards complement each other - ISO 27001 provides the security framework while ISO 42001 adds AI-specific controls for bias, fairness, transparency, and explainability.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which UK government contracts require ISO 42001?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ISO 42001 is increasingly required for AI consultancies, SaaS companies using AI, data science companies, and any organisation deploying AI in public sector services. Specific departments actively requiring or evaluating ISO 42001 include NHS Digital for AI diagnostic systems, central government digital services using automated decision-making, local authorities implementing AI citizen services, and any contracts involving high-risk AI systems as defined by the EU AI Act.'
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
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            ISO 42001 for UK Tenders: AI Certification Requirements in 2026
          </h1>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
            <p className="font-semibold text-amber-900 mb-2">⚠️ Time-Sensitive Alert</p>
            <p className="text-amber-800">
              The EU AI Act's enforcement deadline for high-risk AI systems is August 2026. 
              UK government procurement guidelines published in January 2025 explicitly 
              recommend requiring ISO 42001 conformity from AI vendors. If you're pitching 
              public sector AI contracts, this window is closing.
            </p>
          </div>

          {/* TODO: Add hero image */}
          <div className="bg-gray-100 h-64 flex items-center justify-center mb-8 rounded-lg">
            <p className="text-gray-500">
              [Image: iso-42001-uk-tenders-uk.jpg - ISO 42001 UK tenders requirements for UK government tenders]
            </p>
          </div>
        </header>

        {/* Main Content */}
        <section className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-8">
            ISO 42001 is rapidly becoming essential for AI companies bidding on UK government contracts. 
            With the EU AI Act enforcement beginning in August 2026 and UK procurement guidelines 
            explicitly recommending ISO 42001 conformity, AI vendors need to act now to maintain 
            their competitive position in public sector tenders.
          </p>

          <h2 id="what-is-iso-42001" className="text-2xl font-bold mt-10 mb-4">
            What is ISO 42001 and why does it matter for UK procurement?
          </h2>
          
          <p>
            ISO/IEC 42001:2023 is the world's first international standard for Artificial Intelligence 
            Management Systems (AIMS), published in October 2023. It provides a comprehensive framework 
            for establishing, implementing, maintaining and continually improving AI governance within 
            organisations that develop or deploy AI systems.
          </p>

          <p>
            For UK public sector procurement, ISO 42001 has moved from a "nice-to-have" to a critical 
            requirement in just two years. The UK government procurement guidelines released in January 2025 
            explicitly recommend that evaluators require ISO 42001 evidence from AI vendors, marking a 
            significant shift in how AI procurement is assessed.
          </p>

          <p>
            The standard addresses key concerns that public sector buyers have about AI systems:
          </p>
          
          <ul>
            <li><strong>Bias and fairness:</strong> Systematic approaches to identifying and mitigating algorithmic bias</li>
            <li><strong>Transparency:</strong> Clear documentation of AI decision-making processes</li>
            <li><strong>Accountability:</strong> Defined roles and responsibilities for AI governance</li>
            <li><strong>Risk management:</strong> AI-specific risk assessment and treatment processes</li>
            <li><strong>Data governance:</strong> Quality controls and privacy protections for training data</li>
            <li><strong>Human oversight:</strong> Maintaining meaningful human control over AI systems</li>
          </ul>

          <h2 id="which-contracts-require" className="text-2xl font-bold mt-10 mb-4">
            Which UK government contracts are starting to require ISO 42001?
          </h2>

          <p>
            ISO 42001 requirements are appearing across multiple public sector categories, with certain 
            departments leading the adoption:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">NHS and Healthcare</h3>
          <ul>
            <li>AI diagnostic and imaging systems</li>
            <li>Patient risk assessment tools</li>
            <li>Treatment recommendation systems</li>
            <li>Administrative automation platforms</li>
            <li>Drug discovery and research applications</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Central Government Digital Services</h3>
          <ul>
            <li>Automated decision-making systems</li>
            <li>Citizen service chatbots and virtual assistants</li>
            <li>Fraud detection and prevention systems</li>
            <li>Document processing and analysis tools</li>
            <li>Predictive analytics platforms</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Local Authorities</h3>
          <ul>
            <li>Social services risk assessment tools</li>
            <li>Planning and development decision support</li>
            <li>Resource allocation optimisation</li>
            <li>Customer service automation</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Defence and Security</h3>
          <ul>
            <li>Intelligence analysis systems</li>
            <li>Surveillance and monitoring tools</li>
            <li>Cybersecurity threat detection</li>
            <li>Logistics optimisation platforms</li>
          </ul>

          <p className="mt-6">
            Notably, any organisation supplying AI systems that fall under the EU AI Act's definition 
            of "high-risk" will need ISO 42001 to demonstrate compliance when working with UK public 
            sector clients who also operate in the EU or Northern Ireland.
          </p>

          <h2 id="eu-ai-act" className="text-2xl font-bold mt-10 mb-4">
            ISO 42001 and the EU AI Act: what UK companies need to know
          </h2>

          <p>
            The EU AI Act's enforcement for high-risk AI systems begins in August 2026, creating an 
            urgent timeline for UK companies. While the UK hasn't directly adopted the EU AI Act, 
            its influence on procurement practices is undeniable:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-semibold mb-3">Key EU AI Act Dates for UK Companies:</h3>
            <ul className="space-y-2">
              <li><strong>August 2025:</strong> Prohibited AI systems banned</li>
              <li><strong>August 2026:</strong> High-risk AI system requirements enforced</li>
              <li><strong>August 2027:</strong> General-purpose AI model obligations apply</li>
            </ul>
          </div>

          <p>
            ISO 42001 serves as the primary governance framework for demonstrating EU AI Act compliance. 
            UK companies working with:
          </p>
          
          <ul>
            <li>EU-based public sector organisations</li>
            <li>UK organisations with EU operations</li>
            <li>Northern Ireland public bodies (due to special arrangements)</li>
            <li>International consortiums including EU partners</li>
          </ul>

          <p>
            will find ISO 42001 essential for maintaining market access. The standard's requirements 
            align closely with the Act's obligations around risk management, transparency, human 
            oversight, and technical robustness.
          </p>

          <h2 id="certification-cost" className="text-2xl font-bold mt-10 mb-4">
            ISO 42001 certification cost UK: realistic 2026 figures
          </h2>

          <p>
            ISO 42001 certification costs vary significantly based on organisation size, AI system 
            complexity, and existing management systems. Here's what UK organisations should budget:
          </p>

          <div className="overflow-x-auto my-8">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Organisation Size</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Year 1 Total Cost</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Breakdown</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Annual Maintenance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Small (1-50 employees)</td>
                  <td className="border border-gray-300 px-4 py-2">£8,000 - £20,000</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Consultancy: £5,000-£12,000<br/>
                    Certification: £3,000-£5,000<br/>
                    Training: £1,000-£3,000
                  </td>
                  <td className="border border-gray-300 px-4 py-2">£2,000 - £4,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Medium (51-250 employees)</td>
                  <td className="border border-gray-300 px-4 py-2">£20,000 - £35,000</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Consultancy: £12,000-£20,000<br/>
                    Certification: £5,000-£8,000<br/>
                    Training: £3,000-£5,000
                  </td>
                  <td className="border border-gray-300 px-4 py-2">£4,000 - £7,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Large (250+ employees)</td>
                  <td className="border border-gray-300 px-4 py-2">£35,000 - £50,000+</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Consultancy: £20,000-£30,000<br/>
                    Certification: £8,000-£12,000<br/>
                    Training: £5,000-£8,000
                  </td>
                  <td className="border border-gray-300 px-4 py-2">£7,000 - £12,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg my-6">
            <p className="text-sm">
              <strong>Cost Notice:</strong> Costs are approximate and vary by organisation size, 
              complexity, and certification body. Get a quote from a UKAS-accredited body for 
              accurate pricing. The shortage of UK consultants with both ISO and AI expertise 
              means premium rates are common in 2026.
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Hidden Costs to Consider</h3>
          <ul>
            <li><strong>Internal resource time:</strong> 200-400 hours of staff time</li>
            <li><strong>Technology changes:</strong> Updates to AI systems for compliance</li>
            <li><strong>Documentation systems:</strong> Tools for maintaining AIMS records</li>
            <li><strong>Ongoing training:</strong> Keeping staff updated on AI governance</li>
            <li><strong>Annual audits:</strong> Surveillance visits to maintain certification</li>
          </ul>

          <h2 id="timeline" className="text-2xl font-bold mt-10 mb-4">
            How long does ISO 42001 take to get?
          </h2>

          <p>
            The ISO 42001 certification timeline depends on your starting position and AI system complexity:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Typical Timeline for SMEs (4-6 months)</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Month 1:</strong> Gap analysis and scoping</li>
            <li><strong>Month 2:</strong> AI system inventory and risk assessment</li>
            <li><strong>Months 3-4:</strong> AIMS implementation and documentation</li>
            <li><strong>Month 5:</strong> Internal audit and management review</li>
            <li><strong>Month 6:</strong> Certification audit (Stage 1 and Stage 2)</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Factors That Accelerate Certification</h3>
          <ul>
            <li>Existing ISO certifications (especially ISO 27001 or ISO 9001)</li>
            <li>Mature AI governance practices already in place</li>
            <li>Dedicated project team with management support</li>
            <li>Limited number of AI systems in scope</li>
            <li>Experienced ISO 42001 consultant (though rare in 2026)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Common Delays</h3>
          <ul>
            <li>Unclear AI system boundaries and dependencies</li>
            <li>Lack of existing AI documentation</li>
            <li>Complex supply chain AI components</li>
            <li>Multiple stakeholders requiring consultation</li>
            <li>Integration with existing management systems</li>
          </ul>

          <h2 id="iso-27001-comparison" className="text-2xl font-bold mt-10 mb-4">
            ISO 42001 vs ISO 27001: do you need both?
          </h2>

          <p>
            Many UK public sector tenders now expect both ISO 42001 and ISO 27001 for AI systems 
            handling sensitive data. Understanding the relationship between these standards is crucial:
          </p>

          <div className="overflow-x-auto my-8">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ISO 27001</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ISO 42001</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Focus</td>
                  <td className="border border-gray-300 px-4 py-2">Information security</td>
                  <td className="border border-gray-300 px-4 py-2">AI governance and ethics</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Key Controls</td>
                  <td className="border border-gray-300 px-4 py-2">Access control, encryption, incident response</td>
                  <td className="border border-gray-300 px-4 py-2">Bias assessment, explainability, human oversight</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Risk Focus</td>
                  <td className="border border-gray-300 px-4 py-2">Data breaches, cyber attacks</td>
                  <td className="border border-gray-300 px-4 py-2">AI bias, unfair outcomes, lack of transparency</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Required For</td>
                  <td className="border border-gray-300 px-4 py-2">All data-handling contracts</td>
                  <td className="border border-gray-300 px-4 py-2">AI system development/deployment</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Typical Cost</td>
                  <td className="border border-gray-300 px-4 py-2">£5,000 - £40,000</td>
                  <td className="border border-gray-300 px-4 py-2">£8,000 - £50,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-semibold mb-2">Integration Benefits</h3>
            <p>
              If you already have ISO 27001, adding ISO 42001 is more efficient. The standards 
              share the same high-level structure (Annex SL), allowing for integrated management 
              systems. Combined audits can reduce costs by 20-30% and minimise disruption.
            </p>
          </div>

          <h2 id="preparation-steps" className="text-2xl font-bold mt-10 mb-4">
            How to prepare for ISO 42001: first steps for AI agencies
          </h2>

          <p>
            With the August 2026 EU AI Act deadline approaching, UK AI agencies should begin 
            ISO 42001 preparation immediately. Here's your roadmap:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Immediate Actions (Do This Week)</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Create an AI System Inventory</strong><br/>
              Document all AI systems you develop, deploy, or use. Include:
              <ul className="list-disc pl-6 mt-2">
                <li>System name and purpose</li>
                <li>Data inputs and outputs</li>
                <li>Decision-making impact</li>
                <li>Risk classification (per EU AI Act)</li>
                <li>Current governance measures</li>
              </ul>
            </li>
            <li>
              <strong>Assess Your Starting Position</strong><br/>
              Review existing policies and procedures for:
              <ul className="list-disc pl-6 mt-2">
                <li>AI development standards</li>
                <li>Data governance practices</li>
                <li>Testing and validation processes</li>
                <li>Documentation standards</li>
                <li>Ethical guidelines</li>
              </ul>
            </li>
            <li>
              <strong>Identify Your Scope</strong><br/>
              Decide which AI systems to include in initial certification. Starting with a 
              focused scope can accelerate certification and reduce costs.
            </li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Month 1: Foundation Building</h3>
          <ul className="space-y-3">
            <li>
              <strong>Establish AI Governance Structure</strong><br/>
              Appoint an AI governance lead and form a cross-functional team including 
              technical, legal, and business representatives.
            </li>
            <li>
              <strong>Conduct Risk Assessment</strong><br/>
              Identify AI-specific risks including bias, transparency, safety, and privacy 
              concerns for each system in scope.
            </li>
            <li>
              <strong>Gap Analysis</strong><br/>
              Compare current practices against ISO 42001 requirements. Consider hiring a 
              consultant for this critical step.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Months 2-3: Documentation and Implementation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Develop Core Documentation</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>AI Policy</li>
                <li>Risk Assessment Methodology</li>
                <li>AI System Development Lifecycle</li>
                <li>Data Governance Framework</li>
                <li>Incident Response Procedures</li>
              </ul>
            </li>
            <li>
              <strong>Implement Technical Controls</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Bias detection and mitigation measures</li>
                <li>Explainability mechanisms</li>
                <li>Performance monitoring systems</li>
                <li>Human oversight processes</li>
                <li>Model versioning and documentation</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Certification Bodies</h3>
          <p>
            Choose a UKAS-accredited certification body early. Current providers offering 
            ISO 42001 in the UK include:
          </p>
          <ul>
            <li>BSI (British Standards Institution)</li>
            <li>SGS</li>
            <li>Bureau Veritas</li>
            <li>Alcumus</li>
            <li>DNV</li>
            <li>TÜV SÜD</li>
          </ul>
          <p className="mt-3">
            Note: The market is still developing. Verify current accreditation status at{' '}
            <a href="https://www.ukas.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              ukas.com
            </a>.
          </p>

          <h2 id="faq" className="text-2xl font-bold mt-10 mb-4">
            ISO 42001 Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Is ISO 42001 mandatory for UK government AI contracts?</h3>
              <p>
                While not yet legally mandatory, ISO 42001 is rapidly becoming a de facto requirement. 
                The UK government procurement guidelines (January 2025) explicitly recommend requiring 
                ISO 42001 evidence from AI vendors. With the EU AI Act enforcement in August 2026, 
                it's moving from "advantageous" to essential for competitive positioning.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much does ISO 42001 certification cost in the UK?</h3>
              <p>
                UK SMEs should budget £8,000 to £50,000 for Year 1, depending on organisation size 
                and AI system complexity. This includes consultant fees (often necessary due to 
                specialist shortage), certification body costs, and training. Annual surveillance 
                audits typically cost £2,000 to £12,000.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How long does ISO 42001 certification take?</h3>
              <p>
                Typically 4-6 months for SMEs and 6-12 months for larger organisations. Having 
                existing ISO certifications (especially ISO 27001) can reduce this by 1-2 months. 
                The timeline depends heavily on AI system complexity and current governance maturity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Do I need both ISO 42001 and ISO 27001?</h3>
              <p>
                For AI systems handling sensitive data in government contracts, you'll likely need both. 
                ISO 27001 covers information security while ISO 42001 addresses AI-specific concerns 
                like bias, transparency, and explainability. They're complementary, not competing standards.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Which UK government contracts require ISO 42001?</h3>
              <p>
                NHS AI diagnostic systems, central government automated decision-making tools, 
                local authority AI services, and any high-risk AI systems as defined by the EU AI Act 
                increasingly require or strongly prefer ISO 42001. Check specific tender requirements, 
                as adoption is rapidly expanding across all public sector AI procurement.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mt-12">
            <h2 className="text-2xl font-bold mb-4">Track ISO 42001 Requirements in UK Tenders</h2>
            <p className="mb-6">
              We monitor which UK public sector tenders are starting to require ISO 42001 as part 
              of our compliance intelligence database. Get our free quarterly report on AI 
              certification trends in UK procurement.
            </p>
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition"
              >
                Get Free Report →
              </button>
            </form>
            <p className="text-sm mt-4 opacity-90">
              Join 500+ AI agencies tracking certification requirements. Unsubscribe anytime.
            </p>
          </div>

          {/* Internal Links */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Related Certification Guides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/certifications/" className="text-blue-600 hover:underline">
                  UK procurement certifications complete guide
                </Link>
              </li>
              <li>
                <Link href="/certifications/iso-27001-uk-tenders" className="text-blue-600 hover:underline">
                  ISO 27001 for UK tenders - information security certification
                </Link>
              </li>
              <li>
                <Link href="/certifications/cyber-essentials-uk-tenders" className="text-blue-600 hover:underline">
                  Cyber Essentials for government contracts
                </Link>
              </li>
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  RFP Platform Quest - UK RFP intelligence platform
                </Link>
              </li>
            </ul>
          </nav>

          {/* External Links */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Official Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.iso.org/standard/81230.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline external-link"
                >
                  ISO 42001:2023 official standard page
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/government/publications/guidelines-for-ai-procurement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline external-link"
                >
                  UK Government AI procurement guidelines
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncsc.gov.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline external-link"
                >
                  NCSC AI security guidance
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
            </ul>
          </div>
        </section>
      </article>
    </>
  )
}