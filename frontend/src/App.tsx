import { useState, useEffect } from 'react';
import type { Payment, RecoveryResult, LogEvent, AuditEntry, RecoveryResponse } from './types';
import { fetchPayments, runRecovery } from './lib/api';

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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Recovery state ────────────────────────────────────────
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [recoveryResults, setRecoveryResults] = useState<Map<string, RecoveryResult>>(new Map());
  const [recoverySummary, setRecoverySummary] = useState<RecoveryResponse['summary'] | null>(null);

  // ── Agent log ─────────────────────────────────────────────
  const [logEvents, setLogEvents] = useState<LogEvent[]>([]);

  // ── Audit ─────────────────────────────────────────────────
  const [auditEntries, _setAuditEntries] = useState<AuditEntry[]>([]);

  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchPayments();
        setPayments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  const handleRunRecovery = async () => {
    try {
      setRecoveryStatus('running');
      setLogEvents([]); // Clear previous logs
      const response = await runRecovery();
      
      // Animate logs
      const newEvents: LogEvent[] = [];
      let eventId = 0;

      for (const r of response.results) {
        // Classify log
        newEvents.push({
          id: String(++eventId),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          paymentId: r.payment.paymentId,
          action: 'PREDICT',
          detail: `Recovery probability: ${(r.recoveryProbability * 100).toFixed(1)}%`,
          color: r.recoveryProbability >= 0.7 ? 'success' : r.recoveryProbability >= 0.4 ? 'amber' : 'red'
        });

        // Decide log
        let decisionColor: LogEvent['color'] = 'neutral';
        if (r.decision.action === 'RETRY_NOW') decisionColor = 'success';
        else if (r.decision.action === 'RETRY_LATER') decisionColor = 'amber';
        else if (r.decision.action === 'ESCALATE') decisionColor = 'blue';
        else if (r.decision.action === 'STOP') decisionColor = 'red';

        newEvents.push({
          id: String(++eventId),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          paymentId: r.payment.paymentId,
          action: 'DECIDE',
          detail: `Action: ${r.decision.action} (${r.decision.reason})`,
          color: decisionColor
        });

        // Execute log
        newEvents.push({
          id: String(++eventId),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          paymentId: r.payment.paymentId,
          action: 'EXECUTE',
          detail: r.execution.message,
          color: r.execution.success ? 'success' : 'neutral'
        });
      }

      // Stream events to UI one by one
      for (let i = 0; i < newEvents.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150)); // 150ms delay per log
        setLogEvents(prev => [...prev, newEvents[i]]);
      }

      // Wait a moment after finishing logs before showing final tables
      await new Promise(resolve => setTimeout(resolve, 300));

      const newResultsMap = new Map<string, RecoveryResult>();
      response.results.forEach(r => {
        newResultsMap.set(r.payment.paymentId, r);
      });

      setRecoveryResults(newResultsMap);
      setRecoverySummary(response.summary);
      setRecoveryStatus('complete');
      
      // Fetch fresh payments to reflect recovered status
      const data = await fetchPayments();
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to run recovery');
      setRecoveryStatus('idle');
    }
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
