import { logAudit } from "./auditLog.js";

const entry = {
  paymentId: "PAY_TEST",
  customerId: "CUST_TEST",
  amountInr: 1500,
  failureType: "network_timeout",
  recoveryProbability: 0.78,
  action: "RETRY_NOW",
  reason: "Temporary failure with acceptable recovery probability",
  executionSuccess: true,
  executionMessage: "Payment recovered successfully",
  timestamp: new Date().toISOString()
};

logAudit(entry);