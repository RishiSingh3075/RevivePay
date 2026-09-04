import { Payment } from "../types/index.js";
import { getRecoveryProbability } from "./classifier.js";
import { decide } from "./decisionEngine.js";

const payment: Payment = {
  paymentId: "PAY_TEST",
  customerId: "CUST_TEST",

  amountInr: 1500,
  status: "failed",

  paymentMethod: "card",
  failureType: "network_timeout",

  hourOfDay: 14,
  minutesSinceFailure: 30,
  retryCount: 0,

  previousPayments: 10,
  previousSuccesses: 8,
  previousSuccessRate: 0.8,

  recovered: false
};

const recoveryProbability = getRecoveryProbability(payment);

const classifiedPayment: Payment = {
  ...payment,
  recoveryProbability
};

const decision = decide(classifiedPayment);

console.log("Payment:", classifiedPayment.paymentId);
console.log("Recovery Probability:", classifiedPayment.recoveryProbability);
console.log("Action:", decision.action);
console.log("Reason:", decision.reason);