# Infrastructure Agent Context

## Overview

The `infrastructure/` repository contains the cloud infrastructure, CI/CD, observability, and developer platform for DUKADESK OS. It is the first repository to bootstrap because all other repositories depend on the environments and pipelines it provides.

## Responsibilities

- Cloud infrastructure provisioning (IaC)
- CI/CD pipelines for all repositories
- Observability stack (logging, metrics, tracing, alerting)
- Developer platform and tooling
- Environment management and isolation
- Security baseline and networking

## Non-Responsibilities

- Application business logic
- Frontend rendering
- Mobile-specific logic
- Database schema design

## Technology Stack

- IaC: TBD (e.g., Terraform, Pulumi, AWS CDK)
- Cloud Provider: TBD
- CI/CD: TBD (e.g., GitHub Actions, GitLab CI, Azure DevOps)
- Observability: TBD (e.g., Datadog, Grafana, Prometheus)
- Scripting: TBD

## Repository Structure

```text
infrastructure/
  src/           # Infrastructure as code modules
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
- Keep infrastructure modular and environment-agnostic where possible.
- Store secrets in approved secret managers; never commit them.
- Add tests for infrastructure changes.
- Update this context when responsibilities or structure change.

## Common Tasks

- Provision a new environment: follow the environment provisioning runbook.
- Add a CI/CD pipeline: update the shared pipeline templates.
- Add observability: follow the observability standards.

## Escalation

Stop and ask for human input when:

- A change affects production infrastructure.
- A security-critical decision is required.
- A change conflicts with an approved ADR.
