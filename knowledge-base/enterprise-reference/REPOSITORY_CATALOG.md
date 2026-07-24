# Repository Catalog

This document catalogs all implementation repositories in DUKADESK OS.

## Repositories

| ID | Name | Domain | Owner | Status | Path |
|----|------|--------|-------|--------|------|
| REP-001 | Backend | DOM-002 Tenant | Team E | Planned | backend/ |
| REP-002 | Mobile | DOM-002 Tenant | Team F | Planned | mobile/ |
| REP-003 | Builder | DOM-009 Builder | Team D | Planned | builder/ |
| REP-004 | Website | DOM-002 Tenant | Team G | Planned | website/ |
| REP-005 | Business Dashboard | DOM-002 Tenant | Team H | Planned | business-dashboard/ |
| REP-006 | Tenant Dashboard | DOM-002 Tenant | Team H | Planned | tenant-dashboard/ |
| REP-007 | SDK | DOM-009 Builder | Team D | Planned | sdk/ |
| REP-008 | CLI | DOM-008 Runtime | Team E | Planned | cli/ |
| REP-009 | Infrastructure | DOM-012 Infrastructure | Team A | Planned | infrastructure/ |

## Repository Dependencies

| Repository | Depends On |
|------------|------------|
| REP-001 Backend | REP-009 Infrastructure |
| REP-002 Mobile | REP-007 SDK, REP-001 Backend |
| REP-003 Builder | REP-007 SDK, REP-001 Backend |
| REP-004 Website | REP-007 SDK, REP-001 Backend |
| REP-005 Business Dashboard | REP-007 SDK, REP-001 Backend |
| REP-006 Tenant Dashboard | REP-007 SDK, REP-001 Backend |
| REP-007 SDK | REP-001 Backend |
| REP-008 CLI | REP-007 SDK |

## Maintenance

New repositories are registered here before development begins.
