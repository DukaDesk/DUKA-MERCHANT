# DUKADESK Progress Registry

**Last Updated:** 2026-09-27

2026-09-27: **Backend B7 compatibility contract live** (deploy `717d7d8d`) — anonymous `GET /api/v1/compatibility` publishes `dukadesk.published-app-runtime` 1.0.0 (manifest versions, 35 component types, 10 actions, 16 capabilities, limits); merchant `POST /merchants/:id/publishing/preflight` returns `{valid, compatible, errors, warnings, counts}` without publishing; `PublishingService` enforces the contract before activation (422 `INCOMPATIBLE_RUNTIME`); discovery now filters `activeReleaseId != null` and projects the active release identity. Gate: 58 tests / lint 0 errors / tsc 0 issues. Remaining: B8.

2026-09-27: **Backend B4 applied in production** — migration `20260924000000_add_active_release` live (deploy `a00865ae`, backfill 0 rows, `tenants.activeReleaseId` + index present); `_prisma_migrations` baseline recovered with 7× `migrate resolve --applied` after the failed `a10c79c6` (P3018/23502); `preDeployCommand` fixed to `npm run predeploy` (seed previously never ran) and `tsconfig.json` added to the runner image (seed was failing `ERR_UNKNOWN_FILE_EXTENSION`). Seed OK (3 templates, `acme-store`), audit 0 errors, health 200. Evidence: DUKA-BACKEND `docs/B4_MIGRATION_RUNBOOK.md`. Remaining: B8 merchant re-publish + live integration evidence (B7 completed later the same day — see the entry above).

2026-09-24: **Backend published-app delivery B1–B6 implemented** on `DUKA-BACKEND` main — canonical `ActiveReleaseService`, `ManifestValidator` for PublishedApp 1.0.0 object screens, atomic release activation with `tenant.activeReleaseId` + Idempotency-Key, owner/manager authz, media `folderId` + storage URL retention, default merchant app seed, `ApiQuotaGuard`, 5 unit suites (38 tests). B4 migration file written (not applied); B7 compatibility and B8 live integration evidence remain open. Tasks: [backend delivery TODO](backend/PUBLISHED_APP_DELIVERY_BACKEND_TODO.md). Status: code complete / live verify pending.

2026-09-19: Mobile now uses one shell and the complete published snapshot, with explicit errors for incompatible definitions. Merchant compilation preserves section/splash/chrome data and checks complete read-back. [Implementation report](mobile/PUBLISHED_APP_RECONSTRUCTION_2026-09-19.md) | [Execution plan](mobile/PUBLISHED_APP_RECONSTRUCTION_TODO.md) | [Remaining parity TODO](mobile/PUBLISHED_APP_PARITY_VERIFICATION_TODO.md).


2026-09-19: Fixed complete nested PublishedApp resolution on mobile and merchant false publish success/image stripping. Live BFF still exposes Storefront v0.0.7 and the referenced logo returns 404; backend publication and public media delivery remain unresolved. Evidence: [Published logo/release mismatch](backend/PUBLISHED_LOGO_RELEASE_MISMATCH_2026-09-19.md). Agent tasks: [Dedicated TODO file](backend/PUBLISHED_LOGO_RELEASE_MISMATCH_TODO.md).


## Status Key
- ✅ Complete — Production ready
- 🔧 In Progress — Actively being built
- ⏳ Planned — Not yet started
- ❌ Blocked — Has dependencies not yet met

## Platform Infrastructure

| Component | Status | Notes |
|-----------|--------|-------|
| Runtime Engine | 🔧 In Progress | Screen rendering, component registry, action system working; deterministic fallback IDs and validation fixes applied 2026-09-18 |
| Module System | 🔧 In Progress | Module registry working with default screens |
| Manifest Resolver | ✅ Complete | Validates and retains one complete published snapshot; no module/default-screen injection or guessed identity |
| Network Layer | ✅ Complete | Axios-based, interceptors, offline queue, caching; `hybridClient.ts` live-only |
| Auth System | ✅ Complete | Login/signup/reset flow, session management |
| State Management | 🔧 In Progress | Zustand stores. CartStore works, form data context implemented |
| Event Bus | ✅ Complete | Pub/sub for cross-component communication |
| Error Boundary | ✅ Complete | Component-level error catching |

