# Responsive Standard

## Breakpoints

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small desktops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

## Responsive Patterns

### Mobile First

All designs are mobile-first. Layouts expand as screen size increases.

### Dashboards

| Breakpoint | Layout |
|------------|--------|
| < 1024px | Collapsible sidebar, stacked cards |
| >= 1024px | Fixed sidebar, multi-column grids |

### Tables

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Horizontal scroll or card list |
| >= 768px | Full table |

### Forms

| Breakpoint | Layout |
|------------|--------|
| < 768px | Single column |
| >= 768px | Two columns where appropriate |

### Website

| Breakpoint | Layout |
|------------|--------|
| < 768px | Stacked sections, hamburger menu |
| >= 768px | Multi-column, top nav |

## Touch Targets

- Minimum touch target size: 44x44px
- Spacing between touch targets: 8px minimum

## Typography Scaling

| Breakpoint | Body | H1 | H2 |
|------------|------|----|----|
| Base | 16px | 32px | 24px |
| lg | 16px | 40px | 32px |

## Image Handling

- Images use responsive srcset where possible.
- Aspect ratios are preserved.
- Lazy loading is used for below-the-fold images.

## Testing

- All screens are verified at sm, md, lg, and xl breakpoints.
- Mobile screens are tested on target device sizes.
