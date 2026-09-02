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
* AI/ML components for classification and recovery prediction
* JSON/JSONL for lightweight audit logging

## Project Status

🚧 **Under development**


## Disclaimer

This project uses synthetic/simulated payment data. It is intended for experimentation and demonstration purposes and does not process real customer payments.


## ML Baseline

RevivePay uses historical payment data to estimate whether a failed
payment is likely to be recovered.

### Prediction Target

The model performs binary classification:

- `0` → payment was not recovered
- `1` → payment was recovered

### Features

The baseline model uses:

- Payment amount
- Payment method
- Failure type
- Hour of day
- Time since failure
- Retry count
- Previous payment count
- Previous successful payments
- Previous success rate

### Baseline Model-I

The initial model is a Logistic Regression classifier.

The preprocessing pipeline:
1. One-hot encodes categorical features such as payment method and failure type.
2. Passes numerical features to the classifier.
3. Trains the Logistic Regression model on 80% of the historical data.
4. Evaluates it on the remaining 20%.

### Baseline Results

| Metric | Result |
|---|---:|
| Test samples | 2,000 |
| Accuracy | 71.05% |
| Precision — Recovery | 64% |
| Recall — Recovery | 44% |
| F1 — Recovery | 52% |

This model is intentionally treated as a baseline rather than a
production-ready model. Future iterations may evaluate additional
models, feature engineering, threshold tuning, and class-imbalance
handling.

The training experiment is available in
`notebooks/revivepay_ml_baseline.ipynb`.

## Why Machine Learning?

A fixed rule-based system can handle obvious payment failures, but
historical payment behavior can provide additional signals when
deciding whether a failed payment is worth attempting to recover.

RevivePay therefore uses an ML classifier as a prediction layer,
while keeping the final recovery decision bounded by explicit
business and safety rules.

The ML model does not directly control payment execution.

## Decision Engine

RevivePay uses a rule-based decision engine after estimating the recovery probability of a failed payment.

The engine evaluates:

- Whether the payment is already recovered
- Maximum retry limit
- Age of the failed payment
- Recovery probability threshold
- Failure type

Based on these conditions, it selects one of four actions:

- `RETRY_NOW`
- `RETRY_LATER`
- `ESCALATE`
- `STOP`

The decision engine also acts as a safety layer, preventing unnecessary or repeated payment attempts.