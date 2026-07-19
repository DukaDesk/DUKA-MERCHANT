# Work Workflow

This document defines the end-to-end workflow for engineering work from specification to implementation.

## Overview

```text
Engineering Specification
    ↓
Epic
    ↓
Feature
    ↓
Task
    ↓
Pull Request
    ↓
Merge
    ↓
Release
```

## Step-by-Step Workflow

### 1. Specification Review
- Confirm the Engineering Specification is in `Approved` or `Ready` state.
- Identify target repositories and acceptance criteria.

### 2. Epic Creation
- Create an Epic that captures the business objective.
- Link the Epic to the Engineering Specification.
- Register the Epic in [registry/EPIC_INDEX.md](registry/EPIC_INDEX.md).

### 3. Feature Breakdown
- Break the Epic into Features.
- Each Feature represents a user-visible or system-significant capability.
- Register Features in [registry/FEATURE_INDEX.md](registry/FEATURE_INDEX.md).

### 4. Task Definition
- Break Features into atomic Tasks.
- Each Task references a Specification, Repository, Acceptance Criteria, Dependencies, Estimated Effort, Assignee, and Verification Method.
- Register Tasks in [registry/TASK_INDEX.md](registry/TASK_INDEX.md).

### 5. Assignment
- Assign Tasks to Human or AI agents according to [AI_ASSIGNMENT_MODEL.md](AI_ASSIGNMENT_MODEL.md).
- Update Task status to `Assigned`.

### 6. Implementation
- Agent creates a branch and implements the Task.
- Commits reference the Task ID and Engineering Specification ID.

### 7. Pull Request
- Agent opens a Pull Request against the target repository.
- PR references the Task and Specification.

### 8. Review
- Reviewers evaluate the change per [REVIEW_STANDARD.md](../engineering-governance/repository-governance/REVIEW_STANDARD.md).
- Task status moves to `Review`.

### 9. Verification
- Verification gates are satisfied per [VERIFICATION_MODEL.md](VERIFICATION_MODEL.md).
- Task status moves to `Verified`.

### 10. Merge and Release
- Code is merged.
- Task status moves to `Done`.
- Release includes the completed Task.

## Status Flow

```text
Backlog → Ready → Assigned → In Progress → Review → Verified → Done
```

Tasks may also move to `Blocked` or `Cancelled` from any active state.

## Responsibilities

| Role | Responsibility |
|------|----------------|
| Engineering Lead | Creates Epics and assigns Features. |
| Product Lead | Validates Epic business value. |
| Implementer | Executes Tasks and opens PRs. |
| Reviewer | Reviews implementation. |
| Verification Agent | Confirms acceptance and tests. |
| Documentation Agent | Updates docs and context. |
