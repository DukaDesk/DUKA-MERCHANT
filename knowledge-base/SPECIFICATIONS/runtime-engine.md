# Specification: Runtime Engine

**Last Updated:** 2026-07-09

## Overview
The Runtime Engine is the core rendering system. It takes tenant data and produces interactive screens.

## Components
- **ManifestResolver**: Entry point for all tenant data. Fetches manifest → theme → navigation → screens via ApiClient.
- **ScreenEngine**: Renders a single screen based on `screenId`. Supports layout path (via LayoutRenderer) and children path (flat View).
- **ComponentRegistry**: Maps `type` strings to React Native components. RegistryRenderer wraps components with RuntimeContext.Provider.
- **LayoutEngine**: Renders LayoutNode trees with kind values: column, row, scroll, stack, grid, section.
- **ErrorBoundary**: Catches rendering errors and displays fallback UI.

## Types
RuntimeNode, LayoutNode, ActionDef, ActionType, ScreenDefinition, NavigationDefinition, ThemeDefinition — all defined in `src/runtime/types.ts`.
