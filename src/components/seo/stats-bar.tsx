interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsBarProps {
  stats: Stat[];
  variant?: 'light' | 'dark' | 'gradient';
}

export function StatsBar({ stats, variant = 'gradient' }: StatsBarProps) {
  const variants = {
    light: {
      section: 'bg-slate-50',
      card: 'bg-white ring-1 ring-slate-200/60 shadow-sm',
      value: 'text-blue-600',
      label: 'text-slate-600',
    },
    dark: {
      section: 'bg-slate-900',
      card: 'bg-slate-800/50 ring-1 ring-slate-700/50 shadow-lg',
      value: 'text-blue-400',
      label: 'text-slate-300',
    },
    gradient: {
      section: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950',
      card: 'bg-slate-900/60 backdrop-blur-sm ring-1 ring-slate-700/50 shadow-xl shadow-blue-900/20',
      value: 'text-white',
      label: 'text-slate-300',
    },
  };

  const currentVariant = variants[variant];

  return (
    <section className={`py-16 md:py-20 ${currentVariant.section}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern card-based layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`group relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${currentVariant.card}`}
            >
              {/* Gradient overlay for hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`text-4xl md:text-5xl font-bold tracking-tight mb-2 ${currentVariant.value}`}>
                  <span className="tabular-nums">{stat.value}</span>
                  {stat.suffix && (
                    <span className="text-2xl md:text-3xl ml-1 opacity-80">{stat.suffix}</span>
                  )}
                </div>
                
                <div className={`text-sm md:text-base font-medium ${currentVariant.label} tracking-wide`}>
                  {stat.label}
                </div>
              </div>

              {/* Subtle border highlight */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500/50 to-slate-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
