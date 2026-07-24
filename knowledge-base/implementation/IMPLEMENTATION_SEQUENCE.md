# Implementation Sequence

## Order of Execution

```text
Phase 00: Foundation
Phase 01: Platform Infrastructure
Phase 02: Runtime Engine
Phase 03: Builder Engine
Phase 04: Backend Services
Phase 05: Mobile App
Phase 06: Website
Phase 07: Dashboards
Phase 08: Marketplace
Phase 09: Production
```

## Sequence Rules

1. Phase N may start when Phase N-1 exit criteria are met.
2. Within a phase, work items without mutual dependencies can run in parallel.
3. API contracts must be stable before client teams depend on them.
4. UI specs must be complete before UI implementation begins.

## Startup Order

```text
1. infrastructure
2. backend
3. sdk
4. builder
5. website
6. mobile
7. business-dashboard
8. tenant-dashboard
9. cli
```

## Cross-Phase Dependencies

| Phase | Depends On |
|-------|------------|
| Phase 00 | Engineering OS, Product Definition, UI Specs |
| Phase 01 | Phase 00 |
| Phase 02 | Phase 01 |
| Phase 03 | Phase 02 |
| Phase 04 | Phase 01 |
| Phase 05 | Phase 04, SDK |
| Phase 06 | Phase 04, SDK |
| Phase 07 | Phase 04, SDK |
| Phase 08 | Phase 03, Phase 07 |
| Phase 09 | All previous phases |

## Phase Durations (Estimates)

| Phase | Estimated Duration |
|-------|-------------------|
| Phase 00 | 1–2 weeks |
| Phase 01 | 2–3 weeks |
| Phase 02 | 3–4 weeks |
| Phase 03 | 4–6 weeks |
| Phase 04 | 4–6 weeks |
| Phase 05 | 3–4 weeks |
| Phase 06 | 2–3 weeks |
| Phase 07 | 3–4 weeks |
| Phase 08 | 4–6 weeks |
| Phase 09 | 3–4 weeks |

## Detailed Phase Documents

See [phases/](phases/) for each phase's objectives, prerequisites, deliverables, and exit criteria.
