# Business Dashboard ↔ Backend Endpoint Gap List — TODO

> **To:** DUKA-BACKEND Team
> **From:** Business Dashboard (merchant-portal / dukaDesk)
> **Status:** OPEN — endpoints requested from the Business Dashboard are missing from the backend catalog
> **Date:** 2026-08-08
> **Ref:** Backend `api-endpoints-reference.md` (all sections)

## Summary

During the merchant-dashboard ⇄ backend reconciliation, the frontend identified several
backend calls / product needs that have **no matching endpoint** in the backend catalog
`knowledge-base/backend/api-endpoints-reference.md`. Each item below is either (a) a call the
browser dashboard already ships and that currently fails or is mocked locally because the endpoint
does not exist, or (b) a page that is entirely local state today and needs a real endpoint to come
online.

This document is the consolidated backlog for the backend team. Existing, dedicated TODO docs
remain the source of truth for their own domains:

- [One-Time Tenant Onboarding](ONBOARDING_ONETIME_BACKEND_TODO.md) — first-class `category` field on Tenant
- [Dashboard Primitives / Feature Requests](DASHBOARD_PRIMITIVES_BACKEND_TODO.md) — `POST /feature-requests`
- [Business Verification (KYC)](BUSINESS_VERIFICATION_BACKEND_TODO.md) — compliance endpoints

---

## 1. Auth — `GET /api/v1/auth/me`

The Business Dashboard calls `GET /api/v1/auth/me` on every post-login hydration
(`dukaDesk/src/services/api.js` → `getAuthMe()`).

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/auth/me` | Return current authenticated user + tenants (mirror of `/api/v1/profile`). Needs to exist, or dashboard should switch to `/profile` (preferred: keep as-is and add it). |

Backend catalog has `GET /api/v1/profile` (§2) but **no `/auth/me`**.

**Ask:** Add `GET /api/v1/auth/me` (JWT-authenticated, returns `{ user }`) or confirm the dashboard
should use `GET /api/v1/profile` and drop this call. Frontend call:
`dukaDesk/src/services/api.js:808`.

---

## 2. Notifications & Messages — conversation / thread endpoints (create)

The **Messages** page (`dukaDesk/src/components/pages/Messages.jsx`) depends on two endpoints
that do not exist:

| Method | Path | Used by |
|--------|------|---------|
| GET | `/api/v1/notifications/:id/messages` | `getMessages(conversationId)` — load a thread for a notification/conversation |
| POST | `/api/v1/notifications/:id/messages` | `sendMessage(conversationId, text)` — send a reply on a thread |

Backend §12 (Notifications) catalog has generic list/unread/read/campaign endpoints but **no
message-thread (conversation) resource**.

**Ask:** Add a messaging/conversation domain OR retrofit these two paths onto the notifications
module:
- `GET /api/v1/conversations` — list conversations for the tenant (name, last message, unread count)
- `GET /api/v1/conversations/:id/messages` — message history
- `POST /api/v1/conversations/:id/messages` — send a message

Frontend calls in `dukaDesk/src/services/api.js`:
- `getConversations()` — currently fakes this from `GET /api/v1/notifications`
- `getMessages()`, `sendMessage()` — hit the missing `/notifications/:id/messages` path

---

## 3. Notifications — DELETE (dismiss)

The Notifications page has a **Dismiss** action (`dukaDesk/src/components/pages/Notifications.jsx`,
`dismissNotification`).

**Method | Path | Notes
-----------------|------------------|------|
| DELETE | `/api/v1/notifications/:id` | Delete/dismiss an individual notification |

Backend catalog (§12) defines `POST /notifications/:id/read`, `POST /notifications/mark-all-read`,
**a `DELETE /notifications/:id` endpoint is missing.**

Frontend call: `dukaDesk/src/services/api.js:564` (`dismissNotification`).

Also note a method-shape divergence the backend team should be aware of:
the catalog lists `PUT /api/v1/notifications/:id/read` but the dashboard sends **POST**
(`markNotificationRead`, `api.js:555`). Either accept POST or align the dashboard to PUT.

---

## 4. Billing — `GET /tenants/:tenantId/billing-history`

The Billing page renders a "Billing History" table from `getBillingHistory()`
(`dukaDesk/src/components/pages/Billing.jsx`, `dukaDesk/src/services/api.js:610`).
That endpoint is not in the catalog.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/tenants/:tenantId/billing-history` | Billing/invoice history: `{ date, desc(description), amount, status, invoiceId }` |

