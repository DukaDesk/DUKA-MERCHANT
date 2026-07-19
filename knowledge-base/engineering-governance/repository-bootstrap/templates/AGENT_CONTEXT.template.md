# {{REPOSITORY_NAME}} — Agent Context

**Knowledge Base Version:** {{KB_VERSION}}
**Last Updated:** {{DATE}}

---

## Repository Purpose

{{ONE_SENTENCE_PURPOSE}}

{{DESCRIPTION}}

## Supported Domains

{{DOMAINS}}

## Supported Systems

{{SYSTEMS}}

## Knowledge Base Version

This repository aligns with DUKADESK Knowledge Base version **{{KB_VERSION}}** and Engineering Specification version **{{SPEC_VERSION}}**.

## Required Documents

Read these documents before working in this repository:

1. [README.md](../README.md)
2. [AGENT_CONTEXT.md](../AGENT_CONTEXT.md)
3. [ARCHITECTURE_ALIGNMENT.md](../ARCHITECTURE_ALIGNMENT.md)
4. [PROGRESS.md](../PROGRESS.md)
5. [CONTRIBUTING.md](../CONTRIBUTING.md)
6. [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md)
7. [GLOSSARY.md](../GLOSSARY.md)
8. Relevant `ARCHITECTURE/` documents
9. Relevant `SPECIFICATIONS/` documents
10. Relevant ADRs

## Repository Rules

1. Read the required documents before writing code.
2. Treat the Knowledge Base as authoritative.
3. Use terminology as defined in `GLOSSARY.md`.
4. Extend existing patterns; do not replace them silently.
5. Update `PROGRESS.md` when component status changes.
6. Write tests for new capabilities.
7. Update documentation when behavior changes.
8. Flag contradictions instead of silently choosing interpretations.

## Coding Standards

- Follow language-specific style guides defined in repository configuration.
- Follow `NAMING_STANDARDS.md`.
- Follow `ENGINEERING_STANDARDS.md`.
- Write self-documenting code with clear naming.
- Include tests for new logic.

## Forbidden Actions

- Do not modify accepted ADRs.
- Do not introduce undocumented concepts.
- Do not commit secrets, credentials, or environment files.
- Do not bypass the Knowledge Base for convenience.
- Do not make breaking changes without an ADR.
- Do not duplicate platform capabilities.
- Do not hardcode environment-specific values in source code.

## Boot Sequence

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

## Cross-Repository Context

- **Upstream dependencies:** {{UPSTREAM_DEPENDENCIES}}
- **Downstream consumers:** {{DOWNSTREAM_CONSUMERS}}
- **Related repositories:** {{RELATED_REPOSITORIES}}
