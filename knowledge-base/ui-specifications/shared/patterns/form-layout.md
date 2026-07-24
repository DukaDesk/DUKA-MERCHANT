# Form Layout Pattern

## Purpose

Standard layout for forms across all applications.

## Structure

```text
[Page Title]
[Description]
[Form Section]
  [Field 1]
  [Field 2]
  [Field 3]
[Actions]
  [Cancel] [Submit]
```

## Rules

- Form width is constrained to 640px on desktop.
- Fields stack vertically on mobile.
- Two-column layout is allowed for related fields on desktop.
- Required fields are marked.
- Submit button is right-aligned.
- Cancel button is left-aligned or adjacent to submit.

## Spacing

- Between sections: 32px
- Between fields: 16px
- Between label and input: 4px
- Between error and next field: 16px

## Responsive

| Breakpoint | Layout |
|------------|--------|
| < 768px | Single column, full width |
| >= 768px | Max 640px, optional two columns |

## Example

```text
Create Product
Fill in the product details below.

Name            [________________]
SKU             [________________]
Description     [________________]
                [________________]

[Cancel]  [Save Product]
```

## Related Components

- [Input](../components/input.md)
- [Button](../components/button.md)
- [Card](../components/card.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial pattern spec |
