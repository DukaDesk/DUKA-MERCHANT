# Builder Architecture Alignment

This document records the architectural constraints and decisions that guide builder development.

## Approved ADRs

| ADR | Title | Status |
|-----|-------|--------|
| | | |

## Design Principles

- Declarative design model
- Component composability
- Real-time preview
- Serializable and versioned output

## Patterns

- Canvas / editor separation
- Property editor registry
- Command pattern for undo/redo
- Schema-driven serialization

## Constraints

- Serialized designs must validate against the published schema.
- Canvas must remain performant for large designs.
- Exported output must be reproducible.

## Alignment Verification

Before merging, confirm:

- [ ] Changes align with approved ADRs.
- [ ] Changes follow repository patterns.
- [ ] Changes respect listed constraints.
