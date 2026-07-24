# Dependency Model

This document defines the dependency rules and linking conventions for engineering work.

## Dependency Hierarchy

```text
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

## Mandatory Parent Links

| Work Item | Must Have Parent | Reference |
|-----------|------------------|-----------|
| Epic | Engineering Specification | specifications/<domain>/<SPEC-ID>.md |
| Feature | Epic | epics/<EPIC-ID>.md |
| Task | Feature | features/<FEAT-ID>.md |
| Bug | Feature, Epic, or Specification | Parent item |
| Spike | Feature, Epic, or Specification | Parent item |

## Dependency Rules

- No Task exists without a parent Feature.
- No Feature exists without a parent Epic.
- No Epic exists without an Engineering Specification.
- No Engineering Specification exists without a Knowledge Base reference.

## Dependency Types

| Type | Meaning | Example |
|------|---------|---------|
| blocks | This item must complete before another can start. | TASK-0001 blocks TASK-0002 |
| depends-on | This item cannot start until another completes. | TASK-0002 depends-on TASK-0001 |
| related-to | Logical association without hard dependency. | FEAT-0001 related-to FEAT-0002 |
| part-of | This item is a component of another. | TASK-0001 part-of FEAT-0001 |

## Declaring Dependencies

Dependencies are declared in the work item file:

```markdown
## Dependencies

- depends-on: [TASK-0001 Title](tasks/TASK-0001.md)
- blocks: [TASK-0003 Title](tasks/TASK-0003.md)
- related-to: [FEAT-0002 Title](features/FEAT-0002.md)
```

## Validation

- Circular dependencies are prohibited.
- A Task cannot move to `In Progress` until all `depends-on` items are `Done`.
- Blocked items must document the blocker and impacted dependencies.

## Cross-Repository Dependencies

When a Task depends on work in another repository:

- Link to the related work item or pull request.
- Identify the owning team or repository.
- Track the dependency until resolved.

## Impact Analysis

When a work item changes, review:

- Items it blocks.
- Items it depends on.
- Related items that may need updates.

Update dependent work items as needed and record changes in their history.
