import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'G-Cloud UK Digital Tenders: Supplier Registration Guide 2026',
  description: 'G-Cloud 15 is the primary route to selling cloud and digital services to UK government. Cyber Essentials mandatory. Complete supplier registration guide.',
  openGraph: {
    title: 'G-Cloud UK Digital Tenders: Supplier Registration Guide 2026',
    description: 'G-Cloud 15 is the primary route to selling cloud and digital services to UK government. Cyber Essentials mandatory. Complete supplier registration guide.',
    type: 'article',
  },
}

export default function /gCloudUkDigitalTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"G-Cloud for UK Digital Tenders: Supplier Registration Guide 2026","description":"G-Cloud 15 is the primary route to selling cloud and digital services to UK government. Cyber Essentials mandatory. Complete supplier registration guide.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T12:03:17.891Z","dateModified":"2026-03-20T12:03:17.891Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is G-Cloud mandatory for selling to UK government?","acceptedAnswer":{"@type":"Answer","text":"While not legally mandatory, G-Cloud is effectively required for most government cloud sales. Procurement rules direct buyers to use G-Cloud for cloud services under £20m. Without it, you're excluded from Digital Marketplace where most opportunities are advertised. Direct awards outside frameworks are rare and heavily scrutinised."}},{"@type":"Question","name":"How much does it cost to join G-Cloud?","acceptedAnswer":{"@type":"Answer","text":"G-Cloud application is free - no fees to CCS. However, you need Cyber Essentials (£350-£600), insurances (£1,000-£5,000/year), and potentially ISO 27001 (£3,000-£10,000) depending on services. Time investment is significant: expect 40-80 hours preparing service descriptions. No commission on sales but monthly reporting required."}},{"@type":"Question","name":"When can I apply for G-Cloud?","acceptedAnswer":{"@type":"Answer","text":"G-Cloud opens annually, typically September/October for 4-6 weeks. G-Cloud 15 runs through 2026; G-Cloud 16 applications expected September 2026. You cannot join mid-cycle - missing the window means waiting a full year. Monitor Crown Commercial Service announcements from August. Have Cyber Essentials ready before the window opens."}},{"@type":"Question","name":"Can foreign companies apply for G-Cloud?","acceptedAnswer":{"@type":"Answer","text":"Companies must be legally established in the UK (registered at Companies House) or be a Crown body. Foreign parents are fine, but you need a UK entity. You also need UK bank accounts for payment and UK-based support during UK business hours. Data residency requirements may apply depending on services offered."}},{"@type":"Question","name":"What happens if my G-Cloud application is rejected?","acceptedAnswer":{"@type":"Answer","text":"Rejection means waiting until next year's application window - there's no appeals process or mid-cycle entry. Common rejection reasons: expired Cyber Essentials, incomplete service descriptions, wrong lot classification. CCS provides feedback on rejections. You can reapply next cycle after addressing issues. Meanwhile, consider subcontracting to existing G-Cloud suppliers."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            G-Cloud for UK Digital Tenders: Supplier Registration Guide 2026
          </h1>
          <p className="text-xl text-slate-600">
            G-Cloud 15 is the primary route to selling cloud and digital services to UK government. Cyber Essentials mandatory. Complete supplier registration guide.
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
                <span>G-Cloud is a CCS framework, not a certification</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Current iteration: G-Cloud 15 (2026)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Cyber Essentials mandatory for most lots</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Three lots: Cloud Hosting, Cloud Software, Cloud Support</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Worth £multi-billions in government spend</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Annual application windows</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Free to apply but competitive</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Gateway to government digital contracts</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is G-Cloud and why does it matter?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">G-Cloud is the UK government's primary procurement framework for cloud computing services. Managed by Crown Commercial Service (CCS), it's not a certification but a commercial framework that pre-approves suppliers to sell cloud services to the public sector. Being on G-Cloud is essentially mandatory for selling digital services to UK government.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The framework exists because traditional procurement was too slow for cloud services. Instead of running separate tenders for every cloud purchase, public sector buyers can select from pre-approved G-Cloud suppliers through the Digital Marketplace. This reduces procurement time from months to weeks while ensuring suppliers meet government standards.</p>
          <p className="text-slate-700 leading-relaxed mb-4">G-Cloud opens doors to the entire UK public sector: central government departments, NHS trusts, local authorities, emergency services, schools, and arm's length bodies. Without G-Cloud, you're excluded from most government cloud opportunities as buyers are directed to use the framework for all cloud purchases under £20 million. The framework represents billions in annual government cloud spend.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">G-Cloud 15 requirements and application process</h2>
          <p className="text-slate-700 leading-relaxed mb-4">G-Cloud 15 (current as of 2026) has specific requirements that suppliers must meet. Understanding these is crucial for successful application.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Mandatory Requirements (all suppliers):**
- UK registered company or public body
- Cyber Essentials certification (must be valid at application)
- Public liability insurance (minimum £1m)
- Professional indemnity insurance (minimum £1m)
- GDPR compliance documentation
- Modern Slavery statement (if turnover >£36m)
- Service descriptions meeting CCS standards</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Lot-Specific Requirements:**
- Cloud Hosting: ISO 27001 often required, data centre locations must be specified
- Cloud Software: WCAG 2.1 AA accessibility for user-facing services
- Cloud Support: May need ISO 20000 for managed services</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Application Process:**
G-Cloud opens annually (typically September/October) for 4-6 weeks. You submit service descriptions through the Digital Marketplace Supplier portal. Each service needs detailed specifications including pricing, security standards, support levels, and terms. CCS reviews applications for compliance, not quality - if you meet requirements, you're approved.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Common Rejection Reasons:**
- Expired Cyber Essentials certificate
- Incomplete service descriptions
- Non-compliant pricing (must include all costs)
- Missing insurance evidence
- Vague security assertions</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">G-Cloud lots explained: Hosting, Software, Support</h2>
          <p className="text-slate-700 leading-relaxed mb-4">G-Cloud divides services into three lots. Choosing the right lot(s) is crucial for success.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Lot 1 - Cloud Hosting:**
Infrastructure and platform services including IaaS, PaaS, Content Delivery Networks, storage, compute, and network services. This is for raw infrastructure - servers, databases, storage, platforms. Examples: AWS, Azure, Google Cloud resellers, UK hosting providers, specialist government cloud platforms. Buyers use this for infrastructure to build or host their applications.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Lot 2 - Cloud Software:**
Finished software applications delivered as SaaS, including CRM systems, HR software, finance applications, collaboration tools, specialist government applications. This is for ready-to-use applications accessed via browser or API. If users log in and use your application directly, it's Cloud Software.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Lot 3 - Cloud Support:**
Professional services supporting cloud adoption including migration services, optimisation, training, managed services, DevOps support. This is for human expertise around cloud services. Often purchased alongside Lots 1 or 2 for implementation.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Which lot(s) should you apply for?**
Apply only for lots matching your actual services. Many suppliers offer services across multiple lots - that's fine, but each service must be in the correct lot. Putting services in wrong lots causes rejection. When in doubt, CCS provides classification guidance during application windows.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Digital Marketplace and call-off process</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Once on G-Cloud, you sell through the Digital Marketplace, the government's online catalogue for cloud services. Understanding how buyers use it is crucial for winning business.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**How buyers find services:**
Buyers search the Digital Marketplace using keywords and filters (price, security levels, support, features). Your service descriptions become your shop window - they must be clear, keyword-optimised, and specification-rich. Poor descriptions mean no visibility, regardless of service quality.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**The call-off process:**
1. Buyer searches Digital Marketplace for services meeting their needs
2. Creates shortlist based on service descriptions and pricing
3. May request clarifications through the messaging system
4. Awards contract based on catalogue information (no separate tender)
5. Contract formed using G-Cloud terms (you can't change these)</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Pricing and commercial terms:**
Your prices are publicly visible and must include all costs - no hidden fees. You can't negotiate prices after listing (though you can reduce them annually). Payment terms are fixed at 30 days. G-Cloud takes no commission but you must report monthly sales to CCS.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Competition on G-Cloud:**
With 5000+ suppliers, standing out requires excellent service descriptions, competitive pricing, relevant case studies, and security credentials beyond minimum requirements. Many buyers filter by advanced certifications (ISO 27001, ISO 22301) even when not mandatory.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Beyond G-Cloud: DOS, Crown Marketplace, and other frameworks</h2>
          <p className="text-slate-700 leading-relaxed mb-4">While G-Cloud is the largest, understanding related frameworks maximises opportunities.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Digital Outcomes and Specialists (DOS) - Now Closed:**
DOS was for digital specialists and projects but closed in 2023, replaced by new frameworks. If you provided developers, designers, or delivery managers, you now need alternative routes like Crown Marketplace or direct appointment under IR35 rules.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Crown Marketplace:**
The new platform replacing various professional services frameworks. Unlike G-Cloud's catalogue model, Crown Marketplace uses dynamic purchasing for complex requirements. You may need both G-Cloud (for products) and Crown Marketplace (for services).</p>
          <p className="text-slate-700 leading-relaxed mb-4">**NHS Frameworks:**
NHS has separate frameworks through NHS Shared Business Services. While NHS bodies can use G-Cloud, specialist health frameworks like Health Systems Support Framework offer NHS-specific terms and requirements.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Vertical Integration:**
Successful government suppliers often maintain presence across multiple frameworks. G-Cloud for cloud services, Crown Marketplace for professional services, specialist frameworks for vertical sectors. This maximises opportunity visibility and allows bundled solutions.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.digitalmarketplace.service.gov.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Digital Marketplace
            </a>
            <a href="https://www.crowncommercial.gov.uk/agreements/RM1557.13" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              Crown Commercial Service G-Cloud
            </a>
            <a href="https://www.gov.uk/guidance/g-cloud-suppliers-guide" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              G-Cloud Supplier Guidance
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is G-Cloud mandatory for selling to UK government?</h3>
              <p className="text-slate-700 leading-relaxed">While not legally mandatory, G-Cloud is effectively required for most government cloud sales. Procurement rules direct buyers to use G-Cloud for cloud services under £20m. Without it, you're excluded from Digital Marketplace where most opportunities are advertised. Direct awards outside frameworks are rare and heavily scrutinised.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does it cost to join G-Cloud?</h3>
              <p className="text-slate-700 leading-relaxed">G-Cloud application is free - no fees to CCS. However, you need Cyber Essentials (£350-£600), insurances (£1,000-£5,000/year), and potentially ISO 27001 (£3,000-£10,000) depending on services. Time investment is significant: expect 40-80 hours preparing service descriptions. No commission on sales but monthly reporting required.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">When can I apply for G-Cloud?</h3>
              <p className="text-slate-700 leading-relaxed">G-Cloud opens annually, typically September/October for 4-6 weeks. G-Cloud 15 runs through 2026; G-Cloud 16 applications expected September 2026. You cannot join mid-cycle - missing the window means waiting a full year. Monitor Crown Commercial Service announcements from August. Have Cyber Essentials ready before the window opens.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can foreign companies apply for G-Cloud?</h3>
              <p className="text-slate-700 leading-relaxed">Companies must be legally established in the UK (registered at Companies House) or be a Crown body. Foreign parents are fine, but you need a UK entity. You also need UK bank accounts for payment and UK-based support during UK business hours. Data residency requirements may apply depending on services offered.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What happens if my G-Cloud application is rejected?</h3>
              <p className="text-slate-700 leading-relaxed">Rejection means waiting until next year's application window - there's no appeals process or mid-cycle entry. Common rejection reasons: expired Cyber Essentials, incomplete service descriptions, wrong lot classification. CCS provides feedback on rejections. You can reapply next cycle after addressing issues. Meanwhile, consider subcontracting to existing G-Cloud suppliers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/cyber-essentials-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Cyber Essentials Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-27001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 27001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/ccs-frameworks-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Ccs Frameworks Uk Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With G-Cloud?
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
