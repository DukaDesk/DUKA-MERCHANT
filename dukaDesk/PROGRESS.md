# Merchant Project Progress

This file tracks the current state of the DukaDesk Merchant frontend and its backend integration.

**Last Updated:** 2026-09-11

## Active Work

| Task | Status | Notes |
|------|--------|-------|
| Backend endpoint migration | In Progress | Merchant app configuration and publishing use `/api/v1/app/merchants/*`; stale tenant/merchant endpoint assumptions remain in tests and restore paths. |
| Builder publishing contract | In Progress | Canvas editor data is compiled into the `PublishedApp` mobile contract before publishing. |
| Draft versus published lifecycle | In Progress | Autosave remains private draft state; only `publishProject` submits the compiled manifest to the backend publishing route. |
| Builder media integration | In Progress | Publish now uploads data-URL images through the Media API and emits CDN asset references; backend upload schema still needs confirmation. |
| Generated builder data | In Progress | Templates now include category-specific preview records and runtime data-binding hints; backend binding names still need confirmation. |

## Completed Milestones

| Date | Milestone | Notes |
|------|-----------|-------|
| 2026-09 | PublishedApp contract documented | Editor-only sections are compiled into runtime `layout.children`; published manifests require non-empty screens. |
| 2026-09 | Backend integration audit | Current Swagger routes and tenant-to-merchant naming inconsistencies were mapped. |
| 2026-09 | Builder Media publish flow | Data-URL images are materialized through the Media API before manifest publishing. |
| 2026-09 | Backend Media API TODO | Media upload, asset metadata, merchant isolation, CDN access, and generated-data contracts are tracked in the knowledge base. |

## Current Integration Contract

- Authenticated merchant configuration: `GET/PUT /api/v1/app/merchants/config`
- Authenticated merchant publish: `POST /api/v1/app/merchants/publish`
- Builder media: `POST/GET /api/v1/app/media`, plus asset CDN and delete routes
- Published app read path: backend reads the deployed compiled manifest
- Draft save path: local/editor state only until the backend provides a private Builder draft endpoint
- Manifest images: asset IDs and CDN URLs, never embedded base64 data

## Blockers

| Issue | Impact | Owner |
|-------|--------|-------|
| Media upload request/response schema is incomplete in Swagger | Frontend uses a flexible `file`/CDN response adapter until the exact contract is documented | Backend |
| Generated-data binding contract is not finalized | Builder templates cannot reliably connect preview data to production commerce/booking data | Backend / Builder |

## Next Up

- Implement the frontend Media API client after the backend upload contract is documented.
- Persist asset metadata and references in the design document.
- Replace publish-time base64 stripping with asset-reference validation.
- Add category-specific preview seed data and runtime bindings to `TemplateGenerator`.
- Update endpoint and publishing tests to match the current `/api/v1/app/*` contract.
- Run merchant frontend build, lint, and test verification.

## References

- `../knowledge-base/ARCHITECTURE/publishedApp-mobile-contract.md`
- `../knowledge-base/backend/BUILDER_MEDIA_API_BACKEND_TODO.md`
- `src/services/PublishingPipeline.js`
- `src/services/TemplateGenerator.js`
- `src/components/canvas-editor/DesignStore.js`
