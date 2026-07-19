# Repository Structure Standard

**KB-141-B — Repository Structure**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-141-B |
| Title | Repository Structure |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Platform Engineering |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines the standard file and directory structure for every DUKADESK repository. A consistent structure enables discoverability, tooling, and safe AI agent navigation.

---

## 2. Standard Structure

Every bootstrapped repository must contain the following top-level structure:

```
repository/
├── README.md                          ← Entry point for humans and AI
├── AGENT_CONTEXT.md                   ← AI-specific context and rules
├── ARCHITECTURE_ALIGNMENT.md          ← Alignment with Knowledge Base and specs
├── PROGRESS.md                        ← Current development status
├── CONTRIBUTING.md                    ← Contribution guidelines
├── CHANGELOG.md                       ← Version history
├── CODEOWNERS                         ← Ownership and review assignments
├── LICENSE                            ← License file
│
├── docs/                              ← Repository-specific documentation
│   └── README.md
│
├── src/                               ← Source code
│   └── README.md
│
├── tests/                             ← Test suites
│   └── README.md
│
├── scripts/                           ← Automation and utility scripts
│   └── README.md
│
└── .github/
    ├── workflows/                     ← CI/CD pipelines
    ├── ISSUE_TEMPLATE/                ← Issue templates
    └── PULL_REQUEST_TEMPLATE.md       ← Pull request template
```

---

## 3. Root Files

### README.md

The primary entry point. Must contain repository metadata, purpose, status, and usage instructions.

### AGENT_CONTEXT.md

AI-specific context. Must contain the boot sequence, required documents, repository rules, coding standards, and forbidden actions.

### ARCHITECTURE_ALIGNMENT.md

Alignment artifact. Must reference the Knowledge Base version, Engineering Specifications, ADRs, architectural constraints, and known deviations.

### PROGRESS.md

Living status document. Tracks what is complete, in progress, planned, and blocked.

### CONTRIBUTING.md

Guidelines for contributors, including branch naming, commit conventions, review process, and standards compliance.

### CHANGELOG.md

Version history following semantic versioning. Each release documents added, changed, deprecated, removed, fixed, and security items.

### CODEOWNERS

Declares owners for directories and files. Used for automatic reviewer assignment and accountability.

### LICENSE

License under which the repository is distributed.

---

## 4. Directories

### docs/

Repository-specific documentation that is not part of the organization-wide Knowledge Base.

Contents may include:

- Setup and onboarding guides
- API usage documentation
- Operational runbooks
- Decision records specific to the repository

### src/

All source code for the repository. Substructure is technology-specific but must be documented in `src/README.md`.

### tests/

All automated tests. Must mirror or clearly map to the structure of `src/`.

Subdirectories may include:

- `unit/`
- `integration/`
- `e2e/`
- `fixtures/`

### scripts/

Automation scripts for local development, CI helpers, deployment, and maintenance.

Scripts must be documented with usage comments or a `scripts/README.md`.

### .github/

GitHub-specific configuration.

#### .github/workflows/

CI/CD pipeline definitions. Every repository must have at least:

- A validation workflow for pull requests
- A security baseline workflow

#### .github/ISSUE_TEMPLATE/

Issue templates for bug reports, feature requests, and other common issue types.

#### .github/PULL_REQUEST_TEMPLATE.md

Pull request template that enforces description, checklists, and references to related issues or specs.

---

## 5. Permitted Extensions

Repositories may add additional directories and files as needed for their technology stack, provided they do not duplicate the purpose of standard directories and are documented in `README.md` or `AGENT_CONTEXT.md`.

Examples of permitted extensions:

- `infra/` — infrastructure-as-code
- `config/` — runtime configuration schemas
- `migrations/` — database migrations
- `examples/` — usage examples
- `.vscode/` — editor settings

---

## 6. Forbidden Layouts

The following are not permitted in a DUKADESK repository:

- Source code at the repository root except for small configuration files
- Documentation scattered without a `docs/` directory or `README.md` plan
- Test files mixed with source files without documented rationale
- Secrets, credentials, or environment files committed to version control
- Build artifacts committed to version control

---

## 7. Verification

Repository structure is verified by the CI workflow defined in `QUALITY_GATES.md`. The validation script checks for the presence of required files and directories.
