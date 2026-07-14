# Specification: Tenant Model

**Last Updated:** 2026-07-09

## Overview

A Tenant represents a business on the DUKADESK platform. Each tenant has its own branding, navigation, screens, and capabilities.

## Data Structure

### Manifest (`Manifest`)
```json
{
  "tenantId": "mamas-kitchen",
  "version": "1.1",
  "capabilities": ["catalog", "cart", "checkout", "orders", "notifications"],
  "theme": "theme.json",
  "navigation": "navigation.json",
  "screens": [
    { "id": "menu", "path": "screens/menu-screen.json" },
    { "id": "orders", "path": "screens/orders-screen.json" }
  ],
  "assets": [
    { "id": "logo", "path": "assets/logo.png" },
    { "id": "icon", "path": "assets/icon.png" }
  ]
}
```

### Theme (`ThemeDefinition`)
Colors, typography, spacing, roundness. Used by BrandThemeProvider to style all components.

### Navigation (`NavigationDefinition`)
```json
{
  "initialScreen": "menu",
  "tabs": [
    { "label": "Menu", "icon": "restaurant-outline", "screenId": "menu" },
    { "label": "Orders", "icon": "receipt-outline", "screenId": "orders" }
  ]
}
```

### Screen (`ScreenDefinition`)
```json
{
  "screenId": "menu",
  "title": "Menu",
  "layout": {
    "kind": "scroll",
    "children": [
      { "type": "category_pills", "key": "category-pills", "props": {...}, "actions": {...} },
      { "type": "menu_grid", "key": "menu-items", "props": {...}, "actions": {...} }
    ]
  }
}
```

## Tenant Resolution

1. Module registry provides default screens per capability
2. Manifest declares tenant-specific screens
3. ManifestResolver merges: module defaults + tenant overrides
4. Final screens Map is passed to ScreenRenderer

## Mock Client

`src/services/api/mockClient.ts` implements `ApiClient` with static JSON imports. Screen keys match file name stems (`menu-screen` → key `menu-screen` → `findScreen` extracts stem via regex). Asset URLs return `require()` for local files or CDN URLs.
