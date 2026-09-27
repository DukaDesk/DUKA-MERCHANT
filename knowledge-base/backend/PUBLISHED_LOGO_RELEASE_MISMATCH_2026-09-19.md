# Published logo and release mismatch — 2026-09-19

Status: client fixes implemented; live backend remediation outstanding.

## Verified evidence

Tenant: `aa0cd445-80cf-40e6-aa8e-996d52b89278`.

- User observed an editor success message for v0.0.23, while mobile logged an owner-level definition with empty screens/navigation and `theme.logo: null`.
- Public BFF read at `/api/v1/bff/mobile/tenant/emmanuel-akinyemi/manifest` contains `data.config.config.deployed`: **Storefront v0.0.7**, `identity.slug: storefront`, screen IDs `cart`, `shop`, `orders`, `profile`.
- That snapshot's `theme.brand.logo` is `/uploads/80a271d2-38bc-4d74-8f2e-ff276f61e396.webp`. An unauthenticated HEAD request to the absolute Railway URL returned **404**.
- Mobile previously extracted nested screens but retained outer merchant branding/default theme and a manifest with no screen references.
- Merchant publishing marked any payload above 800KB as stripped, even with no inline images left. This is not evidence of compression. The editor measured the original draft instead of the transmitted manifest.
- Publish errors and read-back mismatches were swallowed; local successful release history was saved before backend confirmation.

## Client changes

- Mobile resolves the selected nested published snapshot through the same normalization as a direct definition: identity, slug, logo, theme, navigation, version, and screen references stay together. Relative logo URLs resolve against the API base URL. A compact JSON summary exposes version and selected screen IDs in Metro logs.
- Merchant sends Media-backed URLs without destructive image stripping or 413 retry. Backend publish failures are surfaced. Successful local release/deployment history is written only after canonical definition read-back matches version, screen IDs, slug, logo, and initial route.
- Removed best-effort runtime config/draft writes from publishing and duplicate editor post-publish writes. These could mask failures and bypass the documented publish boundary.
- Removed the misleading oversized-image success warning. A 413 now identifies manifest request size rather than recommending unnecessary image compression.

## Follow-up work

Actionable checklist and agent ownership: [Published logo and release mismatch TODO](PUBLISHED_LOGO_RELEASE_MISMATCH_TODO.md).

Existing completion checkboxes in `backend/BUILDER_MEDIA_API_BACKEND_TODO.md` conflict with both its later open tasks and current live evidence. Treat the read-path and public media items in the linked TODO file as unresolved. The ADR index also contains pre-existing merge conflict markers; this task does not alter accepted architecture.

References: `ARCHITECTURE/publishedApp-mobile-contract.md`, `ARCHITECTURE/publishing-pipeline.md`, `backend/BUILDER_MEDIA_API_BACKEND_TODO.md`.
## Validation

- Merchant: `npm test -- --silent --maxWorkers=1 --pool=forks` — 8 files / 68 tests passed. Initial thread-worker run encountered two startup timeouts; process-worker rerun completed cleanly.
- Merchant: `npm run build` — passed.
- Mobile: `npm test -- --runInBand __tests__/runtime/ManifestResolver.test.ts` — 4 tests passed.
- Mobile: `npm run lint` (`tsc --noEmit`) — passed after the final import change.
- Diff whitespace checks passed across all three repositories.
- No production publish or backend mutation was performed. Backend source is not present in this workspace; end-to-end remediation remains open.