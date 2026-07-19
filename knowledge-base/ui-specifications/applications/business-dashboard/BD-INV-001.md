# Screen Specification

## Screen ID

`BD-INV-001`

## Screen Title

Inventory

## Purpose

Track stock levels, manage inventory items, set alerts for low stock, and record stock movements.

## Actors

- Merchant (primary)

## Entry Points

- Sidebar navigation: "Inventory"
- Direct URL: `/dashboard/inventory`

## Exit Points

- Navigate to other screens via sidebar
- Close add/edit item panel

## Permissions

Authenticated merchant.

## Layout

Header with title and add button. Summary cards (Total Items, Low Stock, Out of Stock). Inventory table with columns: Item, SKU, Category, Stock, Status, Last Restocked, Actions. Slide-over panel for add/edit item.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| Table | inline | Inventory listing |
| Status badge | theme | Stock level indicator |
| Glide panel | theme | Add/edit item form |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Add item | "Add Item" button | Opens glide panel with empty form |
| Edit item | "Edit" button | Opens glide panel pre-filled |
| Delete item | "Delete" button | Removes item from inventory |
| Restock | "Restock" action | Increments stock quantity |
| Search | Search input | Filters by item name or SKU |
| Filter by status | Dropdown | Filters by stock level |

## Business Rules

- Inventory is non-tenant mock data
- Stock levels: In Stock (>10), Low Stock (1-10), Out of Stock (0)
- Items can be linked to products (future)
- Low stock threshold is configurable (default 10)

## Navigation

- Item detail is inline via glide panel

## Loading State

Not applicable — data is static mock.

## Empty State

"No inventory items yet" with add item CTA.

## Error State

Not applicable — no API fetch on initial load.

## Success State

Inventory table renders with search, filter, and edit interaction.

## Validation

- Item name and SKU are required
- Stock must be a non-negative number
- Price must be a valid number

## Notifications

- "Item added" toast
- "Item updated" toast
- "Item deleted" toast
- "Restocked" toast

## Accessibility

- `<h2>` heading for screen title
- Table with proper `<th>` headers
- Status badges use color + text labels

## Acceptance Criteria

- [ ] Inventory list displays items
- [ ] Add new inventory item
- [ ] Edit existing item
- [ ] Delete item
- [ ] Search and filter work
- [ ] Stock status badges are correct

## Related Specifications

- related-to: [BD-PROD-001](./BD-PROD-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
