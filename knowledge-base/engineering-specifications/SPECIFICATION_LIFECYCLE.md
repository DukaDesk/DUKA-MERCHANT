# Specification Lifecycle

Specifications move through a defined lifecycle. Each state has clear entry and exit criteria.

## Lifecycle States

```text
Draft
    ↓
Review
    ↓
Approved
    ↓
Ready
    ↓
Implemented
    ↓
Verified
    ↓
Deprecated
    ↓
Archived
```

## State Definitions

### Draft
- **Purpose**: Specification is under active construction.
- **Entry**: A new specification file is created from a template.
- **Exit**: Author believes the specification is complete enough for review.
- **Allowed Changes**: Any.

### Review
- **Purpose**: Specification is evaluated for correctness, completeness, and alignment.
- **Entry**: Author submits the specification for review via a change proposal.
- **Exit**: Reviewers approve, request changes, or reject.
- **Required Reviewers**: At least one domain expert and one architecture representative.

### Approved
- **Purpose**: Specification is accepted as the technical direction.
- **Entry**: Review completed with no blocking concerns.
- **Exit**: Scheduled for implementation and assigned to a team or owner.
- **Restrictions**: May not change scope without a formal change proposal.

### Ready
- **Purpose**: Specification is queued and resourced for implementation.
- **Entry**: Work item created, repository target assigned, owner confirmed.
- **Exit**: Implementation begins.

### Implemented
- **Purpose**: Implementation is code-complete.
- **Entry**: Pull request(s) merged that satisfy the specification.
- **Exit**: Verification activities completed.

### Verified
- **Purpose**: Specification behavior is confirmed by tests, review, and acceptance criteria.
- **Entry**: All acceptance criteria pass and verification evidence is recorded.
- **Exit**: Specification is released or superseded.

### Deprecated
- **Purpose**: Specification is no longer recommended but may still be in production.
- **Entry**: A newer specification supersedes this one, or the capability is being retired.
- **Exit**: All production references removed or the specification is archived.

### Archived
- **Purpose**: Specification is retained for historical reference only.
- **Entry**: No active production references remain and governance approves archival.
- **Exit**: None. Archived specifications are immutable.

## State Transitions

| From | To | Authorized By | Required Evidence |
|------|----|---------------|-------------------|
| Draft | Review | Author | Completed template |
| Review | Approved | Domain + Architecture reviewers | Approval comments |
| Review | Draft | Reviewers | Change request list |
| Approved | Ready | Engineering Lead | Work item link |
| Ready | Implemented | Implementer | Merged PR links |
| Implemented | Verified | QA / Verification Lead | Verification report |
| Verified | Deprecated | Product / Architecture Lead | Deprecation rationale |
| Approved | Deprecated | Product / Architecture Lead | Deprecation rationale |
| Deprecated | Archived | Governance Lead | No active references |

## State Notation

Each specification file must declare its current state in the header metadata:

```yaml
---
status: Verified
---
```

The [SPECIFICATION_INDEX.md](SPECIFICATION_INDEX.md) must be updated whenever a state changes.
