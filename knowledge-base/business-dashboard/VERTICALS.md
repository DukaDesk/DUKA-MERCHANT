# Business Dashboard Verticals

Canonical catalog of the modeled sectors and how the admin shell adapts to each. Backs [ADR-014](../ADRs/ADR-014-vertical-adaptive-business-dashboard.md).

## Source of truth

- **Categories (taxonomy):** `dukaDesk/src/config/taxonomy.js` — `BUSINESS_CATEGORIES` (id, label, icon, desc, `kycType`) + `ONBOARDING_CATEGORIES` (expanded picker list for the "What are you building?" screen).
- **Vertical definitions:** `dukaDesk/src/config/verticals.js` — `VERTICALS` + `getVertical(category)`. The `modules[]` of each vertical is now its **preset** (default installed set), not a hard render list.
- **Primitive registry:** `dukaDesk/src/config/primitives.js` — `PRIMITIVES` catalog (group, desc, flags, widgets, page) that the sidebar/dashboard render from.
- **Module resolution:** `dukaDesk/src/runtime/VerticalContext.jsx` — merged set = preset ∪ user-added − user-removed, persisted via `saveDashboardModules()` to tenant config `app.modules` (+ local mirror).
- **Flag gating:** `dukaDesk/src/services/moduleGate.js`.

## Module model

Each vertical defines: `key`, `label`, `icon`, `deskLabel`, `modules[]` (preset), `kpis[]`, `quickActions[]`, `emptyState`, `topbarTitles`, `excludedModules`, `adminPages[]`.

Tenants can add/remove primitives from the **Integrations** page (`DashboardPrimitives` section). `modules` (preset), `adminPages` (sector pages), `kpis` (dashboard KPI cards) are all gated by the installed set.

### 1. Restaurant / Food

| Module id | Shell label | Reused page |
|---|---|---|
| products | Menu | Products |
| orders | Orders | Orders |
| customers | Guests | Customers |
| inventory | Stock | Inventory |

KPIs: Guests, Revenue (Month), Open Orders, Avg Rating.

### 2. Ecommerce / Retail

| Module id | Shell label | Reused page |
|---|---|---|
| products | Products | Products |
| orders | Orders | Orders |
| customers | Customers | Customers |
| inventory | Inventory | Inventory |

KPIs: Customers, Revenue (Month), Open Orders, Avg Rating.

### 3. Grocery

| Module id | Shell label | Reused page |
|---|---|---|
| products | Products | Products |
| orders | Orders | Orders |
| customers | Customers | Customers |
| inventory | Stock | Inventory |

KPIs: Customers, Revenue (Month), Open Orders, Avg Rating.

### 4. Church / Ministry

| Module id | Shell label | Reused page |
|---|---|---|
| products | Giving | Products |
| orders | Donations | Orders |
| customers | Members | Customers |
| messages | Announcements | Messages |

Excluded: inventory, marketing. KPIs: Members, Giving (Month), New Givers, Attendance.

Admin page: `attendance` (`/dashboard/attendance` → `sector/Attendance.jsx`).

### 5. School / Education

| Module id | Shell label | Reused page |
|---|---|---|
| products | Timetable | Products |
| orders | Fees | Orders |
| customers | Students | Customers |
| messages | Parent Comms | Messages |

Excluded: inventory, marketing. KPIs: Students, Fees (Month), Pending Fees, Attendance.

Admin pages: `attendance` (`/dashboard/attendance`), `fees` (`/dashboard/fees` → `sector/Fees.jsx`).

### 6. Booking / Services (laundry, salon, clinic, gym)

| Module id | Shell label | Reused page |
|---|---|---|
| products | Services | Products |
| orders | Appointments | Orders |
| customers | Customers | Customers |

Excluded: inventory. KPIs: Customers, Revenue (Month), Bookings Today, Avg Rating.

Admin page: `appointments` (`/dashboard/appointments` → `sector/AppointmentsToday.jsx`).

## KPI contract

| KPI id | Backend field (today) | Note |
|---|---|---|
| customers | `stats.customers` | |
| revenue | `stats.revenue` | formatted as currency |
| orders | `stats.orders` | placeholder until backend exposes |
| rating | `stats.avgRating` | |
| attendance | — | empty-state until backend exposes |
| giving / fees / booking | derived from `revenue`/`orders` | initial sector pages bind to existing APIs |

## Navigation fallback

Unknown or unset category → `DEFAULT_VERTICAL` (commerce model). The shell never crashes on a missing vertical.
