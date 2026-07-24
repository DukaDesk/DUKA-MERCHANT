# Code Review Guide

This document defines the pull request and code review workflow.

## Pull Request Workflow

```text
Task
    ↓
Implementation
    ↓
Self Verification
    ↓
AI Review
    ↓
Human Review
    ↓
Architecture Check
    ↓
Merge
```

## Merge Requirements

Every PR must satisfy:

```text
Linked Task
Linked Engineering Specification
Repository Standards
Tests Passing
Architecture Alignment
Documentation Updated
```

## Self Verification

Before requesting review, the author must:

- [ ] Run the full test suite.
- [ ] Run linters and formatters.
- [ ] Review their own diff.
- [ ] Confirm the change satisfies the specification.
- [ ] Update relevant documentation.

## AI Review

AI Review Agents check:

- Specification alignment
- Style and conventions
- Test coverage
- Security issues
- Common bugs

## Human Review

Human reviewers evaluate:

- Design and architecture
- Business logic correctness
- Maintainability
- Edge cases

## Architecture Check

For cross-cutting or significant changes, an Architecture Lead confirms:

- ADR alignment
- System-wide impact
- Long-term maintainability

## Review Comments

- Be specific and constructive.
- Distinguish between blocking and non-blocking feedback.
- Suggest improvements, not just problems.

## Approval

Approval means the reviewer is confident the change is ready to merge. Approvers are accountable for the quality of what they approve.

## Merge

Merge only when:

- All required reviews are complete.
- All CI checks pass.
- All blocking comments are resolved.
- The branch is up to date with the target.

## Post-Merge

After merge:

- Delete the source branch.
- Update task status.
- Monitor for issues.
