# Tenant Dashboard Agent Context

## Overview

The `tenant-dashboard/` repository contains the tenant-facing dashboard where customers manage their own data, users, settings, and day-to-day operations.

## Responsibilities

- Tenant user interface
- Workspace and project management
- User and role management within a tenant
- Tenant-specific settings and preferences
- Operational workflows and notifications

## Non-Responsibilities

- Platform administration
- Core business logic execution
- Infrastructure provisioning

## Technology Stack

- Framework: TBD (e.g., React, Vue, Svelte)
- State Management: TBD
- API Client: TBD
- Testing: TBD

## Repository Structure

```text
tenant-dashboard/
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
- Enforce tenant isolation in all data-fetching and mutations.
- Reuse shared UI components where applicable.
- Keep workflows simple and responsive.
- Update this context when responsibilities or structure change.

## Common Tasks

- Implement a tenant screen: follow UI-XXXX and API-XXXX.
- Add a workflow: follow WF-XXXX and add end-to-end tests.
- Update settings: follow FEAT-XXXX and security guidance.

## Escalation

Stop and ask for human input when:

- A change crosses tenant boundaries.
- A security-critical decision is required.
- A decision impacts subscription tiers or entitlements.
