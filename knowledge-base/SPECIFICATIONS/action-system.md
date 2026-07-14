# Specification: Action System

**Last Updated:** 2026-07-09

## Overview

The Action System provides a data-driven mechanism for components to trigger behavior. Actions are defined in JSON and dispatched at runtime through the ActionEngine.

## Architecture

```
JSON Data                 Component                   ActionEngine
┌─────────┐              ┌──────────┐                ┌────────────┐
│ actions: {             │ onPress: │                │ handlers:  │
│   add: { │────node────▶│ dispatch │────action────▶│ navigate   │
│    type: │   .actions  │ Action() │                │ add_to_cart│
│    "..." │              │          │                │ ...        │
│  }       │              └──────────┘                └────────────┘
└─────────┘
```

## Context and Dispatch

`RuntimeContext` provides `dispatchAction: (action: ActionDef) => void` to all components. `RegistryRenderer` captures the `node` in closure, so the context wrapper is `(action) => dispatchEngine(action, node)`.

## Handler Categories

### Navigation
- `navigate` / `push` / `replace` — Expo Router navigation
- `pop` — Go back
- `switch_screen` — Emit `navigation:switch_screen` event (desk screen switching)
- `switch_tenant` — End session, navigate to different tenant desk

### Cart
- `add_to_cart` — Add item to cart. Reads from `action.payload` first, falls back to `node.props`
- `remove_from_cart` — Remove item from cart
- `checkout` — Navigate to `/checkout` route

### Communication
- `open_url` — Linking.openURL
- `open_maps` — Google Maps URL
- `call_phone` — tel: URL
- `email` — mailto: URL
- `share` — sms: URL

### Data
- `api_request` — HTTP request via network layer
- `submit_form` — Emit `form:submit` + optional api_request
- `filter` — Emit `filter:changed` event

### Session
- `logout` — End session, navigate to sign-in
- `switch_tenant` — End session, navigate to new tenant

### Content
- `download` — Linking.openURL (file URL)

## Event Bus Integration

Action handlers can emit EventBus events:
- `switch_screen` → `navigation:switch_screen`
- `filter` → `filter:changed`
- `submit_form` → `form:submit`

Components subscribe to these events to react without direct coupling.

## Adding New Handlers

1. Add type to `ActionType` union in `src/runtime/types.ts`
2. Implement handler in `src/runtime/actions/ActionEngine.ts`
3. Wire up in JSON data
4. Test end-to-end

## Debugging

`dispatchAction` logs a warning for unhandled action types:
```
[Renderer] No handler for action type: "some_type"
```
