import Image from 'next/image';
import Link from 'next/link';

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
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10">
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

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {badges.map((badge, index) => {
            const content = (
              <div className="flex flex-col items-center group">
                {badge.logo ? (
                  <div className="h-12 md:h-16 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                    <Image
                      src={badge.logo}
                      alt={badge.name}
                      width={120}
                      height={48}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="px-6 py-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300">
                    {badge.name}
                  </div>
                )}
                {badge.description && (
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {badge.description}
                  </span>
                )}
              </div>
            );

            return badge.url ? (
              <Link
                key={index}
                href={badge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform"
              >
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
