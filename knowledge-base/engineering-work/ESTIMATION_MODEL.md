# Estimation Model

This document defines how effort is estimated for engineering work.

## Estimation Unit

Effort is estimated using abstract units that represent consistent team capacity:

| Unit | Description |
|------|-------------|
| XS | Extra small; less than one day |
| S | Small; one to two days |
| M | Medium; three to five days |
| L | Large; one to two weeks |
| XL | Extra large; more than two weeks; should be split |

## Estimation Rules

1. Tasks are the primary unit of estimation.
2. Features are estimated by summing their Tasks.
3. Epics are estimated by summing their Features.
4. Any Task estimated as XL must be split into smaller Tasks.
5. Estimates include implementation, testing, review, and documentation.

## Confidence Levels

| Level | Meaning |
|-------|---------|
| High | Clear scope, known technology, few unknowns |
| Medium | Some uncertainty or new integration |
| Low | Significant unknowns; consider a Spike first |

## Estimation Process

1. Task author proposes an estimate.
2. Assignee reviews and confirms or challenges.
3. Engineering Lead validates against capacity.
4. Estimate is recorded in the Task file.

## Buffer and Risk

- Low-confidence estimates may include a risk buffer.
- Spikes are created to reduce uncertainty before committing to large estimates.
- Dependencies and external blockers are noted in the estimate rationale.

## Estimation Notation

Record effort in the work item header:

```yaml
---
estimated_effort: M
confidence: High
---
```

## Tracking

Actual effort is compared to estimates during retrospectives to improve calibration.
