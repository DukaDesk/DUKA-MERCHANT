# ADR Catalog

This document catalogs all Architecture Decision Records in DUKADESK OS.

## ADRs

| ID | Title | Domain | Status | Date |
|----|-------|--------|--------|------|
| ADR-001 | Event Bus Architecture | DOM-008 Runtime | Proposed | YYYY-MM-DD |
| ADR-002 | Multi-Tenant Data Isolation | DOM-002 Tenant | Proposed | YYYY-MM-DD |
| ADR-003 | Authentication Protocol | DOM-001 Identity | Proposed | YYYY-MM-DD |
| ADR-004 | Payment Provider Integration | DOM-004 Payments | Proposed | YYYY-MM-DD |

## ADR Relationships

| ADR | Affects |
|-----|---------|
| ADR-001 | SRV-008 Runtime, EVT-001..n |
| ADR-002 | DB-002 Tenant, SRV-002 Tenant |
| ADR-003 | SRV-001 Identity, API-001 |

## Source of Truth

Authoritative ADRs live in repository `docs/adr/` directories and the Knowledge Base.

## Maintenance

New ADRs are registered here upon approval.
