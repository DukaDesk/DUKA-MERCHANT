# Dialog

## Component Name

Dialog

## Purpose

Displays critical content or decisions that interrupt the current flow.

## Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| open | boolean | Yes | false | Controls visibility |
| title | string | Yes | - | Dialog title |
| children | ReactNode | Yes | - | Dialog content |
| actions | ReactNode | No | - | Footer actions |
| onClose | function | Yes | - | Close handler |
| size | string | No | md | sm, md, lg |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| onClose | - | Fired when dialog closes |

## States

```text
Closed → Open → Closing → Closed
```

## Accessibility

- Uses `role="dialog"`.
- Focus is trapped inside dialog.
- Escape key closes dialog.
- Clicking overlay closes dialog.
- `aria-labelledby` references title.

## Usage Rules

- Use for confirmations, critical information, or focused tasks.
- Do not use for non-critical content.
- Provide explicit close and confirm actions.

## Design Tokens

| Token | Usage |
|-------|-------|
| color-surface | Background |
| shadow-lg | Elevation |
| radius-lg | Corner radius |

## Examples

```jsx
<Dialog open={isOpen} title="Delete item?" onClose={close}>
  <p>This action cannot be undone.</p>
  <Button label="Cancel" variant="secondary" />
  <Button label="Delete" variant="danger" />
</Dialog>
```

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial component spec |
