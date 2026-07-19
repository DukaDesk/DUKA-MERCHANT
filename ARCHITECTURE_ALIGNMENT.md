# Merchant Portal — Architecture Alignment

**KB Version:** 0.2.0 (commit 4c38d4d)
**Last Updated:** 2026-07-19
**Status:** Active

## Approved ADRs

| ADR | Title | Status |
|-----|-------|--------|
| ADR-003 | Action System Design | Accepted |
| ADR-004 | Event Bus for Cross-Component Communication | Accepted |
| ADR-005 | Branded Splash Screen | Accepted |
| ADR-006 | Knowledge Base Initialization | Accepted |

## Design Principles

- Role-based access control for all screens and actions
- Real API integration with localStorage fallback for resilience
- Consistent UX patterns per UI standards (STATE_STANDARD, INTERACTION_STANDARD)
- Responsive design (mobile bottom nav, desktop sidebar)
- Inline JS styles using shared constants from `theme.js`

## Patterns

- DashboardShell layout (sidebar + topbar + main content)
- Service layer (`api.js`) with `tenantPath()` helper for scoped endpoints
- Auth interceptor (`httpClient.js`) with 401 refresh queue
- Lazy-loaded route components via `React.lazy`
- Context-based state management (Auth, Toast, Runtime)

## Spec Coverage

| Screen | KB Spec | Status |
|--------|---------|--------|
| Dashboard | BD-DASH-001 | ✅ Built |
| Products | BD-PROD-001 | ✅ Built, real API |
| Orders | BD-ORD-001 | ✅ Built, real API |
| Customers | BD-CUST-001 | ✅ Built |
| Inventory | BD-INV-001 | ✅ Built |
| Analytics | BD-ANAL-001 | ✅ Built, real API |
| Messages | BD-MSG-001 (implied) | ✅ Built |
| Marketing | BD-MKT-001 | ✅ Built |
| Integrations | BD-INT-001 (implied) | ✅ Built, real API |
| Billing | BD-BILL-001 (implied) | ✅ Built, real API |
| Team | BD-USER-001 (implied) | ✅ Built |
| Settings | BD-SET-001 | ✅ Built |

## Constraints

- All API calls go through `httpClient.js` for consistent auth handling
- `tenantId` from merchant object scopes all tenant-level API calls
- Admin actions require role check via `roleAccess` map in `Sidebar.jsx`
- KB is the canonical source of truth — specs in `knowledge-base/` override assumptions
- Styles use the `NAVY #0F0F1A`, `AMBER #F4A026` color palette exclusively

## Alignment Verification

Before merging, confirm:

- [ ] Changes align with approved ADRs.
- [ ] Changes follow repository patterns.
- [ ] Changes respect listed constraints.
- [ ] `npx vite build` produces no errors.
