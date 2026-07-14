# Specification: Runtime Engine

**Last Updated:** 2026-07-09

## Overview

The Runtime Engine is the core rendering system. It takes tenant data and produces interactive screens.

## Components

### ManifestResolver (`src/runtime/ManifestResolver.ts`)

Entry point for all tenant data. Fetches manifest → theme → navigation → screens via ApiClient.

**Input:** `tenantId: string`
**Output:** `ResolvedTenant` (`{ tenantId, manifest, theme, navigation, screens, capabilities }`)

### ScreenEngine (`src/runtime/ScreenEngine.tsx`)

Renders a single screen based on `screenId`.

**Takes:** `tenantId`, `screenId`, `screens` (Map), `navigation`, `themeData`
**Renders:** Layout path (via LayoutRenderer) or children path (flat View)

### ComponentRegistry (`src/runtime/ComponentRegistry.tsx`)

Maps `type` strings to React Native components.

**Key behavior:**
- `registerComponent(type, component)` — register
- `getComponent(type)` — retrieve
- `RegistryRenderer` — wraps components with `RuntimeContext.Provider` providing `dispatchAction`
- Merges `node.props + node.actions + extraProps` into component props

### LayoutEngine (`src/runtime/layouts/index.ts`)

Renders `LayoutNode` trees with `kind` values:
- `column` — flexDirection: column
- `row` — flexDirection: row
- `scroll` — ScrollView wrapper
- `stack` — absolute-positioned children
- `grid` — flexWrap grid
- `section` — section header + children

### ErrorBoundary (`src/runtime/ErrorBoundary.tsx`)

Catches rendering errors and displays a fallback UI.

## Types

All runtime types defined in `src/runtime/types.ts`:
- `RuntimeNode` — component node in screen tree
- `LayoutNode` — layout container node
- `ActionDef` — action definition
- `ActionType` — union of all action type strings
- `ScreenDefinition` — full screen definition
- `NavigationDefinition` — tab bar configuration
- `ThemeDefinition` — color/typography/spacing tokens
