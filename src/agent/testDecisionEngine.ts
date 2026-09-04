import { decide } from "./decisionEngine.js";
import type { Payment } from "../types/index.js";

const testPayments: Payment[] = [
  {
    paymentId: "PAY_001",
    customerId: "CUST_001",
    amountInr: 1000,
    status: "failed",
    failureType: "checkout_abandoned",
    minutesSinceFailure: 30,
    retryCount: 0,
    previousSuccessRate: 0.8,
    recoveryProbability: 0.78,
    recovered: false
  },

  {
    paymentId: "PAY_002",
    customerId: "CUST_002",
    amountInr: 2500,
    status: "failed",
    failureType: "insufficient_funds",
    minutesSinceFailure: 120,
    retryCount: 0,
    previousSuccessRate: 0.6,
    recoveryProbability: 0.65,
    recovered: false
  },

  {
    paymentId: "PAY_003",
    customerId: "CUST_003",
    amountInr: 5000,
    status: "failed",
    failureType: "card_declined",
    minutesSinceFailure: 60,
    retryCount: 0,
    previousSuccessRate: 0.5,
    recoveryProbability: 0.70,
    recovered: false
  },

  {
    paymentId: "PAY_004",
    customerId: "CUST_004",
    amountInr: 3000,
    status: "failed",
    failureType: "network_timeout",
    minutesSinceFailure: 100,
    retryCount: 2,
    previousSuccessRate: 0.8,
    recoveryProbability: 0.90,
    recovered: false
  },

  {
    paymentId: "PAY_005",
    customerId: "CUST_005",
    amountInr: 4000,
    status: "failed",
    failureType: "network_timeout",
    minutesSinceFailure: 2000,
    retryCount: 0,
    previousSuccessRate: 0.8,
    recoveryProbability: 0.90,
    recovered: false
  },

  {
    paymentId: "PAY_006",
    customerId: "CUST_006",
    amountInr: 1500,
    status: "failed",
    failureType: "checkout_abandoned",
    minutesSinceFailure: 50,
    retryCount: 0,
    previousSuccessRate: 0.2,
    recoveryProbability: 0.20,
    recovered: false
  }
];

for (const payment of testPayments) {
  const decision = decide(payment);

  console.log(
    `${payment.paymentId} → ${decision.action}`
  );

  console.log(`Reason: ${decision.reason}`);
  console.log("-------------------------");
}