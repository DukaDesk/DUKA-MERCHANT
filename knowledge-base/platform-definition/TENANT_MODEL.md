# DUKADESK Tenant Model

**PD-012 — Tenant Model**

| Metadata | Value |
|----------|-------|
| PD-ID | PD-012 |
| Title | Tenant Model |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Product / Architecture |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines what a tenant is, the types of tenants DUKADESK supports, and how tenants interact with the platform.

---

## 2. What Is a Tenant?

A **tenant** is an organization that operates on the DUKADESK platform. Each tenant has its own isolated data, configuration, users, and capabilities.

A tenant may represent:

- A business
- A department
- A franchise location
- A brand
- A solution provider's customer

---

## 3. Tenant Types

| Type | Description |
|------|-------------|
| **Platform Tenant** | The organization operating the DUKADESK platform itself |
| **Business Tenant** | An organization using DUKADESK for its operations |
| **Solution Provider Tenant** | A partner building and managing solutions for others |
| **Enterprise Tenant** | A large organization with multiple sub-tenants or divisions |

---

## 4. Tenant Lifecycle

```
Provision
    ↓
Configure
    ↓
Onboard
    ↓
Operate
    ↓
Scale
    ↓
Migrate or Deprecate
```

---

## 5. Tenant Segmentation

| Segment | Characteristics |
|---------|-----------------|
| **Micro** | 1–5 users, single capability |
| **Small** | 5–25 users, core capabilities |
| **Medium** | 25–100 users, multiple capabilities |
| **Large** | 100+ users, advanced capabilities and integrations |
| **Enterprise** | Thousands of users, custom contracts |

---

## 6. Tenant Isolation

Tenants are isolated in:

- Data
- Configuration
- Users and permissions
- Marketplace extensions
- Theming
- Runtime state

Isolation is enforced at every layer of the platform.

---

## 7. Tenant Capabilities

A tenant can:

- Enable or disable capabilities based on edition
- Configure capabilities to match business needs
- Install marketplace extensions
- Invite users and assign roles
- Customize themes and branding
- Access analytics for their data

---

## 8. Relationship to Knowledge Base

The technical tenant model is defined in `ARCHITECTURE/workspace-tenant-model.md`.
