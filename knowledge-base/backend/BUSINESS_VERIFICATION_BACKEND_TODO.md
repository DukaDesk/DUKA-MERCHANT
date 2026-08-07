# Business Verification (KYC) — Backend TODO

> **To:** DUKA-BACKEND Team
> **From:** Business Dashboard (merchant-portal / dukaDesk)
> **Status:** OPEN — awaiting backend endpoints
> **Date:** 2026-08-07
> **Ref:** Backend `api-endpoints-reference.md` §24 (Security & Compliance)

## Summary

The Business Dashboard collects **merchant compliance / business-verification (KYC)** data in
`dukaDesk/src/components/pages/Compliance.jsx` and submits it via
`dukaDesk/src/services/api.js → submitCompliance(tenantId, formData)`.

Today the frontend **has no dedicated backend endpoint** for this data. It works around the gap by
writing the values into the generic **tenant runtime config**
(`PUT /api/v1/tenants/:tenantId/config` → `config.compliance`), and verification documents are now
uploaded through the existing **Media/DAM** endpoint (`POST /api/v1/tenants/:tenantId/media/upload`),
with the returned media reference stored in the same config object.

The Security & Compliance module (KB §24) only exposes *security policy, api-keys, events, summary,
and consent* endpoints — **none of them model or store a business verification record.**

This document lists the backend work required to make compliance a first-class, verifiable domain.

---

## Required Backend Work

### 1. Missing dedicated endpoints (create)

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | `/api/v1/tenants/:tenantId/compliance` | `PUT` | Submit / upsert business compliance data (structured) |
| 2 | `/api/v1/tenants/:tenantId/compliance` | `GET` | Read current compliance / verification status |
| 3 | `/api/v1/tenants/:tenantId/compliance/documents` | `POST` | Bind verification document (Media/DAM id) to compliance record |
| 4 | `/api/v1/tenants/:tenantId/compliance/status` | `PATCH` | Internal/admin: transition verification status |
| 5 | (optional) `/api/v1/admin/compliance/:tenantId/review` | `POST` | Admin approve / reject decision payload |

### 2. Payload fields with no current endpoint (must be supported)

These fields are collected by the frontend and sent in the compliance payload. The backend has **no
first-class endpoint or schema** for them today:

| Field | Type | Notes |
|-------|------|-------|
| `businessName` | string | ALSO sent to `PUT /tenants/:id` as `name` ✅ |
| `businessType` | enum | e.g. Restaurant/Retail/Service/School/Church/Other |
| `regNumber` | string | RC / CAC registration |
| `taxId` | string | Tax Identification Number (TIN) |
| `phone` | string | ALSO sent to `PUT /tenants/:id` ✅ |
| `website` | string | |
| `address` | string | ALSO sent (combined) on tenant ✅ |
| `city` | string | |
| `state` | string | |
| `country` | string | default `Nigeria` |
| `idDoc` | object | Government ID ref: `{ name, size, status, mediaId, url }` |
| `bizDoc` | object | Business registration ref |
| `utrDoc` | object | Utility bill / address proof ref |
| `status` | string | Frontend submits `"pending"` — backend should own/mutate this |
| `complianceDone` | boolean | Frontend flag (subjective — backend should derive from real status) |
| `submittedAt` | ISO date | |

### 3. Verification state model (recommended)

Backend should introduce a verification lifecycle so the frontend flag is not the source of truth:

```
draft → submitted → pending_review → approved | rejected(note) → resubmitted
```

Endpoint **1** above returns/server-mutates `status`; the frontend `complianceDone` flag
(`getComplianceStatus`) should eventually be replaced by reading `GET /compliance` → `status`.

### 4. Contract expectations from the frontend

- **Request** (POST `/tenants/:tenantId/compliance`):
  ```json
  {
    "businessName": "Acme Ltd",
    "businessType": "Retail",
    "regNumber": "RC12345",
    "taxId": "TIN123",
    "phone": "+2348012345678",
    "website": "https://acme.com",
    "address": "1 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "documents": {
      "idDoc":  { "mediaId": "...", "url": "..." },
      "bizDoc": { "mediaId": "...", "url": "..." },
      "utrDoc": { "mediaId": "...", "url": "..." }
    }
  }
  ```
- **Response** should include: `id`, `tenantId`, `status`, `submittedAt`, and any `missingFields`/validation summary.

---

## Current Frontend Implementation

- **UI:** `dukaDesk/src/components/pages/Compliance.jsx` (3-step form → Business Info / Documents / Review)
- **Service:** `dukaDesk/src/services/api.js`:
  - `submitCompliance(tenantId, formData)` — uploads docs via Media/DAM, writes config.compliance (provisional)
  - `getComplianceStatus(tenantId)` — reads `config.compliance.complianceDone`
- **Provision:** until the endpoints above land, data lives under `PUT /tenants/:id/config` →
  `compliance`.

---

## Backend Acceptance Criteria

- [ ] `POST /tenants/:id/compliance` persists the full payload (all fields in §2)
- [ ] `GET /tenants/:id/compliance` returns stored data + authoritative status
- [ ] Verification document references stored via Media/DAM id (no base64 blobs in config)
- [ ] `status` field is backend-owned: `draft | submitted | pending_review | approved | rejected`
- [ ] Swagger/OpenAPI docs for all new endpoints
- [ ] E2E test coverage for submit → review → approve/reject flow

---

## Related

- [API Endpoints Reference](api-endpoints-reference.md) — §24 Security & Compliance
- Commercial Dashboard controller: `dukaDesk/src/components/pages/Compliance.jsx`