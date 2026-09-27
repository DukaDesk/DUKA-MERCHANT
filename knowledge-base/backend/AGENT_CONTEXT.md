# Backend Agent Context

## Overview

The `backend/` repository contains the core server-side platform for DUKADESK OS. It exposes REST APIs, manages business logic, handles events, and coordinates data persistence.

**Implementation Repository:** [DUKA-BACKEND](https://github.com/DukaDesk/DUKA-BACKEND)
**KB Version:** 0.3.8
**Last Updated:** 2026-09-27

## Responsibilities

- Core business logic and domain services
- REST API endpoints (~428 endpoints across 32 modules)
- Three-tier architecture: Website (Platform), App (Tenant Self-Service), Mobile (Consumer)
- Authentication and authorization (JWT, OAuth 2.0)
- Event publishing and consumption (Bull/Redis queues)
- Database access and migrations (Prisma + PostgreSQL)
- File uploads, processing, and CDN delivery (Sharp)
- Integration with external services (Stripe, SendGrid, Google Calendar, etc.)
- AI platform provider orchestration (Anthropic, OpenAI, etc.)

## Non-Responsibilities

- Frontend rendering
- Mobile-specific logic
- CLI user interface
- Infrastructure provisioning

## Technology Stack

- **Language:** TypeScript 6.x (Node.js)
- **Framework:** NestJS v11.x
- **Database:** PostgreSQL 16 (via Prisma ORM 6.x)
- **Messaging:** Bull (Redis-backed job queues)
- **Cache:** Redis (via ioredis)
- **Auth:** Passport.js (JWT, Google OAuth 2.0, Apple Sign-In)
- **Validation:** class-validator + class-transformer
- **Logging:** Pino (nestjs-pino)
- **Image Processing:** Sharp
- **API Docs:** Swagger/OpenAPI (@nestjs/swagger)
- **Testing:** Jest + Supertest
- **Linting:** ESLint 10.x + Prettier
- **Containerization:** Docker + Docker Compose

## Repository Structure

```
d
  src/                        # Source code
    main.ts                   # Application entry point
    app.module.ts             # Root module
    common/                   # Shared utilities, guards, interceptors, filters
    modules/                  # Domain modules (auth, tenants, commerce, etc.)
    bff/                      # Backend-for-frontend modules (website, mobile, etc.)
  prisma/
    schema.prisma             # Database schema (~2070 lines)
    seed.ts                   # Seed data
  test/                       # E2E test suites
  docs/                       # Repository documentation
  scripts/                    # Automation scripts
  Dockerfile
  docker-compose.yml
  AGENT_CONTEXT.md
  README.md
```

## Build and Test

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application |
| `npm run start:dev` | Start in watch mode |
| `npm run start:prod` | Start production build |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Lint source code |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run predeploy` | Railway pre-deploy: `prisma migrate deploy && prisma db seed` (keep both inside one npm script — a raw `&&` string in `preDeployCommand` only ran the first command) |
| `railway run node scripts/audit-active-release.js` | Read-only production audit: ledger, `activeReleaseId`, backfill, pointers, manifests, counts (retries transient proxy drops) |
| `GET /api/v1/compatibility` | Machine-readable runtime contract (B7): supported manifest versions, component/action/capability catalogs, asset kinds, limits |
| `POST /api/v1/merchants/:id/publishing/preflight` | Merchant compatibility dry-run (B7): `{valid, compatible, errors, warnings, counts}`, never publishes |

## Engineering Standards

- [Repository Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/REPOSITORY_STANDARD.md)
- [Branching Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/BRANCHING_STANDARD.md)
- [Versioning Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/VERSIONING_STANDARD.md)
- [Pull Request Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/PR_STANDARD.md)
- [Review Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/REVIEW_STANDARD.md)
- [Release Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/RELEASE_STANDARD.md)
- [AI Context Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/AI_CONTEXT_STANDARD.md)
- [Boot Process Standard](/DukaDesk/KNOWLEDGE-BASE/blob/main/engineering-governance/repository-governance/BOOT_PROCESS_STANDARD.md)

## Specification Traceability

Specifications that target this repository:

| Specification | Title | State |
|--------------|-------|-------|
| KB v0.1.0 | Knowledge Base v0.1.0 | Superseded |
| KB v0.2.0 | Three-tier API Architecture | Active |
| KB v0.2.1 | App/Public Split + Dashboard | Active |
| KB v0.3.8 | Published app delivery B1–B6 | Active (B4 + B7 applied in prod 2026-09-27; B8 evidence pending) |

## Agent Conventions

- Reference engineering specifications by ID in commits and pull requests.
- Prefer domain-driven design patterns for new services.
- Validate all inputs and protect secrets.
- Add tests for new behavior and bug fixes.
- Update this context when responsibilities or structure change.
- Use Swagger decorators for all new endpoints.

## Common Tasks

- **Add an API endpoint:** create DTO → service method → controller method → add tests → document with Swagger.
- **Add a database migration:** update schema.prisma → run `prisma:migrate` → test rollback.
- **Consume or publish an event:** add queue producer/consumer using Bull.
- **Integrate a new provider:** implement adapter interface, register in provider registry.

## Escalation

Stop and ask for human input when:

- A change conflicts with an approved ADR.
- A security-critical decision is required.
- A breaking change affects multiple repositories.
- A new external dependency is required.


2026-09-20: Backend checkout inspected; live read paths still expose an unversioned definition and nested v0.0.7. Confirmed array-only publish validation, duplicate-release path, cache/rollback and WebP deletion defects. [Cross-stack fix plan](../ARCHITECTURE/PUBLISHED_APP_DELIVERY_FIX_PLAN_2026-09-20.md); separate stack TODOs linked there. Status: planned, implementation open.

2026-09-24: B1–B3, B5–B6 landed on DUKA-BACKEND main (commit `00baea3`): `ManifestValidator`, atomic activation + `activeReleaseId`, shared `ActiveReleaseService`, owner/manager authz, media folderId + storage URLs, default merchant app seed, `ApiQuotaGuard`, 5 unit suites (38 tests). B4 migration file written (not applied); B7 compatibility contract and B8 live integration evidence remain open. Tasks: [Published app delivery backend TODO](PUBLISHED_APP_DELIVERY_BACKEND_TODO.md).

2026-09-27: B4 completed in production. The first `migrate deploy` (2026-09-25, `a10c79c6`) failed P3018/23502 because `20260827120000_seed_admin` omitted `users.updatedAt` and production had been managed with `db push` (no `_prisma_migrations` baseline). Recovery: fix in `edb4b86`, 7× `migrate resolve --applied`, stale rolled-back duplicate row deleted, `20260924000000_add_active_release` applied on deploy `a00865ae` (backfill 0 rows — `releases` empty), then two deploy-path defects fixed (`preDeployCommand` chain via `npm run predeploy`; `tsconfig.json` copied into the runner image so the seed stops failing with `ERR_UNKNOWN_FILE_EXTENSION`). Seed now runs (3 templates, `acme-store`), audit 0 errors, health 200. Evidence: DUKA-BACKEND `docs/B4_MIGRATION_RUNBOOK.md`. Remaining: B7 contract, B8 merchant re-publish + live evidence.

2026-09-27 (later): **B7 landed, deploy `717d7d8d`.** `src/shared/compatibility/` publishes contract `dukadesk.published-app-runtime` 1.0.0 at `GET /api/v1/compatibility` (anonymous): manifest versions `1.0.0|1.0`, 35 component types, 10 action types, 16 capabilities, asset kinds, limits. `POST /api/v1/merchants/:id/publishing/preflight` (owner/manager) dry-runs a manifest or the drafts compiled with `persist:false` and always returns 200 with `{valid, compatible, errors, warnings, counts}`. `PublishingService` asserts the contract before version allocation and activation in both paths → 422 `INCOMPATIBLE_RUNTIME` (unknown component, unresolvable/cross-tenant media id, unknown required capability, unsupported schema version, limits); unknown action types are warnings on the publish receipt. Discovery filters `activeReleaseId != null` and projects `release {id, version, checksum, channel, publishedAt}` (currently `[]` until merchants re-publish). Catalogs verified against the real KB fixtures and the production `components`/`sections` inventory. Gate: lint 0 errors, 58 tests, tsc 0 issues. Remaining: B8.
