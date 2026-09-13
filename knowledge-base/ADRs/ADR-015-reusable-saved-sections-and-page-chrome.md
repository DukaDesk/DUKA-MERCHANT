# ADR-015: Reusable Saved Sections and Per-Page Theme Chrome

| Field | Value |
|-------|-------|
| ADR-ID | ADR-015 |
| Title | Reusable Saved Sections and Per-Page Theme Chrome |
| Status | Accepted |
| Date | 2026-08-08 |
| Author | Builder Team |
| Supersedes | — |
| Superseded By | — |

## Context

The `SectionEditor` (ADR-013) is fully PageFly-inspired but stops short of PageFly's two most impactful reusable-structure features:

1. **Saved sections** — a reusable library of sections that can be inserted into any screen, referenced from a single source of truth (PageFly: sections are draft/published and insert instances propagate edits to every page). Today `SECTION_PRESETS` (`SectionEditor.jsx:20-27`) is hardcoded and `store.duplicateSection` only clones within a single screen. There is no cross-screen/cross-project reuse, no rename, no library UI.
2. **Per-page theme chrome** — PageFly can keep / hide / replace the theme header & footer per page. Duka's `data.shared.header/footer` (`DesignStore.js:37-40`) are global and always rendered on every screen (`SectionRenderer` and preview render them unconditionally). A screen cannot opt out or swap its own header/footer.

Supporting context from the gap analysis (`GAP-ANALYSIS.md`): these two features are HIGH priorities behind per-device editing; they are cheap to land on the current flat-sections model and unlock page templates and multi-screen consistency.

## Decision

Introduce a **Reusable Section Library** (`savedSections`) as a first-class part of the design document, and make each screen explicitly resolve its **header/footer chrome**. Sections can be *linked* to the library (single source of truth, PageFly-style sync) or *detached* into an independent copy.

### 1. Data model

Extend the design JSON (produced by `getDesignJSON`, `DesignStore.js:451`) with a top-level collection:

```jsonc
// data.savedSections — global library, schema-versioned, migrations default []
{
  "id": "sec_lib_<nanoid>",          // stable identity
  "name": "Promo Banner",            // shown in library + auto thumbnail
  "type": "custom", "backgroundColor": "#FCF8FA",
  "components": [ /* enrichComponents'd, like bodySections */ ],
  "published": true,                 // PageFly draft/published gate
  "updatedAt": 1754500000000
}
```

Body sections and chrome may reference the library:

```jsonc
// data.screens.<id>.bodySections[]
{
  "id": "sec_...",
  "name": "Promo Banner",
  "kind": "saved", "libraryId": "sec_lib_<nanoid>",   // linked
  "overrides": { "backgroundColor": "#123456" }        // optional local tweak
}
// ... else a normal inline section (no kind/libraryId)
```

Screen-level chrome (mirrors page-vs-theme):

```jsonc
// data.screens.<id>
{ "chrome": {
    "header": { "mode": "inherit" },                    // inherit | hide | custom
    "footer": { "mode": "inherit" },
    // "custom": { "mode": "custom", "sectionId": "sec_..." }
} }
```

`data.shared.header/footer` remains the "theme" source of truth for `inherit`.

### 2. Resolution semantics (render + edits)

- **Linked section** (`kind: "saved"`): resolved at render + edit-time from the library via a single `findSavedSection(id)` helper in `DesignStore` plus a `resolveSection(section)` that returns the merged content. Edits update the library item → synchronized to every instance (PageFly behavior). The body row renders a `link` chip and a **Detach** action that snapshots the resolved content into an inline section (drops the link; subsequent edits are local).
- **Unlink a source** (`savedSections` item deleted) → all linked sections are converted to plain inline copies in the same mutation (never render a dangling ref).
- **Chrome**: `resolveChrome(screenId)` resolves `mode: inherit → data.shared.header/footer`, `hide → null`, `custom → referenced section`; `SectionRenderer`, the preview and `allSections` all route through it instead of reading `data.shared` directly.

### 3. Editor surfaces

