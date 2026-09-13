# Reference Model

This document defines the core reference model and linking rules for the DUKADESK Enterprise Reference Model.

## Core Hierarchy

```text
Domain
    ↓
Services
    ↓
Components
    ↓
APIs
    ↓
Events
    ↓
Repositories
    ↓
Specifications
    ↓
Tasks
    ↓
Releases
```

## Entity Types

| Entity | Description | Identifier |
|--------|-------------|------------|
| Domain | Business or technical area | DOM-NNN |
| Service | Deployable capability | SRV-NNN |
| Component | Software building block | CMP-NNN |
| API | External contract | API-NNN |
| Event | Message or event type | EVT-NNN |
| Database | Storage entity | DB-NNN |
| Repository | Code repository | REP-NNN |
| Specification | Engineering specification | SPEC-NNN |
| ADR | Architecture decision | ADR-NNN |
| Work Item | Task or issue | TASK-NNN |
| AI Agent | AI agent definition | AGE-NNN |

## Linking Rules

1. Every entity must have a permanent identifier.
2. Every entity must link to its parent or owning entity.
3. Every entity may link to related entities.
4. Cross-domain links are allowed and must be documented.

## Relationship Types

| Type | Meaning |
|------|---------|
| owns | Parent owns child |
| depends-on | Entity requires another |
| consumes | Entity uses another |
| produces | Entity creates output for another |
| implements | Entity realizes a specification or ADR |
| related-to | Logical association |

## Example Graph

```text
DOM-001 Tenant
    owns SRV-004 Authentication
        owns CMP-017 Runtime Renderer
            implements API-143 Get Tenant
            produces EVT-088 TenantCreated
            uses DB-041 Tenant
            lives-in REP-003 Backend
            implements SPEC-229 Authentication
                has TASK-0001 Implement login
                    released-in R1.0
```

## Query Patterns

The ERM supports queries such as:

- What APIs are in the Tenant domain?
- Which repositories implement a specification?
- What tasks are blocking a release?
- Which components depend on a database?
- What is the blast radius of changing an API?

## Maintenance

- New entities are registered in the appropriate catalog.
- Links are updated when relationships change.
- Catalogs are regenerated from source systems where possible.
