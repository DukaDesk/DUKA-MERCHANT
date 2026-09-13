# DUKADESK OS — Agent Context

**Repository:** DUKADESK Engineering Knowledge Base and Operating System  
**Knowledge Base Version:** 0.1.0  
**Engineering Specification Version:** 0.1.0  
**Last Updated:** 2026-07-13  
**Status:** Active

---

## Repository Purpose

This repository is the **single source of truth** for the DUKADESK platform's architecture, engineering standards, governance processes, AI context, and platform definition.

It stores the Knowledge Base, Architecture Decision Records (ADRs), specifications, standards, guides, repository governance artifacts, and platform definition documents that direct how the DUKADESK platform is designed, built, maintained, and what it provides.

## Supported Domains

- Platform Architecture
- Engineering Standards and Governance
- Server-Driven UI (SDUI)
- Runtime and Rendering
- Builder Studio
- Marketplace
- Identity and Access
- Data Platform
- Platform Integration
- Enterprise Platform Services
- Project and Program Management
- AI Agent Bootstrapping

## Supported Systems

- Documentation system (Markdown-based Knowledge Base)
- AI agent context system
- Architecture review system
- Specification verification system
- Repository governance system
- Constitutional governance system

## Knowledge Base Version

This repository aligns with DUKADESK Knowledge Base version **0.1.0** and Engineering Specification version **0.1.0**.

## Required Documents

Read these documents before working in this repository:

1. [README.md](./README.md)
2. [AGENT_CONTEXT.md](./AGENT_CONTEXT.md)
3. [dukadesk-constitution/README.md](./dukadesk-constitution/README.md)
4. [dukadesk-constitution/ARCHITECTURAL_LAWS.md](./dukadesk-constitution/ARCHITECTURAL_LAWS.md)
5. [dukadesk-constitution/ENGINEERING_LAWS.md](./dukadesk-constitution/ENGINEERING_LAWS.md)
6. [dukadesk-constitution/AI_LAWS.md](./dukadesk-constitution/AI_LAWS.md)
7. [platform-definition/README.md](./platform-definition/README.md)
8. [platform-definition/PLATFORM_OVERVIEW.md](./platform-definition/PLATFORM_OVERVIEW.md)
9. [platform-definition/CAPABILITY_MODEL.md](./platform-definition/CAPABILITY_MODEL.md)
10. [AGENT_BOOT_PROCESS.md](./AGENT_BOOT_PROCESS.md)
11. [ARCHITECTURE_ALIGNMENT.md](./ARCHITECTURE_ALIGNMENT.md)
12. [PROGRESS_REGISTRY.md](./PROGRESS_REGISTRY.md)
13. [PROGRESS.md](./PROGRESS.md)
14. [CONTRIBUTING.md](./CONTRIBUTING.md)
15. [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
16. [CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md)
17. [GLOSSARY.md](./GLOSSARY.md)
18. [NAMING_STANDARDS.md](./NAMING_STANDARDS.md)
19. [PLATFORM_PHILOSOPHY.md](./PLATFORM_PHILOSOPHY.md)
20. [ADRs/ADR-INDEX.md](./ADRs/ADR-INDEX.md)
21. Relevant `ARCHITECTURE/` documents
22. Relevant `SPECIFICATIONS/` documents

## Repository Rules

1. Read the required documents before writing or editing content.
2. Treat the Constitution and Knowledge Base as authoritative — they prevail over conversation history or general best practices.
3. Use terminology as defined in `GLOSSARY.md`. Do not redefine concepts.
4. Extend existing patterns; do not silently replace them.
5. Flag contradictions instead of choosing one interpretation silently.
6. Respect accepted ADRs — they are immutable once accepted.
7. Cite sources with specific document names.
8. Do not guess — state uncertainty rather than inventing.
9. Update `PROGRESS_REGISTRY.md` and `PROGRESS.md` when status changes.
10. Follow `ENGINEERING_STANDARDS.md` for all contributions.
11. Never modify constitutional documents without explicit authorization.

## Coding Standards

This repository contains documentation and governance artifacts. Coding standards for code repositories are defined in `ENGINEERING_STANDARDS.md` and `STANDARDS/`.

For this repository:

- Write Markdown in clear, structured form.
- Use consistent heading hierarchies.
- Include metadata headers in standards and specifications.
- Keep terminology consistent with `GLOSSARY.md`.
- Reference specific KB documents and ADRs when making claims.

## Forbidden Actions

- Do not modify accepted ADRs.
- Do not introduce undocumented concepts without adding them to the Knowledge Base.
- Do not commit secrets, credentials, or environment files.
- Do not bypass the Knowledge Base for convenience.
- Do not make breaking changes to standards without an ADR or RFC.
- Do not duplicate platform capabilities.
- Do not rename established terms without updating `GLOSSARY.md` and all references.

## Boot Sequence

```
Initialize Workspace
    ↓
Read AGENT_CONTEXT.md
    ↓
Read README.md
    ↓
Read DUKADESK Constitution
    │   ├── README.md
    │   ├── ARCHITECTURAL_LAWS.md
    │   ├── ENGINEERING_LAWS.md
    │   └── AI_LAWS.md
    ↓
Read ARCHITECTURE_ALIGNMENT.md
    ↓
Read PROGRESS_REGISTRY.md
    ↓
Read PROGRESS.md
    ↓
Read AGENT_BOOT_PROCESS.md
    ↓
Read ENGINEERING_STANDARDS.md
    ↓
Read CORE_PRINCIPLES.md
    ↓
Read GLOSSARY.md
    ↓
Read NAMING_STANDARDS.md
    ↓
Read PLATFORM_PHILOSOPHY.md
    ↓
Read ADR-INDEX.md
    ↓
Read Target ARCHITECTURE/ Documents
    ↓
Read Target SPECIFICATIONS/ Documents
    ↓
Determine Requested Task
    ↓
Perform Task
    ↓
Run Self Review
    ↓
Update PROGRESS_REGISTRY.md and PROGRESS.md if status changed
    ↓
Generate Summary
```

## Cross-Repository Context

- **Upstream dependencies:** None — this is the root Knowledge Base.
- **Downstream consumers:** All DUKADESK implementation repositories (mobile, backend, builder, dashboards, website, SDK, CLI, etc.).
- **Related repositories:** All product and infrastructure repositories in the DUKADESK organization.

## Monorepo Note

This repository is a **knowledge monorepo**. It does not contain a single `src/` directory. Instead, source content is organized by domain:

- `dukadesk-constitution/` — supreme governing documents
- `platform-definition/` — what DUKADESK is
- `engineering-governance/` — consolidated engineering governance
  - `repository-governance/` — repository standards
  - `developer-experience/` — developer guides and processes
  - `repository-bootstrap/` — repository bootstrap package
  - `execution-governance/` — compliance, quality, ownership
- `ARCHITECTURE/` — architecture documents
- `SPECIFICATIONS/` — domain specifications
- `STANDARDS/` — engineering conventions
- `GUIDES/` — implementation guides
- `ADRs/` — architecture decision records
- `knowledge-base/` — extended knowledge base domains
- `project-management/` — roadmap, milestones, RFCs
- `engineering-specifications/` — extended engineering specifications
- Product directories (`mobile/`, `backend/`, `builder/`, etc.) — implementation stubs or early artifacts

AI agents must treat this layout as the canonical structure for this repository and must not impose a single `src/` root.
