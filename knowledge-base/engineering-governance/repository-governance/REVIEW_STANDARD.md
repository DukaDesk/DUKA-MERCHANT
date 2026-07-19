# Review Standard

This document defines the code review process and quality gates.

## Review Goals

- Verify correctness and completeness.
- Ensure alignment with specifications.
- Maintain consistency and quality.
- Share knowledge across the team.

## Required Reviewers

| Change Type | Minimum Reviewers |
|-------------|-------------------|
| Standard change | 1 domain peer |
| Cross-cutting change | 1 domain peer + 1 architecture representative |
| Security-sensitive change | 1 security reviewer |
| Breaking change | 2 reviewers + architecture sign-off |
| Hotfix | 1 reviewer with post-merge review |

## Review Checklist

- [ ] Specification alignment: Does the change implement the linked specification?
- [ ] Tests: Are tests present, meaningful, and passing?
- [ ] Code quality: Is the code readable, maintainable, and consistent?
- [ ] Documentation: Are comments, README, and agent context updated?
- [ ] Security: Are inputs validated, secrets protected, and dependencies safe?
- [ ] Performance: Are obvious performance issues addressed?
- [ ] Backward compatibility: Are breaking changes intentional and documented?

## Reviewer Responsibilities

- Request changes for blocking issues.
- Approve only when satisfied.
- Be specific in comments.
- Respond within one business day.

## Author Responsibilities

- Keep pull requests focused.
- Provide clear descriptions.
- Respond to feedback promptly.
- Resolve conflicts before re-requesting review.

## Approval and Merge

- All blocking comments must be resolved.
- All CI checks must pass.
- At least one approved review is required before merge.
- Maintainers may enforce additional rules for protected branches.

## Post-Merge Review

Hotfixes merged under emergency process must receive a post-merge review within 24 hours.
