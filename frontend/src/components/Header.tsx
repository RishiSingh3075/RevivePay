import React from 'react';

interface HeaderProps {
  agentOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({ agentOnline }) => {
  return (
    <header className="flex flex-row justify-between items-center py-5 border-b border-[#1f1f23]">
      <div className="flex items-center space-x-3">
        <div className="font-bold text-xl tracking-tight text-white font-sans">
          Revive<span className="text-emerald-400">Pay</span>
        </div>
        <div className="w-px h-4 bg-zinc-700"></div>
        <div className="text-xs text-zinc-500 font-sans">
          AI Payment Recovery Agent
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {agentOnline ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-zinc-400 font-sans">Agent Online</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-xs text-red-400 font-sans">Agent Offline</span>
            </>
          )}
        </div>
        <button className="w-8 h-8 flex items-center justify-center border border-zinc-800 rounded-md bg-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>
      </div>
    </header>
  );
};
