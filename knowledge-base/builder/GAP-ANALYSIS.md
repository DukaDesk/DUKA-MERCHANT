# Gap Analysis — Duka Section Editor vs PageFly

**Last Updated:** 2026-08-08

Compares the current Duka section-editor implementation against PageFly's documented builder mechanics (see `PAGEFLY-RESEARCH-NOTES.md`). The goal is a prioritized, code-grounded upgrade roadmap.

---

## 1. Headline verdict

The Duka section editor already ships the "PageFly-gen2 lite" core:

- Three-pane editor (left outline, center canvas, right inspector) — `SectionEditor.jsx:401-441`
- Inline editing, floating toolbars, drag-drop sections, background swatches — `SectionRenderer.jsx`
- Shared header/footer that behave like PageFly *"global" sections* — `DesignStore.js:33-45` + `ScreenSwitcher`
- Design token theme — `editorTheme.js`
- Undo/redo, autosave, release history, template load — `SectionEditor.jsx:120-177`, `DesignStore.js`

The high‑priority gaps below are ordered by impact: **(1) per-device editing, (2) reusable/saved sections, (3) style-inspector tab structure, (4) page-vs-theme chrome control, (5) data-driven/universal elements**, with incremental smaller wins following.

---

## 2. Capability-by-capability table

| # | Capability | PageFly | Duka today (file:line) | Gap | Priority |
|---|------------|---------|------------------------|-----|----------|
| 1 | **Per-device editing** | Repeat mode; per-device style overrides + hide-on-device | Preview-only; canvas fixed 390px phone frame; same style for all devices (`SectionEditor.jsx` PREVIEW_SIZES; `SectionRenderer.jsx:166-174`) | HIGH — responsive pages impossible to author | HIGH |
| 2 | **Saved sections & library** | Save→publish→reuse library, sync source→instances; plan quotas | `SECTION_PRESETS` hardcoded; duplicate only in-canvas (`store.duplicateSection`) | HIGH | HIGH |
| 3 | **Element inspector tabs++** | General vs Styling tabs; Styling group text (spacing/typography/bg/border/effects/size/layout) | `PropertiesPanel.jsx` – one flat list of `propFields` per component; only colors/name/bg + a handful of fields | MEDIUM | MEDIUM |
| 4 | **Page-vs-theme chrome** | Keep / hide / replace the theme header & footer per page | `data.shared.header/footer` always rendered on every screen (`SectionRenderer.jsx:23-25,101-111`; preview `SectionEditor.jsx:245-255`); no hide/replace per screen | MEDIUM | MEDIUM |
| 5 | **Universal/data-driven elements** | static↔dynamic conversion (type dropdown), condition sets, element-wide visibility per condition | `registerComponentType` static types; `visible` per component only (`DesignStore` / `SectionRenderer.jsx:394`) | MEDIUM | LOW/MED |
| 6 | **Hover/conditional visibility** | Hide on desktop/laptop/tablet/mobile; dynamic conditions | one `visible` boolean per component (`DesignStore.js`) | MEDIUM | LOW |
| 7 | **Nested layout (Flex/row-column)** | Flex block groups; rows/columns; equal height | flat section list; no nested layout layer | MEDIUM | LOW |
| 8 | **Sticky sections** | sticky top + elevation | none | LOW | LOW |
| 9 | **Component library w/ thumbnails** | auto-thumb, name, category | `SECTION_ICONS` emoji map only | LOW | LOW |
| 10 | **AI section generator** | generator + prompt builder | none in section editor | LOW | LOW/MED |
| 11 | **Full-width / fixed-width section modes** | content mode decor | `backgroundColor` per section; no width mode (canvas is column-fixed) | LOW | LOW |

## 3. Deep dives (evidence for the top gaps)

### 3.1 Per-device editing — the biggest hole

