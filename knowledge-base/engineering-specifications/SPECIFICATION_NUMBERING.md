# Specification Numbering

Every engineering specification receives an immutable, globally unique identifier.

## Format

```text
<PREFIX>-<SEQUENCE>
```

- **PREFIX**: Uppercase domain abbreviation.
- **SEQUENCE**: Zero-padded four-digit decimal number, starting at `0001`.

## Approved Prefixes

| Prefix | Domain | Directory |
|--------|--------|-----------|
| FEAT | Feature | specifications/features/ |
| API | API / Service Contract | specifications/api/ |
| UI | User Interface | specifications/ui/ |
| DB | Database / Storage | specifications/database/ |
| EVT | Event / Messaging | specifications/events/ |
| SEC | Security / Compliance | specifications/security/ |
| WF | Workflow / Process | specifications/workflows/ |
| INT | Integration / External System | specifications/integrations/ |
| INFRA | Infrastructure / Platform | specifications/infrastructure/ |

## Allocation Rules

1. IDs are allocated sequentially and never reused.
2. An ID is reserved only after a file named `<PREFIX>-<SEQUENCE>.md` exists in the correct directory and has been added to [SPECIFICATION_INDEX.md](SPECIFICATION_INDEX.md).
3. Draft specifications may use a temporary working identifier with a `-DRAFT` suffix until an official ID is assigned.
4. Renumbering an approved specification is prohibited. If the scope changes enough to require a new ID, create a new specification and deprecate the old one.

## File Naming

Each specification is stored as:

```text
specifications/<domain>/<PREFIX>-<SEQUENCE>.md
```

Example:

```text
specifications/features/FEAT-0001.md
```

## ID Assignment Process

1. Proposer selects the correct domain and prefix.
2. Proposer checks [SPECIFICATION_INDEX.md](SPECIFICATION_INDEX.md) for the next available sequence number.
3. Proposer creates the file using the next available number.
4. A maintainer confirms the allocation during the Review state transition.
5. The index is updated with title, state, owner, and target repository.

## Cross-Domain Specifications

If a specification spans multiple domains, choose the primary domain for the prefix and link to related specifications in the `Related Specifications` section. Do not issue multiple IDs for the same logical specification.
