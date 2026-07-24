# Engineering Work Management

This repository is the central work management layer for DUKADESK OS. It sits between Engineering Specifications and implementation repositories, translating approved specifications into actionable, traceable, and verifiable work.

## Purpose

Engineering Work Management defines how work is structured, assigned, prioritized, estimated, tracked, and verified. It ensures every line of implementation can be traced back to a specification, an ADR, and the knowledge base.

## Repository Structure

```text
engineering-work/
  README.md                       # This file
  WORKFLOW.md                     # End-to-end work workflow
  WORK_ITEM_LIFECYCLE.md          # Lifecycle states for work items
  PRIORITY_MODEL.md               # How work is prioritized
  ESTIMATION_MODEL.md             # How effort is estimated
  DEPENDENCY_MODEL.md             # Dependency rules and linking
  AI_ASSIGNMENT_MODEL.md          # AI role assignment rules
  VERIFICATION_MODEL.md           # Verification gates
  STATUS_MODEL.md                 # Status definitions and transitions
  epics/                          # Epic work items
  features/                       # Feature work items
  tasks/                          # Task work items
  bugs/                           # Bug work items
  spikes/                         # Spike work items
  templates/                      # Work item templates
  registry/                       # Indexes
```

## Complete Operating System

```text
Knowledge Base
        ↓
Engineering Specifications
        ↓
Repository Governance
        ↓
Engineering Work Management
        ↓
Implementation Repositories
        ↓
Verification
        ↓
Release
```

## Work Hierarchy

```text
Vision
    ↓
Knowledge Base
    ↓
ADR
    ↓
Engineering Specification
    ↓
Epic
    ↓
Feature
    ↓
Task
    ↓
Implementation
```

## Work Item Types

| Type | Prefix | Purpose |
|------|--------|---------|
| Epic | EPIC-0001 | Owns a business objective |
| Feature | FEAT-0001 | Implements part of an Epic |
| Task | TASK-0001 | Atomic unit of implementation |
| Bug | BUG-0001 | Defect or incident fix |
| Spike | SPIKE-0001 | Time-boxed research or exploration |

## Dependency Rules

- No Task exists without a parent Feature.
- No Feature exists without a parent Epic.
- No Epic exists without an Engineering Specification.
- No Engineering Specification exists without a Knowledge Base reference.

## Getting Started

1. Read [WORKFLOW.md](WORKFLOW.md).
2. Check [STATUS_MODEL.md](STATUS_MODEL.md) for state definitions.
3. Use a template from [templates/](templates/) to create a work item.
4. Register the work item in the appropriate registry index.
5. Move it through the lifecycle.

## Governance

This repository is governed by [Repository Governance](../engineering-governance/repository-governance/) and informed by [Engineering Specifications](../engineering-specifications/).
