# Screen Model

**KB-045 — Screen Model Specification**

| Metadata | |
|----------|---|
| **KB ID** | KB-045 |
| **Title** | Screen Model |
| **Version** | 0.1.0 |
| **Status** | Draft |
| **Owner** | Architecture Team |
| **Dependencies** | KB-041 Application Architecture Overview, KB-042 Application Manifest Specification, KB-043 Workspace & Tenant Model, KB-044 Navigation Architecture, KB-046 Component Tree Model, KB-047 Action & Event Model, KB-048 State Model, KB-049 Theme Model, KB-050 Capability Composition, KB-051 Runtime Architecture Overview |
| **Related Documents** | KB-014 Layout System, KB-012 Component Registry, KB-016 Navigation Engine, KB-018 State Management, KB-052 Runtime Rendering Engine, KB-053 SDUI Architecture |
| **Review Status** | Pending |
| **Last Updated** | 2026-07-11 |

### Revision History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 0.1.0 | 2026-07-11 | AI Architecture Agent | Initial draft |

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the canonical Screen Model for the DUKADESK platform. It establishes what a Screen is, how it is defined, how it is composed, how it relates to Navigation, Layouts, Components, State, Actions, Themes, and Capabilities, and how it behaves across the Runtime, Builder, Marketplace, and SDK.

A Screen is the primary unit of user-facing content in a DUKADESK application. It is the destination of a Navigation Route, the container for a Component Tree, the boundary for a State scope, and the unit of lifecycle management. Every user interaction with a DUKADESK application happens within a Screen.

Screens are purely declarative. They contain no business logic, no executable code, and no platform-specific implementation. A Screen definition is data — structured, versioned, validated data that any compliant Runtime can render on any platform.

### 1.2 Scope

This document covers:

- The canonical Screen definition, its structure, metadata, and lifecycle
- The Screen hierarchy from Application through Components
- All recognized Screen types and their architectural contracts
- Screen composition model: Header, Body, Footer, Floating Areas, Overlay Regions, Safe Areas
- The relationship between Screens and Layouts, Components, Navigation, State, Actions, Themes, and Capabilities
- State boundaries: Local, Shared, and Global
- Responsibilities across Runtime, Builder, and Manifest
- Accessibility, responsiveness, performance, offline, security, and observability for Screens
- Failure scenarios and anti-patterns

Out of scope:

- Layout system architecture and implementation (handled by KB-014)
- Component Registry, resolution, and lifecycle (handled by KB-012/KB-046)
- Navigation graph, routes, guards, and deep linking (handled by KB-044)
- State management architecture and persistence (handled by KB-048)
- Action definition and execution pipeline (handled by KB-047)
- Theme token system and resolution (handled by KB-049)
- Capability composition and contribution (handled by KB-050)
- Runtime rendering engine implementation (handled by KB-052)

---

## 2. Screen Principles

### Declarative

A Screen is a data structure, not executable code. Every aspect of a Screen — its layout, components, bindings, lifecycle hooks, and metadata — is expressed through structured declarations. Declarative Screens are safe, portable, testable, and auditable.

### Stateless Definition

A Screen Definition describes the Screen's structure and configuration. It does not contain state. Screen state is held in the State Registry at the appropriate boundary (local, shared, or global) and is managed independently of the Screen Definition.

### Runtime Rendered

The Runtime is the sole executor of Screen rendering. The Screen Definition declares what to render; the Runtime determines how to render it on the target platform. The Runtime resolves components, binds data, evaluates conditions, and manages the rendering lifecycle.

### Builder Generated

Screens are authored in the Builder — visually, through form-based editors, or through structured data entry. The Builder produces Screen Definitions that conform to the Screen Model schema. Screen Definitions are never authored by modifying raw data files outside the Builder.

### Manifest Referenced

Screens are not embedded in the Manifest. The Manifest declares route-to-Screen associations and entry points. Screen Definitions are stored as separate, versioned artifacts within the Application Package, referenced by Screen ID.

### Versioned

Every Screen Definition carries a version. Changes to a Screen produce a new version. The version enables deterministic caching, safe updates, rollback capability, and audit trails.

### Reusable

A single Screen Definition may be referenced by multiple Routes with different parameters. The same Screen can appear in different contexts — a product detail Screen used in search results, order history, and favorites — with different data bindings.

### Accessible

Every Screen must be navigable, operable, and understandable by users with disabilities. Accessibility is a first-class architectural property of the Screen Model, not an afterthought. Screen Definitions declare reading order, focus order, landmark regions, and accessibility metadata.

### Responsive

Screen Definitions are platform-independent and adapt to the rendering context. The same Screen Definition renders correctly on phones, tablets, desktops, foldables, and large displays. Responsive adaptation is handled at the Layout and Component levels, not by duplicating Screen Definitions per device.

### Theme Aware

Screens reference theme tokens for all visual properties. No hardcoded colors, fonts, spacing, or dimensions exist in a Screen Definition. The same Screen renders in any theme — light, dark, high contrast, or brand-customized — without modification.

---

## 3. Canonical Screen Model

### 3.1 Screen

A Screen is the canonical unit of user-facing content. It is a declarative definition that specifies what content appears, how it is arranged, what data it binds to, what actions it supports, and how it behaves through its lifecycle.

```text
Screen {
    id:              string            // Unique identifier
    name:            string            // Human-readable name
    type:            ScreenType        // Architectural classification
    version:         string            // Semantic version
    metadata:        ScreenMetadata    // Descriptive metadata
    layout:          LayoutReference   // Reference to the Layout
    componentTree:   ComponentTree     // Root component tree (KB-046)
    composition:     ScreenComposition // Header, Body, Footer, Floating, Overlay, Safe Areas
    context:         ScreenContext     // Rendering context requirements
    stateBoundary:   StateBoundary     // Local, Shared, Global state scoping
    lifecycle:       ScreenLifecycle   // Lifecycle hooks and stages
    accessibility:   ScreenAccessibility // Reading order, landmarks, announcements
    responsiveness:  ScreenResponsiveness // Breakpoint adaptations
    security:        ScreenSecurity    // Permission requirements
    tags:            string[]          // Classification tags
}
```

### 3.2 Screen Definition

A Screen Definition is the complete, versioned, serializable representation of a Screen. It is the artifact produced by the Builder, stored in the Application Package, loaded by the Runtime, and referenced by the Manifest.

| Property | Description |
|----------|-------------|
| **Immutable** | A published Screen Definition is immutable. Changes produce a new version. |
| **Self-contained** | References external artifacts (Components, Layouts, Themes) by ID but contains all Screen-specific structure inline. |
| **Validatable** | Conforms to the Screen Model schema and passes structural, reference, and security validation. |
| **Cacheable** | Suitable for aggressive caching — the Definition does not change during a session. |

### 3.3 Screen Metadata

Metadata describes the Screen for discovery, documentation, and governance purposes.

