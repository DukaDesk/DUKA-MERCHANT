# Screen Specification

## Screen ID

`BD-MKT-001`

## Screen Title

Marketing

## Purpose

Create and manage marketing campaigns — discount codes, social media promotions, bulk SMS, targeted offers.

## Actors

- Merchant (primary)

## Entry Points

- Sidebar navigation: "Marketing"
- Direct URL: `/dashboard/marketing`

## Exit Points

- Navigate to other screens via sidebar

## Permissions

Authenticated merchant.

## Layout

Header with title. Campaign grid cards showing type, status, performance. Create campaign button. Each card shows name, type icon, status badge, stats, and action button.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| Campaign card | inline | Marketing campaign summary |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| View campaign | Click on card | Opens campaign detail (future) |
| Create campaign | "Create Campaign" button | Navigates to campaign builder (future) |

## Business Rules

- Campaign data is static mock
- Each campaign has: name, type (Discount, SMS, Social, Referral), status (Active, Draft, Ended, Scheduled), performance metrics
- Status determines card styling (Active = green, Ended = gray, etc.)

## Navigation

None beyond sidebar — all interaction is inline.

## Loading State

Not applicable — data is static mock.

## Empty State

"No campaigns yet" with "Create Campaign" CTA.

## Error State

Not applicable — no API fetch on initial load.

## Success State

Campaign cards render with status badges and metrics.

## Validation

No forms on this screen.

## Notifications

None on this screen.

## Accessibility

- `<h2>` heading for screen title
- Campaign cards use semantic structure
- Status badges have color + text labels

## Acceptance Criteria

- [ ] Campaign cards display with correct data
- [ ] Status badges are color-coded
- [ ] Each card shows performance metrics
- [ ] Create campaign button is present

## Related Specifications

None.

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
