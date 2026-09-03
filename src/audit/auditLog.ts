import { appendFileSync, existsSync, writeFileSync } from "node:fs";
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

const LOG_FILE = "data/audit-log.jsonl";

export function logAudit(entry: AuditEntry): void {
  const logLine = JSON.stringify(entry) + "\n";

  if (!existsSync("data")) {
    // The data directory should already exist,
    // but this keeps the logger safe if it doesn't.
    writeFileSync("data/.gitkeep", "");
  }

  appendFileSync(LOG_FILE, logLine);

  console.log(`Audit logged: ${entry.paymentId}`);
}