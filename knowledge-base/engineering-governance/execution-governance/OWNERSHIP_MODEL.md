# Ownership Model

This document defines ownership of systems, decisions, and outcomes.

## Ownership Levels

| Level | Owner | Scope |
|-------|-------|-------|
| Strategic | Leadership | Vision, priorities, investment |
| Architectural | Architecture Board | ADRs, cross-cutting patterns |
| Domain | Domain Lead | Domain specifications and coherence |
| Repository | Repository Owner | Repository health and standards |
| Feature | Feature Owner | Feature delivery and acceptance |
| Task | Assignee | Task execution and verification |

## Repository Ownership

Every repository has a single Repository Owner.

Responsibilities:

- Ensure AGENT_CONTEXT.md is current.
- Maintain repository standards.
- Approve repository-level changes.
- Coordinate releases.

## Domain Ownership

Domains map to areas such as authentication, billing, analytics, or integrations.

Responsibilities:

- Approve domain specifications.
- Resolve domain disputes.
- Maintain domain knowledge base.

## Decision Ownership

See [DECISION_AUTHORITY.md](DECISION_AUTHORITY.md) for decision ownership by category.

## Transfer of Ownership

Ownership transfers require:

- Documentation update
- Knowledge transfer
- Registry update
- Approval from outgoing and incoming owners

## Accountability

Owners are accountable for:

- Quality of their area
- Timely responses to issues
- Compliance with governance
- Accurate documentation
