# Mobile Architecture Alignment

This document records the architectural constraints and decisions that guide mobile development.

## Approved ADRs

| ADR | Title | Status |
|-----|-------|--------|
| ADR-009 | JWT Authentication (token storage via MMKV, Zustand session store) | Approved |
| ADR-010 | Sdui Publishing (12-runtime-package structure for Bella Italia tenant) | Approved |
| ADR-011 | Tenant Resolution (guest/host mode, auth gating via EventBus) | Approved |
| ADR-012 | Provider Adapter Pattern (MMKV storage factory with per-instance fallback) | Approved |

## Design Principles

- Cross-platform consistency where applicable
- Platform-specific optimization where required
- Offline-first where feasible
- Secure credential storage

## Patterns

- Feature-based module organization (`src/data/runtime/tenants/{tenant}/{package}/`)
- Service layer for API communication (`src/services/api/endpoints/`)
- Store-driven UI via Zustand (session store, action loading store)
- MMKV storage factory with error-handling fallback to in-memory Map
- Action engine pattern: component -> action JSON -> store dispatch / API call
- EventBus for cross-cutting concerns (guest auth gate, event-driven modals)

## Constraints

- All network calls must use the official SDK or API client.
- Credentials must be stored in platform secure storage.
- UI components must respect accessibility guidelines.

## Alignment Verification

Before merging, confirm:

- [ ] Changes align with approved ADRs.
- [ ] Changes follow repository patterns.
- [ ] Changes respect listed constraints.
