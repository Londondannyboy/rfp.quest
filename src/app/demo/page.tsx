import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Book a Demo | rfp.quest - AI RFP Software',
  description: 'See rfp.quest in action. Book a personalised demo of our AI-powered RFP and tender management software for UK procurement teams.',
  alternates: {
    canonical: 'https://rfp.quest/demo',
  },
};

export default function DemoPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/30/50 dark:bg-blue-950/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/30/30 dark:bg-blue-950/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 dark:bg-blue-950/50 text-blue-300 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/80 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500/100"></span>
                </span>
                Launching Q2 2026
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-slate-100 dark:text-white leading-[1.1]">
                See rfp.quest
                <span className="block text-blue-400 dark:text-blue-400">in Action</span>
              </h1>

              <p className="text-xl text-slate-300 dark:text-slate-400 mb-8 leading-relaxed">
                Book a personalised walkthrough and discover how AI can transform your tender management process.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'See how AI extracts requirements from tender documents',
                  'Learn how to build compliant responses faster',
                  'Explore team collaboration features',
                  'Ask questions specific to your workflow',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-400 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300 dark:text-slate-400">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-slate-400 dark:text-slate-400">
                30-minute session. No sales pressure. Just an honest look at how we can help.
              </p>
            </div>

            {/* Right Column - Form */}
            <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-slate-600/50 dark:border-slate-300/50">
              <h2 className="text-2xl font-bold text-slate-100 dark:text-white mb-6">
                Book Your Demo
              </h2>

              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 dark:text-slate-400 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border-slate-600/50 dark:border-slate-400/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-700 text-slate-100 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 dark:text-slate-400 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border-slate-600/50 dark:border-slate-400/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-700 text-slate-100 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 dark:text-slate-400 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-slate-600/50 dark:border-slate-400/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-700 text-slate-100 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 dark:text-slate-400 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full px-4 py-3 border-slate-600/50 dark:border-slate-400/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-700 text-slate-100 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="tenderVolume" className="block text-sm font-medium text-slate-300 dark:text-slate-400 mb-1">
                    How many tenders do you respond to per month?
                  </label>
                  <select
                    id="tenderVolume"
                    name="tenderVolume"
                    className="w-full px-4 py-3 border-slate-600/50 dark:border-slate-400/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-700 text-slate-100 dark:text-white"
                  >
                    <option value="">Select...</option>
                    <option value="1-5">1-5 per month</option>
                    <option value="6-10">6-10 per month</option>
                    <option value="11-20">11-20 per month</option>
                    <option value="20+">20+ per month</option>
                    <option value="varies">It varies</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 dark:text-slate-400 mb-1">
                    What would you like to see? (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Tell us about your current challenges..."
                    className="w-full px-4 py-3 border-slate-600/50 dark:border-slate-400/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-700 text-slate-100 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-blue-800 hover:bg-blue-800/90 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                >
                  Request Demo
                </button>
              </form>

              <p className="mt-4 text-xs text-slate-400 dark:text-slate-400 text-center">
                We&apos;ll be in touch within 24 hours to schedule your demo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - What to Expect */}
      <section className="py-16 md:py-24 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-100 dark:text-white mb-12">
            What to Expect in Your Demo
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900/30 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 dark:text-white mb-2">
                Discovery
              </h3>
              <p className="text-slate-300 dark:text-slate-400">
                We&apos;ll learn about your current tender process and the challenges you face.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900/30 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400 dark:text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 dark:text-white mb-2">
                Live Walkthrough
              </h3>
              <p className="text-slate-300 dark:text-slate-400">
                See the platform in action with examples relevant to your industry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900/30 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400 dark:text-blue-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 dark:text-white mb-2">
                Q&amp;A
              </h3>
              <p className="text-slate-300 dark:text-slate-400">
                Get answers to your questions and discuss how rfp.quest fits your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 dark:text-white mb-4">
            Not Ready for a Demo?
          </h2>
          <p className="text-lg text-slate-300 dark:text-slate-400 mb-8">
            Join our waitlist to be notified when we launch and get early access.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600/50 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200"
          >
            Join the Waitlist Instead
          </Link>
        </div>
      </section>
    </>
  );
}
