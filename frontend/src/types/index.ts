// ============================================================
// Types — mirrors the backend types without importing them
// ============================================================

export type PaymentStatus = "successful" | "failed";

export type FailureType =
  | "card_declined"
  | "insufficient_funds"
  | "network_timeout"
  | "checkout_abandoned";

export type RecoveryAction =
  | "RETRY_NOW"
  | "RETRY_LATER"
  | "ESCALATE"
  | "STOP";

export interface Payment {
  paymentId: string;
  customerId: string;
  amountInr: number;
  status: PaymentStatus;
  paymentMethod?: string;
  failureType?: FailureType;
  hourOfDay?: number;
  minutesSinceFailure: number;
  retryCount: number;
  previousPayments?: number;
  previousSuccesses?: number;
  previousSuccessRate: number;
  recoveryProbability?: number;
  recovered?: boolean;
}

export interface Decision {
  action: RecoveryAction;
  reason: string;
}

export interface ExecutionResult {
  action: string;
  success: boolean;
  message: string;
}

export interface AuditEntry {
  paymentId: string;
  customerId: string;
  amountInr: number;
  failureType: string;
  recoveryProbability: number;
  action: string;
  reason: string;
  executionSuccess: boolean;
  executionMessage: string;
  timestamp: string;
}

// Per-payment result returned by the recovery endpoint
export interface RecoveryResult {
  payment: Payment;
  recoveryProbability: number;
  decision: Decision;
  execution: ExecutionResult;
}

// Full response from POST /api/recover
export interface RecoveryResponse {
  results: RecoveryResult[];
  summary: {
    totalProcessed: number;
    recovered: number;
    retryLater: number;
    escalated: number;
    stopped: number;
    totalAmountRecovered: number;
  };
  timestamp: string;
}

// Log event for the agent activity panel
export interface LogEvent {
  id: string;
  timestamp: string;
  paymentId: string;
  action: "CLASSIFY" | "PREDICT" | "DECIDE" | "EXECUTE";
  detail: string;
  color: "success" | "amber" | "red" | "blue" | "neutral";
}
