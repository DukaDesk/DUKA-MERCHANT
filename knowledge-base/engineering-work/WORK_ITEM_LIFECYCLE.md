# Work Item Lifecycle

This document defines the lifecycle states and transitions for all work items in the engineering-work repository.

## Lifecycle States

```text
Backlog
Ready
Assigned
In Progress
Review
Verified
Done
Blocked
Cancelled
```

## State Definitions

### Backlog
- Work item is captured but not yet prioritized or refined.
- Entry: Item created.
- Exit: Item is refined and prioritized.

### Ready
- Work item is well-defined, estimated, and ready for assignment.
- Entry: Requirements, dependencies, and acceptance criteria are clear.
- Exit: An assignee is selected.

### Assigned
- Work item has an owner or agent.
- Entry: Assignee accepted the item.
- Exit: Work begins.

### In Progress
- Work item is actively being implemented.
- Entry: Implementation branch created or work started.
- Exit: Implementation complete and ready for review.

### Review
- Work item output is under review.
- Entry: Pull request opened or review requested.
- Exit: Review approved or changes requested.

### Verified
- All verification gates are satisfied.
- Entry: Tests pass, documentation updated, traceability confirmed.
- Exit: Code merged or item closed.

### Done
- Work item is complete and released or delivered.
- Entry: Code merged and verified.
- Exit: None.

### Blocked
- Work item cannot proceed due to an external dependency or issue.
- Entry: Any active state.
- Exit: Blocker resolved.

### Cancelled
- Work item is no longer needed.
- Entry: Any state.
- Exit: None.

## Transitions

| From | To | Authorized By | Evidence |
|------|----|---------------|----------|
| Backlog | Ready | Engineering Lead | Refined item |
| Ready | Assigned | Engineering Lead | Assignee recorded |
| Assigned | In Progress | Assignee | Branch or work started |
| In Progress | Review | Assignee | PR opened |
| Review | Verified | Reviewer + Verification Agent | Approval + evidence |
| Review | In Progress | Reviewer | Change request |
| Verified | Done | Engineering Lead | Merge / closure |
| Any active | Blocked | Assignee or Lead | Blocker documented |
| Blocked | Previous state | Assignee or Lead | Blocker resolved |
| Any | Cancelled | Product Lead | Cancellation reason |

## State Notation

Each work item file must declare its current state in the header:

```yaml
---
status: In Progress
---
```

Registry indexes must be updated whenever a state changes.
