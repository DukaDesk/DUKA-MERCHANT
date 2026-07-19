# Builder Agent Context

## Overview

The `builder/` repository contains the visual builder and configuration tools that allow users to design and customize DUKADESK OS experiences.

## Responsibilities

- Visual design and layout canvas
- Component palette and property editors
- Preview and simulation
- Export and serialization of designs
- Builder-specific state management

## Non-Responsibilities

- Runtime rendering of end-user applications
- Core business logic
- Infrastructure provisioning

## Technology Stack

- Framework: TBD (e.g., React, Vue, Svelte)
- Canvas / Editor: TBD
- State Management: TBD
- Testing: TBD

## Repository Structure

```text
builder/
  src/           # Source code
  tests/         # Test suites
  docs/          # Repository documentation
  scripts/       # Automation scripts
  AGENT_CONTEXT.md
  README.md
```

## Build and Test

```bash
scripts/bootstrap
scripts/build
scripts/test
scripts/lint
```

## Engineering Standards

- [Repository Standard](../engineering-governance/repository-governance/REPOSITORY_STANDARD.md)
- [Branching Standard](../engineering-governance/repository-governance/BRANCHING_STANDARD.md)
- [Versioning Standard](../engineering-governance/repository-governance/VERSIONING_STANDARD.md)
- [Pull Request Standard](../engineering-governance/repository-governance/PR_STANDARD.md)
- [Review Standard](../engineering-governance/repository-governance/REVIEW_STANDARD.md)
- [Release Standard](../engineering-governance/repository-governance/RELEASE_STANDARD.md)
- [AI Context Standard](../engineering-governance/repository-governance/AI_CONTEXT_STANDARD.md)
- [Boot Process Standard](../engineering-governance/repository-governance/BOOT_PROCESS_STANDARD.md)

## Specification Traceability

Specifications that target this repository:

| Specification | Title | State |
|---------------|-------|-------|
| | | |

## Agent Conventions

- Reference engineering specifications by ID in commits and pull requests.
- Keep the canvas performant for large designs.
- Validate serialized output against schemas.
- Maintain undo/redo and autosave behavior.
- Update this context when responsibilities or structure change.

## Common Tasks

- Add a new component: follow UI-XXXX and register it in the palette.
- Implement a property editor: follow FEAT-XXXX and add tests.
- Update serialization format: follow DB-XXXX and migration rules.

## Escalation

Stop and ask for human input when:

- A change affects the serialized design format.
- A performance regression is introduced.
- A decision impacts the runtime rendering contract.
