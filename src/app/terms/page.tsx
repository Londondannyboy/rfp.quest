import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'RFP Platform Quest terms of service. Read our terms and conditions for using the platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: April 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              Welcome to RFP Platform Quest. By accessing or using our platform at rfp.quest, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our service.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              We may update these Terms from time to time. Continued use of RFP Platform Quest after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Service Description</h2>
            <p className="text-slate-300 leading-relaxed">
              RFP Platform Quest is a tender analysis and bid management platform that helps UK businesses discover and respond to government procurement opportunities. Our services include:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Access to UK government tender listings</li>
              <li>Tender search and filtering</li>
              <li>Company profile matching</li>
              <li>AI-powered tender analysis (where applicable)</li>
              <li>Bid management tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
            <p className="text-slate-300 leading-relaxed">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorised access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. User Responsibilities</h2>
            <p className="text-slate-300 leading-relaxed">
              When using RFP Platform Quest, you agree not to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Scrape, mine, or extract data without permission</li>
              <li>Share your account credentials with others</li>
              <li>Submit false or misleading information</li>
              <li>Use automated systems without authorisation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Tender Data</h2>
            <p className="text-slate-300 leading-relaxed">
              RFP Platform Quest aggregates publicly available tender data from UK government sources, including Find a Tender and Contracts Finder. This data is:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Published under the Open Government Licence</li>
              <li>Provided &quot;as is&quot; without warranty of accuracy</li>
              <li>Subject to change without notice</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              We are not responsible for errors or omissions in the source data. Always verify tender details with the official source before submitting bids.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
            <p className="text-slate-300 leading-relaxed">
              The RFP Platform Quest platform, including its design, features, and content (excluding government tender data), is owned by us and protected by intellectual property laws.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              You retain ownership of any content you create or upload to RFP Platform Quest, such as company profiles and bid documents. By using our service, you grant us a licence to use this content solely for providing our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. AI-Powered Features</h2>
            <p className="text-slate-300 leading-relaxed">
              Some features of RFP Platform Quest use artificial intelligence. You acknowledge that:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>AI-generated content is provided for assistance only</li>
              <li>You are responsible for reviewing and verifying AI outputs</li>
              <li>AI analysis should not replace professional advice</li>
              <li>We do not guarantee the accuracy of AI-generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Service Availability</h2>
            <p className="text-slate-300 leading-relaxed">
              We strive to maintain high availability but do not guarantee uninterrupted access. We may:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Perform maintenance with or without notice</li>
              <li>Modify or discontinue features</li>
              <li>Experience outages beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>RFP Platform Quest is provided &quot;as is&quot; without warranties of any kind</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>We are not responsible for lost bids, missed opportunities, or business losses</li>
              <li>Our total liability is limited to the amount you paid us in the past 12 months</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Nothing in these Terms excludes liability for death, personal injury, or fraud.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Account Deletion</h2>
            <p className="text-slate-300 leading-relaxed">
              You may delete your account at any time through your{' '}
              <Link href="/dashboard/settings" className="text-teal-400 hover:text-teal-300">
                account settings
              </Link>
              . Upon deletion:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Your personal data will be permanently removed</li>
              <li>Your company profile and preferences will be deleted</li>
              <li>This action cannot be undone</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              We may retain certain data as required by law or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Termination</h2>
            <p className="text-slate-300 leading-relaxed">
              We may suspend or terminate your access to RFP Platform Quest at any time, with or without cause, including for:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Extended periods of inactivity</li>
              <li>Non-payment of applicable fees</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Severability</h2>
            <p className="text-slate-300 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-none text-slate-300 space-y-2 mt-4">
              <li>
                Email:{' '}
                <a href="mailto:legal@rfp.quest" className="text-teal-400 hover:text-teal-300">
                  legal@rfp.quest
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

        <div className="mt-12 pt-8 border-t border-slate-800 flex gap-6">
          <Link
            href="/"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            &larr; Back to RFP Platform Quest
          </Link>
          <Link
            href="/privacy"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
