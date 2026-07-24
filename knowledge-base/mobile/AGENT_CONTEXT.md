# Mobile Agent Context

## Overview

The `mobile/` repository contains the DUKADESK OS mobile applications for iOS and Android.

## Responsibilities

- Native or cross-platform mobile user interface
- Mobile-specific state management
- Offline support and local storage
- Push notification handling
- Secure authentication flows

## Non-Responsibilities

- Server-side business logic
- Web rendering
- Infrastructure provisioning

## Technology Stack

- Framework: TBD (e.g., React Native, Flutter, Swift, Kotlin)
- State Management: TBD
- Networking: TBD
- Testing: TBD

## Repository Structure

```text
mobile/
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
- Follow platform-specific accessibility guidelines.
- Keep UI components testable and reusable.
- Securely store tokens and credentials.
- Update this context when responsibilities or structure change.

## Common Tasks

- Implement a UI specification: build screens, components, and navigation.
- Integrate an API: add service client and state updates.
- Handle push notifications: follow EVT-XXXX and platform docs.

## Escalation

Stop and ask for human input when:

- A change requires native module changes.
- A security-critical decision is required.
- A platform-specific store policy is involved.
