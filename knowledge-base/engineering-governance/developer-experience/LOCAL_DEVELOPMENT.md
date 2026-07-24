# Local Development

This document describes how to set up and run DUKADESK OS repositories locally.

## Prerequisites

Before booting a repository, ensure the following are installed:

- Git
- Language runtime (see repository `AGENT_CONTEXT.md`)
- Package manager (see repository `AGENT_CONTEXT.md`)
- Docker or container runtime (if required)
- IDE or editor

## Boot Process

Every repository provides a bootstrap script:

```bash
scripts/bootstrap
```

This script installs dependencies, configures hooks, and prepares the local environment.

## Build

```bash
scripts/build
```

## Test

```bash
scripts/test
```

## Lint

```bash
scripts/lint
```

## Running Locally

Each repository's `README.md` contains specific run instructions. Common patterns:

```bash
scripts/start
# or
npm run dev
# or
docker compose up
```

## Environment Variables

Copy the example environment file and configure values:

```bash
cp .env.example .env
```

Never commit secrets or local environment files.

## IDE Configuration

Recommended:

- Use the repository's formatting rules.
- Enable linting on save.
- Use language-specific extensions.

## Troubleshooting

Common issues and fixes are documented in each repository's `README.md` or `docs/`.

## Agent Notes

When starting work in a repository:

1. Run `scripts/bootstrap`.
2. Run `scripts/build`.
3. Run `scripts/test`.
4. Confirm all checks pass before making changes.

If bootstrap fails, stop and ask for human input.
