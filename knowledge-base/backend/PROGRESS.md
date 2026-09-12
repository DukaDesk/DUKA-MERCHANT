# Backend Progress

This file tracks the current state of the backend implementation repository.

**KB Version:** 0.1.0
**Last Updated:** 2026-09-11

## Active Work

| Task | Specification | Status | Owner |
|------|---------------|--------|-------|
| API endpoint implementation (390 endpoints) | KB v0.1.0 | In Progress | Engineering |
| Phase 3 gap-filling (Theme, Commerce, Booking, Notifications, Payments) | KB v0.1.0 | Complete | Engineering |
| Builder Media and generated-data contract | KB-080, KB-042, Builder Media API TODO | Blocked | Backend / Builder |
| Backend-managed template manifests | Builder Media API TODO, KB-042 | Planned | Backend / Builder |
| Builder draft versus published lifecycle | KB-042, Builder Media API TODO | Planned | Backend / Builder |

## Completed Milestones

| Date | Milestone | Notes |
|------|-----------|-------|
| 2026-07 | Phase 2 — Core Platform | Auth, IAM, Tenants, Builder, Commerce, Media |
| 2026-07 | Phase 2.5 — Notification Platform | Templates, campaigns, SMS, push, analytics |
| 2026-07 | Phase 3a — Gap Filling | Theme module, Commerce unified catalog + inventory, Booking locations/reminders/cancellation policies |
| 2026-07 | Phase 3b — Adapters & Connectors | Email/Push/Stripe adapters, Anthropic provider, SendGrid & Google Calendar connectors |
| 2026-07 | Deployment Readiness | Dockerfile, CI/CD pipeline, health checks, Railway config |
| 2026-07 | Profile Deactivation & Deletion | 30-day soft deactivation flow, hard delete for GDPR/Apple/Google, admin cleanup endpoint, BFF mobile endpoints |
| 2026-09 | Merchant Builder integration review | Current `/api/v1/app/*` routes reconciled with the Merchant frontend; PublishedApp compilation contract documented |

## Modules Implemented

| # | Module | Status | Endpoints |
|---|--------|--------|-----------|
| 1 | Auth & IAM | Complete | 14 |
| 2 | Profile & Users | Complete | 10 |
| 3 | Tenants | Complete | 11 |
| 4 | Templates | Complete | 3 |
| 5 | Builder (SDUI) | Complete | 19 |
| 6 | Renderer | Complete | 2 |
| 7 | Commerce | Complete | 42 |
| 8 | Media / DAM | Complete* | 10 |
| 9 | QR Codes | Complete | 2 |
| 10 | Discovery | Complete | 4 |
| 11 | Admin | Complete | 5 |
| 12 | Notifications | Complete | 19 |
| 13 | Publishing | Complete | 6 |
| 14 | Booking & Scheduling | Complete | 35 |
| 15 | Forms & Workflow | Complete | 10 |
| 16 | Payments | Complete | 12 |
| 17 | Theme | Complete | 8 |
| 18 | Integrations | Complete | 10 |
| 19 | Analytics & BI | Complete | 23 |
| 20 | Search & Discovery | Complete | 11 |
| 21 | AI Platform | Complete | 13 |
| 22 | Platform Administration | Complete | 27 |
| 23 | Infrastructure & DevOps | Complete | 18 |
| 24 | Security & Compliance | Complete | 11 |
| 25 | Developer Platform | Complete | 16 |
| 26 | Marketplace & Plugins | Complete | 13 |
| 27 | Asset Platform Enhanced | Complete | 17 |
| 28 | BFF - Website | Complete | 3 |
| 29 | BFF - Tenant Dashboard | Complete | 3 |
| 30 | BFF - Mobile | Complete | 9 |
| 31 | BFF - Business Dashboard | Complete | 3 |
| 32 | Health | Complete | 1 |
| | **TOTAL** | | **390** |

## Blockers

| Issue | Impact | Owner |
|-------|--------|-------|
| Media upload request/response contract is incomplete in Swagger | Merchant Builder cannot safely persist asset IDs, metadata, or CDN references | Backend |
| Generated-data binding contract is not finalized | Merchant Builder templates cannot reliably connect preview data to production commerce/booking data | Backend / Builder |

## Next Up

- E2E integration tests for all modules
- Rate limiting and throttling configuration
- API versioning strategy (v2 planning)
- Performance optimization and query tuning
- Monitoring and alerting setup
- Document Media upload field, response schemas, limits, CDN URL behavior, and merchant isolation; see [Builder Media and Data API TODO](BUILDER_MEDIA_API_BACKEND_TODO.md)
- Document generated-data binding and preview seed-data contracts for Builder screens
- Implement persisted, validated template manifests and catalog retrieval for the Merchant Builder; see [Builder Media and Data API TODO](BUILDER_MEDIA_API_BACKEND_TODO.md)
- Add private Builder draft persistence that cannot affect mobile until an explicit publish succeeds

\* Media/DAM endpoints exist, but the Builder integration contract and OpenAPI schemas remain open.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js / TypeScript 6.x |
| Framework | NestJS v11.x |
| Database | PostgreSQL 16 |
| ORM | Prisma 6.x |
| Queue | Bull (Redis) |
| Cache | Redis (ioredis) |
| Auth | Passport.js (JWT, Google, Apple) |
| API Docs | Swagger / OpenAPI |
| Logging | Pino |
| Testing | Jest + Supertest |
| Container | Docker + Docker Compose |

## Deployment

- **Platform:** Railway (via `railway.json`)
- **Health check:** `/api/v1/health`
- **Build command:** `npm run build`
- **Start command:** `npm run start:prod`
