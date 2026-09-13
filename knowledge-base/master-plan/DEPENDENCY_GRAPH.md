# Dependency Graph

This document defines the dependencies between repositories and capabilities.

## Repository Dependency Graph

```text
Infrastructure
        ↓
Identity
        ↓
Backend Foundation
        ↓
Runtime
        ↓
SDK
        ↓
Builder
        ↓
Website
        ↓
Mobile
        ↓
Dashboards
        ↓
Commerce
        ↓
Payments
        ↓
AI
```

## Dependency Rules

1. A repository may depend on repositories at its level or below.
2. Circular dependencies are prohibited.
3. Downstream repositories consume upstream APIs and SDKs.
4. Infrastructure and Identity are foundational; all other repositories depend on them directly or indirectly.

## Capability Dependencies

| Capability | Depends On |
|------------|------------|
| Identity | Infrastructure |
| Backend Foundation | Infrastructure, Identity |
| Runtime | Backend Foundation |
| SDK | Runtime, Backend Foundation |
| Builder | SDK, Runtime |
| Website | Builder, SDK |
| Mobile | SDK, Backend Foundation |
| Dashboards | SDK, Backend Foundation |
| Commerce | Dashboards, Backend Foundation |
| Payments | Commerce, Identity |
| AI | Commerce, Payments, Analytics |

## Parallel Work

Repositories without direct dependencies can be developed in parallel:

- Identity and Infrastructure can advance together.
- Runtime and Backend Foundation can overlap after core contracts are defined.
- Mobile and Website can proceed in parallel once SDK is stable.
- Business Dashboard and Tenant Dashboard can proceed in parallel.

## Dependency Tracking

Dependencies are tracked as engineering work items and reflected in the [ENGINEERING_WORK](../engineering-work/) registry.
