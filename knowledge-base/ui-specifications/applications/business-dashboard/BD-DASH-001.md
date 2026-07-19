# Screen Specification

## Screen ID

`BD-DASH-001`

## Screen Title

Dashboard

## Purpose

Provide merchants with a real-time overview of their business: key metrics, recent activity, revenue trends, app status, and quick actions.

## Actors

- Merchant (primary)

## Entry Points

- Post-login redirect
- Direct navigation to `/dashboard`

## Exit Points

- Quick action cards navigate to other screens
- "Edit App" button navigates to the canvas editor
- "View All" link navigates to orders

## Permissions

Authenticated merchant with `merchant` or `tenant_owner` role.

## Layout

Multi-section scrollable page with KPI cards row, info grid, activity feed, revenue chart, quick actions, app status panel, and QR code card.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while stats/revenue/activity load |
| `Empty` | layout/States | Shown when no dashboard data exists |
| `ErrorState` | layout/States | Shown on API fetch failure with retry |
| KPI cards | inline | 4 metric cards (Customers, Revenue, Messages, Rating) |
| AreaChart | recharts | Revenue trend visualization (30 days) |
| QR code | qrcode | Generated store QR for sharing |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Navigate to page | KPI/quick action card click | Dispatches navigate action |
| Edit App | Button click | Navigates to canvas editor |
| Copy store link | Button click | Copies URL, shows "Copied!" feedback |
| Download QR | Button click | Generates and downloads QR PNG |

## Business Rules

- Dashboard data is fetched from 3 endpoints concurrently
- KPI trends are computed from mock data
- Store slug is derived from business name or deployed app
- QR code uses the store URL
- App status banner changes based on deployment state

## Navigation

- KPI cards: messages → `/dashboard/messages`
- Quick actions: products, orders, messages, analytics
- "View All" → `/dashboard/orders`
- "Edit App" → `/canvas-editor`

## Loading State

Full-screen `Loading` component with shimmer skeleton while all 3 API calls resolve.

## Empty State

`Empty` component when stats are null (no data yet). Shows setup/app deploy CTA button.

## Error State

`ErrorState` component with "Try Again" button when initial fetch fails. Calls `loadDashboard()` to retry all 3 API calls.

## Success State

Full dashboard with KPI cards, revenue chart, activity feed, quick actions, and QR code displayed.

## Validation

No forms on this screen.

## Notifications

- Toast on filter change: "Filter applied"
- Toast on QR download: "QR code downloaded!" or "Failed to generate QR code"
- Toast on link copy: "Store link copied!"

## Accessibility

- `<h2>` heading for screen title
- KPI cards use semantic structure
- Charts use recharts accessible tooltips
- Interactive elements have visible focus states

## Acceptance Criteria

- [ ] All KPIs load and display correctly
- [ ] Revenue chart renders with data
- [ ] Activity feed shows latest actions
- [ ] App status reflects deployment state
- [ ] QR code generates and downloads
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [BD-PROD-001](./BD-PROD-001.md)
- depends-on: [BD-ORD-001](./BD-ORD-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
