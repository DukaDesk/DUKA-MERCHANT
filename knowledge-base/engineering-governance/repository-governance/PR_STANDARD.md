# Pull Request Standard

This document defines the format and requirements for all pull requests.

## Title Format

```text
[<SPEC-ID>] Short imperative description
```

Example:

```text
[FEAT-0001] Add tenant onboarding service
```

If multiple specifications apply, list the primary one or use a summary prefix.

## Description Template

```markdown
## Summary

## Related Specifications

- [FEAT-0001 Title](../../engineering-specifications/specifications/features/FEAT-0001.md)

## Related Work Items

- Closes #123

## Changes

- Change one
- Change two

## Verification

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual verification completed

## Checklist

- [ ] Code follows repository style
- [ ] Documentation updated
- [ ] No secrets committed
```

## Required Links

Every pull request must reference:

- At least one engineering specification by ID.
- At least one work item or issue.

## Size

Pull requests should be small and focused. As a guideline:

- Fewer than 500 lines of code changed.
- Single concern or specification.
- Reviewable within 30 minutes.

## Draft Pull Requests

Use draft status for work in progress. Convert to ready for review only when:

- All CI checks pass.
- Description is complete.
- Self-review completed.

## Merging

- Only squash or merge commits that preserve the specification ID in the message.
- Delete the source branch after merge.
- Ensure the target branch remains green.

## Compliance

Non-compliant pull requests may be rejected by maintainers or automated checks.
