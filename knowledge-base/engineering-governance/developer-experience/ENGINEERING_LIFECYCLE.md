# Engineering Lifecycle

This document defines the end-to-end engineering lifecycle for DUKADESK OS.

## Overview

```text
Clone Repository
    ↓
AI Boot Process
    ↓
Repository Context
    ↓
Environment Setup
    ↓
Read Engineering Specification
    ↓
Create Branch
    ↓
Implementation
    ↓
Testing
    ↓
Verification
    ↓
Pull Request
    ↓
Review
    ↓
Merge
    ↓
Release
    ↓
Knowledge Base Update (if architecture changed)
```

## AI Workflow

```text
Boot
    ↓
Read Context
    ↓
Read Specification
    ↓
Implement
    ↓
Self Verify
    ↓
Update Progress
    ↓
Hand Off
```

### 1. Boot
- Clone or open the repository.
- Run the bootstrap script per [BOOT_PROCESS_STANDARD.md](../repository-governance/BOOT_PROCESS_STANDARD.md).

### 2. Read Context
- Read `AGENT_CONTEXT.md`.
- Read `PROGRESS.md` for current state.
- Read `ARCHITECTURE_ALIGNMENT.md` for constraints.

### 3. Read Specification
- Read the linked Engineering Specification.
- Confirm acceptance criteria and scope.

### 4. Implement
- Create a branch per [BRANCHING_STANDARD.md](../repository-governance/BRANCHING_STANDARD.md).
- Write code, tests, and documentation.
- Reference Task and Specification IDs in commits.

### 5. Self Verify
- Run the full test suite.
- Run linters and type checks.
- Confirm architecture alignment.

### 6. Update Progress
- Update `PROGRESS.md` with completed work.
- Record any blockers or deviations.

### 7. Hand Off
- Open a Pull Request.
- Assign Review and Verification agents.

## Human Workflow

```text
Select Task
    ↓
Read Specification
    ↓
Implement
    ↓
Verify
    ↓
Create PR
    ↓
Review
    ↓
Merge
```

### 1. Select Task
- Pick a Task from [engineering-work](../engineering-work/).
- Confirm it is in `Ready` or `Assigned` state.

### 2. Read Specification
- Read the linked Engineering Specification.
- Understand acceptance criteria and dependencies.

### 3. Implement
- Create a branch.
- Write focused, reviewable changes.

### 4. Verify
- Run tests locally.
- Confirm the change satisfies the specification.

### 5. Create PR
- Follow [PR_STANDARD.md](../repository-governance/PR_STANDARD.md).
- Link Task and Specification IDs.

### 6. Review
- Participate in code review.
- Address feedback.

### 7. Merge
- Merge only when all gates pass.

## Definition of Done

Work is complete only when:

```text
Implementation Complete
Tests Passing
Verification Complete
Documentation Updated
Traceability Complete
Merged
Released
```

## Lifecycle Touchpoints

| Stage | Key Document | Owner |
|-------|--------------|-------|
| Clone | README.md | Engineer / Agent |
| Boot | BOOT_PROCESS_STANDARD.md | Agent |
| Context | AGENT_CONTEXT.md | Agent |
| Specification | Engineering Specification | Engineering Lead |
| Branch | BRANCHING_STANDARD.md | Implementer |
| PR | PR_STANDARD.md | Implementer |
| Review | REVIEW_STANDARD.md | Reviewer |
| Release | RELEASE_STANDARD.md | Release Manager |
| Knowledge Update | ADR / KB | Architect |
