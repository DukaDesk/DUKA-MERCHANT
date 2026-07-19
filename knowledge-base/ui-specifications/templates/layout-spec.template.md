# Layout Specification Template

## Layout Name

Name of the layout.

## Purpose

What this layout is used for.

## Structure

```text
[Header]
    ↓
[Sidebar] [Main Content]
    ↓
[Footer]
```

## Regions

| Region | Content | Behavior |
|--------|---------|----------|
| Header | Logo, user menu, notifications | Fixed top |
| Sidebar | Navigation | Collapsible on mobile |
| Main Content | Screen content | Scrollable |
| Footer | Links, version | Static |

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| < 1024px | Sidebar collapses to drawer |
| >= 1024px | Sidebar visible |

## Tokens Used

- color-surface
- shadow-sm
- space-4

## Usage Rules

- Which applications use this layout
- When to use a different layout

## Example Screens

- [APP-MOD-001](../applications/.../APP-MOD-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial layout spec |
