# backend

## Purpose

Core server-side platform: identity, tenant, commerce, orders, payments, media, events, and APIs.

## Startup Order

2 of 9

## Owner

Team E (Backend Team)

## Prerequisites

- infrastructure/ deployed.
- Database and messaging infrastructure available.

## Deliverables

- Domain services.
- API endpoints.
- Database schemas and migrations.
- Event publishers/consumers.
- Tests.

## Exit Criteria

- [ ] Identity and tenant services operational.
- [ ] Authentication API stable.
- [ ] Tenant isolation enforced.
- [ ] Core commerce APIs functional.

## Dependencies

- infrastructure/

## Specifications Required

- SEC-0001, SEC-0002
- FEAT-0001, FEAT-0002
- API-0001, API-0002
- DB-0001, DB-0002
- EVT-0001, EVT-0002

## Verification

- Unit tests
- Integration tests
- Contract tests
- Security tests

## Risks

| Risk | Mitigation |
|------|------------|
| API churn | Freeze contracts before SDK/client dev |
| Tenant isolation bugs | Extensive integration tests |

## Links

- [AGENT_CONTEXT.md](../../backend/AGENT_CONTEXT.md)
- [ARCHITECTURE_ALIGNMENT.md](../../backend/ARCHITECTURE_ALIGNMENT.md)
