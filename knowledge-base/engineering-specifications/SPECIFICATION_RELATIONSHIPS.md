# Specification Relationships

Specifications rarely exist in isolation. This document defines how to declare relationships between specifications and how to navigate them.

## Relationship Types

| Type | Meaning | Example |
|------|---------|---------|
| depends-on | This specification cannot be implemented until another is complete. | FEAT-0002 depends-on API-0001 |
| supersedes | This specification replaces an older one. | FEAT-0005 supersedes FEAT-0002 |
| related-to | Logical or technical association without hard dependency. | UI-0001 related-to FEAT-0001 |
| part-of | This specification is a component of a larger specification. | DB-0003 part-of FEAT-0001 |
| enables | This specification makes another specification possible. | INFRA-0001 enables FEAT-0010 |
| conflicts-with | This specification is incompatible with another. Requires ADR. | API-0002 conflicts-with API-0003 |

## Declaring Relationships

Relationships are declared in the `Related Specifications` section using the format:

```text
- <Type>: `[<ID> <Title>](path/to/file.md)`
```

Example:

```markdown
## Related Specifications

- depends-on: [API-0001 Tenant Authentication API](specifications/api/API-0001.md)
- part-of: [FEAT-0001 Multi-Tenant Onboarding](specifications/features/FEAT-0001.md)
- related-to: [UI-0001 Onboarding Wizard](specifications/ui/UI-0001.md)
```

## Relationship Rules

1. Every `depends-on` relationship must be satisfiable before implementation begins.
2. A specification that `supersedes` another must cause the older specification to move to `Deprecated`.
3. `conflicts-with` relationships must reference an ADR that resolves the conflict.
4. Circular `depends-on` relationships are prohibited.
5. `part-of` relationships must share the same parent vision or ADR where possible.

## Visualizing Relationships

The `registry/` directory may contain generated relationship graphs. These graphs are derived from the `Related Specifications` sections and must be regenerated after each specification update.

## Impact Analysis

When a specification changes, review all direct and inverse relationships:

- Specifications that depend on it.
- Specifications that are part of it.
- Specifications that it enables.
- Specifications that it supersedes.

Update related specifications as needed and record changes in their `Change History`.
