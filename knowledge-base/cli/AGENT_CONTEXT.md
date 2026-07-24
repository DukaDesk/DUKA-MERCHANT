# CLI Agent Context

## Overview

The `cli/` repository contains the command-line interface for DUKADESK OS. It is used by developers and operators to interact with the platform.

## Responsibilities

- Command-line commands and subcommands
- Configuration and credential management
- Local project scaffolding
- Scripting and automation support
- Output formatting and logging

## Non-Responsibilities

- Business logic execution on the server
- Graphical user interface
- Infrastructure provisioning

## Technology Stack

- Language: TBD (e.g., TypeScript/Node.js, Go, Rust, Python)
- CLI Framework: TBD
- Testing: TBD
- Packaging: TBD

## Repository Structure

```text
cli/
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
- Use consistent command naming and help text.
- Protect credentials and configuration files.
- Support JSON and human-readable output where appropriate.
- Update this context when responsibilities or structure change.

## Common Tasks

- Add a command: follow FEAT-XXXX and add integration tests.
- Update configuration handling: follow SEC-XXXX.
- Release a binary: follow [RELEASE_STANDARD](../engineering-governance/repository-governance/RELEASE_STANDARD.md).

## Escalation

Stop and ask for human input when:

- A change affects credential storage or authentication.
- A command signature becomes breaking.
- A decision impacts cross-platform distribution.
