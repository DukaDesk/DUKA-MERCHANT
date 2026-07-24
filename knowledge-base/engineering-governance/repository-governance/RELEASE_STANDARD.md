# Release Standard

This document defines the release process and readiness checklist.

## Release Types

| Type | Trigger | Version Bump |
|------|---------|--------------|
| Scheduled | Sprint or milestone completion | MINOR or PATCH |
| Emergency | Critical bug or security fix | PATCH |
| Hotfix | Production incident | PATCH |

## Release Readiness Checklist

- [ ] All linked specifications are in `Verified` state.
- [ ] All linked pull requests are merged.
- [ ] All CI/CD checks pass.
- [ ] Version is bumped per [VERSIONING_STANDARD.md](VERSIONING_STANDARD.md).
- [ ] `CHANGELOG.md` is updated.
- [ ] Release notes list included specifications.
- [ ] Deployment artifacts are built.
- [ ] Rollback plan exists.
- [ ] Monitoring and alerts are verified.

## Release Process

1. Create a release branch from `main`.
2. Bump the version and update the changelog.
3. Run the full test suite.
4. Perform final review and approval.
5. Tag the release.
6. Deploy to staging and run smoke tests.
7. Deploy to production using the defined strategy.
8. Monitor for errors.
9. Announce the release.

## Traceability

Every release must reference the engineering specifications it contains:

```text
Release v1.2.0
- FEAT-0001 Tenant onboarding
- API-0001 Authentication contract
- DB-0001 Tenant schema
```

## Rollback

If a release causes issues:

1. Stop the rollout.
2. Assess impact.
3. Roll back to the previous stable version.
4. Notify stakeholders.
5. Create an incident record.

## Verification

Release readiness is verified by the release manager. No release may proceed without a completed checklist.
