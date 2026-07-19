# Environment Model

This document defines the environment topology for DUKADESK OS.

## Environment Hierarchy

```text
Local
    ↓
Development
    ↓
Integration
    ↓
QA
    ↓
Staging
    ↓
Production
```

## Local
- Individual developer or agent workstation.
- Minimal external dependencies.

## Development
- Shared development sandbox.
- Used for integration testing during active development.

## Integration
- Continuous integration environment.
- Ephemeral builds and automated test runs.

## QA
- Quality assurance environment.
- Used for manual and exploratory testing.

## Staging
- Production mirror.
- Used for final validation, demos, and release rehearsals.

## Production
- Live environment serving customers.
- Strictly controlled access and changes.

## Promotion Rules

| From | To | Gate |
|------|----|------|
| Local | Development | Build passes |
| Development | Integration | Tests pass |
| Integration | QA | QA approval |
| QA | Staging | Release candidate ready |
| Staging | Production | Release checklist complete |

## Environment Isolation

- Production data never flows to non-production environments.
- Secrets are environment-specific.
- Networking boundaries enforce isolation.

## Naming and Tagging

All resources must be tagged with:

- Environment name
- Service name
- Owner
- Cost center
