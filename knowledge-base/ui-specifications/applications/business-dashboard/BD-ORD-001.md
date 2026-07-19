# Screen Specification

## Screen ID

`BD-ORD-001`

## Screen Title

Orders

## Purpose

Track, view, and manage customer orders — filter by status, search, view details, and update order status.

## Actors

- Merchant (primary)

## Entry Points

- Dashboard "View All" link in activity
- Sidebar navigation: "Orders"
- Direct URL: `/dashboard/orders`

## Exit Points

- Navigate to other screens via sidebar
- Close order detail panel

## Permissions

Authenticated merchant.

## Layout

Header with title and export button. Stats row (Today, Pending, Processing, Completed). Filter bar with status tabs and search. Orders table with columns: ID, Customer, Items, Total, Payment, Status, Date, View. Slide-over detail panel.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while orders load |
| `Empty` | layout/States | No orders or no filtered results |
| `ErrorState` | layout/States | API fetch failure with retry |
| Order table | inline | Tabular list of orders |
| Glide panel | theme | Order detail with status timeline |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| View order detail | "View" button | Opens glide panel with full order info |
| Accept order | "Accept Order →" button | Updates status Pending → Processing |
| Complete order | Auto from Processing | Updates status Processing → Completed |
| Reject order | "Reject Order" button | Updates status to Cancelled |
| Search | Search input | Filters by order ID or customer name |
| Filter by status | Status tab buttons | Filters orders by status |
| Export | "Export" button | Initiates CSV export (future) |

## Business Rules

- Orders are scoped to tenant via `tenantId`
- Fall back to mock data when no tenant exists
- Status flow: Pending → Processing → Completed (or Cancelled)
- Order timeline shows steps based on current status
- Payment and delivery fee are calculated in the detail panel

## Navigation

- Dashboard activity "View All" links here
- Order detail is handled inline via glide panel

## Loading State

Full-screen `Loading` while initial orders fetch is in progress.

## Empty State

`Empty` component: "No orders found" with context-appropriate subtitle.

## Error State

`ErrorState` with "Try Again" button when initial orders fetch fails. Calls `loadOrders()` to retry.

## Success State

Orders table renders with all items. Status badges color-coded. Toast on status update: "Order updated to Processing".

## Validation

No forms on this screen.

## Notifications

- "Order #ID updated to Processing" toast
- "Failed to update order" toast
- "Export started" toast

## Accessibility

- `<h2>` heading for screen title
- Table uses proper `<thead>`, `<tbody>`, `<th>` structure
- Status badges have color + text for accessibility
- Detail panel has close button and backdrop

## Acceptance Criteria

- [ ] Orders load and display in table
- [ ] Filter by status tabs works
- [ ] Search by order ID or customer works
- [ ] View order detail with timeline
- [ ] Accept (Pending → Processing) works
- [ ] Reject (Pending → Cancelled) works
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [BD-DASH-001](./BD-DASH-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
