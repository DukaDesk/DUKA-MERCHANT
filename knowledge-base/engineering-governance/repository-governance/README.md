# Repository Governance

This repository defines the standards that all DUKADESK OS implementation repositories must follow.

## Purpose

Repository governance ensures consistent structure, process, quality, and AI context across every codebase. These standards enable parallel implementation, automated reviews, and predictable releases.

## Standards

| Standard | Purpose |
|----------|---------|
| [REPOSITORY_STANDARD.md](REPOSITORY_STANDARD.md) | Mandatory repository structure and files |
| [BRANCHING_STANDARD.md](BRANCHING_STANDARD.md) | Branch model and naming conventions |
| [VERSIONING_STANDARD.md](VERSIONING_STANDARD.md) | Version numbering and release tagging |
| [PR_STANDARD.md](PR_STANDARD.md) | Pull request format and requirements |
| [REVIEW_STANDARD.md](REVIEW_STANDARD.md) | Code review process and quality gates |
| [RELEASE_STANDARD.md](RELEASE_STANDARD.md) | Release process and checklist |
| [AI_CONTEXT_STANDARD.md](AI_CONTEXT_STANDARD.md) | Agent context files and conventions |
| [BOOT_PROCESS_STANDARD.md](BOOT_PROCESS_STANDARD.md) | Repository onboarding and setup |

## Scope

These standards apply to all implementation repositories:

- backend/
- mobile/
- builder/
- website/
- business-dashboard/
- tenant-dashboard/
- sdk/
- cli/

## Compliance

Each repository must include an `AGENT_CONTEXT.md` file that references these standards. Compliance is verified during release readiness.

## Updates

Propose changes to governance standards through a change proposal in the engineering-specifications repository or the repository-governance repository itself.
