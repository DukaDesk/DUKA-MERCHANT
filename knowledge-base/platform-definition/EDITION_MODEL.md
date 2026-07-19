# DUKADESK Edition Model

**PD-008 — Edition Model**

| Metadata | Value |
|----------|-------|
| PD-ID | PD-008 |
| Title | Edition Model |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Product |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document defines the DUKADESK product editions and how features map to them.

An **edition** is a packaged tier of the platform with a defined set of capabilities, features, limits, and entitlements.

---

## 2. Editions

| Edition | Target Audience |
|---------|-----------------|
| **Community** | Individual developers, open-source contributors, experiments |
| **Starter** | Small businesses and early-stage teams |
| **Professional** | Growing businesses with operational complexity |
| **Enterprise** | Large organizations with governance, integration, and support needs |

---

## 3. Edition Dimensions

| Dimension | Community | Starter | Professional | Enterprise |
|-----------|-----------|---------|--------------|------------|
| Users | Limited | Up to 10 | Up to 100 | Unlimited |
| Tenants | 1 | 1 | Multiple | Unlimited |
| Capabilities | Core only | Core | Core + Advanced | All |
| Marketplace Access | Free only | Free + Paid | All | All + Custom |
| Support | Community | Self-service | Standard | Premium |
| SLA | None | Best effort | 99.9% | 99.99% |
| Custom Integrations | No | Limited | Yes | Yes |
| Dedicated Infrastructure | No | No | Optional | Yes |

---

## 4. Capability Availability by Edition

| Capability | Community | Starter | Professional | Enterprise |
|------------|-----------|---------|--------------|------------|
| Identity | ✅ | ✅ | ✅ | ✅ |
| Commerce | Limited | ✅ | ✅ | ✅ |
| Payments | ❌ | ✅ | ✅ | ✅ |
| Orders | Limited | ✅ | ✅ | ✅ |
| Inventory | ❌ | ✅ | ✅ | ✅ |
| CRM | Limited | ✅ | ✅ | ✅ |
| CMS | ✅ | ✅ | ✅ | ✅ |
| Messaging | ❌ | Limited | ✅ | ✅ |
| Notifications | Limited | ✅ | ✅ | ✅ |
| Media | Limited | ✅ | ✅ | ✅ |
| Analytics | ❌ | Limited | ✅ | ✅ |
| Builder | ✅ | ✅ | ✅ | ✅ |
| Automation | ❌ | Limited | ✅ | ✅ |
| AI | ❌ | ❌ | Limited | ✅ |
| Marketplace | Free only | ✅ | ✅ | ✅ |
| Storage | Limited | ✅ | ✅ | ✅ |
| Search | ❌ | ✅ | ✅ | ✅ |
| Scheduling | ❌ | ✅ | ✅ | ✅ |
| Integration | ❌ | Limited | ✅ | ✅ |
| Localization | ❌ | Limited | ✅ | ✅ |

---

## 5. Edition Upgrade and Downgrade

- Tenants may upgrade at any time.
- Downgrade requires that the tenant no longer uses features outside the target edition.
- Marketplace purchases may be edition-specific.

---

## 6. Relationship to Licensing

See [LICENSING_MODEL.md](./LICENSING_MODEL.md) for terms, restrictions, and entitlements.
