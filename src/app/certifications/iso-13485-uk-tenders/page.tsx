import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ISO 13485 UK NHS Tenders: Medical Device Cert Guide 2026',
  description: 'ISO 13485 is mandatory for all medical device suppliers to the NHS and UK healthcare sector. UKCA marking, MDR compliance and tender requirements guide.',
  openGraph: {
    title: 'ISO 13485 UK NHS Tenders: Medical Device Cert Guide 2026',
    description: 'ISO 13485 is mandatory for all medical device suppliers to the NHS and UK healthcare sector. UKCA marking, MDR compliance and tender requirements guide.',
    type: 'article',
  },
}

export default function /iso13485UkTendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":"ISO 13485 for UK NHS and Medical Tenders: Certification Guide 2026","description":"ISO 13485 is mandatory for all medical device suppliers to the NHS and UK healthcare sector. UKCA marking, MDR compliance and tender requirements guide.","author":{"@type":"Organization","name":"rfp.quest"},"publisher":{"@type":"Organization","name":"rfp.quest","logo":{"@type":"ImageObject","url":"https://rfp.quest/logo.png"}},"datePublished":"2026-03-20T14:59:22.581Z","dateModified":"2026-03-20T14:59:22.581Z"}) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is ISO 13485 mandatory for all NHS medical device suppliers?","acceptedAnswer":{"@type":"Answer","text":"Yes, ISO 13485 is mandatory for virtually all NHS medical device suppliers. NHS Supply Chain frameworks explicitly require it, regardless of device classification. Even Class I (low risk) device suppliers need ISO 13485 for NHS contracts, though it's not legally required for UKCA marking of Class I devices."}},{"@type":"Question","name":"What's the difference between ISO 13485 and ISO 9001?","acceptedAnswer":{"@type":"Answer","text":"ISO 13485 is specifically for medical devices with additional requirements for design controls, risk management, regulatory compliance, and traceability. ISO 9001 is for general quality management. You cannot substitute ISO 9001 for ISO 13485 in medical device tenders - they're different standards with different regulatory recognition."}},{"@type":"Question","name":"How much does ISO 13485 certification cost in the UK?","acceptedAnswer":{"@type":"Answer","text":"ISO 13485 typically costs £3,000-£6,000 for small companies with simple devices, £6,000-£12,000 for medium companies, and £12,000-£25,000 for large companies or complex devices in Year 1. Annual surveillance adds £1,500-£3,000. These costs exclude any product testing or regulatory submission fees."}},{"@type":"Question","name":"Do digital health apps need ISO 13485?","acceptedAnswer":{"@type":"Answer","text":"Digital health apps need ISO 13485 if they qualify as medical devices (Software as Medical Device - SaMD). This includes apps that diagnose conditions, calculate treatment doses, or influence clinical decisions. Wellness apps without medical claims don't need ISO 13485. When in doubt, MHRA provides classification guidance."}},{"@type":"Question","name":"Can I use CE marking instead of UKCA for NHS supplies?","acceptedAnswer":{"@type":"Answer","text":"CE marking is accepted alongside UKCA until 30 June 2028. After this date, only UKCA marking will be valid for the UK market. NHS buyers accept both currently, but planning for UKCA transition is essential. ISO 13485 certification supports both marking schemes."}}]}) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/certifications" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Certifications Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ISO 13485 for UK NHS and Medical Tenders: Certification Guide 2026
          </h1>
          <p className="text-xl text-slate-600">
            ISO 13485 is mandatory for all medical device suppliers to the NHS and UK healthcare sector. UKCA marking, MDR compliance and tender requirements guide.
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
                <span>ISO 13485: Quality management for medical devices</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Mandatory for NHS medical device suppliers</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Links to UKCA marking requirements</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Regulated by MHRA</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Cost: £3,000-£15,000 Year 1</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Timeline: 6-12 months</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Required for all device classifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Covers full product lifecycle</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is ISO 13485 and when is it required?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">ISO 13485:2016 is the international standard for quality management systems specific to medical devices. Unlike ISO 9001 which covers general quality management, ISO 13485 is tailored to the unique regulatory requirements of medical device design, development, production, installation, and servicing.</p>
          <p className="text-slate-700 leading-relaxed mb-4">In the UK, ISO 13485 is effectively mandatory for any organisation involved in the medical device supply chain. This includes manufacturers, importers, distributors, and service providers. The standard is recognised by the MHRA (Medicines and Healthcare products Regulatory Agency) as demonstrating compliance with UK MDR 2002 (Medical Devices Regulations) and the new UKCA (UK Conformity Assessed) marking requirements.</p>
          <p className="text-slate-700 leading-relaxed mb-4">For NHS procurement, ISO 13485 is explicitly required in tender specifications for medical devices, medical equipment maintenance, medical device distribution, and increasingly for digital health products that qualify as medical devices. Without ISO 13485, you cannot participate in NHS Supply Chain medical device frameworks or supply medical devices to any UK healthcare organisation.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">ISO 13485 and UKCA marking requirements</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Since Brexit, the UK has its own medical device regulatory framework with UKCA marking replacing CE marking. ISO 13485 certification is a cornerstone of UKCA compliance.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**UKCA timeline:**