The catalog does have payment-related routes:
- `GET /api/v1/tenants/:tenantId/payments` (init/verify)
- `GET /api/v1/tenants/:tenantId/payments/transactions` (§16)

**Ask:** add `billing-history` (a merchant-friendly invoice/billing record list) OR confirm the
dashboard should map billing history rows from `GET /payments/transactions`.

---

## 5. Customers — no customer list resource (page is local-only)

`dukaDesk/src/components/pages/Customers.jsx` currently renders **local mock data only**.
The platform has no customer/CRM resource against an order domain.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/tenants/:tenantId/customers` | List the tenant's customers (with order aggregates: `totalSpent`, `ordersCount`, `lastOrderAt`) |
| GET | `/api/v1/tenants/:tenantId/customers/:id` | Customer detail + full order history |

Suggested customer metrics fields: `id`, `name`, `email`, `phone`, `avatar`, `totalSpent`,
`ordersCount`, `status (Active/Inactive)`, `joinedAt`.

---

## 6. Team — members / invitations (page is 100% mock)

`Team.jsx` renders local mock members and "Invite" via in-memory list. Requires real endpoints:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/tenants/:tenantId/members` | List tenant team members + roles |
| POST | `/api/v1/tenants/:tenantId/invitations` | Invite by email + role (`store_manager`, `business_manager`, etc.) |
| PATCH | `/api/v1/tenants/:tenantId/members/:id/role` | Change a member's role |
| DELETE | `/api/v1/tenants/:tenantId/members/:id` | Remove a member |
| GET | `/api/v1/tenants/:tenantId/invitations` | List pending invitations |

Roles in dashboard: `tenant_owner`, `business_manager`, `store_manager`, `sales_staff`,
`content_manager`, `member`.

---

## 7. Tenant — POST `/suspend` (method on tenant)

`dukaDesk/src/services/api.js:674` `suspendTenant(id)` calls `POST /api/v1/tenants/:id/suspend`.
Backend has admin-only `POST /api/v1/admin/tenants/:id/suspend` (§11). This is not exercised by the
dashboard UI today and can be dropped or converted to go through the admin surface. Confirm intent.

---

## Integration status

| Frontend surface | Backend endpoints | Row period | Status |
|------------------|-------------------|------------|--------|
| Auth | match → `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/google`, `/auth/forgot-password` | | ✅ done in frontend |
| `GET /auth/me` | missing | §1 | ⬜ OPEN |
| Products / Orders / Media / Integrations / Billing subscription / Analytics / Profile / Tenants-config | matching catalog entries | §7 §8 §18 §19 §22 | ✅ done in frontend |
| Messages page | missing | **§2** | ⬜ OPEN — needs messaging domain |
| Notifications dismiss | missing | **§3** | ⬜ OPEN |
| Billing history | missing | **§4** | ⬜ OPEN (payments/transactions patched frontend) |
| Customers page | missing | **§5** | ⬜ OPEN — page is mock |
| Team page | missing | **§6** | ⬜ OPEN — page is mock |
| Marketing coupons | `GET/POST /tenants/:tenantId/coupons` exists (§7) | — | ✅ integrate via frontend (see `api.js` `getCoupons`/`createCoupon`) |

> **Blocking note:** Until §2/§3 land, Messages/Notifications pages must stay graceful-degrade
> (empty states) — they do, but features remain resident "fake" behavior.

---

## Related

- Backend catalog: [api-endpoints-reference.md](api-endpoints-reference.md)
- Other domain TODOs: onboarding (category), feature requests, business verification
- Frontend service: `dukaDesk/src/services/api.js` (single source of backend paths)
- Pages: `Messages.jsx`, `Notifications.jsx`, `Billing.jsx`, `Customers.jsx`, `Team.jsx`, `Marketing.jsx`