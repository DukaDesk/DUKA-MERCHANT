# Repository Bootstrap Standard

**KB-141-A — Bootstrap Standard**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-A |
| Title | Bootstrap Standard |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Engineering |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines the canonical procedure for bootstrapping a new DUKADESK repository. It is the operational companion to `KB-141 Repository Bootstrap`.

All platform teams, AI agents, and repository creators must follow this procedure when creating a new repository.

---

## 2. Preconditions

Before bootstrapping a repository, the following must be true:

- A repository proposal has been approved through platform program management.
- The repository's purpose, domain, and ownership are documented.
- The target Knowledge Base version is known.
- The target Engineering Specification version is known.
- A repository name has been reserved and follows `NAMING_STANDARDS.md`.

---

## 3. Bootstrap Procedure

### Step 1: Create Repository

Create the repository in the approved DUKADESK organization or account.

Configure initial settings:

- Default branch: `main`
- Branch protection enabled for `main`
- Merge strategy: squash or rebase preferred
- Issues and discussions enabled
- Wiki disabled (documentation lives in the repository)
- Secret scanning enabled

### Step 2: Apply Bootstrap Template

Copy the files from `repository-bootstrap/` into the new repository root, then adapt them:

1. Copy `README.template.md` to `README.md` and populate repository metadata.
2. Copy `AGENT_CONTEXT.template.md` to `AGENT_CONTEXT.md` and populate agent rules.
3. Copy `ARCHITECTURE_ALIGNMENT.template.md` to `ARCHITECTURE_ALIGNMENT.md` and list referenced KB documents and ADRs.
4. Copy `CONTRIBUTING.template.md` to `CONTRIBUTING.md` and customize contribution rules.
5. Copy `CHANGELOG.template.md` to `CHANGELOG.md` and initialize with version `0.0.0` or `0.1.0`.
6. Copy `PROGRESS.template.md` to `PROGRESS.md` and populate initial status.
7. Copy `CODEOWNERS.template` to `CODEOWNERS` and assign owners.
8. Copy `LICENSE.template` to `LICENSE` and confirm license selection.

Create the standard directory structure:

- `docs/`
- `src/`
- `tests/`
- `scripts/`
- `.github/workflows/`
- `.github/ISSUE_TEMPLATE/`

### Step 3: Configure Repository

Add repository-specific configuration files appropriate to the technology stack, including but not limited to:

- `.gitignore`
- Dependency manifests (`package.json`, `pyproject.toml`, `go.mod`, etc.)
- Linter and formatter configuration
- Editor configuration (`.editorconfig`)

All configuration must respect `CONFIGURATION_POLICY.md`.

### Step 4: Attach Knowledge Base

In `AGENT_CONTEXT.md` and `ARCHITECTURE_ALIGNMENT.md`, declare:

- Knowledge Base version
- Required KB documents for this repository
- Relevant ADRs
- Any known deviations

### Step 5: Attach Engineering Specifications

In `ARCHITECTURE_ALIGNMENT.md`, declare:

- Engineering Specification version
- Referenced specifications
- Architectural constraints derived from specifications

### Step 6: Generate AI Context

Ensure `AGENT_CONTEXT.md` contains:

- Repository purpose
- Supported domains
- Knowledge Base version
- Required documents
- Repository rules
- Coding standards
- Forbidden actions
- Boot sequence

### Step 7: Enable CI

Create an initial CI workflow in `.github/workflows/` that runs the minimum checks defined in `QUALITY_GATES.md`:

- Repository metadata validation
- Required file presence checks
- Linting (if applicable)
- Security baseline scan

### Step 8: Repository Ready

Once all quality gates pass, update repository status to `Ready` in `README.md`, `AGENT_CONTEXT.md`, and `PROGRESS.md`.

---

## 4. Post-Bootstrap Requirements

After the repository is marked `Ready`:

- Platform program management records the repository in the repository registry.
- Cross-repository dependencies are declared in program management artifacts.
- The repository owner receives notification of readiness.
- The repository is eligible for active development.

---

## 5. Bootstrap Checklist

- [ ] Repository created and named correctly
- [ ] Default branch and branch protection configured
- [ ] Bootstrap templates copied and adapted
- [ ] Standard directory structure created
- [ ] Repository metadata declared in `README.md`
- [ ] `AGENT_CONTEXT.md` generated with boot sequence
- [ ] `ARCHITECTURE_ALIGNMENT.md` references KB and specs
- [ ] `CONTRIBUTING.md` customized
- [ ] `CHANGELOG.md` initialized
- [ ] `PROGRESS.md` populated
- [ ] `CODEOWNERS` assigned
- [ ] `LICENSE` selected
- [ ] Configuration files added per `CONFIGURATION_POLICY.md`
- [ ] Dependencies declared per `DEPENDENCY_POLICY.md`
- [ ] Security baseline satisfied per `SECURITY_BASELINE.md`
- [ ] Initial CI workflow enabled
- [ ] Quality gates reviewed
- [ ] Repository status updated to `Ready`
