# DUKADESK AI Agent Boot Process

**Last Updated:** 2026-07-09

Every AI engineering agent MUST execute this sequence before performing any task. Skipping any step is a process violation.

## Boot Sequence

```
Initialize Workspace
    │
    ▼
Synchronize Knowledge Base
    │
    ▼
Read README
    │
    ▼
Read Progress Registry
    │
    ▼
Read ADR Index
    │
    ▼
Read Core Principles
    │
    ▼
Read Platform Glossary
    │
    ▼
Read Engineering Standards
    │
    ▼
Read Target Specification
    │
    ▼
Determine Requested Task
    │
    ▼
Perform Task
    │
    ▼
Run Self Review
    │
    ▼
Generate Summary
```

## Initialization Requirements

### Workspace Structure
```
workspace/
├── KNOWLEDGE-BASE/          ← This repository
├── backend/                 ← API services
├── mobile/                  ← React Native app (DukaDesk)
├── builder/                 ← Visual SDUI builder
├── website/                 ← Public website + docs
├── business-dashboard/      ← Business admin
├── tenant-dashboard/        ← Tenant admin
└── infrastructure/          ← DevOps
```

### Branch Rules

1. Never commit directly to `main` or `core` branches
2. Feature branches should be short-lived and focused
3. PRs must reference the Knowledge Base documents they align with

### Task Lifecycle

1. **Receive Task** — Understand the goal
2. **Load Knowledge Base** — Re-sync, read relevant docs
3. **Identify Relevant Documents** — Which ADRs, specs, standards apply?
4. **Review Architecture** — Confirm current architecture supports the task
5. **Review Standards** — Confirm approach follows standards
6. **Implement** — Write code
7. **Self Review** — Check against Knowledge Base and standards
8. **Architecture Review** — Report alignment/discrepancies
9. **Update Documentation** — If architecture changed, update Knowledge Base first
10. **Update Progress Registry** — Mark completion
11. **Complete** — Return summary

## Agent Responsibilities

### Architecture Agent
Architectural consistency, service boundaries, runtime design, platform evolution

### Mobile Agent
React Native, Expo, renderer integration, offline behavior, state management, platform UX

### Backend Agent
Services, APIs, events, queues, persistence, integrations

### Builder Agent
Visual builder, SDUI authoring, publishing, manifests, capabilities

### Documentation Agent
Knowledge Base, developer documentation, tutorials, examples

### Review Agent
Alignment reports, specification verification, architecture compliance, terminology validation.
**Note:** The Review Agent never creates features. It only validates them.

## Conflict Resolution

When conflicts between Knowledge Base and implementation are discovered:
1. Report the conflict
2. Identify the affected documents
3. Recommend an alignment review
4. Do not silently modify architecture
