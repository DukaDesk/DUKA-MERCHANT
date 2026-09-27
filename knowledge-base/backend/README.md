# Backend

Core server-side platform for DUKADESK OS. Multi-tenant Backend-as-a-Platform (BaaP) powering the DUKADESK ecosystem.

**KB Version:** 0.3.8  
**Last Updated:** 2026-09-24

## Current State

- **~428 endpoints** across 32 modules
- **85+ Prisma models** (2073 lines)
- **Three-tier architecture:** Website (Platform), App (Tenant Self-Service), Mobile (Consumer)
- **Completion rate:** ~84/100
- **Published app delivery:** B1–B6 code complete (unit-tested); **B4 migration applied in production 2026-09-27** (audit clean); **B7 compatibility contract + merchant preflight live 2026-09-27** (`GET /api/v1/compatibility`); B8 live integration evidence pending — [delivery TODO](PUBLISHED_APP_DELIVERY_BACKEND_TODO.md)

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 (Node.js + TypeScript 6, SWC builder) |
| ORM | Prisma 6.19 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 (ioredis, in-memory mock fallback) |
| Auth | JWT, Google OAuth, Apple Sign-In |
| Queue | Bull (5 queues) |
| Validation | class-validator + class-transformer |
| API Docs | Swagger/OpenAPI |
| Logging | nestjs-pino |
| Deployment | Docker + Railway |

## Getting Started

```bash
# Start infrastructure
docker compose up -d

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed
npx prisma db seed

# Start dev server
npm run start:dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application |
| `npm run start:dev` | Start in watch mode |
| `npm run start:prod` | Start production build |
| `npm run lint` | Lint + auto-fix |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |

## Documentation

- [Agent Context](AGENT_CONTEXT.md)
- [API Endpoints Reference](api-endpoints-reference.md)
- [Progress](PROGRESS.md)
- [Architecture Alignment](ARCHITECTURE_ALIGNMENT.md)
- [Builder, Media, Templates, and Publishing TODO](BUILDER_MEDIA_API_BACKEND_TODO.md)
- [Published App Delivery Backend TODO](PUBLISHED_APP_DELIVERY_BACKEND_TODO.md)
- [Published Logo / Release Mismatch TODO](PUBLISHED_LOGO_RELEASE_MISMATCH_TODO.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## License

See LICENSE file.
