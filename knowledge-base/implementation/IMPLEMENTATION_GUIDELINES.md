# Implementation Guidelines

## Before You Start

Every repository and every implementer must:

1. Read the repository `AGENT_CONTEXT.md`.
2. Read the linked `Engineering Specification`.
3. Confirm the work item is in `Ready` or `Assigned` state.
4. Verify local environment with `scripts/bootstrap`, `scripts/build`, `scripts/test`.

## Branching

- Create feature branches from `main` or `develop`.
- Branch name: `feature/<TASK-ID>-short-description`.
- Commit messages must reference the task and specification IDs.

## Code Standards

- Follow repository conventions.
- Write tests for new behavior.
- Keep pull requests focused and reviewable.
- Do not bypass CI checks.

## Traceability

Every code change must trace to:

- A task in `engineering-work/`
- An engineering specification in `engineering-specifications/`
- A product feature in `product-definition/`

## Communication

- Update task status daily.
- Report blockers immediately.
- Coordinate cross-repository changes through the implementation lead.

## AI Agent Rules

- AI agents may implement, review, verify, or document.
- No single AI agent performs all roles on one task.
- AI agents escalate security, architecture, and compliance decisions to humans.

## Verification

Every task closes only when:

- Implementation matches the specification.
- Tests pass.
- Review is approved.
- Documentation is updated.
- Traceability is complete.
