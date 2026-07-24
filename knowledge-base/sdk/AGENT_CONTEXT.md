# SDK Agent Context

## Overview

The `sdk/` repository contains the official DUKADESK OS software development kit for building integrations and extensions.

## Responsibilities

- Public SDK API surface
- Language bindings and clients
- Authentication helpers
- Retry, caching, and error handling
- Documentation and examples

## Non-Responsibilities

- Internal backend logic
- User interface rendering
- Infrastructure provisioning

## Technology Stack

- Language: TBD (e.g., TypeScript, Python, Go)
- Build Tool: TBD
- Testing: TBD
- Package Registry: TBD

## Repository Structure

```text
sdk/
  src/           # Source code
  tests/         # Test suites
  docs/          # Repository documentation
  examples/      # Usage examples
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
- Maintain backward compatibility unless a major version is released.
- Provide clear public documentation for all exported symbols.
- Add examples for new capabilities.
- Update this context when responsibilities or structure change.

## Common Tasks

- Add a client method: follow API-XXXX and add unit tests.
- Update authentication helpers: follow SEC-XXXX.
- Publish a release: follow [VERSIONING_STANDARD](../engineering-governance/repository-governance/VERSIONING_STANDARD.md).

## Escalation

Stop and ask for human input when:

- A public API change is breaking.
- A new dependency is introduced.
- A decision affects multiple language bindings.
