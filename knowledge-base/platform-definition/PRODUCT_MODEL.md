# DUKADESK Product Model

**PD-002 — Product Model**

| Metadata | Value |
|----------|-------|
| PD-ID | PD-002 |
| Title | Product Model |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Product |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines how DUKADESK is packaged as a product.

It establishes the product hierarchy, editions, and how capabilities are exposed to customers.

---

## 2. Product Hierarchy

```
DUKADESK Platform
    ├── Editions
    │       ├── Community
    │       ├── Starter
    │       ├── Professional
    │       └── Enterprise
    ├── Applications
    │       ├── Builder Studio
    │       ├── Business Dashboard
    │       ├── Tenant Dashboard
    │       ├── Customer App
    │       ├── Website
    │       ├── Admin Portal
    │       ├── CLI
    │       └── SDK
    ├── Capabilities
    │       ├── Identity
    │       ├── Commerce
    │       ├── Payments
    │       └── ...
    └── Marketplace
            ├── Apps
            ├── Themes
            ├── Components
            ├── Templates
            ├── Actions
            ├── Workflows
            └── AI Agents
```

---

## 3. Product Packaging

| Layer | Description |
|-------|-------------|
| **Platform** | The complete DUKADESK offering |
| **Edition** | A licensed tier with a defined capability set |
| **Application** | A surface through which users interact with the platform |
| **Capability** | A bounded unit of business functionality |
| **Module** | A cohesive sub-domain within a capability |
| **Feature** | A specific function a user can perform |

---

## 4. Edition Strategy

| Edition | Target |
|---------|--------|
| **Community** | Individual developers, small experiments, open-source contributors |
| **Starter** | Small businesses getting started |
| **Professional** | Growing businesses with operational complexity |
| **Enterprise** | Large organizations with governance, integration, and support needs |

See [EDITION_MODEL.md](./EDITION_MODEL.md) for detailed feature mapping.

---

## 5. Delivery Model

DUKADESK is delivered as:

- **Cloud-hosted SaaS** — primary delivery model.
- **Dedicated deployment** — for Enterprise customers with specific requirements.
- **Embedded SDK** — for partners building on the platform.

---

## 6. Product Lifecycle

1. **Concept** — capability or feature is proposed.
2. **Definition** — product requirements and edition mapping defined.
3. **Architecture** — Knowledge Base and specifications created.
4. **Implementation** — engineering builds the capability.
5. **Release** — capability reaches a product edition.
6. **Marketplace** — capability may be offered as an extension.
7. **Retirement** — capability is deprecated and removed with notice.