## Mobile App (React Native / Expo)

| Component | Status | Notes |
|-----------|--------|-------|
| Explore/Home Screen | ✅ Complete | Live-only fetch `discoveryApi.getFeatured()`, `bffApi.getDiscoveryFeed()`, no demo data |
| Desk Screen | ✅ Complete | Tab navigation, screen switching, splash with `resolvedDisplayName`/`resolvedLogo`, no dummy fallback |
| Screen Renderer | ✅ Complete | Layout path + children path working |
| Endpoint Layer | ✅ Complete | All 57 functions aligned to live OpenAPI 3.0.0 (328 paths); `/tenants`→`/merchants`, `/app/*` authenticated |
| Slug System | ✅ Complete | Builder: `DesignStore.js` `setMeta` syncs slug from appName; Mobile: `ManifestResolver.ts` computes `displaySlug` from displayName |
| Demo Data | ✅ Unhooked | `nearbyStores`, `deskCategories`, `promoAds`, `runtime/tenants/**` on disk but NOT imported |
| Component Registry | 🔧 In Progress | 50+ components registered. Some unused, some incomplete |
| Section Components | 🔧 In Progress | CategoryPills, MenuGrid, etc. wired to actions. AddressForm, CartSummary added |
| Action Engine | ✅ Complete | All 21 ActionType values have registered handlers |
| Cart Flow | 🔧 In Progress | Add/remove works. Checkout screen exists |
| Orders | 🔧 In Progress | Order history + order detail screens for both tenants |
| Notifications | 🔧 In Progress | List rendered. Dismiss + markAllRead + tap-to-screen working |
| Booking (MK only) | 🔧 In Progress | Calendar/slot selection, confirm API action working |
| Splash Screen | ✅ Complete | Branded splash with logo + initials fallback |
| Filter/Category | ✅ Complete | Category pills emit events, MenuGridSection filters items |

## Backend

| Component | Status | Notes |
|-----------|--------|-------|
| API Design | ✅ Complete | ~428 endpoints across 32 modules, three-tier architecture |
| Data Model | ✅ Complete | 85+ Prisma models, 2073 lines, PostgreSQL 16 |
| Tenant System | ✅ Complete | Tenant lifecycle, config, subscriptions, feature flags |
| Auth & IAM | ✅ Complete | JWT, Google/Apple OAuth, OTP, password recovery, devices |
| Commerce | ✅ Complete | Products, cart, orders, coupons, tax, fulfillment, inventory |
| Booking & Scheduling | ✅ Complete | Services, staff, resources, availability, 7-state workflow |
| Forms & Workflow | ✅ Complete | Versioned forms, validation engine, approval workflows |
| Payments | ✅ Complete | Paystack/Flutterwave/Stripe, intents, refunds, settlements |
| Notifications | ✅ Complete | Templates, push/email/SMS, campaigns, preferences |
| Builder (SDUI) | ✅ Complete | Pages, sections, components, actions, conditions, data binding |
| Publishing | ✅ Complete | Validation, manifest compiler, releases, rollback |
| Media / DAM | ✅ Complete | Upload, sharp optimization, variants, folders, CDN |
| Theme | ✅ Complete | Theme management, compiler, versioning, caching |
| Integrations | ✅ Complete | Connector framework, SendGrid, Google Calendar |
| Analytics & BI | ✅ Complete | Event tracking, dashboards with widget data resolution, reports |
| Search & Discovery | ✅ Complete | Full-text index, synonyms, autocomplete, facets |
| AI Platform | ✅ Complete | OpenAI/Anthropic/Mock providers, prompts, embeddings |
| Platform Administration | ✅ Complete | Settings, announcements, feature flags, quotas |
| Infrastructure & DevOps | ✅ Complete | Deployments, environments, health checks, backups |
| Security & Compliance | ✅ Complete | Policies, API keys, security events, consent audits |
| Developer Platform | ✅ Complete | Developer apps, webhook endpoints, event logs |
| Marketplace & Plugins | ✅ Complete | Listings, plugin installations |
| BFF Layer | ✅ Complete | Mobile, Tenant Dashboard, Business Dashboard, Website |
| Three-Tier Architecture | ✅ Complete | Website/App/Mobile split, App/Public controller pattern |
| TASK-0025: Dashboard | ✅ Complete | Widget data resolution, DTOs, widget type registry |

