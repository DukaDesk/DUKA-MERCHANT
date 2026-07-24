# AI Assignments

This document defines how AI agents are assigned across implementation areas.

## Agent Roles

Every task declares:

```text
Implementation Agent
Review Agent
Verification Agent
Documentation Agent
```

No single AI agent should perform all four roles on the same task.

## Agent Pool

| Agent | Primary Area | Secondary Areas |
|-------|--------------|-----------------|
| @agent-alpha | Backend | Infrastructure, SDK |
| @agent-beta | Runtime / Builder | CLI |
| @agent-gamma | Mobile | Website |
| @agent-delta | Dashboards | Commerce |
| @agent-epsilon | Identity | Security |
| @agent-zeta | AI / Analytics | Integrations |
| @agent-eta | DevEx / Tooling | CI/CD |
| @agent-theta | Platform Operations | Observability |

## Assignment Rules

1. Assign Implementation Agent based on repository and capability area.
2. Assign Review Agent from a different agent or human reviewer.
3. Assign Verification Agent independently of implementation.
4. Documentation Agent may overlap with implementation but must be reviewed.

## Workload Balancing

- Agent capacity is tracked in the engineering work registry.
- No agent should be assigned more concurrent tasks than it can complete effectively.
- Human oversight is required for high-risk or ambiguous tasks.

## Escalation

AI agents escalate to human leads when:

- A decision conflicts with approved architecture.
- A security or compliance issue arises.
- A task exceeds the agent's confidence threshold.
- Human approval is required by policy.

## Metrics

AI contribution is tracked in [SUCCESS_CRITERIA.md](SUCCESS_CRITERIA.md).
