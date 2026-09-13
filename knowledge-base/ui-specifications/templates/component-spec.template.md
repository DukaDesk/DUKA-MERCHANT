# Component Specification Template

## Component Name

Name of the component.

## Purpose

What this component does and when to use it.

## Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| label | string | Yes | - | Button text |
| onClick | function | Yes | - | Click handler |
| disabled | boolean | No | false | Disables the button |
| loading | boolean | No | false | Shows spinner |
| variant | string | No | primary | primary, secondary, danger |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| onClick | MouseEvent | Fired when clicked |

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

## Accessibility

- ARIA role
- Keyboard behavior
- Screen reader behavior

## Usage Rules

- When to use this component
- When not to use this component

## Design Tokens

| Token | Usage |
|-------|-------|
| color-primary-500 | Background |
| color-surface | Text |

## Examples

```jsx
<Button label="Save" onClick={handleSave} />
```

## Related Components

- [OtherComponent](other-component.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial component spec |