## Builder & Dashboards

| Component | Status | Notes |
|-----------|--------|-------|
| Builder Studio Architecture | ✅ Complete | KB-022 — Builder Studio Architecture defined |
| Desk Builder | ✅ Complete | KB-023 — Desk Builder Specification defined |
| Screen & Layout Builder | ✅ Complete | KB-024 — Screen & Layout Builder defined |
| Workflow Builder | ✅ Complete | KB-025 — Workflow Builder defined |
| Form Builder | ✅ Complete | KB-026 — Form Builder Specification defined |
| Theme Builder | ✅ Complete | KB-027 — Theme Builder defined |
| Data Model Builder | ✅ Complete | KB-028 — Data Model Builder defined |
| Preview Runtime | ✅ Complete | KB-029 — Preview Runtime defined |
| Validation Engine | ✅ Complete | KB-030 — Validation Engine defined |
| Publishing Pipeline | ✅ Complete | KB-031 — Publishing Pipeline defined; release history is read once per publish and existing screen definitions are preserved while empty projects use template fallback |
| SDUI Authoring | ✅ Complete | Template gallery (21 templates, search, category filter chips, color-block cards), drag-drop component palette, screen management, phone preview, PageFly-inspired section editor with inline editing, floating toolbars, editor theme design system |
| Business Dashboard | ✅ Complete | Live `Admin-portal` `https://github.com/DukaDesk/DUKA-ADMIN` — shell + `PendingAdmins`/`Merchants`/`Marketplace`/`Audit`/`Subscriptions`/`Settings` + **Orders/Products/Customers/Analytics/Marketing/Infrastructure** (`317a549` `1896 modules ✓`, live `GET /app/commerce/*`, `GET /admin/users/merchant/:id`, `GET /analytics/reports/*`, `GET /infra/overview`), role-aware `platform_operator`/`support_agent`/`super_admin`, tenant correlation `getMerchantEnriched` + `da83369` customers per-merchant, `Bell` icon `bb05d76`, counts mapping `47f61e2`, merchant **approve/decline with credential review** `6588a6a` `POST /admin/merchants/:id/reject` |
| Tenant Dashboard | 🔧 In Progress | Merchant portal dashboard/builder exists locally; published definition and BFF parity reads wired, but it is not yet the full manifest-driven tenant runtime |

## SDUI & Data Layer

| Component | Status | Notes |
|-----------|--------|-------|
| Mock Client | ✅ Complete | JSON-backed mock for all API methods |
| ApiClient Interface | ✅ Complete | getManifest, getTheme, getNavigation, getScreen, getAssetUrl |
| Tenant Data (MK) | ✅ Complete | Mama's Kitchen — menu, orders, offers, info, notifications, booking, checkout |
| Tenant Data (GP) | ✅ Complete | Grace Pharmacy — products, orders, offers, info, notifications, checkout |
| Asset System | ✅ Complete | getAssetUrl returns string \| number. Mock serves local require'd assets |

