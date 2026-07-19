# Repository Standard

This document defines the mandatory structure and files for every DUKADESK OS implementation repository.

## Required Files

Every repository root must contain:

| File | Purpose |
|------|---------|
| `README.md` | Human-readable overview |
| `AGENT_CONTEXT.md` | AI agent context and conventions |
| `LICENSE` | License file |
| `.gitignore` | Ignore patterns |

## Required Directories

| Directory | Purpose |
|-----------|---------|
| `docs/` | Repository-specific documentation |
| `tests/` | Test suites |
| `scripts/` | Automation scripts |
| `.github/` or equivalent | CI/CD workflows |

## Optional Directories

| Directory | Purpose |
|-----------|---------|
| `src/` | Source code |
| `packages/` | Monorepo packages |
| `tools/` | Development tools |
| `examples/` | Example usage |

## Naming Conventions

- Directory and file names use lowercase with hyphens.
- Source packages follow the language-specific convention but remain consistent within the repository.
- Configuration files use conventional names for their ecosystems.

## Documentation

- README.md must explain how to build, test, and run the repository.
- AGENT_CONTEXT.md must follow [AI_CONTEXT_STANDARD.md](AI_CONTEXT_STANDARD.md).
- Architecture decisions are recorded in `docs/adr/`.

## CI/CD

Every repository must have automated checks for:

- Build
- Tests
- Linting
- Security scanning
- Dependency audit

## Verification

A repository is compliant when:

- All required files and directories are present.
- CI/CD checks pass.
- AGENT_CONTEXT.md is up to date.
- No secrets are committed.
