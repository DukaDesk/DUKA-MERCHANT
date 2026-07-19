# Merchant Portal — Progress

**Last Updated:** 2026-07-19

## Status Key

- ✅ Complete — Production ready
- 🔧 In Progress — Actively being built
- ⏳ Planned — Not yet started

## Current Status

**Overall:** All P0 screens built, real API integrated for auth + products + orders + profile + billing + analytics + integrations.

## Screens

| Screen | KB Ref | Status | Notes |
|--------|--------|--------|-------|
| Auth (login/signup/forgot) | BD-AUTH-001 | ✅ Complete | Real API (register, login, send-otp, logout) |
| Dashboard | BD-DASH-001 | ✅ Complete | KPI cards, revenue chart, activity feed |
| Products | BD-PROD-001 | ✅ Complete | Grid, CRUD, CSV import, real API |
| Orders | BD-ORD-001 | ✅ Complete | List, tabs, detail panel, timeline, real API |
| Customers | BD-CUST-001 | ✅ Complete | Card grid, search, detail panel |
| Inventory | BD-INV-001 | ✅ Complete | Table, stats cards, adjust stock modal |
| Analytics | BD-ANAL-001 | ✅ Complete | Charts, exports, real API |
| Messages | BD-MSG-001 | ✅ Complete | Conversations, chat, report modal |
| Marketing | BD-MKT-001 | ✅ Complete | Coupons, campaigns, create coupon modal |
| Integrations | BD-INTEG-001 | ✅ Complete | List, toggle, detail, real API |
| Billing | BD-BILL-001 | ✅ Complete | Plans, upgrade modal, real API |
| Team / User Mgmt | BD-USER-001 | ✅ Complete | Member list, role select, invite modal |
| Settings / Config | BD-SET-001 | ✅ Complete | Business info, contact, hours, branding |
| Profile | BD-PROFILE-001 | ✅ Complete | Account details, real API |

## Architecture

| Component | Status | Notes |
|-----------|--------|-------|
| DashboardShell | ✅ Complete | Extracted reusable layout |
| Sidebar (role-aware) | ✅ Complete | RBAC filter per roleAccess map |
| Topbar | ✅ Complete | Search, notifications, user avatar |
| Auth interceptor | ✅ Complete | 401 refresh queue |
| API integration layer | ✅ Complete | Real HTTP with localStorage fallback |
| Theme constants | ✅ Complete | Colors, buttons, cards, inputs |
| CSS animations | ✅ Complete | fadeIn, slideUp, badgePop, etc. |
| Error boundary | ✅ Complete | Wraps all route content |
| Loading / Empty / Error states | ✅ Complete | States.jsx with skeletons |

## Governance

| Artifact | Status | Notes |
|----------|--------|-------|
| KB sync | ✅ Complete | 634 files at commit 4c38d4d |
| KB version tracking | ✅ Complete | knowledge-base-version.md |
| KB sync TODO | ✅ Complete | knowledge-base-sync-TODO.md |
| AGENT_CONTEXT.md | ✅ Complete | This file |
| ARCHITECTURE_ALIGNMENT.md | ✅ Complete | ADRs, constraints, spec coverage |
| PROGRESS.md | ✅ Complete | This file |

## API Integration Status

| Domain | Real API | Status |
|--------|----------|--------|
| Auth (register/login/refresh/logout/OTP) | ✅ | Integrated |
| Products (CRUD) | ✅ | Integrated |
| Orders (list, status update) | ✅ | Integrated |
| Profile (GET/PUT) | ✅ | Integrated |
| Billing (plan, subscribe) | ✅ | Integrated |
| Analytics (revenue, order stats) | ✅ | Integrated |
| Integrations (list, connect/disconnect) | ✅ | Integrated |
| Notifications (list, unread count) | ✅ | Integrated |
| Messages (conversations) | ⏳ | Mock (no chat API yet) |
| Customers | ⏳ | Mock |
| Inventory | ⏳ | Mock |
| Marketing | ⏳ | Mock |

## Roadmap

### Completed
1. ✅ KB sync + audit
2. ✅ All 12 screens built
3. ✅ Role-aware navigation
4. ✅ Real API for auth + products + orders + profile + billing + analytics + integrations + notifications
5. ✅ UI alignment with KB standards (states, responsive, interaction)
6. ✅ Shared component variants (btnDanger, btnGhost)
7. ✅ Governance files (AGENT_CONTEXT, ARCHITECTURE_ALIGNMENT, PROGRESS)

### Next
1. ⏳ Real API for customers, inventory, marketing
2. ⏳ Chat/messaging API integration
3. ⏳ Accessibility audit per ACCESSIBILITY_STANDARD.md
4. ⏳ E2E test setup
