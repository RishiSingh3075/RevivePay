import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { Payment, FailureType, PaymentStatus } from "../types/index.js";

export function loadPayments(filePath: string): Payment[] {

  const csvData = fs.readFileSync(filePath, "utf-8");

  const rows = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  const payments: Payment[] = rows.map((row: any) => ({
    paymentId: row.paymentId,
    customerId: row.customerId,
    amountInr: Number(row.amountInr),

    status: row.status as PaymentStatus,

    paymentMethod: row.paymentMethod,

    failureType:
      row.failureType
        ? row.failureType as FailureType
        : undefined,

    hourOfDay: Number(row.hourOfDay),
    minutesSinceFailure: Number(row.minutesSinceFailure),
    retryCount: Number(row.retryCount),

    previousPayments: Number(row.previousPayments),
    previousSuccesses: Number(row.previousSuccesses),
    previousSuccessRate: Number(row.previousSuccessRate),

    recovered: Boolean(Number(row.recovered))
  }));

  return payments;
}