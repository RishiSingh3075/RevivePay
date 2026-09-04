import React from 'react';

interface RunButtonProps {
  failedCount: number;
  status: 'idle' | 'running' | 'complete';
  onRun: () => void;
}

export const RunButton: React.FC<RunButtonProps> = ({
  failedCount,
  status,
  onRun,
}) => {
  return (
    <div className="w-full flex items-center justify-between font-sans">
      <div>
        {status === 'idle' && (
          <span className="text-sm text-zinc-400">
            {failedCount} failed payments ready for recovery
          </span>
        )}
        {status === 'running' && (
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <svg
              className="animate-spin w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Recovery in progress...</span>
          </div>
        )}
        {status === 'complete' && (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
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
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Recovery complete</span>
          </div>
        )}
      </div>

      <div>
        {status === 'idle' && (
          <button
            onClick={onRun}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all duration-200 rounded-md px-5 py-2.5 font-medium flex items-center gap-2"
          >
            <span className="text-[10px]">▶</span>
            <span className="font-mono text-xs tracking-wider">RUN RECOVERY AGENT</span>
          </button>
        )}
        {status === 'running' && (
          <button
            disabled
            className="bg-amber-500/10 border border-amber-500/20 text-amber-400 cursor-not-allowed opacity-70 rounded-md px-5 py-2.5 font-medium flex items-center gap-2"
          >
            <span className="font-mono text-xs tracking-wider">PROCESSING...</span>
          </button>
        )}
        {status === 'complete' && (
          <button
            disabled
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-not-allowed rounded-md px-5 py-2.5 font-medium flex items-center gap-2"
          >
            <span className="font-mono text-xs tracking-wider">COMPLETE ✓</span>
          </button>
        )}
      </div>
    </div>
  );
};
