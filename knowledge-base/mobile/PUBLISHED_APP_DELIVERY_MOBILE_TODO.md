# Published app delivery - mobile TODO

Date: 2026-09-20
Last Updated: 2026-09-24
Status: M1/M2 implemented and locally tested; M3/M4 backend integration and M5 device acceptance remain open.
Repository: D:/work/DD/DukaDesk
Dependency: Backend B1–B6 code complete on DUKA-BACKEND main (commit `00baea3`, deployed; B4 migration applied 2026-09-27; **B7 runtime contract live at `GET /api/v1/compatibility` and merchant preflight at `POST /api/v1/merchants/{id}/publishing/preflight`**); retain completed manifest reconstruction work. B8 live evidence still open.
Read: [Coordinated plan and evidence](../ARCHITECTURE/PUBLISHED_APP_DELIVERY_FIX_PLAN_2026-09-20.md)

- [x] **M1 - Revalidation lifecycle.** Refactor PublishedAppShell's mount/tenant-only loader into a cancellable release loader. Revalidate on entry, focus and foreground, and provide explicit reload/retry. Deduplicate requests; reject stale responses after tenant changes. Compare backend release ID/checksum, not only version or screen count. Test A-to-B publication while mounted and backgrounded.
- [x] **M2 - Safe release adoption.** Validate the entire replacement before activation; key runtime/theme state by tenant plus release identity. Clear obsolete navigation/modal/binding state at adoption, preserving compatible user commerce/session data. Defer switching during in-flight mutations/checkout and offer a safe update boundary. Failed refresh must not replace a valid active app with an incomplete definition; visibly distinguish last-known-good/offline state from current verified state.
- [ ] **M3 - Canonical read transition.** Once backend parity is deployed, remove nested config.deployed/published/manifest fallback as a production release source. Consume the canonical receipt/ETag contract and typed absent/unsupported errors. Existing direct GET already reads the backend; do not introduce bundled tenant templates or client-side release guessing. Document any temporary legacy migration path and its removal gate.
- [ ] **M4 - Observable release identity.** Add non-sensitive diagnostics showing shell build, tenant ID, release ID/version/checksum, source endpoint and last successful refresh. This allows support to distinguish an old shell binary from a stale backend release. Never log full customer manifests or credentials merely to diagnose freshness.
- [ ] **M5 - Installed-shell acceptance.** Test A-to-B-to-A through real backend publish/rollback on Android and iOS without changing the installed binary. Cover foreground, navigation focus, authentication return, offline recovery and active checkout. Complete the separate font/widget/visual parity TODO; ordinary supported manifest changes must require only publication, while new native capabilities require a compatible shell build first.

Backend data freshness/storage defects remain backend-owned. These tasks address client refresh and interpretation, not substitute data generation.

## Implementation evidence

[Client implementation and build report](PUBLISHED_APP_DELIVERY_CLIENT_IMPLEMENTATION_2026-09-20.md). M4 currently logs configured shell version, endpoint, timestamp and any available release ID/checksum; installed-build/receipt integration remains to verify. M3 deliberately retains a visibly labelled legacy path until backend parity is deployed.

UI policy correction: no update controls or diagnostics are injected into tenant screens. Current sessions remain stable; reopen loads the newest available release. See [splash and tabs report](SPLASH_AND_MANIFEST_TABS_2026-09-20.md).
