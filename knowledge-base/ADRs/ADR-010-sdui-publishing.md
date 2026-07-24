# ADR-010: SDUI Publishing Pipeline

**Status:** ✅ Accepted  
**Date:** 2026-07-01  
**Author:** Architecture Team

## Context

Tenants build app experiences using the visual Builder (pages, sections, components). These must be compiled into a consumable format, validated for correctness, and published to a delivery layer. The mobile app needs a single, cacheable JSON definition.

## Decision

Implement a three-phase publishing pipeline:

### Phase 1: Draft
- Builder writes to Page → Section → Component tables
- Draft tracks version and status
- Multiple drafts can exist per tenant

### Phase 2: Validation
- Check required pages exist (home screen)
- Validate slugs are unique
- Verify sections have valid component references
- Check navigation has valid screen targets

### Phase 3: Release
- Compile the SDUI manifest: `{ theme, navigation, features, screens }`
- Create a Release record with version number
- Invalidate Redis cache for this tenant
- Emit `ReleasePublished` event (triggers notification, webhook)
- Support rollback to previous releases

### Delivery

The Renderer module serves the compiled app definition:
```
GET /api/v1/tenants/:id/definition  →  { theme, navigation, screens }
```

This is cached in Redis (5-minute TTL) and consumed by the mobile BFF.

## Consequences

- Mobile app fetches a single JSON blob — no assembly required
- Validation catches errors before tenants publish
- Rollback provides a safety net
- Redis caching reduces database load
- Events enable downstream processing (notifications, webhooks, analytics)

## Status

Accepted. Full pipeline implemented in `PublishingModule` with validation engine, manifest compiler, release management, and cache invalidation.
