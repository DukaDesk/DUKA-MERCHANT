# Mobile published-app reconstruction — fix plan and TODO

Date: 2026-09-19
Status: Core implementation and current-release adapters completed; results recorded in the report. Font delivery and device/deployment parity remain in the dedicated TODO.
Request: Mobile supplies the native shell and reconstructs the entire published merchant application.

## Contract and scope

The published snapshot is the source of truth. Transport envelopes may be unwrapped, but mobile must not compile editor drafts, merge owner defaults into a release, invent screens, or replace invalid published styling. Keep the complete definition available to components and actions. Native components implement supported manifest primitives; unsupported definitions must be reported explicitly.

References: [PublishedApp contract](../ARCHITECTURE/publishedApp-mobile-contract.md), [publishing pipeline](../ARCHITECTURE/publishing-pipeline.md), [existing backend incident](../backend/PUBLISHED_LOGO_RELEASE_MISMATCH_TODO.md).

## Execution checklist

- [x] Publisher: preserve section containers, resolved shared chrome, navigation presentation, splash, actions, and complete top-level runtime data.
- [x] Resolver: select one immutable published snapshot; preserve the entire manifest; reject editor drafts, incomplete definitions, and broken routes without local screen/theme substitution.
- [x] Shell: use one implementation for both mobile entry routes; remove branded default splash, guessed navigation targets, and injected app chrome. Render published splash and screen composition.
- [x] Renderer: nest children inside their containers; respect nested layout, props, assets, fixed regions, overlays, and published actions. Remove hardcoded footer size/style.
- [x] Runtime: expose full manifest context, retain navigation metadata, and route published screen actions inside the app. Show explicit errors for unsupported definitions.
- [x] Current-release widgets: adapt published data shapes, layouts, styling and actions; avoid implicit live data replacement; remove invented cart fees/items from merchant preview.
- [x] Tests: merchant compilation plus shared generated fixture consumed by mobile; nested rendering/action and malformed-manifest regressions; mobile typecheck and merchant build/suite.
- [x] Record results and remaining backend/device verification in a separate report; update progress links.

## Acceptance

The same published screen IDs, ordering, nested component structure, props, theme, assets, splash, and navigation reach the native renderer. Reloading another release does not retain the prior app's screen/theme. An unsupported or incomplete release is visibly rejected, never silently redesigned. Native pixel-level equivalence requires device visual verification against the merchant preview in addition to contract tests.

Backend publication parity and broken media delivery remain separately tracked. These fixes cannot recover a missing asset or a release that the backend never persisted.
Implementation report: [results and limitations](PUBLISHED_APP_RECONSTRUCTION_2026-09-19.md). Remaining work: [parity verification TODO](PUBLISHED_APP_PARITY_VERIFICATION_TODO.md).
