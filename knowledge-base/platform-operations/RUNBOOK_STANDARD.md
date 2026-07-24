# Runbook Standard

This document defines the format and requirements for operational runbooks.

## Purpose

Runbooks provide step-by-step procedures for operating, troubleshooting, and recovering platform services.

## Required Runbooks

Every critical service must have:

```text
Startup
Shutdown
Deployment
Rollback
Recovery
Scaling
Maintenance
Troubleshooting
```

## Runbook Format

Each runbook must include:

| Section | Content |
|---------|---------|
| Title | Runbook name and service |
| Owner | Responsible team or individual |
| Last Updated | Date of last review |
| Prerequisites | Tools, access, and knowledge required |
| Procedure | Numbered steps |
| Verification | How to confirm success |
| Rollback | How to undo if something goes wrong |
| Escalation | When and how to escalate |

## Runbook Template

```markdown
# Runbook: <Service> <Operation>

## Owner

## Last Updated

## Prerequisites

1. Item

## Procedure

1. Step one
2. Step two

## Verification

## Rollback

## Escalation
```

## Maintenance

- Runbooks are reviewed quarterly.
- Runbooks are updated after incidents or process changes.
- Outdated runbooks trigger alerts during audits.

## Storage

Runbooks are stored in:

- `docs/runbooks/` within service repositories
- Linked from [SERVICE_CATALOG.md](SERVICE_CATALOG.md)

## Verification

Runbook procedures are tested during drills and staging exercises.
