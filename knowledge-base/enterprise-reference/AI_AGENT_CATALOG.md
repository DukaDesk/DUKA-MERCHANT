# AI Agent Catalog

This document catalogs all AI agents used in DUKADESK OS engineering.

## Agents

| ID | Name | Primary Area | Secondary Areas | Capabilities | Owner |
|----|------|--------------|-----------------|--------------|-------|
| AGE-001 | @agent-alpha | Backend | Infrastructure, SDK | Implementation, review | Team E |
| AGE-002 | @agent-beta | Runtime / Builder | CLI | Implementation, review | Team C |
| AGE-003 | @agent-gamma | Mobile | Website | Implementation, review | Team F |
| AGE-004 | @agent-delta | Dashboards | Commerce | Implementation, review | Team H |
| AGE-005 | @agent-epsilon | Identity | Security | Implementation, review | Team B |
| AGE-006 | @agent-zeta | AI / Analytics | Integrations | Implementation, review | Team J |
| AGE-007 | @agent-eta | DevEx / Tooling | CI/CD | Implementation, documentation | DevEx |
| AGE-008 | @agent-theta | Platform Operations | Observability | Operations, verification | Platform Ops |

## Agent Roles

Every task declares:

```text
Implementation Agent
Review Agent
Verification Agent
Documentation Agent
```

No single AI agent should perform all four roles on the same task.

## Assignment Rules

1. Match agent primary area to task domain.
2. Separate implementation and review roles.
3. Use verification agents for quality gates.
4. Escalate to humans for security, compliance, or architecture decisions.

## Maintenance

This catalog is updated when agents are added, retired, or reassigned.
