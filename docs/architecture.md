# RevivePay — Architecture

> Basic architecture document (to be fleshed out today)

## Overview

RevivePay is an AI-powered failed-payment recovery agent.

## Directory Structure

```
src/
├── data/          — batch data generation
├── agent/         — core AI agent modules
│   ├── classifier       — classifies failure reasons
│   ├── decisionEngine   — decides retry strategy
│   ├── executor         — executes recovery actions
│   └── simulator        — simulates payment outcomes
├── services/      — external service integrations (Razorpay, etc.)
├── audit/         — audit logging
├── report/        — summary & reporting
├── types/         — shared TypeScript types
└── index.ts       — entry point
```
