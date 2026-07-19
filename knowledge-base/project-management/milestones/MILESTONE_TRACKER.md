# Milestone Tracker

## Overview

This tracker maps DUKADESK OS milestones to phases, repositories, and target dates. It is maintained by the Program Management office and reviewed weekly.

## Milestones

| Milestone | Objective | Target Date | Phase(s) | Status |
|-----------|-----------|-------------|----------|--------|
| M0 | Foundation complete: engineering OS, product definition, UI specs, implementation plan | 2026-07-13 | Phase 00 | ✅ Complete |
| M1 | Platform and backend foundation: infrastructure, CI/CD, identity, tenant, core APIs | TBD | Phase 01, Phase 04 | ⏳ Planned |
| M2 | Builder and runtime: visual builder, runtime engine, preview, publish | TBD | Phase 02, Phase 03 | ⏳ Planned |
| M3 | User surfaces: mobile app, website, business dashboard, tenant dashboard | TBD | Phase 05, Phase 06, Phase 07 | ⏳ Planned |
| M4 | Marketplace and production: marketplace launch, production hardening | TBD | Phase 08, Phase 09 | ⏳ Planned |

## M1 Details

See [implementation/milestones/M1.md](../../implementation/milestones/M1.md).

### Exit Criteria

- [ ] Users can register and sign in.
- [ ] Users can create tenants.
- [ ] Tenant isolation is enforced.
- [ ] SDK covers auth and tenant APIs.
- [ ] CI/CD runs on all repos.

### Repositories Involved

- infrastructure
- backend
- sdk

### Key Specifications

- SEC-0001 Authentication Architecture and User Identity
- SEC-0002 Authorization and RBAC
- FEAT-0001 User Registration and Login
- FEAT-0002 Tenant Lifecycle and Isolation
- API-0001 Authentication API
- API-0002 Tenant Management API
- DB-0001 User and Identity Schema
- DB-0002 Tenant Schema
- EVT-0001 User Authentication Events
- EVT-0002 Tenant Lifecycle Events

## M2 Details

See [implementation/milestones/M2.md](../../implementation/milestones/M2.md).

### Exit Criteria

- [ ] User can design a simple app.
- [ ] Preview renders the app.
- [ ] App can be published.
- [ ] Published app is renderable by runtime.

### Repositories Involved

- builder
- sdk
- backend

## M3 Details

See [implementation/milestones/M3.md](../../implementation/milestones/M3.md).

### Exit Criteria

- [ ] Website supports registration and sign-in.
- [ ] Mobile app launches and authenticates.
- [ ] Dashboards support role-based access.
- [ ] Shared UI components are reusable across web surfaces.

### Repositories Involved

- mobile
- website
- business-dashboard
- tenant-dashboard
- sdk

## M4 Details

See [implementation/milestones/M4.md](../../implementation/milestones/M4.md).

### Exit Criteria

- [ ] Marketplace is operational.
- [ ] Production deployment is automated.
- [ ] Observability and incident response are active.
- [ ] Security and compliance baselines are met.

### Repositories Involved

- backend
- builder
- website
- business-dashboard

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-07-13 | @program-manager | Initial milestone tracker |
