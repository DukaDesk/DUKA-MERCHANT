# business-dashboard

## Purpose

Administrative dashboard for business owners and managers.

## Startup Order

7 of 9

## Owner

Team H (Frontend Team)

## Prerequisites

- sdk/ published.
- UI specifications for dashboard ready.

## Deliverables

- Dashboard shell.
- User management.
- Tenant settings.
- Commerce management screens.

## Exit Criteria

- [ ] Admin can manage users and roles.
- [ ] Admin can update tenant settings.
- [ ] Commerce modules are accessible.

## Dependencies

- sdk/
- backend/

## Specifications Required

- UI-0003 Business Dashboard Foundation and Shell
- SEC-0002 Authorization and RBAC

## Verification

- E2E tests
- Role-based access tests
- Visual regression tests

## Risks

| Risk | Mitigation |
|------|------------|
| Permission complexity | Test all roles |
| Shared component drift | Use shared UI library |

## Links

- [AGENT_CONTEXT.md](../../business-dashboard/AGENT_CONTEXT.md)
- [ARCHITECTURE_ALIGNMENT.md](../../business-dashboard/ARCHITECTURE_ALIGNMENT.md)
