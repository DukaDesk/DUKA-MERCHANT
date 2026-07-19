# Screen Specification

## Screen ID

`BD-TEAM-001`

## Screen Title

Team

## Purpose

Manage team members — view, invite, filter, and remove members from the merchant's organization.

## Actors

- Merchant (primary, owner role)
- Team Members (secondary)

## Entry Points

- Sidebar navigation: "Team"
- Direct URL: `/dashboard/team`

## Exit Points

- Navigate to other screens via sidebar
- Close invite panel

## Permissions

Authenticated merchant. Owner role required to remove members.

## Layout

Header with title and invite button. Members table showing avatar, name, email, role, status, actions. Invite slide-over panel with email and role selection.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| Avatar | inline | Member initial circle |
| Glide panel | theme | Invite team member form |
| Status badge | theme | Active/Pending/Inactive indicator |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Invite member | "Invite Member" button | Opens invite panel |
| Send invite | "Send Invite" in panel | Sends invitation email (mock) |
| Remove member | "Remove" button | Removes from team (owner only) |
| Search | Search input | Filters by name or email |
| Filter by role | Role dropdown | Filters by role type |

## Business Rules

- Team data is static mock (no tenant team API yet)
- Roles: Owner, Admin, Editor, Viewer
- Owner cannot be removed
- At least one owner must remain
- Invite sends mock email notification
- Status: Active, Pending, Inactive

## Navigation

None beyond sidebar — all interaction is inline.

## Loading State

Not applicable — data is static mock.

## Empty State

"No team members yet" with invite CTA.

## Error State

Not applicable — no API fetch on initial load.

## Success State

Members table renders with search, filter, role management.

## Validation

- Email required for invite
- Role selection required for invite

## Notifications

- "Invitation sent to [email]" toast
- "Member removed" toast
- "Only owners can remove members" toast

## Accessibility

- `<h2>` heading for screen title
- Table with proper `<th>` for column headers
- Role badges use color + text labels
- Invite panel has close button

## Acceptance Criteria

- [ ] Team members list displays
- [ ] Search filters members
- [ ] Role filter works
- [ ] Invite member panel opens
- [ ] Remove member works (owner only)
- [ ] Owner cannot be removed

## Related Specifications

None.

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
