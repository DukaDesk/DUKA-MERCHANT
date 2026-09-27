# Published-app reconstruction - implementation report

Date: 2026-09-19
Status: Core reconstruction and current-release widget adapters implemented. Font delivery, deployment, and device parity checks remain open.

## Result

Both mobile app routes delegate to one PublishedAppShell. The shell loads one validated published snapshot, starts the merchant session, hosts native authentication/back behavior, and passes the complete definition to ScreenRenderer and PublishedAppContext. Published UI comes from the snapshot's screens and component tree.

The runtime no longer compiles editor bodySections, injects module screens, guesses screen names, replaces invalid themes with a local brand, or adds a locally designed app header/splash/tab bar. A full manifest remains available, including assets, content, permissions, localization, runtime settings, capabilities, and navigation metadata. Retaining a field does not imply that every future extension has a native implementation.

## Implemented changes

- Merchant compiler: explicit section containers retain section background/padding and nested component order. Saved sections and inherited/custom/hidden header/footer rules resolve before publication. Navigation tabs become explicit component nodes without duplication. Splash becomes a published screen with a declared duration. Component actions and runtime/content/localization/assets are retained.
- Publishing confirmation: every submitted field must be present and unchanged in canonical read-back. Backend-only enrichment is permitted. Losing a nested action or section now prevents a success report.
- Resolver: validates the release/schema, required sections, merchant identity, theme, screens, and declared routes. It unwraps supported backend publication envelopes and selects one snapshot without merging owner-level defaults into it. Older editor-shaped/empty definitions produce an explicit error.
- Native shell: identical entry behavior for /desk/[id] and /app/[tenantId]; app-local push/replace/pop/tab switching; declared modals; protected initial routes; stale-request cancellation; splash timing starts after theme readiness.
- Renderer: children render inside their container once; nested layout-owned children are retained; fixed regions use actual content size instead of a guessed 60px footer; overlays preserve props/actions. Registry dispatch preserves the originating node. Relative and asset-ID image references resolve at render time without rewriting the stored manifest.
- Typography and presentation: published text styles reach text primitives and button labels; merchant text/image/button primitives translate editor units and properties. Published tab styles and modal animation/presentation are used. Unsupported components in a published runtime and unknown layouts are explicit errors.

## Verification artifacts

Canonical fixture source/output: mobile/fixtures/merchant-project.json and mobile/fixtures/published-app.json. The merchant test compiles the input and compares the full output. Mobile resolver, renderer, and shell tests consume an identical copy of that output.

Each implementation repository carries its own fixture copy so tests work without sibling checkouts. To intentionally regenerate all copies, run node KNOWLEDGE-BASE/scripts/sync-published-app-fixture.mjs from the shared workspace and review the fixture diff. Never regenerate a failing fixture merely to make a test pass.

## Compatibility and migration

Republish after deploying the merchant compiler to include section boundaries, fixed regions, actions, and splash that previous releases omitted. Mobile cannot reconstruct information absent from an old release. Deploy the compatible native runtime before distributing manifests that use the new layout nodes/splash screen fields.

Native rendering supports the registered component vocabulary and implemented primitives. Unknown merchant-only types are reported explicitly; this change does not claim that every editor widget, font, CSS effect, data-binding expression, or future runtime extension is already implemented natively. Fonts must be installed/available on the target device. The full raw snapshot is available for adapters without inventing another application model.

No physical-device visual comparison or production publication was performed. The previously observed stale backend release and 404 media URL remain independent blockers to an end-to-end demonstration. Runtime errors should be fixed at their source; do not restore template/default fallbacks to hide them.

## Tracking

Execution: [reconstruction plan](PUBLISHED_APP_RECONSTRUCTION_TODO.md).
Remaining verification: [dedicated parity TODO](PUBLISHED_APP_PARITY_VERIFICATION_TODO.md).
Backend dependency: [release/media TODO](../backend/PUBLISHED_LOGO_RELEASE_MISMATCH_TODO.md).

## Current-release widget audit

Read-only inspection of the public BFF for emmanuel-akinyemi still returned Storefront v0.0.7 under data.config.config.deployed. The release uses promotion_list, section_header, category_pills, cart_summary, menu_grid, hero_banner, order_history, info_list, and primary_button. Registry-name coverage alone was insufficient: existing adapters discarded published properties or expected different data shapes.

PublishedWidgets now adapts the static editor contracts for those list/hero/header widgets. It preserves submitted list content, category labels, configured columns/gaps, card and image properties, promotion layout/heading, hero fill/variant/text styles, and declared actions with their originating node. Static order/cart/category/product content no longer triggers an implicit account/catalog request merely because the shell provides tenantId. Explicit node-level tenantId/storeId retains the existing live catalog/order adapter path. No fake list entries or navigation targets are generated. Merchant CartSummary also no longer inserts a sample item or an undisclosed fixed delivery charge; both presentations use an explicit deliveryFee when provided.

Image-fill objects and cart image URLs resolve against the API host. AppImage resets its failure state when the source changes. Protected modal content is hidden when authentication is lost.

## Validation results

- Mobile: complete Jest suite, 7 suites / 84 tests passed. Renderer suite rechecked after fixing source encoding: 16 tests passed.
- Mobile: npm run lint (TypeScript) passed.
- Merchant: 9 test files / 72 tests passed; production build passed (2,232 modules).
- Shared compiled fixture copies matched byte-for-byte across all three repositories.
- No production writes, deployment, or publication were performed.

These checks establish snapshot preservation, shell behavior, and the tested native property contracts. They do not establish pixel-level parity on a device. In particular, mobile app/_layout.tsx currently loads Roboto only, while merchant widgets declare Inter/Sora. Shipping/loading those fonts and checking their weights is required before declaring typography parity. Native gradients/shadows, all editor widget variants, and live data binding behavior also require the dedicated parity work below.

## Final verification - 2026-09-20

The interrupted final checks were resumed successfully: mobile TypeScript check passed, all 7 mobile suites / 84 tests passed, and the final merchant production build passed (2,232 modules). All three compiled fixture copies have SHA256 ECCF97F77F9C3D98D3A53A42C8BF222138A838412184487DF7467064C2042964. All repository diff checks passed. Changes remain local and uncommitted; deployment, backend/media remediation, font delivery, and device parity remain in the separate TODO.