```text
ScreenMetadata {
    id:              string            // Globally unique within the application
    name:            string            // Display name (e.g., "Order Detail")
    description:     string            // Purpose and content description
    route:           string            // Primary route ID (informational, not authoritative)
    version:         string            // Semantic version of this Screen Definition
    visibility:      "public" | "internal" | "hidden"
    permissions:     string[]          // Required permissions to view this Screen
    theme:           ThemeReference    // Theme binding (optional override)
    localization:    LocaleReference   // Localization configuration
    tags:            string[]          // Classification and discovery tags
    category:        string            // Functional category
    owner:           string            // Owning capability or team
    created:         datetime          // Creation timestamp
    updated:         datetime          // Last modification timestamp
}
```

### 3.4 Screen Identifier

Screen IDs follow a hierarchical naming convention:

```
{capability}.{category}.{name}
```

Examples: `orders.order-detail`, `checkout.payment-form`, `admin.user-list`, `core.settings-profile`

Rules:

- Screen IDs must be unique within an Application Package
- Screen IDs are immutable once published
- Screen IDs use lowercase with hyphens
- The capability prefix identifies the owning capability (or `core` for platform screens)

### 3.5 Screen Type

The Screen Type classifies the Screen's architectural purpose. Type determines default behaviour, lifecycle rules, and rendering expectations.

| Type | Purpose | Lifecycle | Navigation |
|------|---------|-----------|------------|
| `home` | Primary landing screen | Full lifecycle | Entry point |
| `detail` | Single entity view | Full lifecycle | Push target |
| `list` | Collection of entities | Full lifecycle | Push target |
| `form` | Data input and submission | Modal or push | Submit or cancel |
| `dashboard` | Aggregated data display | Full lifecycle | Tab or root |
| `authentication` | Login, signup, password reset | Modal or full screen | Auth flow |
| `settings` | Configuration and preferences | Push or modal | Settings entry |
| `search` | Query and browse results | Full lifecycle | Tab or push |
| `checkout` | Multi-step purchase flow | Modal or stack | Wizard |
| `success` | Confirmation after completion | Modal or push | Terminal |
| `error` | Error state display | Modal or full screen | Error recovery |
| `empty` | No-content placeholder | Inline or full screen | Contextual |
| `modal` | Overlay dialog or sheet | Modal lifecycle | Modal container |
| `wizard` | Multi-step guided process | Wizard lifecycle | Sequential steps |
| `custom` | Application-defined type | Declared lifecycle | Declared |

### 3.6 Screen Lifecycle

```text
Screen Lifecycle Stages:

                   ┌─────────────────────────────────────────────┐
                   │                                             │
                   ▼                                             │
Initialize → Resolve → Load → Mount → Activate → Interact ──────┤
                   │                     │                       │
                   │                     ▼                       │
                   │                  Deactivate ────────────────┤
                   │                     │                       │
                   │                     ▼                       │
                   │                   Unmount ──────────────────┤
                   │                     │                       │
                   │                     ▼                       │
                   │                  Dispose ───────────────────┘
                   ▼
               Error → Dispose
```

| Stage | Description |
|-------|-------------|
| **Initialize** | Screen Definition is loaded and parsed. References to Layout, Components, and Capabilities are resolved. Parameters from the navigation route are received. |
| **Resolve** | The Screen's Layout is resolved against the theme. Component Tree is validated. Data dependencies are identified and fetched. State boundaries are established. |
| **Load** | All data dependencies are loaded. Component instances are prepared. Lifecycle hook `onBeforeLoad` executes. Loading indicators are displayed if data is not ready. |
| **Mount** | The Screen enters the rendered viewport. The Layout is rendered, the Component Tree is instantiated. Lifecycle hook `onMount` executes. Focus is set according to accessibility rules. |
| **Activate** | The Screen is fully interactive. The user can navigate, input data, and trigger actions. Lifecycle hook `onActivate` executes. Navigation state records the Screen as active. |
| **Interact** | The Screen handles user interactions — taps, scrolls, inputs, gestures. Actions are dispatched through the Action Engine. State mutations are propagated. |
| **Deactivate** | The Screen loses focus. A new Screen is navigating on top (push, modal) or the Screen is being replaced. Lifecycle hook `onDeactivate` executes. State is persisted if the boundary policy requires it. |
| **Unmount** | The Screen leaves the viewport entirely (pop, dismiss, tab switch). Lifecycle hook `onUnmount` executes. Resources may be released. |
| **Dispose** | The Screen is destroyed. All Screen-scoped resources are released. Lifecycle hook `onDispose` executes. State at the Local boundary is discarded. |
| **Error** | Any lifecycle stage may transition to Error. Error handlers execute, fallback content is displayed, and the error is reported. |

### 3.7 Screen State Boundary

A Screen defines a state boundary that determines how state is scoped, persisted, and shared.

```text
StateBoundary {
    local: {
        scope:          "screen"      // Private to this Screen instance
        persistence:    "temporary"   // Discarded on Dispose
        ownership:      "screen"      // The Screen owns this state
    }
    shared: {
        scope:          "workspace" | "application" | "session"
        persistence:    "session" | "persistent"
        ownership:      "capability" | "runtime" | "application"
    }
    global: {
        scope:          "application" | "platform"
        persistence:    "persistent"
        ownership:      "runtime" | "platform"
    }
}
```

| Boundary | Scope | Persistence | Mutability |
|----------|-------|-------------|------------|
| **Local** | Single Screen instance | Until Screen disposes | Screen only |
| **Shared** | Multiple Screens within a scope | Session or persistent | Authorized consumers |
| **Global** | Entire application or platform | Persistent | Runtime or platform |

### 3.8 Screen Context

The Screen Context provides the execution environment for a Screen. It is passed to the Screen at resolution time and is accessible throughout the Screen's lifecycle.

```text
ScreenContext {
    tenant: {
        id:              string        // Current tenant identifier
        slug:            string        // Tenant URL slug
        name:            string        // Tenant display name
        tier:            string        // Tenant subscription tier
        features:        string[]      // Enabled tenant features
    }
    workspace: {
        id:              string        // Current workspace identifier
        name:            string        // Workspace display name
        type:            string        // Workspace classification
    }
    user: {
        id:              string        // Authenticated user identifier
        roles:           string[]      // User roles
        permissions:     string[]      // Resolved permissions
        preferences:     object        // User preferences
        locale:          string        // User locale
    }
    session: {
        id:              string        // Session identifier
        started:         datetime      // Session start time
        expiry:          datetime      // Session expiry
        isAuthenticated: boolean       // Authentication status
    }
    environment: {
        platform:        "mobile" | "web" | "desktop" | "embedded"
        os:              string        // Operating system
        screenSize:      ScreenSize    // Viewport dimensions
        connectivity:    "online" | "offline" | "metered"
        reducedMotion:   boolean       // Accessibility setting
        colorScheme:     "light" | "dark" | "high-contrast"
        fontSize:        "normal" | "large" | "extra-large"
    }
    runtime: {
        version:         string        // Runtime version
        capabilities:    string[]      // Active capabilities
        featureFlags:    object        // Feature flag state
        appState:        "foreground" | "background"
    }
}
```

---

## 4. Screen Hierarchy

