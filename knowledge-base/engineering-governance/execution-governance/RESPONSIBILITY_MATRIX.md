# Responsibility Matrix

This document defines RACI accountability for major engineering capabilities.

## RACI Definitions

| Role | Meaning |
|------|---------|
| Responsible (R) | Does the work |
| Accountable (A) | Ultimately answerable |
| Consulted (C) | Provides input |
| Informed (I) | Kept up to date |

## Capability Matrix

| Capability | Leadership | Architecture Board | Domain Lead | Repository Owner | Feature Owner | Implementer | AI Agent | Platform Ops |
|------------|:----------:|:------------------:|:-----------:|:----------------:|:-------------:|:-----------:|:--------:|:------------:|
| Vision | A/R | C | C | I | I | I | I | I |
| Architecture | C | A/R | C | C | I | I | I | C |
| ADRs | I | A | R | C | I | I | I | I |
| Specifications | I | C | A/R | C | C | I | I | I |
| Work Items | I | I | A | C | R | C | R | I |
| Implementation | I | I | C | C | C | A/R | R | I |
| Code Review | I | C | C | C | C | A/R | R | I |
| Verification | I | C | C | C | C | R | A/R | C |
| Deployment | I | C | I | A | I | R | R | A/R |
| Operations | I | C | I | C | I | I | R | A/R |
| Incident Response | I | C | C | C | I | R | R | A/R |
| Compliance | I | A | R | R | I | I | I | C |
| Technical Debt | I | C | A | R | R | C | I | I |
| Exceptions | C | A | R | C | I | I | I | I |

## Notes

- Accountability (A) must be assigned to exactly one role per capability.
- AI agents may be Responsible but are not Accountable.
- Platform Operations is accountable for production operations and incident response.
- Architecture Board is accountable for architecture compliance and exceptions.

## Updates

This matrix is reviewed quarterly or when team structure changes.
