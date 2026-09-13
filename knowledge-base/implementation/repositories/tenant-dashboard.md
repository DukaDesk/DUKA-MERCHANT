# tenant-dashboard

## Purpose

Customer-facing dashboard within the tenant app.

## Startup Order

8 of 9

## Owner

Team H (Frontend Team)

## Prerequisites

- sdk/ published.
- UI specifications for dashboard ready.

## Deliverables

- Dashboard shell.
- Profile screen.
- Settings screen.
- Order history.

## Exit Criteria

- [ ] Customer can view profile and orders.
- [ ] Settings can be updated.
- [ ] Navigation matches role.

## Dependencies

- sdk/
- backend/

## Specifications Required

- UI-0004 Tenant Dashboard Foundation and Shell

## Verification

- E2E tests
- Role-based access tests
- Visual regression tests

## Risks

| Risk | Mitigation |
|------|------------|
| Shared components | Coordinate with business-dashboard |
| Tenant isolation | Verify data boundaries |

## Links

- [AGENT_CONTEXT.md](../../tenant-dashboard/AGENT_CONTEXT.md)
- [ARCHITECTURE_ALIGNMENT.md](../../tenant-dashboard/ARCHITECTURE_ALIGNMENT.md)
