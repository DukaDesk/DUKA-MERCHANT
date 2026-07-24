# Mobile Architecture Alignment

This document records the architectural constraints and decisions that guide mobile development.

## Approved ADRs

| ADR | Title | Status |
|-----|-------|--------|
| | | |

## Design Principles

- Cross-platform consistency where applicable
- Platform-specific optimization where required
- Offline-first where feasible
- Secure credential storage

## Patterns

- MVVM or equivalent presentation pattern
- Repository pattern for data access
- Service layer for API communication
- Feature-based module organization

## Constraints

- All network calls must use the official SDK or API client.
- Credentials must be stored in platform secure storage.
- UI components must respect accessibility guidelines.

## Alignment Verification

Before merging, confirm:

- [ ] Changes align with approved ADRs.
- [ ] Changes follow repository patterns.
- [ ] Changes respect listed constraints.
