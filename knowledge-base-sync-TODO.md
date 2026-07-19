# Knowledge Base Sync — TODO

**Date:** 2026-07-19
**Source:** `github.com/DukaDesk/KNOWLEDGE-BASE` commit `4c38d4d`
**Target:** `knowledge-base/` directory in this repository

---

## Step 1: Copy KB repo → knowledge-base/ (260+ new files)

Replace the current `knowledge-base/` with the full canonical KB repo content.

| Category | New Files | Purpose |
|----------|-----------|---------|
| `business-dashboard/` | 6 files | AGENT_CONTEXT, ARCHITECTURE_ALIGNMENT, PROGRESS, README, CHANGELOG, CONTRIBUTING — directly defines our project scope |
| `engineering-specifications/` | ~40 files | Formal specs: UI-0001–0004 (dashboard/mobile/website/tenant dashboards), FEAT-0001–0007 (features), SEC-0001–0002 (auth/RBAC), API-0001–0002 (auth/tenant APIs), DB-0001–0002 (schemas), EVT-0001–0002 (events) |
| `ui-specifications/` | ~25 files | UI principles, design system guidelines, accessibility/interaction/validation/responsive standards. Shared components (button, card, dialog, input), patterns (data-table, form-layout), layouts (dashboard-shell), flows (authentication). Per-app UI directories for business-dashboard, builder-studio, mobile, tenant-dashboard, website |
| `backend/` | 6 files | AGENT_CONTEXT, api-endpoints-reference (381 endpoints, 34 modules), ARCHITECTURE_ALIGNMENT, PROGRESS, README |
| `product-definition/` | ~50 files | Platform overview, product catalog, application catalog, module boundaries/catalog, feature catalog/classification, user personas/journeys/types, permission/role catalogs, editions/licensing, marketplace model, roadmap, usage guides |
| `engineering-governance/` | ~45 files | Repository governance (branching/PR/review/release/versioning/BOOT/AI context standards), developer experience (CI/CD, testing, release, onboarding, debugging, code generation), execution governance (RACI, decision authority, escalation, quality, team model, technical debt), repository bootstrap (structure, documents, security, quality gates, templates) |
| `master-plan/` | ~12 files | Vision, roadmap, milestones, release plan, implementation sequence, dependency graph, teams, risks, success criteria, AI assignments, programs |
| `implementation/` | ~20 files | Implementation strategy, sequence, phases (00–09), milestones (M0–M4), repository plans (backend, builder, business-dashboard, cli, infrastructure, mobile, sdk, tenant-dashboard, website), risk register, verification |
| `engineering-work/` | ~38 files | Work item model, epics (EPIC-0001), features (FEAT-0001–0007), tasks (TASK-0001–0023), templates, registries, workflows |
| `platform-definition/` | ~14 files | PD-001–PD-013: platform overview, product/capability/application/module/service/feature/edition/licensing/monetization/marketplace/tenant/extensibility models |
| `platform-operations/` | ~18 files | Service catalog, SLOs/SLIs, incident/problem/change/configuration/capacity management, DR/BCP, observability, deployment, environment, error budget, runbook |
| `enterprise-reference/` | ~13 files | Domain/service/component/API/event/database/entity/AI agent/repository/specification/work item catalogs, reference model |
| `project-management/` | ~6 files | Meeting notes, milestone tracker, roadmap, release plans, sprint plans, backlog, RFC template, status reports |
| `dukadesk-constitution/` | ~10 files | Mission, vision, engineering philosophy, architectural laws, engineering laws, AI laws, change control, decision framework, governance model |
| `knowledge-base/` (within KB) | ~30 files | KB-141–160 developer experience platform architecture. KB-108, 109, 111–140, 161–180 enterprise platform services architecture. KB-095 integration connector architecture |
| Other repos | ~15 files | Repo bootstraps for: builder, cli, infrastructure, mobile, sdk, tenant-dashboard, website, website |
| Root + misc | ~10 files | AGENT_CONTEXT, ARCHITECTURE_ALIGNMENT, PROGRESS, CHANGELOG, CONTRIBUTING, CODEOWNERS, LICENSE, PLATFORM_PHILOSOPHY, docs, scripts, tests |

