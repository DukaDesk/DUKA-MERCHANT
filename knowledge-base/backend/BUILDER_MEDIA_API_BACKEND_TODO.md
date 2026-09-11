# Builder Media and Data API — Backend TODO

> **Status:** OPEN — required by the DukaDesk Builder and Merchant app publishing flow

## Context

The Builder currently needs a backend contract for two related concerns:

1. Persisting images and other uploaded assets in the Media domain.
2. Serving structured commerce/booking data to generated Builder screens.

The current frontend uses the documented current-merchant routes:

- `POST /api/v1/app/media/upload`
- `GET /api/v1/app/media`
- `GET /api/v1/app/media/{id}/cdn-url`
- `DELETE /api/v1/app/media/{id}`
- `GET/PUT /api/v1/app/merchants/config`
- `POST /api/v1/app/merchants/publish`

The published application manifest must reference assets by stable IDs and URLs. It must not contain base64 image data or provider-specific bucket paths.

## Backend Requirements

### 1. Define the Media API contract

- [ ] Document the multipart field name for `POST /api/v1/app/media/upload`.
- [ ] Document accepted MIME types, maximum file size, and image dimension limits.
- [ ] Document optional fields such as `folderId`, `category`, `alt`, and `tags`.
- [ ] Define the upload response schema.
- [ ] Define the list response schema and pagination fields for `GET /api/v1/app/media`.
- [ ] Define the delete response and lifecycle behavior.
- [ ] Define the CDN URL response schema, including URL expiry if URLs are signed.
- [ ] Add OpenAPI request and response schemas for all Media endpoints.

### 2. Enforce merchant-scoped storage

- [ ] Store each asset in the authenticated merchant's isolated logical namespace.
- [ ] Derive ownership from the authenticated context; do not trust a client-supplied merchant or tenant ID.
- [ ] Keep the physical provider and bucket name behind the Media API abstraction.
- [ ] Return immutable asset IDs and metadata, not raw provider object keys as the application contract.
- [ ] Prevent cross-merchant list, read, update, and delete access.

### 3. Persist canonical asset metadata

Each asset response should expose, at minimum:

```json
{
  "id": "asset_uuid",
  "name": "hero.webp",
  "type": "image",
  "mimeType": "image/webp",
  "size": 245760,
  "width": 1200,
  "height": 600,
  "url": "https://cdn.example/hero.webp",
  "checksum": "sha256:...",
  "status": "active",
  "createdAt": "2026-09-10T00:00:00.000Z"
}
```

- [ ] Treat metadata as the source of truth for ownership, lifecycle, and access.
- [ ] Keep original uploads immutable; create transformed variants separately.
- [ ] Return a stable CDN/public locator or a documented signed URL strategy.
- [ ] Define orphan cleanup for assets no longer referenced by a saved design or published release.

### 4. Support Builder publishing

- [ ] Accept manifest asset references using asset IDs and resolved URLs.
- [ ] Reject or normalize base64/data URLs in publishable manifests.
- [ ] Validate that every referenced asset belongs to the current merchant and is active.
- [ ] Preserve asset references across release versions and rollback.
- [ ] Return clear validation errors for missing, deleted, or unauthorized assets.

### 5. Define generated-data contracts

Builder templates should generate data bindings and preview seed data, not create production records. Document the response shapes and current-merchant scope for:

- [ ] Commerce categories and products, including product image references.
- [ ] Booking services, staff, schedules, and availability.
- [ ] Orders and order status data.
- [ ] Events, announcements, or other vertical-specific records.
- [ ] Pagination, filtering, sorting, and empty-state behavior.
- [ ] The supported data-binding format consumed by the runtime.

Generated screens must be able to bind to backend data without embedding business data directly into the manifest.

## Acceptance Criteria

- [ ] Swagger documents complete request and response schemas for Media endpoints.
- [ ] An authenticated merchant can upload, list, resolve, and delete only its own assets.
- [ ] The frontend can save a design containing asset IDs without base64 image data.
- [ ] A published manifest validates all asset references and renders images through documented URLs.
- [ ] Asset URLs remain valid or can be refreshed through the documented CDN URL endpoint.
- [ ] Generated commerce and booking screens use documented data bindings and response shapes.
- [ ] Backend tests cover ownership isolation, invalid uploads, deleted assets, and publish-time reference validation.

## Architectural References

- `ARCHITECTURE/domains/media.md`
- `ARCHITECTURE/KB-080-file-object-storage-architecture.md`
- `ARCHITECTURE/KB-075-storage-architecture.md`
- `ARCHITECTURE/application-manifest-specification.md`
- `ARCHITECTURE/builder-studio.md`
- `SPECIFICATIONS/backend-data-model.md`
