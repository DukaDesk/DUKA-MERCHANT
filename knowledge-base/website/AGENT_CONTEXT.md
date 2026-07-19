# Website Agent Context

## Overview

The `website/` repository contains the public marketing and documentation website for DUKADESK OS.

## Responsibilities

- Public-facing pages and content
- Marketing site routing and navigation
- SEO and performance optimization
- Static generation or server rendering
- Contact and lead capture forms

## Non-Responsibilities

- Application business logic
- Authenticated product functionality
- Infrastructure provisioning

## Technology Stack

- Framework: TBD (e.g., Next.js, Astro, Nuxt)
- Styling: TBD
- CMS / Content: TBD
- Testing: TBD

## Repository Structure

```text
website/
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
- Optimize for performance and accessibility.
- Keep content manageable and internationalization-ready.
- Validate forms and protect against spam.
- Update this context when responsibilities or structure change.

## Common Tasks

- Add a marketing page: follow UI-XXXX and SEO guidelines.
- Update documentation: follow docs standards and link to specs.
- Implement a lead form: follow FEAT-XXXX and security guidance.

## Escalation

Stop and ask for human input when:

- A change affects public messaging or branding.
- A security-critical form or integration is involved.
- A decision impacts site analytics or compliance.
