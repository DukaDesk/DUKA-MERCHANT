# Mobile Progress

This file tracks the current state of the mobile repository (DukaDesk — Expo + React Native).

## Active Work

2026-09-19: Published-app shell reconstruction implemented. [Report](PUBLISHED_APP_RECONSTRUCTION_2026-09-19.md) | [Executed plan](PUBLISHED_APP_RECONSTRUCTION_TODO.md) | [Deployment/device TODO](PUBLISHED_APP_PARITY_VERIFICATION_TODO.md).

| Task | Specification | Status | Owner |
|------|---------------|--------|-------|
| Endpoint alignment to live OpenAPI 3.0.0 (328 paths) | `GET /api/docs-json` verification | Complete | Engineering |
| Slug always derived from display name | `DesignStore.js` + `SectionPanel.jsx` + `ManifestResolver.ts` | Complete | Engineering |
| Demo data unhooked from all UI screens | `nearbyStores`, `deskCategories`, `promoAds`, `runtime/tenants/**` | Complete | Engineering |
| `hybridClient.ts` — live-only client replacing mock | `src/services/api/hybridClient.ts` | Complete | Engineering |
| Builder slug field in Splash Screen card | `DesignStore.js` + `SectionPanel.jsx` | Complete | Engineering |

## Completed Milestones

| Date | Milestone | Notes |
|------|-----------|-------|
| 2026-09-14 | Live endpoint sync | All 328 live OpenAPI paths verified; `/tenants`→`/merchants`, `/app/*` for authenticated mobile, `unwrap()` on tenant/bff/discovery; `getProducts` `limit/page/categoryId`, `getOrders` `limit/page/status`, `getTax` `subtotal/region`, `getBookings` `limit/page/status/date/serviceId/staffId`, `getCalendar` `from/to` |
| 2026-09-14 | Slug derived from display name | `DesignStore.js` `setMeta` always syncs slug from appName; `ensureMetaSlug()` overwrites stale slug; `SectionPanel.jsx` slug input read-only via `slugifyAppName()`; `ManifestResolver.ts` computes `displaySlug` from displayName; `identity.slug` uses `displaySlug` |
| 2026-09-14 | Demo data unhooked | `ExploreScreen`, `CategoriesScreen`, `CategoryTenantsScreen`, `my-desk.tsx` all fetch live only (`discoveryApi.getFeatured()`, `bffApi.getDiscoveryFeed()`, `commerceApi`); show `No published …` placeholders; no dummy imports |
| 2026-09-14 | `hybridClient.ts` | Live-only client, no `createMockClient` import; `getClient()` returns hybrid client |
| 2026-09-14 | Builder slug field | Added `slug` to `DesignStore.js` meta defaults, `slugify()` helper, `ensureMetaSlug()` migration, auto-slug from appName in `setMeta`; slug input in `SectionPanel.jsx` splash area with `dukadesk.app/{slug}` prefix |
| 2026-07-20 | Package 12 — Runtime Validation & Test Data | 56 files: schemas, validators, integrity checks, runtime/renderer/publish tests, reports |
| 2026-07-20 | Package 11 — Published Tenant Application | 32 files: manifest, routing (41 routes), navigation (5 tabs, 12 modals), security (ECDSA-SHA256), compatibility |
| 2026-07-20 | Package 10 — Master Data & Content | 48 files: 500 products, 100 promos, 1000 images, full localization (~400 keys) |
| 2026-07-19 | Package 09 — Notifications, Settings & Support | 11 screens, 500 notifications, 300 articles, 200 FAQs, 100 tickets |
| 2026-07-17 | Package 08 — Profile, Wallet & Loyalty | 132 JSON files + 110 data files (500 transactions, 1000 loyalty entries) |
| 2026-07-17 | Packages 05, 06, 07 — Cart, Orders, Reservations | Cart/checkout (70 files), orders (63 files, 560 orders), reservations (65 files, 340 reservations) |
| 2026-07-15 | Packages 01–04 — Application, Auth, Home, Menu | 60+ files per package, full screen definitions |
| 2026-07-12 | Guest mode | "Explore App" flow, tab gating, EventBus auth prompt |
| 2026-07-10 | Google OAuth | expo-auth-session with lazy import, client IDs configured |
| 2026-07-09 | Auth screens wired to real API | Sign-in, sign-up, forgot/reset password with loading + validation modal |
| 2026-07-08 | MMKV storage factory | createMMKVStorage(id) with per-instance error handling + Map fallback |
| 2026-07-07 | EAS build runner | run-eas.mjs with EXPO_TOKEN, ProGuard, expo-build-properties |
| 2026-07-06 | Icon & splash | Dukalogo.png, navy #1a1a2e background |
| 2026-07-04 | Categories tab | 20 categories, grid/list toggle, search, QR scanner |
| 2026-07-03 | API endpoint layer | Full typed layer in src/services/api/endpoints/ (57 functions) |
| 2026-07-01 | Project bootstrap | Expo SDK 52, expo-router, TypeScript, Zustand |

## Blockers

| Issue | Impact | Owner |
|-------|--------|-------|
| Live backend still serving legacy empty/stale definitions until merchant re-publish | Mobile shows "No screens published yet" until a merchant republishes (backend deployed 2026-09-27: B4 migration + B7 contract) | Backend / Release |
| Live branding fields (`identity.displayName`, `appName`, `branding`, `theme.brand.logo`, `assets.logo.url`) | Code path returns them once active release is live; backend deployed, republish pending | Backend / Release |

## Next Up

- Merchant re-publish, then verify both read paths (B8) — backend is deployed (B4 migration applied, B7 contract live 2026-09-27)
- Mobile M3 canonical read transition after backend parity is deployed
- E2E integration tests for all modules
- API versioning strategy (v2 planning)

## Last Updated

2026-09-27

Backend deployed: `20260924000000_add_active_release` applied in production (audit clean) and B7 runtime contract live at `GET /api/v1/compatibility` — no mobile client changes required yet.

2026-09-20: Backend release revalidation and explicit update adoption implemented; 88 mobile tests and Android/iOS exports pass. [Delivery report](PUBLISHED_APP_DELIVERY_CLIENT_IMPLEMENTATION_2026-09-20.md).
