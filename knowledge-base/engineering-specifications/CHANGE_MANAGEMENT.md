# Change Management

This document defines how engineering specifications are created, modified, and retired.

## Creating a New Specification

1. Identify the correct domain and prefix using [SPECIFICATION_NUMBERING.md](SPECIFICATION_NUMBERING.md).
2. Copy the appropriate template from [templates/](templates/).
3. Assign the next available ID from [SPECIFICATION_INDEX.md](SPECIFICATION_INDEX.md).
4. Fill in all required sections.
5. Open a change proposal as a pull request.
6. Move the specification to `Review` once the proposal is ready.

## Modifying a Specification

### Before Approval

While a specification is in `Draft` or `Review`, the author may make changes freely. Record significant changes in the `Change History`.

### After Approval

Once a specification is `Approved` or beyond, changes require a formal change proposal:

1. Create a branch for the proposed change.
2. Update the specification file.
3. Add a new entry to the `Change History` describing:
   - Date
   - Author
   - Change summary
   - Affected sections
   - Approval reference
4. Open a pull request referencing the specification ID.
5. Obtain approval from the same authority required for the current lifecycle state.

## Change Categories

| Category | Description | Approval |
|----------|-------------|----------|
| Editorial | Spelling, formatting, clarifications that do not alter meaning. | Author |
| Minor | Wording changes, additional examples, non-functional refinements. | Domain Lead |
| Major | New requirements, changed scope, modified acceptance criteria. | Full review per governance |
| Deprecation | Marking a specification as no longer recommended. | Product + Architecture Lead |
| Archival | Moving a deprecated specification to historical status. | Governance Lead |

## Retirement

To retire a specification:

1. Create a deprecation change proposal.
2. Link the superseding specification or retirement rationale.
3. Update related specifications to remove or update dependencies.
4. Move the specification to `Deprecated`.
5. When no active references remain, move it to `Archived`.

## Change Proposal Template

```markdown
# Change Proposal: <SPEC-ID>

## Proposer

## Change Category

## Summary

## Affected Sections

## Rationale

## Impact on Related Specifications

## Verification Plan
```

## Audit Trail

All changes must be visible in the `Change History` and in version control. The Governance Lead periodically audits the index against the files in `specifications/`.
