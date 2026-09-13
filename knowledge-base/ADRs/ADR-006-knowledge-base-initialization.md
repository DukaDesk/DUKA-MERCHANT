# ADR-006: Knowledge Base Initialization

**Status:** ✅ Accepted  
**Date:** 2026-07-09  
**Author:** Architecture Team

## Context

DUKADESK has multiple engineering repositories (mobile, backend, builder, dashboards, website). Each needs consistent architecture, standards, and terminology. Without a canonical source of truth, repos drift independently.

## Decision

Establish the Engineering Knowledge Base as a first-class, independent repository at `github.com/DukaDesk/KNOWLEDGE-BASE`. Each implementation repo references rather than duplicates the Knowledge Base.

### Structure

```
workspace/
├── KNOWLEDGE-BASE/     ← Canonical source of truth
├── backend/
├── mobile/
├── builder/
├── website/
├── business-dashboard/
├── tenant-dashboard/
└── infrastructure/
```

### Versioning

Each repository includes a `knowledge-base-version.md` declaring:
- `Version` — Knowledge Base version it aligns with
- `Verified Commit` — Specific commit it was verified against
- `Status` — Compatible, Needs Review, Out of Sync

### Workflow

1. Architecture change needed → update Knowledge Base first
2. New ADR → merge to Knowledge Base
3. Only then update implementation repos
4. PRs check Knowledge Base alignment

### AI Agents

Every AI agent must run the Agent Boot Process before starting work. Agents must treat the Knowledge Base as the authoritative source of truth.

## Consequences

- All repos share a single source of architectural truth
- Changes are traceable via ADRs
- AI agents produce consistent code across repos
- CI can verify alignment between repos and Knowledge Base

## Status

Accepted. Knowledge Base initialized with ADRs, specs, glossary, standards, and agent boot process.
