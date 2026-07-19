# Button

## Component Name

Button

## Purpose

Triggers an action or navigates the user.

## Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| label | string | Yes | - | Button text |
| onClick | function | Yes | - | Click handler |
| disabled | boolean | No | false | Disables interaction |
| loading | boolean | No | false | Shows spinner, disables button |
| variant | string | No | primary | primary, secondary, danger, ghost |
| size | string | No | md | sm, md, lg |
| icon | string | No | - | Leading icon name |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| onClick | event | Fired when button is clicked |

## States

```text
Default → Hover → Active → Loading → Disabled
```

## Variants

| Variant | Usage |
|---------|-------|
| primary | Main call to action |
| secondary | Alternative action |
| danger | Destructive action |
| ghost | Low emphasis action |

## Accessibility

- Native `<button>` element is used.
- `aria-label` is required if label is not visible.
- Disabled state uses `disabled` attribute.

## Usage Rules

- Use one primary action per section.
- Do not use disabled buttons without explanation.
- Loading button must preserve width.

## Design Tokens

| Token | Usage |
|-------|-------|
| color-primary-500 | Primary background |
| color-primary-600 | Primary hover |
| color-surface | Text on primary |
| color-error-500 | Danger background |

## Examples

```jsx
<Button label="Save" onClick={handleSave} />
<Button label="Delete" variant="danger" onClick={handleDelete} />
<Button label="Loading" loading />
```

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial component spec |
