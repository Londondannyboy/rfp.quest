import {
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: SparklesIcon,
  clock: ClockIcon,
  shield: ShieldCheckIcon,
  users: UsersIcon,
  chart: ChartBarIcon,
  document: DocumentTextIcon,
  cog: CogIcon,
  badge: CheckBadgeIcon,
};

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
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6 md:gap-8`}>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || SparklesIcon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-8"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon container with improved design */}
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 ring-1 ring-blue-100/50 text-blue-600 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-slate-100 transition-all duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle hover border */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500/50 to-slate-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
