# One-Time Tenant Onboarding — Backend TODO

> **To:** DUKA-BACKEND Team
> **From:** Business Dashboard (merchant-portal / dukaDesk)
> **Status:** OPEN — awaiting backend field
> **Date:** 2026-08-08
> **Ref:** Backend `api-endpoints-reference.md` §3 (Tenants)

## Summary

The "What should we call your desk?" onboarding screen reaches the **dashboard on every login**
because the frontend cannot tell, from the login/tenant response, that onboarding has already been
completed.

### Current flow (frontend)

`dukaDesk/src/App.jsx` `PublicRoute` gates logged-in users:

```jsx
if (merchant) return <Navigate to={merchant?.category ? "/dashboard" : "/onboarding"} replace />;
```

- `category` is written to the local merchant (`dd_merchant`) **only** when onboarding finishes
  (`Onboarding.jsx` → `onAuth({ ...merchant, category })`).
- On every new login/signup, `dukaDesk/src/services/api.js` `buildMerchant(user, tenant)` rebuilds
  the merchant object **without a `category` field**, clobbering the persisted value. Then
  `PublicRoute` sees `category === undefined` → redirects to `/onboarding` again.
- The category is otherwise stored inside the generic tenant run-time config
  (`saveCategory` → `PUT /api/v1/tenants/:tenantId/config` → `app.category`) and restored by
  `getMyApp()` only **after** mount — too late for the route gate, and not uniform for new devices.

## Required Backend Work

### 1. First-class `category` / onboarding field on the Tenant entity

The backend exposes **no structured onboarding state** today. Add `category` (and optionally
`onboardingCompletedAt`) directly on the Tenant so the dashboard can gate one-time setup from
authoritative data instead of localStorage.

| Endpoint | Change |
|----------|--------|
| `POST /api/v1/tenants` | Accept optional `category` in create payload |
| `PUT /api/v1/tenants/:id` | Accept/update `category` (and onboarding flag) |
| `GET /api/v1/tenants/:id` | Return `category` (+ onboarding metadata) |
| `GET /api/v1/tenants/my` | Return `category` in list payload |
| `GET /api/v1/profile` / `GET /api/v1/auth/me` | Include `tenant.category` so login knows onboarding state |
| Login/register response (`/auth/login`, `/auth/register`) | Include `tenant.category` (or `onboardingComplete`) so the dashboard can route immediately |

### 2. Contract expectation from the frontend

```jsonc
// part of tenant / auth payload
{
  "id": "tenant_xxx",
  "name": "Ada's Kitchen",
  "category": "Restaurant",          // "" or null = onboarding not done yet
  "onboardingCompleted": true,       // optional explicit flag
  "slug": "adas-kitchen"
}
```

Frontend will then gate via:
```js
merchant?.category ? "/dashboard" : "/onboarding"
```

and, on successful onboarding, submit `category` via `PUT /api/v1/tenants/:tenantId`.

### 3. (Preferred) Backend-driven gate

If the backend returns a server-owning `category`/`onboardingCompleted`, the frontend no longer relies
on `localStorage` value that gets rebuilt away on re-login — this also fixes desktop-vs-mobile and
cache-clear sessions automatically.

## Current Frontend Implementation

- **UI:** `dukaDesk/src/components/auth/Onboarding.jsx` (desk name + vertical category)
- **Service:** `dukaDesk/src/services/api.js`
  - `buildMerchant()` — does **not** set `category`
  - `saveCategory(category)` — provisional: writes `config.app.category` and updates `dd_merchant`
- **Gate:** `dukaDesk/src/App.jsx` `PublicRoute` redirects to `/onboarding` when `merchant.category`
  is missing

## Backend Acceptance Criteria

- [ ] `category` present on `POST/PUT/GET /tenants`, `GET /tenants/my`, profile/auth responses
- [ ] Login/register response signals onboarding state so the web app can route once
- [ ] Migrations + Swagger/OpenAPI + E2E coverage
- [ ] Onboarding `PUT /tenants/:id` persists `category` (no longer only inside config)

## Related

- [API Endpoints Reference](api-endpoints-reference.md) — §3 Tenants, §1 Auth
- Frontend page: `dukaDesk/src/components/auth/Onboarding.jsx`
- Merchant service: `dukaDesk/src/services/api.js`