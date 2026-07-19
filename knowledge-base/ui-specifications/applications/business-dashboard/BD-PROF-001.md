# Screen Specification

## Screen ID

`BD-PROF-001`

## Screen Title

Profile

## Purpose

View and edit the merchant's personal and business profile information — name, business name, email, and phone.

## Actors

- Merchant (primary)

## Entry Points

- Sidebar navigation: "Profile"
- Direct URL: `/dashboard/profile`

## Exit Points

- "Back to Dashboard" button

## Permissions

Authenticated merchant.

## Layout

Single-column page with avatar card and account details form. Avatar shows merchant initials in gradient circle.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while profile loads |
| `ErrorState` | layout/States | API fetch failure with retry |
| Avatar card | inline | Gradient circle with initials |
| Input | shared/theme | Name, business, email, phone fields |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Save changes | "Save Changes" button | Calls updateMerchantProfile API, updates auth context |
| Navigate back | "Back to Dashboard" link | Returns to dashboard |

## Business Rules

- Profile is fetched from `/api/v1/profile` on mount
- Updates go to `/api/v1/profile` and also sync to tenant when business name changes
- Auth context (`handleAuth`) is updated on save to keep sidebar in sync
- Name and business name are required
- Avatar shows first initial of merchant name
- Join date derived from `createdAt` timestamp

## Navigation

- Back to Dashboard link at top

## Loading State

Full-screen `Loading` while profile fetches.

## Empty State

Not applicable — profile always has data or returns error.

## Error State

`ErrorState` with "Try Again" button when profile fetch fails. Calls `loadProfile()` to retry.

## Success State

Profile form pre-filled with current data. Avatar displays correctly.

## Validation

- Name and business name are required
- Email must be valid format
- Phone number is optional

## Notifications

- "Profile updated!" toast on success
- "Failed to update profile" toast on save failure
- "Failed to load profile" toast (deprecated — replaced by ErrorState)

## Accessibility

- `<h2>` heading for screen title
- Avatar has appropriate alt text via initials
- Form inputs have associated labels
- Back button uses semantic navigation

## Acceptance Criteria

- [ ] Profile loads and pre-fills form
- [ ] Avatar displays correct initials
- [ ] Save updates profile and auth context
- [ ] Name and business validation works
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [FEAT-0001 User Registration](../../engineering-specifications/specifications/features/FEAT-0001.md)
- related-to: [BD-SETT-001](./BD-SETT-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