```
Application
    │
    ▼
Navigation (Workspace)
    │
    ▼
Screen
    │
    ├── Screen Metadata
    ├── Screen Context
    ├── Screen Composition
    │       │
    │       ├── Header
    │       │       └── Layout → Section → Component
    │       ├── Body
    │       │       └── Layout → Section → Component
    │       ├── Footer
    │       │       └── Layout → Section → Component
    │       ├── Floating Areas
    │       │       └── Layout → Component
    │       ├── Overlay Regions
    │       │       └── Layout → Component
    │       └── Safe Areas
    │
    ├── Component Tree (Root)
    │       │
    │       ├── Section
    │       │       ├── Container
    │       │       │       ├── Component
    │       │       │       ├── Component
    │       │       │       └── Component
    │       │       └── Container
    │       │               └── Component
    │       └── Section
    │               └── ...
    │
    ├── State Boundaries
    │       ├── Local State
    │       ├── Shared State
    │       └── Global State
    │
    ├── Actions (Bound)
    │       └── Component Event → Action Definition
    │
    ├── Theme Binding
    └── Lifecycle Hooks
```

### 4.1 Application Level

The Application owns the collection of Screens that compose its user interface. Screens are organized by capability and referenced by the Navigation Graph. The Application Package contains all Screen Definitions as versioned artifacts.

### 4.2 Navigation Level

Navigation Routes reference Screens by Screen ID. A Route carries parameters that the Screen receives during its Initialize stage. Multiple Routes may reference the same Screen Definition with different parameters. The Navigation Engine resolves the Route and provides the Screen ID to the Renderer.

### 4.3 Screen Level

The Screen Definition is the complete description of what the user sees and interacts with. It declares the Layout, Component Tree, Composition structure, State Boundaries, and Lifecycle hooks that define the Screen's behaviour.

### 4.4 Section Level

Sections divide the Screen into logical content groups. A Section is a named region within a Screen that contains a Layout or directly contains Containers and Components. Sections provide the first level of structural organization.

### 4.5 Layout Level

The Layout defines the spatial arrangement of Sections and Components within the Screen. Layouts are referenced by ID and resolved through the Layout System. The same Layout may be used by multiple Screens.

### 4.6 Component Level

Components are the atomic visual and interactive elements that compose the Screen's content. Components are registered in the Component Registry and referenced by Component ID. The Component Tree defines the hierarchy and property bindings of all Components within the Screen.

---

## 5. Screen Types

### 5.1 Home

The primary landing Screen for an application or workspace. The Home Screen is the default navigation destination when no specific route is targeted.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Provide an overview of the application's primary content and actions |
| **Entry** | Application entry point or workspace entry point |
| **Data** | Aggregated data from multiple capabilities |
| **Navigation** | Entry point for all primary navigation flows |
| **Composition** | Header (branding), Body (featured content, quick actions), Footer (navigation) |

Home Screens should never require authentication for basic content display. Gated content within the Home Screen is handled through component-level guards.

### 5.2 Detail

A Screen focused on displaying a single entity in full detail.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Present complete information about one entity |
| **Entry** | Push navigation from a List, Search, or related Detail Screen |
| **Data** | Single entity, fetched by ID from route parameters |
| **Actions** | Edit, delete, share, navigate to related entities |
| **State** | Shared state for the entity (may update from other Screens) |

Detail Screens receive the entity identifier as a route parameter. They are reusable across contexts — the same Detail Screen can be reached from a list, a search result, a notification, or a deep link.

### 5.3 List

A Screen that presents a collection of entities with optional filtering, sorting, and pagination.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Browse and select from a collection |
| **Entry** | Tab, push, or deep link |
| **Data** | Paginated collection, filter parameters, sort parameters |
| **Actions** | Select item (navigate to Detail), filter, sort, search, load more |
| **State** | Local state for pagination cursor, filter selections, sort order |

List Screens support infinite scroll, paginated pages, or load-more patterns. The choice is a Layout concern, not a Screen concern.

### 5.6 Form

A Screen for structured data input and submission.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Collect and submit user data |
| **Entry** | Push, modal, or wizard step |
| **Data** | Form field values, validation rules, submission endpoint |
| **Actions** | Submit, cancel, save-draft, validate-field |
| **State** | Local state for field values, validation errors, submission status |
| **Lifecycle** | onBeforeSubmit (validate), onSubmit (dispatch action), onSuccess/onError |

Form Screens should not contain submission logic — they dispatch Submit actions that the Action Engine resolves. Field values are held in Local state. Validation is declared per field and evaluated by the Runtime.

### 5.7 Dashboard

A Screen that aggregates data visualizations and key metrics.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Provide at-a-glance operational intelligence |
| **Entry** | Tab, workspace entry point, or deep link |
| **Data** | Multiple data sources, aggregated metrics, time-series data |
| **Actions** | Filter by date range, drill down to Detail, refresh |
| **Composition** | Widget grid, each widget is a Component with its own data binding |

Dashboard Screens compose independently loaded widgets. Each widget manages its own data loading and refresh cycle. Widget coordination (cross-filtering) uses Shared state or Event Bus messages.

### 5.8 Authentication

A Screen for identity verification flows.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Login, signup, password reset, multi-factor authentication |
| **Entry** | Deep link, guard redirect, manual navigation |
| **Data** | Credential inputs, authentication tokens (never stored in Screen state) |
| **Actions** | Submit credentials, request reset, verify code |
| **State** | Local: form fields, validation. Never: tokens, secrets. |
| **Security** | Sensitive parameters stripped from history and state persistence |

Authentication Screens are subject to special security rules: no state persistence, no history recording for credential fields, and automatic clearing on successful authentication.

### 5.9 Settings

A Screen for user or application configuration.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | View and modify preferences, configuration, and account settings |
| **Entry** | Drawer, tab, or push navigation |
| **Data** | User preferences, application configuration, account information |
| **Actions** | Toggle setting, update preference, save configuration, logout |
| **State** | Shared state for preferences, Local state for unsaved changes |

### 5.10 Search

A Screen for querying and browsing results.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Search across entities with query input and result display |
| **Entry** | Tab, push, or deep link with query parameter |
| **Data** | Search query, filters, paginated results |
| **Actions** | Execute search, filter results, sort, select result |
| **State** | Local: search query, filter selections, pagination cursor |

Search Screens receive the initial query from route parameters. Recent searches are stored in Shared state or user preferences.

### 5.11 Checkout

A Screen (or wizard) for completing a purchase or transaction flow.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Guide the user through a multi-step transaction to completion |
| **Entry** | Push, modal, or wizard container |
| **Data** | Cart/order state, payment information, shipping details |
| **Actions** | Next step, previous step, place order, cancel |
| **State** | Shared state for the entire checkout flow across steps |
| **Lifecycle** | Steps: Review → Shipping → Payment → Confirmation. Each step is a Screen or Section. |

Checkout Screens pass Shared state between steps. The Runtime ensures state continuity across the wizard even if individual Screens are unmounted and remounted.

### 5.12 Success

A Screen displayed after a successful operation — order placed, form submitted, action completed.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Confirm successful completion and provide next steps |
| **Entry** | Terminal route in a flow |
| **Data** | Confirmation details, reference numbers, next-action suggestions |
| **Actions** | View confirmation, return home, take suggested next action |
| **Lifecycle** | Auto-return timer may navigate back after a configurable delay |

### 5.13 Error

