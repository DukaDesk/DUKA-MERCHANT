# AI Assignment Model

This document defines how AI agents are assigned to engineering tasks and the role separation rules.

## Agent Roles

Every Task declares the following roles:

| Role | Responsibility |
|------|----------------|
| Implementation Agent | Writes code, tests, and configuration to satisfy the Task. |
| Review Agent | Reviews the implementation for correctness, quality, and alignment. |
| Verification Agent | Confirms acceptance criteria, tests, and traceability. |
| Documentation Agent | Updates documentation, context, and records. |

## Role Separation Rule

No single AI agent should perform all four roles on the same task.

At minimum:

- Implementation and Review must be performed by different agents.
- Verification should be independent of Implementation.
- Documentation may be performed by the Implementation Agent, but must be reviewed if so.

## Assignment Declaration

Each Task file declares agents in its header:

```yaml
---
implementation_agent: "@agent-alpha"
review_agent: "@agent-beta"
verification_agent: "@agent-gamma"
documentation_agent: "@agent-alpha"
---
```

## Human Override

A human may replace or supervise any AI role. When a human is the assignee, record:

```yaml
---
assignee: "@human-handle"
ai_assisted: true
---
```

## Role Responsibilities

### Implementation Agent
- Create branches and write code.
- Follow specifications and repository standards.
- Add tests and update documentation.
- Open pull requests.

### Review Agent
- Review pull requests.
- Check specification alignment.
- Verify tests, style, and security.
- Request changes or approve.

### Verification Agent
- Run or review test results.
- Confirm acceptance criteria are met.
- Validate traceability links.
- Sign off on verification gates.

### Documentation Agent
- Update README, AGENT_CONTEXT, and runbooks.
- Record change history.
- Ensure onboarding docs remain accurate.

## Conflict Resolution

If an agent disagrees with a review or verification outcome, escalate to the Engineering Lead or a human reviewer.

## Audit

Role assignments are recorded in Task files and registry indexes. Compliance is checked during release readiness.
