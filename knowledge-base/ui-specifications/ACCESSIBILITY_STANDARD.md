# Accessibility Standard

## Target Compliance

All DUKADESK applications aim for **WCAG 2.1 Level AA** compliance.

## Requirements

### Color

- Color alone is never the sole means of conveying information.
- Text contrast ratios meet WCAG AA:
  - Normal text: 4.5:1 minimum
  - Large text: 3:1 minimum
- Focus indicators are visible.

### Keyboard

- All functionality is available via keyboard.
- Focus order is logical.
- No keyboard traps.
- Skip links provided for repetitive content.

### Screen Readers

- All images have meaningful alt text.
- Form inputs have associated labels.
- Interactive elements have descriptive names.
- Live regions announce dynamic updates.

### Motion

- Animations respect `prefers-reduced-motion`.
- No auto-playing content without user control.

### Touch

- Touch targets are at least 44x44px on mobile.
- Sufficient spacing between interactive elements.

## ARIA Patterns

| Component | ARIA Pattern |
|-----------|--------------|
| Modal | dialog |
| Sidebar | navigation |
| Tabs | tablist, tab, tabpanel |
| Accordion | accordion |
| Dropdown | listbox |
| Toast | status / alert |

## Accessibility Checklist

For every screen:

- [ ] Heading hierarchy is logical.
- [ ] All images have alt text.
- [ ] Form labels are associated.
- [ ] Focus is visible and logical.
- [ ] Color contrast meets AA.
- [ ] Screen reader order matches visual order.

## Testing

- Automated a11y scans in CI.
- Manual keyboard navigation testing.
- Screen reader testing for critical flows.
