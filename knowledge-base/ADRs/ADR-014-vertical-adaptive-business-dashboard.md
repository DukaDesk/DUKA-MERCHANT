# ADR-014: Vertical-Adaptive Business Dashboard

**Status:** ✅ Accepted
**Date:** 2026-08-07
**Author:** Merchant Portal / Business Dashboard Team

## Context

The Business Dashboard admin shell was hardwired to product-selling (Products, Orders, Customers, Inventory, Revenue, Cart). However, DUKADESK is an industry-agnostic platform: tenants span churches, schools, laundries, salons, clinics, gyms, restaurants, and retail. The platform already tracks a per-tenant `category` (via the wizard `app.category`) and the product backend already models `ProductType` = `physical | service | digital | donation | membership | event_ticket`. The gap: nothing in the *admin shell* adapted to the tenant's sector.

> Platform principle (`PLATFORM_PHILOSOPHY.md`): "The platform core is industry-agnostic. Industry-specific adaptations are delivered through configuration, extensions, and marketplace packages — never through platform forks."

## Decision

Adopt a **Vertical-Adaptive Shell**: a single frontend configuration registry (`src/config/verticals.js`) keyed by the tenant's category. The shell (navigation, KPIs, quick actions, labels, empty states, topbar titles) is derived from the resolved vertical. Unknown categories fall back to a generic commerce default, so nothing regresses.

### Scope (Phase 1)

- **Config registry** — `verticals.js` with 6 modeled sectors (Restaurant/Food, Ecommerce/Retail, Grocery, Church, School, Booking/Services) + `DEFAULT`.
- **Adaptive navigation** — `Sidebar.jsx` resolves the vertical and builds `mainNavItems`/`secondaryNavItems` from `vertical.modules`; preserves `roleAccess`, `requiresCompliance`, badges, and mobile bottom nav.
- **Adaptive dashboard** — `Dashboard.jsx` drives KPIs, quick actions, and copy from the vertical config; missing metrics render an empty state (no fabricated data).
- **Adaptive topbar** — `Topbar.jsx` merges `vertical.topbarTitles`.
- **Sector admin pages** — lightweight initial pages under `src/components/pages/sector/`: `Giving`, `Attendance`, `Fees`, `AppointmentsToday`, all bound to existing APIs.
- **Taxonomy unification** — new `src/config/taxonomy.js` is the single source for business categories; `wizard.js` and `Compliance.jsx` derive from it (removing duplicated lists).
- **Feature-flag gate** — `src/services/moduleGate.js` can intersect vertical modules with tenant feature flags (`commerce`, `booking`, `forms`, `analytics`, `notifications`, `integrations`); when flags are absent, all modules pass (today's behavior).

### Out of Scope (future phases)

- Full-fidelity sector pages (donation ledger, attendance roster, calendar grid, fee invoicing).
- Backend schema changes and fully backend-driven module resolution.
- The eventual full capability/plugin engine from the KB.

## Consequences

**Positive:**
- Merchant shell now reflects the tenant's actual business type (Church shows Giving/Members/Announcements; School shows Timetable/Fees/Students; Booking shows Services/Appointments).
- Single taxonomy source removes category-list drift across wizard, KYC, and shell.
- Forward-compatible with the platform's capability/feature-flag model (`backend-tenants.md` flags).

**Trade-offs / risks:**
- The shell reads the category asynchronously (`getMyApp()`/`getSetupData()`), so it briefly renders the default commerce nav before swapping.
- Some sector KPIs (giving totals, attendance, fees) have no backend field yet; those cards show an empty state until the backend exposes them.

## Related

- Depends on the module/capability model: `platform-definition/MODULE_MODEL.md`, `CAPABILITY_MODEL.md`
- Feature flags: `SPECIFICATIONS/backend-tenants.md`
- Template/industry taxonomy: `ARCHITECTURE/desk-builder.md`, `ARCHITECTURE/capability-marketplace.md`, ADR-013
- UI specs: `ui-specifications/applications/business-dashboard/README.md`
