# Card

## Component Name

Card

## Purpose

Groups related content and actions in a contained surface.

## Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Card content |
| title | string | No | - | Card title |
| actions | ReactNode | No | - | Action buttons |
| padding | string | No | md | none, sm, md, lg |
| shadow | string | No | sm | none, sm, md |

## Events

None.

## States

```text
Default → Hover → Focus → Loading → Error
```

## Variants

| Variant | Usage |
|---------|-------|
| default | General content |
| interactive | Clickable card |
| outline | Subtle boundary |

## Accessibility

- Interactive cards use `role="button"` or native `<button>`.
- Focus state is visible.

## Usage Rules

- Use for related information.
- Do not nest cards excessively.
- Keep actions at the bottom.

## Design Tokens

| Token | Usage |
|-------|-------|
| color-surface | Background |
| color-neutral-200 | Border |
| shadow-sm | Elevation |
| radius-lg | Corner radius |

## Examples

```jsx
<Card title="Recent Orders" actions={<Button label="View All" />}>
  <OrderList />
</Card>
```

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial component spec |
