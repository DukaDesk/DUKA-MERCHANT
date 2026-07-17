# Specification: Tenant System

**Last Updated:** 2026-07-13

## Overview

The Tenant system is the core of the DUKADESK platform. Each tenant represents a business with its own branding, capabilities, content, and configuration.

## Tenant Lifecycle

```
Draft ──→ Published ──→ Suspended
               │
               └──→ Published (updated)
```

- **Draft:** Initial state after creation. Only owner can view/edit.
- **Published:** Visible to customers via app/desk. Builder changes require re-publishing.
- **Suspended:** Admin action. Tenant and its content are hidden.

## Tenant Identification

All tenants get a free subdomain: `https://<slug>.dukadesk.app`

Custom domains (Enterprise plan): `https://customdomain.com`

Resolution order:
1. `x-tenant-id` header
2. `x-tenant-slug` header
3. URL path parameter
4. Subdomain extraction (`*.dukadesk.app`)
5. Custom domain lookup (`TenantDomain` table)

## Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| Starter | Free | Basic features, DUKADESK branding |
| Business | $29/mo | Full features, remove branding |
| Enterprise | $99/mo | Custom domain, priority support |

Feature flags control capability access per plan:
- `commerce`: product catalog, cart, checkout
- `booking`: services, scheduling, appointments
- `forms`: custom forms and workflows
- `notifications`: push, email, SMS
- `analytics`: dashboards and reports
- `integrations`: SendGrid, Google Calendar
- `custom_domain`: custom domain binding

## Runtime Configuration

Each tenant has runtime config:
- **languages:** Array of locale codes (default: `["en"]`)
- **currency:** Currency code (default: `"NGN"`)
- **timezone:** IANA timezone (default: `"Africa/Lagos"`)
- **region:** Region code (default: `"NG"`)
- **offlinePolicy:** `"cache-first"` or `"network-first"`

## Publishing

When a tenant publishes:
1. Builder content (pages, sections, components) is validated
2. SDUI manifest is compiled: `{ theme, navigation, features, screens }`
3. Release record created with version number
4. Redis cache invalidated for this tenant
5. `ReleasePublished` event emitted
