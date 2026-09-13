# ADR-009: JWT + Refresh Token Authentication

**Status:** ✅ Accepted  
**Date:** 2026-07-01  
**Author:** Architecture Team

## Context

The platform needs a stateless authentication mechanism that works across multiple clients (mobile app, web dashboards, API consumers). Social sign-in (Google, Apple) is required alongside email/password.

## Decision

Use **Passport.js with JWT strategy** for authentication:

### Token Strategy

- **Access token:** JWT, 15-minute expiry, signed with `JWT_SECRET`
- **Refresh token:** UUID v4, 7-day expiry, stored hashed in database
- Refresh token rotation: each refresh invalidates the previous token
- Logout revokes all refresh tokens for the user

### Password Policy

- Bcrypt with 12 salt rounds
- Minimum 8 characters, must include uppercase, lowercase, digit, special character
- Password history keeps last 5 hashes to prevent reuse
- Account recovery via Redis-backed tokens (1-hour TTL)

### Social Sign-In

- **Google:** `google-auth-library` verifies ID tokens via `OAuth2Client.verifyIdToken()`
- **Apple:** `apple-signin-auth` verifies identity tokens
- Social accounts can link to existing email accounts
- `passwordHash` is optional for social-only users

### OTP Flow

- 6-digit OTP stored in Redis with 300-second TTL
- Used for email verification during registration
- Redis backed by ioredis with in-memory mock fallback for development

## Consequences

- JWT access tokens are stateless — no DB lookup on each request
- Refresh token rotation prevents replay attacks
- Social sign-in works without passwords
- OTP flow is fast (Redis) and doesn't pollute the database

## Status

Accepted. Implemented in `AuthModule` with full register/login/refresh/logout/social/OTP flow.
