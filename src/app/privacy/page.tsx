import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'RFP Quest privacy policy. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: February 2025</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              RFP Quest (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at rfp.quest.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              By using RFP Quest, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-medium text-slate-200 mb-3">2.1 Account Information</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Email address (used for authentication and communication)</li>
              <li>Password (securely hashed, never stored in plain text)</li>
              <li>Company profile information you provide (company name, size, sectors, etc.)</li>
            </ul>

            <h3 className="text-xl font-medium text-slate-200 mb-3 mt-6">2.2 Usage Data</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Tenders you view and save</li>
              <li>Search queries and filter preferences</li>
              <li>Feature usage patterns</li>
              <li>Device and browser information</li>
              <li>IP address and approximate location</li>
            </ul>

            <h3 className="text-xl font-medium text-slate-200 mb-3 mt-6">2.3 Tender Data</h3>
            <p className="text-slate-300 leading-relaxed">
              We fetch publicly available UK government tender data from the Find a Tender service. This data is published under the Open Government Licence and is available to the public.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To authenticate your account and secure your data</li>
              <li>To match you with relevant tenders based on your company profile</li>
              <li>To improve and personalise your experience</li>
              <li>To analyse usage patterns and improve our platform</li>
              <li>To send service-related communications</li>
              <li>To respond to your support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Cookies and Tracking</h2>
            <p className="text-slate-300 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li><strong>Essential cookies:</strong> Required for authentication and core functionality</li>
              <li><strong>Preference cookies:</strong> Remember your settings and choices</li>
              <li><strong>Analytics cookies:</strong> Help us understand how you use RFP Quest</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              You can control cookies through your browser settings. Disabling certain cookies may affect your experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Third Parties</h2>
            <p className="text-slate-300 leading-relaxed">
              We work with trusted third-party service providers:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li><strong>Neon:</strong> Database hosting (PostgreSQL)</li>
              <li><strong>Vercel:</strong> Website hosting and deployment</li>
              <li><strong>Railway:</strong> Background service hosting</li>
              <li><strong>OpenAI:</strong> AI-powered analysis features (when used)</li>
              <li><strong>Cloudflare:</strong> Content delivery and security</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              We do not sell your personal information to third parties. Data sharing is limited to what is necessary for service operation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">
              We retain your personal data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Aggregated, anonymised data may be retained indefinitely for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed">
              Under UK GDPR and the Data Protection Act 2018, you have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Erasure:</strong> Delete your account and associated data</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Object:</strong> Object to certain processing activities</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@rfp.quest" className="text-teal-400 hover:text-teal-300">
                privacy@rfp.quest
              </a>
              {' '}or use the account deletion feature in your{' '}
              <Link href="/dashboard/settings" className="text-teal-400 hover:text-teal-300">
                account settings
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement appropriate technical and organisational measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure password hashing</li>
              <li>Regular security updates and monitoring</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              RFP Quest is not intended for users under 18. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none text-slate-300 space-y-2 mt-4">
              <li>
                Email:{' '}
                <a href="mailto:privacy@rfp.quest" className="text-teal-400 hover:text-teal-300">
                  privacy@rfp.quest
                </a>
              </li>
              <li>
                Website:{' '}
                <a href="https://rfp.quest" className="text-teal-400 hover:text-teal-300">
                  rfp.quest
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link
            href="/"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            &larr; Back to RFP Quest
          </Link>
        </div>
      </div>
    </div>
  );
}
