import Link from 'next/link';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-8 ${gridCols[columns]}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-slate-700"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsBarProps {
  stats: Stat[];
  variant?: 'default' | 'gradient';
}

export function StatsBar({ stats, variant = 'default' }: StatsBarProps) {
  const bgClass = variant === 'gradient'
    ? 'bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800'
    : 'bg-white dark:bg-slate-800 border-y border-gray-200 dark:border-slate-700';

  const textClass = variant === 'gradient'
    ? 'text-white'
    : 'text-gray-900 dark:text-white';

  const labelClass = variant === 'gradient'
    ? 'text-teal-100'
    : 'text-gray-500 dark:text-gray-400';

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className={`text-3xl md:text-4xl font-bold ${textClass}`}>
                {stat.value}
                {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
              </div>
              <div className={`mt-2 text-sm font-medium ${labelClass}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TrustBadge {
  name: string;
  logo?: string;
  url?: string;
  description?: string;
}

interface TrustBadgesProps {
  badges: TrustBadge[];
  title?: string;
  subtitle?: string;
}

export function TrustBadges({ badges, title, subtitle }: TrustBadgesProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <a
              key={index}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all duration-200"
            >
              {badge.logo ? (
                <img src={badge.logo} alt={badge.name} className="h-12 mb-3 grayscale hover:grayscale-0 transition-all" />
              ) : (
                <div className="h-12 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {badge.name.split(' ').map(w => w[0]).join('')}
                  </span>
                </div>
              )}
              <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                {badge.name}
              </span>
              {badge.description && (
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                  {badge.description}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  variant?: 'default' | 'gradient';
}

export function CTABanner({ title, subtitle, primaryCta, secondaryCta, variant = 'default' }: CTABannerProps) {
  const bgClass = variant === 'gradient'
    ? 'bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800'
    : 'bg-gray-900 dark:bg-slate-900';

  return (
    <section className={`relative overflow-hidden ${bgClass}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {primaryCta.text}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-200"
            >
              {secondaryCta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
