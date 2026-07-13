---
name: Professional Trust System
colors:
  surface: '#fcf8fa'
  surface-dim: '#ddd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f4'
  surface-container: '#f1edef'
  surface-container-high: '#ebe7e9'
  surface-container-highest: '#e5e1e3'
  on-surface: '#1c1b1d'
  on-surface-variant: '#47464c'
  inverse-surface: '#313032'
  inverse-on-surface: '#f4f0f2'
  outline: '#78767d'
  outline-variant: '#c8c5cd'
  surface-tint: '#5d5c74'
  primary: '#00000b'
  on-primary: '#ffffff'
  primary-container: '#1a1a2e'
  on-primary-container: '#83829b'
  inverse-primary: '#c6c4df'
  secondary: '#865300'
  on-secondary: '#ffffff'
  secondary-container: '#ffa930'
  on-secondary-container: '#6b4200'
  tertiary: '#000002'
  on-tertiary: '#ffffff'
  tertiary-container: '#151c27'
  on-tertiary-container: '#7d8493'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e0fc'
  primary-fixed-dim: '#c6c4df'
  on-primary-fixed: '#1a1a2e'
  on-primary-fixed-variant: '#45455b'
  secondary-fixed: '#ffddb9'
  secondary-fixed-dim: '#ffb961'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#663e00'
  tertiary-fixed: '#dce2f3'
  tertiary-fixed-dim: '#c0c7d6'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#fcf8fa'
  on-background: '#1c1b1d'
  surface-variant: '#e5e1e3'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  cta:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  headline-xl-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 16px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for a high-fidelity mobile experience that balances corporate reliability with modern, forward-thinking aesthetics. The brand personality is authoritative yet accessible, focusing on clarity, precision, and trust.

The visual direction leans into **Modern Corporate** with a "Soft-Tech" edge. It utilizes a deep navy foundation to establish gravity, punctuated by a vibrant amber accent that guides user intent and highlights key actions. The overall aesthetic is clean and spacious, emphasizing high-quality typography and subtle depth to create an environment that feels secure and premium.

## Colors

The palette is anchored by **Deep Navy (#1A1A2E)**, used for primary branding and high-level structural elements to evoke stability. The **Amber (#F4A026)** accent is used sparingly but purposefully for interactive elements, notifications, and "hero" moments to create a high-contrast visual hierarchy.

- **Primary & Text:** Use Deep Navy for headings and primary body text to maintain a cohesive, high-contrast reading experience.
- **Secondary/Accent:** Amber is reserved for primary CTAs and critical status indicators.
- **Surface & Background:** A subtle Off-white background separates the canvas from pure white Surface cards, providing soft layered depth without relying on heavy lines.
- **Feedback:** Success, Error, and Warning colors follow standard semantic patterns but are tuned for high legibility against white surfaces.

## Typography

The typographic system utilizes a dual-font strategy. **Sora** provides a distinctive, geometric personality for headlines and interactive triggers, giving the product a modern, "tech-forward" voice. **Inter** handles all long-form content and UI metadata to ensure maximum readability and a neutral, professional tone.

- **Headlines:** Use Sora Bold for large displays and SemiBold for section headers.
- **Numbers:** Data-heavy displays and currency should always use Sora to capitalize on its unique geometric clarity.
- **Body:** Inter Regular is the workhorse for all descriptive text. Use Inter Medium for emphasis within body blocks.
- **CTAs:** Primary buttons use Sora SemiBold for a clear, impactful "click-me" signal.

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for mobile-first delivery. The spacing rhythm is based on a **4px baseline grid**, ensuring all elements align with mathematical precision.

- **Mobile Layout:** Use a 4-column grid with 20px side margins and 16px gutters. 
- **Vertical Rhythm:** Use 16px (md) for standard element spacing and 24px (lg) to separate distinct content blocks.
- **Touch Targets:** Minimum touch target size is 44x44px, regardless of the visual size of the icon or label.

## Elevation & Depth

Depth is conveyed through a combination of **Tonal Layering** and **Ambient Shadows**. This creates a clear hierarchy where interactive elements appear "raised" above the structural background.

- **Background:** #F7F8FA (Base level).
- **Surface (Cards):** Pure white (#FFFFFF) with a soft ambient shadow: `0px 2px 12px rgba(0,0,0,0.08)`. Shadows should be neutral and diffused, never harsh.
- **Overlays (Modals/Sheets):** Use a 40% Deep Navy backdrop blur to maintain brand continuity while focusing user attention.
- **Interactions:** On press, cards should slightly decrease in shadow spread to simulate a physical "push" effect.

## Shapes

The shape language is "Variably Rounded," assigning specific radii to elements based on their size and function to create a rhythmic visual flow.

- **Cards & Containers:** 12px (`rounded-lg`) provides a friendly, modern container for content.
- **Inputs & Fields:** 8px (`rounded-md`) offers a slightly sharper, more functional feel for data entry.
- **Primary Buttons:** 24px-28px (Fully Rounded/Squircle) to distinguish actions from content containers.
- **Pills & Badges:** 50% (Pill-shaped) for status indicators and chips.

## Components

### Buttons
- **Primary:** Deep Navy background with White text (Sora SemiBold). Radius: 24px.
- **Secondary/Action:** Amber background with Deep Navy text. Used for high-priority conversion points.
- **Ghost:** Transparent background with Deep Navy border (1px).

### Input Fields
- **Default:** 8px radius, White surface, 1px border (#E5E7EB).
- **Focus:** 2px solid Amber (#F4A026) border. This is the critical "active" state identifier.
- **Labels:** Inter Medium, 14px, Text Secondary (#6B7280).

### Cards
- White surface, 12px radius, soft ambient shadow. 
- Internal padding should default to 16px (md).

### Chips & Badges
- Pill-shaped (50% radius). 
- Use semantic colors (Success/Error) with 10% opacity backgrounds and 100% opacity text for high-end "tonal" styling.

### Lists
- Clean dividers (1px, #E5E7EB) with 16px horizontal padding. 
- Use chevron icons (Text Secondary) to indicate navigability.