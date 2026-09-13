# Environment Strategy

This document defines the environment model for DUKADESK OS.

## Environments

```text
Development
    ↓
Integration
    ↓
Staging
    ↓
Production
    ↓
Post Release Verification
```

## Development
- Local engineer or agent workstation.
- Uses local databases and services where possible.
- May connect to shared sandbox services.

## Integration
- Continuous integration environment.
- Runs automated tests on every pull request.
- Ephemeral; created and destroyed per build.

## Staging
- Pre-production environment.
- Mirrors production configuration.
- Used for final verification and demos.

## Production
- Live environment serving real users.
- Protected; changes only through approved releases.

## Post Release Verification
- Monitoring and validation after production deployment.
- Includes smoke tests, error rates, and key metrics.

## Environment Rules

1. Production data must never be used in non-production environments.
2. Secrets are environment-specific and stored in a secret manager.
3. Configuration is explicit and version-controlled (without secrets).
4. Staging must match production in architecture and versions.

## Configuration Management

- Use environment variables for environment-specific values.
- Use configuration files for non-secret defaults.
- Use infrastructure-as-code for environment provisioning.

## Branch to Environment Mapping

| Branch | Environment |
|--------|-------------|
| feature/* | Development / Integration |
| develop | Integration / Staging |
| release/* | Staging |
| main | Production |
| hotfix/* | Staging / Production |

## Promotion Criteria

| From | To | Required |
|------|----|----------|
| Development | Integration | Build and tests pass |
| Integration | Staging | PR merged and approved |
| Staging | Production | Release checklist complete |
| Production | Post Release | Deployment successful |
