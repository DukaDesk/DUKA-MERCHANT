# Developer Experience (DevEx)

This repository is the operating manual for every developer and AI agent working on DUKADESK OS.

## Purpose

Developer Experience defines the day-to-day workflow, tools, standards, and checklists that engineers and agents follow from cloning a repository to shipping a release. It ensures consistency, quality, and traceability across every codebase.

## Repository Structure

```text
developer-experience/
  README.md                       # This file
  ENGINEERING_LIFECYCLE.md        # End-to-end engineering lifecycle
  LOCAL_DEVELOPMENT.md            # Local development setup
  ENVIRONMENT_STRATEGY.md         # Environment model
  DEPENDENCY_MANAGEMENT.md        # Dependency rules
  CODE_GENERATION.md              # AI and template code generation
  TESTING_STRATEGY.md             # Testing approach
  DEBUGGING_GUIDE.md              # Debugging procedures
  CI_CD_WORKFLOW.md               # Continuous integration and delivery
  CODE_REVIEW_GUIDE.md            # Review practices
  RELEASE_PROCESS.md              # Release workflow
  ONBOARDING.md                   # Onboarding guide
  templates/                      # Reusable templates
  checklists/                     # Executable checklists
```

## Engineering Operating System

```text
Knowledge Base
        ↓
Engineering Specifications
        ↓
Repository Governance
        ↓
Engineering Work Management
        ↓
Developer Experience
        ↓
Implementation Repositories
        ↓
Verification
        ↓
Release
```

## Engineering Lifecycle

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

## Workflows

| Workflow | Document |
|----------|----------|
| AI Workflow | [ENGINEERING_LIFECYCLE.md](ENGINEERING_LIFECYCLE.md) |
| Human Workflow | [ENGINEERING_LIFECYCLE.md](ENGINEERING_LIFECYCLE.md) |
| Pull Request | [CODE_REVIEW_GUIDE.md](CODE_REVIEW_GUIDE.md) |
| Release | [RELEASE_PROCESS.md](RELEASE_PROCESS.md) |
| CI/CD | [CI_CD_WORKFLOW.md](CI_CD_WORKFLOW.md) |

## Getting Started

New contributors and agents should start with [ONBOARDING.md](ONBOARDING.md).

## Updates

Propose changes to DevEx standards through the same governance process used for engineering specifications.
