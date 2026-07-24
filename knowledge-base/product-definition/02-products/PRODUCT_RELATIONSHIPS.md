# Product Relationships

## Relationship Map

```text
DUKADESK Platform
    ├── Builder Studio
    │       └── produces designs consumed by Mobile App and Website
    ├── Business Dashboard
    │       └── manages Tenant Dashboard and Mobile App content
    ├── Tenant Dashboard
    │       └── runs inside Mobile App and Website
    ├── Mobile App
    │       └── hosts Tenant Dashboard
    ├── Website
    │       └── hosts Tenant Dashboard and marketing pages
    ├── Admin Portal
    │       └── manages the platform and all tenants
    ├── SDK
    │       └── used by Mobile App, Website, Dashboards, CLI
    └── CLI
            └── used by developers and DevOps
```

## Consumer Relationships

| Product | Consumes | Used By |
|---------|----------|---------|
| Builder Studio | SDK, Backend | Tenant admins |
| Business Dashboard | SDK, Backend | Business owners |
| Tenant Dashboard | SDK, Backend | End users |
| Mobile App | SDK, Backend | End users |
| Website | SDK, Backend | Public, end users |
| Admin Portal | SDK, Backend | Platform operators |
| SDK | Backend APIs | Developers |
| CLI | SDK, Backend | Developers, operators |

## Coupling Rules

- Products must communicate through the SDK and backend APIs.
- Products must not directly access each other's databases.
- Builder Studio output must be renderable by Mobile App and Website runtimes.
- Dashboards share common shell, navigation, and component patterns.
