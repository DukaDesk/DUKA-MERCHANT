# User Types

## Platform-Level Users

| User Type | Description |
|-----------|-------------|
| Platform Administrator | Manages the DUKADESK platform, tenants, and marketplace |
| Support Agent | Assists tenant owners and end users |
| System | Automated processes and integrations |
| AI Agent | Autonomous agents operating within the platform |

## Tenant-Level Users

| User Type | Description |
|-----------|-------------|
| Organization Owner | Owns the organization and has full control |
| Business Owner | Manages the tenant business operations |
| Store Manager | Manages products, orders, and staff |
| Sales Staff | Handles orders and customer interactions |
| Content Manager | Manages pages, posts, and media |
| Customer | End user who interacts with the tenant app |
| Member | End user with a membership relationship |
| Student | End user in an educational tenant |
| Parent | Guardian associated with a student |
| Developer | Builds extensions or integrations for the tenant |

## Anonymous Users

Unauthenticated visitors who browse public tenant app pages and marketplace content.

## User Type Matrix

| Capability | Platform Admin | Org Owner | Business Owner | Store Manager | Customer |
|------------|:--------------:|:---------:|:--------------:|:-------------:|:--------:|
| Manage platform | Yes | No | No | No | No |
| Create tenant | Yes | Yes | No | No | No |
| Manage products | No | Yes | Yes | Yes | No |
| Place orders | No | No | No | No | Yes |
| View reports | No | Yes | Yes | Limited | No |
| Manage users | Yes | Yes | Yes | Limited | No |

## Mapping to Roles

User types are mapped to roles in [ROLE_CATALOG.md](../07-permissions/ROLE_CATALOG.md).
