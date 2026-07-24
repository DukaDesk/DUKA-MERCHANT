# Merchant Portal — Agent Context

**Repository:** DukaDesk Merchant Portal (business-dashboard implementation)
**KB Version:** 0.3.0
**Last Verified Commit:** `1f9f654`
**Last Updated:** 2026-07-24
**Status:** Active

## Overview

The `merchant-portal/` repository contains the Business Dashboard — an administrative dashboard for business owners and managers to manage their tenant app, users, products, orders, content, billing, and settings. Backend integration is via `dukaDesk/src/services/api.js` which communicates with the DUKA-BACKEND REST API.

## Recent Changes (Session 2026-07-24)

### Mock Data Removed
- Deleted `src/services/mockData.js`, `mockData.test.js`, `PreviewDataProvider.js`
- All API functions now hit real backend — no mock fallback branches
- Inline mock data removed from Customers, Inventory, Marketing, Team pages
- `ApiClient.js` simplified — mock wrapper methods removed

### Config Extracted to `src/config/`
- `src/config/wizard.js` — Wizard categories, templates, integrations, colors
- `src/config/integrations.js` — Integration details & badge colors
- `src/config/messages.js` — Message report reasons
- All wizard component imports updated to use `src/config/` paths

### Compliance → Backend API
- `api.js`: Added `submitCompliance(tenantId, formData)`, `getComplianceStatus(tenantId)`
- `Compliance.jsx`: Uses API instead of localStorage
- `Dashboard.jsx`, `Sidebar.jsx`: Compliance checks via API

### Toast System Migration
- Removed legacy `ToastContext` / `useToast` from `contexts.jsx`
- Removed `ToastContext.Provider` wrapper from `App.jsx`
- All 16 pages migrated from `useToast()` context to `import { toast } from "react-toastify"`
- Notifier subscriptions wired directly to `toast.error` / `toast.success`

### Bug Fixes
- Fixed `delay()` runtime crash in `api.js:395` (function was deleted but still referenced)
- Fixed `Inventory.jsx` missing `showToast` definition (was calling undefined function)
- Fixed `Wizard.jsx` double parenthesis + stale dependency reference
- Fixed `toast.*` call format across 16 files (converted from `showToast(msg, type)`)

### Analytics Cleanup
- Removed dead sections: QR Scan Activity, Customer Insights, Usage Metrics
- Cleaned up unused imports (`BarChart`, `Bar`, `Users`, `Smartphone`, etc.)

## Technology Stack

- **Framework:** React 18 (Vite)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **State:** React Context (AuthContext, RuntimeContext)
- **Notifications:** react-toastify (direct import, no context wrapper)
- **Styling:** Inline JS objects (no CSS modules/styled-components)

## Repository Structure

```
merchant-portal/
  dukaDesk/
    src/
      components/
        app-builder/    Wizard, SetupWizard, TemplateGallery, MiniAppPreview
        auth/           Authentication screens
        layout/         DashboardShell, Sidebar, Topbar, States, ErrorBoundary
        pages/          All screen components (Dashboard, Products, Orders, etc.)
        template/       TemplateRenderer, TemplateEditor
        canvas-editor/  CanvasEditor
      config/           Wizard, integrations, messages config files
      services/         api.js, httpClient.js, ApiClient.js, TemplateLoader, etc.
      hooks/            useMediaQuery, usePermission
      runtime/          RuntimeContext, ActionEngine, BrandThemeProvider
      contexts.jsx      AuthContext only (ToastContext removed)
      theme.js          Shared style constants
      index.css         CSS variables, animations, global rules
      App.jsx           Root component, routing
  AGENT_CONTEXT.md
  knowledge-base-version.md
  *.md                 Project documentation
```

## Build and Test

```bash
cd dukaDesk
npm install
npx vite          # Dev server
npx vite build    # Production build
```

## Engineering Standards

- All styles are inline JS objects — no CSS modules
- API calls go through `src/services/api.js` (no direct axios usage in components)
- Toast notifications via `import { toast } from "react-toastify"` — use `toast.success()`, `toast.error()`, `toast.info()`
- Run `npx vite build` before committing to verify no errors
- Backend-dependent features require a running DUKA-BACKEND instance

## Specification Traceability

| Spec | Title | Status |
|------|-------|--------|
| BD-DASH-001 | Dashboard | ✅ Built, API-integrated |
| BD-PROD-001 | Products | ✅ Built, API-integrated |
| BD-ORD-001 | Orders | ✅ Built, API-integrated |
| BD-CUST-001 | Customers | ✅ Built, API-integrated |
| BD-INV-001 | Inventory | ✅ Built, API-integrated |
| BD-ANAL-001 | Analytics | ✅ Built, API-integrated |
| BD-MSG-001 | Messages | ✅ Built, API-integrated |
| BD-INTEG-001 | Integrations | ✅ Built, API-integrated |
| BD-BILL-001 | Billing | ✅ Built, API-integrated |
| BD-PROF-001 | Profile | ✅ Built, API-integrated |
| BD-TEAM-001 | Team | ✅ Built, API-integrated |
| BD-SETT-001 | Settings | ✅ Built, API-integrated |
| BD-MKT-001 | Marketing | ✅ Built, API-integrated |
| BD-AUTH-001 | Auth | ✅ Built, API-integrated |
| FEAT-0001 | Registration and Login | ✅ Integrated |
| SEC-0002 | Authorization and RBAC | ✅ Role-aware nav |
| UI-0003 | Business Dashboard Foundation | ✅ Complete |
| Compliance | KYC / Business Verification | ✅ API-integrated |

## Agent Conventions

- Reference specification IDs in commits
- All styles are inline JS objects — no CSS modules
- Reuse shared style constants from `theme.js`
- Always run `npx vite build` before committing
- Update `AGENT_CONTEXT.md` after significant changes
