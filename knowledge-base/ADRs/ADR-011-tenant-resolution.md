# ADR-011: Tenant Resolution Strategy

**Status:** ✅ Accepted  
**Date:** 2026-07-01  
**Author:** Architecture Team

## Context

Every API request must be associated with a tenant. Multiple identification methods exist: explicit headers, URL path parameters, subdomain-based routing, and custom domains. The resolution mechanism must be fast, consistent, and support multi-tenancy without per-tenant code changes.

## Decision

Use a middleware-based tenant resolution pipeline with `AsyncLocalStorage` context propagation:

### Resolution Priority

1. **Header** `x-tenant-id` — Explicit tenant UUID (highest priority)
2. **Header** `x-tenant-slug` — Explicit tenant slug
3. **URL param** — `:tenantId` path parameter
4. **Subdomain** — Extract slug from `*.dukadesk.app` hostname
5. **Custom domain** — Query `TenantDomain` table (future, schema-ready)

### Context Propagation

- `TenantResolverMiddleware` runs on all routes
- Resolved context stored in `AsyncLocalStorage<TenantContext>`
- `TenantContextService.get()` available anywhere via dependency injection
- Context includes: `tenantId`, `slug`, `name`, `status`, `features`, `config`, `locale`, `currency`, `timezone`

### Tenant Identification

- Primary identifier: `slug` (unique, URL-friendly string like `abc-pharmacy`)
- Default URL scheme: `https://<slug>.dukadesk.app`
- Custom domain support via `TenantDomain` model (verified + SSL fields)
- Feature-gated: `custom_domain` on Enterprise plan only

## Consequences

- Every request is automatically tenant-aware without explicit decorators
- AsyncLocalStorage prevents context leakage across async boundaries
- Custom domain resolution is schema-ready but not yet implemented
- Platform domain is configurable via `PLATFORM_DOMAIN` environment variable

## Status

Accepted. Middleware active in production. Custom domain resolution is schema-ready but awaits full implementation (DNS verification, SSL provisioning, reverse proxy config).
