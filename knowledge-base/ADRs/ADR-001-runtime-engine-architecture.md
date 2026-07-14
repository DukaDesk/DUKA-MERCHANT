# ADR-001: Runtime Engine Architecture

**Status:** ✅ Accepted  
**Date:** 2026-06-01  
**Author:** Architecture Team

## Context

DUKADESK needs a runtime engine that renders tenant-specific UIs from server-defined data. The engine must be flexible enough to support multiple tenants with different layouts, components, and behaviors.

## Decision

Implement a multi-layer runtime engine:

1. **Manifest Resolver** — Fetches and merges tenant data (manifest → theme → navigation → screens)
2. **Component Registry** — Maps type strings to React Native components
3. **Screen Engine** — Renders a screen definition by iterating its layout tree or children array
4. **Layout Engine** — Renders layout nodes (column, row, scroll, grid, section)
5. **Action Engine** — Routes named actions to registered handler functions
6. **Event Bus** — Cross-component communication via pub/sub

## Consequences

- Screens are pure data. No screen-specific code in the renderer.
- New capabilities can be added by registering components and writing JSON.
- Action handlers are the only imperative code — everything else is declarative.

## Status

Accepted. Runtime engine is partially implemented. Layout node types `visibleWhen`, `children`, and `layout` at the node level are defined in types but not yet evaluated by the engine.