CE marks are accepted until 30 June 2028 (extended from 2024). After this date, all medical devices need UKCA marking for the UK market. ISO 13485 certification from a UK-recognised body is essential for UKCA marking.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**How ISO 13485 supports UKCA:**
The standard provides the quality management system framework required by UK regulations. Your ISO 13485 certificate demonstrates to MHRA and Approved Bodies that you have adequate quality systems. Technical documentation required for UKCA builds on ISO 13485 processes. Post-market surveillance requirements in ISO 13485 align with UKCA obligations.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Classification matters:**
Class I devices (low risk): ISO 13485 recommended but not legally required. Class IIa/IIb devices (medium risk): ISO 13485 effectively mandatory. Class III devices (high risk): ISO 13485 absolutely mandatory. In vitro diagnostic devices: ISO 13485 required for all but Class A.</p>
          <p className="text-slate-700 leading-relaxed mb-4">NHS procurement typically requires ISO 13485 regardless of classification, as it demonstrates professional capability.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">NHS Supply Chain medical device requirements</h2>
          <p className="text-slate-700 leading-relaxed mb-4">NHS Supply Chain manages national procurement for medical devices across multiple frameworks. ISO 13485 is a fundamental requirement across all medical device categories.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**NHS Supply Chain frameworks requiring ISO 13485:**
Capital Equipment Solutions (imaging, surgical equipment), Patient Safety Products (sharps, infection control), Wound Care and Continence, Rehabilitation and Therapy Products, Diagnostic Products and Services, Digital Health and Software as Medical Device (SaMD).</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Additional NHS requirements beyond ISO 13485:**
Clinical evidence and NICE compliance, NHS sustainability requirements (carbon footprint), Social value commitments, Cyber security for connected devices (often ISO 27001), Business continuity planning (sometimes ISO 22301), Modern Slavery Act compliance.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Evaluation criteria:**
ISO 13485 is typically a pass/fail requirement - without it, your bid won't be evaluated. However, the maturity of your quality system can score points. Demonstrating excellence beyond basic compliance (e.g., advanced risk management, robust post-market surveillance) can differentiate your bid.</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Digital health and Software as Medical Device (SaMD)</h2>
          <p className="text-slate-700 leading-relaxed mb-4">The intersection of ISO 13485 with digital health is increasingly important as more software qualifies as a medical device.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**When software needs ISO 13485:**
Software that diagnoses, treats, or monitors medical conditions qualifies as SaMD. This includes clinical decision support systems, diagnostic algorithms, treatment planning software, remote patient monitoring platforms, and some health apps. If your software makes medical claims or influences clinical decisions, it likely needs ISO 13485.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**ISO 13485 for software companies:**
Traditional software companies often struggle with ISO 13485 as it was written for physical devices. Key challenges include: design controls and documentation requirements, risk management per ISO 14971, clinical evaluation of algorithms, post-market surveillance for software, cybersecurity integration with quality systems.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**NHS Digital Health Frameworks:**
The NHS increasingly procures digital health through specific frameworks. These require both ISO 13485 (for the medical device aspect) and often ISO 27001 (for information security) plus compliance with NHS Digital clinical safety standards (DCB0129/DCB0160).</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cost and timeline for ISO 13485 certification</h2>
          <p className="text-slate-700 leading-relaxed mb-4">ISO 13485 costs vary significantly based on company size, device classification, and existing quality systems.</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Certification costs (Year 1):**
