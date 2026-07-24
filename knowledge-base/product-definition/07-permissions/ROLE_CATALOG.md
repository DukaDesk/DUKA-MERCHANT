# Role Catalog

## Platform Roles

| Role | Scope | Description |
|------|-------|-------------|
| Super Admin | Platform | Full platform control |
| Platform Operator | Platform | Manages tenants, marketplace, system health |
| Support Agent | Platform | Provides support to tenant users |

## Tenant Roles

| Role | Scope | Description |
|------|-------|-------------|
| Organization Owner | Organization | Full control over organization and tenants |
| Tenant Owner | Tenant | Full control over a single tenant |
| Business Manager | Tenant | Manages business operations |
| Store Manager | Tenant | Manages products, orders, and staff |
| Sales Staff | Tenant | Handles orders and customers |
| Content Manager | Tenant | Manages content and media |
| Customer | Tenant | End user who interacts with the app |
| Member | Tenant | Member with limited access |

## Role Hierarchy

```text
Super Admin
    Platform Operator
        Support Agent

Organization Owner
    Tenant Owner
        Business Manager
            Store Manager
                Sales Staff
            Content Manager
        Customer
        Member
```

## Default Roles

Every tenant has these default roles:

- Tenant Owner
- Business Manager
- Customer

Additional roles can be created or imported from templates.

## Role Assignment

Roles are assigned to users per tenant. A user can have different roles in different tenants.
