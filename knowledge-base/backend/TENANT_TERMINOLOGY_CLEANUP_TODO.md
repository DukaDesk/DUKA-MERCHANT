# Tenant → App/Merchant terminology cleanup — Backend TODO

> **To:** DUKA-BACKEND Team
> **From:** Frontend / API-consumer review
> **Status:** OPEN — paths mostly migrated; labels, messages, params and payloads still say "tenant"
> **Date:** 2026-09-28
> **Ref:** Live contract `https://duka-backend-production.up.railway.app/api/docs-json` (snapshot 2026-09-28, ~340 paths)

## Why

"Tenant" was renamed to app/merchant across the three-tier API because it confused
consumers, but the rename stopped at path prefixes. Sign-in debugging (2026-09-28)
showed users still hitting a literal **`Tenant not found`** error from
`MerchantsService.findById`, and the live Swagger surface still teaches the old
vocabulary: 77 operation summaries, 50 parameter names, 13 tag groups and 5 paths.

Consumers (merchant portal, mobile) key off these strings for error handling and
support diagnostics, so every leftover instance is a live papercut, not docs polish.

## What is already migrated (do not regress)

- Public catalog: `/api/v1/merchants/{merchantId}/*`, `/api/v1/resolve/{slug}`
- Self-service: `/api/v1/app/*` (JWT, tenant auto-resolved)
- Publishing: `/api/v1/merchants/{id}/publishing/*`, compatibility, preflight
- Admin merchants/users: `/api/v1/admin/merchants*` (except §1.5 below)

## 1. Paths still named `tenant` (5)

| # | Live path | Ask |
|---|-----------|-----|
| 1.1 | `GET /api/v1/bff/mobile/tenant/{slug}/manifest` | Rename to `/api/v1/bff/mobile/merchants/{slug}/manifest` (or `.../apps/...`); keep old as 301/alias for one release. Mobile `bff.ts:getTenantManifest` and `ManifestResolver` BFF fallback must move together. |
| 1.2 | `GET /api/v1/bff/tenant/{id}/summary` | Same — merchant/app naming. |
| 1.3 | `GET /api/v1/bff/tenant/{id}/analytics` | Same. |
| 1.4 | `GET /api/v1/bff/tenant/{id}/integrations` | Same. |
| 1.5 | `GET /api/v1/admin/users/tenant/{tenantId}` | Already documented as "legacy alias for merchant/:merchantId" — set a removal date and delete it; do not mint new callers. |

## 2. Swagger tags still saying "(Tenant Self-Service)" (13 groups)

Every `/app/*` group tag reads `X - App (Tenant Self-Service)`:
Analytics, Booking, Commerce, Forms, Integrations, Media/DAM, Merchants,
Notifications, Payments, Search, Security, Theme, plus `Tenant Dashboard BFF`.
Rename pattern: `X - App (Merchant Self-Service)` (or `App (Business)` per
naming decision) and `Merchant Dashboard BFF`.

## 3. Operation summaries/descriptions (77 ops)

Examples from the live snapshot (full list via `docs-json` grep for `tenant`):

- `POST /api/v1/merchants` — "Create a new tenant" → "Create a new merchant/app"
- `GET /api/v1/merchants/{id}` — "Get tenant by ID" → merchant/app
- `GET /api/v1/app/merchants` — "Get my tenants" → "Get my merchants/apps"
- `PUT /api/v1/app/merchants` — "Update current tenant" → merchant/app
- `POST /api/v1/app/merchants/publish` — "Publish current tenant" → merchant app
- `GET /api/v1/notifications/*` — "(optional tenant filter)" → merchant filter
- `GET /api/v1/admin/users*` — "filter: email, role, tenant, status", "tenant memberships", "Invite user to tenant", "roles for user in tenant(s)" → merchant/app wording

Acceptance: zero case-insensitive `tenant` hits in `summary`/`description`
outside a dated `Deprecated:` note.

## 4. Parameter names (50)

`tenantId` query/path params across analytics, search, AI, infra, developer,
marketplace, assets, notifications, admin users, `POST /templates/{id}/use`.
Decision needed: rename to `merchantId` (breaking, versioned) or accept both
with `tenantId` documented as deprecated alias. Either way the canonical name
in docs must be `merchantId`/`appId`, matching the path convention.

## 5. Error messages and codes (user-visible)

| Current | Location | Ask |
|---------|----------|-----|
| `Tenant not found` | `merchants.service.ts` `findById`/`findBySlug`/publish | `Merchant not found` / `App not found` (keep HTTP 404; add stable `code`, e.g. `MERCHANT_NOT_FOUND`, so clients stop string-matching) |
| `Membership not found` | `merchants.service.ts` `removeUser` | `Membership` → merchant-member wording + code |
| `User does not have access to any tenant as owner or manager` | `tenant-resolver.service.ts` | merchant/app wording (403 body) |
| `Tenant not found` (NotFound `TENANT_NOT_FOUND`) | `active-release.service.ts` reader | Same rename + keep typed code contract mobile already consumes |

## 6. Auth payloads (sign-in papercut, 2026-09-28)

`POST /api/v1/auth/login` (and refresh/social) return
`{user: {id, email, firstName, lastName, status}}` — no merchant/app reference.
Consumers then probe `GET /api/v1/app/merchants`, which returns **TenantUser
membership rows**, and misread `row.id` (membership id) as the tenant id,
causing follow-on 404s. Decide one contract and document it in Swagger:

- Option A (recommended): login/register responses include
  `merchants: [{id, name, slug, role}]` (or `apps`), so no probe is needed.
- Option B: document that `/app/merchants` returns memberships and clients must
  read `row.tenant`/`row.tenantId`.

Frontend is working around this client-side; the backend contract is the real fix.

## 7. Out of scope (internal only, low priority)

Prisma models `Tenant`/`TenantUser`, `TenantResolverService` name, internal
variable names — rename only if touching those files anyway. API surface first.

## Acceptance criteria

- [ ] §1 paths renamed (or aliased with removal date); live `docs-json` shows merchant/app paths
- [ ] §2 tags renamed; no `Tenant` tag remains
- [ ] §3 zero `tenant` in summaries/descriptions (excluding dated deprecation notes)
- [ ] §4 canonical `merchantId` params documented; `tenantId` deprecated or removed
- [ ] §5 messages renamed with stable machine-readable `code`s
- [ ] §6 auth payload decision implemented + Swagger-documented
- [ ] Mobile + merchant-portal callers updated in the same release (BFF manifest path is consumed by `ManifestResolver` + `bff.ts`)

## Related

- Live contract: `GET /api/docs-json` (three-tier: Website `/admin/*`, App `/app/*`, Mobile `/merchants/*`)
- Sign-in investigation: merchant `services/api.js` `fetchTenantSilently`/`buildMerchant` vs `GET /app/merchants` membership shape
- B7 compatibility contract: `GET /api/v1/compatibility` (already merchant-neutral — keep as the naming example)
