---
identifier: API-0000
status: Draft
domain: API
created: YYYY-MM-DD
author: @author
---

# API-0000: Title

## Identifier

API-0000

## Title

API or service contract title.

## Purpose

What this API enables and which consumers it serves.

## Problem

The integration or capability gap this API addresses.

## Scope

### In Scope

- Endpoints / operations
- Request/response formats
- Authentication and authorization

### Out of Scope

- Future operations not included in this contract

## Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| AR-01 | Requirement text | Must |

## Dependencies

- [API-0001 Title](../api/API-0001.md)

## Architecture References

- [ADR-0000 Title](../adr/ADR-0000.md)

## Related ADRs

- [ADR-0000 Title](../adr/ADR-0000.md)

## Repository Targets

- backend/
- sdk/

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-01 | Criterion text | Contract test |

## API Contract

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/resource | Description |

### Request

```json
{
  "field": "value"
}
```

### Response

```json
{
  "field": "value"
}
```

### Errors

| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_REQUEST | Description |

## Verification

### Contract Tests

Describe how the contract is validated.

### Compatibility

Describe versioning and breaking-change rules.

## Out of Scope

Explicitly excluded operations, consumers, or future versions.

## Related Specifications

- depends-on: [FEAT-0000 Title](../features/FEAT-0000.md)
- related-to: [EVT-0000 Title](../events/EVT-0000.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
