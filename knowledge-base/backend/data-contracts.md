# Data Contracts — Binding Shapes per Vertical

> This document defines the preview seed data and runtime binding shapes for each vertical.
> Screens bind to backend data via the `DataBindingService` — not by embedding production records in manifests.

## Binding Sources

| Source | Description | Example |
|--------|-------------|---------|
| `static` | Hardcoded default value | `{ source: "static", defaultValue: "Hello" }` |
| `context` | Dot-path lookup into runtime context | `{ source: "context", path: "user.name" }` |
| `api` | HTTP fetch to external URL | `{ source: "api", url: "https://...", method: "GET" }` |
| `query` | Prisma database query scoped to tenant | `{ source: "query", query: "products.latest" }` |

## Commerce Vertical

### Products

| Binding Query | Model | Scope | Shape |
|---------------|-------|-------|-------|
| `products` | `Product` | Active, take 50 | `[{ id, name, slug, price, description, images: [{ url, alt }], category: { id, name } }]` |
| `products.latest` | `Product` | Active, `createdAt desc`, take 10 | Same as above |
| `products.featured` | `Product` | Active, `isFeatured: true`, take 8 | Same as above |

### Categories

| Binding Query | Model | Scope | Shape |
|---------------|-------|-------|-------|
| `categories` | `Category` | Active | `[{ id, name, slug, icon, productCount }]` |

### Orders (authenticated context)

| Field | Shape |
|-------|-------|
| `orders` | `[{ id, status, total, createdAt, items: [{ productName, quantity, price }] }]` |

## Restaurant Vertical

### Menu Items

| Binding Query | Model | Scope | Shape |
|---------------|-------|-------|-------|
| `products` | `Product` | Active, filtered by `category.name` | `[{ id, name, price, description, images, category: { name } }]` |

### Categories

Same as Commerce — `categories` binding query.

## Booking Vertical

### Services

| Binding Query | Model | Scope | Shape |
|---------------|-------|-------|-------|
| `booking_services` | `BookingService` | Active | `[{ id, name, description, duration, price, location: { name, address } }]` |

### Staff

| Field | Shape |
|-------|-------|
| `staff` | `[{ id, name, role, avatar, services: [{ id, name }] }]` |

## Forms Vertical

### Form Submissions (authenticated)

| Field | Shape |
|-------|-------|
| `submissions` | `[{ id, formId, data: JSON, submittedAt, status }]` |

## Context Shape

Available in all `context` bindings:

```typescript
{
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  device: {
    platform: 'ios' | 'android' | 'web';
    width: number;
    height: number;
  };
  route: {
    params: Record<string, string>;
    query: Record<string, string>;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}
```

## Empty State Handling

When a binding returns no data, components should render their configured `emptyState`:

```json
{
  "type": "product_grid",
  "props": {
    "bindings": {
      "items": { "source": "query", "query": "products" }
    },
    "emptyState": {
      "title": "No products yet",
      "description": "Check back soon!",
      "icon": "package-open"
    }
  }
}
```

## Scope Rules

- All `query` bindings are automatically scoped to the current tenant
- `api` bindings bypass tenant scope (external URLs)
- `context` bindings are read-only
- `static` bindings are compile-time constants
