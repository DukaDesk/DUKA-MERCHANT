# Verification

This directory contains implementation verification plans.

## Verification Levels

| Level | When | Owner |
|-------|------|-------|
| Unit | Every PR | Implementer |
| Integration | Every PR | Implementer |
| Contract | API changes | Backend / SDK |
| End-to-End | Feature complete | QA |
| Performance | Release candidate | Platform Ops |
| Security | Release candidate | Security Lead |

## Phase Verification

Each phase has its own verification criteria documented in [phases/](../phases/).

## Common Verification Checklist

- [ ] All linked specifications are satisfied.
- [ ] All tests pass.
- [ ] Code review approved.
- [ ] Documentation updated.
- [ ] Traceability links present.
- [ ] Architecture alignment confirmed.

## Release Verification

Before release, see [RELEASE_STANDARD.md](../../engineering-governance/repository-governance/RELEASE_STANDARD.md) and [RELEASE_PROCESS.md](../../engineering-governance/developer-experience/RELEASE_PROCESS.md).

## Tools

- CI/CD pipelines
- Automated test suites
- Static analysis
- Security scanners
- Performance benchmarks
