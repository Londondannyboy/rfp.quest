import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Free Trial | rfp.quest - AI RFP Software',
  description: 'Join the waitlist for rfp.quest - launching Q1 2026. Get early access to AI-powered RFP and tender management software built for UK procurement teams.',
  alternates: {
    canonical: 'https://rfp.quest/signup',
  },
};

export default function SignupPage() {
  return (
    <>
      {/* Hero Section */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Launching Q1 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Get Early Access to
              <span className="block text-teal-600 dark:text-teal-400">rfp.quest</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Join the waitlist for AI-powered RFP and tender management software designed specifically for UK procurement teams.
            </p>

            {/* Signup Form */}
            <div className="max-w-md mx-auto">
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your work email"
                    required
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 text-lg"
                >
                  Join the Waitlist
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                No spam, ever. We&apos;ll only email you about launch updates and early access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Early Access Includes
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                14-Day Free Trial
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Full access to all features during launch. No credit card required to start.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Launch Pricing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Early adopters get exclusive pricing locked in for life. Join early to save.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Priority Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Direct access to our team during beta. Your feedback shapes the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Built for UK Procurement
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
            AI-powered features designed to help you win more public and private sector bids.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI Tender Analysis', desc: 'Automatic extraction of requirements, deadlines, and scoring criteria' },
              { title: 'Smart Response Builder', desc: 'AI-assisted writing with UK procurement best practices' },
              { title: 'Content Library', desc: 'Reusable answer banks and case studies for faster responses' },
              { title: 'Compliance Checker', desc: 'Ensure your submission meets all mandatory requirements' },
              { title: 'Team Collaboration', desc: 'Assign sections, track progress, and review together' },
              { title: 'Find a Tender Integration', desc: 'Direct import from UK government procurement portals' },
              { title: 'Deadline Tracking', desc: 'Never miss a submission deadline with smart reminders' },
              { title: 'Analytics Dashboard', desc: 'Track your win rates and identify improvement areas' },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-teal-600 dark:bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Be First in Line
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join UK businesses preparing to transform their bid management process.
          </p>
          <a
            href="#top"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
          >
            Join the Waitlist
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
