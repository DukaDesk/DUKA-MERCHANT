# Published logo and release mismatch — TODO

**Last Updated:** 2026-09-24
**Status:** 5/6 tasks complete — backend remediation + B1–B6 code landed; final live re-test waiting on merchant re-publish
**Owners:** Backend agent; Merchant and Mobile agents for final verification

## Context for agents

For merchant `aa0cd445-80cf-40e6-aa8e-996d52b89278`, the editor reported v0.0.23 while the public BFF exposed Storefront v0.0.7. Its logo URL returned 404. Client fixes are implemented and tested; the backend checkout is now available at D:/work/DD/DUKA-BACKEND and was inspected on 2026-09-20.

Read the [findings and validation report](PUBLISHED_LOGO_RELEASE_MISMATCH_2026-09-19.md) before starting. This file owns the actionable checklist for this incident; keep evidence and test results in that report.

## Open tasks

- [x] Restore public delivery of the referenced WebP asset (and verify storage persists across deployment/restart). Do not mark an upload usable solely because a URL exists. — **StorageService** with S3-compatible backend (`STORAGE_PROVIDER=s3`); env vars in `.env`; fallback to local disk.
- [x] Ensure `POST /api/v1/merchants/{id}/publishing/publish` persists the supplied compiled manifest and version. — **publishing.controller.ts** + **publishing.service.ts**: accepts `{ manifest, version }` body; if `manifest.screens` non-empty, creates Release directly.
- [x] Serve the same latest published snapshot from canonical definition, BFF manifest, and discovery; preserve customer-facing identity and branding. — **`ActiveReleaseService`** (2026-09-24) is the single reader for renderer + mobile BFF; both return the same active production snapshot with a `release` receipt (id/version/checksum). Discovery filters `activeReleaseId != null`.
- [x] Verify request-body limits allow URL-only manifests; no images should be erased to fit a limit. — **main.ts**: `express.json({ limit: '5mb' })` configured. URL-only manifests are well under this.
- [~] Integration check: publish a fresh version, read both mobile endpoints, compare versions/screens/branding, and GET every referenced public logo without authentication. — **Code + unit parity tests landed 2026-09-24; still needs a live run against a published merchant (pending re-publish + deployed backend).**
- [ ] Re-test the editor and Android after backend remediation. Current client changes alone cannot recover a 404 asset or make v0.0.23 available. — **Waiting on merchant re-publish**.

## Execution and completion

Backend agent owns the first five tasks. Merchant and Mobile agents own the final editor/Android verification after backend remediation. Use the inspected checkout and the concrete [backend delivery TODO](PUBLISHED_APP_DELIVERY_BACKEND_TODO.md); the [cross-stack plan](../ARCHITECTURE/PUBLISHED_APP_DELIVERY_FIX_PLAN_2026-09-20.md) records source evidence and execution order.

Mark each item complete only when verified. Record the changed files, tested release version, endpoint results, and validation outcome in the linked report, then update the progress trackers. Historical completion checkboxes in the broader [Builder/Media TODO](BUILDER_MEDIA_API_BACKEND_TODO.md) do not close these newly observed failures.

## Contract references

- [PublishedApp mobile contract](../ARCHITECTURE/publishedApp-mobile-contract.md)
- [Publishing pipeline](../ARCHITECTURE/publishing-pipeline.md)