- **Save as Saved Section** — new floating-toolbar action on body sections (icon: bookmark). Opens a name modal; adds to `savedSections` (published=true for v1) and optionally converts the current section to a linked copy.
- **Insert from Library** — "Add Section" picker becomes tabbed: **Presets** | **Saved**. Saved lists items (name, thumbnail, last-updated) with a "Use" action that inserts a linked bodySection; published-only shown (draft items show a disabled badge + "Publish" affordance).
- **Library management** — new collapsible "Library" block at the bottom of the left `SectionPanel`: list, copy, rename, delete, publish/draft toggle.
- **Chrome editor** — per-screen controls in the ScreenSwitcher page editor and an extra collapsible "Page Chrome" block when no section is selected in `PropertiesPanel` (show/hide header and footer; custom reuses any existing section).
- **Keyboard/undo** — everything routes through `updateData`/`pushUndo` so Ctrl+Z works as today.

### 4. Persistence & templates

- `savedSections` persist through the existing `setData` pipelines: localStorage + `saveDesignData` (the API save path already serializes the whole `data` doc). No new endpoint required for v1.
- `loadTemplate`/template blueprint loaders: keep `savedSections` when present; defaults to empty. Legacy saved designs (no `savedSections`/no `chrome`) migrate gracefully.

### 5. Explicitly out of scope (v1)

- Per-device styling (separate gap; follow-up ADR).
- Cross-workspace/synced global assets (multi-tenant library) — `savedLibrary` stays inside one design doc for v1.
- AI section generation (defer to AI platform).

## Consequences

### Positive

- Header/footer consistency and page re-use become structural — fixes real multi-screen duplication today.
- Library matches PageFly's mental model; later cross-tenant/global section distribution is a data-hosting change, not an editor rewrite.
- Linked semantics give global-sync without a sync engine; detached copy gives escape hatch.
- No breaking changes to published JSON shape (new optional fields).

### Negative

- Slightly larger design doc (library + links) and an extra store-helper surface.
- Linked-section editing must route through library (`resolveSection`) in every mutator touchpoint or stale refs appear — enforce a single write path.
- Draft/publish gating adds minor UX; v1 keeps simple "everything published".

## Alternatives considered

- **Insert-always-copy** (simplest): no library links, library is a handy clone factory. Rejected: doesn't give the "change your header"/"hero once, update all" behavior that defines a "sections" system.
- **Full per-tenant global library:** correct long-run, but mixes the design doc with tenant semantics; pushed to marketplace/theme work (`theme-builder.md`, `template-marketplace.md`).

## Compliance

Verify via:
- Existing editor still resolves effective chrome via a single `resolveChrome(screen)` helper; all renderers (`SectionRenderer`, preview, `allSections`) now route through it.
- A create→save→insert→re-edit sequence updates every instance; delete-library converts links to copies without renders or crashes.
- `getDesignJSON`, template import, and loading legacy sandbox data complete; unknowns default.

## Affected Documents

| Document | Impact |
|----------|--------|
| `knowledge-base/builder/PAGEFLY-RESEARCH-NOTES.md` | Reference for model, quota bits |
| `knowledge-base/builder/GAP-ANALYSIS.md` | Roadmap includes this ADR |
| `knowledge-base/ADRs/ADR-013-builder-template-gallery-and-section-editor.md` | Context; refines the section model |
| `dukaDesk/src/components/canvas-editor/DesignStore.js` | New `savedSections`/`chrome` + `findSavedSection`, `resolveSection`, `resolveChrome` helpers |
| `dukaDesk/src/components/section-editor/` | SectionPanel (library), SectionRenderer (linked chip + chrome), PropertiesPanel (chrome + save), ScreenSwitcher (per-screen chrome) |
| `dukaDesk/src/components/…` (template/publishing loaders) | graceful migration |

## Notes

The page chrome lives on `data.screens.<screenId>`. When a screen is duplicated, the copy inherits `chrome` and unlinked bodySections; linked refs stay pointing at the same library items (intended). Keep one authoritative place for linking-helper mutators in `DesignStore` to avoid dual-source-of-truth bugs.