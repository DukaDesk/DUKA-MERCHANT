# Published app delivery - merchant TODO

Date: 2026-09-20
Last Updated: 2026-09-27
Status: W1-W3 client implementation complete; W4 contract available from backend (client wiring open) and W5 deployment/integration remain open.
Repository: D:/work/DD/DUKA-MERCHANT/dukaDesk
Dependency: Backend B1–B6 deployed and **B4 migration applied in production 2026-09-27**; **B7 compatibility contract live at `GET /api/v1/compatibility`** (merchant preflight at `POST /api/v1/merchants/{id}/publishing/preflight`). Only merchant re-publish (W5/B8) remains. [Coordinated plan](../ARCHITECTURE/PUBLISHED_APP_DELIVERY_FIX_PLAN_2026-09-20.md)

- [x] **W1 - Backend-owned publication receipt.** Keep the full compiled 1.0.0 snapshot; send an idempotency key and consume authoritative releaseId/version/checksum. Reconcile requested version with backend receipt, including conflict handling. Preserve exact full-snapshot verification; verify both canonical definition and BFF against the committed receipt before displaying live status. Distinguish committed-but-verification-pending from rejected publication to prevent duplicate retries.
- [x] **W2 - Separate editor history from production state.** Stop treating saveDeployment/writeConfig as live activation. Use canonical backend release history/current-release APIs for production status. Config may retain editor drafts/history but cannot override the active release. Config bookkeeping failure after a committed publish must not falsely report that the publication never happened.
- [x] **W3 - Real rollback.** Replace rollbackToRelease's config-only update with authenticated POST /merchants/{id}/publishing/rollback/{version}, then verify both runtime read paths. Do not put release.project (editor model) into a field interpreted as a compiled manifest.
- [ ] **W4 - Compatibility and media preflight.** Consume the backend runtime-support contract (**live** at `GET /api/v1/compatibility`; server-side gating already returns 422 `INCOMPATIBLE_RUNTIME`); prevent activation of unsupported widgets/actions and unresolved assets. Surface backend validation fields and public asset failures. Keep full-quality uploaded references, without clearing images or claiming payload-size compression.
- [ ] **W5 - Tests and deployment.** Test successful A/B publication, failed read-back, idempotent retry, committed-but-pending verification and real rollback. Backend is deployed; republish the intended latest template and capture receipt plus public read-back evidence.

No frontend workaround for backend array-only validation, stale caches, release transactions or deleted files is part of these tasks.

## Implementation evidence

[Client implementation and build report](../mobile/PUBLISHED_APP_DELIVERY_CLIENT_IMPLEMENTATION_2026-09-20.md). W1 verifies complete snapshots against a backend receipt/versioned record; canonical checksum calculation, server idempotency and conditional reads still require the backend contract. W5 local regression tests and production build pass; deployment and real release/device checks remain open.
