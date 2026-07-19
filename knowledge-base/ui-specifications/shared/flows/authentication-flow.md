# Authentication Flow

## Flow Name

Authentication Flow

## Actor

Unauthenticated user

## Trigger

User chooses to register, sign in, or reset password.

## Preconditions

- User has access to the application.
- Backend authentication API is available.

## Steps

### Registration

```text
User opens app/website
    ↓
Clicks Sign Up
    ↓
Enters email and password
    ↓
Submits form
    ↓
System validates input
    ↓
System creates account
    ↓
System signs user in
    ↓
User lands on home/dashboard
```

### Login

```text
User opens app/website
    ↓
Clicks Sign In
    ↓
Enters email and password
    ↓
Submits form
    ↓
System validates credentials
    ↓
System issues tokens
    ↓
User lands on home/dashboard
```

### Password Reset

```text
User clicks Forgot Password
    ↓
Enters email
    ↓
System sends reset link
    ↓
User clicks link
    ↓
User enters new password
    ↓
System updates password
    ↓
User signs in with new password
```

## Alternative Paths

| Path | Condition | Result |
|------|-----------|--------|
| Already authenticated | User has valid token | Redirect to home/dashboard |
| Invalid credentials | Login fails | Show error message |
| Email exists | Registration with existing email | Show error message |

## Failure Paths

| Path | Condition | Result |
|------|-----------|--------|
| Network error | API unreachable | Show retry message |
| Server error | 500 response | Show generic error |
| Expired reset token | Token invalid | Request new reset |

## Completion Criteria

- User is authenticated and redirected to the appropriate home screen.
- Tokens are stored securely on the client.

## Screens Involved

- [WEB-AUTH-001](../applications/website/WEB-AUTH-001.md) (to be created)
- [MOB-AUTH-001](../applications/mobile/MOB-AUTH-001.md) (to be created)
- [BD-AUTH-001](../applications/business-dashboard/BD-AUTH-001.md) (to be created)
- [TD-AUTH-001](../applications/tenant-dashboard/TD-AUTH-001.md) (to be created)

## Related Specifications

- [FEAT-0001 User Registration and Login](../../../engineering-specifications/specifications/features/FEAT-0001.md)
- [API-0001 Authentication API](../../../engineering-specifications/specifications/api/API-0001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @product-architect | Initial flow spec |
