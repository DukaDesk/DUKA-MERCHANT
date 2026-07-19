# Screen Specification

## Screen ID

`BD-INTEG-001`

## Screen Title

Integrations

## Purpose

Browse, enable, disable, and configure third-party integrations that extend the merchant's app capabilities.

## Actors

- Merchant (primary)

## Entry Points

- Sidebar navigation: "Integrations"
- Direct URL: `/dashboard/integrations`

## Exit Points

- Clicking an integration card navigates to its detail page: `/dashboard/integrations/:name`
- Close configuration panel
- Close remove confirmation dialog

## Permissions

Authenticated merchant.

## Layout

Header with title and description. Template-specific banner. Active integrations section with list. "Expand Your App's Capabilities" section with category filter and integration grid cards. Configuration slide-over panel. Remove confirmation modal.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while integrations load |
| `Empty` | layout/States | No integrations available |
| `ErrorState` | layout/States | API fetch failure with retry |
| Integration card | inline | Grid card with icon, name, badge, description |
| `IntegrationConfigPanel` | ./IntegrationConfigPanel | Configuration form for active integration |
| Confirmation dialog | inline | Remove integration confirmation |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Toggle integration | "Add to App" / "Remove" button | Enables or disables integration |
| Configure integration | "Configure" button | Opens configuration panel |
| Remove integration | "Remove" in active list or config panel | Opens confirmation dialog |
| Filter by category | Category pill buttons | Filters available integrations |
| View integration detail | Click card | Navigates to detail page |

## Business Rules

- Integrations are scoped to the merchant's tenant
- Fall back to mock data when no tenant exists
- Template-compatible integrations are filtered when a template is set
- Locked integrations require Growth plan upgrade
- Changes go live within seconds (mock)
- Integration config persists to localStorage per integration name

## Navigation

- Integration card click → `/dashboard/integrations/:name`
- Active integration list shows "Configure" and "Remove" inline actions

## Loading State

Full-screen `Loading` while integrations + deployed app fetch in parallel.

## Empty State

`Empty` component when no integrations are available for the template.

## Error State

`ErrorState` with "Try Again" button when initial fetch fails. Calls `loadIntegrations()` to retry.

## Success State

Active integrations listed with templates showing their name, connected status, and configuration options. Available integrations shown in categorized grid.

## Validation

No forms on this screen.

## Notifications

- "Integration added to your app!" toast
- "Integration removed" toast
- "Failed to toggle integration" toast
- "Upgrade to Growth plan to unlock" toast (locked integrations)
- "Integration settings saved!" toast (from config panel)

## Accessibility

- `<h2>` heading for screen title
- Integration cards have interactive states
- Configuration panel has close button
- Remove confirmation has backdrop and focus management

## Acceptance Criteria

- [ ] Integrations load and display by category
- [ ] Template filtering works when app has template
- [ ] Toggle integration on/off works
- [ ] Locked integrations show upgrade prompt
- [ ] Configuration panel opens for active integrations
- [ ] Remove confirmation dialog works
- [ ] Category filter pills work
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [BD-DASH-001](./BD-DASH-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
