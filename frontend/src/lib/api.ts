// ============================================================
// API Client — communicates with the Express backend
// ============================================================

import type { Payment, AuditEntry, RecoveryResponse } from "../types";

const BASE = "/api";

export async function fetchPayments(): Promise<Payment[]> {
  const res = await fetch(`${BASE}/payments`);
  if (!res.ok) throw new Error(`Failed to load payments: ${res.statusText}`);
  return res.json();
}

export async function runRecovery(): Promise<RecoveryResponse> {
  const res = await fetch(`${BASE}/recover`, { method: "POST" });
  if (!res.ok) throw new Error(`Recovery failed: ${res.statusText}`);
  return res.json();
}

export async function fetchAuditLog(): Promise<AuditEntry[]> {
  const res = await fetch(`${BASE}/audit`);
  if (!res.ok) throw new Error(`Failed to load audit log: ${res.statusText}`);
  return res.json();
}
