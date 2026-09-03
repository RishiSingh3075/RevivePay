import { Payment } from "./types/index.js";
import { getRecoveryProbability } from "./agent/classifier.js";
import { decide } from "./agent/decisionEngine.js";
import { execute } from "./agent/executor.js";
import { logAudit } from "./audit/auditLog.js";

const payments: Payment[] = [
  {
    paymentId: "PAY_001",
    customerId: "CUST_001",
    amountInr: 1500,

    paymentMethod: "card",
    failureType: "network_timeout",

    hourOfDay: 14,
    minutesSinceFailure: 30,
    retryCount: 0,

    previousPayments: 10,
    previousSuccesses: 8,
    previousSuccessRate: 0.8,

    recovered: false
  },

  {
    paymentId: "PAY_002",
    customerId: "CUST_002",
    amountInr: 2400,

    paymentMethod: "card",
    failureType: "insufficient_funds",

    hourOfDay: 18,
    minutesSinceFailure: 120,
    retryCount: 0,

    previousPayments: 6,
    previousSuccesses: 2,
    previousSuccessRate: 0.33,

    recovered: false
  },

  {
    paymentId: "PAY_003",
    customerId: "CUST_003",
    amountInr: 800,

    paymentMethod: "card",
    failureType: "card_declined",

    hourOfDay: 11,
    minutesSinceFailure: 60,
    retryCount: 0,

    previousPayments: 12,
    previousSuccesses: 10,
    previousSuccessRate: 0.83,

    recovered: false
  }
];

console.log("=================================");
console.log("       REVIVEPAY AGENT");
console.log("=================================");

for (const payment of payments) {

  console.log(`\nProcessing ${payment.paymentId}...`);

  // 1. Ask ML model for recovery probability
  const recoveryProbability = getRecoveryProbability(payment);

  const classifiedPayment: Payment = {
    ...payment,
    recoveryProbability
  };

  console.log(
    `Recovery Probability: ${(recoveryProbability * 100).toFixed(2)}%`
  );

  // 2. Make recovery decision
  const decision = decide(classifiedPayment);

  console.log(`Decision: ${decision.action}`);
  console.log(`Reason: ${decision.reason}`);

  // 3. Execute decision
  const execution = execute(classifiedPayment, decision);

  console.log(`Execution: ${execution.message}`);

  // 4. Record everything
  logAudit({
    paymentId: payment.paymentId,
    customerId: payment.customerId,
    amountInr: payment.amountInr,
    failureType: payment.failureType,
    recoveryProbability,
    action: decision.action,
    reason: decision.reason,
    executionSuccess: execution.success,
    executionMessage: execution.message,
    timestamp: new Date().toISOString()
  });
}

console.log("\n=================================");
console.log("       PROCESSING COMPLETE");
console.log("=================================");