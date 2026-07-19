# sdk

## Purpose

Official SDK for consuming DUKADESK backend APIs across web, mobile, and CLI clients.

## Startup Order

3 of 9

## Owner

Team D (Builder Team)

## Prerequisites

- backend/ identity and tenant APIs stable.

## Deliverables

- Authentication client.
- Tenant client.
- Commerce clients.
- Type definitions.
- Documentation and examples.

## Exit Criteria

- [ ] SDK covers authentication and tenant APIs.
- [ ] SDK is published and versioned.
- [ ] Examples compile and run.

## Dependencies

- backend/

## Specifications Required

- API-0001 Authentication API
- API-0002 Tenant Management API

## Verification

- Unit tests
- Integration tests
- Example verification

## Risks

| Risk | Mitigation |
|------|------------|
| API mismatch | Contract tests |
| Breaking changes | Semantic versioning |

## Links

- [AGENT_CONTEXT.md](../../sdk/AGENT_CONTEXT.md)
- [ARCHITECTURE_ALIGNMENT.md](../../sdk/ARCHITECTURE_ALIGNMENT.md)
