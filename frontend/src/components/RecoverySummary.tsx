interface RecoverySummaryProps {
  totalProcessed: number;
  recovered: number;
  retryLater: number;
  escalated: number;
  stopped: number;
  totalAmountRecovered: number;
}

export function RecoverySummary({
  totalProcessed,
  recovered,
  retryLater,
  escalated,
  stopped,
  totalAmountRecovered
}: RecoverySummaryProps) {
  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Recovery Complete</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase mb-1">Total Recovered</div>
          <div className="font-mono text-2xl font-semibold text-zinc-50">
            ₹{totalAmountRecovered.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase mb-1">Payments Recovered</div>
          <div className="font-mono text-2xl font-semibold text-zinc-50">
            {recovered}
            <span className="text-zinc-500">/{totalProcessed}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-5 pt-4 border-t border-[#1f1f23]">
        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] text-zinc-600 uppercase">RETRY_NOW</span>
          <span className="font-mono text-sm font-medium text-emerald-400">{recovered}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] text-zinc-600 uppercase">RETRY_LATER</span>
          <span className="font-mono text-sm font-medium text-amber-400">{retryLater}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] text-zinc-600 uppercase">ESCALATE</span>
          <span className="font-mono text-sm font-medium text-blue-400">{escalated}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] text-zinc-600 uppercase">STOP</span>
          <span className="font-mono text-sm font-medium text-red-400">{stopped}</span>
        </div>
      </div>
    </div>
  );
}
