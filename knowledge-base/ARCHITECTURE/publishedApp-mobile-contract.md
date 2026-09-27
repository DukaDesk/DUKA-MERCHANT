# PublishedApp Mobile Contract

This contract defines the boundary between Merchant Builder drafts, backend publishing, and mobile runtime reads.

## Draft Lifecycle

- Builder autosave is private draft persistence.
- Draft editor data is never returned by mobile definition or BFF manifest endpoints.
- Draft changes do not affect a running mobile application.

## Published Shape

A successful publish must produce a versioned object containing:

- `manifestVersion`, `version`, `publishedAt`, `status`
- `metadata`, `identity`, `capabilities`
- `navigation.root.initialRoute`, `navigation.tabs`, `navigation.routes`, `navigation.guestMode`
- `theme.version`, `theme.brand`, colors, typography, spacing, and roundness
- `runtime`, `permissions`, `localization`, `assets`, and `content`
- `screens` as a non-empty record keyed by screen ID

Each screen must be normalized to:

```json
{
  "screenId": "shop",
  "title": "Shop",
  "layout": {
    "kind": "scroll",
    "gap": 16,
    "padding": 16,
    "children": []
  }
}
```

Editor-only sections, saved-section links, and chrome metadata are resolved by the Builder before publishing and must not be required by mobile.

## Endpoints

- `POST /api/v1/merchants/{id}/publishing/publish` accepts the compiled `PublishedApp` and creates the deployed version.
- `GET /api/v1/merchants/{id}/definition` returns the latest successful deployed version.
- `GET /api/v1/bff/mobile/tenant/{slug}/manifest` returns the same deployed version.

Both read paths must return identical version and screen IDs. They must never return an editor draft or a legacy `{ name, theme, screens: [] }` stub after a successful publish.

## Runtime interpretation ? reconstruction alignment (2026-09-19)

The native app is a host for the published definition. It must retain the complete snapshot and render its declared tree without merging merchant-owner defaults, compiling editor drafts, injecting module screens, or guessing navigation targets. Unsupported definitions must be reported explicitly.

- A screen may declare fixedTop and fixedBottom component arrays and an overlay. These are rendered in declared order, with content-measured fixed regions.
- A runtime node of type layout carries a LayoutNode in its layout field. This represents a compiled section/container; its children remain inside the container.
- Optional splash contains a compiled screen and durationMs. The compiler publishes its complete presentation; the native shell does not invent a branded splash.
- Navigation retains routes, stacks, modals, tabs, guest policy, and extension fields. Visible tabs are published component nodes. Screen IDs and declared route paths are exact, not fuzzy aliases.
- Asset references may be public URLs, relative public paths, or objects with assetId resolving to the published asset catalog. Resolution does not mutate the snapshot.
- Every submitted manifest field must round-trip through publish read-back. Backend enrichment is allowed; dropping or rewriting submitted fields is a publish verification failure.

See [implementation report](../mobile/PUBLISHED_APP_RECONSTRUCTION_2026-09-19.md) and [dedicated verification TODO](../mobile/PUBLISHED_APP_PARITY_VERIFICATION_TODO.md). Device pixel parity and complete editor-widget coverage require the recorded verification gates; retaining an extension field alone does not implement it.

## Root navigation and splash interpretation (2026-09-20)

Root type tabs plus navigation.tabs is sufficient to render the published tab navigation even if screens contain no tab_bar nodes. Explicit tab components take precedence to avoid duplicates. Splash configuration is published data; mobile is the sole tenant-session lifecycle controller. Backend persists it unchanged. See [ownership specification](../mobile/SPLASH_AND_MANIFEST_TABS_2026-09-20.md).
