# Published app delivery - client implementation

Date: 2026-09-20
Status: Client changes and local builds validated; backend deployment and device acceptance remain open.
Plan: [Cross-stack delivery plan](../ARCHITECTURE/PUBLISHED_APP_DELIVERY_FIX_PLAN_2026-09-20.md)

## Mobile

usePublishedRelease now checks the real backend on entry, focus, foreground and explicit reload. It deduplicates concurrent checks and ignores results from a previous tenant/unmounted scope. It compares the complete stable snapshot, including any server releaseId/checksum, so changed content is detected even if an older backend reuses the version.

A refresh failure keeps the current validated app and displays that currentness could not be verified. A different release is staged; the user explicitly chooses Restart app to update after finishing their task. Automatic foreground refresh never replaces an active checkout. The restart button is disabled while the existing action-loading store reports activity. Adoption resets app navigation/modal/theme/component state while retaining merchant commerce/session stores. Cancellation ignores obsolete responses; it does not abort the underlying transport request.

Logs include configured shell version, tenant/version, available releaseId/checksum, source endpoint and check timestamp, without dumping customer manifests. Legacy nested-config reads remain temporarily supported because the backend canonical fix is not deployed; they now display a visible warning that the snapshot is not confirmed current. This is not a substitute for backend B1-B5. Conditional ETag reads and removing that migration path remain gated on backend parity. Diagnostics cannot display server receipt fields that the server does not provide.

## Merchant

publishedDelivery owns live publication verification. It saves the exact operation in a tenant-scoped sessionStorage journal before mutation and sends Idempotency-Key. The backend receipt determines release identity. Both canonical definition and BFF (using tenant ID) must contain the complete submitted snapshot before success. If a receipt is lost/incomplete, the client can recover it from the matching canonical versioned backend release record, never editor config.

Unknown outcomes and stale reads are verification-pending. Clicking again checks the existing attempt instead of sending a second publish or silently changing its payload. A recovered previous publication is identified separately so newer draft edits are not presented as published. The journal survives reload in the same browser tab; it is not a cross-device or cross-tab idempotency system. Server idempotency/recovery remains required. An unresolved operation is deliberately not discarded automatically; backend investigation is needed if no authoritative outcome becomes available.

Definitive HTTP rejections clear the pending journal; 413 never triggers image stripping. Backend mutation success toasts are suppressed for these operations until verification. Live publication no longer writes saveDeployment/saveReleases config records. Release history/current deployment use backend APIs, rollback calls the real rollback endpoint with the stored compiled release, and the editor labels only the current version Live. My App uses canonical identity/status and reports Not verified when the backend cannot supply it. Legacy config helpers remain for demo/editor data; they are not activation authority.

Runtime-support metadata is not yet available from the backend, so machine-readable compatibility preflight remains W4/B7. No speculative compatibility endpoint was introduced.

## Validation and artifacts

- Mobile TypeScript: npm run lint passed.
- Mobile Jest: 7 suites, 88 tests passed. Includes foreground A/B changes under the same version, failed refresh retention, action-busy adoption guard, initial retry, stale tenant requests, navigation and renderer behavior.
- Merchant full Vitest suite: 10 files, 79 tests passed using --maxWorkers=1. Two additional dashboard-status tests then passed in the 26-test api-helper suite (81 distinct merchant tests verified overall). Targeted delivery regressions cover both reads, stale BFF, unknown POST recovery, rejected uploads, real rollback and conflicting receipts.
- Merchant production build passed: 2,233 modules. Output: D:/work/DD/DUKA-MERCHANT/dukaDesk/build.
- Expo production export passed for both platforms: iOS 1,572 modules; Android 1,978 modules; 72 assets. Output: D:/work/DD/DukaDesk/dist-published-shell with platform Hermes bundles and metadata.json.
- These mobile exports are JavaScript/assets, not signed APK/AAB/IPA installers. No store submission, EAS build, backend mutation, deployment or publication was performed.

## Remaining release gates

Backend B1-B8 own manifest persistence, atomic activation, media correctness, cache freshness, receipt/idempotency semantics and runtime compatibility. After backend deployment, complete the A-to-B-to-A installed-device test, remove the mobile legacy-read migration path, and finish the independent font/widget visual parity work. A local successful build does not prove that production serves the latest tenant release.

## Superseding UI/startup correction

Update controls and diagnostic text have been removed from tenant screens. Background checks remain; new releases load on reopening. Splash is owned by the mobile session and tabs are interpreted from root navigation when no explicit bar exists. See [current behavior and verification](SPLASH_AND_MANIFEST_TABS_2026-09-20.md).
