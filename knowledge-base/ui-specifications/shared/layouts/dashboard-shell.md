# Dashboard Shell Layout

## Layout Name

Dashboard Shell

## Purpose

Provides the common structure for Business Dashboard and Tenant Dashboard.

## Structure

```text
[Header]
  [Logo] [Search] [Notifications] [User Menu]
    ↓
[Sidebar]        [Main Content]
  [Navigation]     [Page Title]
                   [Content]
```

## Regions

| Region | Content | Behavior |
|--------|---------|----------|
| Header | Logo, search, notifications, user menu | Fixed top, 64px height |
| Sidebar | Navigation links | Collapsible on mobile, 240px width on desktop |
| Main Content | Screen-specific content | Scrollable |

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| < 1024px | Sidebar hidden, toggle button opens drawer |
| >= 1024px | Sidebar visible |

## Navigation

- Navigation items are grouped by module.
- Active item is highlighted.
- Items the user cannot access are hidden.

## Tokens Used

- color-surface
- color-neutral-100
- shadow-sm
- space-4

## Usage Rules

- Use for Business Dashboard and Tenant Dashboard.
- Do not use for public website or mobile app.

## Example Screens

- [BD-DASH-001](../applications/business-dashboard/BD-DASH-001.md) (to be created)
- [TD-HOME-001](../applications/tenant-dashboard/TD-HOME-001.md) (to be created)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial layout spec |
