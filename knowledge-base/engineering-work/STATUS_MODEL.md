# Status Model

This document defines the status values used across all work items.

## Status Values

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

## Definitions

| Status | Meaning |
|--------|---------|
| Backlog | Captured but not yet refined or prioritized. |
| Ready | Refined, estimated, and available for assignment. |
| Assigned | Has an owner or agent. |
| In Progress | Actively being worked. |
| Review | Output is under review. |
| Verified | All verification gates satisfied. |
| Done | Complete and delivered. |
| Blocked | Cannot proceed due to a documented blocker. |
| Cancelled | No longer required. |

## Allowed Transitions

```text
Backlog → Ready
Ready → Assigned
Assigned → In Progress
In Progress → Review
Review → Verified
Review → In Progress
Verified → Done
Any active → Blocked
Blocked → Any previous active state
Any → Cancelled
```

## Status Change Rules

- Only the assignee, Engineering Lead, or authorized agent may change status.
- Status changes must include a rationale in the work item history.
- Blocked items must document the blocker and expected resolution.
- Cancelled items must record the cancellation reason.

## Aggregated Status

Feature and Epic status may be derived from child items:

| Aggregate Status | Condition |
|------------------|-----------|
| Backlog | All children are Backlog |
| Ready | All children are Ready or later, at least one Ready |
| In Progress | Any child is In Progress, Review, or Verified |
| Done | All children are Done or Cancelled |
| Blocked | Any child is Blocked |

## Reporting

The `registry/` indexes reflect the authoritative status of each work item. Dashboards and reports should read from the registry.

## Status Notation

```yaml
---
status: In Progress
---
```
