# Mobile Agent Context

## Overview

The `mobile/` repository contains the DUKADESK OS mobile applications for iOS and Android.

## Responsibilities

- Native or cross-platform mobile user interface
- Mobile-specific state management
- Offline support and local storage
- Push notification handling
- Secure authentication flows

## Non-Responsibilities

- Server-side business logic
- Web rendering
- Infrastructure provisioning

## Technology Stack

- Framework: React Native via Expo SDK 52 (v56.0.0 docs)
- Language: TypeScript (strict mode)
- State Management: Zustand (session, action loading, settings) + React Context/useReducer for local state
- Persistence: MMKV (4 separate instances via factory pattern: tenant, session, booking, platform)
- Routing: expo-router (file-based routing, `app/(tabs)/` structure, deep links)
- Networking: axios with unwrap() helper for { success, message, data } envelope
- Google Auth: expo-auth-session (lazy-imported to avoid native module crash)
- Testing: TBD

## Repository Structure (DUKA-MOBILE)

```text
mobile/
  app/                     # expo-router file-based routes
    (tabs)/                # Tab navigator screens
    _layout.tsx            # Root layout
  src/
    components/            # Reusable UI components (HeroBanner, PrimaryButton, DynamicCard, ValidationModal, etc.)
    data/                  # Static data, runtime tenant data
      runtime/tenants/bella-italia/  # All 12 runtime packages
    network/               # API client, constants
    screens/               # Screen-level components
    services/              # API endpoints, auth service
    store/                 # Zustand stores (session, actionLoading, settings, storage)
    utils/                 # Permissions helpers, event bus
  scripts/                 # EAS build scripts
  AGENT_CONTEXT.md
  README.md
```

## Build and Test

```bash
npm install
npm run lint
npm run typecheck
npx expo start
npx eas build --platform android --profile production
scripts/run-eas.mjs          # Android EAS auto-submit
```

## Engineering Standards

- [Repository Standard](../engineering-governance/repository-governance/REPOSITORY_STANDARD.md)
- [Branching Standard](../engineering-governance/repository-governance/BRANCHING_STANDARD.md)
- [Versioning Standard](../engineering-governance/repository-governance/VERSIONING_STANDARD.md)
- [Pull Request Standard](../engineering-governance/repository-governance/PR_STANDARD.md)
- [Review Standard](../engineering-governance/repository-governance/REVIEW_STANDARD.md)
- [Release Standard](../engineering-governance/repository-governance/RELEASE_STANDARD.md)
- [AI Context Standard](../engineering-governance/repository-governance/AI_CONTEXT_STANDARD.md)
- [Boot Process Standard](../engineering-governance/repository-governance/BOOT_PROCESS_STANDARD.md)

## Specification Traceability

Specifications that target this repository:

| Specification | Title | State |
|---------------|-------|-------|
| FEAT-0001 | Email/password authentication | Complete |
| FEAT-0002 | Google OAuth integration | Complete |
| FEAT-0003 | Guest mode ("Explore App") | Complete |
| PKG-01 | Application runtime package (Bella Italia) | Complete |
| PKG-02 | Authentication runtime package | Complete |
| PKG-03 | Home runtime package | Complete |
| PKG-04 | Menu runtime package | Complete |
| PKG-05 | Cart & Checkout runtime package | Complete |
| PKG-06 | Orders runtime package | Complete |
| PKG-07 | Reservations runtime package | Complete |
| PKG-08 | Profile, Wallet & Loyalty runtime package | Complete |
| PKG-09 | Notifications, Settings & Support runtime package | Complete |
| PKG-10 | Master Data & Content runtime package | Complete |
| PKG-11 | Published Tenant Application package | Complete |
| PKG-12 | Runtime Validation & Test Data package | Complete |

## Agent Conventions

- Reference engineering specifications by ID in commits and pull requests.
- Follow platform-specific accessibility guidelines.
- Keep UI components testable and reusable.
- Securely store tokens and credentials.
- Update this context when responsibilities or structure change.

