import { useEffect, useRef } from 'react';
import type { LogEvent } from '../types';

interface AgentLogProps {
  events: LogEvent[];
  isRunning: boolean;
}

const colorMap: Record<string, string> = {
  success: 'text-emerald-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
  neutral: 'text-zinc-400',
};

export function AgentLog({ events, isRunning }: AgentLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-[#0c0c0e] border border-zinc-800 rounded-md overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f23]">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Agent Activity Log
          </span>
          {isRunning && (
            <span className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[0.65rem] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>●</span> Live
            </span>
          )}
        </div>
        <span className="font-mono text-[0.7rem] text-zinc-600">
          last update 2s ago
        </span>
      </div>

      <div ref={scrollRef} className="px-5 py-4 max-h-80 overflow-y-auto flex-1">
        {events.length === 0 ? (
          <div className="text-zinc-600 font-mono text-sm">
            Waiting for agent to start...
          </div>
        ) : (
          <div className="flex flex-col">
            {events.map((event) => {
              const colorClass = colorMap[event.color] || colorMap.neutral;
              return (
                <div 
                  key={event.id}
                  className="font-mono text-[0.82rem] leading-8 flex items-baseline whitespace-nowrap animate-log-enter"
                >
                  <span className="text-zinc-600 mr-1.5">&gt;</span>
                  <span className="text-zinc-600 text-[0.72rem] min-w-[72px] mr-2.5">
                    {event.timestamp}
                  </span>
                  <span className={`min-w-[80px] font-medium ${colorClass}`}>
                    {event.action}
                  </span>
                  {event.paymentId && (
                    <span className="text-zinc-300 min-w-[110px]">
                      {event.paymentId}
                    </span>
                  )}
                  {event.paymentId && (
                    <span className="text-zinc-600 mx-2">→</span>
                  )}
                  <span className={`font-medium ${colorClass}`}>
                    {event.detail}
                  </span>
                </div>
              );
            })}
            {isRunning && (
              <div className="font-mono text-[0.82rem] leading-8 mt-1">
                <span className="text-zinc-600 mr-1.5">&gt;</span>
                <span className="text-zinc-600 animate-blink">█</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