## Known Gaps
1. MenuGridSection needs per-item RuntimeNodes for action system add_to_cart
2. FormEngine (multi-step forms) not yet wired to FormDataContext
3. Backend has 0% test coverage — no unit or e2e tests written
4. (Resolved) Screen & Layout Builder (KB-024) through Publishing Pipeline (KB-031) all completed
5. No persistence layer for form data across app restarts
6. Mobile saved addresses and payment methods await backend endpoints.
7. Merchant portal preview/editor and mobile `ScreenEngine` use related schemas but are not yet one shared cross-platform renderer; parity is currently verified by published definition/BFF manifest comparison.

## Marketplace

| Component | Status | Notes |
|-----------|--------|-------|
| Marketplace Architecture | ✅ Complete | KB-032 — Marketplace Architecture defined |
| Package & Artifact Specification | ✅ Complete | KB-033 — Package & Artifact Specification defined |
| Extension & Plugin Framework | ✅ Complete | KB-034 — Extension & Plugin Framework defined |
| Capability Marketplace | ✅ Complete | KB-035 — Capability Marketplace defined |
| Component Marketplace | ✅ Complete | KB-036 — Component Marketplace defined |
| Theme Marketplace | ✅ Complete | KB-037 — Theme Marketplace Specification defined |
| Template Marketplace | ✅ Complete | KB-038 — Template Marketplace Specification defined |
| Marketplace Certification & Trust | ✅ Complete | KB-039 — Marketplace Certification & Trust defined |
| Marketplace Distribution & Lifecycle | ✅ Complete | KB-040 — Marketplace Distribution & Lifecycle defined |

> **Marketplace Architecture Suite**: Complete ✅

## Application Model Architecture

| Component | Status | Notes |
|-----------|--------|-------|
| Application Architecture Overview | ✅ Complete | KB-041 — Application Architecture Overview defined |
| Application Manifest Specification | ✅ Complete | KB-042 — Application Manifest Specification defined |
| Workspace & Tenant Model | ✅ Complete | KB-043 — Workspace & Tenant Model defined |
| Navigation Model | 🔧 In Progress | KB-044 — Navigation Architecture defined — Draft |
| Screen Model | 🔧 In Progress | KB-045 — Screen Model defined — Draft |
| Component Tree Model | 🔧 In Progress | KB-046 — Component Tree Model defined — Draft |
| Action & Event Model | 🔧 In Progress | KB-047 — Action & Event Model defined — Draft |
| State Model | 🔧 In Progress | KB-048 — Application State Model defined — Draft |
| Theme Model | 🔧 In Progress | KB-049 — Theme & Design Token Model defined — Draft |
| Capability Composition | 🔧 In Progress | KB-050 — Capability Composition Model defined — Draft |

> **Application Model Architecture Suite**: Complete ✅

## Runtime & Rendering Architecture

| Component | Status | Notes |
|-----------|--------|-------|
| Runtime Architecture Overview | ✅ Complete | KB-051 — Runtime Architecture Overview defined |
| Runtime Rendering Engine | ✅ Complete | KB-052 — Rendering Engine Architecture defined |
| SDUI Architecture | ✅ Complete | KB-053 — Rendering Pipeline Architecture defined |
| Runtime Component Registry | ✅ Complete | KB-054 — Runtime Component Registry Architecture defined |
| Runtime State Engine | ✅ Complete | KB-055 — Runtime State Engine Architecture defined |
| Runtime Navigation Engine | ✅ Complete | KB-056 — Runtime Navigation Engine Architecture defined |
| Runtime Security Architecture | ✅ Complete | KB-057 — Runtime Security Architecture defined |
| Runtime Observability & Diagnostics | ✅ Complete | KB-058 — Runtime Observability & Diagnostics Architecture defined |
| Runtime Performance & Optimization | ✅ Complete | KB-059 — Runtime Performance & Optimization Architecture defined |
| Runtime Lifecycle Management | ✅ Complete | KB-060 — Runtime Lifecycle Management Architecture defined |
| Runtime Update & Versioning | ✅ Complete | KB-061 — Runtime Update & Versioning Architecture defined |
| Runtime Deployment & Environment | ✅ Complete | KB-062 — Runtime Deployment & Environment Architecture defined |

