# Error Handling Standard

## Error Principles

1. **Visible**: Errors are shown to the user, not swallowed.
2. **Specific**: Error messages explain what happened.
3. **Actionable**: Users know what to do next.
4. **Recoverable**: Provide retry or escape paths.

## Error Categories

### Client Errors (4xx)

| Code | Meaning | UI Response |
|------|---------|-------------|
| 400 | Bad request | Show validation errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission denied message |
| 404 | Not found | Show not found screen |
| 409 | Conflict | Show conflict message |
| 422 | Validation error | Map errors to fields |

### Server Errors (5xx)

| Code | Meaning | UI Response |
|------|---------|-------------|
| 500 | Server error | Show generic error with retry |
| 502/503 | Service unavailable | Show maintenance or retry |
| 504 | Timeout | Show timeout message with retry |

## Error Patterns

### Inline Error

Used for form field errors.

### Toast Error

Used for action failures that do not block the screen.

### Error Banner

Used for page-level errors.

### Full-Screen Error

Used when the entire screen cannot load.

### Dialog Error

Used for errors that require a decision.

## Error Message Template

```text
What happened.
Why it happened (optional).
What to do next.
```

Example:

> We couldn't save your changes.
> The server is temporarily unavailable.
> Please try again in a few moments.

## Retry Behavior

- Provide a retry button for network errors.
- Limit automatic retries to 3 attempts.
- Show persistent error if retry fails.

## Error Logging

- Client errors are logged for debugging.
- No sensitive data is logged.