- PageFly: every style property can be scoped per device (All, Laptop, Tablet, Mobile) — `General > Visibility → Hide on Desktop/Laptop/Tablet/Mobile`; flex reverse order; per-device rows-per-line.
- Duka: `PREVIEW_SIZES` gives widths but is preview-only; the *editable* canvas at `SectionRenderer.jsx:166-174` is always mobile width. `PropertiesPanel.jsx` edits `data` but there's no `device` dimension in the model, so a desktop edit is impossible—there is no desktop editing view.
- Data model implication: components/layout need a device-scoped style surface (e.g., `styles: {mobile:{}, tablet:{}, desktop:{}}` and `visibleOn`/`hiddenOn`), and the store must route updates to the active device.

### 3.2 Saved Sections / library

- No store concept: `DesignStore` has `shared.header/footer` and per-screen `bodySections`; nothing is globally cacheable across screens.
- PageFly resolution: dashboard `Sections` list + in-canvas `Save section` flow; **draft vs published** state; **sync source updates to all instances**; plan quotas.
- Min feature set for Duka: save a body section to a `data.savedSections[]` collection, expose it in the `+` section picker modal, insert as a copy (or linked with a `ref`), rename/thumbnail. Persist via the same `saveDesignData`/localStorage path already used in `DesignStore`.

### 3.3 Inspector tabs

- `PropertiesPanel.jsx` branches on `selectedSectionId` vs `selectedComponentId`; the component form is literally the `propFields`/`defaultProps` declared in `componentTypes/index.jsx`. There's no styling control surface — the `editorTheme` tokens aren't exposed in the inspector.
- PageFly inspector: General (content/action/visibility/animation) + Styling (typography, spacing, border, effects, size, layout) with a device-icon on per-device settings.
- To close: split the panel into tabs; introduce a per-type styling schema (font, sizing, margin/padding, border-radius/shadow, background) rather than mixing it into `propFields`.

### 3.4 Page-vs-theme chrome (header/footer)

- Current: header/footer stored once in `data.shared` — global by design. That's actually closer to "theme-level" UI. What's missing is the *per-page* dimension:
    - keep (inherit) / hide / replace with a page-specific section for any given screen.
- Data seam: `screen` objects (`getDefaultData` in `DesignStore.js`) currently only have `name`, `backgroundColor`, `bodySections`. Decent place for `chrome: { header: { mode: 'inherit'|'hide'|'custom', sectionRef } , footer: {...} }`.
- PageFly's `page-vs-theme` = "enable/disable theme header & footer" per page + replace with a page section. Same semantics, minus the theme concept (Duka's theme = `data.shared`).

### 3.5 Universal / conditional elements

- Component types are dumb renderers (`componentTypes/index.jsx`). No trigger panel.
- PageFly "Universal Elements" allow converting a static element to dynamic data (e.g., Heading → Product Title) and keep same display. Conditionals are currently per-device; content "conditions" are limited to theme-data in PageFly as well (stock threshold, etc.).

## 4. What Duka already does well (don't regress)

- Inline double-click editing + hover-to-upload + floating duplicate/delete toolbars (`SectionRenderer.jsx`)
- Handy keyboard: Undo/Redo/Save/Preview/Delete (`SectionEditor` keydown handler)
- Screen switcher with near-copy/delete screen flows + nav-tabs (`ScreenSwitcher.jsx`)
- Draft on server + release rolls history (`PublishingPipeline`)
- Token system `editorTheme.js` (consistent with the design-token pattern going forward)

## 5. Recommendation order

1. **Per-device editing** (proves responsive capability = the differentiator).
2. **Saved/reusable sections + library** (ADR-015).
3. **Inspector restructure: General/Styling tabs** (make #1 practical).
4. **Per-page chrome overrides** (header/footer inherit/hide/custom).
5. **Universal/data-driven elements** (defer to data-platform stories).

See `../ADRs/ADR-015-reusable-saved-sections-and-page-chrome.md` for the concrete plan covering #2 and #4.

## 6. Affected files

- `dukaDesk/src/components/section-editor/` — SectionEditor, SectionPanel, PropertiesPanel, SectionRenderer, ScreenSwitcher, editorTheme
- `dukaDesk/src/components/canvas-editor/DesignStore.js`
- `dukaDesk/src/components/canvas-editor/componentTypes/index.jsx`
- `dukaDesk/src/services/staticTemplates.js` (template→canvas loader) and `PublishingPipeline.js` (save path)