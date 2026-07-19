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
| FEAT-0002 | Tenant Lifecycle and Isolation | Partial in `api.js` | ⚠️ Check |

### B — UI specs missing from our codebase

| UI Module | Screens | Our Code | Status |
|-----------|---------|----------|--------|
| Authentication | BD-AUTH-001 | `Auth.jsx` (login/signup/forgot) | ✅ |
| Dashboard | BD-DASH-001 | `Dashboard.jsx` (KPIs, chart, activity) | ✅ |
| Orders | BD-ORD-001 | `Orders.jsx` (list, detail, timeline) | ✅ |
| Products | BD-PROD-001 | `Products.jsx` (grid, CRUD, CSV) | ✅ |
| Customers | BD-CUST-001 | **Not built** | ❌ Missing |
| Inventory | BD-INV-001 | **Not built** | ❌ Missing |
| Analytics | BD-ANAL-001 | `Analytics.jsx` (charts, exports) | ✅ |
| Marketing | BD-MKT-001 | **Not built** | ❌ Missing |
| Builder | BD-BLD-001 | `CanvasEditor.jsx` (SDUI editor) | ✅ Built elsewhere |
| Settings | BD-SET-001 | `Profile.jsx` partial | ⚠️ Partial |

### C — Backend integration gaps

| Domain | Real API | Our Status |
|--------|----------|------------|
| Auth (login/register/refresh/logout/OTP) | ✅ Tested | ✅ Integrated |
| Tenant (GET/PUT/publish/config/theme/nav) | ✅ Tested | ⚠️ Not integrated |
| Products (CRUD) | ✅ Tested | ⚠️ Still mocked (localStorage) |
| Orders | ✅ Endpoints exist | ⚠️ Still mocked |
| Profile | ✅ Tested | ⚠️ Still mocked |
| Billing/Plans | ✅ Endpoints exist | ⚠️ Still mocked |
| Analytics | ✅ Endpoints exist | ⚠️ Still mocked |
| Messages | ✅ Endpoints exist | ⚠️ Still mocked |
| Integrations | ✅ Endpoints exist | ⚠️ Still mocked |

---

## Step 3: Actionable Task List

### P0 — Must do
- [ ] **SYNC-001**: Copy KB files into `knowledge-base/`
- [ ] **AUDIT-001**: Verify code meets UI-0003 (UR-01–UR-06)
- [ ] **SCREEN-001**: Build Customers page (BD-CUST-001)
- [ ] **SCREEN-002**: Build Inventory page (BD-INV-001)
- [ ] **SCREEN-003**: Build Marketing page (BD-MKT-001)
- [ ] **SCREEN-004**: Build Settings page (BD-SET-001) with tenant config
- [ ] **INTEG-001**: Switch products API from mock to real backend
- [ ] **INTEG-002**: Switch orders API from mock to real backend
- [ ] **INTEG-003**: Switch profile API from mock to real backend

### P1 — Should have
- [ ] **RBAC-001**: Implement role-aware navigation per SEC-0002
- [ ] **INTEG-004**: Switch billing/plans from mock to real
- [ ] **INTEG-005**: Switch analytics from mock to real
- [ ] **INTEG-006**: Switch messages from mock to real
- [ ] **INTEG-007**: Switch integrations from mock to real
- [ ] **UI-ALIGN-001**: Align shared components with UI spec templates (button, card, dialog, input, data-table patterns)

### P2 — Polish
- [ ] **UI-ALIGN-002**: Create screen spec docs (BD-ORD-001, BD-PROD-001, etc.) for all built screens
- [ ] **UI-ALIGN-003**: Update sidebar navigation to match role-aware model
- [ ] **UI-ALIGN-004**: Add remaining UI states per STATE_STANDARD.md
- [ ] **GOV-001**: Add AGENT_CONTEXT.md, ARCHITECTURE_ALIGNMENT.md to repo root
- [ ] **GOV-002**: Add PROGRESS.md to repo root tracking merchant-specific progress

---

## Reference

- KB repo: `https://github.com/DukaDesk/KNOWLEDGE-BASE`
- Latest KB commit: `4c38d4d`
- KB version: `0.2.0` (will be bumped after sync)
