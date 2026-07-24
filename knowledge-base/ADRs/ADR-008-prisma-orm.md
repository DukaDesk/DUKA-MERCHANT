# ADR-008: Prisma ORM with PostgreSQL

**Status:** ✅ Accepted  
**Date:** 2026-07-01  
**Author:** Architecture Team

## Context

The backend requires an ORM that provides type-safe database access, migration management, and excellent developer experience. The data model spans 60+ models across IAM, Tenants, Commerce, Booking, Payments, Notifications, and more.

## Decision

Use **Prisma ORM v6** with **PostgreSQL 16**:

- Prisma Client provides fully typed queries
- Prisma Migrate handles schema versioning
- PostgreSQL is chosen for reliability, JSON support, and managed DB availability on Railway

### Schema Organization

All models live in a single `schema.prisma` file (2070 lines), organized by domain:
- Phase 0: Infrastructure (roles, permissions, users, devices)
- Phase 1: Platform (tenants, pages, sections, components, themes)
- Phase 2: Domain (commerce, booking, forms, payments, notifications)
- Phase 3: Advanced (integrations, analytics, search, AI, security, developer)
- Phase 4: Ecosystem (marketplace, assets enhanced, infrastructure)

### Seed Data

The seed script (`prisma/seed.ts`) uses `upsert` for idempotency:
- 4 platform roles (super_admin, support, operations, finance)
- 20 permissions (tenant:*, user:*, product:*, order:*, payment:*, analytics:*, settings:*)
- 3 subscription plans (Starter/Business/Enterprise) with feature flags
- 3 payment providers (Flutterwave, Paystack, Stripe)

## Consequences

- Fully typed queries — no runtime SQL errors from typos
- Migrations are version-controlled and reproducible
- Single schema file is manageable at current scale; could be split if growth requires
- Seed data is safe to run on every deploy (upsert-based)

## Status

Accepted. Prisma v6.19.3 in production. Schema has 60+ models, 30+ indexes, and full relation mapping.
