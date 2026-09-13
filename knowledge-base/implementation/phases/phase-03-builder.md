# Phase 03: Builder Engine

## Objectives

Build the visual builder that allows tenant admins to design and publish apps.

## Prerequisites

- Phase 02 Runtime Engine complete.
- SDK published.

## Deliverables

- Builder Studio canvas.
- Component library palette.
- Property editors.
- Theme and navigation editors.
- Publish flow.

## Exit Criteria

- [ ] User can create a simple app in the builder.
- [ ] App preview renders correctly.
- [ ] App can be published.
- [ ] Published app is consumable by runtime.

## Dependencies

- Phase 02 Runtime Engine
- SDK

## Repositories Involved

- builder/
- sdk/
- backend/

## Specifications Required

- FEAT-0011 Builder Engine Core
- UI-0005 Builder Studio Interface

## Verification Required

- Builder E2E tests.
- Publish and render tests.
- User acceptance testing.

## Risks

| Risk | Mitigation |
|------|------------|
| Builder complexity | Iterative component rollout |
| Export format stability | Version the schema |
