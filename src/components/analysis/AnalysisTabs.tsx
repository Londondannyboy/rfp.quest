'use client';

interface Tab<T extends string = string> {
  id: T;
  label: string;
  icon?: string;
}

interface Props<T extends string = string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export function AnalysisTabs({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div className="border-b border-slate-700">
      <nav className="flex gap-1" aria-label="Analysis tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors
                ${
                  isActive
                    ? 'bg-slate-800 text-white border-b-2 border-blue-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
