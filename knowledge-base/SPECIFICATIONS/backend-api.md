# Specification: Backend API Design

**Last Updated:** 2026-07-13

## Overview

The DUKADESK backend provides RESTful APIs for all platform capabilities. It serves as the data layer for the mobile app, tenant dashboard, business dashboard, and public website.

## Base URL

```
https://duka-backend-production.up.railway.app/api/v1
```

## Response Envelope

All responses follow a standard envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["email must be a valid email address"]
}
```

## Authentication

- `Authorization: Bearer <access_token>` for protected endpoints
- Access tokens expire in 15 minutes
- Refresh tokens (UUID) are rotated on each refresh call
- Social sign-in (Google, Apple) uses ID token verification

## API Endpoints

### Auth (`/api/v1/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Create user, return JWT + refresh |
| POST | `/login` | Public | Email/password login |
| POST | `/refresh` | Public | Rotate refresh token |
| POST | `/logout` | JWT | Revoke all user refresh tokens |
| POST | `/send-otp` | Public | Generate 6-digit OTP (Redis, 300s) |
| POST | `/verify-otp` | Public | Validate OTP, verify email |
| POST | `/google` | Public | Google ID token sign-in |
| POST | `/apple` | Public | Apple identity token sign-in |
| POST | `/forgot-password` | Public | Generate reset token (Redis, 1hr) |
| POST | `/reset-password` | Public | Reset password + revoke sessions |

### Tenants (`/api/v1/tenants`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | JWT | Create tenant |
| GET | `/my` | JWT | List user's tenants |
| GET | `/:id` | Public | Get tenant by ID |
| PUT | `/:id` | JWT | Update tenant |
| POST | `/:id/publish` | JWT | Publish tenant |
| GET | `/:id/config` | JWT | Get runtime config |
| PUT | `/:id/config` | JWT | Update runtime config |
| GET | `/:id/features` | Public | Get enabled capabilities |
| GET | `/:id/subscription` | JWT | Get subscription |
| POST | `/:id/subscribe` | JWT | Subscribe to plan |
| POST | `/:id/subscription/cancel` | JWT | Cancel subscription |

### Commerce (`/api/v1/products`, `/api/v1/cart`, `/api/v1/orders`)

Full product catalog with variants, categories, cart engine, order lifecycle, coupons, tax rules, fulfillments, and inventory reservations.

### Booking (`/api/v1/booking`)

Services, staff, schedules, availability engine, booking workflow (7 states), waiting list, cancellations, reminders.

### Payments (`/api/v1/payments`)

Initialize (Paystack/Flutterwave/Stripe), verify, refund, webhook processing, settlements, provider health checks.

### Renderer (`/api/v1/renderer` or `/api/v1/tenants/:id/definition`)

Returns the SDUI app definition JSON consumed by the mobile app:
```json
{
  "tenantId": "...",
  "name": "...",
  "slug": "...",
  "theme": { ... },
  "navigation": { ... },
  "screens": [ ... ]
}
```

## Pagination

List endpoints support `?page=1&limit=20` query parameters with total count in response metadata.

## Error Codes

| HTTP | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Internal server error |