> **Runtime & Rendering Architecture Suite**: Complete ✅

## Identity & Access Architecture

| Component | Status | Notes |
|-----------|--------|-------|
| Identity Platform Architecture | ✅ Complete | KB-063 — Identity Platform Architecture defined |
| Authentication Architecture | ✅ Complete | KB-064 — Authentication Architecture defined |
| Authorization & RBAC Architecture | ✅ Complete | KB-065 — Authorization & RBAC Architecture defined |
| Universal Consumer Identity | ✅ Complete | KB-066 — Universal Consumer Identity Architecture defined |
| Consent & Privacy Architecture | ✅ Complete | KB-067 — Consent & Privacy Architecture defined |
| Session Management | ✅ Complete | KB-068 — Session Management Architecture defined |
| Organization, Tenant & Workspace Security | ✅ Complete | KB-069 — Organization, Tenant & Workspace Security Architecture defined |
| API Security & Token Architecture | ✅ Complete | KB-070 — API Security & Token Architecture defined |
| Identity Federation & Social Login | ✅ Complete | KB-071 — Identity Federation & Social Login Architecture defined |
| Audit, Compliance & Identity Governance | ✅ Complete | KB-072 — Audit, Compliance & Identity Governance Architecture defined |

> **Identity & Access Architecture Suite**: Complete ✅

## Data Platform Architecture

| Component | Status | Notes |
|-----------|--------|-------|
| Data Platform Architecture | 🔧 In Progress | KB-073 — Data Platform Architecture defined — Draft |
| Data Modeling & Schema Governance | 🔧 In Progress | KB-074 — Data Modeling & Schema Governance Architecture defined — Draft |
| Storage Architecture | 🔧 In Progress | KB-075 — Storage Architecture defined — Draft |
| Data Access Layer Architecture | 🔧 In Progress | KB-076 — Data Access Layer Architecture defined — Draft |
| Event & Messaging Architecture | 🔧 In Progress | KB-077 — Event & Messaging Architecture defined — Draft |
| Search & Indexing Architecture | 🔧 In Progress | KB-078 — Search & Indexing Architecture defined — Draft |
| Caching & Data Federation Architecture | 🔧 In Progress | KB-079 — Caching & Data Federation Architecture defined — Draft |
| File & Object Storage Architecture | 🔧 In Progress | KB-080 — File & Object Storage Architecture defined — Draft |
| Backup & Disaster Recovery Architecture | 🔧 In Progress | KB-081 — Backup & Disaster Recovery Architecture defined — Draft |
| Data Lifecycle & Retention Architecture | 🔧 In Progress | KB-082 — Data Lifecycle & Retention Architecture defined — Draft |
| Data Synchronization Architecture | 🔧 In Progress | KB-083 — Data Synchronization Architecture defined — Draft |
| Data Import & Export Architecture | 🔧 In Progress | KB-084 — Data Import & Export Architecture defined — Draft |
| Data Governance & Quality Architecture | 🔧 In Progress | KB-085 — Data Governance & Quality Architecture defined — Draft |
| Data Privacy & Compliance Architecture | 🔧 In Progress | KB-086 — Data Privacy & Compliance Architecture defined — Draft |
| Master Data Management Architecture | 🔧 In Progress | KB-087 — Master Data Management Architecture defined — Draft |
| Metadata Management Architecture | 🔧 In Progress | KB-088 — Metadata Management Architecture defined — Draft |
| Knowledge Graph Architecture | 🔧 In Progress | KB-089 — Knowledge Graph Architecture defined — Draft |
| Analytics & Business Intelligence Architecture | 🔧 In Progress | KB-090 — Analytics & Business Intelligence Architecture defined — Draft |
| Reporting Architecture | 🔧 In Progress | KB-091 — Reporting Architecture defined — Draft |
| Data Federation Architecture | 🔧 In Progress | KB-092 — Data Federation Architecture defined — Draft |
| Data Archival & Historical Intelligence Architecture | 🔧 In Progress | KB-093 — Data Archival & Historical Intelligence Architecture defined — Draft |

