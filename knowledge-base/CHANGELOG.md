# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Backend B7 completed in production (2026-09-27): runtime contract `GET /api/v1/compatibility`, merchant preflight `POST /merchants/:id/publishing/preflight`, activation gate (422 `INCOMPATIBLE_RUNTIME`), discovery release-identity projection.
- Backend B4 completed in production (2026-09-27): migration `20260924000000_add_active_release` applied (backfill 0 rows), read-only audit `scripts/audit-active-release.js`, recovery runbook DUKA-BACKEND `docs/B4_MIGRATION_RUNBOOK.md`, `package.json` `predeploy` script.
- Backend published-app delivery B1–B6 (2026-09-24): `ActiveReleaseService`, `ManifestValidator`, atomic release activation + `activeReleaseId`, Idempotency-Key, media folderId resolution, default merchant app seed, `ApiQuotaGuard`, unit test suites.
- DUKADESK Platform Definition (PD-001–PD-013) in `platform-definition/`.
- DUKADESK Platform Constitution (KB-C001–KB-C009) in `dukadesk-constitution/`.
- Engineering governance consolidation under `engineering-governance/`.
- Repository Bootstrap standard (KB-141) and templates.
- `AGENT_CONTEXT.md`, `ARCHITECTURE_ALIGNMENT.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `PROGRESS.md`, `CODEOWNERS`, and `LICENSE`.
- Standard directories `docs/`, `tests/`, `scripts/`, and `.github/`.

### Changed

- `backend/PUBLISHED_APP_DELIVERY_BACKEND_TODO.md`: **B4 and B7 ticked** (both live in production 2026-09-27); B8 is the only open release gate.
- Deploy-path fixes recorded in `backend/PROGRESS.md` + `backend/AGENT_CONTEXT.md`: `preDeployCommand` → `npm run predeploy`, `tsconfig.json` copied to the runner image.
- `backend/PUBLISHED_APP_DELIVERY_BACKEND_TODO.md`: B1, B2, B3, B5, B6 ticked; press-action round-trip checks ticked; B4/B7/B8 partial with notes.
- `backend/BUILDER_MEDIA_API_BACKEND_TODO.md`: media folderId + publish-manifest + default seed items ticked (35/39).
- `backend/PROGRESS.md` bumped to KB 0.3.8.

## [0.1.0] - 2026-07-12

### Added

- Initial DUKADESK Engineering Knowledge Base structure.
- Core principles, glossary, naming standards, and engineering standards.
- Architecture Decision Records ADR-001 through ADR-006.
- Platform architecture documents KB-005 through KB-140 (various completion states).
- Mobile specification and early implementation artifacts.

[Unreleased]: https://github.com/dukadesk/DUKADESK-OS/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/dukadesk/DUKADESK-OS/releases/tag/v0.1.0
