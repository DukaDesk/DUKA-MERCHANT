# AI Bootstrap Standard

**KB-141-D — AI Bootstrap**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-D |
| Title | AI Bootstrap |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Engineering |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines the mandatory AI context and boot sequence for every DUKADESK repository.

Every AI engineering agent must read `AGENT_CONTEXT.md` before performing work in a repository. This standard defines what that file must contain and how AI agents must initialize themselves.

---

## 2. Required AI Context

Every repository's `AGENT_CONTEXT.md` must contain the following sections.

### 2.1 Repository Purpose

A concise statement of what the repository does, why it exists, and what success looks like.

### 2.2 Supported Domains

The business or technical domains this repository covers. Examples: Mobile Runtime, Builder Studio, Identity and Access, Marketplace.

### 2.3 Knowledge Base Version

The version of the DUKADESK Knowledge Base that this repository aligns with.

### 2.4 Required Documents

A prioritized list of documents an AI agent must read before working in this repository. Typically includes:

1. `README.md`
2. `AGENT_CONTEXT.md`
3. `ARCHITECTURE_ALIGNMENT.md`
4. `PROGRESS.md`
5. `CONTRIBUTING.md`
6. `ENGINEERING_STANDARDS.md`
7. Relevant `ARCHITECTURE/` documents
8. Relevant `SPECIFICATIONS/` documents
9. Relevant ADRs

### 2.5 Repository Rules

Behavioral rules specific to this repository. Examples:

- Read architecture documents before modifying code.
- Update `PROGRESS.md` when status changes.
- Write tests for all new capabilities.
- Do not bypass API contracts.

### 2.6 Coding Standards

Reference to the coding standards this repository follows, including:

- Language-specific style guides
- Naming conventions (`NAMING_STANDARDS.md`)
- Testing requirements
- Documentation requirements

### 2.7 Forbidden Actions

Explicit list of actions AI agents must not take. Examples:

- Do not modify accepted ADRs.
- Do not introduce undocumented concepts.
- Do not commit secrets or credentials.
- Do not bypass the Knowledge Base for convenience.
- Do not make breaking changes without an ADR.

### 2.8 Boot Sequence

The ordered steps an AI agent must execute on every session:

```
Initialize Workspace
    ↓
Read AGENT_CONTEXT.md
    ↓
Read README.md
    ↓
Read ARCHITECTURE_ALIGNMENT.md
    ↓
Read PROGRESS.md
    ↓
Read Required Knowledge Base Documents
    ↓
Read Required Specifications
    ↓
Read Relevant ADRs
    ↓
Determine Requested Task
    ↓
Perform Task
    ↓
Run Self Review
    ↓
Update PROGRESS.md if status changed
    ↓
Generate Summary
```

---

## 3. AI Agent Responsibilities

AI agents working in DUKADESK repositories must:

1. Treat the Knowledge Base as authoritative.
2. Use terminology as defined in `GLOSSARY.md`.
3. Extend existing patterns rather than replacing them.
4. Flag contradictions instead of silently choosing interpretations.
5. Cite sources with specific document names.
6. Recommend ADRs for significant architectural changes.
7. Verify work through tests, linting, or automated checks where available.
8. Update documentation when behavior changes.

---

## 4. Cross-Repository AI Context

For repositories that depend on other repositories, `AGENT_CONTEXT.md` must include:

- List of upstream dependencies
- List of downstream consumers
- Repositories whose changes may affect this repository
- Cross-repository coordination rules

---

## 5. Template

The canonical template for `AGENT_CONTEXT.md` is provided in `templates/AGENT_CONTEXT.template.md`.

---

## 6. Verification

AI bootstrap compliance is verified by:

1. Checking that `AGENT_CONTEXT.md` exists and contains all required sections.
2. Validating that the boot sequence is defined and ordered.
3. Confirming that required documents are accessible.
4. Running an AI agent test prompt against the repository.
