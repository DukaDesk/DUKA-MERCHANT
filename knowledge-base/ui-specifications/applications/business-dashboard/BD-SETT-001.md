# Screen Specification

## Screen ID

`BD-SETT-001`

## Screen Title

Settings

## Purpose

Configure business information, contact details, business hours, and branding (accent color, timezone) for the merchant's app.

## Actors

- Merchant (primary)

## Entry Points

- Sidebar navigation: "Settings"
- Direct URL: `/dashboard/settings`

## Exit Points

- "Back to Dashboard" button
- "Cancel" button

## Permissions

Authenticated merchant. Tenant settings update requires `tenant_owner` role.

## Layout

Single-column scrollable page with card sections: Business Information, Contact Information, Business Hours, Branding. Save/Cancel buttons at bottom.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| Input | shared/theme | Text, email, phone, URL fields |
| Textarea | shared/theme | Business description |
| Select | shared/theme | Timezone dropdown |
| Color picker | native input | Accent color selection |
| Hours grid | inline | Per-day operating hours inputs |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Save settings | "Save Settings" button | Persists to tenant API + localStorage |
| Cancel | "Cancel" button | Navigates back to dashboard |
| Change accent color | Color picker input | Updates preview immediately |

## Business Rules

- Settings persist to tenant config API when `tenantId` exists
- Fall back to localStorage when no tenant
- Business hours are per-day text inputs (e.g., "09:00 - 18:00")
- Accent color is stored as hex value (defaults to AMBER `#F4A026`)
- Timezone defaults to Africa/Lagos
- On save, both tenant config and local storage are updated
- If tenant API fails, data still saves to localStorage

## Navigation

- Back to Dashboard button at top
- Cancel button at bottom

## Loading State

Not applicable — initial data loads from localStorage + tenant config fetch (silent background).

## Empty State

Not applicable — form is always pre-filled with defaults.

## Error State

If tenant API save fails, data still persists to localStorage and toast shows "Settings saved locally!".

## Success State

Toast: "Settings saved successfully!" after API + localStorage persistence.

## Validation

No strict validation — all fields accept free text.

## Notifications

- "Settings saved successfully!" toast
- "Settings saved locally!" toast (when API fails)

## Accessibility

- `<h2>` heading for screen title
- Each card section has a descriptive heading
- Form labels associated with inputs
- Color picker has visible label

## Acceptance Criteria

- [ ] All form fields load saved values
- [ ] Business name, description, contact fields save
- [ ] Business hours per day save and load
- [ ] Accent color picker saves hex value
- [ ] Timezone selection persists
- [ ] Save persists to API and localStorage
- [ ] Fall back to localStorage when API unavailable

## Related Specifications

- depends-on: [FEAT-0002 Tenant Lifecycle](../../engineering-specifications/specifications/features/FEAT-0002.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
