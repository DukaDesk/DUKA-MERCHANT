# For Backend Developers

## How to Use the Product Definition

As a backend developer, the Product Definition tells you **what domains, modules, and business rules to implement**.

## Start Here

1. Read [PLATFORM_OVERVIEW.md](../01-platform/PLATFORM_OVERVIEW.md).
2. Read [MODULE_CATALOG.md](../04-modules/MODULE_CATALOG.md).
3. Read [MODULE_BOUNDARIES.md](../04-modules/MODULE_BOUNDARIES.md).
4. Read [FEATURE_CATALOG.md](../05-features/FEATURE_CATALOG.md).

## What to Build

For each module assigned to you:

| Product Artifact | Backend Output |
|------------------|----------------|
| Module | Domain service |
| Feature | API endpoints, business logic, events |
| User Type | Authorization rules |
| Permission | Authorization checks |
| User Journey | State machine, workflow |

## Example Workflow

Product says:

> F-020 Create Product (Catalog module)

Backend developer creates:

- `SPEC-0030 Product Catalog Feature` in engineering-specifications
- Product domain service
- Product API endpoints
- Product database schema
- Product-related events
- Tests

## Cross-References

- [PERMISSION_CATALOG.md](../07-permissions/PERMISSION_CATALOG.md) → authorization logic
- [USER_JOURNEYS.md](../06-users/USER_JOURNEYS.md) → workflows and state transitions
- [EDITION_MODEL.md](../08-editions/EDITION_MODEL.md) → feature gating logic

## Output Artifacts

Backend developers produce:

- Engineering specifications (API, DB, Event, Security)
- Domain services
- API controllers
- Database migrations
- Event publishers/consumers
- Tests
