# SDK Architecture Alignment

This document records the architectural constraints and decisions that guide SDK development.

## Approved ADRs

| ADR | Title | Status |
|-----|-------|--------|
| | | |

## Design Principles

- Simple and consistent public API
- Backward compatibility within major versions
- Idiomatic language bindings
- Robust error handling

## Patterns

- Client builder pattern
- Retry and backoff policies
- Request/response middleware
- Example-driven documentation

## Constraints

- Public API changes require version bump per semantic versioning.
- Breaking changes require major version release.
- Examples must compile and run.

## Alignment Verification

Before merging, confirm:

- [ ] Changes align with approved ADRs.
- [ ] Changes follow repository patterns.
- [ ] Changes respect listed constraints.
