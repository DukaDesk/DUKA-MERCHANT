# Module Boundaries

## Boundary Rules

1. Each module owns a single domain capability.
2. Modules expose APIs and events. Other modules consume those APIs and events.
3. Modules do not directly access another module's database tables.
4. Modules may depend on Identity and Tenant modules.

## In Scope per Module

### Authentication
- Sign up, sign in, sign out
- Password management
- Session management
- OAuth / SSO (future)

### User Management
- User profiles
- User invitations
- User search and listing

### Role Management
- Role definitions
- Permission assignments
- Role-based access control

### Tenant Lifecycle
- Create, update, suspend, delete tenant
- Tenant settings and branding
- Tenant isolation enforcement

### Catalog
- Product categories
- Product listing
- Product details
- Inventory tracking

### Cart
- Add, remove, update items
- Cart persistence
- Cart abandonment

### Checkout
- Shipping / delivery options
- Payment selection
- Order creation

### Payments
- Payment methods
- Transactions
- Refunds
- Payouts

### Orders
- Order creation
- Order status
- Order history
- Fulfillment tracking

## Out of Scope per Module

| Module | Out of Scope |
|--------|--------------|
| Authentication | User profile data (User Management) |
| User Management | Authentication credentials (Authentication) |
| Catalog | Payments and checkout (Commerce) |
| Cart | Order creation (Checkout) |
| Checkout | Payment processing (Payments) |
| Orders | Inventory management (Catalog) |
| Builder | Business logic execution (Runtime) |
