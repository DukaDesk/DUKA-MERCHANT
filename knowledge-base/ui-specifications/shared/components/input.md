# Input

## Component Name

Input

## Purpose

Accepts text, number, email, password, and other single-line data from the user.

## Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| name | string | Yes | - | Field name |
| label | string | Yes | - | Field label |
| type | string | No | text | text, email, password, number |
| placeholder | string | No | - | Placeholder text |
| value | string | Yes | - | Current value |
| onChange | function | Yes | - | Change handler |
| error | string | No | - | Error message |
| disabled | boolean | No | false | Disables input |
| required | boolean | No | false | Marks field required |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| onChange | value | Fired when value changes |
| onBlur | event | Fired when input loses focus |
| onFocus | event | Fired when input gains focus |

## States

```text
Default → Focus → Filled → Error → Disabled
```

## Accessibility

- Label is associated with input via `htmlFor`.
- Error message linked via `aria-describedby`.
- Required fields marked with `aria-required`.

## Usage Rules

- Always pair with a label.
- Error text appears below the input.
- Password inputs include visibility toggle.

## Design Tokens

| Token | Usage |
|-------|-------|
| color-neutral-900 | Text |
| color-neutral-300 | Border default |
| color-primary-500 | Border focus |
| color-error-500 | Border and text error |

## Examples

```jsx
<Input
  name="email"
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
/>
```

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial component spec |
