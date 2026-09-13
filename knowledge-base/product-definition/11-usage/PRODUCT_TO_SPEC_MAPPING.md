# Product to Specification Mapping

## Mapping Rules

Every product artifact maps to one or more engineering specifications.

```text
Product
    → Applications
        → Modules
            → Features
                → Engineering Specifications
                    → Tasks
```

## Mapping Table

| Product Artifact | Engineering Specification Type | Repository |
|------------------|-------------------------------|------------|
| Product | Feature specification | Varies |
| Application | UI specification | web/mobile/dashboard |
| Module | Feature / Security / Infrastructure spec | backend/infrastructure |
| Feature | Feature specification | Varies |
| API surface | API specification | backend |
| Data model | Database specification | backend |
| Business event | Event specification | backend |
| User role | Security specification | backend |
| User journey | Workflow / UI specification | web/mobile/dashboard |
| Marketplace item | Integration / Feature specification | backend/marketplace |

## Example Mapping

### Product: Business Dashboard

```text
Business Dashboard
    ├── Application: Orders
    │       ├── Module: Orders
    │       │       ├── Feature: View Orders → FEAT-0027, UI-00XX
    │       │       ├── Feature: Update Order Status → FEAT-0028, API-00XX
    │       │       └── Feature: Cancel Order → FEAT-0029, API-00XX
    │       └── Module: Payments
    │               └── Feature: Process Refund → FEAT-0026, API-00XX
    └── Application: Products
            └── Module: Catalog
                    ├── Feature: Create Product → FEAT-0020, API-0030, DB-0010
                    ├── Feature: Edit Product → FEAT-0021, API-0030
                    └── Feature: Delete Product → FEAT-0022, API-0030
```

## Specification IDs

Specification IDs follow the scheme defined in [engineering-specifications](../../engineering-specifications/SPECIFICATION_NUMBERING.md).

## Maintaining the Mapping

This mapping is maintained as features and specifications are created. The [enterprise-reference](../enterprise-reference/) catalogs link the artifacts together.