> **Data Platform Architecture Suite**: Complete ✅

## Platform Integration Architecture

| Component | Status | Notes |
|-----------|--------|-------|
| Integration Platform Architecture | 🔧 In Progress | KB-094 — Integration Platform Architecture defined — Draft |
| Integration Connector Architecture | ⏳ Planned | KB-095 — Integration Connector Architecture |
| API Gateway Architecture | 🔧 In Progress | KB-096 — API Gateway Architecture defined — Draft |
| Webhook Architecture | 🔧 In Progress | KB-097 — Webhook Architecture defined — Draft |
| Integration Policy Architecture | 🔧 In Progress | KB-098 — Integration Policy Architecture defined — Draft |
| Secrets & Credential Management Architecture | 🔧 In Progress | KB-099 — Secrets & Credential Management Architecture defined — Draft |
| Service Discovery Architecture | 🔧 In Progress | KB-100 — Service Discovery Architecture defined — Draft |
| External Provider Management Architecture | ✅ Complete | KB-101 — External Provider Management Architecture defined — Approved Architecture |
| Identity Federation Architecture | ✅ Complete | KB-102 — Identity Federation Architecture defined — Approved Architecture |
| Enterprise Connectivity Architecture | 🔧 In Progress | KB-103 — Enterprise Connectivity Architecture defined — Draft |
| API Management Architecture | ✅ Complete | KB-104 — API Management Architecture defined — Approved Architecture |
| Integration Observability Architecture | 🔧 In Progress | KB-105 — Integration Observability Architecture defined — Draft |
| Integration Lifecycle Architecture | 🔧 In Progress | KB-106 — Integration Lifecycle Architecture defined — Draft |

## Enterprise Platform Services

