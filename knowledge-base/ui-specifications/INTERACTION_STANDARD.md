# Interaction Standard

## Interaction Principles

1. **Immediate Feedback**: Every action shows a response within 100ms.
2. **Predictable Behavior**: Similar interactions produce similar results.
3. **Minimal Friction**: Reduce steps required for common tasks.
4. **Clear Affordances**: Interactive elements look interactive.

## Button Interactions

| State | Visual Change |
|-------|---------------|
| Default | Solid fill |
| Hover | Darken 10% |
| Active | Darken 20%, inset shadow |
| Disabled | Reduce opacity, no pointer |
| Loading | Spinner, disabled text |

## Input Interactions

| State | Visual Change |
|-------|---------------|
| Default | Neutral border |
| Focus | Primary border, subtle shadow |
| Error | Error border, error message |
| Disabled | Reduced opacity |
| Filled | Label floats or remains visible |

## Gesture Interactions (Mobile)

| Gesture | Action |
|---------|--------|
| Tap | Select / Activate |
| Long Press | Context menu |
| Swipe Left | Delete / Archive |
| Pull Down | Refresh |
| Pinch | Zoom (where applicable) |

## Loading Interactions

- Buttons show spinner and disabled state during submission.
- Screens show skeleton loaders for initial load.
- Pull-to-refresh is supported on mobile lists.
- Infinite scroll shows loading indicator at bottom.

## Confirmation Patterns

| Action | Confirmation |
|--------|--------------|
| Save form | Inline success toast |
| Delete | Dialog confirmation |
| Cancel order | Dialog confirmation |
| Publish app | Dialog confirmation |

## Keyboard Support

- All interactive elements are keyboard accessible.
- Enter activates primary action in forms.
- Escape closes dialogs and drawers.
- Tab order follows visual order.
