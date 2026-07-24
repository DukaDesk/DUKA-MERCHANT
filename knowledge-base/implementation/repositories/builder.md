# builder

## Purpose

Visual builder for designing tenant apps.

## Startup Order

4 of 9

## Owner

Team D (Builder Team)

## Prerequisites

- sdk/ published.
- Runtime engine architecture defined.

## Deliverables

- Builder canvas.
- Component palette.
- Property editors.
- Theme and navigation editors.
- Publish flow.

## Exit Criteria

- [ ] User can design a simple app.
- [ ] Preview renders correctly.
- [ ] App can be published.

## Dependencies

- sdk/
- backend/
- runtime engine

## Specifications Required

- FEAT-0011 Builder Engine Core
- UI-0005 Builder Studio Interface

## Verification

- E2E tests
- Preview render tests
- User acceptance tests

## Risks

| Risk | Mitigation |
|------|------------|
| Complex UI interactions | Iterative component rollout |
| Schema stability | Version exports |

## Links

- [AGENT_CONTEXT.md](../../builder/AGENT_CONTEXT.md)
- [ARCHITECTURE_ALIGNMENT.md](../../builder/ARCHITECTURE_ALIGNMENT.md)