- Small company (Class I devices): £3,000-£6,000
- Medium company (Class II devices): £6,000-£12,000
- Large company (Class III devices): £12,000-£25,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Cost breakdown:**
- Gap analysis: £1,500-£3,000
- QMS documentation: £2,000-£5,000
- Consultant support: £600-£1,200/day (typically 10-30 days)
- Training (lead auditor): £1,500-£2,500
- Stage 1 & 2 audit: £3,000-£8,000
- Annual surveillance: £1,500-£3,000</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Implementation timeline:**
Months 1-2: Gap analysis and planning
Months 3-4: QMS documentation development
Months 5-6: Design controls implementation
Months 7-8: Risk management system (ISO 14971)
Months 9-10: Internal audit and management review
Months 11-12: Certification audit</p>
          <p className="text-slate-700 leading-relaxed mb-4">**Critical success factors:**
Having technical documentation ready accelerates certification. Companies with ISO 9001 can upgrade faster (typically 6-9 months). Software companies often need longer due to design control requirements.</p>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">External Resources</h2>
          <div className="space-y-3">
            
            <a href="https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              MHRA Medical Devices Regulation
            </a>
            <a href="https://www.supplychain.nhs.uk" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              NHS Supply Chain
            </a>
            <a href="https://www.iso.org/standard/59752.html" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-2">🔗</span>
              ISO 13485 Standard Information
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
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is ISO 13485 mandatory for all NHS medical device suppliers?</h3>
              <p className="text-slate-700 leading-relaxed">Yes, ISO 13485 is mandatory for virtually all NHS medical device suppliers. NHS Supply Chain frameworks explicitly require it, regardless of device classification. Even Class I (low risk) device suppliers need ISO 13485 for NHS contracts, though it's not legally required for UKCA marking of Class I devices.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What's the difference between ISO 13485 and ISO 9001?</h3>
              <p className="text-slate-700 leading-relaxed">ISO 13485 is specifically for medical devices with additional requirements for design controls, risk management, regulatory compliance, and traceability. ISO 9001 is for general quality management. You cannot substitute ISO 9001 for ISO 13485 in medical device tenders - they're different standards with different regulatory recognition.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How much does ISO 13485 certification cost in the UK?</h3>
              <p className="text-slate-700 leading-relaxed">ISO 13485 typically costs £3,000-£6,000 for small companies with simple devices, £6,000-£12,000 for medium companies, and £12,000-£25,000 for large companies or complex devices in Year 1. Annual surveillance adds £1,500-£3,000. These costs exclude any product testing or regulatory submission fees.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Do digital health apps need ISO 13485?</h3>
              <p className="text-slate-700 leading-relaxed">Digital health apps need ISO 13485 if they qualify as medical devices (Software as Medical Device - SaMD). This includes apps that diagnose conditions, calculate treatment doses, or influence clinical decisions. Wellness apps without medical claims don't need ISO 13485. When in doubt, MHRA provides classification guidance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I use CE marking instead of UKCA for NHS supplies?</h3>
              <p className="text-slate-700 leading-relaxed">CE marking is accepted alongside UKCA until 30 June 2028. After this date, only UKCA marking will be valid for the UK market. NHS buyers accept both currently, but planning for UKCA transition is essential. ISO 13485 certification supports both marking schemes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Certifications */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link href="/certifications/iso-9001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 9001 Uk Tenders
              </span>
            </Link>
            <Link href="/certifications/dsp-toolkit-nhs-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Dsp Toolkit Nhs Tenders
              </span>
            </Link>
            <Link href="/certifications/iso-27001-uk-tenders" 
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Iso 27001 Uk Tenders
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help With ISO?
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
