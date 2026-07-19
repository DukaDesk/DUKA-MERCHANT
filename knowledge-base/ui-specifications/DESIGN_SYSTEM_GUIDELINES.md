# Design System Guidelines

## Design Tokens

Design tokens are the single source of truth for visual values.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| color-primary-500 | #2563EB | Primary actions, links |
| color-primary-600 | #1D4ED8 | Primary hover |
| color-secondary-500 | #64748B | Secondary actions |
| color-success-500 | #10B981 | Success states |
| color-warning-500 | #F59E0B | Warning states |
| color-error-500 | #EF4444 | Error states |
| color-neutral-900 | #111827 | Primary text |
| color-neutral-500 | #6B7280 | Secondary text |
| color-neutral-100 | #F3F4F6 | Backgrounds |
| color-surface | #FFFFFF | Cards, inputs |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| font-family-base | Inter, system-ui | Body text |
| font-family-heading | Inter, system-ui | Headings |
| font-size-xs | 12px | Captions |
| font-size-sm | 14px | Secondary text |
| font-size-base | 16px | Body text |
| font-size-lg | 18px | Lead text |
| font-size-xl | 24px | Section headings |
| font-size-2xl | 32px | Page headings |

### Spacing

| Token | Value |
|-------|-------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-6 | 24px |
| space-8 | 32px |
| space-12 | 48px |
| space-16 | 64px |

### Radius

| Token | Value |
|-------|-------|
| radius-sm | 4px |
| radius-md | 8px |
| radius-lg | 12px |
| radius-full | 9999px |

### Elevation

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Cards |
| shadow-md | 0 4px 6px rgba(0,0,0,0.1) | Dropdowns |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Modals |

### Icons

- Icon set: Lucide or equivalent
- Icon size default: 20px
- Icon color inherits text color unless specified

### Motion

| Token | Value |
|-------|-------|
| duration-fast | 150ms |
| duration-base | 250ms |
| duration-slow | 350ms |
| easing-default | ease-in-out |

### Grid

- Base grid: 8px
- Dashboard max-width: 1440px
- Content max-width: 640px (forms), 1024px (tables)

### Breakpoints

| Token | Value |
|-------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

## Token Usage Rules

- Always use tokens. Never hardcode values.
- Tokens support light mode by default. Dark mode tokens are defined separately.
- Component specs reference tokens, not raw values.
