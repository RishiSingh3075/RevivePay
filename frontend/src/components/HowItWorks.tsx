export function HowItWorks() {
  const steps = [
    { name: 'ML Model', desc: 'Predicts recovery probability using historical payment data' },
    { name: 'Safety Rules', desc: 'Prevents unsafe or unnecessary recovery attempts' },
    { name: 'Decision Engine', desc: 'Selects the optimal recovery action (retry, wait, escalate, or stop)' },
    { name: 'Executor', desc: 'Executes or simulates the selected recovery action' },
    { name: 'Audit Log', desc: 'Records every decision, reason, and outcome for full traceability' }
  ];

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-6">
      <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">HOW REVIVEPAY WORKS</h2>
      
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3 items-start py-2.5">
            <div className="w-6 h-6 rounded-full bg-[#18181b] border border-zinc-700 flex items-center justify-center text-[0.65rem] font-mono text-zinc-500 shrink-0">
              {index + 1}
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-300">{step.name}</div>
              <div className="text-[0.78rem] text-zinc-500 mt-0.5">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[0.72rem] text-zinc-600 mt-4 pt-3 border-t border-[#1f1f23]">
        RevivePay combines ML prediction with deterministic safety rules — the model informs decisions, but explicit business logic controls execution.
      </div>
    </div>
  );
}
