# DUKADESK Engineering Governance

**Version:** 0.1.0  
**Status:** Active  
**Last Updated:** 2026-07-12  

---

## Purpose

Engineering Governance defines how DUKADESK engineering is organized, executed, and controlled. It sits between the Constitution / Knowledge Base and implementation repositories, translating architectural authority into operational practice.

This directory consolidates what were previously separate governance concerns:

- `repository-governance/`
- `developer-experience/`
- `repository-bootstrap/`
- `execution-governance/`

---

## Governance Concerns

| Concern | Location | Description |
|---------|----------|-------------|
| **Repository Governance** | `repository-governance/` | Standards for repositories, branching, PRs, reviews, releases, versioning, and AI context |
| **Developer Experience** | `developer-experience/` | Onboarding, local development, testing, CI/CD, debugging, and release process guides |
| **Bootstrap** | `repository-bootstrap/` | The mandatory bootstrap package and templates for every new repository |
| **Execution Governance** | `execution-governance/` | Compliance, quality, ownership, escalation, decision authority, and technical debt |
| **Standards** | `repository-governance/` | Engineering standards live primarily in repository governance |
| **Policies** | `execution-governance/` | Policy artifacts live primarily in execution governance |
| **Lifecycle** | `repository-bootstrap/`, `developer-experience/` | Lifecycle definitions in bootstrap and engineering lifecycle guides |
| **Quality** | `execution-governance/`, `developer-experience/` | Quality models and testing strategy |
| **Compliance** | `execution-governance/` | Architecture compliance, exception process, and responsibility matrix |

---

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
Engineering Governance  ← This directory
    ↓
Implementation Repositories
```

---

## Usage

Before contributing to governance:

1. Read the [DUKADESK Constitution](../dukadesk-constitution/README.md).
2. Read [ARCHITECTURE_ALIGNMENT.md](../ARCHITECTURE_ALIGNMENT.md).
3. Identify the concern your change affects.
4. Follow the change control process in [dukadesk-constitution/CHANGE_CONTROL.md](../dukadesk-constitution/CHANGE_CONTROL.md).

---

## Maintenance

The Engineering Council owns this directory. Repository owners and governance contributors may propose changes through the standard review process.
