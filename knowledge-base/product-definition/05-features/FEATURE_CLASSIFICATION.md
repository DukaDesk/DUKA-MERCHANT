# Feature Classification

## Classification Dimensions

### By Type

| Type | Description | Examples |
|------|-------------|----------|
| Core | Required for platform operation | Authentication, Tenant creation |
| Business | Supports tenant business operations | Products, Orders, Payments |
| Experience | Shapes user-facing surfaces | Builder, Themes, Mobile app |
| Operational | Supports management and monitoring | Reports, Admin tools |
| Extensibility | Enables marketplace and integrations | Plugins, Templates, Integrations |

### By Priority

| Priority | Description |
|----------|-------------|
| Must | Required for minimum viable platform |
| Should | Important but can be deferred |
| Could | Nice to have |
| Won't | Out of scope for current planning |

### By Edition

| Edition | Access |
|---------|--------|
| Community | Limited core features |
| Starter | Core features for small organizations |
| Professional | Advanced features and integrations |
| Enterprise | Full feature set with custom options |

## Classification Rules

- Every feature must have a type and priority.
- Edition assignment is flexible until licensing is finalized.
- Core features cannot be gated by edition.
- Extensibility features may require marketplace enablement.

## Feature to Specification Mapping

Each feature in the catalog maps to one or more engineering specifications:

```text
F-020 Create Product
    → SPEC-0030 Product Catalog Feature
    → API-0030 Product API
    → DB-0010 Commerce Schema
    → UI-0010 Product Management Screen
```
