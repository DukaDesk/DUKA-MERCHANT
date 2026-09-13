# Code Generation

This document defines how AI and template-based code generation is used in DUKADESK OS.

## Purpose

Code generation accelerates implementation, reduces boilerplate, and enforces consistency. All generated code remains subject to the same review and verification gates as hand-written code.

## Allowed Generation

AI agents and templates may generate:

- Boilerplate and scaffolding
- Repetitive CRUD operations
- Test stubs and fixtures
- Configuration files
- Documentation drafts
- Migration scripts

## Prohibited Generation

AI agents and templates must not generate:

- Production secrets
- Security-critical code without review
- Code that bypasses verification gates
- Code that violates approved ADRs

## Generation Workflow

```text
Read Specification
    ↓
Select Template
    ↓
Generate Code
    ↓
Self Review
    ↓
Run Tests
    ↓
Hand Off for Review
```

## Templates

Templates live in:

- [engineering-specifications/templates/](../engineering-specifications/templates/)
- [developer-experience/templates/](templates/)
- Repository-specific `templates/` directories

## Generated Code Markers

Generated files should include a header comment indicating generation source:

```text
// Generated from <template-name>
// Do not edit manually unless marked as safe to edit.
```

## Review Requirements

All generated code must be reviewed. The reviewer evaluates:

- Correctness
- Alignment with specifications
- Security
- Test coverage
- Maintainability

## Agent Notes

When generating code:

1. Start from the specification.
2. Use existing patterns and conventions.
3. Do not skip verification.
4. Document any assumptions.
5. Mark generated files clearly.

## Customization

Generated code may be customized after generation. Customizations must be reviewed and tested.
