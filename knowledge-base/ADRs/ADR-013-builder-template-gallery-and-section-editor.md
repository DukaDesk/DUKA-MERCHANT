# ADR-013: Builder Template Gallery and Section Editor Redesign

**Status:** ✅ Accepted  
**Date:** 2026-07-17  
**Author:** Builder Team

## Context

The original builder wizard had a two-step Category → Template selection flow with only 5 template blueprints shared across 7 business categories. This meant different categories (e.g., Restaurant vs Food Vendor) loaded the same template. The Section Editor lacked inline editing capabilities and had no design system.

## Decision

### Template Gallery

Replace the Category + Template steps with a single unified Template Gallery as step 1 of the wizard.

- **21 unique templates** (3 per category × 7 categories)
- Each template has `primaryColor`, `secondaryColor`, `category` fields for card rendering
- **Search bar** filters by name, tags, or category
- **Category filter chips** (All + 7 categories)
- **Color-block cards** — gradient (primary → secondary) + 2-letter initials (no emojis)
- **"Create your own" card** always visible (dashed border, starts with blank `Custom` template)
- Step flow: `Gallery → Branding → Business Info → Integrations` (4 steps, down from 5)

### Section Editor Redesign

PageFly-inspired visual editing with six files rewritten:

| File | Purpose |
|------|---------|
| `editorTheme.js` | Design token system (colors, spacing, shadows, border radii, button/input presets, 4 header variant definitions) |
| `SectionEditor.jsx` | Main orchestrator — top bar, preview mode toggle (desktop/tablet/mobile), section picker modal, theme imports |
| `SectionPanel.jsx` | Left sidebar — drag handles, expand/collapse, SVG arrow reorder buttons, inline add section, empty state guidance |
| `PropertiesPanel.jsx` | Right sidebar — header variant selector, ColorInput with focus ring, iconBtn group for reorder, theme token references |
| `SectionRenderer.jsx` | Canvas — inline double-click text editing (hero/menu/button components), hover-to-upload images, background color swatches, floating toolbars (duplicate/delete) for sections and components |
| `ScreenSwitcher.jsx` | Page tabs with hover fill animation, edit popover with SVG icon buttons |

### Template Expansion

Template blueprints grew from 5 to 22 entries:
- 21 templates (3 per category) + 1 Custom blank canvas
- Each template has unique: appName, primaryColor, secondaryColor, navigation tabs, header/footer content, 3 screens (home + 2 category-specific)
- Templates include restaurant, ecommerce, food vendor, grocery, church, school, and booking domains

### CanvasEditor Data Flow

Removed the `CATEGORY_TO_TEMPLATE` mapping that mapped 7 categories to 5 shared template keys. Now `templateDefaults[data.template]` looks up the template directly by its unique name.

## Consequences

- Users see the right template for their business category immediately
- All 21 templates are discoverable via search without needing to pick a category first
- Section Editor now supports inline editing without property panel navigation
- Design consistency through `editorTheme.js` tokens
- "Create your own" bypasses remaining wizard steps for power users
- Build output increased marginally (21 template blueprints in bundle)

## Status

Accepted. All changes merged to `main`.
