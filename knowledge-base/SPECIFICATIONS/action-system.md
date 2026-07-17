# Specification: Action System

**Last Updated:** 2026-07-09

## Overview
Data-driven mechanism for components to trigger behavior. Actions are defined in JSON and dispatched through the ActionEngine.

## Architecture
RuntimeContext provides `dispatchAction` to all components. RegistryRenderer captures the node in closure: `(action) => dispatchEngine(action, node)`.

## Handler Categories
- **Navigation**: navigate, replace, push, pop, switch_screen, switch_tenant
- **Cart**: add_to_cart, remove_from_cart, checkout
- **Communication**: open_url, open_maps, call_phone, email, share, download
- **Data**: api_request, submit_form, filter
- **Session**: logout, switch_tenant

## Event Bus Integration
- switch_screen → navigation:switch_screen
- filter → filter:changed
- submit_form → form:submit

## Adding Handlers
1. Add type to ActionType union in `src/runtime/types.ts`
2. Implement handler in `src/runtime/actions/ActionEngine.ts`
3. Wire up in JSON data
4. Test end-to-end
