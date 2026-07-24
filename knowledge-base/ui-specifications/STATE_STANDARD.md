# State Standard

## UI State Definitions

Every interactive element and screen must explicitly handle these states:

### Default

The initial state when the element or screen loads.

### Loading

Data is being fetched or an action is in progress.

### Empty

No data exists yet or the result set is empty.

### Error

Something went wrong.

### Success

An action completed successfully.

### Disabled

The element is not interactive.

### Focused / Active / Hover

User interaction states for interactive elements.

## Screen States

| State | Description | Pattern |
|-------|-------------|---------|
| Initial | Screen first loads | Skeleton or spinner |
| Loading | Fetching data | Skeleton |
| Loaded | Data displayed | Content |
| Empty | No data | Empty state illustration + CTA |
| Error | Failed to load | Error message + retry |
| Refreshing | Pull-to-refresh | Spinner overlay |

## Component States

### Button

```text
Default → Hover → Active → Loading → Disabled
```

### Input

```text
Default → Focus → Filled → Error → Disabled
```

### Card

```text
Default → Hover → Selected → Loading → Error
```

## State Visualization

- Loading states use skeletons or spinners.
- Empty states explain why and what to do next.
- Error states are specific and include retry where possible.
- Success states use toast or inline confirmation.

## State Documentation

Every screen spec must document:

- Loading state
- Empty state
- Error state
- Success state
