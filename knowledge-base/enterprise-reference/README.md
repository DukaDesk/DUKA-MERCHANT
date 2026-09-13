# DUKADESK Enterprise Reference Model

This repository is the metadata model of the entire DUKADESK OS engineering organization.

## Purpose

The Enterprise Reference Model (ERM) is **not documentation**. It is the knowledge graph that ties every entity in the engineering organization together. Everything references this model.

## Repository Structure

```text
enterprise-reference/
  README.md                       # This file
  REFERENCE_MODEL.md              # Core reference model and linking rules
  ENTITY_CATALOG.md               # Entity types and identifiers
  DOMAIN_CATALOG.md               # Business and technical domains
  SERVICE_CATALOG.md              # Platform services
  COMPONENT_CATALOG.md            # Software components
  API_CATALOG.md                  # API contracts
  EVENT_CATALOG.md                # Event and message types
  DATABASE_CATALOG.md             # Databases and storage
  REPOSITORY_CATALOG.md           # Implementation repositories
  SPECIFICATION_CATALOG.md        # Engineering specifications
  ADR_CATALOG.md                  # Architecture Decision Records
  WORK_ITEM_CATALOG.md            # Engineering work items
  AI_AGENT_CATALOG.md             # AI agents and roles
```

## Final Operating System

```text
Enterprise Reference Model
        ↓
Master Plan
        ↓
Knowledge Base
        ↓
Engineering Specifications
        ↓
Engineering Governance
        ↓
Engineering Work
        ↓
Implementation
```

## Identifier Schemes

| Entity | Prefix | Example |
|--------|--------|---------|
| Domain | DOM | DOM-001 |
| Service | SRV | SRV-004 |
| Component | CMP | CMP-017 |
| API | API | API-143 |
| Database | DB | DB-041 |
| Event | EVT | EVT-088 |
| Repository | REP | REP-003 |
| Specification | SPEC | SPEC-229 |
| ADR | ADR | ADR-014 |
| Work Item | TASK | TASK-0001 |
| AI Agent | AGE | AGE-001 |

## Platform Graph

The ERM enables queries like:

> "Show everything related to Tenant."

```text
Tenant Domain
    ↓
Tenant APIs
    ↓
Tenant Database
    ↓
Tenant Events
    ↓
Tenant Specifications
    ↓
Repositories
    ↓
Tasks
    ↓
Open Bugs
    ↓
Releases
```

## Completeness

After this repository, the engineering organization is self-sustaining. New repositories, features, and agents plug into this existing system without requiring new foundational artifacts.
