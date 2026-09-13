# Business Dashboard Agent Context

## Overview

The `business-dashboard/` repository contains the administrative dashboard used by business administrators to manage tenants, users, billing, and platform configuration.

## Responsibilities

- Business admin user interface
- Tenant and user management
- Billing and subscription views
- Platform configuration screens
- Reports and analytics presentation

## Non-Responsibilities

- End-customer-facing features
- Core business logic execution
- Infrastructure provisioning

## Technology Stack

- Framework: TBD (e.g., React, Vue, Angular)
- State Management: TBD
- API Client: TBD
- Testing: TBD

## Repository Structure

```text
business-dashboard/
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
- Implement role-based access control for all admin actions.
- Keep dashboards responsive and data-heavy views performant.
- Reuse UI components across dashboards where possible.
- Update this context when responsibilities or structure change.

## Common Tasks

- Add an admin screen: follow UI-XXXX and API-XXXX.
- Implement a report: follow FEAT-XXXX and data contract.
- Update billing views: follow INT-XXXX and security guidance.

## Escalation

Stop and ask for human input when:

- A change affects billing, pricing, or legal compliance.
- A privileged operation lacks proper authorization.
- A decision impacts tenant isolation or data access.