## Common Tasks

- Implement a UI specification: build screens, components, and navigation (expo-router).
- Integrate an API: add endpoint in `src/services/api/endpoints/`, use unwrap() helper.
- Generate runtime tenant data: run node scripts from `C:\Users\Prime\AppData\Local\Temp\opencode\pkg*.js`.
- Handle push notifications: use expo-notifications with lazy permission request.
- Add persisted store: use createMMKVStorage(id) factory from `src/store/storage.ts`.
- Gate guest actions: fire `auth:required` EventBus event, caught by AuthPromptModal.

- Stop and ask for human input when:

- A change requires native module changes.
- A security-critical decision is required.
- A platform-specific store policy is involved.

## Endpoint Contract (Live API)

The mobile app consumes the live backend OpenAPI 3.0.0 contract (`GET /api/docs-json`, 328 paths). All endpoints must be verified against live docs before implementation.

**Path canonicalization rules:**
- Public catalog: `/api/v1/merchants/{merchantId}/products|categories|definition|booking/*` — no auth, `@Public()`
- Authenticated mobile: `/api/v1/app/commerce/*`, `/api/v1/app/booking/*`, `/api/v1/app/security/consent` — JWT required
- BFF mobile: `/api/v1/bff/mobile/*` — `unwrap()` for `{success,message,data}` envelope
- **No** `/api/v1/tenants/*` — canonical prefix is `/api/v1/merchants/{id}` (verified via `GET /merchants/{id}/products` 200 vs `/tenants/{id}/products` 404)
- **No** `/api/v1/profile`, `/api/v1/auth/me`, `/api/v1/cart/*`, `/api/v1/orders/*` — don't call these

**Key endpoint parameter contracts (from live docs):**
| Endpoint | Method | Params |
|----------|--------|--------|
| `/merchants/{merchantId}/products` | GET | `merchantId(path)*`, `sort`, `maxPrice`, `minPrice`, `search`, `categoryId`, `limit`, `page` |
| `/merchants/{merchantId}/categories` | GET | `merchantId(path)*` |
| `/merchants/{merchantId}/booking/availability` | GET | `merchantId(path)*`, `serviceId(query)*`, `date(query)*`, `staffId(query)` |
| `/merchants/{merchantId}/booking/staff` | GET | `merchantId(path)*` |
| `/merchants/{merchantId}/booking/locations` | GET | `merchantId(path)*` |
| `/app/commerce/cart` | POST | none (tenant from JWT) |
| `/app/commerce/cart/{id}/checkout` | POST | none |
| `/app/commerce/orders` | GET | `limit`, `page`, `status` |
| `/app/commerce/tax-calc` | GET | `subtotal*`, `region` |
| `/app/booking/bookings` | GET | `limit`, `page`, `date`, `staffId`, `serviceId`, `status` |
| `/app/booking/calendar` | GET | `from*`, `to*` |
| `/bff/mobile/discovery` | GET | none |
| `/bff/mobile/tenant/{slug}/manifest` | GET | `slug(path)*` |
| `/app/security/consent` | POST | none |
| `/bff/mobile/profile` | GET | none |

**Envelope handling:** All responses wrapped in `{success, message, data}`. Use `unwrap()` helper in endpoint modules. `tenant.ts`, `bff.ts`, `discovery.ts` all use `unwrap()`.

**Demo data unhooked:** Files `src/data/deskCategories.ts`, `src/data/nearbyStores.ts`, `src/data/promoAds.ts`, `src/data/runtime/tenants/**` exist on disk but are NOT imported by any screen. All explore/category screens fetch live only.

**App slug = display name:** The slug is always the slugified version of the app/display name. In `DesignStore.js`, `setMeta` always syncs slug from appName. In `ManifestResolver.ts`, `displaySlug` is computed from displayName via the same algorithm: `.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'')`.

## Escalation

Stop and ask for human input when:

- A change requires native module changes.
- A security-critical decision is required.
- A platform-specific store policy is involved.
