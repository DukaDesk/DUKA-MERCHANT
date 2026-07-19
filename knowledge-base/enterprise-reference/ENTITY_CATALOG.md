# Entity Catalog

This document defines all entity types in the DUKADESK Enterprise Reference Model.

## Entity Types

| ID | Entity Type | Description | Identifier Prefix | Catalog |
|----|-------------|-------------|-------------------|---------|
| ENT-001 | Domain | Business or technical area | DOM | [DOMAIN_CATALOG.md](DOMAIN_CATALOG.md) |
| ENT-002 | Service | Deployable platform capability | SRV | [SERVICE_CATALOG.md](SERVICE_CATALOG.md) |
| ENT-003 | Component | Software building block | CMP | [COMPONENT_CATALOG.md](COMPONENT_CATALOG.md) |
| ENT-004 | API | External contract | API | [API_CATALOG.md](API_CATALOG.md) |
| ENT-005 | Event | Message or event type | EVT | [EVENT_CATALOG.md](EVENT_CATALOG.md) |
| ENT-006 | Database | Storage entity | DB | [DATABASE_CATALOG.md](DATABASE_CATALOG.md) |
| ENT-007 | Repository | Code repository | REP | [REPOSITORY_CATALOG.md](REPOSITORY_CATALOG.md) |
| ENT-008 | Specification | Engineering specification | SPEC | [SPECIFICATION_CATALOG.md](SPECIFICATION_CATALOG.md) |
| ENT-009 | ADR | Architecture decision | ADR | [ADR_CATALOG.md](ADR_CATALOG.md) |
| ENT-010 | Work Item | Task, bug, spike, or epic | TASK | [WORK_ITEM_CATALOG.md](WORK_ITEM_CATALOG.md) |
| ENT-011 | AI Agent | AI agent definition | AGE | [AI_AGENT_CATALOG.md](AI_AGENT_CATALOG.md) |

## Entity Metadata

Every entity records:

| Field | Description |
|-------|-------------|
| ID | Permanent identifier |
| Name | Human-readable name |
| Type | Entity type |
| Owner | Responsible owner |
| Status | Current state |
| Description | Brief description |
| Relationships | Links to other entities |

## Identifier Allocation

Identifiers are allocated sequentially and never reused. Each catalog maintains its own numbering.

## Extending the Model

New entity types require:

- A new entry in this catalog
- A new catalog document
- Updated relationship rules in [REFERENCE_MODEL.md](REFERENCE_MODEL.md)
