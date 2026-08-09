# Changelog

All notable changes to the builder repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Reusable Saved Sections library (ADR-015)** — save a body section to a global `savedSections` collection; insert it on any screen as a *linked* section (single source of truth — component/color/name edits write through to the library and sync every instance, PageFly-style) or detached copy.
- **Library management** — new collapsible "Section Library" block in `SectionPanel` (rename, delete, draft/published toggle) and a "Saved (N)" tab in the Add Section picker alongside presets.
- **Save/Detach actions** — bookmark icon (Save to library) and chain icon (Detach) floating-toolbar actions on the canvas, and in `PropertiesPanel`.
- **Page Chrome per screen** — `resolveChrome`/`setScreenChrome` + `chrome` config on each screen (`inherit | hide`); header/footer resolution routes through it in `SectionRenderer`, the preview, and `allSections`. New "Page Chrome" block in the `PropertiesPanel` branding view toggles header/footer per screen.
- **Write-through mutation safety** — `findSection` resolves linked section ids to their library item for all component/section mutators; deleting a library item converts all links to inline copies (no dangling refs).
- **PageFly-style Element tree panel** — the left "Elements" panel was rebuilt as a Page Content outline: search-as-you-type at the top, expandable section groups with grab-handle drag-reorder (`moveBodySectionToIndex`), colored section icon chips, per-section eye show/hide (`setSectionVisible`) and ⋯ three-dot menu (Save to library / Detach / Rename / Duplicate / Move / Delete), nested element rows with type chips and eye toggles, and shared Header/Footer chrome rows whose eye toggles per-screen chrome. Hidden sections render dimmed on canvas (opacity 0.4).
- **Sub-element hierarchy** — components that describe their parts via a new `subElements[]` registry field (hero_banner → Badge / Heading / Tagline / Background Image / Background Color, menu_item, text_block, image_block, button, divider, category_pills, menu_grid, header_bar) now expand into clickable leaves in the tree. Clicking a leaf focuses the matching field in PropertiesPanel (amber highlight + Remove button), a tree-side trash action clears the value via the new `DesignStore.clearSubProp`, and renderers hide removed sub-elements (hero badge/title/subtitle/backgroundImage are conditional). Optional text sub-props (hero badge, menu_item desc/emoji) disappear from the canvas when cleared instead of showing fallback text.

### Changed

### Deprecated

### Removed

### Fixed

### Security