A Screen displayed when an operation fails or a route cannot be resolved.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Communicate the error and provide recovery options |
| **Entry** | Automatic from navigation failure, action failure, or data load failure |
| **Data** | Error code, message, recovery actions |
| **Actions** | Retry, go back, contact support, return home |
| **Types** | Network error, permission denied, not found, server error, timeout |

Error Screens are generated by the Runtime from error definitions in the Manifest. They may be overridden by application-specific Error Screen Definitions.

### 5.14 Empty

A Screen displayed when a List or Search returns no results.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Communicate the empty state and suggest actions |
| **Entry** | Automatic from List or Search with no data |
| **Data** | Empty state message, suggested actions |
| **Actions** | Create new entity, clear filters, browse other sections |

### 5.15 Modal

A Screen presented in a Modal container.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Present content that requires user attention before returning |
| **Entry** | Modal navigation from any Screen |
| **Data** | Per modal type (form, confirmation, detail preview) |
| **Actions** | Confirm, dismiss, submit |
| **Lifecycle** | Modal lifecycle: Mount → Activate → Dismiss → Dispose |
| **Composition** | May include its own Header, Body, Footer |

Modal Screens follow the same Screen Model as full Screens but render within the Modal container's constraints (smaller viewport, blocking interaction below).

### 5.16 Wizard

A Screen that is part of a multi-step sequential flow.

| Aspect | Architecture |
|--------|-------------|
| **Purpose** | Represent one step in a guided process |
| **Entry** | Wizard container, previous step |
| **Data** | Step-specific inputs, flow-level shared state |
| **Actions** | Next, previous, skip (if allowed), cancel |
| **State** | Combines Local (step-specific) and Shared (flow-level) state |
| **Lifecycle** | Wizard lifecycle: step progression is managed by the Flow |

### 5.17 Custom

Application-defined Screen types not covered by the standard types. Custom Screens must declare their lifecycle and behaviour expectations in their metadata.

---

## 6. Screen Metadata

```text
ScreenMetadata {
    id:              string           // Unique identifier (required)
    name:            string           // Display name (required)
    route:           string           // Primary route reference (informational)
    description:     string           // Purpose description (required)
    version:         string           // Semantic version (required)
    visibility:      enum             // public | internal | hidden
    permissions:     string[]         // Required permissions
    theme:           string           // Theme ID or empty for application default
    locale:          string           // Default locale
    supportedLocales: string[]        // Available translations
    tags:            string[]         // Classification tags
    category:        string           // Functional category
    owner:           string           // Owning capability or team
    created:         datetime         // Creation timestamp
    updated:         datetime         // Last update timestamp
    customMetadata:  object           // Extensible metadata for Builder plugins
}
```

| Field | Required | Description |
|-------|----------|-------------|
| **id** | Yes | Unique Screen ID within the Application Package |
| **name** | Yes | Human-readable name displayed in the Builder |
| **route** | No | Informational; authoritative route assocation is in Navigation |
| **description** | Yes | Describes what the Screen does, for Builder and documentation |
| **version** | Yes | Semantic version of this Screen Definition |
| **visibility** | No | Controls Screen visibility in Builder and menus. Default: `public` |
| **permissions** | No | Permissions required to view this Screen. Evaluated by Navigation Guards, not by the Screen. |
| **theme** | No | Optional theme override. Empty means use application theme. |
| **locale** | No | Default locale for content. Default: application default locale. |
| **supportedLocales** | No | Locales the Screen has been translated to. |
| **tags** | No | Classification tags for filtering and discovery in the Builder |
| **category** | No | Functional grouping for Builder organization |
| **owner** | No | Responsible team or capability |
| **created** | No | Auto-set on creation |
| **updated** | No | Auto-set on modification |

---

## 7. Screen Context

The Screen Context is provided by the Runtime at Screen resolution time. It is read-only from the Screen's perspective.

### 7.1 Tenant Context

```text
tenant: {
    id:              string        // Tenant ID from KB-043
    slug:            string        // URL-friendly tenant identifier
    name:            string        // Display name
    tier:            string        // Subscription tier (determines available features)
    features:        string[]      // Tenant-specific feature flags
    locale:          string        // Tenant default locale
    timezone:        string        // Tenant timezone
}
```

### 7.2 Workspace Context

```text
workspace: {
    id:              string        // Workspace ID
    name:            string        // Workspace name
    navigationGraph: string        // Active navigation graph ID
    entryPoint:      string        // Workspace entry route
}
```

### 7.3 User Context

```text
user: {
    id:              string        // User ID from Identity
    displayName:     string        // User display name
    email:           string        // User email
    avatar:          string        // Avatar asset URL
    roles:           string[]      // User roles
    permissions:     string[]      // Resolved permissions
    preferences: {
        locale:      string        // User locale override
        theme:       string        // User theme preference
        fontSize:    string        // normal | large | extra-large
        reducedMotion: boolean
    }
}
```

### 7.4 Session Context

```text
session: {
    id:              string        // Unique session ID
    started:         datetime      // Session start
    lastActivity:    datetime      // Last user interaction
    expiry:          datetime      // Session expiry
    isAuthenticated: boolean
    authMethod:      string        // password | sso | magic-link | biometric
}
```

### 7.5 Environment Context

```text
environment: {
    platform:        enum          // mobile | web | desktop | embedded | tv | kiosk
    os:              string        // ios | android | windows | macos | linux | web
    osVersion:       string
    appVersion:      string        // Runtime app version
    deviceType:      enum          // phone | tablet | desktop | foldable | large-display
    screenSize: {
        width:       number        // CSS pixels
        height:      number        // CSS pixels
        scale:       number        // Device pixel ratio
    }
    connectivity:    enum          // online | offline | metered | slow
    reducedMotion:   boolean
    colorScheme:     enum          // light | dark | high-contrast
    fontSize:        enum          // normal | large | extra-large
    orientation:     enum          // portrait | landscape
}
```

### 7.6 Runtime Context

```text
runtime: {
    version:         string        // Runtime semantic version
    capabilities:    string[]      // IDs of active capabilities
    featureFlags:    Record<string, boolean>
    appState:        enum          // foreground | background | suspended
    navigationState: {
        currentRoute:   string
        currentParams:  object
        stackDepth:     number
    }
}
```

---

## 8. Screen Composition

### 8.1 Composition Structure

```text
ScreenComposition {
    header:     Region         // Top region — branding, navigation, search
    body:       Region         // Primary content region
    footer:     Region         // Bottom region — actions, status, links
    floating:   FloatingArea[] // Elements that float above content
    overlays:   OverlayRegion[] // Modals, dialogs, sheets within this Screen
    safeAreas:  SafeAreaConfig // Edge insets for device notches, status bars, home indicators
}
```

### 8.2 Header

The Header region occupies the top of the Screen. It contains persistent chrome elements.

| Element | Description |
|---------|-------------|
| **Navigation Bar** | Back button, title, primary actions |
| **Search Bar** | Optional search input |
| **Tabs** | Optional secondary tab navigation within the Screen |
| **Breadcrumbs** | Optional breadcrumb trail |
| **Branding** | Optional logo or brand mark |

