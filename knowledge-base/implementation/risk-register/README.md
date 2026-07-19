# Risk Register

This directory tracks risks specific to implementation execution.

## Active Risks

| ID | Risk | Impact | Likelihood | Mitigation | Owner |
|----|------|--------|------------|------------|-------|
| R-IMPL-01 | Backend API changes break clients | High | Medium | Freeze contracts, version APIs | Backend Lead |
| R-IMPL-02 | Cross-team dependencies cause delays | High | Medium | Weekly dependency review, buffer time | Program Lead |
| R-IMPL-03 | Shared UI components diverge | Medium | Medium | Shared UI library, design review | Frontend Lead |
| R-IMPL-04 | Tenant isolation bugs in production | High | Low | Extensive integration tests | Security Lead |
| R-IMPL-05 | Performance issues at scale | High | Medium | Benchmark early, load test | Platform Ops |
| R-IMPL-06 | Mobile store approval delays | Medium | Low | Follow platform guidelines | Mobile Lead |
| R-IMPL-07 | Scope creep during implementation | High | Medium | Strict change control | Product Lead |

## Risk Management

Risks are reviewed weekly during implementation. New risks are added as they are identified. Mitigation plans are assigned to owners.

## Escalation

Risks that threaten milestones are escalated per [ESCALATION_MODEL.md](../../engineering-governance/execution-governance/ESCALATION_MODEL.md).
