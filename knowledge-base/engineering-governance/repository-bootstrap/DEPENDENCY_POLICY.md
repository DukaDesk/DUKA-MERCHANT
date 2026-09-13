# Dependency Policy

**KB-141-E — Dependency Policy**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-E |
| Title | Dependency Policy |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Engineering |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines how DUKADESK repositories declare, manage, and audit dependencies.

Dependencies introduce supply chain risk, maintenance burden, and licensing obligations. This policy ensures dependencies are chosen deliberately and kept visible.

---

## 2. Dependency Categories

Dependencies are classified into three categories:

| Category | Description | Examples |
|----------|-------------|----------|
| Internal | Other DUKADESK repositories or shared libraries | SDK, runtime, shared packages |
| External Open Source | Third-party open-source packages | npm, PyPI, Maven packages |
| External Commercial | Licensed third-party services or libraries | SaaS APIs, paid SDKs |

---

## 3. Declaration Requirements

Every repository must declare its dependencies in:

1. The appropriate dependency manifest (`package.json`, `go.mod`, `requirements.txt`, etc.)
2. `README.md` under a Dependencies section
3. `ARCHITECTURE_ALIGNMENT.md` if dependencies have architectural significance

Internal dependencies must specify:

- Repository name
- Required version or branch
- Interface contract (API, event schema, shared library)

External dependencies must specify:

- Package name and version
- License
- Purpose
- Risk assessment (security, maintenance, community health)

---

## 4. Approval Requirements

| Dependency Type | Approval Required |
|-----------------|-------------------|
| Internal DUKADESK | Repository owner |
| External open source — widely adopted, permissive license | Repository owner |
| External open source — new, niche, or copyleft license | Platform architecture review |
| External commercial | Procurement and security review |
| Dependency replacing an existing internal capability | ADR required |

---

## 5. Versioning

Dependencies must be pinned or constrained to prevent uncontrolled updates:

- Lockfiles (`package-lock.json`, `yarn.lock`, `go.sum`, etc.) must be committed.
- Version ranges must be justified in dependency documentation.
- Major version updates require review.

---

## 6. Security and Maintenance

Every repository must:

- Run automated dependency vulnerability scans in CI.
- Keep dependencies updated within 30 days of security patch release.
- Remove unused dependencies within one release cycle.
- Document any dependency that cannot be updated and the rationale.

---

## 7. Prohibited Dependencies

The following are prohibited unless explicitly approved by platform governance:

- Dependencies with known unpatched vulnerabilities
- Dependencies with licenses incompatible with the repository's license
- Dependencies that duplicate platform capabilities
- Dependencies that introduce unnecessary native binaries or system dependencies
- Personal or unverified packages

---

## 8. Dependency Audit

Dependency lists are audited:

1. During repository bootstrap
2. Before each release
3. When a security advisory is published
4. During periodic repository health checks

---

## 9. References

| Reference | Relationship |
|-----------|--------------|
| `SECURITY_BASELINE.md` | Security requirements for dependencies |
| `QUALITY_GATES.md` | Dependency checks required for Ready status |
| `ENGINEERING_STANDARDS.md` | General engineering process |
