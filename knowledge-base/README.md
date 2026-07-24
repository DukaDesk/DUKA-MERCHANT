# DUKADESK Engineering Knowledge Base

**Version:** 0.1.0
**Status:** Active
**Last Updated:** 2026-07-12

| Metadata | Value |
|----------|-------|
| Repository Name | DUKADESK OS |
| Purpose | Single source of truth for DUKADESK architecture, standards, governance, and AI context |
| Knowledge Base Version | 0.1.0 |
| Engineering Specification Version | 0.1.0 |
| Supported Domains | Platform Architecture, Engineering Standards, SDUI, Runtime, Builder, Marketplace, Identity, Data Platform, Integration, Enterprise Services, AI Bootstrapping |
| Supported Systems | Documentation system, AI agent context system, Architecture review system |
| Owners | Engineering |
| Dependencies | Git, Markdown tooling, GitHub Actions |
| Status | Active |

> **Architecture Progress:** Platform Runtime ✓ | Builder Studio ✓ | Marketplace ✓ | Application Architecture ✓ | Runtime Architecture ✓ | Identity & Access ✓ | Data Platform (16/16 Draft) | Platform Integration (9/13 Draft) | Enterprise Platform Services (6/34 Draft)

## What This Is

This is the **Engineering Knowledge Base** for the DUKADESK platform.

It is the single source of truth for all architectural decisions, engineering standards, platform conventions, and governance processes across the entire DUKADESK ecosystem.

It operates alongside the **[DUKADESK Platform Definition](./platform-definition/README.md)**, which defines **what DUKADESK actually is** — its capabilities, applications, editions, marketplace, tenants, and extensibility model.

It operates under the authority of the **[DUKADESK Platform Constitution](./dukadesk-constitution/README.md)**, which defines the immutable laws, decision framework, and governance model that sit above the Knowledge Base.

> **The Knowledge Base is the product's memory.** Specifications describe how the platform is built. Implementations produce the software. The Platform Definition describes what the platform provides. If a conflict exists, the conflict is resolved through the Knowledge Base — and ultimately the Constitution — not through code or conversation.

> **Chain of authority:** Constitution → Knowledge Base → ADRs → Engineering Specifications → Engineering Governance → Implementation.

## Repository Structure

```
DUKADESK-OS/
├── README.md                         ← This file
├── AGENT_CONTEXT.md                  ← AI agent context
├── ARCHITECTURE_ALIGNMENT.md         ← KB and specification alignment
├── PROGRESS.md                       ← Repository status
├── PROGRESS_REGISTRY.md              ← Platform status
├── CONTRIBUTING.md                   ← Contribution guidelines
├── CHANGELOG.md                      ← Version history
├── CODEOWNERS                        ← Ownership
├── LICENSE                           ← License
│
├── dukadesk-constitution/            ← Supreme governing documents
│   ├── README.md
│   ├── MISSION.md
│   ├── VISION.md
│   ├── ENGINEERING_PHILOSOPHY.md
│   ├── ARCHITECTURAL_LAWS.md
│   ├── ENGINEERING_LAWS.md
│   ├── AI_LAWS.md
│   ├── CHANGE_CONTROL.md
│   ├── DECISION_FRAMEWORK.md
│   └── GOVERNANCE_MODEL.md
│
├── platform-definition/              ← What DUKADESK is
│   ├── README.md
│   ├── PLATFORM_OVERVIEW.md
│   ├── PRODUCT_MODEL.md
│   ├── CAPABILITY_MODEL.md
│   ├── APPLICATION_MODEL.md
│   ├── MODULE_MODEL.md
│   ├── SERVICE_MODEL.md
│   ├── FEATURE_MODEL.md
│   ├── EDITION_MODEL.md
│   ├── LICENSING_MODEL.md
│   ├── MONETIZATION_MODEL.md
│   ├── MARKETPLACE_MODEL.md
│   ├── TENANT_MODEL.md
│   └── EXTENSIBILITY_MODEL.md
│
├── engineering-governance/           ← Engineering governance
│   ├── README.md
│   ├── repository-governance/        ← Repository standards
│   ├── developer-experience/         ← Developer guides and processes
│   ├── repository-bootstrap/         ← Repository bootstrap package
│   └── execution-governance/         ← Compliance, quality, ownership
│
├── GLOSSARY.md                       ← Platform terminology
├── CORE_PRINCIPLES.md                ← Design principles
├── NAMING_STANDARDS.md               ← Naming conventions
├── ENGINEERING_STANDARDS.md          ← Engineering process standards
├── AGENT_BOOT_PROCESS.md             ← AI agent initialization protocol
│
├── ADRs/                             ← Architecture Decision Records
│   ├── ADR-INDEX.md
│   ├── ADR-000-template.md
│   └── ...
│
├── SPECIFICATIONS/                   ← Domain specifications
│   └── ...
│
├── ARCHITECTURE/                     ← Architecture documentation
│   ├── overview.md                   ← KB-005 Platform Overview
│   ├── system-architecture.md        ← KB-006 System Architecture
│   └── ...
│
├── STANDARDS/                        ← Engineering conventions
│   └── ...
│
├── GUIDES/                           ← Implementation guides
│   └── ...
│
├── project-management/               ← Roadmap, RFCs, planning artifacts
│   ├── roadmap/
│   ├── milestones/
│   ├── backlog/
│   ├── rfc/
│   ├── meeting-notes/
│   ├── release-plans/
│   └── sprint-plans/
│
├── engineering-specifications/       ← Extended engineering specifications
│   └── ...
│
├── knowledge-base/                   ← Extended knowledge base domains
│   └── ...
│
├── docs/                             ← Repository-specific docs
├── tests/                            ← Repository validation tests
├── scripts/                          ← Utility scripts
├── .github/                          ← GitHub workflows and templates
│
└── Product directories               ← Implementation stubs or early artifacts
    ├── backend/
    ├── builder/
    ├── business-dashboard/
    ├── cli/
    ├── developer-experience/
    ├── mobile/
    ├── sdk/
    ├── tenant-dashboard/
    └── website/
```

