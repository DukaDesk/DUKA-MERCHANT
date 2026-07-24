# Database Catalog

This document catalogs all databases and storage entities in DUKADESK OS.

## Databases

| ID | Name | Domain | Service | Type | Repository | Status |
|----|------|--------|---------|------|------------|--------|
| DB-001 | Users | DOM-001 Identity | SRV-001 Identity | Relational | REP-003 Backend | Planned |
| DB-002 | Tenants | DOM-002 Tenant | SRV-002 Tenant | Relational | REP-003 Backend | Planned |
| DB-003 | Products | DOM-003 Commerce | SRV-003 Commerce | Relational | REP-003 Backend | Planned |
| DB-004 | Orders | DOM-005 Orders | SRV-005 Orders | Relational | REP-003 Backend | Planned |
| DB-005 | Payments | DOM-004 Payments | SRV-004 Payments | Relational | REP-003 Backend | Planned |
| DB-006 | Media Assets | DOM-006 Media | SRV-006 Media | Object Storage | REP-007 Infrastructure | Planned |
| DB-007 | Events | DOM-008 Runtime | SRV-008 Runtime | Event Store | REP-007 Infrastructure | Planned |
| DB-008 | Analytics | DOM-010 Analytics | SRV-010 Analytics | Data Warehouse | REP-007 Infrastructure | Planned |

## Database Relationships

| Database | Used By |
|----------|---------|
| DB-001 Users | DB-002 Tenants |
| DB-002 Tenants | DB-003 Products, DB-004 Orders |
| DB-004 Orders | DB-005 Payments |

## Maintenance

Database entries are added when database specifications are approved.
