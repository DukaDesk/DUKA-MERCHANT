# Module Catalog

## Module Inventory

### Identity Modules

```text
Identity
├── Authentication
├── User Management
├── Role Management
├── Session Management
├── Password Recovery
└── OAuth / SSO
```

### Tenant Modules

```text
Tenant
├── Organization
├── Tenant Lifecycle
├── Subscription
├── Branding
└── Settings
```

### Commerce Modules

```text
Commerce
├── Catalog
├── Cart
├── Checkout
├── Payments
├── Orders
├── Invoices
├── Fulfillment
└── Returns
```

### Content Modules

```text
Content
├── Pages
├── Posts
├── Media Library
├── Announcements
├── Navigation
└── SEO
```

### Communication Modules

```text
Communication
├── Notifications
├── Messages
├── Email
├── Push
└── SMS
```

### Analytics Modules

```text
Analytics
├── Usage Metrics
├── Sales Reports
├── User Insights
├── Event Tracking
└── Dashboards
```

### Builder Modules

```text
Builder
├── Components
├── Themes
├── Layouts
├── Templates
├── Data Binding
└── Publishing
```

### Sector Modules (vertical-adaptive admin)

```text
Sector (per tenant category)
├── Giving         (Church)      → commerce
├── Donations      (Church)      → commerce
├── Timetable      (School)      → forms
├── Fees           (School)      → commerce
├── Attendance     (School/Church)→ forms
├── Services       (Booking)     → booking
├── Appointments   (Booking)     → booking
└── Members        (Church)      → commerce
```

Sector modules are surfaced in the Business Dashboard shell via `src/config/verticals.js`
(driven by tenant category) and gated by the feature flags defined in
`SPECIFICATIONS/backend-tenants.md` (`commerce`, `booking`, `forms`, `notifications`,
`analytics`, `integrations`). See [ADR-014](../ADRs/ADR-014-vertical-adaptive-business-dashboard.md)
and `business-dashboard/VERTICALS.md`.

## Module Ownership

| Module | Domain | Owner |
|--------|--------|-------|
| Authentication | Identity | Team B |
| User Management | Identity | Team B |
| Tenant Lifecycle | Tenant | Team E |
| Catalog | Commerce | Team I |
| Checkout | Commerce | Team I |
| Payments | Commerce | Team I |
| Orders | Commerce | Team I |
| Media Library | Content | Team E |
| Notifications | Communication | Team I |
| Builder Components | Builder | Team D |
