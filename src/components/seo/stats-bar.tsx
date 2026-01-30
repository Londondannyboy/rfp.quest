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
  const bgClasses = {
    light: 'bg-white dark:bg-slate-800',
    dark: 'bg-gray-900 dark:bg-slate-950',
    gradient: 'bg-gradient-to-r from-teal-600 to-teal-700',
  };

  const textClasses = {
    light: {
      value: 'text-teal-600 dark:text-teal-400',
      label: 'text-gray-600 dark:text-gray-400',
    },
    dark: {
      value: 'text-white',
      label: 'text-gray-400',
    },
    gradient: {
      value: 'text-white',
      label: 'text-teal-100',
    },
  };

  return (
    <section className={`py-12 md:py-16 ${bgClasses[variant]}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold ${textClasses[variant].value} mb-2`}>
                {stat.value}
                {stat.suffix && <span className="text-2xl md:text-3xl">{stat.suffix}</span>}
              </div>
              <div className={`text-sm md:text-base ${textClasses[variant].label} font-medium`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
