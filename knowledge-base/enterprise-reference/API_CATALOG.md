# API Catalog

This document catalogs all API contracts in DUKADESK OS.

## APIs

| ID | Name | Service | Component | Specification | Status |
|----|------|---------|-----------|---------------|--------|
| API-001 | Authenticate User | SRV-001 Identity | CMP-001 Authentication Controller | SPEC-001 | Planned |
| API-002 | Get Tenant | SRV-002 Tenant | CMP-002 Tenant Controller | SPEC-002 | Planned |
| API-003 | Create Order | SRV-005 Orders | CMP-003 Commerce Controller | SPEC-003 | Planned |
| API-004 | Process Payment | SRV-004 Payments | CMP-003 Commerce Controller | SPEC-004 | Planned |

## API Relationships

| API | Depends On |
|-----|------------|
| API-002 Get Tenant | API-001 Authenticate User |
| API-003 Create Order | API-002 Get Tenant |
| API-004 Process Payment | API-001 Authenticate User, API-003 Create Order |

## Versioning

APIs follow [VERSIONING_STANDARD.md](../engineering-governance/repository-governance/VERSIONING_STANDARD.md).

## Maintenance

New APIs are registered when API specifications are approved.
