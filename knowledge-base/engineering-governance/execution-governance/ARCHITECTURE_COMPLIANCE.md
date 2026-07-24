# Architecture Compliance

This document defines how repository architecture compliance is assessed and maintained.

## Compliance Questions

Every repository must periodically answer:

```text
Current KB Version
Current Spec Version
Architecture Drift
Known Deviations
Open ADRs
Compliance Score
```

## Compliance Review

| Item | Frequency | Owner |
|------|-----------|-------|
| Repository self-assessment | Monthly | Repository Owner |
| Domain compliance review | Quarterly | Domain Lead |
| Architecture board audit | Annually | Architecture Board |

## Compliance Dimensions

### Current KB Version
- Which version of the Knowledge Base the repository aligns with.
- Updated when the Knowledge Base changes.

### Current Spec Version
- Which Engineering Specifications are implemented.
- Tracked in the repository `ARCHITECTURE_ALIGNMENT.md`.

### Architecture Drift
- Differences between current implementation and approved architecture.
- Drift must be documented and remediated or excepted.

### Known Deviations
- Documented exceptions approved through [EXCEPTION_PROCESS.md](EXCEPTION_PROCESS.md).
- Include rationale, owner, and expiration.

### Open ADRs
- ADRs that affect the repository but are not yet implemented.
- Tracked until resolved.

### Compliance Score
- Aggregated score based on the above dimensions.
- Target: 95% or higher.

## Compliance Report Template

```markdown
# Compliance Report: <Repository>

## Current KB Version

## Current Spec Version

## Architecture Drift

## Known Deviations

## Open ADRs

## Compliance Score

## Remediation Plan
```

## Enforcement

- Non-compliant repositories block release.
- Drift without an approved exception triggers escalation.
- Compliance trends are reported in [SUCCESS_METRICS.md](SUCCESS_METRICS.md).
