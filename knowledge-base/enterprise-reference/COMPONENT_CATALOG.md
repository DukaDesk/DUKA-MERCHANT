# Component Catalog

This document catalogs all software components in DUKADESK OS.

## Components

| ID | Name | Service | Repository | Owner | Status |
|----|------|---------|------------|-------|--------|
| CMP-001 | Authentication Controller | SRV-001 Identity | REP-003 Backend | Team B | Planned |
| CMP-002 | Tenant Controller | SRV-002 Tenant | REP-003 Backend | Team E | Planned |
| CMP-003 | Commerce Controller | SRV-003 Commerce | REP-003 Backend | Team I | Planned |
| CMP-004 | Runtime Renderer | SRV-008 Runtime | REP-007 Infrastructure | Team C | Planned |
| CMP-005 | Builder Canvas | SRV-009 Builder | REP-004 Builder | Team D | Planned |
| CMP-006 | SDK Core | - | REP-006 SDK | Team D | Planned |
| CMP-007 | CLI Core | - | REP-008 CLI | Team E | Planned |

## Component Relationships

| Component | Depends On |
|-----------|------------|
| CMP-002 Tenant Controller | CMP-001 Authentication Controller |
| CMP-003 Commerce Controller | CMP-002 Tenant Controller |
| CMP-005 Builder Canvas | CMP-006 SDK Core |
| CMP-007 CLI Core | CMP-006 SDK Core |

## Maintenance

Components are added when services or repositories are decomposed. Updates are made through specifications.
