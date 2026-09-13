# Contributing to DUKADESK OS

Thank you for contributing to the DUKADESK Engineering Knowledge Base and Operating System.

---

## Before You Start

1. Read [AGENT_CONTEXT.md](./AGENT_CONTEXT.md) if you are an AI agent.
2. Read the [DUKADESK Constitution](./dukadesk-constitution/README.md).
3. Read [ARCHITECTURE_ALIGNMENT.md](./ARCHITECTURE_ALIGNMENT.md).
4. Read [PROGRESS_REGISTRY.md](./PROGRESS_REGISTRY.md) and [PROGRESS.md](./PROGRESS.md).
5. Identify the relevant Knowledge Base documents and specifications.

## What to Contribute

This repository welcomes contributions to:

- Architecture Decision Records (ADRs)
- Knowledge Base documents
- Engineering specifications
- Platform Definition documents
- Standards and conventions
- Guides and runbooks
- Repository governance artifacts

## Branch Naming

Branches must follow the naming convention:

```
{type}/{short-description}
```

Examples:

- `docs/update-runtime-spec`
- `adr/data-platform-storage`
- `standards/naming-conventions`
- `fix/glossary-typo`

## Commit Messages

Commit messages must:

- Use the imperative mood
- Be concise but descriptive
- Reference issue or spec identifiers where applicable

Example:

```
Add data platform storage architecture document

Refs KB-075
```

## Code Review

All changes require review via pull request. At least one code owner must approve.

## Standards Compliance

Contributions must comply with:

- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [NAMING_STANDARDS.md](./NAMING_STANDARDS.md)
- [CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md)
- [PLATFORM_PHILOSOPHY.md](./PLATFORM_PHILOSOPHY.md)
- [AGENT_BOOT_PROCESS.md](./AGENT_BOOT_PROCESS.md)

## Documentation

- Update `README.md` if behavior or structure changes.
- Update `PROGRESS_REGISTRY.md` and `PROGRESS.md` if status changes.
- Update `GLOSSARY.md` if new terminology is introduced.
- Update `ARCHITECTURE_ALIGNMENT.md` if new KB documents or ADRs are referenced.

## AI Agents

AI agents must follow the boot sequence in [AGENT_CONTEXT.md](./AGENT_CONTEXT.md).

## Questions

For questions, open a discussion or contact the repository owners listed in `CODEOWNERS`.