Header content is declared in the Screen Definition. The Runtime determines the platform-appropriate rendering (e.g., navigation bar on mobile, top bar on desktop).

### 8.3 Body

The Body region is the primary content area. It contains the main Component Tree that renders the Screen's content.

| Aspect | Description |
|--------|-------------|
| **Scrollable** | Body is scrollable by default |
| **Content** | Sections, Containers, Components |
| **Loading** | Skeleton or spinner shown during data loading |
| **Empty** | Empty state shown when no data |
| **Error** | Error state shown on load failure |

### 8.4 Footer

The Footer region occupies the bottom of the Screen. It contains persistent actions and supplementary content.

| Element | Description |
|---------|-------------|
| **Action Bar** | Primary actions (Submit, Save, Continue) |
| **Status Bar** | Connection status, sync status |
| **Links** | Terms, privacy, help links |
| **Pagination** | Page navigation controls |

### 8.5 Floating Areas

Floating areas contain elements that are positioned above the normal content flow but below modal overlays.

| Element | Description |
|---------|-------------|
| **FAB** | Floating action button |
| **Snackbar** | Transient notification |
| **Tooltip** | Contextual help popover |
| **Bottom Sheet** | Action sheet within the Screen context |

Floating elements are declared as part of the Screen Definition. Their z-order and positioning are managed by the Runtime.

### 8.6 Overlay Regions

Overlay regions contain modal content that blocks interaction with the Screen below.

| Element | Description |
|---------|-------------|
| **Dialog** | Confirmation dialog |
| **Action Sheet** | List of actions |
| **Popover** | Contextual popover |
| **Fullscreen Modal** | Modal Screen within the Screen context |

Screen-level overlays are distinct from Navigation Modals. Screen overlays are part of the Screen's composition. Navigation Modals are separate Navigation operations that happen to use a Modal container.

### 8.7 Safe Areas

Safe areas define the insets that the Screen must respect to avoid device-specific obstructions.

```text
SafeAreaConfig {
    top:        boolean    // Respect status bar, notch, dynamic island
    bottom:     boolean    // Respect home indicator
    left:       boolean    // Respect display cutouts
    right:      boolean    // Respect display cutouts
    keyboard:   boolean    // Adjust for keyboard appearance
}
```

Safe area configuration is declared in the Screen Definition. The Runtime maps abstract safe areas to platform-specific values.

---

## 9. Layout Relationship

### 9.1 Screen-to-Layout Reference

Screens reference Layouts by Layout ID. The Layout defines the spatial arrangement of Sections and Components within the Screen.

```text
layout: {
    id:           string       // Layout ID from the Layout System
    version:      string       // Layout version (optional override)
    parameters:   object       // Layout parameters (spacing, density, breakpoints)
}
```

### 9.2 Layout Resolution

1. Screen Definition declares a Layout reference
2. Runtime resolves the Layout Definition from the Application Package
3. Runtime applies the Screen's theme to the Layout (spacing tokens, breakpoints)
4. Runtime resolves responsive breakpoints based on Screen Context (viewport, platform)
5. Runtime produces the final rendered layout structure

### 9.3 Layout Responsibilities

| Responsibility | Owner |
|----------------|-------|
| Define spatial arrangement | Layout System (KB-014) |
| Apply theme tokens | Theme Engine (KB-049) |
| Resolve breakpoints | Layout System |
| Render layout structure | Renderer (KB-052) |
| Define container nesting | Layout System |

Screens do not define layout algorithms. They reference Layouts and provide parameters. The Layout System and Renderer handle spatial resolution.

---

## 10. Component Relationship

### 10.1 Screen-to-Component Tree

Each Screen contains a root Component Tree that defines the hierarchy and configuration of all Components rendered within the Screen.

```text
componentTree: ComponentTreeNode  // Root node of the Component Tree (KB-046)
```

### 10.2 Component Resolution

1. Screen Definition declares a Component Tree
2. Runtime resolves each Component reference against the Component Registry
3. Components receive their declared properties, data bindings, action bindings, and theme bindings
4. Unregistered Components trigger a fallback or error

### 10.3 Component Responsibilities

| Responsibility | Owner |
|----------------|-------|
| Define Component schema | Component Registry (KB-012) |
| Define Component Tree structure | Component Tree Model (KB-046) |
| Resolve Component references | Runtime Component Registry |
| Bind data to Components | Runtime (data binding layer) |
| Bind actions to Components | Action Engine (KB-047) |
| Render Components | Renderer (KB-052) |

Screens host Component Trees but do not define Component behaviour. Components are independently registered, versioned, and governed.

---

## 11. Navigation Relationship

### 11.1 Route-to-Screen Resolution

Navigation Routes reference Screens by Screen ID. The Navigation Engine resolves a Route and passes the Screen ID to the Renderer.

```text
// In the Manifest's Navigation Graph
routes: [
    {
        routeId: "orders.detail",
        path: "/orders/:orderId",
        screen: "orders.order-detail",     // Screen ID reference
        parameters: [
            { name: "orderId", type: "string", required: true }
        ]
    }
]
```

### 11.2 Screen Lifecycle and Navigation

Navigation events trigger Screen lifecycle transitions:

| Navigation Event | Screen Lifecycle |
|-----------------|------------------|
| Push to Screen | Initialize → Resolve → Load → Mount → Activate |
| Pop from Screen | Deactivate → Unmount → Dispose |
| Present Modal | Modal lifecycle on top of existing Screen |
| Dismiss Modal | Deactivate → Unmount → Dispose of modal; Activate underlying Screen |
| Switch Tab | Deactivate → Unmount current; Mount → Activate target |
| Replace Screen | Deactivate → Unmount → Dispose current; Initialize → ... → Activate replacement |
| Deep Link | Same as Push, with parameters from deep link |

### 11.3 Parameter Passing

Route parameters are passed to the Screen during the Initialize stage:

```text
// Screen receives:
screenParams: {
    routeParams:    object    // Path and query parameters from the Route
    deepLinkParams: object    // Parameters from deep link (if applicable)
    source:         string    // "navigation" | "deeplink" | "notification" | "qr"
}
```

---

## 12. State Boundary

### 12.1 Local State Boundary

Local state is private to a single Screen instance. It is created when the Screen mounts and discarded when the Screen disposes.

| Property | Value |
|----------|-------|
| **Scope** | Single Screen instance |
| **Visibility** | Screen only |
| **Persistence** | Temporary (discarded on Dispose) |
| **Examples** | Form field values, scroll position, UI toggle states, pagination cursor |

```text
local: {
    scope:          "screen-instance"
    persistence:    "temporary"
    ownership:      "screen"
    consumers:      ["screen.components"]
    mutators:       ["screen.components", "screen.actions"]
}
```

### 12.2 Shared State Boundary

Shared state is accessible across multiple Screens within a defined scope. It persists beyond a single Screen's lifecycle.

| Property | Value |
|----------|-------|
| **Scope** | Workspace, Application, or Session |
| **Visibility** | Authorized Screens and Capabilities |
| **Persistence** | Session or Persistent |
| **Examples** | Cart contents, user preferences, filter selections, current order |

