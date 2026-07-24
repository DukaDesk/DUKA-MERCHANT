# DUKADESK Change Control

**Constitutional Document — KB-C007**

| Metadata | Value |
|----------|-------|
| Document | Change Control |
| Version | 0.1.0 |
| Status | Active |
| Last Updated | 2026-07-12 |

---

## Purpose

This document defines how the DUKADESK Platform Constitution and subordinate artifacts are changed. Change is expected, but it must be deliberate, traceable, and governed.

---

## Levels of Change

| Level | Artifact | Authority |
|-------|----------|-----------|
| 1 | Constitution | Constitutional Council or designated supreme authority |
| 2 | Knowledge Base | Architecture Council |
| 3 | ADRs | Architecture Council or delegated decision authority |
| 4 | Engineering Specifications | Specification owners and Architecture Council |
| 5 | Engineering Governance | Governance owners and Engineering Council |
| 6 | Implementation | Repository owners and teams |

---

## Constitutional Amendments

Changes to the Constitution require:

1. A written amendment proposal.
2. Impact analysis on all subordinate artifacts.
3. Review by the Constitutional authority.
4. Approval by the Constitutional authority.
5. Version update and changelog entry.

Constitutional changes are rare and significant.

---

## Knowledge Base Changes

Changes to the Knowledge Base require:

1. An RFC or ADR if architectural impact exists.
2. Review against the Constitution and existing principles.
3. Update to affected specifications, standards, and glossaries.
4. Approval by the Architecture Council or delegated authority.

---

## Specification Changes

Changes to Engineering Specifications require:

1. Alignment review against the Knowledge Base.
2. Verification that implementations remain valid.
3. Approval by specification owners.
4. Notification to affected repository owners.

---

## Implementation Changes

Implementation changes follow repository-level governance defined in `engineering-governance/` and the repository's `CONTRIBUTING.md`.

---

## Emergency Changes

Emergency changes may bypass normal process when necessary, but require:

1. Post-hoc documentation.
2. Review within one business cycle.
3. Retroactive approval or reversion.

---

## Versioning

The Constitution follows semantic versioning. Subordinate artifacts reference the constitutional version they comply with.
