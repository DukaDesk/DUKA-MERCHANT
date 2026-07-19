# DUKADESK Application Model

**PD-004 — Application Model**

| Metadata | Value |
|----------|-------|
| PD-ID | PD-004 |
| Title | Application Model |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Product |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines every application in the DUKADESK platform and the audience it serves.

An **application** is a distinct surface through which users interact with the platform.

---

## 2. Applications

| Application | Audience | Purpose |
|-------------|----------|---------|
| **Builder Studio** | Developers, business analysts, solution designers | Visually design applications, screens, workflows, data models, and themes |
| **Business Dashboard** | Business owners, operators | Manage business operations, view analytics, configure capabilities |
| **Tenant Dashboard** | Tenant administrators | Configure tenant settings, users, billing, and extensions |
| **Customer App** | End customers, consumers | Interact with the business — browse, purchase, book, receive service |
| **Website** | Public visitors, prospects | Marketing, content, and public-facing presence |
| **Admin Portal** | Platform operators, support staff | Manage platform health, tenants, marketplace, and governance |
| **CLI** | Developers, DevOps | Command-line interface for automation, deployment, and local development |
| **SDK** | Developers, partners | Programmatic interface for building on and extending the platform |

---

## 3. Application Characteristics

Every application:

- Serves a specific user role
- Consumes platform capabilities through APIs
- Renders server-driven UI definitions where applicable
- Has defined permissions and entitlements
- Is versioned and deployable independently

---

## 4. Application-Capability Matrix

| Application | Builder | Commerce | CRM | Analytics | Admin |
|-------------|---------|----------|-----|-----------|-------|
| Builder Studio | Owns | Reads | Reads | Reads | Limited |
| Business Dashboard | Uses | Uses | Uses | Uses | No |
| Tenant Dashboard | Configures | Configures | Configures | Views | Tenant-scoped |
| Customer App | Renders | Uses | Updates | No | No |
| Website | Renders | Uses | No | Limited | No |
| Admin Portal | Manages | Manages | Manages | Manages | Owns |
| CLI | Automates | Automates | Automates | Automates | Automates |
| SDK | Extends | Extends | Extends | Extends | Extends |

---

## 5. Application Lifecycle

1. **Concept** — application need identified
2. **Definition** — audience, capabilities, and experience defined
3. **Architecture** — Knowledge Base documents created
4. **Implementation** — engineering builds the application
5. **Release** — application available to target audience
6. **Evolution** — capabilities expand over time
