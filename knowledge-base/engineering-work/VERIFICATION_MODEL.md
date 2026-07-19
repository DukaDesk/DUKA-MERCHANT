# Verification Model

This document defines the verification gates that must be satisfied before a Task can close.

## Verification Gates

A Task cannot close until all of the following gates are satisfied:

```text
Specification satisfied
Architecture aligned
Tests pass
Review approved
Documentation updated
Traceability complete
```

## Gate Definitions

### Specification Satisfied
- All acceptance criteria from the linked Engineering Specification are met.
- The implementation matches the scope defined in the Task.
- Out-of-scope items have not been introduced without approval.

### Architecture Aligned
- The implementation follows approved ADRs.
- Patterns and conventions from Repository Governance are respected.
- Cross-cutting concerns are handled consistently.

### Tests Pass
- Unit tests pass.
- Integration tests pass.
- Relevant end-to-end tests pass.
- Manual verification completed where automated coverage is insufficient.

### Review Approved
- Code review completed by an independent Review Agent or human reviewer.
- All blocking comments resolved.
- Security and quality concerns addressed.

### Documentation Updated
- Code comments and README updated if needed.
- AGENT_CONTEXT.md updated if repository structure or conventions change.
- Change history recorded.

### Traceability Complete
- Task references the Engineering Specification.
- Pull Request references the Task and Specification.
- Commit messages include the Task and Specification IDs.
- Verification evidence is linked.

## Verification Evidence

Each Task must include:

| Evidence | Description |
|----------|-------------|
| Test results | Links to CI runs or test reports |
| Review approval | PR approval record |
| Documentation links | Updated docs or context files |
| Traceability links | Spec, Task, PR, and commit references |

## Verification Notation

Record verification status in the Task file:

```yaml
---
verification_status: Complete
---
```

## Verification Responsibilities

| Role | Responsibility |
|------|----------------|
| Verification Agent | Confirm all gates are satisfied. |
| Review Agent | Approve code and design. |
| Engineering Lead | Resolve disputes and approve exceptions. |

## Exceptions

Any exception to a verification gate requires documented approval from the Engineering Lead and is recorded in the Task `Change History`.
