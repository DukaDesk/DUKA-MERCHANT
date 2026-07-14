# DUKADESK Engineering Standards

**Last Updated:** 2026-07-09

## Knowledge Base First

The Knowledge Base is the authoritative source of truth for all architecture, standards, and decisions. Before making any implementation change:

1. Load the Knowledge Base
2. Read relevant ADRs, specs, and standards
3. Check the Progress Registry for status
4. Only then begin implementation

## Architecture Changes Require an ADR

Any change to architecture, terminology, or standards MUST be preceded by an ADR update. Implementation repositories must NEVER become the primary source of architectural truth.

**Process:**
1. Write the ADR in the Knowledge Base
2. Merge the ADR
3. Update affected specifications
4. Update the Glossary if terminology changed
5. Only then implement in the target repository

## PR Checklist

Every pull request must satisfy:

- [ ] Code updated
- [ ] Specification updated (if applicable)
- [ ] Knowledge Base updated (if architecture changed)
- [ ] ADR required? (yes/no)
- [ ] Developer docs impacted? (yes/no)

## AI Agent Rules

1. Agents MUST execute the Agent Boot Process before any task
2. Agents MUST NOT redefine existing concepts or invent alternative terminology
3. Agents MUST NOT change architecture without an ADR
4. Agents MUST NOT contradict previous engineering decisions
5. Agents MUST NOT bypass engineering standards
6. When conflicts are discovered, report them — do not silently modify architecture

## TypeScript Standards

- `strict: true` in tsconfig
- Prefer `type` imports over `interface` where possible
- Avoid `any` — use `unknown` and type guards
- Export types alongside their consumers when they're tightly coupled

## Commit Messages

Follow Conventional Commits:
```
feat: new feature
fix: bug fix
docs: documentation
refactor: code change without behavior change
perf: performance improvement
chore: maintenance, tooling
```

## Testing

- Component tests: prefer React Native Testing Library
- Store tests: test with Zustand directly
- Action tests: unit test handlers with mock actions
- Screenshots tests: for visual verification

## Code Review Requirements

- Architecture consistency checked against Knowledge Base
- Terminology validated against Glossary
- No silent architecture drift
- EventBus events named per NAMING_STANDARDS
- Action types validated against ActionType enum
