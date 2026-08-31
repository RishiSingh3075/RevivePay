# RevivePay

> An AI-assisted revenue recovery agent for failed and abandoned payments.

RevivePay is an experimental payment recovery system built for the Razorpay AI Buildathon.

The system detects failed or abandoned payments, classifies the failure reason, determines a bounded recovery action, executes eligible recovery attempts through Razorpay Test Mode, simulates customer responses, and maintains an audit trail of every decision.

The goal is not to retry every failed payment. RevivePay is designed to recover revenue **safely**, using explicit retry limits, time-based stopping rules, and deterministic decision logic.

## What RevivePay Does

```text
Failed / Abandoned Payments
            ↓
      Failure Classifier
            ↓
      Decision Engine
            ↓
   ┌────────┼─────────┐
   ↓        ↓         ↓
 Retry     Wait    Escalate / Stop
   ↓
Razorpay Payment Link
   ↓
Customer Response Simulator
   ↓
 Audit Log + Recovery Report
```

### Planned capabilities

* Generate synthetic failed-payment batches for testing
* Classify payment failure reasons
* Decide whether to retry, wait, escalate, or stop
* Enforce recovery safety rules and retry limits
* Create Razorpay Test Mode Payment Links
* Simulate customer payment outcomes
* Maintain an append-only audit trail
* Calculate recovered revenue and recovery rate
* Evaluate recovery strategies using synthetic data
* Explore ML-assisted recovery prediction

## Safety Rules

RevivePay uses deterministic safeguards around financial actions.

Examples include:

* Maximum retry attempts per payment
* No recovery action after a successful payment
* Hard stop after the recovery window expires
* Explicit handling for different failure categories
* No automatic action when the system cannot justify a recovery attempt

The AI/ML components provide intelligence to the system, while the decision layer remains bounded and explainable.

## Architecture

The high-level architecture is documented in:

`docs/architecture.md`

The main pipeline is:

```text
Batch
  ↓
Classifier
  ↓
Decision Engine
  ↓
Executor
  ↓
Customer Simulator
  ↓
Audit Log
  ↓
Recovery Report
```

## Tech Stack

* Node.js
* TypeScript
* Express
* Razorpay Test Mode APIs
* Razorpay Node.js SDK
* AI/ML components for classification and recovery prediction
* JSON/JSONL for lightweight audit logging

## Project Status

🚧 **Under development**

This project is being built as part of the Razorpay AI Buildathon 2026.

## Disclaimer

This project uses Razorpay **Test Mode** and synthetic/simulated payment data. It is intended for experimentation and demonstration purposes and does not process real customer payments.
