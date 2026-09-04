import express from "express";
import { loadPayments } from "./data/loadPayments.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Phase 3: Get initial payments data
app.get("/api/payments", (req, res) => {
  try {
    const payments = loadPayments("data/revivepay_fresh_payments.csv");
    res.json(payments);
  } catch (error) {
    console.error("Error loading payments:", error);
    res.status(500).json({ error: "Failed to load payments data" });
  }
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`  REVIVEPAY API SERVER`);
  console.log(`  Listening on port ${PORT}`);
  console.log(`=================================`);
});