---

## Step 2: Align code with KB specs

### A — Engineering specs to verify against

| Spec | Title | Our Code | Status |
|------|-------|----------|--------|
| UI-0003 | Business Dashboard Foundation and Shell | `App.jsx` + `Sidebar.jsx` + `Topbar.jsx` + `Auth.jsx` | Check UR-01 through UR-06 |
| FEAT-0001 | User Registration and Login | `Auth.jsx` + `api.js` (login/signup) | Verify full coverage |
| SEC-0001 | Authentication Architecture | `httpClient.js` + JWT flow | Verify |
| SEC-0002 | Authorization and RBAC | Not implemented in UI | ⚠️ Gap |
| API-0001 | Authentication API | `httpClient.js` + `api.js` auth calls | Verify |
| API-0002 | Tenant Management API | `api.js` tenant calls | Verify |
| FEAT-0002 | Tenant Lifecycle and Isolation | `api.js` (update/getConfig/publish) + `Settings.jsx` | ✅ |

### B — UI specs missing from our codebase

| UI Module | Screens | Our Code | Status |
|-----------|---------|----------|--------|
| Authentication | BD-AUTH-001 | `Auth.jsx` (login/signup/forgot) | ✅ |
| Dashboard | BD-DASH-001 | `Dashboard.jsx` (KPIs, chart, activity) | ✅ |
| Orders | BD-ORD-001 | `Orders.jsx` (list, detail, timeline) | ✅ |
| Products | BD-PROD-001 | `Products.jsx` (grid, CRUD, CSV) | ✅ |
| Customers | BD-CUST-001 | `Customers.jsx` (list, detail, notes) | ✅ |
| Inventory | BD-INV-001 | `Inventory.jsx` (table, CRUD, stock alerts) | ✅ |
| Marketing | BD-MKT-001 | `Marketing.jsx` (campaign cards) | ✅ |
| Builder | BD-BLD-001 | `CanvasEditor.jsx` (SDUI editor) | ✅ Built elsewhere |
| Settings | BD-SET-001 | `Settings.jsx` + `Profile.jsx` | ✅ |
| Team/Users | BD-TEAM-001 | `Team.jsx` (list, invite, roles) | ✅ |

### C — Backend integration gaps

| Domain | Real API | Our Status |
|--------|----------|------------|
| Auth (login/register/refresh/logout/OTP) | ✅ Tested | ✅ Integrated |
| Tenant (GET/PUT/publish/config/theme/nav) | ✅ Tested | ✅ Integrated |
| Products (CRUD) | ✅ Tested | ✅ Real API via tenantId path, localStorage fallback |
| Orders | ✅ Endpoints exist | ✅ Real API via tenantId path, mock fallback |
| Profile | ✅ Tested | ✅ Real API, localStorage fallback + tenant sync |
| Billing/Plans | ✅ Endpoints exist | ✅ Real API via subscription, mock fallback |
| Analytics | ✅ Endpoints exist | ✅ Real API with tenantId params, mock fallback |
| Messages | ✅ Endpoints exist | ✅ Notifications API, mock fallback |
| Integrations | ✅ Endpoints exist | ✅ Real API via tenantId path, mock fallback |

---

## UI-0003 Audit (Completed 2026-07-19)

### Requirements coverage

