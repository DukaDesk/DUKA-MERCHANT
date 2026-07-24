# Event Catalog

This document catalogs all event and message types in DUKADESK OS.

## Events

| ID | Name | Service | Producer | Consumer | Specification | Status |
|----|------|---------|----------|----------|---------------|--------|
| EVT-001 | UserAuthenticated | SRV-001 Identity | CMP-001 | Multiple | SPEC-005 | Planned |
| EVT-002 | TenantCreated | SRV-002 Tenant | CMP-002 | Multiple | SPEC-006 | Planned |
| EVT-003 | OrderPlaced | SRV-005 Orders | CMP-003 | SRV-007, SRV-010 | SPEC-007 | Planned |
| EVT-004 | PaymentProcessed | SRV-004 Payments | CMP-003 | SRV-005, SRV-010 | SPEC-008 | Planned |

## Event Relationships

| Event | Triggered By |
|-------|--------------|
| EVT-002 TenantCreated | API-002 Get Tenant / Create Tenant |
| EVT-003 OrderPlaced | API-003 Create Order |
| EVT-004 PaymentProcessed | API-004 Process Payment |

## Schema

Event schemas are defined in engineering specifications and validated through contract tests.

## Maintenance

New events are registered when event specifications are approved.
