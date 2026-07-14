# DUKADESK Platform Glossary

**Last Updated:** 2026-07-09

## Core Concepts

### Tenant
A business or organization that uses DUKADESK to manage their operations. Examples: Mama's Kitchen, Grace Pharmacy.

### Desk
The primary tenant-facing interface. A branded, screen-driven experience that presents tenant capabilities (menu, orders, offers, etc.) through a unified tab-based layout.

### Screen
A distinct view within a Desk. Defined by a `ScreenDefinition` containing either a `layout` tree or flat `children` list of `RuntimeNode`s. Screens are identified by `screenId` (e.g., `menu`, `orders`, `notifications`).

### RuntimeNode
The fundamental unit of a screen's component tree. Contains:
- `type`: Component type name (e.g., `menu_grid`, `category_pills`)
- `key`: Unique identifier within the screen
- `props`: Data passed to the component
- `actions`: Named action definitions (`Record<string, ActionDef>`)
- `children` / `layout` / `visibleWhen`: (Defined in types, not yet evaluated by engine)

### Action System
A data-driven mechanism that maps named actions on a RuntimeNode to handler functions. Actions are defined in JSON and dispatched at runtime. The ActionEngine routes `ActionDef` objects to registered handlers.

### ActionDef
An action definition with:
- `type`: One of the `ActionType` enum values
- `payload`: Optional data (`Record<string, unknown>`)
- `label`: Optional display label

### EventBus
A lightweight pub/sub system used for cross-component communication. Actions can emit events, and any component can subscribe. Used for screen navigation (`navigation:switch_screen`) and filtering (`filter:changed`).

### Capability
A declared feature that a tenant supports (e.g., `catalog`, `cart`, `checkout`, `orders`, `notifications`, `promotions`, `booking`). Declared in the manifest and used to load the appropriate module default screens.

### Module
A packaged set of default screens, components, and logic for a capability. Module defaults can be overridden by tenant-specific screens.

### Manifest
The tenant's declaration file. Contains version, capabilities, theme reference, navigation reference, screen references, and asset references.

### Component Registry
A map of component type names to React Native component implementations. Used by `RegistryRenderer` to resolve `node.type` to an actual component.

### SDUI (Server-Driven UI)
The architectural pattern where the server (or mock client) defines the UI structure via JSON. The client renders components based on the data, not hardcoded layouts.

## Action Types

| Type | Purpose | Status |
|------|---------|--------|
| `navigate` | Push Expo Router route | ✅ |
| `replace` | Replace Expo Router route | ✅ |
| `push` | Push Expo Router route | ✅ |
| `pop` | Go back | ✅ |
| `switch_screen` | Switch desk screen by ID | ✅ |
| `filter` | Emit filter:changed event | ✅ |
| `add_to_cart` | Add item to cart | ✅ |
| `remove_from_cart` | Remove item from cart | ✅ |
| `checkout` | Navigate to checkout | ✅ |
| `open_url` | Open URL via Linking | ✅ |
| `open_maps` | Open Google Maps | ✅ |
| `call_phone` | Phone call via Linking | ✅ |
| `email` | Open email client | ✅ |
| `share` | Share via system | ✅ |
| `download` | Download/Open URL | ✅ |
| `api_request` | Make HTTP request | ✅ |
| `submit_form` | Submit form data | ✅ |
| `logout` | End session, go to sign-in | ✅ |
| `switch_tenant` | Switch to different tenant | ✅ |
| `open_modal` | Open modal (not implemented) | ⏳ |
| `close_modal` | Close modal (not implemented) | ⏳ |
| `authenticate` | Trigger auth flow (not implemented) | ⏳ |
| `scan_qr` | QR scan (not implemented) | ⏳ |

## Component Types

| Type | Purpose | Status |
|------|---------|--------|
| `category_pills` | Horizontal scrollable category filter | ✅ |
| `menu_grid` | List of menu/product items | ✅ |
| `dynamic_card` | Individual menu/product card | ✅ |
| `info_list` | Contact info rows (phone, email, location) | ✅ |
| `order_history` | Past order list | ✅ |
| `empty_state` | Empty state placeholder | ✅ |
| `report_action` | Form/report block | ✅ |
| `notification_list` | Notification items | ✅ |
| `primary_button` | Primary call-to-action button | ✅ |
| `calendar_strip` | Date picker strip | ✅ |
| `slot_grid` | Time slot picker | ✅ |
| `booking_summary` | Booking confirmation summary | ✅ |
| `cart_summary` | Cart totals + checkout | ✅ |
| `address_form` | Address input form | ✅ |
| `hero_banner` | Image banner | ✅ |
| `promotion_list` | Offers/promotions carousel | ✅ |

## Architecture Patterns

### Data Flow
`Tenant JSON (API/Mock)` → `ManifestResolver` → `ResolvedTenant` → `ScreenRenderer` → `LayoutRenderer/RegistryRenderer` → `Component` → `ActionEngine` → `EventBus/Api/Router`

### Screen Switching
Within a Desk, screens are switched by `screenId` via `setActiveScreen()`. The EventBus action `switch_screen` emits `navigation:switch_screen` which the Desk subscribes to.

### Cross-Component Communication
Sibling components communicate via EventBus events, not through React props or state. This keeps the renderer agnostic about component relationships.
