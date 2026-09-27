# Business Dashboard Progress

This file tracks the current state of the business-dashboard repository. Implementation lives in `Admin-portal` (DUKA-ADMIN: `https://github.com/DukaDesk/DUKA-ADMIN`) which fulfills Business Dashboard + Platform Admin responsibilities.

## Active Work

| Task | Specification | Status | Owner |
|------|---------------|--------|-------|
| E2E integration tests for all modules | UI-0003, SEC-0002, FEAT-0002 | In Progress | Team H |
| Performance optimization and query tuning | — | Planned | Team H |

## Completed Milestones

| Date | Milestone | Notes |
|------|-----------|-------|
| 2026-09-16 | Dashboard shell, role-aware navigation, summary cards, user management, tenant settings | UI-0003 UR-01–UR-06 complete; shell `App.jsx:34`, sidebar `AdminSidebar.jsx:8` collapsible + badges, dashboard home `AdminDashboard.jsx:19` via `GET /bff/admin/overview` + `GET /admin/stats`, user management `PendingAdmins.jsx:11` + Settings team invite; `vite build 1889 modules ✓` |
| 2026-09-16 | Live data integration — zero mocks, BFF Business Dashboard wired | Removed all `MOCK_*` (`businessDashboard.js:1` live-only `apiClient`), `VITE_API_URL=https://duka-backend-production.up.railway.app`, `Promise.allSettled` degraded rendering, `x-railway-request-id` trace |
| 2026-09-16 | Tenant vs Merchant separation + tenant correlation (good-practice) | Merchant = Site Builder portal, Tenant App = mobile; `getMerchantEnriched:43` correlates `GET /bff/tenant/:id/summary|analytics` + manifest when `tenantId/slug` linked; teal/amber coloring in SlideOver + dashboard charts `RevenueChart:83`/`MerchantGrowthChart:113` |
| 2026-09-16 | RBAC strict per SEC-0002 + ROLE_CATALOG | Platform roles `Super Admin`/`Platform Operator`/`Support Agent` strict (`permissions.js:12`) + legacy fallback (`admin`→`platform_operator` etc.) via `toKbCanonical`, `AuthContext.jsx:14` heal; `canAccessPage` hides nav, `Forbidden.jsx:1` 403 per SEC-0002 SR-07; read-only `Support Agent` (team/billing restricted) |
| 2026-09-16 | Pending admin approve/reject + audit + marketplace + subscriptions | `PendingAdmins.jsx:52` approve `POST /admin/users/:id/approve`, reject `POST /admin/users/:id/reject` with `{reason,comment,rejectionReason}` via Modal (8-char validation); investor masked `maskEmail`, `recordAuditEvent`; marketplace bulk via `slugMap`, subscriptions `PUT /admin/subscriptions/:id` |
| 2026-09-16 | Responsive drawer + icon-only + logout placement | Sidebar `AdminSidebar.module.css:1` `flex flex-col`, `profileSection` `flex-col gap-3 mt-auto` logout directly under profile; `navItem` `gap-3 px-4 py-2.5`; `@media 768px` drawer `left:-300→0` + backdrop, collapsed `68px` icon-only without overflow |
| 2026-09-16 | KB design tokens + error handling + breadcrumbs | `index.css:1` KB tokens `color-primary-500 #2563EB` etc. mapped; `ERROR_HANDLING_STANDARD` `403/401/404/500` + retry, `Breadcrumbs.jsx:1` per `NAVIGATION_STANDARD`; `SlideOver.jsx:1` X + `ConfirmModal.jsx:1` open/variant/pointer-events fixes |
| 2026-09-16 | Registration with required role + pending approval | `Register.jsx:8` tab-toggle `role` required (`platform_operator`/`support_agent`/`super_admin`) + payload `POST /auth/register {role}`; backend `RegisterDto:6` `IsIn` + `AuthService.ts:37` sets `status='pending'` + `UserRole` pending, admin sees in `Pending Admins` |
| 2026-09-16 | Backend tenantUsers crash fixed (unblocked portal) | `DUKA-BACKEND/src/modules/users/users.service.ts:59` `tenantUsers→tenants` + `EnhancedRemoteTablePage.jsx:5` handles `users` envelope `success:true data:{users,total}` and `pending→draft` mapping in `businessDashboard.js:16` |
| 2026-09-16 | Pending display envelope + merchant status mapping | `3ece1cd` — `EnhancedRemoteTablePage.jsx:5` `recordsFrom` unwraps `data:{users}` + `total` from `meta.total`, `businessDashboard.js:16` `pending→draft`/`active→published` so draft tenants appear as Pending |
| 2026-09-16 | Align dashboard with backend — 6 missing KB modules | `317a549` — Orders (`GET /app/commerce/orders`), Products (`GET /app/commerce/products` + `adjust-stock`), Customers (`GET /admin/users?role=customer` + `GET /admin/users/merchant/:id`), Analytics (`GET /analytics/reports/*`), Marketing (`campaigns`+`integrations`), Infrastructure (`GET /infra/overview`) — `AdminSidebar.jsx:8` 13 items, `App.jsx:26` 14 routes, `permissions.js:66` new perms, `1896 modules ✓` |
| 2026-09-16 | Notification Bell icon | `bb05d76` — `AdminTopbar.jsx:2` `Bell` from `lucide-react` replaces `Alerts` text, dot badge `8px` |
| 2026-09-16 | Total merchant counts mapping | `47f61e2` — `AdminDashboard.jsx:19` `getMetricValue` aliases `totalTenants→totalMerchants`, `publishedTenants→activeMerchants`, `draftTenants→pending`, `totalRevenue→monthlyRevenue`, plus `GET /marketplace/stats` for listings |
| 2026-09-16 | Customers: app/tenant users per merchant | `da83369` — `Customers.jsx:11` merchant filter `GET /admin/users/merchant/:id` (TenantUser) with fallback `GET /admin/users?role=customer`, teal badge `Tenant App`, detail shows `tenants[]` memberships |
| 2026-09-16 | Merchant approve/decline with credential review | `c4d9a27`+`6588a6a` — `AdminService:40` `rejectTenant` sets `status:'rejected'` + `config.rejectionReason`, `TenantStatus`+`rejected`, `AdminController:14` `POST /admin/merchants/:id/reject`; `MerchantManagement.jsx:92` review card + footer `Decline`/`Approve — Go Live` before `draft→published` live |

## Blockers

| Issue | Impact | Owner |
|-------|--------|-------|
| No persistence layer for form data across restarts | Low — form submissions re-fetched live | Team H |

## Next Up

- Visual regression tests for shell/sidebar/settings per UI-0003 Verification
- Rate limiting UI for `ThrottlerGuard 100/60s` (`app.module.ts:48`) — surface `429` + `Retry-After`
- Commerce drill-down completeness: `fulfillments`, `variants`, `extended-pricing`, `TaxRules`/`Coupons` not yet surfaced beyond `Orders` status + `Products` stock

## Last Updated

2026-09-16
