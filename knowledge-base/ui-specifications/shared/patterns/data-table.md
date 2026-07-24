# Data Table Pattern

## Purpose

Display tabular data with sorting, filtering, pagination, and actions.

## Structure

```text
[Title]                    [Search] [Filter] [Add New]
[Table]
  [Header Row]
  [Data Row]
  [Data Row]
[Pagination]
```

## Columns

| Element | Behavior |
|---------|----------|
| Header | Click to sort |
| Row | Hover highlight |
| Actions | Inline buttons or dropdown |

## States

- Loading: Skeleton rows
- Empty: Empty state message
- Error: Error banner
- Filtered: Active filter chips

## Actions

- Sort by column
- Filter by field
- Search globally
- Select rows
- Bulk actions
- Pagination

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Horizontal scroll or card list |
| >= 768px | Full table |

## Empty State

> No items found.
> Add your first item to get started.
> [Add Item]

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial pattern spec |
