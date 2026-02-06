'use client';

import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

type TimelineEventType = 'milestone' | 'deadline' | 'published' | 'award' | 'contract' | 'custom';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: TimelineEventType;
  completed?: boolean;
  important?: boolean;
}

interface TimelineViewProps {
  events: TimelineEvent[];
  currentDate?: Date;
}

const eventStyles: Record<TimelineEventType, { bg: string; border: string; icon: string }> = {
  milestone: { bg: 'bg-blue-500', border: 'border-blue-500', icon: '🎯' },
  deadline: { bg: 'bg-red-500', border: 'border-red-500', icon: '⏰' },
  published: { bg: 'bg-green-500', border: 'border-green-500', icon: '📢' },
  award: { bg: 'bg-purple-500', border: 'border-purple-500', icon: '🏆' },
  contract: { bg: 'bg-teal-500', border: 'border-teal-500', icon: '📝' },
  custom: { bg: 'bg-slate-500', border: 'border-slate-500', icon: '📌' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDaysUntil(dateString: string, currentDate: Date): number {
  const date = new Date(dateString);
  return Math.ceil((date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function TimelineView({ events, currentDate = new Date() }: TimelineViewProps) {
  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find current position in timeline
  const nowIndex = sortedEvents.findIndex(
    (e) => new Date(e.date).getTime() > currentDate.getTime()
  );

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">Procurement Timeline</h3>
        <p className="text-sm text-slate-400 mt-1">
          Key dates and milestones for this opportunity
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

          {/* Events */}
          <div className="space-y-6">
            {sortedEvents.map((event, index) => {
              const style = eventStyles[event.type];
              const isPast = new Date(event.date).getTime() < currentDate.getTime();
              const isNext = index === nowIndex;
              const daysUntil = getDaysUntil(event.date, currentDate);

              return (
                <div key={event.id} className="relative pl-16">
                  {/* Node */}
                  <div
                    className={`
                      absolute left-4 w-5 h-5 rounded-full border-2 transform -translate-x-1/2
                      ${isPast || event.completed ? 'bg-slate-900 ' + style.border : style.bg + ' border-transparent'}
                      ${isNext ? 'ring-4 ring-opacity-30 ring-' + style.bg.replace('bg-', '') : ''}
                    `}
                  >
                    {(isPast || event.completed) && (
                      <CheckIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`
                      p-4 rounded-lg border transition-all
                      ${isNext ? 'bg-slate-800 border-slate-600 shadow-lg' : 'bg-slate-800/50 border-slate-700/50'}
                      ${event.important ? 'ring-2 ring-yellow-500/30' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {/* Type badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{style.icon}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${style.bg} bg-opacity-20 text-white`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                          {event.important && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                              Important
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className={`font-medium ${isPast ? 'text-slate-400' : 'text-white'}`}>
                          {event.title}
                        </h4>

                        {/* Description */}
                        {event.description && (
                          <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                        )}
                      </div>

                      {/* Date */}
                      <div className="text-right flex-shrink-0">
                        <div className={`text-sm font-medium ${isPast ? 'text-slate-500' : 'text-white'}`}>
                          {formatDate(event.date)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatTime(event.date)}
                        </div>
                        {!isPast && (
                          <div className={`text-xs mt-1 font-medium ${
                            daysUntil <= 3 ? 'text-red-400' :
                            daysUntil <= 7 ? 'text-orange-400' :
                            'text-slate-400'
                          }`}>
                            {daysUntil === 0 ? 'Today' :
                             daysUntil === 1 ? 'Tomorrow' :
                             `${daysUntil} days`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* "Now" indicator between events */}
                  {index === nowIndex - 1 && (
                    <div className="absolute left-0 right-0 mt-3 mb-3 flex items-center">
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-500 rounded-full">
                        <ClockIcon className="w-3 h-3 text-white" />
                        <span className="text-xs font-medium text-white">Now</span>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-l from-teal-500 to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
