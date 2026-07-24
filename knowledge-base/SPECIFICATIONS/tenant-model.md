# Specification: Tenant Model

**Last Updated:** 2026-07-09

## Overview
A Tenant represents a business on the DUKADESK platform. Each tenant has its own branding, navigation, screens, and capabilities.

## Data Structure
- **Manifest**: tenantId, version, capabilities, theme/navigation/screen references, assets
- **ThemeDefinition**: Colors, typography, spacing, roundness
- **NavigationDefinition**: initialScreen, tabs (label, icon, screenId)
- **ScreenDefinition**: screenId, title, layout (kind + children) or flat children list

## Tenant Resolution
1. Module registry provides default screens per capability
2. Manifest declares tenant-specific screens
3. ManifestResolver merges module defaults with tenant overrides
4. Final screens Map passed to ScreenRenderer

## Mock Client
`src/services/api/mockClient.ts` implements ApiClient with static JSON imports. Asset URLs return require() for local files.
