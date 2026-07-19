# Backend Architecture Alignment

This document records the architectural constraints and decisions that guide backend development.

## Approved ADRs

| ADR | Title | Status |
|-----|-------|--------|
| | | |

## Design Principles

- Domain-driven design
- API-first development
- Event-driven communication where appropriate
- Secure by default

## Patterns

- Repository pattern for data access
- Service layer for business logic
- Middleware for cross-cutting concerns
- Structured logging and distributed tracing

## Constraints

- All public APIs must be documented by an API specification.
- All database changes must be versioned migrations.
- Secrets must not be committed or logged.

## Alignment Verification

Before merging, confirm:

- [ ] Changes align with approved ADRs.
- [ ] Changes follow repository patterns.
- [ ] Changes respect listed constraints.
