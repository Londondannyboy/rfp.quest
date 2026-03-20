import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SMETA Sedex UK Tenders: Ethical Trade Audit Guide 2026',
  description: 'SMETA ethical trade audits are required by major retailers and NHS Supply Chain for food and goods tenders. Sedex membership and 2-Pillar vs 4-Pillar guide.',
  openGraph: {
    title: 'SMETA Sedex UK Tenders: Ethical Trade Audit Guide 2026',
    description: 'SMETA ethical trade audits are required by major retailers and NHS Supply Chain for food and goods tenders. Sedex membership and 2-Pillar vs 4-Pillar guide.',
    type: 'article',
  },
}

export default function /smetaSedexUkTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"SMETA and Sedex for UK Tenders: Ethical Trade Audit Guide 2026","description":"SMETA ethical trade audits are required by major retailers and NHS Supply Chain for food and goods tenders. Sedex membership and 2-Pillar vs 4-Pillar guide.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T14:59:22.581Z","dateModified":"2026-03-20T14:59:22.581Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is SMETA mandatory for NHS suppliers?","acceptedAnswer":{"@type":"Answer","text":"SMETA is mandatory for many NHS Supply Chain frameworks, particularly food, textiles, and goods with complex supply chains. It's part of NHS modern slavery and social value requirements. Service-only contracts may not require SMETA, but any physical goods supply increasingly needs it. Check specific framework requirements."}},{"@type":"Question","name":"What's the difference between Sedex and SMETA?","acceptedAnswer":{"@type":"Answer","text":"Sedex is the online platform for sharing ethical data. SMETA is the audit methodology conducted through Sedex. You need Sedex membership first (£350-£500/year), then arrange a SMETA audit (£800-£2,500). Think of Sedex as the system and SMETA as the audit standard."}},{"@type":"Question","name":"How much does SMETA certification cost in total?","acceptedAnswer":{"@type":"Answer","text":"Total Year 1 costs typically range from £1,500-£4,000 including Sedex membership (£350-£500), SMETA audit (£800-£2,500), and preparation support. 4-Pillar audits cost more than 2-Pillar. Ongoing costs are lower: annual Sedex membership plus periodic re-audits every 2-3 years."}},{"@type":"Question","name":"Should I get 2-Pillar or 4-Pillar SMETA?","acceptedAnswer":{"@type":"Answer","text":"Go straight for 4-Pillar SMETA if possible. While 2-Pillar covers basic labour and H&S, most major buyers now require 4-Pillar which adds environment and business ethics. The cost difference is modest (£500-£700 more) but 4-Pillar opens more opportunities and avoids re-auditing later."}},{"@type":"Question","name":"Can SMETA replace other ethical certifications?","acceptedAnswer":{"@type":"Answer","text":"SMETA is widely accepted but doesn't replace all ethical certifications. Some buyers also require SA8000, BSCI, or sector-specific standards. However, SMETA is the most commonly accepted in UK retail and public sector. Many buyers accept SMETA as equivalent to their proprietary audits, reducing audit burden."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            SMETA and Sedex for UK Tenders: Ethical Trade Audit Guide 2026
          </h1>
          <p className="text-xl text-slate-600">
            SMETA ethical trade audits are required by major retailers and NHS Supply Chain for food and goods tenders. Sedex membership and 2-Pillar vs 4-Pillar guide.
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
                <span>SMETA = Sedex Members Ethical Trade Audit</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Sedex = Supplier Ethical Data Exchange platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Required by major UK retailers and NHS</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>2-Pillar: Labour and H&S only</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>4-Pillar: adds Environment and Business Ethics</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Sedex membership: £350-£500/year</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>SMETA audit: £800-£2,500</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Links to Modern Slavery Act compliance</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is SMETA and why do UK buyers require it?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">SMETA (Sedex Members Ethical Trade Audit) is one of the world's most widely used social audit formats, providing a standardised approach to ethical and responsible business practices. The audit is conducted using the Sedex platform, which allows buyers and suppliers to share ethical data efficiently.</p>
          <p className="text-slate-700 leading-relaxed mb-4">UK buyers require SMETA to demonstrate supply chain compliance with ethical standards, particularly around modern slavery, labour rights, and responsible sourcing. Since the Modern Slavery Act 2015, UK companies must demonstrate due diligence in their supply chains. SMETA provides independently verified evidence of ethical compliance.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Major UK retailers (Tesco, Sainsbury's, ASDA, M&S), NHS Supply Chain, and many public sector frameworks now require SMETA audits from suppliers. This is particularly common in sectors with complex global supply chains: food and drink, textiles and clothing, manufacturing, and logistics. Without SMETA, suppliers are increasingly excluded from major supply contracts.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2-Pillar vs 4-Pillar SMETA: which do you need?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">SMETA offers two audit options, and choosing the right one depends on your buyer requirements and sector.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**2-Pillar SMETA covers:**
Labour Standards (wages, working hours, child labour, discrimination, regular employment), Health and Safety (workplace safety, emergency procedures, first aid, protective equipment). This is the minimum for most supply chains and focuses on core worker welfare issues.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**4-Pillar SMETA adds:**
Environment (environmental management, waste, emissions, resource use), Business Ethics (anti-corruption, data protection, whistleblowing, sub-contracting). This comprehensive approach is increasingly required by leading retailers and public sector.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Which to choose:**
NHS Supply Chain typically requires 4-Pillar for direct suppliers. Major supermarkets generally require 4-Pillar for food suppliers, 2-Pillar for non-food. Public sector frameworks increasingly specify 4-Pillar to cover sustainability. Manufacturing and logistics might start with 2-Pillar. Environmental impact sectors need 4-Pillar.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The trend is strongly toward 4-Pillar as buyers focus on net-zero commitments and ESG requirements. Starting with 4-Pillar future-proofs your compliance.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sedex membership and platform requirements</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Before conducting a SMETA audit, you must be a Sedex member. Understanding the platform is crucial for compliance.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Sedex membership tiers:**
- Basic (AB): £350-£500/year for suppliers
- Advanced (A): £500-£1,000/year with additional features
- Buyer membership: £5,000-£50,000/year (for those checking suppliers)</p>
          <p className="text-slate-700 leading-relaxed mb-4">**What Sedex membership includes:**
Access to online platform for sharing audit data, Self-Assessment Questionnaire (SAQ), Audit report storage and sharing, Corrective action plan management, Connection with multiple buyers, Risk assessment tools.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Platform obligations:**
Complete and maintain your SAQ (updates required when circumstances change). Upload all audit reports within 10 days. Manage corrective actions with timeline updates. Respond to buyer queries and information requests. Keep company information current.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Buyer visibility:**
Your Sedex profile is visible to all connected buyers. Poor audit results or overdue corrective actions are visible. Buyers can compare your performance against peers. Platform analytics show engagement levels. Non-participation or poor maintenance affects buyer confidence.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">NHS and public sector SMETA requirements</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Public sector increasingly requires SMETA, driven by Modern Slavery Act obligations and social value procurement policies.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**NHS Supply Chain:**
Requires SMETA for food frameworks (patient catering, retail), textiles (uniforms, linen), facilities management, logistics providers. Typically specifies 4-Pillar SMETA. Must be conducted within last 3 years. Corrective actions must be closed or progressing.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Local authorities:**
Council procurement increasingly scores SMETA in social value evaluation. Required for: school uniform suppliers, catering contracts, construction materials with overseas supply chains, facilities management. Weights 5-10% of tender score under social value.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Modern Slavery Act connection:**
SMETA provides evidence for Modern Slavery Act compliance. Public sector cannot contract with non-compliant suppliers. SMETA demonstrates due diligence in supply chain. Audit reports feed into mandatory modern slavery statements.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Procurement Act 2023:**
New act strengthens social value requirements. SMETA helps demonstrate "public benefit" criteria. Expected to increase weighting of ethical compliance.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">SMETA audit process and costs</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Understanding the SMETA audit process helps manage costs and timelines effectively.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Audit costs:**
- 2-Pillar audit: £800-£1,500 (1 day on-site)
- 4-Pillar audit: £1,500-£2,500 (1-2 days on-site)
- Follow-up audit: £600-£1,000 (half day)
- Desktop review: £300-£500</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Additional costs:**
- Sedex membership: £350-£500/year
- Consultant preparation: £500-£1,500
- Translator (if needed): £300-£500/day
- Corrective action implementation: Variable
- Annual maintenance: £1,000-£2,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Audit process:**
1. Preparation (4-6 weeks): Document review, worker interviews prep, site preparation
2. Audit (1-2 days): Opening meeting, document review, site tour, worker interviews, closing meeting
3. Report (2 weeks): Auditor issues report with non-conformances
4. Corrective actions (ongoing): Address findings within agreed timescales
5. Verification: Follow-up audit or desktop review</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Validity period:**
SMETA audits are typically valid for 3 years, but many buyers require audits within 2 years. Annual surveillance encouraged. Major non-conformances may trigger earlier re-audit.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.sedex.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Sedex Platform
            </a>
            <a href="https://www.supplychain.nhs.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              NHS Supply Chain Ethical Standards
            </a>
            <a href="https://www.gov.uk/guidance/modern-slavery-act" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Modern Slavery Act Guidance
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is SMETA mandatory for NHS suppliers?</h3>
              <p className="text-slate-700 leading-relaxed">SMETA is mandatory for many NHS Supply Chain frameworks, particularly food, textiles, and goods with complex supply chains. It's part of NHS modern slavery and social value requirements. Service-only contracts may not require SMETA, but any physical goods supply increasingly needs it. Check specific framework requirements.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What's the difference between Sedex and SMETA?</h3>
              <p className="text-slate-700 leading-relaxed">Sedex is the online platform for sharing ethical data. SMETA is the audit methodology conducted through Sedex. You need Sedex membership first (£350-£500/year), then arrange a SMETA audit (£800-£2,500). Think of Sedex as the system and SMETA as the audit standard.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does SMETA certification cost in total?</h3>
              <p className="text-slate-700 leading-relaxed">Total Year 1 costs typically range from £1,500-£4,000 including Sedex membership (£350-£500), SMETA audit (£800-£2,500), and preparation support. 4-Pillar audits cost more than 2-Pillar. Ongoing costs are lower: annual Sedex membership plus periodic re-audits every 2-3 years.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Should I get 2-Pillar or 4-Pillar SMETA?</h3>
              <p className="text-slate-700 leading-relaxed">Go straight for 4-Pillar SMETA if possible. While 2-Pillar covers basic labour and H&S, most major buyers now require 4-Pillar which adds environment and business ethics. The cost difference is modest (£500-£700 more) but 4-Pillar opens more opportunities and avoids re-auditing later.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can SMETA replace other ethical certifications?</h3>
              <p className="text-slate-700 leading-relaxed">SMETA is widely accepted but doesn't replace all ethical certifications. Some buyers also require SA8000, BSCI, or sector-specific standards. However, SMETA is the most commonly accepted in UK retail and public sector. Many buyers accept SMETA as equivalent to their proprietary audits, reducing audit burden.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/brcgs-food-tenders-uk" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Brcgs Food Tenders Uk
              </span>
            </Link>
            <Link href="/certifications/iso-14001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 14001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/living-wage-accreditation-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Living Wage Accreditation Uk Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With SMETA?
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
