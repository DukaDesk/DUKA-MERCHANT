---
identifier: WF-0000
status: Draft
domain: Workflow
created: YYYY-MM-DD
author: @author
---

# WF-0000: Title

## Identifier

WF-0000

## Title

Workflow or business process specification title.

## Purpose

What process this workflow defines and the actors involved.

## Problem

The process gap, inconsistency, or automation need this workflow addresses.

## Scope

### In Scope

- Steps and decisions
- Actors
- States
- Error handling

### Out of Scope

- Processes not covered

## Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| WR-01 | Requirement text | Must |

## Dependencies

- [WF-0001 Title](../workflows/WF-0001.md)

## Architecture References

- [ADR-0000 Title](../adr/ADR-0000.md)

## Related ADRs

- [ADR-0000 Title](../adr/ADR-0000.md)

## Repository Targets

- backend/
- builder/

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-01 | Criterion text | Workflow test |

## Workflow Definition

### Actors

| Actor | Role |
|-------|------|
| ActorName | Description |

### States

| State | Description |
|-------|-------------|
| StateName | Description |

### Flow

```text
Start → Step A → Decision → Step B → End
```

### Error Handling

| Scenario | Action |
|----------|--------|
| Failure | Retry / Escalate |

## Verification

### Scenario Tests

Describe end-to-end workflow scenarios.

### State Machine Tests

Describe state transition validation.

## Out of Scope

Excluded branches, actors, or future automation.

## Related Specifications

- depends-on: [FEAT-0000 Title](../features/FEAT-0000.md)
- related-to: [EVT-0000 Title](../events/EVT-0000.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
