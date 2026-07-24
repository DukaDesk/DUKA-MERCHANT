# ADR-004: Event Bus for Cross-Component Communication

**Status:** ✅ Accepted  
**Date:** 2026-06-30  
**Author:** Architecture Team

## Context

Sibling components (e.g., CategoryPillsSection and MenuGridSection) need to communicate state changes without direct coupling. React props don't work for siblings rendered by a layout/data-driven renderer.

## Decision

Implement a lightweight Event Bus (`src/runtime/events/EventBus.ts`) with:
- `on(event, handler)` → subscribe, returns unsubscribe function
- `emit(event, data)` → publish to all subscribers
- `clearAll()` → remove all listeners

Action handlers can emit events. Components subscribe during mount and clean up on unmount.

## Consequences

- Sibling components communicate without imports or shared state
- Action handlers bridge between ActionEngine and EventBus
- Events follow `{domain}:{action}` naming convention
- Cleanup via returned unsubscribe function prevents memory leaks

## Status

Accepted. Implemented. Used for `navigation:switch_screen` (desk screen switching) and `filter:changed` (category filter).
