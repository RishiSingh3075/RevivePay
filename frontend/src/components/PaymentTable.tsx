import { Fragment } from 'react';
import type { Payment, RecoveryResult } from '../types';
import { PaymentDetail } from './PaymentDetail';

interface PaymentTableProps {
  payments: Payment[];
  recoveryResults: Map<string, RecoveryResult>;
  expandedId: string | null;
  onToggleExpand: (paymentId: string) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  recoveryResults,
  expandedId,
  onToggleExpand,
}) => {
  const total = payments.length;
  const failed = payments.filter(p => p.status === 'failed').length;

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f23]">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          PAYMENT RECOVERY QUEUE
        </div>
        <div className="font-mono text-[0.7rem] text-zinc-600">
          {total} payments · {failed} failed
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Payment ID</th>
              <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Customer</th>
              <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Amount</th>
              <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Failure Reason</th>
              <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Recovery Prob.</th>
              <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Decision</th>
              <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => {
              const isExpanded = expandedId === payment.paymentId;
              const result = recoveryResults.get(payment.paymentId);
              const isLast = index === payments.length - 1 && !isExpanded;

              return (
                <Fragment key={payment.paymentId}>
                  <tr 
                    className={`hover:bg-[#1a1a1e] transition-colors cursor-pointer ${isLast ? '' : 'border-b border-[#1f1f23]'}`}
                    onClick={() => onToggleExpand(payment.paymentId)}
                  >
                    <td className="px-5 py-2.5 text-[0.82rem] text-zinc-400">
                      <span className="font-mono text-[0.78rem] text-zinc-50 font-medium">{payment.paymentId}</span>
                    </td>
                    <td className="px-5 py-2.5 text-[0.82rem] text-zinc-400">
                      {payment.customerId}
                    </td>
                    <td className="px-5 py-2.5 text-[0.82rem] text-zinc-400">
                      <span className="font-mono font-medium text-zinc-50">₹{payment.amountInr.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-2.5 text-[0.82rem] text-zinc-400">
                      {payment.status === 'successful' ? (
                        <span className="text-zinc-600">—</span>
                      ) : (
                        <span className="text-zinc-400">{payment.failureType}</span>
                      )}
                    </td>
                    <td className="px-5 py-2.5 text-[0.82rem] text-zinc-400">
                      {(() => {
                        if (!result) return <span className="text-zinc-600">—</span>;
                        const prob = (result as any).probability?.recoveryProbability ?? (result as any).recoveryProbability;
                        if (prob === undefined) return <span className="text-zinc-600">—</span>;
                        
                        let colorClass = 'text-red-400';
                        if (prob >= 70) colorClass = 'text-emerald-400';
                        else if (prob >= 40) colorClass = 'text-amber-400';
                        return <span className={`font-mono ${colorClass}`}>{prob.toFixed(1)}%</span>;
                      })()}
                    </td>
                    <td className="px-5 py-2.5 text-[0.82rem] text-zinc-400">
                      {(() => {
                        if (!result) return <span className="text-zinc-600">—</span>;
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
                      })()}
                    </td>
                    <td className="px-5 py-2.5 text-[0.82rem] text-zinc-400">
                      {(() => {
                        if (payment.status === 'successful') {
                          return (
                            <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-emerald-400">
                              <div className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
                              Success
                            </div>
                          );
                        }
                        
                        if (payment.status === 'failed' && !result) {
                          return (
                            <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-red-400">
                              <div className="w-[6px] h-[6px] rounded-full bg-red-400" />
                              Failed
                            </div>
                          );
                        }

                        if (result?.execution?.success === true) {
                          return (
                            <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-emerald-400">
                              <div className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
                              Recovered
                            </div>
                          );
                        }

                        if (result) {
                          const decision = result.decision?.action || (result as any).action;
                          switch (decision) {
                            case 'RETRY_LATER':
                              return (
                                <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-amber-400">
                                  <div className="w-[6px] h-[6px] rounded-full bg-amber-400" />
                                  Pending
                                </div>
                              );
                            case 'ESCALATE':
                              return (
                                <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-blue-400">
                                  <div className="w-[6px] h-[6px] rounded-full bg-blue-400" />
                                  Escalated
                                </div>
                              );
                            case 'STOP':
                              return (
                                <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-red-400">
                                  <div className="w-[6px] h-[6px] rounded-full bg-red-400" />
                                  Stopped
                                </div>
                              );
                            default:
                              return (
                                <div className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-zinc-400">
                                  <div className="w-[6px] h-[6px] rounded-full bg-zinc-400" />
                                  Processed
                                </div>
                              );
                          }
                        }

                        return null;
                      })()}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={index === payments.length - 1 ? '' : 'border-b border-[#1f1f23]'}>
                      <td colSpan={7} className="p-0">
                        <PaymentDetail payment={payment} result={result} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