```text
shared: {
    scope:          "workspace" | "application" | "session"
    persistence:    "session" | "persistent"
    ownership:      "capability" | "application"
    consumers:      ["authorized.screens", "authorized.capabilities"]
    mutators:       ["capability.actions", "screen.actions"]
}
```

### 12.3 Global State Boundary

Global state is accessible across the entire application and platform.

| Property | Value |
|----------|-------|
| **Scope** | Application or Platform |
| **Visibility** | All Screens and Capabilities |
| **Persistence** | Persistent |
| **Examples** | Authentication state, theme selection, tenant context, session info |

```text
global: {
    scope:          "application" | "platform"
    persistence:    "persistent"
    ownership:      "runtime" | "platform"
    consumers:      ["all.screens", "all.capabilities", "runtime"]
    mutators:       ["runtime", "platform.actions", "capability.actions"]
}
```

### 12.4 State Boundary Enforcement

State boundaries are enforced by the Runtime's State Manager:

- A Screen may read from any boundary but may only write to boundaries it owns
- Local state writes are unrestricted within the Screen
- Shared state writes must pass authorization checks
- Global state writes are restricted to the Runtime and authorized capabilities
- Cross-boundary reads are mediated through the State Registry's observation API

---

## 13. Actions

### 13.1 Action Binding

Screens bind Actions to Component events through the Component Tree. Actions are defined in KB-047.

```text
// In the Component Tree
{
    componentId: "button.primary",
    properties: { label: "Submit Order" },
    bindings: {
        onPress: {
            action: "orders.submit",
            params: {
                orderId: { source: "state", path: "shared.checkout.orderId" }
            }
        }
    }
}
```

### 13.2 Screen-Level Actions

Screens may declare Screen-level actions that are triggered by lifecycle events:

```text
lifecycle: {
    onBeforeLoad:  { action: "data.fetchInitial", params: { source: "route" } },
    onMount:       { action: "analytics.screenView", params: { screenId: "self.id" } },
    onActivate:    { action: "data.refresh" },
    onDeactivate:  { action: "state.persistDraft" },
    onDispose:     { action: "state.releaseLocal" }
}
```

### 13.3 Screen Responsibilities

- Screens declare Action bindings in the Component Tree
- Screens do not execute Actions directly
- Screens do not define Action logic
- Screens do not handle Action results (the Runtime dispatches results to state, navigation, or other handlers)
- Screens observe Action-related state changes through the State Registry

---

## 14. Theme Relationship

### 14.1 Theme Binding

Screens reference the application theme by default and may declare optional theme overrides:

```text
theme: {
    id:           string       // Theme ID (empty = application default)
    overrides: {
        tokens:   object       // Theme token overrides (KB-049)
        modes:    object       // Mode-specific overrides (light, dark)
    }
}
```

### 14.2 Theme Consumption

Screens consume theme through:

- **Layout spacing tokens**: Padding, margin, gap values
- **Typography tokens**: Font family, size, weight, line height for all text elements
- **Color tokens**: Background, foreground, accent, status colors
- **Shape tokens**: Border radius, elevation, shadow values
- **Motion tokens**: Transition durations and easing curves
- **Icon tokens**: Icon set selection and sizing

### 14.3 Theme Responsibilities

| Responsibility | Owner |
|----------------|-------|
| Define theme tokens | Theme Model (KB-049) |
| Resolve theme values | Theme Engine (KB-017) |
| Apply theme to Layout | Layout System (KB-014) |
| Apply theme to Components | Component Registry (KB-012) |
| Override theme per Screen | Screen Definition |

Screens reference tokens by name. The Theme Engine resolves token names to concrete values based on the active theme, mode (light/dark/high-contrast), and any Screen-level overrides.

---

## 15. Capability Relationship

### 15.1 Capability-Owned Screens

Capabilities own Screens. A capability may contribute one or more Screen Definitions to the Application.

```text
// In the Capability Definition
capability: {
    id: "orders-management",
    screens: [
        "orders.order-list",
        "orders.order-detail",
        "orders.order-form"
    ]
}
```

### 15.2 Screen Ownership Rules

| Rule | Description |
|------|-------------|
| **Single Owner** | Each Screen is owned by exactly one capability (or `core`) |
| **Capability Activation** | A Screen is only available when its owning capability is active |
| **Capability Removal** | When a capability is removed, its Screens are removed from the application |
| **Override** | Applications may override capability-owned Screens with their own definitions |

### 15.3 Capability-Screen Integration

Capabilities provide:

- **Screen Definitions**: The Screens that implement the capability's UI
- **Component Contributions**: Components used by the capability's Screens
- **Action Definitions**: Actions that the capability's Screens dispatch
- **State Definitions**: State boundaries that the capability's Screens consume
- **Navigation Contributions**: Routes that reference the capability's Screens

---

## 16. Runtime Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Screen Resolution** | Load Screen Definition from Application Package by Screen ID |
| **Context Provision** | Provide Screen Context (tenant, workspace, user, session, environment, runtime) |
| **Layout Resolution** | Resolve Layout reference, apply theme, resolve responsive breakpoints |
| **Component Resolution** | Resolve all Component references from the Component Registry |
| **Data Binding** | Bind data sources to Components based on declared bindings |
| **Action Binding** | Bind Action definitions to Component events |
| **Lifecycle Management** | Execute Screen lifecycle: Initialize → Resolve → Load → Mount → Activate → Deactivate → Unmount → Dispose |
| **State Management** | Create and manage Local state boundary, mediate Shared and Global state access |
| **Rendering** | Render the Screen on the target platform |
| **Error Handling** | Handle Screen load failures, Component resolution failures, and rendering errors |
| **Accessibility** | Enforce reading order, focus management, landmark regions, screen reader announcements |
| **Performance** | Lazy-load off-screen content, preload likely Screens, manage rendering budgets |

---

## 17. Builder Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Screen Designer** | Provide visual Screen design tools — Layout arrangement, Component palette, property editors |
| **Layout Assignment** | Allow authors to select and parameterize Layouts for each Screen |
| **Component Tree Editor** | Provide Component Tree editing — add, remove, reorder, configure Components |
| **State Boundary Configurator** | Allow authors to declare state boundaries and their persistence policies |
| **Action Binding** | Provide action binding UI — select Action, configure parameters, bind to Component events |
| **Lifecycle Hook Editor** | Allow authors to configure lifecycle hook actions |
| **Metadata Editor** | Provide Screen metadata editing — ID, name, description, tags, visibility, permissions |
| **Context Simulation** | Simulate different Screen Contexts for preview (tenant, platform, user, environment) |
| **Preview Mode** | Render the Screen in the Builder for visual verification |
| **Validation** | Validate Screen Definitions: required fields, reference resolution, no circular dependencies, permission consistency |

---

## 18. Manifest Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Screen References** | Declare route-to-Screen associations in the Navigation Graph |
| **Entry Points** | Declare which Screens serve as application and workspace entry points |
| **Capability Screen Declarations** | Declare which Screens each capability contributes |
| **Screen Versioning** | Reference specific Screen Definition versions |
| **Theme Binding** | Declare application-level theme that all Screens consume by default |

The Manifest does not contain Screen Definitions. It references them by ID. Screen Definitions are stored as separate artifacts in the Application Package.

---

## 19. Accessibility

