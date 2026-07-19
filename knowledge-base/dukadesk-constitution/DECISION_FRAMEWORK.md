# DUKADESK Decision Framework

**Constitutional Document — KB-C008**

| Metadata | Value |
|----------|-------|
| Document | Decision Framework |
| Version | 0.1.0 |
| Status | Active |
| Last Updated | 2026-07-12 |

---

## Purpose

This document defines how decisions are categorized and who has authority to approve each category of decision.

---

## Decision Categories

Every decision belongs to exactly one of the following categories:

| Category | Description | Examples |
|----------|-------------|----------|
| **Business** | Market, product, and commercial decisions | Pricing, roadmap priorities, partnerships |
| **Architecture** | Platform structure, boundaries, contracts | Service boundaries, APIs, data models |
| **Engineering** | Process, standards, and quality decisions | Coding standards, review process, CI |
| **Implementation** | Code and repository-level decisions | Feature implementation, bug fixes, refactors |
| **Operations** | Deployment, monitoring, and runtime decisions | Infrastructure, incident response, scaling |

---

## Approval Authority

| Category | Decision Authority |
|----------|-------------------|
| Business | Executive leadership and product governance |
| Architecture | Architecture Council |
| Engineering | Engineering Council |
| Implementation | Repository owners and teams |
| Operations | Platform Operations and SRE |

---

## Decision Records

| Category | Required Record |
|----------|-----------------|
| Business | Business decision record or roadmap artifact |
| Architecture | ADR |
| Engineering | Standards document or governance update |
| Implementation | Commit, PR, and specification reference |
| Operations | Runbook, incident report, or operations log |

---

## Escalation

When authority is unclear or contested, escalation follows the hierarchy:

```
Implementation → Engineering → Architecture → Business → Constitution
```

No decision may violate the Constitution.

---

## Cross-Category Decisions

Decisions that span categories require approval from all relevant authorities. The owning authority coordinates the review.

---

## AI Agent Role

AI agents may:

- Propose decisions within their assigned domain.
- Identify the category of a decision.
- Prepare decision records.
- Escalate when authority is unclear.

AI agents may not:

- Approve decisions.
- Override decision authority.
- Bypass required records.
