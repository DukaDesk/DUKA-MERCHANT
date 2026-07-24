# Specification: Backend Data Model

**Last Updated:** 2026-07-13

## Overview

The DUKADESK backend uses PostgreSQL with Prisma ORM. The schema spans 60+ models organized by domain phase.

## Core Models

### User

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | String | Unique, required |
| passwordHash | String? | Nullable for social-only users |
| googleId | String? | Unique, nullable |
| appleId | String? | Unique, nullable |
| firstName | String | |
| lastName | String | |
| status | UserStatus | active / suspended / disabled |

### Tenant

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | Business name |
| slug | String | Unique, URL-friendly identifier |
| status | TenantStatus | draft / published / suspended |
| email | String? | Contact email |
| phone | String? | |
| logo | String? | Asset path |

### TenantDomain

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| domain | String | Custom domain name |
| verified | Boolean | DNS verification status |
| sslStatus | String | pending / active / failed |
| isPrimary | Boolean | Primary domain for tenant |

### Page / Section / Component

Hierarchical page builder data:

- **Page:** name, slug, isHome, sortOrder
- **Section:** type, config (JSON), sortOrder, isActive
- **Component:** type, props (JSON), sortOrder, isActive

### Product

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| name | String | |
| type | ProductType | physical / service / digital / donation / membership / event_ticket |
| price | Decimal | |
| currency | String | Default: NGN |
| isActive | Boolean | |
| images | ProductImage[] | One-to-many |

### Booking Models

- **BookingService:** name, duration, price, maxCapacity
- **StaffMember:** name, email, color
- **Schedule:** recurring weekly rules + date-specific overrides
- **Booking:** 7-state workflow (pending → confirmed → in_progress → completed / cancelled / no_show / refunded)

### Payment Models

- **PaymentProvider:** slug, name (seed: paystack, flutterwave, stripe)
- **TenantPaymentAccount:** per-tenant provider credentials
- **PaymentIntent:** provider, amount, status, reference
- **Transaction:** completed payments with provider reference
- **Settlement:** provider settlement tracking

### Key Design Decisions

1. **Soft delete** on products and categories via `isActive` boolean
2. **Version tracking** on themes (ThemeVersion), forms (submission version), templates
3. **JSON fields** for flexible config (TenantConfig.config, Section.config, Component.props)
4. **Case-insensitive search** via `LOWER()` transforms or PostgreSQL citext
5. **Composite unique constraints** where needed (`[tenantId, domain]`, `[tenantId, userId]`)
