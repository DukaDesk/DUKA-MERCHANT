# Escalation Model

This document defines escalation paths for engineering issues and decisions.

## When to Escalate

Escalate when:

- A decision cannot be made at the current level.
- A blocker threatens a milestone or release.
- A security, compliance, or safety issue arises.
- An architecture exception is needed.
- A dispute between teams cannot be resolved.

## Escalation Path

```text
Implementer
    ↓
Feature Owner
    ↓
Repository Owner
    ↓
Domain Lead
    ↓
Architecture Board
    ↓
Leadership
```

## Escalation Levels

| Level | Trigger | Response Time |
|-------|---------|---------------|
| L1 | Task or repository issue | Same day |
| L2 | Domain or cross-team issue | 24 hours |
| L3 | Architecture or strategic issue | 48 hours |
| L4 | Executive or business-critical issue | 24 hours |

## Incident Escalation

Incident escalation follows [INCIDENT_MANAGEMENT.md](../../platform-operations/INCIDENT_MANAGEMENT.md).

## Escalation Format

```markdown
# Escalation: <Title>

## From

## To

## Issue

## Impact

## Options Considered

## Recommended Path

## Decision Needed
```

## AI Agent Escalation

AI agents must escalate when:

- They are uncertain about a decision.
- A change conflicts with approved architecture.
- A security or compliance risk is identified.
- Human approval is required by policy.

## Documentation

All escalations and resolutions are recorded in the appropriate work item or repository.
