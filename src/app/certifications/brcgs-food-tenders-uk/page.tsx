import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BRCGS Food Tenders UK: Safety Standard Requirements 2026',
  description: 'BRCGS (formerly BRC) is mandatory for most UK food retail and public sector catering contracts. AA grade required for major retailers. Cost and process guide.',
  openGraph: {
    title: 'BRCGS Food Tenders UK: Safety Standard Requirements 2026',
    description: 'BRCGS (formerly BRC) is mandatory for most UK food retail and public sector catering contracts. AA grade required for major retailers. Cost and process guide.',
    type: 'article',
  },
}

export default function /brcgsFoodTendersUkPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"BRCGS for UK Food Supply Chain Tenders: Certification Guide 2026","description":"BRCGS (formerly BRC) is mandatory for most UK food retail and public sector catering contracts. AA grade required for major retailers. Cost and process guide.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T12:03:17.823Z","dateModified":"2026-03-20T12:03:17.823Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is BRCGS mandatory for NHS food suppliers?","acceptedAnswer":{"@type":"Answer","text":"Yes, BRCGS Grade A minimum is mandatory for all NHS Supply Chain food framework suppliers. This applies to all product categories from fresh produce to patient nutrition. Service-only contractors (without food handling) may be exempt, but any company supplying food products must have BRCGS certification."}},{"@type":"Question","name":"How much does BRCGS certification cost per year?","acceptedAnswer":{"@type":"Answer","text":"BRCGS typically costs £3,000-£15,000 annually for established certified sites (audit plus license fees). First-year costs are higher at £10,000-£50,000 including gap analysis, consultancy, training, and often infrastructure improvements. Large complex sites can exceed these estimates."}},{"@type":"Question","name":"What's the difference between BRCGS and SALSA?","acceptedAnswer":{"@type":"Answer","text":"BRCGS is the premium standard required by major retailers and large public sector frameworks. SALSA is a more accessible standard for smaller producers, accepted by local authorities and independent retailers. BRCGS is more rigorous and costly but opens more doors. You cannot use SALSA where BRCGS is specified."}},{"@type":"Question","name":"How long does it take to get BRCGS certified?","acceptedAnswer":{"@type":"Answer","text":"Achieving BRCGS typically takes 6-12 months from start to certification. This includes gap analysis (Month 1), implementation (Months 2-5), internal audits (Month 6), and certification audit. Achieving Grade AA often takes an additional year of continuous improvement after initial certification."}},{"@type":"Question","name":"Can I get BRCGS if I work from home or a small unit?","acceptedAnswer":{"@type":"Answer","text":"BRCGS has strict infrastructure requirements that are difficult to meet in home or micro settings. You need dedicated facilities, segregation, pest control, changing facilities, and documented cleaning programmes. Most home-based food businesses choose SALSA instead, which is designed for smaller operations. BRCGS is really for commercial food production facilities."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            BRCGS for UK Food Supply Chain Tenders: Certification Guide 2026
          </h1>
          <p className="text-xl text-slate-600">
            BRCGS (formerly BRC) is mandatory for most UK food retail and public sector catering contracts. AA grade required for major retailers. Cost and process guide.
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
                <span>BRCGS = Brand Reputation through Compliance Global Standards</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Formerly BRC (British Retail Consortium Global Standards)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Current version: BRCGS Food Safety Issue 9</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Mandatory for UK supermarkets and NHS catering</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Grades: AA, A, B, C, D - major retailers require minimum A</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Required for NHS Supply Chain food frameworks</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Cost: £1,500-£4,000/year for audits</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Timeline: 6-12 months to achieve AA grade</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is BRCGS and why does it matter for food tenders?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">BRCGS (Brand Reputation through Compliance Global Standards), formerly known as BRC, is the leading global food safety certification programme. Originally developed by UK retailers to ensure food safety in their supply chains, BRCGS has become the de facto standard for food suppliers to UK retail and public sector.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The standard was created by the British Retail Consortium but is now owned and operated by LGC, a global science company. Despite the ownership change, the standard remains the primary requirement for UK food supply chains. BRCGS Food Safety Issue 9 (current version as of 2026) covers all aspects of food safety management including HACCP, quality management, factory environment standards, product control, process control, and personnel requirements.</p>
          <p className="text-slate-700 leading-relaxed mb-4">For UK food businesses, BRCGS certification is not optional if you want to supply: major supermarkets (Tesco, Sainsbury's, Asda, Morrisons, Waitrose), public sector catering (NHS trusts, schools, prisons, armed forces), food service companies (Compass Group, Sodexo, ISS), or most food wholesalers and distributors. Without BRCGS, you're effectively locked out of mainstream food supply chains.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">BRCGS grades: what AA, A, B, C, D mean for tender eligibility</h2>
          <p className="text-slate-700 leading-relaxed mb-4">BRCGS uses a grading system that directly impacts your ability to win contracts. Understanding these grades is crucial for tender success.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Grade AA (Highest):**
Announced audit with no non-conformities. Required by premium retailers (Waitrose, M&S) and increasingly by others. Audit frequency: 12 months. This is the gold standard that opens all doors.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Grade A:**
Announced audit with 5 or fewer minor non-conformities. Accepted by most retailers and public sector buyers. Audit frequency: 12 months. This is the minimum for major supply contracts.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Grade B:**
Up to 10 minor non-conformities or one major. May be accepted for non-critical supplies or during improvement periods. Audit frequency: 6 months. Limited tender opportunities.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Grade C:**
Up to 20 minor non-conformities or one critical. Generally not accepted for retail supply. Requires improvement action plan. Audit frequency: 6 months.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Grade D:**
More than 20 minors or multiple majors. Certificate suspended pending improvements. Cannot supply BRCGS customers.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Most public sector food frameworks specify "BRCGS Grade A minimum" in their requirements. Premium contracts often specify AA grade only. Your grade directly affects your tender competitiveness - even one minor non-conformity can lose you business.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public sector food contracts requiring BRCGS</h2>
          <p className="text-slate-700 leading-relaxed mb-4">BRCGS is extensively required across UK public sector food procurement. Here are the key frameworks and buyers:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**NHS Supply Chain Food Framework:**
All suppliers must have BRCGS Grade A minimum. This covers all NHS trusts in England, worth £500m+ annually. Categories include fresh produce, dairy, meat, frozen foods, ambient goods, and patient nutrition products.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Crown Commercial Service (CCS) Food Frameworks:**
CCS manages multiple food frameworks for central government, including catering services, food products, and vending. BRCGS is mandatory for product suppliers, though service-only contractors may be exempt.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Ministry of Defence (MOD):**
Defence Catering Services requires BRCGS for all food suppliers to military bases, operations, and training facilities. Higher grades (AA/A) preferred due to operational criticality.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Education Sector:**
School food frameworks (via local authorities or academy trusts) typically require BRCGS. This includes suppliers to council-run schools, academy chains, and universities.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Justice System:**
HM Prison Service food suppliers must have BRCGS due to the controlled environment and vulnerable population considerations.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Without BRCGS, you cannot bid for these frameworks or their call-off contracts, regardless of other qualifications or competitive pricing.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">BRCGS Food Safety vs BRCGS Packaging: which do you need?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">BRCGS operates multiple standards, and choosing the right one is crucial for compliance and cost management.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**BRCGS Food Safety:**
For manufacturers of food products intended for human consumption. This is what retailers and public sector food buyers require. Covers everything from raw material handling to finished product release. If you make, process, or pack food, this is your standard.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**BRCGS Packaging:**
For manufacturers of packaging materials used in food contact applications. Required if you supply packaging to food manufacturers but don't handle food yourself. Major packaging converters and printers need this standard.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**When you need both:**
Some operations require both standards. For example, if you manufacture food AND produce your own printed packaging on-site, you may need dual certification. However, most food businesses only need Food Safety - purchasing compliant packaging from BRCGS Packaging certified suppliers.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Other BRCGS Standards:**
BRCGS also offers Agents & Brokers (for traders/importers), Storage & Distribution (for logistics providers), and Consumer Products (for non-food items). These are separate from Food Safety and not typically required for food tenders unless you operate in those specific sectors.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">BRCGS certification cost UK 2026</h2>
          <p className="text-slate-700 leading-relaxed mb-4">BRCGS costs vary significantly based on company size, complexity, and current compliance level. Here's the detailed breakdown:</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Certification Body Audit Fees:**
- Small site (<50 employees): £1,500-£2,500 per audit
- Medium site (50-250 employees): £2,500-£3,500 per audit
- Large site (250+ employees): £3,500-£5,000 per audit
- Multi-site additional: £1,000-£2,000 per additional site</p>
          <p className="text-slate-700 leading-relaxed mb-4">**BRCGS License Fees:**
- BRCGS Participation: £450/year (mandatory)
- BRCGS Directory listing: Included
- Additional modules: £100-£300 each</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Preparation and Consultancy:**
- Gap analysis: £500-£1,500
- Implementation consultancy: £600-£1,200/day
- Internal auditor training: £400-£600 per person
- Documentation templates: £500-£2,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Additional Costs:**
- Pre-audit assessment (recommended): £800-£1,500
- Laboratory testing: £2,000-£10,000/year
- Infrastructure improvements: Variable (often £10,000-£100,000)</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Total Investment Estimates:**
- Year 1 (achieving certification): £10,000-£50,000
- Ongoing annual costs: £3,000-£15,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">The wide range reflects that BRCGS often requires significant infrastructure investment (segregation, metal detection, allergen controls) beyond just the audit costs.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.brcgs.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              BRCGS Official Website
            </a>
            <a href="https://www.supplychain.nhs.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              NHS Supply Chain Food Procurement
            </a>
            <a href="https://www.food.gov.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Food Standards Agency
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is BRCGS mandatory for NHS food suppliers?</h3>
              <p className="text-slate-700 leading-relaxed">Yes, BRCGS Grade A minimum is mandatory for all NHS Supply Chain food framework suppliers. This applies to all product categories from fresh produce to patient nutrition. Service-only contractors (without food handling) may be exempt, but any company supplying food products must have BRCGS certification.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does BRCGS certification cost per year?</h3>
              <p className="text-slate-700 leading-relaxed">BRCGS typically costs £3,000-£15,000 annually for established certified sites (audit plus license fees). First-year costs are higher at £10,000-£50,000 including gap analysis, consultancy, training, and often infrastructure improvements. Large complex sites can exceed these estimates.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What's the difference between BRCGS and SALSA?</h3>
              <p className="text-slate-700 leading-relaxed">BRCGS is the premium standard required by major retailers and large public sector frameworks. SALSA is a more accessible standard for smaller producers, accepted by local authorities and independent retailers. BRCGS is more rigorous and costly but opens more doors. You cannot use SALSA where BRCGS is specified.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How long does it take to get BRCGS certified?</h3>
              <p className="text-slate-700 leading-relaxed">Achieving BRCGS typically takes 6-12 months from start to certification. This includes gap analysis (Month 1), implementation (Months 2-5), internal audits (Month 6), and certification audit. Achieving Grade AA often takes an additional year of continuous improvement after initial certification.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I get BRCGS if I work from home or a small unit?</h3>
              <p className="text-slate-700 leading-relaxed">BRCGS has strict infrastructure requirements that are difficult to meet in home or micro settings. You need dedicated facilities, segregation, pest control, changing facilities, and documented cleaning programmes. Most home-based food businesses choose SALSA instead, which is designed for smaller operations. BRCGS is really for commercial food production facilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/salsa-food-tenders-uk" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Salsa Food Tenders Uk
              </span>
            </Link>
            <Link href="/certifications/smeta-sedex-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Smeta Sedex Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-22000-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 22000 Uk Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With BRCGS?
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
