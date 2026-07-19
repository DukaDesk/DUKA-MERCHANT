# Validation Standard

## Validation Principles

1. **Inline**: Validate as the user interacts or on blur.
2. **Clear**: Error messages explain what is wrong and how to fix it.
3. **Forgiving**: Allow correction without losing progress.
4. **Contextual**: Errors appear near the relevant field.

## Validation Timing

| Trigger | When to Validate |
|---------|------------------|
| On blur | After user leaves a field |
| On input | As user types (for format checks) |
| On submit | Before form submission |
| On change | For selects and toggles |

## Error Message Format

```text
[Field label] [what is wrong] [how to fix it]
```

Examples:

- "Email must be a valid email address."
- "Password must be at least 8 characters."
- "Tenant name is required."

## Common Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Valid email format | "Enter a valid email address." |
| Password | Min 8 chars, 1 letter, 1 number | "Password must be at least 8 characters with a letter and a number." |
| Required text | Non-empty | "[Label] is required." |
| Slug | Alphanumeric and hyphens | "Slug can only contain letters, numbers, and hyphens." |
| URL | Valid URL format | "Enter a valid URL." |

## Form-Level Validation

- Submit button is disabled until required fields are valid.
- On submit, scroll to the first error if any exist.
- Server-side validation results are mapped to fields.

## Success Indicators

- Valid fields may show a checkmark (optional).
- Forms show a success message after submission.
