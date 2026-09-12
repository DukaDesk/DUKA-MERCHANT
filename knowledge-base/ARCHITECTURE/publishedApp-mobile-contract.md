# PublishedApp Mobile Contract

## Status

This is the shared contract between the merchant builder, backend publishing API, and DukaDesk mobile runtime.

## Builder Source

The canvas authoring model remains editor-only:

- `meta`, `splash`, `navigation.initialScreen`, `navigation.tabs`
- `screens` keyed by editor ids with `bodySections[].components`
- `shared`, `savedSections`, and `chrome` editor metadata

`PublishingPipeline.js` must compile this model before sending it to the backend. The backend must not be expected to infer editor-only fields at read time.

## PublishedApp Shape

The published payload must contain:

- `manifestVersion`, `version`, `publishedAt`, `status`
- `metadata`, `identity`, `capabilities`
- `navigation.root.initialRoute`, `navigation.tabs`, `navigation.stacks`, `navigation.routes`, `navigation.guestMode`
- `theme` with `version`, `brand`, 13 required colors, typography, spacing, and roundness
- `screens` as a non-empty record keyed by screen id
- `runtime`, `permissions`, `localization`, `assets`, and `content`

Each published screen is normalized to:

```json
{
  "screenId": "screen_1",
  "title": "Home",
  "layout": {
    "kind": "scroll",
    "gap": 16,
    "padding": 16,
    "children": []
  }
}
```

Editor `bodySections[].components` become `layout.children`. Saved-section references are resolved during compilation. `shared`, `savedSections`, and chrome inheritance modes are not sent as runtime requirements.

## Publishing Rules

- Builder autosave is draft persistence only. Draft editor data is private to the Merchant Builder and is never returned by mobile definition or BFF manifest reads.
- Only a successful publish creates or replaces the deployed `PublishedApp` consumed by mobile.
- Publishing an app with zero screens is rejected before the request is sent.
- `POST /api/v1/merchants/{id}/publishing/publish` is the documented builder/merchant write route.
- `/api/v1/app/*` is mobile-only and must not be called by the builder.
- There is no documented mobile BFF manifest write route; the BFF must read the deployed published app.
- Backend `GET /api/v1/merchants/{id}/definition` and `GET /api/v1/bff/mobile/tenant/{slug}/manifest` must read the deployed compiled object, not an editor config stub.
- Backend fixes are assigned in `DukaDesk/docs/backend-publishedApp-todo.md`; do not introduce mobile demo fallbacks to mask a failed publish.

## Verification

After publishing, verify both read paths contain the same non-empty screen ids and that the mobile runtime can render `layout.children` without converting editor sections at runtime.
