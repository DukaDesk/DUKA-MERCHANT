# Contributing to {{REPOSITORY_NAME}}

Thank you for contributing to DUKADESK. This document defines the process for contributing to this repository.

---

## Before You Start

1. Read [AGENT_CONTEXT.md](./AGENT_CONTEXT.md) if you are an AI agent.
2. Read [ARCHITECTURE_ALIGNMENT.md](./ARCHITECTURE_ALIGNMENT.md).
3. Read [PROGRESS.md](./PROGRESS.md).
4. Identify the relevant Knowledge Base documents and specifications.

## Branch Naming

Branches must follow the naming convention:

```
{type}/{short-description}
```

Examples:

- `feature/runtime-action-system`
- `fix/offline-sync-race`
- `docs/update-readme`
- `adr/multi-tenant-auth`

## Commit Messages

Commit messages must:

- Use the imperative mood
- Be concise but descriptive
- Reference issue or spec identifiers where applicable

Example:

```
Add offline queue flush retry logic

Closes #123
```

## Code Review

All changes require review via pull request. At least one code owner must approve.

## Standards Compliance

Contributions must comply with:

- `ENGINEERING_STANDARDS.md`
- `NAMING_STANDARDS.md`
- `CORE_PRINCIPLES.md`
- Repository-specific coding standards

## Testing

- Write tests for new logic.
- Ensure existing tests pass.
- Document how to run tests in this section.

## Documentation

- Update `README.md` if behavior changes.
- Update `PROGRESS.md` if status changes.
- Update relevant Knowledge Base documents if concepts change.

## Questions

For questions, open a discussion or contact the repository owners listed in `CODEOWNERS`.
