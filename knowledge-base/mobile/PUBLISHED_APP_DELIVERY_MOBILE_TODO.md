# Published app delivery - mobile TODO

Date: 2026-09-20
Last Updated: 2026-09-27
Status: M1–M4 implemented and locally tested (100 runtime tests); M5 device acceptance remains open.
Repository: D:/work/DD/DukaDesk
Dependency: Backend B1–B6 code complete on DUKA-BACKEND main (commit `00baea3`, deployed; B4 migration applied 2026-09-27; **B7 runtime contract live at `GET /api/v1/compatibility` and merchant preflight at `POST /api/v1/merchants/{id}/publishing/preflight`**); retain completed manifest reconstruction work. B8 live evidence still open.
Read: [Coordinated plan and evidence](../ARCHITECTURE/PUBLISHED_APP_DELIVERY_FIX_PLAN_2026-09-20.md)

- [x] **M1 - Revalidation lifecycle.** Refactor PublishedAppShell's mount/tenant-only loader into a cancellable release loader. Revalidate on entry, focus and foreground, and provide explicit reload/retry. Deduplicate requests; reject stale responses after tenant changes. Compare backend release ID/checksum, not only version or screen count. Test A-to-B publication while mounted and backgrounded.
- [x] **M2 - Safe release adoption.** Validate the entire replacement before activation; key runtime/theme state by tenant plus release identity. Clear obsolete navigation/modal/binding state at adoption, preserving compatible user commerce/session data. Defer switching during in-flight mutations/checkout and offer a safe update boundary. Failed refresh must not replace a valid active app with an incomplete definition; visibly distinguish last-known-good/offline state from current verified state.
- [x] **M3 - Canonical read transition.** Legacy nested `config.deployed/published/manifest` envelopes are no longer a production release source — `resolveTenant` reads only the canonical definition body plus the canonical BFF manifest by slug, accepts manifest versions `1.0.0|1.0`, extracts the server `release {id, version, checksum}` receipt and surfaces typed `TENANT_NOT_FOUND` / `NO_PUBLISHED_RELEASE` / `INCOMPATIBLE_RUNTIME` errors. (`ManifestResolver.ts`, DukaDesk `core` 2026-09-27.)
- [x] **M4 - Observable release identity.** `usePublishedRelease` exposes `release` receipt + `diagnostics {shellVersion, tenantId, releaseId, version, checksum, source, legacy, checkedAt, refreshing}`; `ReleaseDiagnostics` renders them without dumping manifests or credentials (shown on error/incompatible screens, never injected into tenant screens). (`usePublishedRelease.ts`, `ReleaseDiagnostics.tsx`, 2026-09-27.)
- [ ] **M5 - Installed-shell acceptance.** Test A-to-B-to-A through real backend publish/rollback on Android and iOS without changing the installed binary. Cover foreground, navigation focus, authentication return, offline recovery and active checkout. Complete the separate font/widget/visual parity TODO; ordinary supported manifest changes must require only publication, while new native capabilities require a compatible shell build first.

Backend data freshness/storage defects remain backend-owned. These tasks address client refresh and interpretation, not substitute data generation.

## Implementation evidence

[Client implementation and build report](PUBLISHED_APP_DELIVERY_CLIENT_IMPLEMENTATION_2026-09-20.md). M4 diagnostics are rendered by `ReleaseDiagnostics` on error/incompatible screens only. M3 retains the canonical BFF manifest as a second canonical source (same active release); the legacy nested-envelope path is removed.

B7 client gate (2026-09-27): `src/runtime/compatibility.ts` embeds the `dukadesk.published-app-runtime` 1.0.0 fallback contract and fetches the live `GET /api/v1/compatibility` when reachable — unknown components / required capabilities / limit breaches are errors, unknown actions / optional capabilities are warnings. `PublishedAppShell` blocks incompatible releases with an explicit `IncompatibleRelease` screen; unknown single components render inline `UnsupportedComponent` instead of crashing the tree. (`compatibility.test.ts`, 4 cases.)

UI policy correction: no update controls or diagnostics are injected into tenant screens. Current sessions remain stable; reopen loads the newest available release. See [splash and tabs report](SPLASH_AND_MANIFEST_TABS_2026-09-20.md).
