# Published app delivery: cross-stack fix plan

Date: 2026-09-20
Last Updated: 2026-09-24
Status: Backend B1–B6 code complete on DUKA-BACKEND main (commit `00baea3`, unit-tested); **B4 migration applied in production 2026-09-27** (backfill 0 rows, audit clean); **B7 compatibility contract + merchant preflight live 2026-09-27** (`GET /api/v1/compatibility`, publish gated with 422 `INCOMPATIBLE_RUNTIME`); B8 and merchant/mobile release gates open. Live staging evidence not yet attached.
Objective: One installed DukaDesk native shell launches tenant applications from backend-published manifests. Publishing supported content/layout/actions must not require a separate tenant binary or a shell release.

## Clarification

Local changes means repository code has not been deployed. Mobile already reads the backend through src/services/api/endpoints/tenant.ts and src/runtime/ManifestResolver.ts. PublishedAppShell retains the fetched snapshot in memory while mounted; it currently reloads only when tenantId changes. No demo manifest is the source for this path.

## Verified evidence

Read-only production checks on 2026-09-20 for tenant aa0cd445-80cf-40e6-aa8e-996d52b89278:

- GET /api/v1/merchants/{id}/definition: response data has no version or manifestVersion; screens is an array, status is published.
- GET /api/v1/bff/mobile/tenant/emmanuel-akinyemi/manifest: same unversioned outer shape, with config.config.deployed.version = 0.0.7.
- Therefore the public read paths do not currently expose a new canonical release. We did not submit a publication, inspect production database records, or establish which backend commit is deployed. The exact result of the user's latest POST still requires request/release correlation.

Source findings in the supplied backend clone:

| Finding | Source | Consequence |
| --- | --- | --- |
| Submitted manifests are accepted only if screens is a nonempty array | DUKA-BACKEND/src/modules/publishing/publishing.service.ts:31 | Merchant screen-ID maps fall into draft compilation instead of being persisted |
| Draft compiler emits manifestVersion 1.0, array screens and a different theme/navigation contract | src/modules/publishing/compiler/manifest-compiler.service.ts:53 | Incompatible with the merchant/mobile PublishedApp 1.0.0 contract |
| Compiler creates a draft Release, then publisher creates another Release using the same version | compiler/manifest-compiler.service.ts:140; publishing.service.ts:68; prisma/schema.prisma:230 | Unique tenantId/version constraint can reject the second insert |
| Publication is not one transaction and deletes draft rows after inserting the release | publishing.service.ts:68-90 | Partial success, lost drafts, ambiguous retries |
| Definition and BFF independently select releases and fall back to tenant pages/config | renderer/renderer.service.ts; bff/mobile/mobile-bff.service.ts | Empty owner definition or stale nested config can masquerade as the live app |
| BFF caches identifier-based manifests for 300 seconds; rollback deletes only the ID key | bff/mobile/mobile-bff.service.ts:15; publishing.service.ts:166 | Slug-based readers can remain stale; concurrent cache refill can also race invalidation |
| Media upload discards storage.upload return URLs and emits local /uploads paths | modules/media/media.service.ts:56-74 | S3/CDN deployments can advertise the wrong delivery host |
| WebP source and optimized destination use the same key; source is then deleted | modules/media/media.service.ts:54-74 | An original .webp upload can delete its newly written optimized file |
| Merchant rollback only saves config/history | DUKA-MERCHANT/dukaDesk/src/services/PublishingPipeline.js:272 | Editor rollback does not switch the canonical backend release |
| Mobile loads only on mount/tenant change | DukaDesk/src/runtime/PublishedAppShell.tsx:26-37 | A still-mounted app does not discover a newly published release |

These are backend defects plus distinct client lifecycle gaps. Changing mobile to prefer arbitrary config snapshots is not the permanent fix.

## Target contract and decisions

1. Retain the existing PublishedApp 1.0.0 screen-ID-map contract and full shared fixture. Transport envelopes may wrap it, but must not transform its contents.
2. Backend owns immutable releases and an explicit active production release reference per tenant/channel. Introduce it additively with a migration/backfill; keep existing public route names. Version allocation, checksum, activation and publication receipt are authoritative on the server.
3. Definition and BFF use the same published-release reader. Missing/unpublished/unsupported apps return a typed error; draft/config/owner data never silently substitutes for a release.
4. Publication returns releaseId, tenantId, channel, version, checksum and publishedAt. Use a documented canonical JSON checksum, and an idempotency key scoped to tenant/channel. Retry must not create another release or overwrite an existing version with different bytes.
5. Cache immutable snapshots by release ID/checksum. Resolve the current active reference coherently; do not use a five-minute stale alias cache as the source of currentness. Support ETag/conditional reads without requiring that optimization for the first correctness fix.
6. Mobile revalidates on app open, screen focus and foreground, with an explicit reload control. A changed release is validated and adopted at a safe boundary; do not interrupt checkout or another in-flight mutation. No perpetual polling is needed for the first release.
7. Supported manifest changes ship through publication. A new native capability/component requires shell support first. Publish validation checks schema/runtime compatibility, component/action support and assets before activation. Do not promise arbitrary native functionality from JSON alone.

## Ordered execution

| Phase | Owner | Tasks | Exit condition |
| --- | --- | --- | --- |
| 1 | Backend | B1-B4 in dedicated backend TODO | Object-screen manifest persists exactly once and both reads serve identical active release |
| 2 | Backend / infrastructure | B5-B7 | Rollback, cache freshness, public media and discovery pass integration tests |
| 3 | Merchant | W1-W4 | Editor publish/rollback use backend receipts; no config-based live success |
| 4 | Mobile | M1-M4 | Installed shell reopens/resumes into a new compatible release without binary changes |
| 5 | All stacks | B8, W5, M5 and release test below | Production evidence attached; visual/device requirements verified |

Deploy backend changes compatibly first, then merchant publication flow and the shell refresh update. Preserve old valid releases while backfilling the active reference. Quarantine malformed snapshots for repair rather than rewriting them silently. Re-publish the intended current template after the new backend passes staging checks. Do not promote stale config v0.0.7 as if it were the user's latest template.

## End-to-end acceptance scenario

On staging, publish fixture A through the real authenticated merchant path. Capture request ID, release receipt and checksum. Fetch definition and BFF by ID and slug and compare the complete snapshot. Open it on an installed shell. Publish fixture B with visibly different title, image, screen order and action target. Verify both public paths return B immediately after confirmed activation; re-enter/foreground the shell and verify B without rebuilding it. During an active mutation, defer adoption until a safe boundary. Roll back to A through the backend and verify both public routes and the shell. Repeat concurrent/retried publish, cache refill race, Redis failure, invalid manifest, unauthorized tenant access, missing media, and incompatible runtime cases. GET media anonymously after restart/redeploy. Record versions, checksums, HTTP statuses, device builds and screenshots.

## Task ownership

- [Backend fixes](../backend/PUBLISHED_APP_DELIVERY_BACKEND_TODO.md)
- [Merchant fixes](../builder/PUBLISHED_APP_DELIVERY_MERCHANT_TODO.md)
- [Mobile fixes](../mobile/PUBLISHED_APP_DELIVERY_MOBILE_TODO.md)
- [Existing visual/font verification](../mobile/PUBLISHED_APP_PARITY_VERIFICATION_TODO.md)
- [Existing release/logo incident](../backend/PUBLISHED_LOGO_RELEASE_MISMATCH_TODO.md)

This inspection changed documentation only. Backend package-lock.json was already modified and was left untouched. No production writes or deployment occurred.
