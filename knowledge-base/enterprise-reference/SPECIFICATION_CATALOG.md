# Specification Catalog

This document catalogs all engineering specifications in DUKADESK OS.

## Specifications

| ID | Name | Engineering Spec | Domain | Type | Repository | Status |
|----|------|------------------|--------|------|------------|--------|
| SPEC-001 | Authentication Architecture | SEC-0001 | DOM-001 Identity | Security | REP-001 Backend | Ready |
| SPEC-002 | Authorization and RBAC | SEC-0002 | DOM-001 Identity | Security | REP-001 Backend, REP-004..REP-006 | Ready |
| SPEC-003 | User Registration and Login | FEAT-0001 | DOM-001 Identity | Feature | REP-001 Backend, REP-004 Website, REP-002 Mobile, REP-005..REP-006 Dashboards | Ready |
| SPEC-004 | Tenant Lifecycle and Isolation | FEAT-0002 | DOM-002 Tenant | Feature | REP-001 Backend, REP-005..REP-006 Dashboards | Ready |
| SPEC-005 | Authentication API | API-0001 | DOM-001 Identity | API | REP-001 Backend, REP-007 SDK | Ready |
| SPEC-006 | Tenant Management API | API-0002 | DOM-002 Tenant | API | REP-001 Backend, REP-007 SDK | Ready |
| SPEC-007 | User and Identity Schema | DB-0001 | DOM-001 Identity | Database | REP-001 Backend | Ready |
| SPEC-008 | Tenant Schema | DB-0002 | DOM-002 Tenant | Database | REP-001 Backend | Ready |
| SPEC-009 | User Authentication Events | EVT-0001 | DOM-001 Identity | Event | REP-001 Backend | Ready |
| SPEC-010 | Tenant Lifecycle Events | EVT-0002 | DOM-002 Tenant | Event | REP-001 Backend | Ready |
| SPEC-011 | Website Foundation and Auth | UI-0001 | DOM-002 Tenant | UI | REP-004 Website | Ready |
| SPEC-012 | Mobile App Foundation and Auth | UI-0002 | DOM-002 Tenant | UI | REP-002 Mobile | Ready |
| SPEC-013 | Business Dashboard Shell | UI-0003 | DOM-002 Tenant | UI | REP-005 Business Dashboard | Ready |
| SPEC-014 | Tenant Dashboard Shell | UI-0004 | DOM-002 Tenant | UI | REP-006 Tenant Dashboard | Ready |

## Specification Relationships

| Specification | Implements |
|---------------|------------|
| SPEC-001 | ADR-001 |
| SPEC-002 | ADR-002 |
| SPEC-003 | SPEC-001, SPEC-005 |
| SPEC-004 | SPEC-002, SPEC-006 |
| SPEC-005 | SPEC-001 |
| SPEC-006 | SPEC-002, SPEC-004 |
| SPEC-011 | SPEC-003, SPEC-005 |
| SPEC-012 | SPEC-003, SPEC-005 |
| SPEC-013 | SPEC-002, SPEC-006 |
| SPEC-014 | SPEC-002, SPEC-005 |

## Source of Truth

The authoritative specification documents live in [engineering-specifications](../engineering-specifications/).

## Maintenance

This catalog is regenerated from the engineering-specifications registry.
