import type { AuditEntry } from '../types';

interface AuditSectionProps {
  entries: AuditEntry[];
}

export function AuditSection({ entries }: AuditSectionProps) {
  const sortedEntries = [...entries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  const getActionStyles = (action: string) => {
    switch (action) {
      case 'RETRY_NOW': return 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20';
      case 'RETRY_LATER': return 'bg-amber-400/10 text-amber-400 border border-amber-400/20';
      case 'ESCALATE': return 'bg-blue-400/10 text-blue-400 border border-blue-400/20';
      case 'STOP': return 'bg-red-400/10 text-red-400 border border-red-400/20';
      default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f23]">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">AUDIT LOG</h2>
        <span className="font-mono text-[0.7rem] text-zinc-600">{entries.length} entries</span>
      </div>

      {entries.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-zinc-600">
          No audit entries yet. Run the recovery agent to generate audit records.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Timestamp</th>
                <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Payment ID</th>
                <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Action</th>
                <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Reason</th>
                <th className="text-[0.7rem] font-medium text-zinc-600 uppercase tracking-wider text-left px-5 py-2.5 border-b border-[#1f1f23] bg-[#18181b]">Result</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry, idx) => (
                <tr key={idx} className="border-b border-[#1f1f23] hover:bg-[#1a1a1e]">
                  <td className="px-5 py-2.5 font-mono text-[0.72rem] text-zinc-600 whitespace-nowrap">
                    {formatTime(entry.timestamp)}
                  </td>
                  <td className="px-5 py-2.5 font-mono text-[0.78rem] text-zinc-300 font-medium whitespace-nowrap">
                    {entry.paymentId}
                  </td>
                  <td className="px-5 py-2.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[0.65rem] font-mono font-medium tracking-wide uppercase ${getActionStyles(entry.action)}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-[0.78rem] text-zinc-500 max-w-[280px] truncate">
                    {entry.reason}
                  </td>
                  <td className="px-5 py-2.5 text-[0.78rem] max-w-[200px] truncate">
                    {entry.executionSuccess ? (
                      <span className="text-emerald-400">Success</span>
                    ) : (
                      <span className="text-zinc-500 truncate block">{entry.executionMessage}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
