# Priority Model

This document defines how engineering work is prioritized.

## Priority Levels

| Level | Name | Description |
|-------|------|-------------|
| P0 | Critical | Blocks release or production operation; must be resolved immediately. |
| P1 | High | Significant business or user impact; should be completed in current cycle. |
| P2 | Medium | Important but not urgent; scheduled for upcoming cycle. |
| P3 | Low | Nice to have; addressed when capacity allows. |
| P4 | Triage | Not yet evaluated or deferred. |

## Priority Assignment

Priority is assigned based on:

1. **Business Impact**: Effect on revenue, users, or strategic goals.
2. **Technical Risk**: Security, stability, or architecture risk.
3. **Dependencies**: Other work blocked until this is complete.
4. **Effort**: Smaller high-value items may be prioritized.
5. **Regulatory or Compliance**: Required for legal or contractual reasons.

## Priority by Work Item Type

| Type | Default Priority Source |
|------|-------------------------|
| Epic | Product Lead and Engineering Lead |
| Feature | Parent Epic priority and technical input |
| Task | Parent Feature priority and effort |
| Bug | Severity and impact |
| Spike | Learning value and unblock potential |

## Escalation

- P0 items bypass normal scheduling and are communicated immediately.
- P1 items require explicit slotting in the current cycle.
- Priority disputes are escalated to the Engineering Steering Group.

## Priority Notation

Record priority in the work item header:

```yaml
---
priority: P1
---
```

## Re-prioritization

Priority may change when:

- Business context shifts.
- New critical issues arise.
- Dependencies are resolved or created.

All priority changes are recorded in the work item `Change History`.
