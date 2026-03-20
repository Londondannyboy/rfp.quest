import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'JOSCAR Defence Tenders UK: Supply Chain Cert Guide 2026',
  description: 'JOSCAR is the mandatory pre-qualification for UK defence and aerospace supply chains. Required by BAE Systems, Rolls-Royce, Airbus UK. Complete 2026 guide.',
  openGraph: {
    title: 'JOSCAR Defence Tenders UK: Supply Chain Cert Guide 2026',
    description: 'JOSCAR is the mandatory pre-qualification for UK defence and aerospace supply chains. Required by BAE Systems, Rolls-Royce, Airbus UK. Complete 2026 guide.',
    type: 'article',
  },
}

export default function /joscarDefenceTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"JOSCAR for UK Defence Tenders: Supply Chain Certification Guide","description":"JOSCAR is the mandatory pre-qualification for UK defence and aerospace supply chains. Required by BAE Systems, Rolls-Royce, Airbus UK. Complete 2026 guide.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T12:03:17.641Z","dateModified":"2026-03-20T12:03:17.642Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is JOSCAR mandatory for all UK defence contracts?","acceptedAnswer":{"@type":"Answer","text":"JOSCAR is mandatory for supplying to major UK defence primes including BAE Systems, Rolls-Royce, Airbus UK, Leonardo, and MBDA. While not required for direct MOD contracts, it's essential for subcontracting to defence primes. Without JOSCAR, you won't appear in the Hellios supplier database these companies use for sourcing."}},{"@type":"Question","name":"How much does JOSCAR certification cost?","acceptedAnswer":{"@type":"Answer","text":"JOSCAR Self-Assessment is free. Full Assessment costs £500-£1,500+ per year depending on company size and audit complexity. Additional costs may include consultant support (£1,000-£3,000) if you need help preparing for assessment. Annual renewal fees apply for maintaining your registration."}},{"@type":"Question","name":"How long does JOSCAR accreditation take?","acceptedAnswer":{"@type":"Answer","text":"Self-Assessment can be completed in 1-2 days if you have all documentation ready. Full Assessment takes 4-8 weeks: 1-2 weeks for self-assessment completion, 2-4 weeks for audit scheduling, 1-2 days for the audit itself, and 1 week for report and certification. Having quality, environmental and H&S systems already in place speeds up the process."}},{"@type":"Question","name":"What's the difference between JOSCAR and AS9100?","acceptedAnswer":{"@type":"Answer","text":"JOSCAR is a pre-qualification system covering multiple compliance areas (quality, H&S, environment, security, ethics). AS9100 is specifically an aerospace quality management standard. Many defence contractors require both: JOSCAR for pre-qualification and AS9100 for quality assurance. JOSCAR Full Assessment often verifies that you have AS9100 but doesn't replace it."}},{"@type":"Question","name":"Can I use JOSCAR for non-defence contracts?","acceptedAnswer":{"@type":"Answer","text":"JOSCAR is primarily recognised within aerospace and defence sectors. While the accreditation demonstrates good business practices, it's not typically recognised in other sectors like construction, utilities, or general manufacturing. For those sectors, you'll need relevant schemes like CHAS, Achilles UVDB, or SafeContractor."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            JOSCAR for UK Defence Tenders: Supply Chain Certification Guide
          </h1>
          <p className="text-xl text-slate-600">
            JOSCAR is the mandatory pre-qualification for UK defence and aerospace supply chains. Required by BAE Systems, Rolls-Royce, Airbus UK. Complete 2026 guide.
          </p>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Facts</h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>JOSCAR = Joint Supply Chain Accreditation Register</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Operated by Hellios Information Ltd</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Mandatory for suppliers to BAE Systems, Rolls-Royce, Airbus UK, GKN Aerospace, Leonardo, MBDA, Thales, Safran, Raytheon UK</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Two tiers: Self-Assessment and Full Assessment (audited)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Covers H&S, environmental, quality, financial, ethical trading, cybersecurity</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Self-assessment: free; Full Assessment: £500-£1,500+/year</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Timeline: self-assessment immediate; full assessment 4-8 weeks</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Without JOSCAR: cannot appear in Hellios supplier search</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is JOSCAR and who requires it?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">JOSCAR (Joint Supply Chain Accreditation Register) is the unified pre-qualification system used by the UK's aerospace and defence prime contractors. Originally developed by ADS Group (the trade association for UK aerospace, defence, security and space sectors), JOSCAR is now operated by Hellios Information Ltd.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The system was created to eliminate duplication in supply chain qualification. Instead of completing separate pre-qualification questionnaires for each prime contractor, suppliers complete JOSCAR once and share their data with multiple buyers. This reduces the administrative burden on both suppliers and buyers while ensuring consistent standards across the defence supply chain.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Major UK defence companies that require JOSCAR include BAE Systems, Rolls-Royce, Airbus UK, Leonardo, MBDA UK, Thales UK, GKN Aerospace, Safran Helicopter Engines UK, Raytheon UK, and QinetiQ. If you want to supply any of these organisations, JOSCAR registration is typically the first step in their supplier onboarding process.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">JOSCAR vs SSIP: different sectors, different schemes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">While JOSCAR and SSIP (Safety Schemes in Procurement) might seem similar, they serve completely different sectors and are not interchangeable. SSIP is primarily for construction and general health & safety pre-qualification, while JOSCAR is specifically designed for aerospace and defence supply chains.</p>
          <p className="text-slate-700 leading-relaxed mb-4">JOSCAR goes far beyond health and safety, covering quality management, environmental compliance, financial stability, ethical trading, information security, and sector-specific requirements like ITAR (International Traffic in Arms Regulations) compliance and export control awareness. The assessment criteria are tailored to the unique requirements of defence manufacturing and aerospace engineering.</p>
          <p className="text-slate-700 leading-relaxed mb-4">You cannot use SSIP certification to satisfy JOSCAR requirements, nor vice versa. If you work across both construction and defence sectors, you'll need both certifications.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Which UK defence companies use JOSCAR?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">The JOSCAR system is used by virtually all major UK defence and aerospace prime contractors. Here's a comprehensive list of organisations that require or prefer JOSCAR:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Tier 1 Primes:** BAE Systems (all UK divisions), Rolls-Royce (Defence Aerospace), Airbus UK, Leonardo UK, MBDA UK, Thales UK, Babcock International, QinetiQ, Raytheon UK, General Dynamics UK.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Aerospace Manufacturers:** GKN Aerospace, Safran Landing Systems UK, Safran Helicopter Engines UK, Collins Aerospace UK, Spirit AeroSystems Belfast, Marshall Aerospace and Defence Group.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Defence Systems:** Ultra Electronics, Cobham (now part of Advent International), Meggitt (now part of Parker Hannifin), Martin-Baker Aircraft, L3Harris Technologies UK.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Support Services:** Serco Defence, KBR UK, Lockheed Martin UK, Northrop Grumman UK, Boeing Defence UK.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Each organisation may have different minimum requirements within JOSCAR. For example, BAE Systems might require Full Assessment for direct suppliers but accept Self-Assessment for lower-tier suppliers.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Self-assessment vs Full Assessment: which do you need?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">JOSCAR offers two levels of accreditation, and choosing the right one depends on your customer requirements and contract values.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Self-Assessment (Entry Level):**
- Online questionnaire completed by supplier
- Covers basic compliance areas
- No external verification
- Free to complete
- Suitable for: lower-risk supplies, indirect materials, small contract values
- Valid for 12 months
- Can be completed in 1-2 days</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Full Assessment (Verified):**
- Self-assessment PLUS independent audit
- Desktop or on-site verification by approved auditor
- Required for: direct production suppliers, safety-critical components, high-value contracts
- Cost: £500-£1,500+ depending on company size and complexity
- Timeline: 4-8 weeks including audit scheduling
- Valid for 12-months with surveillance visits</p>
          <p className="text-slate-700 leading-relaxed mb-4">Most prime contractors specify which level they require in their supplier requirements. As a general rule, if you're supplying components that go into aircraft, weapons systems, or safety-critical applications, expect to need Full Assessment. For supplies of commercial off-the-shelf items, tooling, or support services, Self-Assessment may suffice.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">JOSCAR and government defence contracts</h2>
          <p className="text-slate-700 leading-relaxed mb-4">While JOSCAR is primarily a requirement of defence prime contractors rather than the MOD directly, it plays a crucial role in government defence contracts through the supply chain.</p>
          <p className="text-slate-700 leading-relaxed mb-4">When the MOD awards major contracts to prime contractors like BAE Systems or Rolls-Royce, these primes are responsible for managing their supply chains. They use JOSCAR as their primary tool for ensuring supply chain compliance with MOD requirements including:</p>
          <p className="text-slate-700 leading-relaxed mb-4">- Defence Standards (DEF STANs)
- Security requirements (including personnel security)
- Export control and ITAR compliance
- Quality standards (AS9100 for aerospace)
- Cyber security requirements (Cyber Essentials, DEFSTAN 05-138)
- Modern Slavery Act compliance
- Anti-bribery and corruption policies</p>
          <p className="text-slate-700 leading-relaxed mb-4">If you're bidding for MOD contracts as a prime contractor, you won't need JOSCAR. However, if you're planning to be a subcontractor to a prime on MOD programmes, JOSCAR is almost certainly required. This creates a two-tier system where JOSCAR acts as the gateway to the defence supply chain below prime contractor level.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://hellios.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Hellios Information (JOSCAR operator)
            </a>
            <a href="https://www.adsgroup.org.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              ADS Group (UK Aerospace, Defence & Security)
            </a>
            <a href="https://www.gov.uk/government/organisations/defence-and-security-accelerator" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Defence and Security Accelerator
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is JOSCAR mandatory for all UK defence contracts?</h3>
              <p className="text-slate-700 leading-relaxed">JOSCAR is mandatory for supplying to major UK defence primes including BAE Systems, Rolls-Royce, Airbus UK, Leonardo, and MBDA. While not required for direct MOD contracts, it's essential for subcontracting to defence primes. Without JOSCAR, you won't appear in the Hellios supplier database these companies use for sourcing.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does JOSCAR certification cost?</h3>
              <p className="text-slate-700 leading-relaxed">JOSCAR Self-Assessment is free. Full Assessment costs £500-£1,500+ per year depending on company size and audit complexity. Additional costs may include consultant support (£1,000-£3,000) if you need help preparing for assessment. Annual renewal fees apply for maintaining your registration.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How long does JOSCAR accreditation take?</h3>
              <p className="text-slate-700 leading-relaxed">Self-Assessment can be completed in 1-2 days if you have all documentation ready. Full Assessment takes 4-8 weeks: 1-2 weeks for self-assessment completion, 2-4 weeks for audit scheduling, 1-2 days for the audit itself, and 1 week for report and certification. Having quality, environmental and H&S systems already in place speeds up the process.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What's the difference between JOSCAR and AS9100?</h3>
              <p className="text-slate-700 leading-relaxed">JOSCAR is a pre-qualification system covering multiple compliance areas (quality, H&S, environment, security, ethics). AS9100 is specifically an aerospace quality management standard. Many defence contractors require both: JOSCAR for pre-qualification and AS9100 for quality assurance. JOSCAR Full Assessment often verifies that you have AS9100 but doesn't replace it.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I use JOSCAR for non-defence contracts?</h3>
              <p className="text-slate-700 leading-relaxed">JOSCAR is primarily recognised within aerospace and defence sectors. While the accreditation demonstrates good business practices, it's not typically recognised in other sectors like construction, utilities, or general manufacturing. For those sectors, you'll need relevant schemes like CHAS, Achilles UVDB, or SafeContractor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/as9100-aerospace-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                As9100 Aerospace Tenders
              </span>
            </Link>
            <Link href="/certifications/security-clearance-uk-defence-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Security Clearance Uk Defence Tenders
              </span>
            </Link>
            <Link href="/certifications/defstan-05-138-defence-cyber" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Defstan 05 138 Defence Cyber
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With JOSCAR?
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
