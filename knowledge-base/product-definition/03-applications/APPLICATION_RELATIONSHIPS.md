# Application Relationships

## Shared Applications

Some applications appear across multiple products:

| Application | Products | Reason |
|-------------|----------|--------|
| Authentication | All | Every product requires sign-in |
| Orders | Business Dashboard, Tenant Dashboard, Mobile App | Different views of the same data |
| Products | Business Dashboard, Tenant Dashboard | Admin vs. customer view |
| Profile | Tenant Dashboard, Mobile App | User self-service |
| Settings | Business Dashboard, Tenant Dashboard, Admin Portal | Product-specific configuration |

## Application Dependencies

```text
Orders
    depends-on Products
    depends-on Customers
    depends-on Payments

Checkout
    depends-on Cart
    depends-on Payments
    depends-on Identity

Reports
    depends-on Orders
    depends-on Analytics
```

## Reuse Strategy

- Common UI components live in the SDK or shared component library.
- Applications with similar data but different audiences share backend services.
- Navigation and shell patterns are consistent across dashboard products.

## Cross-Application Flows

### Business Owner Flow

```text
Business Dashboard → Products → Orders → Reports → Settings
```

### Customer Flow

```text
Tenant Dashboard / Mobile App → Catalog → Cart → Checkout → Orders → Profile
```

### Builder Flow

```text
Builder Studio → Project Manager → Canvas Editor → Preview → Publish
```
