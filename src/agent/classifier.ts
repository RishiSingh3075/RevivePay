import { spawnSync } from "child_process";
import { Payment } from "../types/index.js";

export function getRecoveryProbability(payment: Payment): number {

  const input = JSON.stringify({
    amount_inr: payment.amountInr,
    payment_method: payment.paymentMethod,
    failure_type: payment.failureType,
    hour_of_day: payment.hourOfDay,
    minutes_since_failure: payment.minutesSinceFailure,
    retry_count: payment.retryCount,
    previous_payments: payment.previousPayments,
    previous_successes: payment.previousSuccesses,
    previous_success_rate: payment.previousSuccessRate
  });

  const result = spawnSync(
    "python",
    ["src/ml/predict.py"],
    {
      input,
      encoding: "utf-8"
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(result.stderr);
  }

  const output = JSON.parse(result.stdout);

  return output.recoveryProbability;
}