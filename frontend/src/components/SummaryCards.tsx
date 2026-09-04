import React from 'react';

interface SummaryCardsProps {
  recoveryRate: number | null;
  recoveredAmount: number | null;
  pendingCount: number | null;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  recoveryRate,
  recoveredAmount,
  pendingCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
      <div className="bg-[#111113] border border-zinc-800 rounded-md p-5">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          RECOVERY RATE
        </div>
        <div className="font-mono text-3xl font-semibold text-zinc-50 tracking-tight mt-1.5">
          {recoveryRate !== null ? `${recoveryRate.toFixed(1)}%` : <span className="text-zinc-600">—</span>}
        </div>
      </div>
      <div className="bg-[#111113] border border-zinc-800 rounded-md p-5">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          RECOVERED
        </div>
        <div className="font-mono text-3xl font-semibold text-zinc-50 tracking-tight mt-1.5">
          {recoveredAmount !== null ? `₹${recoveredAmount.toLocaleString('en-IN')}` : <span className="text-zinc-600">—</span>}
        </div>
      </div>
      <div className="bg-[#111113] border border-zinc-800 rounded-md p-5">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          PENDING · AT RISK
        </div>
        <div className="font-mono text-3xl font-semibold text-zinc-50 tracking-tight mt-1.5">
          {pendingCount !== null ? pendingCount : <span className="text-zinc-600">—</span>}
        </div>
      </div>
    </div>
  );
};
