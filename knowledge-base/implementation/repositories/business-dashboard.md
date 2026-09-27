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

- [x] Admin can manage users and roles — `PendingAdmins.jsx:48` approve `POST /admin/users/:id/approve` + reject with `reason` Modal, `Settings.jsx:282` team invite `POST /admin/users {role}` + `UserRole` pending, investor `maskEmail`, `Forbidden.jsx` 403
- [x] Admin can update tenant settings — `Settings.jsx:198` platform config table `PUT /admin/settings/:key` + security/notifications toggles via `updateSetting`
- [x] Commerce modules are accessible — `MarketplaceListings.jsx:26` `GET /marketplace/listings/all` moderated via `updateListing`, `SubscriptionManagement.jsx:29` `GET /admin/subscriptions` + `PUT /admin/subscriptions/:id`

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
