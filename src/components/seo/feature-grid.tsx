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
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Modern decorative background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Floating glass orbs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-slate-900/20 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/20 to-slate-800/20 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern headline */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            RFP Software Features to Win More Bids
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AI-powered RFP software features designed for UK procurement teams to streamline bid processes and maximize success rates
          </p>
        </div>

        {/* Premium feature cards */}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8 lg:gap-10`}>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || SparklesIcon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Glass morphism card */}
                <div className="relative h-full bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-700/50 shadow-2xl shadow-blue-900/20 transition-all duration-500 hover:shadow-blue-500/30 hover:-translate-y-3 hover:bg-slate-800/60">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  
                  {/* Top accent line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Enhanced icon container */}
                    <div className="mb-8">
                      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-sm border border-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        {/* Inner glow effect */}
                        <div className="absolute inset-2 bg-gradient-to-br from-blue-400/30 to-blue-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Icon className="w-10 h-10 text-blue-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-100 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-slate-300 leading-relaxed text-lg group-hover:text-slate-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom gradient highlight */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/60 via-blue-400/80 to-blue-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl" />
                  
                  {/* Side glow effect */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-3xl" />
                </div>

                {/* Floating particles effect */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse delay-150 transition-all duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-700/50 text-slate-300">
            <SparklesIcon className="w-5 h-5 text-blue-400 mr-3" />
            <span className="text-base font-medium">AI-powered features coming Q2 2026</span>
            <div className="w-2 h-2 bg-green-400 rounded-full ml-4 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
