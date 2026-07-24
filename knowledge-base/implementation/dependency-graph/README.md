# Dependency Graph

This directory contains implementation dependency diagrams.

## Repository Startup Order

```text
1. infrastructure
    ↓
2. backend
    ↓
3. sdk
    ↓
4. builder
    ↓
5. website
    ↓
6. mobile
    ↓
7. business-dashboard
    ↓
8. tenant-dashboard
    ↓
9. cli
```

## Phase Dependencies

```text
Phase 00 Foundation
    ↓
Phase 01 Platform Infrastructure
    ↓
Phase 02 Runtime Engine
    ↓
Phase 03 Builder Engine
    ↓
Phase 04 Backend Services
    ↓
Phase 05 Mobile App
    ↓
Phase 06 Website
    ↓
Phase 07 Dashboards
    ↓
Phase 08 Marketplace
    ↓
Phase 09 Production
```

## Cross-Repository Dependencies

| Repository | Depends On |
|------------|------------|
| backend | infrastructure |
| sdk | backend |
| builder | sdk, backend |
| website | sdk, backend |
| mobile | sdk, backend |
| business-dashboard | sdk, backend |
| tenant-dashboard | sdk, backend |
| cli | sdk, backend |

## Notes

These graphs are derived from [IMPLEMENTATION_SEQUENCE.md](../IMPLEMENTATION_SEQUENCE.md) and repository startup plans.
