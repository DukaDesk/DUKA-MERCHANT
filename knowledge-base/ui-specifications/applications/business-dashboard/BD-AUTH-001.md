# Screen Specification

## Screen ID

`BD-AUTH-001`

## Screen Title

Authentication (Login)

## Purpose

Allow merchants to sign in to the business dashboard using email and password.

## Actors

- Merchant (primary)

## Entry Points

- Clicking "Sign In" on the landing page
- Direct navigation to `/login`

## Exit Points

- Successful login redirects to `/dashboard`
- "Create an account" link navigates to `/signup`
- "Forgot Password?" link navigates to `/forgot-password`

## Permissions

No authentication required (public).

## Layout

Single centered card layout with app logo, form fields, and submit button. Responsive — full-screen on mobile, centered card on desktop.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| Input | shared/theme | Email and password fields |
| Button | shared/theme | Sign In action |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Login | Button click / Enter key | Calls `login()` API, stores token/merchant, navigates to dashboard |
| Toggle password visibility | Eye icon click | Shows/hides password text |

## Business Rules

- Email must be a valid format
- Password is required
- On success, access token is stored in localStorage
- On failure, inline error message is displayed
- Submit button is disabled while request is in-flight

## Navigation

- Forward: `/dashboard` on success
- Forward: `/forgot-password` via link
- Forward: `/signup` via link

## Loading State

Submit button shows spinner text and becomes disabled while login request is pending.

## Empty State

Not applicable — no data to display.

## Error State

Inline error message displayed above the submit button when credentials are invalid or server error occurs.

## Success State

Redirect to `/dashboard` upon successful authentication.

## Validation

- Email format validation before submit
- Password non-empty check
- Inline error styling on invalid fields

## Notifications

- No toasts on this screen (uses inline error messages)

## Accessibility

- Single `<h1>` heading for the login card
- Labels associated with inputs via `labelStyle`
- Keyboard navigable: Tab between fields, Enter to submit
- Error messages announced via aria-live region

## Acceptance Criteria

- [ ] Merchant can log in with valid credentials
- [ ] Invalid credentials show inline error
- [ ] Successful login stores token and merchant data
- [ ] Redirect to dashboard after login

## Related Specifications

- depends-on: [FEAT-0001 User Registration and Login](../../engineering-specifications/specifications/features/FEAT-0001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
