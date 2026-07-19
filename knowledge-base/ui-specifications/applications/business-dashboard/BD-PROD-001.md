# Screen Specification

## Screen ID

`BD-PROD-001`

## Screen Title

Products

## Purpose

Manage the merchant's product catalog — create, edit, delete, search, filter, and bulk-delete products.

## Actors

- Merchant (primary)

## Entry Points

- Dashboard quick action: "Add Product"
- Sidebar navigation: "Products"
- Direct URL: `/dashboard/products`

## Exit Points

- Navigate to other dashboard screens via sidebar
- Close the add/edit product panel

## Permissions

Authenticated merchant.

## Layout

Header with title, import CSV button, and add button. Filter bar with search and status tabs. Product grid (3 columns desktop, 2 tablet, 1 mobile). Slide-over panel for add/edit. CSV file input hidden behind import button.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while products load |
| `Empty` | layout/States | No products or no search results |
| `ErrorState` | layout/States | API fetch failure with retry |
| Product card | inline | Grid card with emoji, name, price, status badge |
| Glide panel | theme | Slide-over form for add/edit product |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Add product | "Add Product" button | Opens glide panel with empty form |
| Edit product | "Edit" button on card | Opens glide panel pre-filled |
| Delete product | "Delete" button on card | Removes product from catalog |
| Bulk delete | Multi-select + delete bar | Removes all selected products |
| Search | Search input | Filters product list by name |
| Filter by status | Status tab buttons | Filters by stock status |
| Import CSV | File picker | Parses CSV, creates products in bulk |

## Business Rules

- Products are scoped to the merchant's tenant via `tenantId`
- Fall back to localStorage when no tenant exists
- Name and price are required fields
- CSV import requires at minimum "name" and "price" columns
- Product status options: In Stock, Low Stock, Out of Stock
- Price and stock are stored as numbers

## Navigation

- Dashboard quick action links here
- Product detail is handled inline via the glide panel

## Loading State

Full-screen `Loading` while initial product fetch is in progress.

## Empty State

- No products yet: illustration with "Add Product" CTA button
- No search results: "No products match your filter" message

## Error State

`ErrorState` with "Try Again" button when initial product fetch fails. Calls `loadProducts()` to retry.

## Success State

Product grid renders with all items. Toast on create/update/delete: "Product added!", "Product updated!", "Product deleted".

## Validation

- Name and price required before saving
- Price must be a number
- Stock must be a number

## Notifications

- "Product added!" toast
- "Product updated!" toast
- "Failed to save product" toast
- "Failed to delete" toast
- CSV import count toast

## Accessibility

- `<h2>` heading for screen title
- Product cards use semantic HTML
- Glide panel has overlay backdrop
- Close button on panel

## Acceptance Criteria

- [ ] Products load and display in grid
- [ ] Create product via slide-over panel
- [ ] Edit existing product
- [ ] Delete product with confirmation
- [ ] Bulk select and delete products
- [ ] Search and filter by status work
- [ ] CSV import creates multiple products
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [BD-DASH-001](./BD-DASH-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
