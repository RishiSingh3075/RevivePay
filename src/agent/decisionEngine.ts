import { Payment, Decision } from "../types/index.js";

const MAX_RETRIES = 2;
const MAX_AGE_MINUTES = 24 * 60;
const MIN_RECOVERY_PROBABILITY = 0.40;

export function decide(payment: Payment): Decision {

  // Safety rule 1: never act on an already recovered payment
  if (payment.recovered === true) {
    return {
      action: "STOP",
      reason: "Payment has already been successfully recovered"
    };
  }

  // Safety rule 2: maximum retry limit
  if (payment.retryCount >= MAX_RETRIES) {
    return {
      action: "STOP",
      reason: "Maximum retry limit reached"
    };
  }

  // Safety rule 3: payment is too old
  if (payment.minutesSinceFailure > MAX_AGE_MINUTES) {
    return {
      action: "STOP",
      reason: "Payment failure is older than 24 hours"
    };
  }

  const probability = payment.recoveryProbability ?? 0;

  // Low probability → don't waste another payment attempt
  if (probability < MIN_RECOVERY_PROBABILITY) {
    return {
      action: "STOP",
      reason: "Recovery probability is below the minimum threshold"
    };
  }

  // Insufficient funds → wait rather than repeatedly retry
  if (payment.failureType === "insufficient_funds") {
    return {
      action: "RETRY_LATER",
      reason: "Insufficient funds may be resolved later"
    };
  }

  // Card declined → human/business intervention may be required
  if (payment.failureType === "card_declined") {
    return {
      action: "ESCALATE",
      reason: "Card was declined and requires customer intervention"
    };
  }

  // Temporary failures can be retried
  if (
    payment.failureType === "network_timeout" ||
    payment.failureType === "checkout_abandoned"
  ) {
    return {
      action: "RETRY_NOW",
      reason: "Failure appears temporary and recovery probability is acceptable"
    };
  }

  return {
    action: "STOP",
    reason: "No safe recovery action available"
  };
}