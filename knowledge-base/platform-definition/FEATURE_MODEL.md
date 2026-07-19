# DUKADESK Feature Model

**PD-007 — Feature Model**

| Metadata | Value |
|----------|-------|
| PD-ID | PD-007 |
| Title | Feature Model |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Product |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines how modules decompose into features.

A **feature** is a specific function a user can perform within a module. Every feature belongs to exactly one module.

---

## 2. Feature Decomposition Example: Inventory

```
Inventory
    ├── Stock Adjustment
    │       ├── Manual Stock Adjustment
    │       ├── Bulk Stock Import
    │       └── Adjustment History
    ├── Low Stock Alerts
    │       ├── Alert Rules
    │       ├── Notification Preferences
    │       └── Alert History
    ├── Stock Transfer
    │       ├── Create Transfer
    │       ├── Receive Transfer
    │       └── Transfer History
    └── Inventory History
            ├── View Stock Movements
            ├── Filter and Search
            └── Export History
```

---

## 3. Feature Properties

Every feature has:

- A parent module
- A unique identifier
- A clear user outcome
- Defined edition availability
- Required permissions
- Acceptance criteria

---

## 4. Feature Mapping

| Feature | Module | Capability | Edition |
|---------|--------|------------|---------|
| Manual Stock Adjustment | Inventory | Commerce | Starter |
| Low Stock Alerts | Inventory | Commerce | Professional |
| Bulk Stock Import | Inventory | Commerce | Professional |
| Stock Transfer | Inventory | Commerce | Enterprise |
| Alert Rules | Inventory | Commerce | Professional |
| Adjustment History | Inventory | Commerce | Starter |

---

## 5. Feature Rules

1. A feature belongs to exactly one module.
2. A feature delivers a single, testable user outcome.
3. A feature must map to an edition.
4. A feature must have defined permissions.
5. A feature may depend on other features within the same module.

---

## 6. Relationship to Editions

Features are the atomic unit of edition packaging. See [EDITION_MODEL.md](./EDITION_MODEL.md).
