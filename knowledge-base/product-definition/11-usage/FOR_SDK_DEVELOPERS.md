# For SDK Developers

## How to Use the Product Definition

As an SDK developer, the Product Definition tells you **what capabilities the SDK must expose** so that mobile, web, dashboard, and CLI products can use the platform.

## Start Here

1. Read [PLATFORM_OVERVIEW.md](../01-platform/PLATFORM_OVERVIEW.md).
2. Read [PRODUCT_CATALOG.md](../02-products/PRODUCT_CATALOG.md).
3. Read [PRODUCT_DEPENDENCIES.md](../02-products/PRODUCT_DEPENDENCIES.md).
4. Read [MODULE_CATALOG.md](../04-modules/MODULE_CATALOG.md).

## What to Build

For each module and product dependency:

| Product Artifact | SDK Output |
|------------------|------------|
| Product | SDK service client |
| Module | Typed module client |
| Feature | SDK method |
| API | SDK method mapping |
| Permission | Helper for role checks |

## Example Workflow

Product says:

> Mobile and web apps need to list products and create orders.

SDK developer creates:

- `API-0011 SDK Core Contracts`
- `ProductClient.list()`
- `OrderClient.create()`
- Authentication helpers
- Error handling patterns

## Cross-References

- [API_CATALOG.md](../../enterprise-reference/API_CATALOG.md) in enterprise-reference → API contracts
- [APPLICATION_ARCHITECTURE.md](../03-applications/APPLICATION_ARCHITECTURE.md) → service layer patterns
- [EXTENSIBILITY_MODEL.md](../09-marketplace/EXTENSIBILITY_MODEL.md) → extension interfaces

## Output Artifacts

SDK developers produce:

- API engineering specifications
- SDK clients per module
- Authentication helpers
- Error and retry utilities
- Documentation and examples
- Tests
