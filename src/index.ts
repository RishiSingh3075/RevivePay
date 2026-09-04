import { Payment } from "./types/index.js";
import { getRecoveryProbability } from "./agent/classifier.js";
import { decide } from "./agent/decisionEngine.js";
import { execute } from "./agent/executor.js";
import { logAudit } from "./audit/auditLog.js";
import { loadPayments } from "./data/loadPayments.js";

console.log("=================================");
console.log("       REVIVEPAY AGENT");
console.log("=================================");

async function main() {

const allPayments = loadPayments(
  "data/revivepay_fresh_payments.csv"
);

const successfulPayments = allPayments.filter(
  payment => payment.status === "successful"
);

const failedPayments = allPayments.filter(
  payment => payment.status === "failed"
);

console.log(`Loaded ${allPayments.length} total payments`);
console.log(`Successful payments: ${successfulPayments.length}`);
console.log(`Failed payments: ${failedPayments.length}`);
  for (const payment of failedPayments) {

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
      failureType: payment.failureType ?? "unknown",
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
}

main();