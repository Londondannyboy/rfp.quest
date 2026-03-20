import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'PCI DSS UK Tenders: Payment Card Security Guide 2026',
  description: 'PCI DSS compliance is mandatory for any UK tender involving card payment processing. Level 1, 2, 3 requirements and how to demonstrate compliance.',
  openGraph: {
    title: 'PCI DSS UK Tenders: Payment Card Security Guide 2026',
    description: 'PCI DSS compliance is mandatory for any UK tender involving card payment processing. Level 1, 2, 3 requirements and how to demonstrate compliance.',
    type: 'article',
  },
}

export default function /pciDssUkTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"PCI DSS for UK Tenders: Payment Security Compliance Guide","description":"PCI DSS compliance is mandatory for any UK tender involving card payment processing. Level 1, 2, 3 requirements and how to demonstrate compliance.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T14:59:22.581Z","dateModified":"2026-03-20T14:59:22.581Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is PCI DSS legally required for UK public sector contracts?","acceptedAnswer":{"@type":"Answer","text":"PCI DSS is contractually required by card brands, not law. However, UK public sector treats it as mandatory for any payment processing contracts. Councils, NHS trusts, and government departments all require PCI DSS compliance from payment service providers. Non-compliance means exclusion from payment-related tenders."}},{"@type":"Question","name":"What PCI DSS level do councils typically require?","acceptedAnswer":{"@type":"Answer","text":"Councils typically require Level 1 or Level 2 compliance for main payment providers, even if transaction volumes suggest Level 3 or 4. This is due to reputational risk and the sensitive nature of citizen data. Smaller suppliers might provide Level 3/4 compliance if they're using tokenization or redirecting to compliant payment gateways."}},{"@type":"Question","name":"How much does PCI DSS compliance cost?","acceptedAnswer":{"@type":"Answer","text":"PCI DSS costs range from £500-£2,000 annually for Level 4 (small merchants) to £25,000-£150,000+ for Level 1 compliance in Year 1. Most SMEs providing payment services fall into Level 3 (£4,000-£11,500 Year 1). Costs include assessment, scanning, remediation, and tools. Ongoing compliance is typically 30-50% of initial costs."}},{"@type":"Question","name":"Can I use Stripe/PayPal instead of getting PCI DSS?","acceptedAnswer":{"@type":"Answer","text":"Using payment providers like Stripe or PayPal reduces but doesn't eliminate PCI DSS requirements. You still need SAQ A or SAQ A-EP compliance depending on integration method. For public sector contracts, you must provide your own AOC (Attestation of Compliance) even when using compliant third parties. The good news: SAQ A is much simpler and cheaper than full compliance."}},{"@type":"Question","name":"Does ISO 27001 cover PCI DSS requirements?","acceptedAnswer":{"@type":"Answer","text":"No, ISO 27001 doesn't replace PCI DSS. While both cover information security, PCI DSS has specific requirements for card data protection that ISO 27001 doesn't address. Many public sector tenders require both: ISO 27001 for general infosec and PCI DSS for payment security. Having ISO 27001 makes PCI DSS easier but doesn't replace it."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            PCI DSS for UK Tenders: Payment Security Compliance Guide
          </h1>
          <p className="text-xl text-slate-600">
            PCI DSS compliance is mandatory for any UK tender involving card payment processing. Level 1, 2, 3 requirements and how to demonstrate compliance.
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
                <span>PCI DSS = Payment Card Industry Data Security Standard</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Required for any card payment processing</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Four levels based on transaction volume</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Annual compliance requirement</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Cost varies from £500 to £40,000+</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Most SMEs are Level 3 or 4</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Mandatory for council payment systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Applies to both online and terminal payments</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is PCI DSS and when is it required?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">PCI DSS (Payment Card Industry Data Security Standard) is the global security standard for any organisation that accepts, processes, stores, or transmits credit card information. In UK public sector procurement, PCI DSS compliance is mandatory for any contract involving payment card handling.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The standard was created by major card brands (Visa, Mastercard, American Express, Discover, JCB) and is enforced through contractual obligations rather than law. However, for UK public sector contracts, PCI DSS has become a de facto regulatory requirement. Any supplier handling card payments on behalf of public bodies must demonstrate current PCI DSS compliance.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Common scenarios requiring PCI DSS in public sector include: online payment portals for councils, parking payment systems, leisure centre booking systems, council tax and business rate payments, court fine payments, NHS patient payment systems, university fee payments, and any Software-as-a-Service that processes payments.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">PCI DSS Levels explained</h2>
          <p className="text-slate-700 leading-relaxed mb-4">PCI DSS has four compliance levels based on annual transaction volume. Understanding your level is crucial for tender compliance.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Level 1 (>6 million transactions/year):**
Requires annual on-site assessment by Qualified Security Assessor (QSA). Most expensive and rigorous level. Quarterly network scans by Approved Scanning Vendor (ASV). Cost: £15,000-£40,000+ annually.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Level 2 (1-6 million transactions/year):**
Annual Self-Assessment Questionnaire (SAQ) with quarterly network scans. May require QSA assessment depending on acquirer. Cost: £5,000-£15,000 annually.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Level 3 (20,000-1 million transactions/year):**
Annual SAQ with quarterly network scans. Most common for SME service providers. Cost: £2,000-£5,000 annually.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Level 4 (<20,000 transactions/year):**
Annual SAQ, quarterly scans often optional. Common for small suppliers. Cost: £500-£2,000 annually.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Which SAQ type?**
Different Self-Assessment Questionnaires apply: SAQ A (card-not-present, fully outsourced), SAQ A-EP (e-commerce, partially outsourced), SAQ B (terminal only, no storage), SAQ C (payment application systems), SAQ D (full assessment, any storage).</p>
          <p className="text-slate-700 leading-relaxed mb-4">Most SaaS providers complete SAQ D regardless of level.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public sector payment processing requirements</h2>
          <p className="text-slate-700 leading-relaxed mb-4">UK public sector has specific requirements beyond basic PCI DSS compliance.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Council requirements:**
Local authorities typically require Level 1 or Level 2 compliance for main payment providers. Even small transaction volumes may require higher-level compliance due to reputational risk. Annual Attestation of Compliance (AOC) must be provided. Compliance must cover all payment channels (online, phone, face-to-face).</p>
          <p className="text-slate-700 leading-relaxed mb-4">**NHS requirements:**
NHS trusts handling patient payments require PCI DSS for any system touching card data. Integration with NHS spine services adds complexity. Patient data protection (beyond PCI DSS) must be demonstrated. Often paired with ISO 27001 requirements.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Central government:**
Government Payment Service (GPS) has specific PCI DSS requirements. Suppliers must be on the GPS framework or demonstrate equivalent standards. Regular compliance audits beyond annual PCI DSS assessment. Incident reporting obligations to Cabinet Office.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Evidence required in tenders:**
Current AOC (Attestation of Compliance) signed by QSA or company officer, Recent ASV scan reports showing no critical vulnerabilities, Certificate of compliance from acquirer/payment processor, Detailed network diagram if processing payments directly, Incident response plan for payment card breaches.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cloud services and PCI DSS responsibility</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Understanding PCI DSS responsibilities in cloud environments is crucial for modern tenders.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Shared responsibility model:**
Your cloud provider (AWS, Azure, Google Cloud) handles physical security and infrastructure compliance. You remain responsible for your application security, access controls, and data handling. Both parties need PCI DSS compliance for full coverage.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**SaaS provider obligations:**
If you provide SaaS that handles payments, you typically need SAQ D compliance. You must provide AOC to all customers annually. Your compliance level depends on total transactions across all customers. Customer-specific security requirements may exceed basic PCI DSS.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Using third-party payment providers:**
Services like Stripe, PayPal, or Worldpay can reduce PCI DSS scope. You still need compliance (usually SAQ A or SAQ A-EP). Must verify your payment provider's PCI DSS compliance. Redirect or iframe integration affects your compliance requirements.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Common cloud pitfalls:**
Assuming cloud provider compliance covers you (it doesn't). Not securing application logs containing card data. Inadequate access controls to cloud management consoles. Missing encryption for card data in transit between services. Insufficient network segmentation in cloud environments.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cost and timeline for PCI DSS compliance</h2>
          <p className="text-slate-700 leading-relaxed mb-4">PCI DSS costs vary dramatically based on compliance level and current security posture.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Level 1 costs (QSA required):**
Initial assessment: £10,000-£25,000
Remediation: £10,000-£100,000+ depending on gaps
Annual reassessment: £10,000-£20,000
Quarterly ASV scans: £500-£2,000/year
Total Year 1: £25,000-£150,000+</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Level 3-4 costs (SAQ):**
Initial gap assessment: £2,000-£5,000
Documentation and policies: £1,000-£3,000
Vulnerability scanning setup: £500-£2,000
Annual ASV scans: £500-£1,500
Total Year 1: £4,000-£11,500</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Additional costs:**
Consultant support: £800-£1,500/day
Security tools (WAF, IDS): £500-£5,000/month
Penetration testing: £5,000-£15,000
Security training: £500-£2,000 per staff
Cyber insurance premium increase: 10-30%</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Timeline:**
Level 4 SAQ: 1-2 months
Level 3 SAQ: 2-3 months
Level 2: 3-6 months
Level 1: 6-12 months</p>
          <p className="text-slate-700 leading-relaxed mb-4">Timeline assumes no major infrastructure changes required. Legacy systems can add months.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.pcisecuritystandards.org" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              PCI Security Standards Council
            </a>
            <a href="https://www.gov.uk/government/groups/government-banking-service" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              UK Government Payment Service
            </a>
            <a href="https://www.ncsc.gov.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              NCSC Payment Security Guidance
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is PCI DSS legally required for UK public sector contracts?</h3>
              <p className="text-slate-700 leading-relaxed">PCI DSS is contractually required by card brands, not law. However, UK public sector treats it as mandatory for any payment processing contracts. Councils, NHS trusts, and government departments all require PCI DSS compliance from payment service providers. Non-compliance means exclusion from payment-related tenders.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What PCI DSS level do councils typically require?</h3>
              <p className="text-slate-700 leading-relaxed">Councils typically require Level 1 or Level 2 compliance for main payment providers, even if transaction volumes suggest Level 3 or 4. This is due to reputational risk and the sensitive nature of citizen data. Smaller suppliers might provide Level 3/4 compliance if they're using tokenization or redirecting to compliant payment gateways.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does PCI DSS compliance cost?</h3>
              <p className="text-slate-700 leading-relaxed">PCI DSS costs range from £500-£2,000 annually for Level 4 (small merchants) to £25,000-£150,000+ for Level 1 compliance in Year 1. Most SMEs providing payment services fall into Level 3 (£4,000-£11,500 Year 1). Costs include assessment, scanning, remediation, and tools. Ongoing compliance is typically 30-50% of initial costs.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I use Stripe/PayPal instead of getting PCI DSS?</h3>
              <p className="text-slate-700 leading-relaxed">Using payment providers like Stripe or PayPal reduces but doesn't eliminate PCI DSS requirements. You still need SAQ A or SAQ A-EP compliance depending on integration method. For public sector contracts, you must provide your own AOC (Attestation of Compliance) even when using compliant third parties. The good news: SAQ A is much simpler and cheaper than full compliance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Does ISO 27001 cover PCI DSS requirements?</h3>
              <p className="text-slate-700 leading-relaxed">No, ISO 27001 doesn't replace PCI DSS. While both cover information security, PCI DSS has specific requirements for card data protection that ISO 27001 doesn't address. Many public sector tenders require both: ISO 27001 for general infosec and PCI DSS for payment security. Having ISO 27001 makes PCI DSS easier but doesn't replace it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/iso-27001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 27001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/cyber-essentials-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Cyber Essentials Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/soc-2-uk-government-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Soc 2 Uk Government Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With PCI?
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
