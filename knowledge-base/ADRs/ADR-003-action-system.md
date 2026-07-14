# ADR-003: Action System Design

**Status:** ✅ Accepted  
**Date:** 2026-06-10  
**Author:** Architecture Team

## Context

Components need to trigger behavior (navigation, API calls, cart operations) in response to user interaction. This behavior must be data-driven and server-configurable.

## Decision

Implement an Action System with:

1. **ActionDef** — `{ type: ActionType, payload?: Record<string, unknown>, label?: string }`
2. **RuntimeNode.actions** — `Record<string, ActionDef>` mapping action names to definitions
3. **RegistryRenderer** — merges `node.actions` as the `actions` prop and provides `dispatchAction` via RuntimeContext
4. **ActionEngine** — routes `{ type, payload }` to registered handler functions
5. **RuntimeContext** — React context providing `dispatchAction` to all components

The dispatch flow:
```
Component → dispatchAction(actions.someKey) → RegistryRenderer wrapper → ActionEngine.dispatchAction(action, node) → handler(action, node)
```

## Consequences

- Components call `dispatchAction(actions.someKey)` where `actions.someKey` is `{ type: "navigate", payload: { screen: "/orders" } }`
- Handlers are registered per action type
- JSON data controls which actions each component can trigger
- Components can inject runtime data (e.g., tapped category) into the action payload before dispatching

## Status

Accepted. 17+ handler types implemented. Some handler types defined in the `ActionType` union are not yet implemented (`open_modal`, `close_modal`, `authenticate`, `scan_qr`).
