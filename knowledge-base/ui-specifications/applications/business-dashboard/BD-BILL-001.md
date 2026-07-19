# Screen Specification

## Screen ID

`BD-BILL-001`

## Screen Title

Billing & Subscription

## Purpose

View current subscription plan, compare plans, upgrade/downgrade subscription, and view billing history.

## Actors

- Merchant (primary)

## Entry Points

- Sidebar navigation: "Billing"
- Direct URL: `/dashboard/billing`

## Exit Points

- Navigate to other screens via sidebar
- Close upgrade modal

## Permissions

Authenticated merchant.

## Layout

Header with title. Current plan banner (gradient card with features). Plan comparison table. Billing history table with download. Upgrade modal with card payment form.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while billing data loads |
| `Empty` | layout/States | No billing data available |
| `ErrorState` | layout/States | API fetch failure with retry |
| Plan banner | inline | Gradient card showing current plan |
| Plan table | inline | Feature comparison across plans |
| Payment form | inline | Card number, expiry, CVV inputs |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Upgrade plan | "Upgrade Plan" button | Opens upgrade modal with payment form |
| Subscribe | "Subscribe" button in modal | Processes payment, upgrades plan |
| Download invoices | "Download All" button | Exports billing history as CSV |
| Download single invoice | "Download" per row | Exports single invoice (mock) |

## Business Rules

- Current plan is fetched from tenant subscription endpoint
- Plans list is fetched from pricing API, falling back to mock
- Billing history is mock data
- Upgrade flow: form → processing → success confirmation
- Card validation: 16-digit number, MM/YY expiry, 3-digit CVV
- Payment is mock (no real Paystack integration)
- Fall back to mock data when no tenant exists

## Navigation

None beyond sidebar.

## Loading State

Full-screen `Loading` while current plan, plans, and billing history fetch concurrently.

## Empty State

`Empty` component when no current plan and no plans loaded.

## Error State

`ErrorState` with "Try Again" button when initial fetch fails. Calls `loadBilling()` to retry all 3 API calls.

## Success State

Current plan banner, plan comparison table, and billing history displayed.

## Validation

- Card number must be 16 digits
- Expiry must be in MM/YY format
- CVV must be 3 digits
- All card fields required before submit

## Notifications

- "Upgraded to [plan] plan! 🎉" toast
- "Upgrade failed" toast
- "Please fill in all card details" toast
- "All invoices downloaded!" toast
- "Invoice downloaded" toast

## Accessibility

- `<h2>` heading for screen title
- Plan table uses `<th>` and `<td>` properly
- Payment form has associated labels
- Upgrade modal has close button and backdrop

## Acceptance Criteria

- [ ] Current plan displays with features
- [ ] Plan comparison table renders correctly
- [ ] Upgrade modal opens with payment form
- [ ] Card validation works
- [ ] Successful upgrade shows confirmation
- [ ] Billing history displays with download
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [BD-SETT-001](./BD-SETT-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
