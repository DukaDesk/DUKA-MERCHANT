---
identifier: DB-0000
status: Draft
domain: Database
created: YYYY-MM-DD
author: @author
---

# DB-0000: Title

## Identifier

DB-0000

## Title

Database or storage specification title.

## Purpose

What data this specification defines and why it matters.

## Problem

The data model, storage, or performance problem being solved.

## Scope

### In Scope

- Entities / collections
- Migrations
- Indexes
- Data retention

### Out of Scope

- Future schemas or unrelated stores

## Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| DR-01 | Requirement text | Must |

## Dependencies

- [DB-0001 Title](../database/DB-0001.md)

## Architecture References

- [ADR-0000 Title](../adr/ADR-0000.md)

## Related ADRs

- [ADR-0000 Title](../adr/ADR-0000.md)

## Repository Targets

- backend/

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-01 | Criterion text | Migration test |

## Data Model

### Entities

| Entity | Description | Relationships |
|--------|-------------|---------------|
| EntityName | Description | RelatedEntity |

### Schema

```sql
CREATE TABLE example (
  id UUID PRIMARY KEY
);
```

### Migrations

| Version | Description |
|---------|-------------|
| V1 | Initial schema |

## Verification

### Migration Tests

Describe forward and rollback verification.

### Performance Tests

Describe query or throughput validation.

## Out of Scope

Excluded data sources, analytics schemas, or future sharding.

## Related Specifications

- depends-on: [FEAT-0000 Title](../features/FEAT-0000.md)
- related-to: [API-0000 Title](../api/API-0000.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
