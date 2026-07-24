# Phase 07: Dashboards

## Objectives

Build the Business Dashboard and Tenant Dashboard for managing and interacting with tenant apps.

## Prerequisites

- Phase 04 Backend Services complete.
- SDK published.

## Deliverables

- Business Dashboard shell and modules.
- Tenant Dashboard shell and modules.
- Role-based navigation.
- User management and settings.

## Exit Criteria

- [ ] Business owners can manage tenant settings and users.
- [ ] Customers can view profile and orders.
- [ ] Role-based access is enforced.

## Dependencies

- Phase 04 Backend Services
- SDK

## Repositories Involved

- business-dashboard/
- tenant-dashboard/
- sdk/

## Specifications Required

- UI-0003 Business Dashboard Foundation and Shell
- UI-0004 Tenant Dashboard Foundation and Shell
- SEC-0002 Authorization and RBAC

## Verification Required

- Dashboard E2E tests.
- Role-based access tests.
- Visual regression tests.

## Risks

| Risk | Mitigation |
|------|------------|
| Shared component drift | Use shared UI library |
| Permission complexity | Test all roles |
