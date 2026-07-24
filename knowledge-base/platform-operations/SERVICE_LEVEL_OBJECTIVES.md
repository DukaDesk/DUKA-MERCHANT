# Service Level Objectives

This document defines the SLOs for DUKADESK OS services.

## Purpose

Service Level Objectives (SLOs) set measurable reliability targets. They guide trade-offs between feature velocity and platform stability.

## SLO Format

Each SLO includes:

- Service
- Indicator
- Target
- Measurement window
- Error budget

## Example SLOs

| Service | Indicator | Target | Window |
|---------|-----------|--------|--------|
| API | Availability | 99.9% | 30 days |
| API | Latency p99 | < 500ms | 30 days |
| Auth | Availability | 99.99% | 30 days |
| Dashboard | Error rate | < 0.1% | 30 days |

## Error Budget

Error budget is derived from the SLO target. See [ERROR_BUDGET_POLICY.md](ERROR_BUDGET_POLICY.md).

## Review

SLOs are reviewed quarterly and after major incidents.

## Escalation

If an SLO is at risk of being breached:

1. Notify service owner.
2. Halt non-critical changes if needed.
3. Prioritize reliability work.

## SLO Definitions by Tier

| Tier | Availability Target | Latency Target |
|------|---------------------|----------------|
| Tier 1 | 99.99% | p99 < 200ms |
| Tier 2 | 99.9% | p99 < 500ms |
| Tier 3 | 99.5% | p99 < 1000ms |
