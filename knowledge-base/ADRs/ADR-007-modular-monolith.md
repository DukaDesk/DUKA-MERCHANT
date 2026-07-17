# ADR-007: Modular Monolith Architecture

**Status:** ✅ Accepted  
**Date:** 2026-07-01  
**Author:** Architecture Team

## Context

The backend needs to support 25+ domain modules (auth, tenants, commerce, booking, payments, etc.). Early-stage startups benefit from a single deployable unit, but the architecture must allow future extraction into microservices without rewrites.

## Decision

Use a **modular monolith** pattern in NestJS:

- All modules live in a single NestJS application
- Each module has its own controller, service, DTOs, and providers
- Cross-module communication uses the shared EventBus (in-process pub/sub)
- Global modules (IAM, Redis, Queue, RBAC, Logger, TenantContext) are `@Global()`
- Domain modules only import what they need — no circular dependencies

### Structure

```
src/
├── common/          # Shared infrastructure (Prisma, Redis, Logger, Guards, Decorators)
├── shared/          # Cross-module features (Events, Context, Queue)
├── gateway/         # Rate limiter
├── bff/             # Backend-for-Frontend (Mobile, Dashboards, Website)
└── modules/         # Domain modules (auth, tenants, commerce, booking, ...)
```

### Extraction Path

To extract a module into a microservice:
1. Wrap the module in its own NestJS application
2. Replace EventBus calls with message broker (RabbitMQ/Kafka) events
3. Add the new service's API gateway route

## Consequences

- Single deployable unit simplifies CI/CD and DevOps
- Modules remain decoupled — no direct service-to-service calls
- EventBus provides a migration path to event-driven microservices
- Global modules are available everywhere without explicit imports

## Status

Accepted. Implemented with 25+ modules in production on Railway.
