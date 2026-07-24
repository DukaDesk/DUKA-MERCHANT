# Specification Governance

This document defines ownership, quality rules, and approval authority for engineering specifications.

## Ownership

| Role | Responsibility |
|------|----------------|
| Author | Creates and maintains the specification through the lifecycle. |
| Domain Lead | Reviews for domain correctness and completeness. |
| Architecture Lead | Reviews for alignment with system architecture and ADRs. |
| Security Lead | Reviews security specifications and security-sensitive changes. |
| Engineering Lead | Assigns resources and confirms readiness. |
| Verification Lead | Confirms acceptance criteria are testable and verified. |
| Governance Lead | Maintains the index, numbering, and archival process. |

## Approval Authority

| Transition | Minimum Approvers |
|------------|-------------------|
| Draft → Review | Author |
| Review → Approved | Domain Lead + Architecture Lead |
| Approved → Ready | Engineering Lead |
| Ready → Implemented | Implementer (code-complete sign-off) |
| Implemented → Verified | Verification Lead |
| Verified → Deprecated | Product Lead + Architecture Lead |
| Deprecated → Archived | Governance Lead |

## Quality Rules

1. Every specification must use the standard template for its domain.
2. Every specification must contain all required sections.
3. Every requirement must be atomic, testable, and uniquely identifiable.
4. Every acceptance criterion must map to one or more requirements.
5. Every dependency must include a concrete link or reference.
6. Every change after approval must be recorded in `Change History`.
7. Every specification must remain readable in plain Markdown.

## Review Checklist

- [ ] Identifier follows the numbering standard.
- [ ] Title is clear and specific.
- [ ] Purpose and problem are stated.
- [ ] Scope is bounded with explicit out-of-scope items.
- [ ] Requirements are complete and testable.
- [ ] Dependencies and architecture references are listed.
- [ ] Related ADRs are linked.
- [ ] Repository targets are identified.
- [ ] Acceptance criteria cover the requirements.
- [ ] Verification method is described.
- [ ] Related specifications are linked.
- [ ] Change history is present.

## Change Control

See [CHANGE_MANAGEMENT.md](CHANGE_MANAGEMENT.md) for the process to modify an approved specification.

## Escalation

If approvers disagree, escalate to the Architecture Steering Group. The group decision is recorded in the specification `Change History`.