| Component | Status | Notes |
|-----------|--------|-------|
| Enterprise Platform Services Overview | 🔧 In Progress | KB-107 — Enterprise Platform Services Overview defined — Draft |
| Configuration Management Architecture | ⏳ Planned | KB-108 — Configuration Management Architecture |
| Feature Flag & Feature Management Architecture | ⏳ Planned | KB-109 — Feature Flag & Feature Management Architecture |
| Notification Platform Architecture | 🔧 In Progress | KB-110 — Notification Platform Architecture defined — Draft |
| Messaging & Communication Platform Architecture | ⏳ Planned | KB-111 — Messaging & Communication Platform Architecture |
| Scheduling & Job Orchestration Architecture | ⏳ Planned | KB-112 — Scheduling & Job Orchestration Architecture |
| Workflow Orchestration Architecture | ⏳ Planned | KB-113 — Workflow Orchestration Architecture |
| Business Rules Engine Architecture | 🔧 In Progress | KB-114 — Business Rules Engine Architecture defined — Draft |
| Template Management Architecture | ⏳ Planned | KB-115 — Template Management Architecture |
| AI Platform Architecture | ⏳ Planned | KB-116 — AI Platform Architecture |
| AI Agent Framework Architecture | ⏳ Planned | KB-117 — AI Agent Framework Architecture |
| AI Model Management Architecture | ⏳ Planned | KB-118 — AI Model Management Architecture |
| Prompt Management Architecture | ⏳ Planned | KB-119 — Prompt Management Architecture |
| AI Context & Memory Architecture | ⏳ Planned | KB-120 — AI Context & Memory Architecture |
| AI Safety & Governance Architecture | ⏳ Planned | KB-121 — AI Safety & Governance Architecture |
| AI Decision Intelligence Architecture | ⏳ Planned | KB-122 — AI Decision Intelligence Architecture |
| Audit Platform Architecture | ⏳ Planned | KB-123 — Audit Platform Architecture |
| Policy Management Architecture | 🔧 In Progress | KB-124 — Policy Management Architecture defined — Draft |
| Licensing & Subscription Platform Architecture | ⏳ Planned | KB-125 — Licensing & Subscription Platform Architecture |
| Billing & Usage Metering Architecture | ⏳ Planned | KB-126 — Billing & Usage Metering Architecture |
| Digital Asset Management Architecture | ⏳ Planned | KB-127 — Digital Asset Management Architecture |
| Localization & Internationalization Architecture | ⏳ Planned | KB-128 — Localization & Internationalization Architecture |
| Time & Calendar Services Architecture | ⏳ Planned | KB-129 — Time & Calendar Services Architecture |
| Recommendation Engine Architecture | ⏳ Planned | KB-130 — Recommendation Engine Architecture |
| Search Experience Architecture | ⏳ Planned | KB-131 — Search Experience Architecture |
| Personalization Platform Architecture | ⏳ Planned | KB-132 — Personalization Platform Architecture |
| Experimentation Platform Architecture | ⏳ Planned | KB-133 — Experimentation Platform Architecture |
| Platform Insights Architecture | ⏳ Planned | KB-134 — Platform Insights Architecture |
| Health Management Architecture | ⏳ Planned | KB-135 — Health Management Architecture |
| Enterprise Tenant Management Architecture | 🔧 In Progress | KB-136 — Enterprise Tenant Management Architecture defined — Draft |
| Enterprise Resource Management Architecture | 🔧 In Progress | KB-137 — Enterprise Resource Management Architecture defined — Draft |
| Communication Services Architecture | 🔧 In Progress | KB-166 — Communication Services Architecture defined — Draft |
| Platform Automation Architecture | ⏳ Planned | KB-138 — Platform Automation Architecture |
| Platform Resilience Coordination Architecture | ⏳ Planned | KB-139 — Platform Resilience Coordination Architecture |
| Enterprise Platform Services Reference Architecture | ⏳ Planned | KB-140 — Enterprise Platform Services Reference Architecture |

## ADR Registry

| ID | Title | Status | Date |
|----|-------|--------|------|
| ADR-001 | Runtime Engine Architecture | ✅ Accepted | 2026-06-01 |
| ADR-002 | Data-Driven Screen System | ✅ Accepted | 2026-06-05 |
| ADR-003 | Action System Design | ✅ Accepted | 2026-06-10 |
| ADR-004 | Event Bus for Cross-Component Communication | ✅ Accepted | 2026-06-30 |
| ADR-005 | Branded Splash Screen | ✅ Accepted | 2026-07-09 |
| ADR-006 | Knowledge Base Initialization | ✅ Accepted | 2026-07-09 |


2026-09-20: Backend checkout inspected; live read paths still expose an unversioned definition and nested v0.0.7. Confirmed array-only publish validation, duplicate-release path, cache/rollback and WebP deletion defects. [Cross-stack fix plan](ARCHITECTURE/PUBLISHED_APP_DELIVERY_FIX_PLAN_2026-09-20.md); separate stack TODOs linked there. Status: planned, implementation open.

2026-09-20: Mobile release revalidation/staged adoption and merchant verified publish/rollback implemented. Local tests and web/Android/iOS bundle builds passed. [Client delivery report](mobile/PUBLISHED_APP_DELIVERY_CLIENT_IMPLEMENTATION_2026-09-20.md). Backend and device release gates remain open.

2026-09-20: Fixed manifest root-tab rendering and tenant splash lifecycle; removed injected operational text. [Splash/tab ownership report](mobile/SPLASH_AND_MANIFEST_TABS_2026-09-20.md); separate verification TODO linked there.
