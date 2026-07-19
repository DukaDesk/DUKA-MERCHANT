# Release Plan 0.1.0

## Overview

| Field | Value |
|-------|-------|
| Version | 0.1.0 |
| Codename | Foundation |
| Target Date | TBD |
| Branch | main |
| Milestone | M1 |

## Objectives

Release the first internal platform foundation:

- Infrastructure deployable to integration environment
- Backend identity and tenant services operational
- SDK covers authentication and tenant APIs
- CI/CD pipelines active on all repositories

## Scope

### In Scope

- User registration and login
- Password reset flow
- Tenant creation and isolation
- Tenant settings
- Authentication API
- Tenant management API
- User and identity schema
- Tenant schema
- Authentication and tenant lifecycle events
- SDK auth and tenant clients
- CI/CD pipelines
- Integration environment infrastructure

### Out of Scope

- Visual builder
- Runtime engine
- Mobile app beyond auth screens
- Website beyond auth flows
- Commerce, payments, orders
- Marketplace

## Release Criteria

- [ ] All M1 exit criteria met
- [ ] End-to-end tests pass in integration environment
- [ ] Security baseline review completed
- [ ] Documentation updated
- [ ] Change log published

## Verification

- End-to-end authentication tests
- Tenant isolation tests
- API contract tests
- CI/CD pipeline tests
- Infrastructure deployment tests

## Rollback Plan

- Maintain previous release tag
- Database migrations are reversible
- Feature flags can disable new endpoints

## Communication

| Audience | Message | Channel | Owner |
|----------|---------|---------|-------|
| Engineering teams | Release notes and known issues | Slack / email | @engineering-lead |
| Leadership | Status summary | Steering meeting | @program-manager |
| Stakeholders | Demo and documentation | Wiki / demo | @product-manager |

## Checklist

- [ ] Code freeze
- [ ] Release branch created
- [ ] QA sign-off
- [ ] Security review
- [ ] Documentation updated
- [ ] Change log updated
- [ ] Tag created
- [ ] Deployed to integration
- [ ] Smoke tests pass
- [ ] Communication sent

## Related Documents

- [M1 Milestone](../milestones/MILESTONE_TRACKER.md)
- [Implementation Sequence](../../implementation/IMPLEMENTATION_SEQUENCE.md)
- [Release Process](../../engineering-governance/developer-experience/RELEASE_PROCESS.md)
