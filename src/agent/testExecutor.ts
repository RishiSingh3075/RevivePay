import { execute } from "./executor.js";
import { Payment } from "../types/index.js";

const payment: Payment = {
  paymentId: "PAY_TEST",
  customerId: "CUST_TEST",

  amountInr: 1500,

  paymentMethod: "card",
  failureType: "network_timeout",

  hourOfDay: 14,
  minutesSinceFailure: 30,
  retryCount: 0,

  previousPayments: 10,
  previousSuccesses: 8,
  previousSuccessRate: 0.8,

  recoveryProbability: 0.79,
  recovered: false
};

const decision = {
  action: "RETRY_NOW" as const,
  reason: "Temporary failure with acceptable recovery probability"
};

const result = execute(payment, decision);

console.log("Execution Result");
console.log("----------------");
console.log("Action:", result.action);
console.log("Success:", result.success);
console.log("Message:", result.message);