| ID | Requirement | Our Status | Notes |
|----|-------------|------------|-------|
| UR-01 | Dashboard has authenticated shell | ✅ Done | `App.jsx` wraps protected routes, `Auth.jsx` handles login, `httpClient.js` handles 401 → redirect to `/login` |
| UR-02 | Sidebar navigation lists applications | ✅ Done | `Sidebar.jsx` renders nav items from `navTree` in `App.jsx` |
| UR-03 | Navigation is role-aware | ❌ Missing | No RBAC check on nav items. `Sidebar.jsx` renders all items for all users |
| UR-04 | Dashboard home shows summary cards | ✅ Done | `Dashboard.jsx` has KPI cards (customers, revenue, unread, rating) |
| UR-05 | User can manage tenant users | ✅ Done | `Team.jsx` — invite, list, remove, role filter |
| UR-06 | User can update tenant settings | ✅ Done | `Settings.jsx` — business info, contact, hours, branding, tenant API sync |

### Acceptance criteria coverage

| ID | Criterion | Status | Notes |
|----|-----------|--------|-------|
| AC-01 | Dashboard shell renders after login | ✅ | `App.jsx` layout renders after auth |
| AC-02 | Sidebar navigation matches role | ✅ | Role-aware nav via `navTree` merge |
| AC-03 | Admin can invite users | ✅ | `Team.jsx` — invite panel with email & role |
| AC-04 | Admin can update tenant settings | ✅ | `Settings.jsx` — tenant config CRUD |

### Component inventory from UI-0003

| Component | Spec | Our Code | Status |
|-----------|------|----------|--------|
| DashboardShell | `src/layouts/DashboardShell` | Extracted into `App.jsx` + `ProtectedRoute` | ✅ |
| Sidebar | `src/components/Sidebar` | `Sidebar.jsx` | ✅ |
| UserTable | `src/components/users/UserTable` | `Team.jsx` (inline table) | ✅ |
| TenantSettingsForm | `src/components/settings/TenantSettingsForm` | `Settings.jsx` | ✅ |

---

## Step 3: Actionable Task List

### P0 — Must do
- [x] **SYNC-001**: Copy KB files into `knowledge-base/`
- [x] **AUDIT-001**: Verify code meets UI-0003 (UR-01–UR-06)
- [x] **SCREEN-001**: Build Customers page (BD-CUST-001)
- [x] **SCREEN-002**: Build Inventory page (BD-INV-001)
- [x] **SCREEN-003**: Build Marketing page (BD-MKT-001)
- [x] **SCREEN-004**: Build Settings/Tenant Config page (BD-SET-001) — covers UR-06
- [x] **SCREEN-005**: Build Team/User Management page (covers UR-05, AC-03)
- [x] **UI-0003-GAP-01**: Role-aware navigation (covers UR-03, AC-02)
- [x] **COMP-001**: Extract DashboardShell into a reusable layout component
- [x] **INTEG-001**: Switch products API from mock to real backend
- [x] **INTEG-002**: Switch orders API from mock to real backend
- [x] **INTEG-003**: Switch profile API from mock to real backend

### P1 — Should have
- [x] **INTEG-004**: Switch billing/plans from mock to real
- [x] **INTEG-005**: Switch analytics from mock to real
- [x] **INTEG-006**: Switch messages from mock to real
- [x] **INTEG-007**: Switch integrations from mock to real
- [x] **UI-ALIGN-001**: Align shared components with UI spec templates — check button, card, dialog, input, data-table patterns against `ui-specifications/shared/`

### P2 — Polish
- [x] **UI-ALIGN-002**: Create screen spec docs (BD-ORD-001, BD-PROD-001, etc.) for all 14 built screens
- [x] **UI-ALIGN-003**: Add remaining UI states per STATE_STANDARD.md (loading, empty, error with retry)
- [x] **GOV-001**: Add AGENT_CONTEXT.md, ARCHITECTURE_ALIGNMENT.md to repo root per bootstrap standard
- [x] **GOV-002**: Add PROGRESS.md to repo root tracking merchant-specific progress

---

## Reference

- KB repo: `https://github.com/DukaDesk/KNOWLEDGE-BASE`
- Latest KB commit: `4c38d4d`
- KB version: `0.2.0` (will be bumped after sync)
