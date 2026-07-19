# Merchant Portal — Agent Context

**Repository:** DukaDesk Merchant Portal (business-dashboard implementation)
**KB Version:** 0.2.0 (synced from `github.com/DukaDesk/KNOWLEDGE-BASE` commit `4c38d4d`)
**Last Updated:** 2026-07-19
**Status:** Active

## Overview

The `merchant-portal/` repository contains the Business Dashboard — an administrative dashboard for business owners and managers to manage their tenant app, users, products, orders, content, billing, and settings.

## Responsibilities

- Business admin UI (dashboard, products, orders, customers, inventory, analytics, messages, marketing, integrations, billing)
- Tenant and user management (team invites, role assignment)
- Settings and configuration (business info, branding, hours)
- Role-based navigation and access control
- Real API integration with DUKA-BACKEND

## Non-Responsibilities

- End-customer-facing features
- Core business logic execution
- Infrastructure provisioning
- Mobile app rendering

## Technology Stack

- Framework: React 18 (Vite)
- Routing: React Router v6
- HTTP Client: Axios
- Icons: Lucide React
- State: React Context (AuthContext, ToastContext, RuntimeContext)
- Styling: Inline JS objects (no CSS modules/styled-components)

## Repository Structure

```
merchant-portal/
  dukaDesk/
    src/
      components/
        auth/           Authentication screens
        layout/         DashboardShell, Sidebar, Topbar, States, ErrorBoundary
        pages/          All screen components (Dashboard, Products, Orders, etc.)
      services/         API client (httpClient.js, api.js)
      hooks/            Custom hooks (useMediaQuery)
      contexts.jsx      React context definitions
      theme.js          Shared style constants
      index.css         CSS variables, animations, global rules
      App.jsx           Root component, routing
  knowledge-base/       Synced canonical KB (634 files, commit 4c38d4d)
  AGENT_CONTEXT.md
  ARCHITECTURE_ALIGNMENT.md
  PROGRESS.md
  knowledge-base-version.md
  knowledge-base-sync-TODO.md
```

## Build and Test

```bash
cd dukaDesk
npm install
npx vite          # Dev server
npx vite build    # Production build
```

## Engineering Standards

- [Repository Standard](knowledge-base/engineering-governance/repository-governance/REPOSITORY_STANDARD.md)
- [Branching Standard](knowledge-base/engineering-governance/repository-governance/BRANCHING_STANDARD.md)
- [Pull Request Standard](knowledge-base/engineering-governance/repository-governance/PR_STANDARD.md)
- [UI State Standard](knowledge-base/ui-specifications/STATE_STANDARD.md)
- [UI Principles](knowledge-base/ui-specifications/UI_PRINCIPLES.md)

## Specification Traceability

| Specification | Title | Status |
|---------------|-------|--------|
| UI-0003 | Business Dashboard Foundation and Shell | ✅ Complete |
| FEAT-0001 | User Registration and Login | ✅ Integrated |
| SEC-0002 | Authorization and RBAC | ✅ Role-aware nav |
| BD-CUST-001 | Customers | ✅ Built |
| BD-INV-001 | Inventory | ✅ Built |
| BD-MKT-001 | Marketing | ✅ Built |
| BD-SET-001 | Settings | ✅ Built |

## Agent Conventions

- Reference engineering specifications by ID in commits and pull requests.
- Implement role-based access control for all admin actions.
- Keep dashboards responsive and data-heavy views performant.
- Reuse shared style constants from `theme.js`.
- All styles are inline JS objects — no CSS modules.
- Update `PROGRESS.md` after significant changes.
- Always build (`npx vite build`) before committing to verify no errors.

## Escalation

Stop and ask for human input when:

- A change affects billing, pricing, or legal compliance.
- A privileged operation lacks proper authorization.
- A decision impacts tenant isolation or data access.
- A breaking change to the API integration layer is required.
