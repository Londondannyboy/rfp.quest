import Link from 'next/link';

interface CTABannerProps {
  title: string;
  subtitle?: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  variant?: 'gradient' | 'dark' | 'light';
}

export function CTABanner({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  variant = 'gradient',
}: CTABannerProps) {
  const variantClasses = {
    gradient: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950',
    dark: 'bg-slate-900',
    light: 'bg-slate-50',
  };

  const textClasses = {
    gradient: {
      title: 'text-white',
      subtitle: 'text-slate-300',
    },
    dark: {
      title: 'text-white',
      subtitle: 'text-slate-400',
    },
    light: {
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
    },
  };

  const buttonClasses = {
    gradient: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30',
      secondary: 'border-2 border-slate-500 bg-slate-900/50 text-slate-100 hover:border-blue-400 hover:text-blue-300 hover:bg-blue-950/30 backdrop-blur-sm',
    },
    dark: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/25',
      secondary: 'border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-blue-400',
    },
    light: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/25',
      secondary: 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-blue-400',
    },
  };

  return (
    <section className={`relative py-16 md:py-24 ${variantClasses[variant]} overflow-hidden`}>
      {/* Modern decorative background elements */}
      {variant === 'gradient' && (
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          {/* Glass morphism decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-slate-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/20 to-slate-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          {/* Additional floating elements */}
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-slate-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Modern content card for light/dark variants */}
        <div className={`${variant !== 'gradient' ? 'bg-slate-900/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 ring-1 ring-slate-700/50 shadow-2xl shadow-blue-900/20' : ''}`}>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-[1.1] ${textClasses[variant].title}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${textClasses[variant].subtitle}`}>
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {primaryCta.href.startsWith('http') ? (
              <a
                href={primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${buttonClasses[variant].primary}`}
              >
                {primaryCta.text}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            ) : (
              <Link
                href={primaryCta.href}
                className={`group inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${buttonClasses[variant].primary}`}
              >
                {primaryCta.text}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={`group inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${buttonClasses[variant].secondary}`}
              >
                {secondaryCta.text}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            )}
          </div>
          
          {/* Enhanced related resources section */}
          <div className="pt-8 border-t border-slate-700/50">
            <p className={`text-sm leading-relaxed ${textClasses[variant].subtitle}`}>
              Discover our <a href="/" className="text-blue-400 underline font-semibold hover:no-underline hover:text-blue-300 transition-colors">RFP software</a> for AI-powered bid management. Looking for go-to-market support? Check out the leading <a href="https://gtm.quest/best-gtm-agency-top-gtm-agencies" className="text-blue-400 underline font-semibold hover:no-underline hover:text-blue-300 transition-colors">GTM agency</a> for B2B growth strategies alongside your RFP management needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
