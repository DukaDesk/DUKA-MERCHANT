---
identifier: EVT-0000
status: Draft
domain: Event
created: YYYY-MM-DD
author: @author
---

# EVT-0000: Title

## Identifier

EVT-0000

## Title

Event or messaging specification title.

## Purpose

What this event communicates and which services consume or publish it.

## Problem

The communication, decoupling, or workflow coordination problem this event solves.

## Scope

### In Scope

- Event types
- Schemas
- Producers and consumers
- Delivery semantics

### Out of Scope

- Events not covered by this contract

## Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| ER-01 | Requirement text | Must |

## Dependencies

- [EVT-0001 Title](../events/EVT-0001.md)

## Architecture References

- [ADR-0000 Title](../adr/ADR-0000.md)

## Related ADRs

- [ADR-0000 Title](../adr/ADR-0000.md)

## Repository Targets

- backend/
- integrations/

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-01 | Criterion text | Event test |

## Event Catalog

### Event: example.event.occurred

| Field | Type | Description |
|-------|------|-------------|
| field | string | Description |

### Producers

- Service name

### Consumers

- Service name

## Verification

### Contract Tests

Describe schema validation.

### Delivery Tests

Describe at-least-once / exactly-once validation.

## Out of Scope

Excluded event types, transports, or future consumers.

## Related Specifications

- depends-on: [API-0000 Title](../api/API-0000.md)
- related-to: [WF-0000 Title](../workflows/WF-0000.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
