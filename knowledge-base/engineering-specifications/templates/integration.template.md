---
identifier: INT-0000
status: Draft
domain: Integration
created: YYYY-MM-DD
author: @author
---

# INT-0000: Title

## Identifier

INT-0000

## Title

Integration or external system specification title.

## Purpose

What external system is integrated and what capability this provides.

## Problem

The integration gap, data flow, or partner requirement being addressed.

## Scope

### In Scope

- External system
- Data exchanged
- Authentication
- Error handling

### Out of Scope

- Future integrations or unrelated data

## Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| IR-01 | Requirement text | Must |

## Dependencies

- [INT-0001 Title](../integrations/INT-0001.md)

## Architecture References

- [ADR-0000 Title](../adr/ADR-0000.md)

## Related ADRs

- [ADR-0000 Title](../adr/ADR-0000.md)

## Repository Targets

- integrations/
- backend/

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-01 | Criterion text | Integration test |

## Integration Contract

### External System

| Property | Value |
|----------|-------|
| Name | System name |
| API / Protocol | REST / gRPC / etc. |
| Environment | Sandbox / Production |

### Data Mapping

| Source Field | Target Field | Transform |
|--------------|--------------|-----------|
| field | field | none |

### Authentication

Describe credentials, tokens, or keys.

### Error Handling

| Scenario | Action |
|----------|--------|
| Timeout | Retry with backoff |

## Verification

### Integration Tests

Describe sandbox and production validation.

### Failover Tests

Describe degraded behavior.

## Out of Scope

Excluded endpoints, data, or future integrations.

## Related Specifications

- depends-on: [API-0000 Title](../api/API-0000.md)
- related-to: [EVT-0000 Title](../events/EVT-0000.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
