# Published-app parity verification - TODO

Date: 2026-09-19
Last Updated: 2026-09-27
Status: Backend deployed (B4 migration applied 2026-09-27, B7 contract live); live release/media verification open pending merchant re-publish
Owners: Backend, Merchant, Mobile agents

Read the [implementation report](PUBLISHED_APP_RECONSTRUCTION_2026-09-19.md) and [execution plan](PUBLISHED_APP_RECONSTRUCTION_TODO.md) first.

- [~] Backend: complete the separate [release/media remediation checklist](../backend/PUBLISHED_LOGO_RELEASE_MISMATCH_TODO.md). Both mobile endpoints must return the same complete submitted snapshot and all referenced media must be publicly retrievable. — **Code landed 2026-09-24** (canonical `ActiveReleaseService` + storage URL retention + webp self-delete guard); **deployed 2026-09-27; live re-test pending merchant re-publish** (see backend logo TODO 5/6).
- [ ] Release coordination: deploy the compatible mobile runtime and merchant compiler, then republish the real merchant app. Verify its version and full content through both read paths. Existing releases do not gain omitted fields automatically.
- [ ] Mobile/Merchant: compare the same real published release at matching viewport sizes on Android and iOS against the merchant output. Cover section order/spacing, header/footer, tabs, nested containers, images, overlays, splash, typography, and navigation actions. Attach evidence and results to the report.
- [x] Mobile: inventory current live v0.0.7 component types and correct known property/data-shape mismatches. See the report and PublishedRenderer regressions.
- [ ] Mobile/Merchant: expand the shared fixture to every supported editor widget and variant, including live binding contracts; implement unsupported properties explicitly before approving visual parity.
- [ ] Mobile/Merchant: ship/load Inter and Sora (including published weights); mobile currently loads Roboto only. Verify font rendering, native gradients/shadows, and other advanced visual properties on both platforms. Do not count fallback fonts as a match.
- [ ] Mobile: verify app lifecycle on device, including back gestures, modal dismissal, authentication round trip, rotation, and switching merchants/releases. Backend authorization remains authoritative.

Mark each task complete only after attaching its evidence. Contract/tree unit tests prove data preservation and supported rendering behavior; they are not a substitute for device visual verification.