### 19.1 Reading Order

The Screen Definition declares the logical reading order of content. Reading order is independent of visual layout order.

```text
accessibility: {
    readingOrder: [
        { region: "header", order: 1 },
        { region: "body", order: 2 },
        { region: "footer", order: 3 }
    ],
    focusOrder: [
        { component: "search-input", order: 1 },
        { component: "primary-action", order: 2 },
        { component: "secondary-action", order: 3 }
    ]
}
```

### 19.2 Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus through focusable elements in declared order |
| Shift+Tab | Reverse focus traversal |
| Enter/Space | Activate focused element |
| Arrow keys | Navigate within grouped elements (radio groups, tab lists, menus) |
| Escape | Close overlays, dismiss modals, cancel operations |

### 19.3 Screen Readers

Screen reader announcements are triggered at lifecycle transitions:

| Event | Announcement |
|-------|-------------|
| Screen Mount | "Screen loaded: [Screen Name]" |
| Section Update | "Content updated: [Section Name]" |
| Action Result | "[Success/Error]: [Message]" |
| Error State | "Error: [Error Message]. [Recovery Action]" |
| Loading State | "Loading [Section Name]" |

### 19.4 Dynamic Scaling

Screens must function correctly when text is scaled up to 200% without:

- Content truncation
- Overlapping elements
- Lost functionality
- Horizontal scrolling (except for data tables)

### 19.5 Contrast Compliance

All Screen content must meet WCAG 2.1 AA contrast ratios:

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components and graphical objects: 3:1 minimum
- Focus indicators: 3:1 minimum

Contrast compliance is enforced by theme token validation, not by individual Screen definitions.

---

## 20. Responsive Behaviour

### 20.1 Architecture

Screens are platform-independent and device-independent. Responsive adaptation is handled at the Layout and Component levels. Screen Definitions declare breakpoint adaptions but do not define per-device Screens.

```text
responsiveness: {
    breakpoints: [
        {
            name:     "phone",
            maxWidth: 599,
            adaptations: {
                layout: "compact",
                header: "minimal",
                sections: "single-column"
            }
        },
        {
            name:     "tablet",
            minWidth: 600,
            maxWidth: 1023,
            adaptations: {
                layout: "comfortable",
                header: "standard",
                sections: "two-column"
            }
        },
        {
            name:     "desktop",
            minWidth: 1024,
            maxWidth: 1919,
            adaptations: {
                layout: "expanded",
                header: "full",
                sections: "multi-column"
            }
        },
        {
            name:     "large-display",
            minWidth: 1920,
            adaptations: {
                layout: "expanded",
                header: "full",
                sections: "multi-column",
                maxContentWidth: 1440
            }
        }
    ]
}
```

### 20.2 Device Classes

| Device | Characteristics | Adaptation |
|--------|----------------|------------|
| **Phone** | 320–599px, portrait primary, touch input | Single column, minimal header, bottom navigation |
| **Tablet** | 600–1023px, both orientations, touch + pointer | Two column, standard header, sidebar or top tabs |
| **Desktop** | 1024–1919px, landscape, pointer + keyboard | Multi column, full header, persistent sidebar |
| **Foldable** | Dynamic, posture-aware, hinge-aware | Responsive layout reflow on fold/unfold |
| **Large Display** | 1920px+, landscape, pointer + keyboard | Max content width, multi-column, full chrome |

### 20.3 Responsibility

| What | Who |
|------|-----|
| Define breakpoint ranges | Screen Definition |
| Define layout adaptations per breakpoint | Screen Definition |
| Define component visibility per breakpoint | Screen Definition |
| Resolve active breakpoint | Runtime (from Screen Context) |
| Apply layout adaptation | Layout System |
| Show/hide components per breakpoint | Runtime Renderer |
| Adapt navigation chrome | Platform Adaptation Layer |

---

## 21. Performance

### 21.1 Screen Loading

- Screen Definitions are cached aggressively after first load
- Component Tree resolution is memoized per Screen version
- Data loading is parallelized where dependencies permit
- Screens declare data dependencies for optimized prefetching

### 21.2 Lazy Loading

- Components outside the viewport are not rendered
- Sections below the fold may be deferred
- Images and media assets load lazily with placeholder fallbacks
- Heavy components (maps, charts, rich text editors) are deferred until needed

### 21.3 Rendering Budget

Screens should target:

| Metric | Target |
|--------|--------|
| Time to first paint | < 500ms |
| Time to interactive | < 2000ms |
| Component Tree render | < 100ms |
| State propagation | < 50ms |
| Screen transition | < 300ms |

### 21.4 Preloading

- The first Screen in each Tab is preloaded at application start
- Screens linked from the current Screen are preloaded on hover/long-press
- The previous Screen is preloaded during forward navigation
- Predictive preloading based on usage analytics

---

## 22. Offline Behaviour

### 22.1 Screen Definition Availability

Screen Definitions must be available offline. They are cached locally as part of the Application Package cache.

### 22.2 Data Loading Offline

| Scenario | Behaviour |
|----------|-----------|
| Data cached locally | Screen renders with cached data, stale indicator shown |
| Data not cached | Screen renders with placeholder, "offline" banner, retry on connectivity |
| Partial cache | Screen renders with available data, missing sections show placeholders |
| Action submission | Actions queued for synchronization when online |

### 22.3 State Offline

- Local state works identically online and offline
- Shared state that requires server synchronization is queued
- Global state is fully available offline (cached at application start)
- State persistence writes to local storage regardless of connectivity

---

## 23. Security

### 23.1 Permission Enforcement

Screen-level permissions are declared in metadata but enforced by Navigation Guards, not by the Screen. The Screen never receives permission data — it is simply not rendered if the user lacks authorization.

### 23.2 Sensitive Data Handling

Screens that handle sensitive data declare this in their metadata:

```text
security: {
    sensitiveData:       boolean    // Screen contains PII, financial, or health data
    clearOnDeactivate:   boolean    // Clear sensitive Local state on deactivate
    preventScreenshot:   boolean    // Platform-level screenshot prevention
    auditNavigation:     boolean    // Log all navigation to/from this Screen
    requiredAuthLevel:   string     // Minimum auth level (password, biometric, MFA)
}
```

### 23.3 Input Validation

All user input collected on a Screen is validated before action dispatch:

- Type validation (string, number, email, phone, etc.)
- Format validation (regex patterns)
- Length validation (min, max)
- Range validation (numeric ranges)
- Required field validation
- Cross-field validation (dependencies between fields)

---

## 24. Observability

### 24.1 Screen Events

| Event | Trigger |
|-------|---------|
| `screen.initialized` | Screen Definition loaded and parsed |
| `screen.resolved` | Layout and Components resolved |
| `screen.loadStarted` | Data loading began |
| `screen.loadCompleted` | All data dependencies loaded |
| `screen.loadFailed` | Data loading failed |
| `screen.mounted` | Screen entered viewport |
| `screen.activated` | Screen fully interactive |
| `screen.deactivated` | Screen lost focus |
| `screen.unmounted` | Screen left viewport |
| `screen.disposed` | Screen destroyed |
| `screen.error` | Error at any lifecycle stage |
| `screen.stateChange` | Local state mutated |

