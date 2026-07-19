# Traceability Model

This document defines the traceability chain from strategic intent to released capability. Every engineering specification must participate in this chain.

## Chain

```text
Vision
    ↓
Knowledge Base
    ↓
ADR
    ↓
Engineering Specification
    ↓
Repository
    ↓
Work Item
    ↓
Pull Request
    ↓
Verification
    ↓
Release
```

## Model Nodes

### Vision
- The strategic goal or product objective.
- May live in product documentation or a knowledge base.
- Every specification must reference at least one vision statement.

### Knowledge Base
- Domain knowledge, user research, constraints, and standards.
- Specifications should cite relevant knowledge base articles.

### ADR
- Architecture Decision Record that records a significant technical decision.
- Specifications must link to ADRs that constrain or enable them.

### Engineering Specification
- This repository.
- The technical plan that drives implementation.

### Repository
- The implementation repository or repositories where the work is done.
- Examples: `backend/`, `mobile/`, `website/`, `sdk/`, `cli/`.

### Work Item
- A ticket, issue, or task that tracks the implementation effort.
- Must reference the engineering specification by ID.

### Pull Request
- A code change that implements part or all of the specification.
- Must reference the engineering specification and the work item.

### Verification
- Tests, reviews, and acceptance evidence.
- Must demonstrate that acceptance criteria are satisfied.

### Release
- The shipped version that contains the implemented specification.
- Must reference the specification and verification report.

## Tracing Requirements

- Every specification must identify its parent ADR.
- Every specification must identify target repositories.
- Every work item must reference one or more specification IDs.
- Every pull request must reference at least one work item and one specification.
- Every verification report must reference the specification acceptance criteria.
- Every release note must list the specifications included.

## Linking Conventions

- Use absolute URLs when linking to external systems.
- Use relative file paths when linking within this repository.
- Use the specification ID in commit messages and pull request titles.

Example PR title:

```text
[FEAT-0001] Add multi-tenant workspace onboarding flow
```

Example commit message:

```text
FEAT-0001: implement workspace onboarding API endpoint

Relates to ADR-0012. Closes work-item #432.
```

## Verification

Traceability is verified during release readiness. Missing links block release.
