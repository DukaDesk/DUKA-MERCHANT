# Error Budget Policy

This document defines how error budgets are calculated and consumed.

## Purpose

Error budgets balance reliability with the ability to ship changes. They protect the platform from excessive risk while allowing innovation.

## Calculation

```text
Error Budget = 100% - SLO Target
```

Example: For a 99.9% availability SLO, the error budget is 0.1% downtime over the measurement window.

## Consumption

Error budget is consumed by:

- Downtime
- Latency breaches
- Error rate spikes
- Planned maintenance exceeding budget

## Budget States

| State | Budget Remaining | Action |
|-------|------------------|--------|
| Healthy | > 50% | Normal operations |
| At Risk | 25% - 50% | Reduce risky changes |
| Depleted | < 25% | Freeze non-critical releases |
| Exhausted | 0% | Halt releases; prioritize reliability |

## Release Freezes

When the error budget is depleted:

- Stop non-critical deployments.
- Prioritize reliability fixes.
- Require executive approval for exceptions.

## Recovery

Error budget replenishes at the start of each measurement window.

## Reporting

Error budget status is reported weekly and included in release readiness decisions.

## Exceptions

Emergency fixes that prevent further budget burn may be approved outside the freeze policy.
