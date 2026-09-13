# Navigation Standard

## Navigation Map

```text
Application
    ↓
Module
    ↓
Screen
    ↓
Dialog
    ↓
Action
```

## Navigation Patterns

### Dashboard Navigation

Dashboards use a collapsible sidebar with:

- Application logo
- Primary modules
- Secondary modules
- User menu

### Mobile Navigation

Mobile apps use bottom tab navigation with:

- Home
- Catalog / Content
- Orders / Activity
- Profile
- More (overflow)

### Website Navigation

Public websites use top navigation with:

- Logo
- Primary pages
- Sign-in / Sign-up
- Call-to-action

### Builder Navigation

Builder Studio uses:

- Top toolbar
- Left panel (pages, layers)
- Center canvas
- Right panel (properties)

## Navigation Rules

1. Every screen has a clear entry point.
2. Every screen provides a way back.
3. Deep links should resolve to the correct screen with state restored.
4. Navigation labels match module and feature names from Product Definition.
5. Role-based navigation hides items the user cannot access.

## Screen Numbering

```text
BD-AUTH-001
BD-DASH-001
BD-ORD-001
BD-PROD-001

MOB-HOME-001
WEB-HOME-001
BST-COMP-001
```

Prefix meanings:

| Prefix | Application |
|--------|-------------|
| BD | Business Dashboard |
| TD | Tenant Dashboard |
| BST | Builder Studio |
| MOB | Mobile App |
| WEB | Website |

## Breadcrumbs

Dashboards use breadcrumbs for nested navigation:

```text
Dashboard / Orders / Order #1234
```

## Deep Linking

All screens support URL-based deep links where applicable. Mobile screens support route-based deep links for notifications.
