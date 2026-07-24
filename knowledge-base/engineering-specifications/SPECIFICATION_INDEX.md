# Specification Index

This is the central register for all engineering specifications. Each entry is immutable once assigned and tracks its current lifecycle state, owner, and primary implementation target.

## Legend

| State | Meaning |
|-------|---------|
| Draft | Under construction |
| Review | Under peer review |
| Approved | Accepted but not yet scheduled |
| Ready | Scheduled and assigned |
| Implemented | Code complete |
| Verified | Tests and acceptance passed |
| Deprecated | Superseded or no longer recommended |
| Archived | Retained for historical reference only |

## Feature Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| FEAT-0001 | User Registration and Login | Ready | @product-architect | backend, website, mobile, dashboards |
| FEAT-0002 | Tenant Lifecycle and Isolation | Ready | @product-architect | backend, dashboards |

## API Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| API-0001 | Authentication API | Ready | @product-architect | backend, sdk |
| API-0002 | Tenant Management API | Ready | @product-architect | backend, sdk |

## UI Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| UI-0001 | Public Website Foundation and Authentication Flows | Ready | @product-architect | website |
| UI-0002 | Mobile App Foundation and Authentication Flows | Ready | @product-architect | mobile |
| UI-0003 | Business Dashboard Foundation and Shell | Ready | @product-architect | business-dashboard |
| UI-0004 | Tenant Dashboard Foundation and Shell | Ready | @product-architect | tenant-dashboard |

## Database Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| DB-0001 | User and Identity Schema | Ready | @product-architect | backend |
| DB-0002 | Tenant Schema | Ready | @product-architect | backend |

## Event Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| EVT-0001 | User Authentication Events | Ready | @product-architect | backend |
| EVT-0002 | Tenant Lifecycle Events | Ready | @product-architect | backend |

## Workflow Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| | | | | |

## Integration Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| | | | | |

## Security Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| SEC-0001 | Authentication Architecture and User Identity | Ready | @product-architect | backend, clients |
| SEC-0002 | Authorization and RBAC | Ready | @product-architect | backend, clients |

## Infrastructure Specifications

| ID | Title | State | Owner | Target Repository |
|----|-------|-------|-------|-------------------|
| | | | | |

## Allocation Blocks

| Prefix | Next Available | Allocation Owner |
|--------|----------------|------------------|
| FEAT | FEAT-0003 | Product Engineering Lead |
| API | API-0003 | Platform Architecture Lead |
| UI | UI-0005 | Design Engineering Lead |
| DB | DB-0003 | Data Architecture Lead |
| EVT | EVT-0003 | Platform Architecture Lead |
| SEC | SEC-0003 | Security Lead |
| WF | WF-0001 | Product Engineering Lead |
| INT | INT-0001 | Integration Lead |
| INFRA | INFRA-0001 | Infrastructure Lead |

## Registry Exports

The `registry/` directory contains machine-readable exports of this index for CI/CD and planning tools. Do not edit registry exports by hand; regenerate them from this index.
