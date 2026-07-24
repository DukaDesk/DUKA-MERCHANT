# ADR-005: Branded Splash Screen

**Status:** ✅ Accepted  
**Date:** 2026-07-09  
**Author:** Architecture Team

## Context

Entering a tenant desk currently shows a generic loading spinner as the tenant data is resolved. A branded splash provides better UX and demonstrates the asset loading pipeline.

## Decision

Implement a two-phase branded splash:

**Phase 1 (loading):** Show tenant initials in a circle + display name + loading indicator. Background uses primary color from constants.

**Phase 2 (resolved + logo preloaded):** Logo image from `getAssetUrl(tenantId, 'assets/logo.png')` replaces initials. The Image loads in the background; `onLoad` swaps to the logo, `onError` keeps initials as fallback.

The mock client returns `require()` for known local assets (logo, icon) and CDN URLs for others. The `ApiClient.getAssetUrl` return type is widened to `string | number`.

## Consequences

- Splash shows immediately with static data (initials + name)
- Logo loads from the data layer, validating the asset pipeline
- Fallback to initials when image is unavailable
- No hardcoded image paths — everything comes from the data system

## Status

Accepted. Implemented in `app/desk/[id].tsx`. Placeholder logo files exist in tenant asset directories.
