# ADR-002: Data-Driven Screen System

**Status:** ✅ Accepted  
**Date:** 2026-06-05  
**Author:** Architecture Team

## Context

Screens must be defined by data, not code. A tenant's screen structure should be configured by the backend and rendered dynamically by the client.

## Decision

Screen definitions use a `RuntimeNode` type with:
- `type` — component type name registered in ComponentRegistry
- `key` — unique identifier within the screen
- `props` — data passed to the component
- `actions` — named action definitions
- `children` / `layout` / `visibleWhen` — structural properties

Screens have two rendering paths:
1. **Layout path** — `screenDef.layout` contains a `LayoutNode` tree with `kind` (column, row, scroll, grid, section), `gap`, `padding`, and `children`
2. **Children path** — `screenDef.children` is a flat array of RuntimeNodes rendered in a View

## Consequences

- Screen data is JSON-serializable and backend-compatible
- Layout path supports nested, scrollable, flex-based layouts
- Children path supports flat, simple screens
- Both paths render through RegistryRenderer for each node

## Status

Accepted. Both paths implemented. Layout path uses `LayoutRenderer`, children path uses a flat View loop.
