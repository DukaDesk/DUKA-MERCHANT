# Required Documents Standard

**KB-141-C — Required Documents**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-C |
| Title | Required Documents |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Engineering |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines the documents that every DUKADESK repository must contain, maintain, and keep current.

---

## 2. Mandatory Documents

Every repository must contain the following documents at the repository root:

| Document | Purpose | Maintained By |
|----------|---------|---------------|
| `README.md` | Entry point and repository metadata | Repository owner |
| `AGENT_CONTEXT.md` | AI agent context and boot sequence | Repository owner |
| `ARCHITECTURE_ALIGNMENT.md` | Knowledge Base and specification alignment | Repository architect |
| `PROGRESS.md` | Development status and roadmap | Repository owner |
| `CONTRIBUTING.md` | Contribution guidelines | Repository owner |
| `CHANGELOG.md` | Version history | Release owner |
| `CODEOWNERS` | Ownership and review assignments | Repository owner |
| `LICENSE` | License terms | Legal / platform governance |

---

## 3. Required Declarations

Every repository must declare the following fields, typically in `README.md` and duplicated in `AGENT_CONTEXT.md`:

| Field | Required Location | Description |
|-------|-------------------|-------------|
| Repository Name | `README.md` header | Unique repository identifier |
| Purpose | `README.md`, `AGENT_CONTEXT.md` | One-sentence responsibility statement |
| Knowledge Base Version | `README.md`, `AGENT_CONTEXT.md`, `ARCHITECTURE_ALIGNMENT.md` | KB version the repository targets |
| Engineering Specification Version | `README.md`, `ARCHITECTURE_ALIGNMENT.md` | Engineering spec version the repository targets |
| Supported Domains | `README.md`, `AGENT_CONTEXT.md` | Business or technical domains |
| Supported Systems | `README.md`, `AGENT_CONTEXT.md` | Surfaces, platforms, runtimes supported |
| Owners | `README.md`, `CODEOWNERS` | Team or individual owners |
| Dependencies | `README.md`, dependency manifest | Internal and external dependencies |
| Status | `README.md`, `PROGRESS.md` | Lifecycle state |

---

## 4. README.md Requirements

`README.md` must include:

1. Repository name and short purpose statement
2. Knowledge Base and Engineering Specification versions
3. Status badge or status line
4. Supported domains and systems
5. Owners
6. Quick start or usage section
7. Repository structure overview
8. Link to `CONTRIBUTING.md`
9. Link to `AGENT_CONTEXT.md` for AI agents

---

## 5. AGENT_CONTEXT.md Requirements

`AGENT_CONTEXT.md` must include:

1. Repository purpose
2. Supported domains
3. Knowledge Base version
4. Required documents list
5. Repository rules
6. Coding standards reference
7. Forbidden actions
8. Boot sequence

---

## 6. ARCHITECTURE_ALIGNMENT.md Requirements

`ARCHITECTURE_ALIGNMENT.md` must include:

1. Knowledge Base version
2. Referenced KB documents
3. Referenced ADRs
4. Referenced Engineering Specifications
5. Architectural constraints
6. Known deviations and rationale

---

## 7. PROGRESS.md Requirements

`PROGRESS.md` must include:

1. Status key
2. Component-by-component status table
3. Known gaps and blockers
4. Last updated date
5. Links to related roadmap or milestone documents

---

## 8. CONTRIBUTING.md Requirements

`CONTRIBUTING.md` must include:

1. Branch naming conventions
2. Commit message conventions
3. Code review process
4. Standards compliance requirements
5. How to run tests
6. How to update documentation

---

## 9. CHANGELOG.md Requirements

`CHANGELOG.md` must follow semantic versioning and include sections for each release:

- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

---

## 10. CODEOWNERS Requirements

`CODEOWNERS` must:

1. Assign at least one owner to the root of the repository
2. Assign owners to critical paths
3. Use team handles where available
4. Be kept current as ownership changes

---

## 11. LICENSE Requirements

Every repository must include a `LICENSE` file. License selection must be approved by platform governance and must be consistent with the organization's licensing strategy.

---

## 12. Compliance Verification

Compliance with this standard is verified by:

1. Manual repository review during bootstrap
2. Automated CI checks for required file presence
3. Periodic repository health audits
