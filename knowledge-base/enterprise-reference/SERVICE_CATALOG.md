# Service Catalog

This document catalogs all platform services in DUKADESK OS.

## Services

| ID | Name | Domain | Repository | Owner | Status |
|----|------|--------|------------|-------|--------|
| SRV-001 | Identity Service | DOM-001 Identity | REP-003 Backend | Team B | Planned |
| SRV-002 | Tenant Service | DOM-002 Tenant | REP-003 Backend | Team E | Planned |
| SRV-003 | Commerce Service | DOM-003 Commerce | REP-003 Backend | Team I | Planned |
| SRV-004 | Payment Service | DOM-004 Payments | REP-003 Backend | Team I | Planned |
| SRV-005 | Order Service | DOM-005 Orders | REP-003 Backend | Team I | Planned |
| SRV-006 | Media Service | DOM-006 Media | REP-003 Backend | Team I | Planned |
| SRV-007 | Notification Service | DOM-007 Notifications | REP-003 Backend | Team I | Planned |
| SRV-008 | Runtime Engine | DOM-008 Runtime | REP-007 Infrastructure | Team C | Planned |
| SRV-009 | Builder Engine | DOM-009 Builder | REP-004 Builder | Team D | Planned |
| SRV-010 | Analytics Service | DOM-010 Analytics | REP-003 Backend | Team J | Planned |
| SRV-011 | AI Platform | DOM-011 AI | REP-007 Infrastructure | Team J | Planned |

## Service Relationships

| Service | Depends On |
|---------|------------|
| SRV-002 Tenant | SRV-001 Identity |
| SRV-003 Commerce | SRV-002 Tenant |
| SRV-004 Payments | SRV-001 Identity, SRV-003 Commerce |
| SRV-005 Orders | SRV-003 Commerce, SRV-004 Payments |

## Catalog Maintenance

Update this catalog when services are added, retired, or change ownership.
