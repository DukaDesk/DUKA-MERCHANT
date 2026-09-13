# Testing Strategy

This document defines the testing strategy for DUKADESK OS.

## Test Levels

| Level | Purpose | When |
|-------|---------|------|
| Unit | Verify individual functions and components | Every PR |
| Integration | Verify interactions between components | Every PR |
| Contract | Verify API and event contracts | Every PR |
| End-to-End | Verify complete user flows | Release candidate |
| Performance | Verify speed, throughput, and stability | Release candidate |
| Security | Verify vulnerabilities and controls | Release candidate |

## Test Requirements

1. Every new feature must include tests.
2. Every bug fix must include a regression test.
3. Critical paths must have end-to-end coverage.
4. Tests must run in CI on every PR.

## Test Organization

```text
repository/
  tests/
    unit/
    integration/
    e2e/
    performance/
    security/
```

## Test Data

- Use factories and fixtures.
- Avoid production data.
- Clean up test data after runs.

## Coverage

- Minimum coverage thresholds are defined per repository.
- Coverage reports are generated in CI.
- Coverage drops block merge.

## Automated Testing in CI

Every PR must pass:

- Unit tests
- Integration tests
- Linting
- Type checks
- Security scans

## Manual Testing

Manual testing is required when:

- Automated coverage is insufficient.
- UI changes need visual verification.
- New integrations require sandbox validation.

## Test-Driven Development

TDD is encouraged:

1. Write a failing test.
2. Implement the minimum code to pass.
3. Refactor.

## Agent Notes

Agents must:

1. Write tests before or alongside implementation.
2. Run tests locally before creating a PR.
3. Add regression tests for bug fixes.
4. Not disable failing tests without approval.
