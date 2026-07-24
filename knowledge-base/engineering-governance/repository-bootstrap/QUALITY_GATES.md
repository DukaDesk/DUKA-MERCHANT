# Quality Gates

**KB-141-H — Quality Gates**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-H |
| Title | Quality Gates |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Engineering |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines the quality gates a repository must pass before it can be marked `Ready`.

Quality gates ensure that every repository entering active development has the minimum structure, context, automation, and governance in place.

---

## 2. Quality Gate Categories

A repository must satisfy all of the following categories:

| Gate | Description |
|------|-------------|
| Repository Metadata | Required declarations are present and accurate |
| Repository Context | `AGENT_CONTEXT.md` is complete and actionable |
| Architecture Alignment | `ARCHITECTURE_ALIGNMENT.md` references KB, specs, and ADRs |
| Engineering Standards | Repository follows `ENGINEERING_STANDARDS.md` |
| CI Pipeline | Continuous integration is enabled and passing |
| Testing Framework | Test structure and minimum tests are in place |
| Documentation | Required documents exist and are current |
| Versioning | Versioning strategy is defined and initialized |
| Security Baseline | `SECURITY_BASELINE.md` requirements are satisfied |

---

## 3. Repository Metadata Gate

- [ ] Repository Name declared
- [ ] Purpose declared
- [ ] Knowledge Base Version declared
- [ ] Engineering Specification Version declared
- [ ] Supported Domains declared
- [ ] Supported Systems declared
- [ ] Owners declared in `README.md` and `CODEOWNERS`
- [ ] Dependencies declared
- [ ] Status declared and consistent across documents

---

## 4. Repository Context Gate

- [ ] `AGENT_CONTEXT.md` exists
- [ ] Repository purpose stated
- [ ] Supported domains listed
- [ ] Knowledge Base version stated
- [ ] Required documents listed
- [ ] Repository rules defined
- [ ] Coding standards referenced
- [ ] Forbidden actions listed
- [ ] Boot sequence defined

---

## 5. Architecture Alignment Gate

- [ ] `ARCHITECTURE_ALIGNMENT.md` exists
- [ ] Knowledge Base version stated
- [ ] Referenced KB documents listed
- [ ] Referenced ADRs listed
- [ ] Referenced Engineering Specifications listed
- [ ] Architectural constraints documented
- [ ] Known deviations documented with rationale

---

## 6. Engineering Standards Gate

- [ ] Repository follows naming conventions
- [ ] Contribution guidelines documented
- [ ] Code review process defined
- [ ] Commit message conventions defined
- [ ] Documentation standards followed

---

## 7. CI Pipeline Gate

- [ ] `.github/workflows/` exists
- [ ] Pull request validation workflow exists
- [ ] Security baseline workflow exists
- [ ] Required file presence check exists
- [ ] CI is passing on the default branch

---

## 8. Testing Framework Gate

- [ ] `tests/` directory exists
- [ ] Test framework selected and configured
- [ ] At least one test or test placeholder exists
- [ ] Test execution command documented
- [ ] Coverage strategy defined (even if not yet enforced)

---

## 9. Documentation Gate

- [ ] `README.md` exists and is populated
- [ ] `CONTRIBUTING.md` exists
- [ ] `CHANGELOG.md` initialized
- [ ] `PROGRESS.md` exists
- [ ] `docs/` directory exists with README

---

## 10. Versioning Gate

- [ ] Versioning strategy defined (semantic versioning preferred)
- [ ] Initial version declared
- [ ] `CHANGELOG.md` initialized with version
- [ ] Version reflected in relevant manifests

---

## 11. Security Baseline Gate

- [ ] `SECURITY_BASELINE.md` requirements satisfied
- [ ] Secret scanning enabled
- [ ] No secrets in repository
- [ ] Dependency scan passing
- [ ] Branch protection configured
- [ ] Known security risks documented

---

## 12. Readiness Declaration

Once all gates pass, the repository owner may update the repository status to `Ready` in:

- `README.md`
- `AGENT_CONTEXT.md`
- `PROGRESS.md`

The readiness declaration must include the date and the name of the reviewer who verified the gates.
