# Release Process

This document defines the release workflow for DUKADESK OS.

## Release Workflow

```text
Development
    ↓
Integration
    ↓
Staging
    ↓
Production
    ↓
Post Release Verification
```

## Release Types

| Type | Trigger | Branch |
|------|---------|--------|
| Scheduled | Sprint or milestone | release/vX.Y |
| Hotfix | Production incident | hotfix/* |
| Emergency | Critical security or bug | hotfix/* |

## Release Preparation

1. Confirm all linked specifications are `Verified`.
2. Confirm all linked tasks are `Done`.
3. Create a release branch.
4. Bump the version per [VERSIONING_STANDARD.md](../repository-governance/VERSIONING_STANDARD.md).
5. Update `CHANGELOG.md`.
6. Run the full test suite.

## Release Checklist

- [ ] Version bumped
- [ ] Changelog updated
- [ ] All tests pass
- [ ] Security scan passes
- [ ] Documentation updated
- [ ] Rollback plan documented
- [ ] Release notes prepared
- [ ] Monitoring alerts verified

## Deployment

1. Deploy to Integration and run smoke tests.
2. Deploy to Staging and run acceptance tests.
3. Obtain production deployment approval.
4. Deploy to Production using the defined strategy.
5. Run post-release verification.

## Post Release Verification

After production deployment:

- Monitor error rates and key metrics.
- Run smoke tests against production.
- Confirm critical user flows.
- Announce the release.

## Rollback

If issues are detected:

1. Stop the rollout.
2. Assess impact.
3. Execute the rollback plan.
4. Notify stakeholders.
5. Create an incident record.

## Release Notes

Release notes must include:

- Version number
- Included specifications
- New features
- Bug fixes
- Breaking changes
- Known issues

## Agent Notes

Agents must not deploy to production without human approval. Agents may assist with release preparation, checklist execution, and verification.
