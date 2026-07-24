# AI Context Standard

This document defines the `AGENT_CONTEXT.md` files used by AI agents when working in implementation repositories.

## Purpose

`AGENT_CONTEXT.md` gives AI agents the essential context needed to work safely and effectively in a repository without requiring full codebase ingestion every session.

## Required Location

Each implementation repository must contain:

```text
<repository-root>/AGENT_CONTEXT.md
```

## Required Sections

| Section | Purpose |
|---------|---------|
| Overview | What the repository does |
| Responsibilities | What this repository owns and does not own |
| Technology Stack | Languages, frameworks, and tools |
| Repository Structure | Key directories and files |
| Build and Test | How to build and run tests |
| Engineering Standards | Links to governance standards |
| Specification Traceability | Active specifications that target this repository |
| Agent Conventions | Rules for AI-generated changes |
| Common Tasks | Typical operations agents perform |
| Escalation | When to stop and ask for human input |

## Update Rules

- Update `AGENT_CONTEXT.md` when the repository structure, stack, or responsibilities change.
- Update the specification traceability section whenever a new specification targets the repository.
- Verify accuracy during release readiness.

## Conventions

- Use Markdown.
- Keep the file concise but complete.
- Prefer relative links to local files.
- Reference engineering specifications by ID.

## Example

See any `AGENT_CONTEXT.md` in the implementation repositories for a concrete example.

## Compliance

A missing or outdated `AGENT_CONTEXT.md` is a release blocker.
