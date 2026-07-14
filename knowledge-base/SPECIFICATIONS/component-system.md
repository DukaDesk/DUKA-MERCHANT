# Specification: Component System

**Last Updated:** 2026-07-09

## Overview

Components are the building blocks of screens. They are registered in the Component Registry by type name and rendered by RegistryRenderer when a RuntimeNode with that type is encountered.

## Registration

Components are registered via `registerComponent(type, component)`:
```ts
registerComponent('category_pills', CategoryPillsSection)
registerComponent('menu_grid', MenuGridSection)
```

All components are registered in `src/components/register.ts` via `registerLibraryComponents()`.

## Component Contract

Components receive merged props:
```ts
type ComponentProps = {
  // From node.props
  [key: string]: unknown
  
  // From node.actions (merged by RegistryRenderer)
  actions?: Record<string, ActionDef>
  
  // From extraProps (e.g., dispatchAction)
  dispatchAction?: RuntimeActionHandler
}
```

Components access `dispatchAction` through `useRuntimeContext()`:
```tsx
const { dispatchAction } = useRuntimeContext()
const act = (a: ActionDef) => dispatchAction(a)
```

## Component Patterns

### Section Components
Self-contained UI sections. Receive data via `node.props` and actions via `node.actions`. Examples:
- `CategoryPillsSection` — category filter pills
- `MenuGridSection` — product grid
- `OrderHistorySection` — order list
- `InfoListSection` — contact info
- `ReportActionSection` — report form
- `EmptyStateSection` — empty state display
- `NotificationListSection` — notification items

### Interactive Components
Components that trigger actions on user interaction:
- `PrimaryButton` — dispatches `actions.default` on press
- `DynamicCard` — dispatches `actions.addItem` with item payload on add button press
- Notification items — dispatch `actions.tap` / `actions.dismiss` on press

## Brand Context

Components use `useBrand()` to access theme colors and styling:
```tsx
const brand = useBrand()
// brand.secondaryColor, brand.textColor, brand.cardColor, etc.
```

## Error Handling

Unknown component types render `UnsupportedComponent` which displays a fallback UI with the component type name for debugging.
