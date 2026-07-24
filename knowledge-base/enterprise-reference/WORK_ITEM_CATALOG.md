# Work Item Catalog

This document catalogs engineering work items across DUKADESK OS.

## Work Items

| ID | Type | Title | Domain | Specification | Repository | Status | Owner |
|----|------|-------|--------|---------------|------------|--------|-------|
| EPIC-0001 | Epic | Wave 1 — Platform Foundation | DOM-001 Identity | SEC-0001 | Multiple | Ready | @engineering-lead |
| FEAT-0001 | Feature | Identity Foundation | DOM-001 Identity | SEC-0001 | REP-001 Backend | Ready | Team B |
| FEAT-0002 | Feature | Tenant Foundation | DOM-002 Tenant | FEAT-0002 | REP-001 Backend | Ready | Team E |
| FEAT-0003 | Feature | Authentication API | DOM-001 Identity | API-0001 | REP-001 Backend, REP-007 SDK | Ready | Team B |
| FEAT-0004 | Feature | Website Auth Flows | DOM-002 Tenant | UI-0001 | REP-004 Website | Ready | Team G |
| FEAT-0005 | Feature | Mobile Auth Flows | DOM-002 Tenant | UI-0002 | REP-002 Mobile | Ready | Team F |
| FEAT-0006 | Feature | Business Dashboard Shell | DOM-002 Tenant | UI-0003 | REP-005 Business Dashboard | Ready | Team H |
| FEAT-0007 | Feature | Tenant Dashboard Shell | DOM-002 Tenant | UI-0004 | REP-006 Tenant Dashboard | Ready | Team H |
| TASK-0001 | Task | Implement User Registration Service | DOM-001 Identity | SEC-0001 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0002 | Task | Implement Login and Token Issuance | DOM-001 Identity | SEC-0001 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0003 | Task | Implement Password Reset Flow | DOM-001 Identity | SEC-0001 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0004 | Task | Create User and Identity Schema | DOM-001 Identity | DB-0001 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0005 | Task | Implement Tenant Creation Service | DOM-002 Tenant | FEAT-0002 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0006 | Task | Implement Tenant Isolation | DOM-002 Tenant | FEAT-0002 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0007 | Task | Implement Tenant Settings | DOM-002 Tenant | FEAT-0002 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0008 | Task | Create Tenant Schema | DOM-002 Tenant | DB-0002 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0009 | Task | Implement Auth API Endpoints | DOM-001 Identity | API-0001 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0010 | Task | Implement Tenant API Endpoints | DOM-002 Tenant | API-0002 | REP-001 Backend | Ready | @agent-alpha |
| TASK-0011 | Task | Add API Contract Tests | DOM-001 Identity | API-0001 | REP-007 SDK | Ready | @agent-delta |
| TASK-0012 | Task | Implement Website Marketing Pages | DOM-002 Tenant | UI-0001 | REP-004 Website | Ready | @agent-eta |
| TASK-0013 | Task | Implement Website Auth Screens | DOM-001 Identity | UI-0001 | REP-004 Website | Ready | @agent-eta |
| TASK-0014 | Task | Add Website Auth E2E Tests | DOM-001 Identity | UI-0001 | REP-004 Website | Ready | @agent-eta |
| TASK-0015 | Task | Implement Mobile App Shell | DOM-002 Tenant | UI-0002 | REP-002 Mobile | Ready | @agent-zeta |
| TASK-0016 | Task | Implement Mobile Auth Screens | DOM-001 Identity | UI-0002 | REP-002 Mobile | Ready | @agent-zeta |
| TASK-0017 | Task | Add Mobile Auth E2E Tests | DOM-001 Identity | UI-0002 | REP-002 Mobile | Ready | @agent-zeta |
| TASK-0018 | Task | Implement Business Dashboard Shell | DOM-002 Tenant | UI-0003 | REP-005 Business Dashboard | Ready | @agent-theta |
| TASK-0019 | Task | Implement User Management Screens | DOM-001 Identity | UI-0003 | REP-005 Business Dashboard | Ready | @agent-theta |
| TASK-0020 | Task | Implement Tenant Settings Screens | DOM-002 Tenant | UI-0003 | REP-005 Business Dashboard | Ready | @agent-theta |
| TASK-0021 | Task | Implement Tenant Dashboard Shell | DOM-002 Tenant | UI-0004 | REP-006 Tenant Dashboard | Ready | @agent-iota |
| TASK-0022 | Task | Implement Profile Screen | DOM-001 Identity | UI-0004 | REP-006 Tenant Dashboard | Ready | @agent-iota |
| TASK-0023 | Task | Implement Settings Screen | DOM-002 Tenant | UI-0004 | REP-006 Tenant Dashboard | Ready | @agent-iota |

## Work Item Relationships

| Work Item | Depends On |
|-----------|------------|
| FEAT-0002 | FEAT-0001 |
| FEAT-0003 | FEAT-0001, FEAT-0002 |
| FEAT-0004 | FEAT-0003 |
| FEAT-0005 | FEAT-0003 |
| FEAT-0006 | FEAT-0002, FEAT-0003 |
| FEAT-0007 | FEAT-0002, FEAT-0003 |
| TASK-0002 | TASK-0001 |
| TASK-0003 | TASK-0001 |
| TASK-0004 | TASK-0001 |
| TASK-0005 | TASK-0001 |
| TASK-0006 | TASK-0005 |
| TASK-0007 | TASK-0005 |
| TASK-0009 | TASK-0001, TASK-0002 |
| TASK-0010 | TASK-0005, TASK-0006 |
| TASK-0011 | TASK-0009, TASK-0010 |
| TASK-0013 | TASK-0009 |
| TASK-0014 | TASK-0013 |
| TASK-0016 | TASK-0009, TASK-0015 |
| TASK-0017 | TASK-0016 |
| TASK-0019 | TASK-0018 |
| TASK-0020 | TASK-0010, TASK-0018 |
| TASK-0022 | TASK-0021 |
| TASK-0023 | TASK-0021 |

## Source of Truth

Authoritative work items live in [engineering-work](../engineering-work/).

## Maintenance

This catalog is regenerated from the engineering-work registry.
