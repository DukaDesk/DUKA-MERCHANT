# CLI Architecture Alignment

This document records the architectural constraints and decisions that guide CLI development.

## Approved ADRs

| ADR | Title | Status |
|-----|-------|--------|
| | | |

## Design Principles

- Consistent command structure
- Clear and helpful output
- Secure credential handling
- Cross-platform support

## Patterns

- Command / subcommand tree
- Configuration file and environment variable support
- Table, JSON, and plain text output
- Structured logging

## Constraints

- Credentials must not be logged or stored insecurely.
- Commands must provide useful help text.
- Breaking CLI changes require major version release.

## Alignment Verification

Before merging, confirm:

- [ ] Changes align with approved ADRs.
- [ ] Changes follow repository patterns.
- [ ] Changes respect listed constraints.
