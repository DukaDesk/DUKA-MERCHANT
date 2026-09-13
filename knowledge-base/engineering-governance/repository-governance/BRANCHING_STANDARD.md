# Branching Standard

This document defines the branch model and naming conventions for all implementation repositories.

## Branch Model

Use a trunk-based workflow with short-lived feature branches.

```text
main (protected)
    ↑
feature/...
    ↑
hotfix/...
    ↑
release/...
```

## Protected Branches

- `main` is the primary integration branch.
- Direct pushes to `main` are prohibited.
- All changes enter `main` through pull requests.

## Branch Types

| Type | Prefix | Purpose | Example |
|------|--------|---------|---------|
| Feature | `feature/` | New capability or change | `feature/FEAT-0001-onboarding` |
| Bug Fix | `fix/` | Defect resolution | `fix/API-0001-null-check` |
| Hotfix | `hotfix/` | Urgent production fix | `hotfix/SEC-0001-token-leak` |
| Release | `release/` | Release preparation | `release/v1.2.0` |
| Refactor | `refactor/` | Non-functional restructuring | `refactor/INFRA-0001-cleanup` |
| Docs | `docs/` | Documentation changes | `docs/FEAT-0001-readme` |

## Naming Rules

1. Branch names are lowercase.
2. Use hyphens to separate words.
3. Include the relevant specification ID when applicable.
4. Keep names concise but descriptive.

## Lifecycle

1. Create a branch from the latest `main`.
2. Make focused, reviewable commits.
3. Open a pull request against `main`.
4. Delete the branch after merge.

## Commit Messages

- Use the present imperative mood.
- Reference the specification ID in the subject.

Example:

```text
FEAT-0001: add tenant onboarding service

- Implements workspace creation
- Adds invitation email flow
```

## Enforcement

Branch naming and commit message conventions are enforced by CI hooks where possible.
