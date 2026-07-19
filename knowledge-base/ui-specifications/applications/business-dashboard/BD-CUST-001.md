# Screen Specification

## Screen ID

`BD-CUST-001`

## Screen Title

Customers

## Purpose

View and manage customer relationships — see customer list, contact details, order history, and notes.

## Actors

- Merchant (primary)

## Entry Points

- Sidebar navigation: "Customers"
- Direct URL: `/dashboard/customers`

## Exit Points

- Navigate to other screens via sidebar
- Close customer detail panel

## Permissions

Authenticated merchant.

## Layout

Header with title and add button. Search bar. Customers table/grid. Slide-over detail panel with tabs (Info, Orders, Notes).

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| Glide panel | theme | Customer detail with tabs |
| Avatar | inline | Customer initial circle |
| Notes list | inline | Free-text notes per customer |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| View customer | Click on row | Opens detail panel |
| Search | Search input | Filters by name, email, or phone |
| Add note | Note input + save | Appends note to customer timeline |
| Contact customer | Phone/email icon | Launches external handler |

## Business Rules

- Customer data is mock (no tenant API integration yet)
- Notes persist to localStorage
- Customers are ordered by most recent order
- Contact info shows masked data in list, full in detail

## Navigation

- Customer detail is handled inline via glide panel
- Can navigate to conversations for a specific customer (future)

## Loading State

Not applicable — data is static mock.

## Empty State

"All your customers will appear here" when list is empty.

## Error State

Not applicable — no API fetch on initial load.

## Success State

Customer list renders with search and detail interaction.

## Validation

No forms on this screen (notes are free-text).

## Notifications

- "Note added" toast
- "Customer contacted" toast

## Accessibility

- `<h2>` heading for screen title
- Table structure for customer list
- Detail panel has close button

## Acceptance Criteria

- [ ] Customer list displays with avatars
- [ ] Search filters customers
- [ ] Customer detail shows info, orders, notes
- [ ] Notes can be added and persist
- [ ] Contact buttons work

## Related Specifications

- related-to: [BD-ORD-001](./BD-ORD-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
