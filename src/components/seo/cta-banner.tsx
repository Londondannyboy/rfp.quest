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
    gradient: 'bg-gradient-to-r from-teal-600 to-teal-700',
    dark: 'bg-gray-900 dark:bg-slate-950',
    light: 'bg-gray-50 dark:bg-slate-800',
  };

  const textClasses = {
    gradient: {
      title: 'text-white',
      subtitle: 'text-teal-100',
    },
    dark: {
      title: 'text-white',
      subtitle: 'text-gray-400',
    },
    light: {
      title: 'text-gray-900 dark:text-white',
      subtitle: 'text-gray-600 dark:text-gray-400',
    },
  };

  const buttonClasses = {
    gradient: {
      primary: 'bg-white text-teal-700 hover:bg-teal-50',
      secondary: 'border-2 border-white text-white hover:bg-white/10',
    },
    dark: {
      primary: 'bg-teal-600 text-white hover:bg-teal-700',
      secondary: 'border-2 border-teal-600 text-teal-400 hover:bg-teal-900/30',
    },
    light: {
      primary: 'bg-teal-600 text-white hover:bg-teal-700',
      secondary: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20',
    },
  };

  return (
    <section className={`py-16 md:py-24 ${variantClasses[variant]}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${textClasses[variant].title}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto ${textClasses[variant].subtitle}`}>
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryCta.href}
            className={`inline-block px-8 py-4 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl ${buttonClasses[variant].primary}`}
          >
            {primaryCta.text}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={`inline-block px-8 py-4 font-semibold rounded-lg transition-colors ${buttonClasses[variant].secondary}`}
            >
              {secondaryCta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
