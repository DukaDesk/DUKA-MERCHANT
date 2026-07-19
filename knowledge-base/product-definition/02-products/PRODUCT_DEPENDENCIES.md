# Product Dependencies

## Dependency Matrix

| Product | Depends On |
|---------|------------|
| Builder Studio | Backend, SDK, Identity |
| Business Dashboard | Backend, SDK, Identity |
| Tenant Dashboard | Backend, SDK, Identity |
| Mobile App | Backend, SDK, Identity, Tenant Dashboard |
| Website | Backend, SDK, Identity, Tenant Dashboard |
| Admin Portal | Backend, SDK, Identity |
| SDK | Backend APIs, Identity |
| CLI | SDK, Backend APIs |

## Startup Order

For local development and deployment, products generally start in this order:

1. Backend and Identity services
2. SDK build and publish
3. Builder Studio
4. Business Dashboard and Tenant Dashboard
5. Website
6. Mobile App
7. Admin Portal
8. CLI

## Runtime Dependencies

- No product functions without Identity.
- Dashboard products require Backend.
- Mobile App and Website require Tenant Dashboard runtime.
- Builder Studio output must be compatible with Mobile App and Website renderers.

## Dependency Management

- SDK version changes require downstream product updates.
- Backend API changes require SDK and client updates.
- Breaking changes are coordinated through release trains.
