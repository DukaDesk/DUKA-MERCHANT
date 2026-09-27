# TASK-0025: Customizable Dashboard Endpoint — Implementation Plan

**Status:** Complete (2026-09-11)
**Commit:** `9b9c623`

## Context

The backend has a dashboard system (`DashboardsService`, `AnalyticsAppController`, Prisma models) with full CRUD, but it's a **data shell** — dashboards and widgets can be stored, but widget data is never resolved. Additionally, the BFF Business Dashboard controller returns hardcoded zeros instead of calling its real service methods.

## Goal

Make dashboards functional: widgets resolve live data, the BFF business dashboard works, and endpoints have proper validation.

---

## Phase 1: Wire BFF Business Dashboard (Quick Win)

**File:** `src/bff/business-dashboard/business-dashboard-bff.controller.ts`

- Inject `BusinessDashboardBffService` into the controller
- Replace 6 stub methods with real service calls
- `overview` → `getPlatformOverview()`
- `merchants` → `getTenantsList(status, page, limit)`
- `audit` → `getRecentAuditLogs()`
- `analytics` → real DB aggregation (revenue trend, user growth, order volume)
- `revenue` → real DB aggregation with filters
- `merchants/:merchantId/analytics` → per-merchant analytics

**New file:** `src/bff/business-dashboard/business-dashboard-bff.controller.spec.ts` (unit test)

---

## Phase 2: Widget Data Resolution

**File:** `src/modules/analytics/dashboards.service.ts`

Add two new methods:

### `resolveWidgetData(tenantId, widget)`
Maps widget `metric` + `dataset` + `query` to actual data from existing analytics service methods.

**Supported widget types:**

| `type` | `metric` | Data Source |
|--------|----------|-------------|
| `metric` | `revenue` | `AnalyticsService.getRevenueReport()` → `totalRevenue` |
| `metric` | `order_count` | `Order.count()` |
| `metric` | `user_count` | `TenantUser.count()` |
| `metric` | `booking_count` | `Booking.count()` |
| `chart` | `revenue_trend` | `AnalyticsService.getEventAggregation()` or custom revenue-by-period |
| `chart` | `user_growth` | Custom: users grouped by join date |
| `chart` | `order_volume` | Custom: orders grouped by date |
| `table` | `recent_orders` | `Order.findMany()` with limit |
| `list` | `top_products` | `Product.findMany()` with order count |

### `resolveDashboardData(tenantId, dashboardId)`
Iterates all widgets in a dashboard and calls `resolveWidgetData` for each, returning a complete rendered dashboard.

**File:** `src/modules/analytics/analytics-app.controller.ts`

Add two new endpoints:

- `GET /analytics/dashboards/:id/widgets/:widgetId/data` → resolves single widget data
- `GET /analytics/dashboards/:id/data` → resolves all widget data for a dashboard

**File:** `src/modules/analytics/analytics-public.controller.ts`

- `GET /analytics/dashboards/:id/data` (public, requires tenantId query param)

---

## Phase 3: Widget Type Registry

**File:** `src/modules/analytics/dashboards.service.ts`

Add constant `WIDGET_TYPES` and method `getWidgetTypes()`.

**File:** `src/modules/analytics/analytics-app.controller.ts`

- `GET /analytics/widget-types` → returns available widget types with descriptions

---

## Phase 4: DTOs

**New files:**

- `src/modules/analytics/dto/create-dashboard.dto.ts`
- `src/modules/analytics/dto/update-dashboard.dto.ts`
- `src/modules/analytics/dto/create-widget.dto.ts`
- `src/modules/analytics/dto/update-widget.dto.ts`

Use `class-validator` decorators (`@IsString`, `@IsOptional`, `@IsNumber`, `@IsIn`, `@ValidateNested`).

Update controllers to use DTOs instead of inline types.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/bff/business-dashboard/business-dashboard-bff.controller.ts` | Wire to service |
| `src/modules/analytics/dashboards.service.ts` | Add `resolveWidgetData`, `resolveDashboardData`, `getWidgetTypes` |
| `src/modules/analytics/analytics-app.controller.ts` | Add data endpoints, widget-types endpoint, use DTOs |
| `src/modules/analytics/analytics-public.controller.ts` | Add public data endpoint |
| `src/modules/analytics/analytics.service.ts` | Add helper methods for widget data (revenue-by-period, etc.) |

## New Files

| File | Purpose |
|------|---------|
| `src/modules/analytics/dto/create-dashboard.dto.ts` | Validation DTO |
| `src/modules/analytics/dto/update-dashboard.dto.ts` | Validation DTO |
| `src/modules/analytics/dto/create-widget.dto.ts` | Validation DTO |
| `src/modules/analytics/dto/update-widget.dto.ts` | Validation DTO |

## Verification

1. `npm run build` — 0 TS errors
2. `npm run lint` — 0 new errors
3. Manual test: `POST /app/analytics/dashboards` → `POST /app/analytics/dashboards/:id/widgets` → `GET /app/analytics/dashboards/:id/data` → verify widget data resolved
4. Manual test: `GET /bff/admin/overview` → verify real numbers (not zeros)
