# How to Use This Repository

## Purpose

The Product Definition Repository defines **what DUKADESK is** before anyone designs screens or writes code. It is the first source of truth for product decisions.

## Who Uses This Repository

| Role | Uses It For |
|------|-------------|
| Product Architects | Defining scope and strategy |
| Designers | Understanding what to design and for whom |
| Backend Developers | Understanding domains, modules, and business rules |
| Frontend Developers | Understanding applications, features, and user flows |
| Mobile Developers | Understanding mobile app features and journeys |
| SDK/CLI Developers | Understanding platform boundaries and extension points |
| AI Agents | Generating consistent specifications and implementation |
| QA | Understanding expected behavior and acceptance criteria |

## Reading Order

1. Start with [PLATFORM_OVERVIEW.md](../01-platform/PLATFORM_OVERVIEW.md).
2. Read [PRODUCT_CATALOG.md](../02-products/PRODUCT_CATALOG.md).
3. Explore [APPLICATION_CATALOG.md](../03-applications/APPLICATION_CATALOG.md) and [MODULE_CATALOG.md](../04-modules/MODULE_CATALOG.md).
4. Review [FEATURE_CATALOG.md](../05-features/FEATURE_CATALOG.md).
5. Understand users via [USER_TYPES.md](../06-users/USER_TYPES.md), [PERSONAS.md](../06-users/PERSONAS.md), and [USER_JOURNEYS.md](../06-users/USER_JOURNEYS.md).
6. Check permissions via [ROLE_CATALOG.md](../07-permissions/ROLE_CATALOG.md) and [PERMISSION_CATALOG.md](../07-permissions/PERMISSION_CATALOG.md).
7. Review editions and marketplace as needed.

## How This Feeds Engineering

Product definitions flow into the engineering operating system:

```text
Product Definition
    ↓
Knowledge Base
    ↓
Engineering Specifications
    ↓
Engineering Work
    ↓
Implementation
```

## For Your Discipline

- [Backend Developers](FOR_BACKEND_DEVELOPERS.md)
- [Mobile Developers](FOR_MOBILE_DEVELOPERS.md)
- [Web Developers](FOR_WEB_DEVELOPERS.md)
- [SDK Developers](FOR_SDK_DEVELOPERS.md)
- [Designers](FOR_DESIGNERS.md)

## Keeping This Updated

Product definitions change. When they do, downstream specifications and work items must be updated through the change management process.
