# Exception Process

This document defines the process for requesting and approving architecture exceptions.

## Principle

No repository may violate architecture without an approved exception.

## Exception Lifecycle

```text
Exception Request
    ↓
Architecture Review
    ↓
ADR (if approved)
    ↓
Implementation
```

## Exception Request

A request must include:

- Description of the deviation
- Reason for the exception
- Risk assessment
- Proposed mitigation
- Time-bound expiration
- Owner

## Review

The Architecture Board reviews exception requests. Review criteria:

- Is the exception necessary?
- Are risks acceptable?
- Are mitigations sufficient?
- Is the expiration reasonable?

## Approval

Approved exceptions result in:

- An ADR recording the decision
- An update to `ARCHITECTURE_ALIGNMENT.md`
- A work item to track remediation if applicable

## Denial

Denied exceptions require the repository to align with approved architecture.

## Expiration

Exceptions expire on the defined date. Extensions require re-approval.

## No Undocumented Exceptions

Any deviation discovered without an approved exception is treated as non-compliance and escalated.

## Audit

Exceptions are audited during architecture compliance reviews.
