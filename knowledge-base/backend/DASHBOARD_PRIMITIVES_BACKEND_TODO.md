# Dashboard Primitives — Backend TODO

> **To:** DUKA-BACKEND Team
> **From:** Business Dashboard (merchant-portal / dukaDesk)
> **Status:** OPEN — feature request collection needs a backend endpoint
> **Date:** 2026-08-08
> **Ref:** `dukaDesk/src/components/pages/Integrations.jsx` (Dashboard Primitives + Request a feature)

## Summary

The Business Dashboard now ships a **Dashboard Primitives** catalog
(`dukaDesk/src/config/primitives.js`). Tenants install/remove these from the
Integrations page, and the enabled set is persisted as `app.modules` in the generic
**tenant runtime config** (`PUT /api/v1/tenants/:tenantId/config`) plus a local mirror in
`dukadesk_setup` / `dd_merchant`. **No new backend endpoint is required for that part** — the
existing tenant-config write covers it.

The Integrations page also exposes a **"Request a feature"** modal. Today it only dispatches a
browser `feature:requested` CustomEvent and shows a success toast — it does **not** reach the
backend yet.

This document lists the backend work required to make feature requests first-class.

---

## Required Backend Work

### 1. Feature-request endpoint (create)

- **`POST /api/v1/feature-requests`** — create a feature request from an authenticated merchant.

  Request body (from `Integrations.jsx` modal):
  ```json
  {
    "title": "WhatsApp order alerts",
    "description": "Notify me in WhatsApp when a new order comes in"
  }
  ```

  Expected behavior:
  - Auth: `Bearer` token (same auth as other merchant endpoints).
  - Store a `FeatureRequest` record: `{ id, tenantId, merchantId, title, description, status: "open", createdAt }`.
  - Status lifecycle: `open → triaged → in_progress → shipped | declined`.
  - Respond `201` with the created record.

### 2. Feature-request (read + update)

- **`GET /api/v1/feature-requests?tenantId=`** — list requests for the merchant's tenant.
  - Enables a future "Your requests" list in the Integrations page.
- **`PATCH /api/v1/feature-requests/:id`** — update status (for support/ops; verify ownership by tenantId).

### 3. Data model (create)

- `FeatureRequest` table/collection:
  | Field | Type | Notes |
  |-------|------|-------|
  | id | UUID | Primary key |
  | tenantId | UUID | Owning tenant |
  | merchantId | UUID | Submitter |
  | title | string(120) | Required |
  | description | text | Optional |
  | status | enum | `open / triaged / in_progress / shipped / declined` |
  | createdAt | timestamp | |

### 4. Frontend wiring (after endpoint exists)

- Replace the `window.dispatchEvent(new CustomEvent("feature:requested", …))` stub in
  `dukaDesk/src/components/pages/Integrations.jsx` with a call to
  `POST /api/v1/feature-requests` (add `requestFeature()` to `dukaDesk/src/services/api.js`).
- Optionally render a "My requests" list with status badges.

---

## Status

| Item | Status | Notes |
|------|--------|-------|
| Features stored in tenant config (`app.modules`) | ✅ Done (frontend) | No backend work needed |
| `POST /api/v1/feature-requests` | ⬜ OPEN | Create endpoint |
| `GET /api/v1/feature-requests` | ⬜ OPEN | For "My requests" |
| `PATCH /api/v1/feature-requests/:id` | ⬜ OPEN | Admin triage |