# DUKADESK Core Principles

**Last Updated:** 2026-07-09

## 1. Server-Driven UI (SDUI) First

The client renders what the server (or mock data) defines. JSON is the source of truth for screen structure, component composition, and action definitions. The client should never hardcode screen layouts or navigation flows.

## 2. Data-Driven Actions

All interactive behavior is expressed through the Action System. Components dispatch named actions from their RuntimeNode. Handlers are registered in ActionEngine. This keeps behavior declarative and server-configurable.

## 3. Decoupled Components

Components are independent and communicate only through:
- Props (from JSON data via RegistryRenderer)
- EventBus (for cross-component communication)
- Action System (for user-triggered behavior)

Components never import or reference each other directly.

## 4. Backend-Compatible Data

JSON data files mirror what a real backend would serve. The mock client can be swapped for an HTTP client without data format changes. No format transformations occur at the client boundary.

## 5. Progressive Enhancement

Capabilities are declared in the manifest. Module default screens provide baseline functionality. Tenant-specific screens override module defaults. The client renders whatever combination is provided.

## 6. Architecture Consistency over Convenience

When implementation convenience conflicts with architectural consistency, the architecture wins. Patterns (EventBus, Action System, Component Registry) are applied universally, even when a simpler direct solution exists.

## 7. Traceability

Every architectural decision has an ADR. The Knowledge Base is the primary source of truth. All implementation repositories reference the Knowledge Base version they align with. At any point, you can trace which version of the architecture a given implementation was built against.
