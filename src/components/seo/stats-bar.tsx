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
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Modern decorative background elements */}
      <div className="absolute inset-0">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Floating glass orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-gradient-to-tl from-slate-400/20 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern headline */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Trusted by UK Procurement Teams
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Platform metrics that demonstrate our commitment to UK government procurement excellence
          </p>
        </div>

        {/* Premium card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Glass morphism card */}
              <div className="relative h-full bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 text-center border border-slate-700/50 shadow-2xl shadow-blue-900/20 transition-all duration-500 hover:shadow-blue-500/30 hover:-translate-y-2 hover:bg-slate-800/60">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon circle */}
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/90 rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* Stat value */}
                  <div className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                    <span className="tabular-nums bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-2xl md:text-3xl ml-1 opacity-70">{stat.suffix}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="text-base font-medium text-slate-300 tracking-wide leading-relaxed">
                    {stat.label}
                  </div>
                </div>

                {/* Bottom gradient highlight */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/60 via-blue-400/80 to-blue-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-700/50 text-slate-300 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            Live platform metrics • Updated daily
          </div>
        </div>
      </div>
    </section>
  );
}
