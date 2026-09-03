import { Payment } from "../types/index.js";

export interface SimulationResult {
  success: boolean;
  message: string;
}

export function simulateRetry(payment: Payment): SimulationResult {
  // Simulate a payment retry.
  // In the real system this would call Razorpay/payment infrastructure.

  const success = Math.random() < 0.6;

  if (success) {
    return {
      success: true,
      message: `Payment ${payment.paymentId} recovered successfully`
    };
  }

  return {
    success: false,
    message: `Payment ${payment.paymentId} retry failed`
  };
}