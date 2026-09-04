import express from "express";
import fs from "node:fs";
import { loadPayments } from "./data/loadPayments.js";
import { getRecoveryProbability } from "./agent/classifier.js";
import { decide } from "./agent/decisionEngine.js";
import { execute } from "./agent/executor.js";
import { logAudit } from "./audit/auditLog.js";
import { Payment } from "./types/index.js";

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

// Phase 6: Get audit log
app.get("/api/audit", (req, res) => {
  try {
    const filePath = "data/audit-log.jsonl";
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }
    
    const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
    const entries = lines.map(line => JSON.parse(line));
    
    // Sort by timestamp descending
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json(entries);
  } catch (error) {
    console.error("Error reading audit log:", error);
    res.status(500).json({ error: "Failed to load audit log" });
  }
});

// Phase 4: Run recovery pipeline
app.post("/api/recover", (req, res) => {
  try {
    const allPayments = loadPayments("data/revivepay_fresh_payments.csv");
    const failedPayments = allPayments.filter(p => p.status === "failed");

    const results = [];
    const summary = {
      totalProcessed: failedPayments.length,
      recovered: 0,
      retryLater: 0,
      escalated: 0,
      stopped: 0,
      totalAmountRecovered: 0
    };

    for (const payment of failedPayments) {
      // 1. Predict
      const recoveryProbability = getRecoveryProbability(payment);
      const classifiedPayment: Payment = { ...payment, recoveryProbability };

      // 2. Decide
      const decision = decide(classifiedPayment);

      // 3. Execute
      const execution = execute(classifiedPayment, decision);

      // 4. Audit
      logAudit({
        paymentId: payment.paymentId,
        customerId: payment.customerId,
        amountInr: payment.amountInr,
        failureType: payment.failureType ?? "unknown",
        recoveryProbability,
        action: decision.action,
        reason: decision.reason,
        executionSuccess: execution.success,
        executionMessage: execution.message,
        timestamp: new Date().toISOString()
      });

      // Track summary
      if (execution.success) {
        summary.recovered++;
        summary.totalAmountRecovered += payment.amountInr;
      } else if (decision.action === "RETRY_LATER") summary.retryLater++;
      else if (decision.action === "ESCALATE") summary.escalated++;
      else if (decision.action === "STOP") summary.stopped++;

      // Store result
      results.push({
        payment,
        recoveryProbability,
        decision,
        execution,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      results,
      summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error running recovery:", error);
    res.status(500).json({ error: "Failed to run recovery pipeline" });
  }
});

app.listen(PORT, () => {

  console.log(`=================================`);
  console.log(`  REVIVEPAY API SERVER`);
  console.log(`  Listening on port ${PORT}`);
  console.log(`=================================`);
});
