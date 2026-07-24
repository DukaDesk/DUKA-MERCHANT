# Security Baseline

**KB-141-G — Security Baseline**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-G |
| Title | Security Baseline |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Security |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines the minimum security requirements every DUKADESK repository must satisfy before it can be marked `Ready`.

The security baseline is the first line of defense. Additional security requirements may be defined per domain or specification.

---

## 2. Required Security Controls

### 2.1 Access Control

- Default branch is protected.
- Force push to default branch is disabled.
- Required reviewers are configured via `CODEOWNERS` or branch protection.
- Repository access follows least privilege.

### 2.2 Secret Protection

- Secret scanning is enabled.
- No secrets are committed to version control.
- `.gitignore` excludes environment and secret files.
- CI uses injected secrets, not hardcoded values.

### 2.3 Dependency Security

- Dependencies are pinned with lockfiles.
- Vulnerability scanning is enabled in CI.
- Known vulnerable dependencies are not permitted.

### 2.4 Code Security

- Input validation is performed at service boundaries.
- Output encoding is used where appropriate.
- Authentication and authorization are enforced for protected operations.
- Error messages do not leak sensitive information.

### 2.5 Audit and Logging

- Security-relevant events are logged.
- Logs do not contain secrets.
- Logs use consistent structured formats where applicable.

---

## 3. Security Review Gates

A repository cannot be marked `Ready` until:

- [ ] Secret scanning is enabled and passing
- [ ] No secrets present in repository history
- [ ] Dependency scan passing
- [ ] Access controls configured
- [ ] Security baseline documented in `ARCHITECTURE_ALIGNMENT.md`
- [ ] Known risks documented with mitigation plans

---

## 4. Security Exceptions

Exceptions to the security baseline must be:

1. Documented in `ARCHITECTURE_ALIGNMENT.md`
2. Approved by platform security or governance
3. Assigned an owner and review date

---

## 5. References

| Reference | Relationship |
|-----------|--------------|
| `DEPENDENCY_POLICY.md` | Dependency security requirements |
| `CONFIGURATION_POLICY.md` | Secret and configuration management |
| `QUALITY_GATES.md` | Security gates for repository readiness |
| `ENGINEERING_STANDARDS.md` | Security review process |
