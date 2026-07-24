# Technical Debt Policy

This document defines how technical debt is managed.

## Debt Definition

Technical debt is a deliberate or accrued shortcut in design, implementation, or process that will require future effort to remediate.

## Debt Record

Every debt item records:

```text
Reason
Impact
Priority
Owner
Related Specification
Related ADR
Resolution Plan
```

## Debt Categories

| Category | Description |
|----------|-------------|
| Deliberate | Known shortcut taken to meet a deadline |
| Accidental | Debt discovered during maintenance |
| Bit rot | Degradation over time due to neglect |
| Architectural | Debt requiring significant redesign |

## Debt Lifecycle

```text
Identify
    ↓
Record
    ↓
Assess
    ↓
Plan
    ↓
Prioritize
    ↓
Resolve
    ↓
Verify
```

## Prioritization

Debt is prioritized based on:

- Impact on reliability
- Impact on development velocity
- Security risk
- Maintenance cost
- Strategic alignment

## Resolution Plan

Every debt item must have:

- Estimated effort
- Proposed approach
- Target resolution date
- Acceptance criteria

## Tracking

Debt is tracked in:

- Repository `ARCHITECTURE_ALIGNMENT.md`
- Engineering work registry
- Domain and architecture reviews

## Debt Budget

A portion of each cycle is allocated to debt reduction. The allocation is reviewed quarterly.

## Policy

- No undocumented debt.
- Deliberate debt requires approval.
- High-impact debt is resolved before new features when possible.
