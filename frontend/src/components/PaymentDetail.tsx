import type { Payment, RecoveryResult } from '../types';

interface PaymentDetailProps {
  payment: Payment;
  result?: RecoveryResult;
}

export const PaymentDetail = ({ payment, result }: PaymentDetailProps) => {
  const isSuccessful = payment.status === 'successful';

  const renderProbability = () => {
    if (isSuccessful || !result) return <span className="text-zinc-600">—</span>;
    const prob = result.recoveryProbability * 100;
    if (prob === undefined) return <span className="text-zinc-600">—</span>;

    let colorClass = 'text-red-400';
    if (prob >= 70) colorClass = 'text-emerald-400';
    else if (prob >= 40) colorClass = 'text-amber-400';
    
    return <span className={colorClass}>{prob.toFixed(1)}%</span>;
  };

  const renderDecision = () => {
    if (isSuccessful || !result) return <span className="text-zinc-600">—</span>;
    const decision = result.decision?.action || (result as any).action;
    
    switch (decision) {
      case 'RETRY_NOW':
        return (
          <div className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/8 border border-emerald-500/12 text-emerald-400">
            <div className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
            RETRY_NOW
          </div>
        );
      case 'RETRY_LATER':
        return (
          <div className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/8 border border-amber-500/12 text-amber-400">
            <div className="w-[6px] h-[6px] rounded-full bg-amber-400" />
            RETRY_LATER
          </div>
        );
      case 'ESCALATE':
        return (
          <div className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/8 border border-blue-500/12 text-blue-400">
            <div className="w-[6px] h-[6px] rounded-full bg-blue-400" />
            ESCALATE
          </div>
        );
      case 'STOP':
        return (
          <div className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium px-2.5 py-0.5 rounded-full bg-red-500/8 border border-red-500/12 text-red-400">
            <div className="w-[6px] h-[6px] rounded-full bg-red-400" />
            STOP
          </div>
        );
      default:
        return <span className="text-zinc-600">—</span>;
    }
  };

  const decisionReason = isSuccessful ? null : (result?.decision?.reason || (result as any)?.reason);
  const executionMessage = isSuccessful ? null : (result?.execution?.message || (result as any)?.executionMessage);
  const previousSuccessRate = (payment as any).previousSuccessRate ?? (payment as any).customerPreviousSuccessRate;
  const timestamp = isSuccessful ? null : result?.timestamp;

  return (
    <div className="bg-[#0c0c0e] border-t border-[#1f1f23] px-8 py-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4">
        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Amount</div>
          <div className="text-sm text-zinc-300 font-mono mt-0.5">₹{payment.amountInr.toLocaleString('en-IN')}</div>
        </div>
        
        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Payment Method</div>
          <div className="text-sm text-zinc-300 font-mono mt-0.5">{payment.paymentMethod || "—"}</div>
        </div>

        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Failure Reason</div>
          <div className="text-sm text-zinc-300 font-mono mt-0.5">{isSuccessful ? "—" : (payment.failureType || "—")}</div>
        </div>

        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Recovery Probability</div>
          <div className="text-sm font-mono mt-0.5">{renderProbability()}</div>
        </div>

        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Retry Count</div>
          <div className="text-sm text-zinc-300 font-mono mt-0.5">{payment.retryCount ?? 0}</div>
        </div>

        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Previous Success Rate</div>
          <div className="text-sm text-zinc-300 font-mono mt-0.5">
            {previousSuccessRate !== undefined ? `${(previousSuccessRate * 100).toFixed(1)}%` : "—"}
          </div>
        </div>

        <div>
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Decision</div>
          <div className="mt-0.5">{renderDecision()}</div>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Decision Reason</div>
          <div className="text-sm text-zinc-400 mt-0.5">{decisionReason || "—"}</div>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Execution Result</div>
          <div className="text-sm text-zinc-400 mt-0.5">{executionMessage || "—"}</div>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <div className="text-[0.7rem] text-zinc-600 uppercase tracking-wider font-medium">Timestamp</div>
          <div className="text-sm text-zinc-400 font-mono mt-0.5">
            {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { hour12: false }) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
};