## Usage

Every developer and AI agent MUST read the following before starting work:

1. **README** — this file
2. **DUKADESK CONSTITUTION** — supreme governing documents
3. **PLATFORM DEFINITION** — what DUKADESK is
4. **AGENT_CONTEXT** — AI agent context and boot sequence
5. **ARCHITECTURE_ALIGNMENT** — Knowledge Base and specification alignment
6. **PROGRESS_REGISTRY** — current platform status
7. **PROGRESS** — repository bootstrap and high-level status
8. **ADR INDEX** — all decisions made
9. **CORE PRINCIPLES** — design philosophy
10. **GLOSSARY** — terminology
11. **ENGINEERING STANDARDS** — process rules
12. **Target specification** — the relevant domain spec
13. **ARCHITECTURE** — system architecture, component registry, and related documents

## Platform Status

| Surface | Status |
|---------|--------|
| Knowledge Base | Drafting |
| Platform Runtime Architecture (KB-005–020) | Complete |
| Builder Studio Architecture (KB-022–031) | Complete |
| Marketplace Architecture (KB-032–040) | Complete |
| Application Architecture (KB-041–050) | Complete |
| Runtime Architecture (KB-051–062) | Complete |
| Identity & Access Architecture (KB-063–072) | Complete |
| Data Platform Architecture (KB-073–093) | 16/16 Draft |
| Platform Integration Architecture (KB-094–106) | 9/13 Draft |
| Enterprise Platform Services (KB-107–140) | 7/34 Draft (6 In Progress, 1 Planned, 27 Planned) |
| Mobile Specification | Implemented |
| Backend Specification | Planned |
| Business Dashboard | Planned |
| Tenant Dashboard | Planned |
| Website | Planned |

## Core Principles

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | **One concept has one definition.** | Every term has a single, authoritative definition. No synonyms. No redefinitions. |
| 2 | **Architecture precedes implementation.** | Architecture decisions are made before code is written. Implementation validates architecture; it does not define it. |
| 3 | **Alignment precedes verification.** | A specification must be reviewed against the Knowledge Base before it can be marked Verified. |
| 4 | **Verified specifications precede implementation.** | Code is written from Verified specifications. Implementation that deviates is a defect. |
| 5 | **The Knowledge Base is the product's memory.** | If a conflict exists, it is resolved through the Knowledge Base — not through code or conversation. |

## Version Tracking

Each governed repository references the Knowledge Base version it aligns with. The Knowledge Base as a whole follows semantic versioning (MAJOR.MINOR.PATCH).

## Updating the Knowledge Base

When architecture changes:
1. Ensure the change aligns with the [DUKADESK Constitution](./dukadesk-constitution/README.md).
2. Write an RFC or ADR first.
3. Update relevant specifications.
4. Update glossary if terminology changed.
5. Update the Knowledge Base.
6. Only then update implementation repositories.

Implementation repositories must NEVER become the primary source of architectural truth.

## Chain of Authority

```
Constitution
    ↓
Knowledge Base
    ↓
ADRs
    ↓
Engineering Specifications
    ↓
Engineering Governance
    ↓
Implementation
```

Every artifact in the DUKADESK engineering system derives its authority from this chain.
