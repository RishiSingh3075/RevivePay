import { loadPayments } from "./loadPayments.js";

const payments = loadPayments(
  "data/revivepay_fresh_payments.csv"
);

console.log("Failed payments loaded:", payments.length);

console.log("\nFirst payment:");
console.log(payments[0]);

console.log("\nLast payment:");
console.log(payments[payments.length - 1]);