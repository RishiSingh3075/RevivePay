import { Payment, Decision } from "../types/index.js";
import { simulateRetry } from "./simulator.js";

export interface ExecutionResult {
  action: string;
  success: boolean;
  message: string;
}

export function execute(
  payment: Payment,
  decision: Decision
): ExecutionResult {

  switch (decision.action) {

    case "RETRY_NOW": {
      const result = simulateRetry(payment);

      return {
        action: "RETRY_NOW",
        success: result.success,
        message: result.message
      };
    }

    case "RETRY_LATER":
      return {
        action: "RETRY_LATER",
        success: false,
        message: `Retry scheduled for payment ${payment.paymentId}`
      };

    case "ESCALATE":
      return {
        action: "ESCALATE",
        success: false,
        message: `Payment ${payment.paymentId} escalated for intervention`
      };

    case "STOP":
      return {
        action: "STOP",
        success: false,
        message: `No action taken for payment ${payment.paymentId}`
      };

    default:
      return {
        action: "STOP",
        success: false,
        message: "Unknown action"
      };
  }
}