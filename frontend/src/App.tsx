import { useState } from 'react';
import type { Payment, RecoveryResult, LogEvent, AuditEntry, RecoveryResponse } from './types';

import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { RunButton } from './components/RunButton';
import { AgentLog } from './components/AgentLog';
import { PaymentTable } from './components/PaymentTable';
import { RecoverySummary } from './components/RecoverySummary';
import { HowItWorks } from './components/HowItWorks';
import { AuditSection } from './components/AuditSection';

export default function App() {
  // ── Payment data ──────────────────────────────────────────
  // Setters prefixed _ are used in later phases (backend integration)
  const [payments, _setPayments] = useState<Payment[]>([]);
  const [_loading, _setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Recovery state ────────────────────────────────────────
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [recoveryResults, _setRecoveryResults] = useState<Map<string, RecoveryResult>>(new Map());
  const [recoverySummary, _setRecoverySummary] = useState<RecoveryResponse['summary'] | null>(null);

  // ── Agent log ─────────────────────────────────────────────
  const [logEvents, _setLogEvents] = useState<LogEvent[]>([]);

  // ── Audit ─────────────────────────────────────────────────
  const [auditEntries, _setAuditEntries] = useState<AuditEntry[]>([]);

  // ── Payment detail expand ─────────────────────────────────
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);

  // ── Derived values ────────────────────────────────────────
  const failedPayments = payments.filter(p => p.status === 'failed');

  const recoveredCount = Array.from(recoveryResults.values()).filter(
    r => r.execution.success
  ).length;

  const totalRecoveredAmount = Array.from(recoveryResults.values())
    .filter(r => r.execution.success)
    .reduce((sum, r) => sum + r.payment.amountInr, 0);

  const pendingCount = failedPayments.length - recoveredCount;

  const recoveryRate = recoveryStatus === 'complete' && failedPayments.length > 0
    ? (recoveredCount / failedPayments.length) * 100
    : null;

  // ── Handlers ──────────────────────────────────────────────
  const handleToggleExpand = (paymentId: string) => {
    setExpandedPaymentId(prev => prev === paymentId ? null : paymentId);
  };

  const handleRunRecovery = () => {
    // Will be connected to real backend in Phase 4
    setRecoveryStatus('running');
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-8 py-6 pb-16">
      <Header agentOnline={true} />

      <div className="mt-7">
        <SummaryCards
          recoveryRate={recoveryRate}
          recoveredAmount={recoveryStatus === 'complete' ? totalRecoveredAmount : null}
          pendingCount={payments.length > 0 ? pendingCount : null}
        />
      </div>

      <div className="mt-6">
        <RunButton
          failedCount={failedPayments.length}
          status={recoveryStatus}
          onRun={handleRunRecovery}
        />
      </div>

      <div className="mt-6">
        <AgentLog events={logEvents} isRunning={recoveryStatus === 'running'} />
      </div>

      <div className="mt-6">
        <PaymentTable
          payments={payments}
          recoveryResults={recoveryResults}
          expandedId={expandedPaymentId}
          onToggleExpand={handleToggleExpand}
        />
      </div>

      {recoveryStatus === 'complete' && recoverySummary && (
        <div className="mt-6">
          <RecoverySummary
            totalProcessed={recoverySummary.totalProcessed}
            recovered={recoverySummary.recovered}
            retryLater={recoverySummary.retryLater}
            escalated={recoverySummary.escalated}
            stopped={recoverySummary.stopped}
            totalAmountRecovered={recoverySummary.totalAmountRecovered}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HowItWorks />
        <AuditSection entries={auditEntries} />
      </div>

      {error && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md px-4 py-3 text-sm">
          <p className="font-medium">Error</p>
          <p className="text-[0.78rem] mt-1 text-red-400/80">{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-red-400/60 hover:text-red-400"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
