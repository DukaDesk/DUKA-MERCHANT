# Screen Specification

## Screen ID

`BD-ANAL-001`

## Screen Title

Analytics

## Purpose

Provide merchants with detailed business performance metrics — revenue trends, order breakdown, QR scan activity, customer insights, and top products.

## Actors

- Merchant (primary)

## Entry Points

- Dashboard quick action: "Analytics"
- Sidebar navigation: "Analytics"
- Direct URL: `/dashboard/analytics`

## Exit Points

- Navigate to other screens via sidebar

## Permissions

Authenticated merchant.

## Layout

Header with title, date range selector, and export button. Metric cards row (Revenue, Orders, Customers, QR Views, Avg Rating). Revenue line chart and order pie chart side-by-side. QR scans bar chart and customer split pie chart side-by-side. Top products table.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while all analytics load |
| `Empty` | layout/States | Per-chart empty state for no data |
| `ErrorState` | layout/States | API fetch failure with retry |
| AreaChart | recharts | Revenue trend visualization |
| PieChart | recharts | Orders breakdown and customer split |
| BarChart | recharts | QR scan activity |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Export CSV | "Export" button | Downloads analytics report as CSV |
| Change date range | Select dropdown | Filters data by time period (mock) |

## Business Rules

- 5 concurrent API calls on mount (`getRevenueData`, `getOrderStats`, `getScanData`, `getTopProducts`, `getCustomerSplit`)
- Each chart section has its own empty state if data is empty
- Top products table shows rank, views, orders, revenue, trend
- CSV export combines all visible data into a single file
- Date range selector is present but does not re-fetch (mock)

## Navigation

- Dashboard quick action links here

## Loading State

Full-screen `Loading` while all 5 API calls resolve.

## Empty State

Per-chart `Empty` components: "No revenue data yet", "No orders yet", "No scan data yet", "No customer data yet", "No product data yet".

## Error State

`ErrorState` with "Try Again" button when initial fetch fails. Calls `loadAnalytics()` to retry all 5 API calls.

## Success State

All charts and tables render with data. Metric cards show summary values.

## Validation

No forms on this screen.

## Notifications

- "Analytics exported!" toast on CSV download

## Accessibility

- `<h2>` heading for screen title
- Charts use recharts tooltips for data reading
- Export button has visible label

## Acceptance Criteria

- [ ] All 5 data sets load and display
- [ ] Revenue area chart renders
- [ ] Orders pie chart renders
- [ ] QR scan bar chart renders
- [ ] Customer split pie chart renders
- [ ] Top products table renders
- [ ] CSV export includes all data
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [BD-DASH-001](./BD-DASH-001.md)
- depends-on: [BD-PROD-001](./BD-PROD-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
