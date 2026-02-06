'use client';

import {
  CalendarDaysIcon,
  ClockIcon,
  BellAlertIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface KeyDate {
  id: string;
  label: string;
  date: string;
  time?: string;
  description?: string;
  isPast?: boolean;
  isUrgent?: boolean;
}

interface KeyDatesProps {
  dates: KeyDate[];
  timezone?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(timeString?: string): string {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getDaysUntil(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyColor(days: number, isPast?: boolean): string {
  if (isPast) return 'text-slate-500';
  if (days < 0) return 'text-slate-500';
  if (days === 0) return 'text-red-500';
  if (days <= 3) return 'text-red-400';
  if (days <= 7) return 'text-orange-400';
  if (days <= 14) return 'text-yellow-400';
  return 'text-green-400';
}

function getUrgencyLabel(days: number, isPast?: boolean): string {
  if (isPast) return 'Passed';
  if (days < 0) return 'Passed';
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}

export function KeyDates({ dates, timezone = 'UK Time' }: KeyDatesProps) {
  // Sort dates chronologically
  const sortedDates = [...dates].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find next upcoming date
  const now = new Date();
  const nextDateIndex = sortedDates.findIndex(
    (d) => !d.isPast && new Date(d.date).getTime() >= now.getTime()
  );

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Key Dates</h3>
            <p className="text-sm text-slate-400 mt-1">
              Important deadlines and milestones
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            {timezone}
          </div>
        </div>
      </div>

      {/* Dates list */}
      <div className="divide-y divide-slate-800">
        {sortedDates.map((keyDate, index) => {
          const daysUntil = getDaysUntil(keyDate.date);
          const isPast = keyDate.isPast || daysUntil < 0;
          const isNext = index === nextDateIndex;
          const urgencyColor = getUrgencyColor(daysUntil, isPast);

          return (
            <div
              key={keyDate.id}
              className={`
                p-4 transition-colors
                ${isNext ? 'bg-teal-500/10 border-l-4 border-teal-500' : ''}
                ${isPast ? 'opacity-60' : ''}
                ${keyDate.isUrgent && !isPast ? 'bg-red-500/5' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Date icon */}
                <div className={`
                  p-3 rounded-xl flex-shrink-0
                  ${isPast ? 'bg-slate-800' : isNext ? 'bg-teal-500/20' : 'bg-slate-800'}
                `}>
                  {isPast ? (
                    <CheckCircleIcon className="w-5 h-5 text-slate-500" />
                  ) : keyDate.isUrgent ? (
                    <BellAlertIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <CalendarDaysIcon className={`w-5 h-5 ${isNext ? 'text-teal-400' : 'text-slate-400'}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium ${isPast ? 'text-slate-400' : 'text-white'}`}>
                      {keyDate.label}
                    </h4>
                    {isNext && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-teal-500/20 text-teal-400 rounded">
                        Next
                      </span>
                    )}
                    {keyDate.isUrgent && !isPast && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                        Urgent
                      </span>
                    )}
                  </div>

                  {keyDate.description && (
                    <p className="text-sm text-slate-400 mt-1">{keyDate.description}</p>
                  )}

                  {/* Date and time */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-sm font-medium ${isPast ? 'text-slate-500' : 'text-white'}`}>
                      {formatDate(keyDate.date)}
                    </span>
                    {keyDate.time && (
                      <span className="text-sm text-slate-400">
                        at {formatTime(keyDate.time)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Countdown */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-bold ${urgencyColor}`}>
                    {getUrgencyLabel(daysUntil, isPast)}
                  </div>
                  {!isPast && (
                    <div className="text-xs text-slate-500 mt-1">
                      {daysUntil > 0 ? 'remaining' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dates.length === 0 && (
        <div className="p-8 text-center">
          <CalendarDaysIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No key dates available</p>
        </div>
      )}

      {/* Add to calendar action */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-800">
        <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          <CalendarDaysIcon className="w-4 h-4" />
          Add All to Calendar
        </button>
      </div>
    </div>
  );
}
