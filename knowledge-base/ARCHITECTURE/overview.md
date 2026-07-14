# DUKADESK Architecture Overview

**Last Updated:** 2026-07-09

## System Context

```
┌─────────────────────────────────────────────────┐
│                    Client                        │
│  ┌───────────────────────────────────────────┐  │
│  │         React Native / Expo App            │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐  │  │
│  │  │ Explore  │  │   Auth   │  │  Desk   │  │  │
│  │  │  Screens │  │  Screens │  │ Screens │  │  │
│  │  └─────────┘  └──────────┘  └─────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │         Runtime Engine              │  │  │
│  │  │  ┌────────────┐  ┌───────────────┐  │  │  │
│  │  │  │  Component │  │    Action     │  │  │  │
│  │  │  │  Registry  │  │    Engine     │  │  │  │
│  │  │  └────────────┘  └───────────────┘  │  │  │
│  │  │  ┌────────────┐  ┌───────────────┐  │  │  │
│  │  │  │   Screen   │  │   Event Bus   │  │  │  │
│  │  │  │   Engine   │  │               │  │  │  │
│  │  │  └────────────┘  └───────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │          ApiClient Interface        │  │  │
│  │  │  ┌──────────┐  ┌─────────────────┐  │  │  │
│  │  │  │  Mock    │  │  HTTP Client    │  │  │  │
│  │  │  │  Client  │  │  (Future)       │  │  │  │
│  │  │  └──────────┘  └─────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Data Flow

```
Tenant JSON
    │
    ▼
ApiClient.getManifest() → Manifest
    │
    ├── ApiClient.getTheme() → ThemeDefinition
    ├── ApiClient.getNavigation() → NavigationDefinition
    └── ApiClient.getScreen() → ScreenDefinition (per screen)
            │
            ▼
    ManifestResolver
            │
            ▼
    ResolvedTenant { manifest, theme, navigation, screens: Map<screenId, ScreenDefinition> }
            │
            ▼
    ScreenRenderer(screenId)
            │
            ├── Screen has layout?
            │   └→ LayoutRenderer(layout.children) → RegistryRenderer per node
            │
            └── Screen has children?
                └→ View(children.map → RegistryRenderer)
                        │
                        ▼
                Component.render(props + actions)
                        │
                        ▼
                User interaction → dispatchAction(actions.someKey)
                        │
                        ▼
                ActionEngine → handler(action, node)
                        │
                        ├── navigate → router.push()
                        ├── switch_screen → EventBus.emit('navigation:switch_screen')
                        ├── filter → EventBus.emit('filter:changed')
                        ├── api_request → network layer request()
                        ├── add_to_cart → tenantStore.addToCart()
                        └── ...
```

## Module System

```
moduleRegistry.getDefaultScreens(capabilityIds)
    │
    ▼
Map<screenId, ScreenDefinition> (module defaults)
    │
    ▼
Overlay with tenant manifest screens
    │
    ▼
Final Map<screenId, ScreenDefinition>
```

Modules provide baseline implementations. Tenant screens override when provided in the manifest. This allows tenants to customize without forking the codebase.

## State Management

- **Zustand** for global state (cart, session, tenant)
- **useState** for local component state
- **EventBus** for cross-component events
- **Network layer** (Axios) for API communication
