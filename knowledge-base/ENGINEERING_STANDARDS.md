# DUKADESK Engineering Standards

**Last Updated:** 2026-07-09

## Knowledge Base First
The Knowledge Base is the authoritative source of truth. Before any implementation change: load the KB, read relevant ADRs/specs/standards, check the Progress Registry, then begin.

## Architecture Changes Require an ADR
Any change to architecture, terminology, or standards MUST be preceded by an ADR. Implementation repositories must NEVER become the primary source of truth.

**Process:** Write ADR → Merge ADR → Update affected specs → Update Glossary if needed → Implement.

## Documentation Standards
Every document must include a metadata header with: Title, Version, Status (Drafting/Under Review/Verified/Locked/Deprecated), Owner, Review Status, Last Updated, and cross-references.

Files use `{NAME}.md` at root, `ADR-NNN-title.md` in ADRs/, `{name}.md` in SPECIFICATIONS/.

Cross-references use canonical IDs: KB-NNN, SPEC-NNN, ADR-NNN.

## Stable ID System
Platform entities may be assigned stable IDs in format `[DOMAIN]-[TYPE]-[NNN]` (e.g., COM-CHK-001 for Checkout Screen, CAP-001 for Capability Registry). IDs are permanent once assigned.

## AI Memory Index
Concepts are mapped to their document locations for rapid AI lookup. The index is maintained in AGENT_BOOT_PROCESS.md.

## Code Style
- 2-space indentation, semicolons required, single quotes preferred
- 120 character line limit, trailing commas in multiline
- TypeScript: `strict: true`, prefer `type` over `interface`, use `unknown` not `any`
- Import order: React → Third-party → Internal → Types (groups separated by blank lines)
- Components: function components only, default exports, `Props` type (file-private), `StyleSheet.create` at bottom
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`)

## Testing Standards
- Component tests: React Native Testing Library
- Store tests: test with Zustand directly
- Action tests: unit test handlers with mock actions
- Unit tests: Jest

## Code Review Requirements
- Architecture consistency checked against Knowledge Base
- Terminology validated against Glossary
- No silent architecture drift
- EventBus events named per NAMING_STANDARDS
- Action types validated against ActionType enum

## PR Checklist
- [ ] Code updated
- [ ] Specification updated (if applicable)
- [ ] Knowledge Base updated (if architecture changed)
- [ ] ADR required? (yes/no)
- [ ] Developer docs impacted? (yes/no)

## AI Agent Rules
1. Agents MUST execute the Agent Boot Process before any task
2. Agents MUST NOT redefine existing concepts or invent alternative terminology
3. Agents MUST NOT change architecture without an ADR
4. When conflicts are discovered, report them — do not silently modify architecture

## RFC Process
Ideas that may lead to architectural changes follow this path: Idea → RFC → Discussion → Approved/Rejected → ADR (if needed) → KB Update → Implementation.

RFCs are lightweight proposals stored in `project-management/rfc/`.