### 24.2 Rendering Metrics

| Metric | Description |
|--------|-------------|
| Screen load time | Definition load to render complete |
| Component resolution time | Total Component Tree resolution time |
| Data load time | Time to load all data dependencies |
| Time to first paint | Screen Definition loaded to first visual output |
| Time to interactive | Screen Definition loaded to fully interactive |
| Render count | Number of re-renders during Screen lifetime |

### 24.3 Failures

| Failure | Event |
|---------|-------|
| Screen Definition not found | `screen.error` with code `SCREEN_NOT_FOUND` |
| Screen Definition invalid | `screen.error` with code `SCREEN_INVALID` |
| Layout not found | `screen.error` with code `LAYOUT_NOT_FOUND` |
| Component not found | `screen.error` with code `COMPONENT_NOT_FOUND` |
| Data load failure | `screen.loadFailed` with error details |
| Permission denied | Blocked at Navigation level — `navigation.guardFailed` |

---

## 25. Failure Scenarios

| Scenario | Behaviour |
|----------|-----------|
| **Screen not found** | Runtime returns error, Navigation Engine shows fallback screen. Error logged. |
| **Screen Definition invalid** | Validation error at load time. Error screen with diagnostic code. Definition replaced with fallback. |
| **Corrupted Screen Definition** | Schema validation fails. Error screen displayed. Corrupted copy discarded, fresh copy fetched from cache or server. |
| **Unsupported Components** | Runtime attempts fallback component for unsupported types. If no fallback, component slot shows placeholder. Components load failure does not block entire Screen. |
| **Missing Layout** | Layout not found at resolution time. Default single-column layout applied as fallback. Error logged for Builder diagnostics. |
| **Permission Denied** | Screen is not loaded. Navigation Guard blocks at the route level. User never reaches the Screen. |
| **Data load failure** | Screen renders with partial data. Error state shown for failed sections. Retry action available. |
| **Theme resolution failure** | Fallback to default theme tokens. Error logged. Screen renders with fallback theme. |
| **Component Tree circular reference** | Validation detects cycle at resolution time. Error screen displayed. Cycle reported for Builder. |
| **State boundary violation** | Runtime blocks unauthorized state write. Error logged. Screen operates with degraded state access. |

---

## 26. Anti-Patterns

### Business Logic in Screens

Screens are declarative definitions. They must not contain business logic, calculations, data transformations, or workflow orchestration. Business logic lives in Capabilities, Actions, and Backend services.

### Hardcoded Navigation

Screens must not embed route IDs or navigation commands. Components dispatch abstract actions; the Navigation Engine resolves routes. Hardcoded navigation creates tight coupling between Screens and the Navigation Graph.

### Platform-Specific Screens

Creating separate Screen Definitions for each platform (mobile, web, desktop) violates the platform-independence principle. A single Screen Definition should render on all platforms. Platform-specific adaptations are Layout and Component concerns.

### Stateful Definitions

Screen Definitions must be stateless. State belongs in the State Registry, not in the Definition. A stateless Definition is cacheable, shareable, and testable.

### Duplicate Screen Definitions

The same conceptual Screen should not be defined multiple times. Reuse a single Screen Definition with different parameters rather than duplicating it. Duplication causes maintenance burden and inconsistency.

### Overly Large Screens

A Screen should represent one coherent view. If a Screen contains multiple unrelated content areas, it should be split into multiple Screens connected by navigation.

### Deeply Nested Component Trees

Excessive Component Tree nesting degrades performance and maintainability. Maximum recommended depth is 10 levels. Deeper Trees should be refactored into sub-Components.

### Hardcoded Values

All visual properties must reference theme tokens. Hardcoded colors, spacing, font sizes, and dimensions make Screens theme-incompatible and unresponsive.

### Embedding Assets

Assets (images, icons, fonts) must be referenced by URL or asset ID, not embedded inline. Embedded assets increase Definition size and prevent caching.

### Ignoring Empty States

Every List and Search Screen must define an Empty state. Screens that assume data will always be present produce poor user experiences when data is absent.

### Mixing Screen Types

A Screen should serve one purpose. A Screen that acts as both a Form and a Dashboard creates confusing user experiences and complicates lifecycle management.

---

## 27. Future Evolution

### 27.1 Adaptive Screens

Screens that automatically adapt their structure based on user behaviour, usage patterns, and role. Adaptive Screens are still declarative — the adaptation rules are declared in the Definition, not computed at runtime.

### 27.2 AI-Generated Screens

AI-assisted Screen generation from natural language descriptions. The AI produces Screen Definitions that conform to the Screen Model schema and can be reviewed, validated, and published through the Builder.

### 27.3 Collaborative Screens

Screens that support real-time multi-user collaboration — shared cursors, live edits, presence indicators. Collaborative Screens extend the state model to support operational transform or CRDT-based synchronization.

### 27.4 Runtime Personalization

Screens that personalize content and layout per user based on preferences, history, and role. Personalization is expressed through conditional content rules in the Screen Definition.

### 27.5 Multi-Device Screens

Screens that span multiple devices — a secondary screen showing complementary content, a companion device displaying controls, or a large display showing an expanded view.

---

## 28. Cross References

| KB-ID | Title | Relationship |
|-------|-------|--------------|
| KB-041 | Application Architecture Overview | Screens are a core element of the Application Model. The Application Architecture defines where Screens fit in the canonical hierarchy. |
| KB-042 | Application Manifest Specification | The Manifest references Screens by ID, declares entry points, and associates Routes with Screens. |
| KB-043 | Workspace & Tenant Model | Screen Context includes Tenant and Workspace identity. Screens are scoped to workspace navigation graphs. |
| KB-044 | Navigation Architecture | Routes reference Screens. Navigation lifecycle triggers Screen lifecycle. Route parameters become Screen parameters. |
| KB-045 | Screen Model | This document. |
| KB-046 | Component Tree Model | Screens host Component Trees. The Component Tree defines the hierarchy and configuration of Components within a Screen. |
| KB-047 | Action & Event Model | Screens bind Actions to Component events. Screen lifecycle hooks reference Actions. |
| KB-048 | State Model | Screens define state boundaries (Local, Shared, Global). The State Model governs state management across boundaries. |
| KB-049 | Theme Model | Screens reference themes and consume theme tokens through the Layout and Components. |
| KB-050 | Capability Composition | Capabilities own Screens. A capability contributes Screen Definitions to the Application. Capability activation determines Screen availability. |
| KB-051 | Runtime Architecture Overview | The Runtime resolves, renders, and manages Screen lifecycles. The Renderer transforms Screen Definitions into platform-native output. |
| KB-014 | Layout System | Screens reference Layouts. The Layout System defines spatial arrangement. |
| KB-012 | Component Registry | Components used in Screens are resolved through the Component Registry. |
| KB-016 | Navigation Engine | The Navigation Engine resolves Routes to Screens and triggers Screen lifecycle transitions. |
| KB-018 | State Management | The State Manager enforces Screen state boundaries. |

---

*This is KB-045, the Screen Model specification of the DUKADESK Engineering Knowledge Base. It defines the canonical Screen architecture for all DUKADESK applications across all platforms.*
