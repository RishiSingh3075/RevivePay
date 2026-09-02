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
  failureType: FailureType;
  minutesSinceFailure: number;
  retryCount: number;
  previousSuccessRate: number;
  recoveryProbability?: number;
  recovered?: boolean;
}

export interface Decision {
  action: RecoveryAction;
  reason: string;
}