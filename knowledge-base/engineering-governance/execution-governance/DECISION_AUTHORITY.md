# Decision Authority

This document defines who has authority for different types of decisions.

## Authority Model

```text
Vision
        Owner: Leadership

Architecture
        Owner: Architecture Board

Engineering Specifications
        Owner: Engineering

Implementation
        Owner: Repository Teams

Operations
        Owner: Platform Operations
```

## Decision Categories

| Category | Authority | Input |
|----------|-----------|-------|
| Vision and strategy | Leadership | Architecture Board, Product |
| Technology strategy | Architecture Board | Domain Leads |
| Architecture decisions | Architecture Board | Domain Leads, Repository Owners |
| Engineering specifications | Domain Leads | Engineering, Architecture Board |
| Repository standards | Repository Owners | Architecture Board |
| Implementation approach | Repository Teams | Architecture Board |
| Operations procedures | Platform Operations | Engineering |
| Incident response | Incident Commander | Platform Operations |
| Technical debt prioritization | Domain Leads | Repository Owners |
| Architecture exceptions | Architecture Board | Domain Leads |

## Decision Records

Significant decisions are recorded as:

- ADRs for architecture decisions
- Specification changes for engineering decisions
- Change records for operational decisions

## Delegation

Authority may be delegated in writing. Delegation does not remove accountability from the original authority.

## Dispute Resolution

When decision authorities disagree:

1. Discuss and seek consensus.
2. Escalate to the next authority level.
3. Record the decision and rationale.

## Emergency Authority

During incidents, the Incident Commander has temporary authority to make operational decisions to restore service. Post-incident review validates those decisions.
