# Service Catalog

This document inventories every platform service that operates in production.

## Catalog Format

Every platform service declares:

```text
Purpose
Owner
Dependencies
Consumers
Repository
Knowledge Base References
Engineering Specifications
Runbooks
Dashboards
Alerts
```

## Services

### Service: example-service

| Field | Value |
|-------|-------|
| Purpose | Brief description of what the service does. |
| Owner | Team or individual responsible. |
| Dependencies | Other services or resources it requires. |
| Consumers | Services, users, or clients that call it. |
| Repository | Link to implementation repository. |
| Knowledge Base References | KB articles. |
| Engineering Specifications | Linked specifications. |
| Runbooks | Startup, shutdown, recovery, etc. |
| Dashboards | Observability dashboard links. |
| Alerts | Alert policy links. |

## Service Tiers

| Tier | Description | Examples |
|------|-------------|----------|
| Tier 1 | Critical to platform operation | Authentication, API gateway, billing |
| Tier 2 | Important but degradable | Notifications, analytics |
| Tier 3 | Supporting tooling | Admin tools, reporting |

## Maintenance

- New services must be added to this catalog before production deployment.
- Owners must review and update their service entries quarterly.
- Deprecating a service requires updating consumers and runbooks.
