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
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Modern logo cloud grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {badges.map((badge, index) => {
            const content = (
              <div className="group relative flex items-center justify-center p-6 rounded-2xl bg-slate-50 hover:bg-white ring-1 ring-slate-200/60 hover:ring-blue-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                {badge.logo ? (
                  <div className="relative z-10 h-12 md:h-16 flex items-center justify-center grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300">
                    <Image
                      src={badge.logo}
                      alt={badge.name}
                      width={120}
                      height={48}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="relative z-10 px-4 py-2 text-slate-700 font-medium text-sm md:text-base group-hover:text-blue-600 transition-colors duration-300">
                    {badge.name}
                  </div>
                )}
                
                {badge.description && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
                    {badge.description}
                  </div>
                )}

                {/* Subtle border highlight */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500/50 to-slate-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
              </div>
            );

            return badge.url ? (
              <Link
                key={index}
                href={badge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
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
