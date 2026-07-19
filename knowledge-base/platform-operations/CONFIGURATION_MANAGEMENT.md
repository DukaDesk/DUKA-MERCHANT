# Configuration Management

This document defines how configuration is managed across environments.

## Principles

1. Configuration is code where possible.
2. Secrets are never stored in source control.
3. Environment-specific values are explicit.
4. Configuration changes are versioned and auditable.

## Configuration Types

| Type | Examples | Storage |
|------|----------|---------|
| Application | Feature flags, timeouts | Config files or config service |
| Infrastructure | Resource sizes, regions | Infrastructure-as-code |
| Secrets | API keys, tokens | Secret manager |
| Environment | URLs, endpoints | Environment variables |

## Configuration Files

- Default configuration is stored in the repository.
- Environment overrides are applied at deployment.
- `.env.example` files document required variables.

## Secrets

- Secrets are stored in a dedicated secret manager.
- Access is role-based and audited.
- Secrets are rotated on a schedule and after incidents.

## Change Process

1. Propose configuration change.
2. Assess risk and impact.
3. Apply through CI/CD or approved manual process.
4. Verify in lower environments first.
5. Monitor after production change.

## Drift Detection

Configuration drift is detected through:

- Infrastructure-as-code reconciliation
- Configuration audits
- Environment comparisons

## Audit

All configuration changes are logged with:

- Who made the change
- When it was made
- What was changed
- Why it was changed
