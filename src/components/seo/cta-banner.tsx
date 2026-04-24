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
    <section className={`relative py-20 md:py-28 ${variantClasses[variant]} overflow-hidden`}>
      {/* Enhanced modern decorative background elements */}
      {variant === 'gradient' && (
        <div className="absolute inset-0">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
          
          {/* Premium glass morphism decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-slate-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-600/20 to-slate-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          
          {/* Floating orbital elements */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-2/3 left-2/3 w-24 h-24 bg-blue-400/15 rounded-full blur-xl animate-pulse delay-500" />
          
          {/* Particle effects */}
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-700 opacity-50"></div>
          <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-300 opacity-70"></div>
        </div>
      )}

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        {/* Premium glass morphism content container */}
        <div className={`${variant === 'gradient' ? 'bg-slate-900/60 backdrop-blur-xl rounded-3xl p-10 md:p-16 ring-1 ring-slate-700/50 shadow-2xl shadow-blue-900/20 border border-slate-800/50' : variant !== 'gradient' ? 'bg-slate-900/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 ring-1 ring-slate-700/50 shadow-2xl shadow-blue-900/20' : ''}`}>
          
          {/* Top accent decoration */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-80"></div>
          </div>

          {/* Enhanced title with gradient text effect */}
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-[1.1] ${variant === 'gradient' ? 'bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent' : textClasses[variant].title}`}>
            {title}
          </h2>
          
          {subtitle && (
            <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${textClasses[variant].subtitle}`}>
              {subtitle}
            </p>
          )}
          
          {/* Enhanced CTA buttons with better styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            {primaryCta.href.startsWith('http') ? (
              <a
                href={primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${buttonClasses[variant].primary}`}
              >
                {/* Button inner glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10">{primaryCta.text}</span>
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            ) : (
              <Link
                href={primaryCta.href}
                className={`group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${buttonClasses[variant].primary}`}
              >
                {/* Button inner glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10">{primaryCta.text}</span>
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={`group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 ${buttonClasses[variant].secondary}`}
              >
                <span className="relative z-10">{secondaryCta.text}</span>
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            )}
          </div>
          
          {/* Premium trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
            <div className="flex items-center text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium">Platform launching Q2 2026</span>
            </div>
            <div className="flex items-center text-slate-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">UK procurement focused</span>
            </div>
            <div className="flex items-center text-slate-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">AI-powered bid writing</span>
            </div>
          </div>
          
          {/* Enhanced related resources section */}
          <div className="pt-10 border-t border-slate-700/30">
            <p className={`text-base leading-relaxed ${textClasses[variant].subtitle} max-w-3xl mx-auto`}>
              Explore our comprehensive <a href="/" className="text-blue-400 underline font-semibold hover:no-underline hover:text-blue-300 transition-colors">RFP software</a> for AI-powered bid management. Need go-to-market expertise? Discover the leading <a href="https://gtm.quest/best-gtm-agency-top-gtm-agencies" className="text-blue-400 underline font-semibold hover:no-underline hover:text-blue-300 transition-colors">GTM agency</a> for B2B growth strategies to complement your RFP management needs.
            </p>
          </div>
          
          {/* Bottom accent decoration */}
          <div className="flex justify-center mt-10">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
