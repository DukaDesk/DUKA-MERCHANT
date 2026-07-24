# Onboarding

This document guides new developers and AI agents through the DUKADESK OS engineering system.

## Welcome

DUKADESK OS uses a layered engineering operating system:

```text
Knowledge Base
        ↓
Engineering Specifications
        ↓
Repository Governance
        ↓
Engineering Work Management
        ↓
Developer Experience
        ↓
Implementation Repositories
```

## Read First

1. [Repository Governance](../repository-governance/README.md)
2. [Engineering Specifications](../../engineering-specifications/README.md)
3. [Engineering Work Management](../../engineering-work/README.md)
4. [Developer Experience](README.md)

## Repository Setup Standard

Every repository must have:

```text
README.md
AGENT_CONTEXT.md
PROGRESS.md
ARCHITECTURE_ALIGNMENT.md
CONTRIBUTING.md
CHANGELOG.md
```

## For Engineers

### Day 1

1. Get access to source control and CI/CD.
2. Clone the repository you will work on.
3. Run the bootstrap script.
4. Read the repository `AGENT_CONTEXT.md`.
5. Join relevant channels and meetings.

### Day 2–3

1. Pick a starter task from [engineering-work](../../engineering-work/).
2. Read the linked Engineering Specification.
3. Follow the human workflow in [ENGINEERING_LIFECYCLE.md](ENGINEERING_LIFECYCLE.md).

## For AI Agents

### Boot

1. Read `AGENT_CONTEXT.md` in the target repository.
2. Read `PROGRESS.md` for current state.
3. Read `ARCHITECTURE_ALIGNMENT.md` for constraints.
4. Confirm the boot process succeeds.

### First Task

1. Select a Task from [engineering-work](../../engineering-work/).
2. Read the linked Engineering Specification.
3. Follow the AI workflow in [ENGINEERING_LIFECYCLE.md](ENGINEERING_LIFECYCLE.md).

## Common Tasks

| Task | Guide |
|------|-------|
| Set up local environment | [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) |
| Create a feature | [CODE_REVIEW_GUIDE.md](CODE_REVIEW_GUIDE.md) |
| Run tests | [TESTING_STRATEGY.md](TESTING_STRATEGY.md) |
| Submit a PR | [CODE_REVIEW_GUIDE.md](CODE_REVIEW_GUIDE.md) |
| Release | [RELEASE_PROCESS.md](RELEASE_PROCESS.md) |

## Getting Help

- Check repository documentation.
- Ask in team channels.
- Escalate blockers to the Engineering Lead.

## Checklists

Use the checklists in [checklists/](checklists/) to guide common workflows.
