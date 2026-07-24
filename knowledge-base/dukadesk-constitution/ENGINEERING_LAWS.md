# DUKADESK Engineering Laws

**Constitutional Document — KB-C005**

| Metadata | Value |
|----------|-------|
| Document | Engineering Laws |
| Version | 0.1.0 |
| Status | Active |
| Last Updated | 2026-07-12 |

---

## Purpose

These laws are immutable rules of engineering practice for the DUKADESK platform. They govern how engineers and engineering teams work.

---

## The Laws

### Law 1: Every Implementation Traces to an Engineering Specification

No implementation may proceed without a corresponding Engineering Specification. Implementation that cannot trace to a specification is unauthorized.

### Law 2: No Implementation Proceeds Without Verification

Every implementation must be verifiable through tests, reviews, alignment checks, or automated validation.

### Law 3: Engineering Standards Apply Everywhere

All repositories, teams, and contributors follow the same engineering standards unless explicitly exempted through governance.

### Law 4: Progress Is Documented

The state of work must be reflected in progress tracking artifacts. Undocumented progress does not exist.

### Law 5: Reviews Are Mandatory

All engineering changes require review. Review is a quality gate, not a formality.

### Law 6: Debt Is Intentional or It Is Defect

Technical debt may be accepted consciously with a plan. Unconscious debt is a defect.

### Law 7: Secrets Never Enter Version Control

Credentials, keys, tokens, and other secrets must never be committed to repositories.

### Law 8: Quality Is Owned by Everyone

Quality is not a separate team's job. Every engineer owns the quality of their contribution.

### Law 9: Tools Serve the Process

Engineering tools, scripts, and automation must align with defined standards. Tools do not override process.

### Law 10: Everything Is Traceable

Every change, decision, and artifact can be traced to a requirement, specification, ADR, or constitutional principle.

---

## Relationship to Architecture

Engineering laws operationalize architectural laws. Where architectural laws say *what must be true*, engineering laws say *how work must be done to make it true*.
