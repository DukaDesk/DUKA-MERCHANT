# PageFly Research Notes — Mechanics the Duka Section Editor Can Adopt

**Last Updated:** 2026-08-08

Supplier of Duka's next section-editor iteration (see `../ADRs/ADR-013-builder-template-gallery-and-section-editor.md` and `GAP-ANALYSIS.md`). Everything below is a factual capture of PageFly's documented behavior, kept precise so ADR-015 can reference implementable details.

Sources:
- https://help.pagefly.io/page-structure-and-elements/editor/user-interface/how-to-work-with-pagefly-editor
- https://help.pagefly.io/page-structure-and-elements/editor/user-interface/elements-general-settings
- https://help.pagefly.io/page-structure-and-elements/editor/user-interface/elements-style-settings
- https://help.pagefly.io/pages-and-sections-creation/sections/saved-section
- https://help.pagefly.io/page-structure-and-elements/pagefly-elements/containers/layout
- https://help.pagefly.io/page-structure-and-elements/editor/user-interface/make-my-page-mobile-responsive
- https://help.pagefly.io/pages-and-sections-creation/sections/how-to-create-ai-section-in-pagefly-ai-sales-page

---

## 1. Editor skeleton

- Three-pane layout: left = element/section library + Page content outline; center = canvas; right = Element Inspector.
- Inspector has two tabs: **General** (content, actions, visibility, attributes, animation) and **Styling** (spacing, typography, background, border/effects, size, layout).
- Breadcrumb at top shows the navigation chain of the currently-selected element (e.g. Page > Section > Row > Column > Heading).
- Two editor generations: **Legacy (row–column)** and **Gen 2 (flex-based)**. Gen 2 replaced Row/Column with `Blank Section` + `Flex Block`; elements can be grouped into a flex block (Cmd/Ctrl+click). Duka's current canvas is closest to Gen 2: a flat list of sections, no row-class layer.

## 2. Hierarchy model (Gen 2)

```
Page
└── Section (blank section)          — fill/hug/fixed width & height, full-width toggle, sticky
    └── Flex Block                   — direction, reverse order, h-gap, v-gap
        └── Element (Heading, Text, Button, Image, List, …)
```

- Section-level: `Content width` = Max width (default, wraps content) vs Fill container; `Height` = Fill container / Hug content / Fixed.
- Sticky section: `Enable sticky top` + `Top offset` + elevation. (Candidate for Duka "sticky header bar".)
- Grouping: multiple elements can be wrapped into a Flex Block.

## 3. Responsive behavior (device switcher first)

- **Device views:** All devices (≥1200px), Laptop (1025–1199px), Tablet (768–1024px), Mobile (≤767px). Custom canvas size allowing per-device ranges.
- **Editing semantics:** Settings with a device-icon are configurable **per device**; settings without the icon apply to **all devices**. "All Devices" config flows down; device edits only affect that device and are invisible elsewhere.
- **Visibility (per-device hiding):** General tab → Visibility → Hide on Desktop / Hide on Laptop / Hide on Tablet / Hide on Mobile. This is how users build different layouts per device.
- **Layout under mobile:** reverse Flex direction (`Column Reverse`/`Wrap Reverse`) to flip image/text columns; "Items per row" for list elements can be 1–4 (recommended 1–2 on mobile); zero column spacing + "disable Fixed Width" for full-screen sections.
- **Sizing options:** Width/Height = Fill container / Hug content / Fixed; Min/Max width-height guards; `Content` modes only on flex sections.
- Common failure mode documented: horizontal scroll overflow from negative margins / fixed-width elements wider than the device — PageFly ships a CSS snippet to fix it. Duka should render `overflow-x: hidden` by default.

## 4. Saved sections & the Section Library (the "reusable parts")

- **Create:** (a) in dashboard → Sections list → "Create blank section" or "Create from templates"; (b) in the page editor → click a section → **Save section** icon → name modal → save (draft).
- **States:** a saved section is editable at its own URL as a **draft**; it must be **published** before it can be inserted anywhere. Published saved sections syncs: "any changes made to the original section will automatically sync to all instances."
- **Library/Ui:** the saved-section library shows generated thumbnails; insert via `+` "Add a section" → choose **Saved** (vs **Template**), or from Page content outline.
- **Naming/sizing:** name entered at save-time; auto thumbnail regenerated (file suffixed `-PF_DO_NOT_DELETE`). Plan-based quota — Free: 1, Pro: 5, Premium: 20 saved sections.
- **Rename:** three-dot menu → Rename, or General → Attributes → More settings.
- **Add entry points:** (1) via the "+" divider between sections; (2) Page content → Add section → Saved sections.

## 5. Premade / template sections (not the same as Saved)

- Premade sections ship with PageFly templates; 15+ categories (Sales boost, Free Shipping, Gift guide, Hero…) and are inserted via "+" → Template → category + Select.

## 6. AI generator (the "generator" concept)

- **AI Section Generator:** prompt field OR structured **Prompt Builder** (Template / Purpose / Layout / Elements + custom requirements) → generates a section and inserts it into the page automatically; at editor can further refine conversationally (spacing/padding/colors become editable params).
- **FlyBaby** (AI assistant): intent includes "Create New" (page/section/element from description) and "Template to Section".
- **SmartPage Creator** (AI Smart Page): full AI page generation with personalization per audience, within PageFly's app boundary.
- **Magic converter** — image → editable design.
- **Universal Elements:** static PageFly element ↔ dynamic Shopify element conversion (Heading → Product Title) via a "type" dropdown in the inspector. This element-kinetics concept is a candidate for Duka: text_block → connected/live data source.

## 7. Other notable behaviors

- Full-width sections: "Enable full width" toggle + Custom CSS override for locked-up themes.
- Sticky element: General tab → "when to scroll, enable sticky top".
- Page-level duplicates: templates → new page; sections within a page can be ordered via drag onto canvas.
- Nested containers: Flex Block grouping; row/column equal-height + per-col width; "Enable equal height".

## Duka relevance map

| PageFly construct | Duka today | Notes |
|---|---|---|
| Device views + per-device styles | Preview sizes only | **Biggest gap** (see gap analysis) |
| Saved Section library (draft/published) | None (`SECTION_PRESETS` only) | Volume of ADR-015 |
| Premade section library | `SECTION_PRESETS` hardcoded | Same thing, un-managed |
| Global/full scope header/footer | `data.shared.header/header` + `footer` | Duka equivalent of global sections already |
| Universal Element conversion | `registerComponentType` superset | Possible evolution |
| AI generator | AI platform elsewhere (KB-116) | Future integration |