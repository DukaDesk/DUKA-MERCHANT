# KB-007 — Service Boundaries

**DUKADESK Platform Architecture — Service Boundaries**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-007 |
| Title | Service Boundaries |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Architecture |
| Depends On | KB-005, KB-006, KB-003 |
| Required By | KB-008, all backend specifications, all service implementations |
| Review Status | Not Reviewed |
| Last Updated | 2026-07-10 |

---

## 1. Purpose

This document formally defines the boundaries, ownership, responsibilities, and interaction rules of every architectural domain within DUKADESK. Its purpose is to ensure that each service, domain, and module has a clearly defined responsibility — preventing overlapping functionality, duplicated business logic, circular dependencies, and architectural drift.

**Service boundaries are logical, not physical.** A service as defined here is a bounded domain of ownership, not a deployable unit. Services may initially be implemented within a modular monolith and later extracted into independent deployable services without changing the architectural model defined in this document. What matters is ownership, not topology.

Every engineer, architect, and AI assistant must respect service boundaries. Writing business logic in the wrong domain, duplicating owned data, or creating hidden cross-service dependencies are architectural violations. This document is the authoritative reference for resolving ownership questions.

---

## 2. Boundary Principles

These principles govern all service boundaries in the DUKADESK platform. They are derived from the Platform Philosophy (KB-003) and apply regardless of deployment topology.

### 2.1 One Business Concept, One Owner

Every business concept has exactly one owning service. If two services need to reference the same concept, one service owns the canonical definition and the other references it by identifier only. No concept is co-owned.

**Rationale:** Shared ownership creates ambiguity, duplicated logic, and coordination overhead. When every concept has a single authoritative owner, there is never a question about which service is responsible for correctness, consistency, or lifecycle.

### 2.2 Every Service Owns Its Data

The service that owns a business concept also owns the data that represents it — including its schema, storage, lifecycle, integrity, and access control. No other service may write to that data directly. Reading across service boundaries is permitted through defined interfaces, but only the owning service enforces business rules for its data.

**Rationale:** Data ownership without enforcement is not ownership. The owning service must be the sole authority over its data's structure and content to maintain integrity.

### 2.3 Services Communicate Through Published Interfaces

All cross-service communication must go through the publishing service's public interface — its API, events, or webhooks. Direct database access across service boundaries is prohibited. Internal implementation details of one service must never leak into another service's logic.

**Rationale:** Published interfaces create a contract that can be versioned, tested, and evolved independently. Direct access creates hidden coupling that breaks when the owning service changes its internal implementation.

### 2.4 Services Expose Contracts, Not Implementation Details

A service's public interface defines what it does, not how it does it. Internal models, database schemas, caching strategies, and algorithm choices are implementation details that must not appear in API responses, event payloads, or shared libraries.

**Rationale:** Exposing implementation details creates downstream dependencies on those details. Changing an implementation becomes a breaking change for every consumer.

### 2.5 Shared Libraries Contain Utilities, Never Business Logic

Code shared across services must be generic utilities — validation helpers, type definitions for cross-cutting concerns, logging abstractions, HTTP client wrappers. Business logic, domain rules, and service-specific types must live in their owning service.

**Rationale:** Shared business logic quickly becomes an unowned, untested, ungoverned dependency that accumulates rules with no clear owner. It is the fastest path to a big ball of mud.

### 2.6 Cross-Service Communication Must Be Explicit and Documented

Every cross-service interaction — whether API call, event subscription, or webhook registration — must be documented in the consuming service's specification and the producing service's interface contract. Implicit or undocumented communication channels are not permitted.

**Rationale:** Undocumented dependencies are invisible dependencies. They are discovered only when they break.

### 2.7 Service Responsibilities Must Remain Cohesive

A service's responsibilities must form a cohesive set — they should belong together conceptually, change together, and make sense as a unit. If a service's responsibilities are difficult to describe concisely, it may be doing too much.

**Rationale:** Cohesive services are easier to understand, test, and evolve. Services with scattered responsibilities become god services that are difficult to maintain.

### 2.8 Changes Affecting Boundaries Require an ADR

Any change that alters a service boundary — moving ownership, modifying interfaces, splitting or merging services, changing communication patterns — requires an Architecture Decision Record (ADR) and governance approval. Implementation-level changes within a service boundary do not require an ADR.

**Rationale:** Service boundaries are the most stable architectural artifacts. Changing them has cascading effects across specifications, implementations, and alignment reviews.

---

## 3. Canonical Service Catalog

Each service in the DUKADESK platform has a well-defined boundary. The following catalog defines every service, its responsibilities, owned entities, business rules, interfaces, events, dependencies, and security responsibilities.

---

### 3.1 Identity Service

| Field | Value |
|-------|-------|
| **Purpose** | Manages who can access the platform and what they are authorized to do. |
| **Domain** | Identity |

#### Responsibilities

- Authenticate users across all platform surfaces.
- Authorize access to platform resources.
- Manage user accounts, profiles, and credentials.
- Manage organization structures and hierarchies.
- Manage roles and permissions.
- Manage sessions and tokens.
- Enforce multi-factor authentication.
- Integrate with external identity providers.
- Provision identity for new tenants and users.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| User | An individual who interacts with the platform |
| Organization | A legal or business entity that contracts with the platform |
| Role | A named collection of permissions |
| Permission | An atomic authorization grant |
| Session | An authenticated interaction context |
| AuthenticationMethod | A method of verifying identity (password, MFA, SSO) |
| IdentityProvider | An external identity provider configuration |

#### Owned Business Rules

- Password complexity and rotation policies.
- Session timeout and revocation rules.
- MFA enrollment and enforcement rules.
- Role hierarchy and inheritance rules.
- Permission evaluation logic.
- Organization hierarchy validation.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Authentication API | REST | Login, logout, token refresh, MFA challenge |
| Authorization API | REST | Permission checks, role queries |
| User Management API | REST | CRUD for users, profile management |
| Organization API | REST | CRUD for organizations, hierarchy management |
| Role API | REST | CRUD for roles, role assignment |
| Identity Events | Event | Published when identity state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `identity.user.created` | New user registered | userId, organizationId, timestamp |
| `identity.user.updated` | User profile changed | userId, changed fields |
| `identity.user.deleted` | User account removed | userId |
| `identity.user.authenticated` | User logged in | userId, sessionId, method |
| `identity.session.created` | New session established | sessionId, userId, expiresAt |
| `identity.session.expired` | Session timed out | sessionId, userId |
| `identity.session.revoked` | Session manually revoked | sessionId, userId, reason |
| `identity.role.assigned` | Role granted to user | userId, roleId, assignerId |
| `identity.role.revoked` | Role removed from user | userId, roleId, revokerId |
| `identity.organization.created` | New organization provisioned | organizationId, ownerId |
| `identity.organization.updated` | Organization configuration changed | organizationId, changed fields |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `platform.tenant.created` | Platform | Provision identity for new tenant |
| `platform.tenant.deactivated` | Platform | Deactivate tenant users and sessions |

#### Dependencies

- Infrastructure Layer (data storage for user records, tokens)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Password Hashing | All passwords must be hashed using a strong, salted algorithm |
| Token Issuance | Tokens must be signed and validateable without database lookup |
| Token Validation | Every authenticated request must be validated before processing |
| MFA Enforcement | MFA must be enforced for privileged operations |
| Session Management | Sessions must have configurable timeouts and be revocable |
| Brute Force Protection | Login attempts must be rate-limited and suspicious activity flagged |
| Credential Storage | Credentials must never be logged, exposed in APIs, or stored in plaintext |

#### Non-Responsibilities

- Identity Service does not store or manage tenant configuration.
- Identity Service does not define what capabilities a user can access — that is a combination of permissions and capability definitions.
- Identity Service does not manage end-user preferences or notification settings.

---

### 3.2 Platform Service

| Field | Value |
|-------|-------|
| **Purpose** | Manages the lifecycle of tenants, Desks, and Workspaces on the platform. |
| **Domain** | Platform |

#### Responsibilities

- Manage tenant lifecycle (provisioning, configuration, deactivation).
- Manage Desk lifecycle (creation, configuration, publishing, archiving).
- Manage Workspace lifecycle (authoring environments for Desks).
- Manage platform configuration and settings.
- Manage publishing workflows and environment promotion.
- Coordinate cross-cutting platform operations.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Tenant | An independent operational entity on the platform |
| Desk | A tenant's branded business application |
| Workspace | An authoring environment for a Desk |
| Configuration | Platform and tenant configuration settings |
| Publication | A versioned snapshot of a Desk configuration |
| Environment | A deployment target (development, staging, production) |
| PlatformSettings | Global platform configuration |

#### Owned Business Rules

- Tenant provisioning workflows.
- Desk publishing and promotion rules.
- Workspace access and collaboration rules.
- Environment promotion gates.
- Configuration validation and inheritance.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Tenant API | REST | Tenant lifecycle CRUD |
| Desk API | REST | Desk lifecycle CRUD |
| Workspace API | REST | Workspace management |
| Configuration API | REST | Platform and tenant configuration |
| Publishing API | REST | Publishing workflows |
| Platform Events | Event | Published when platform state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `platform.tenant.created` | New tenant provisioned | tenantId, organizationId, plan |
| `platform.tenant.updated` | Tenant configuration changed | tenantId, changed fields |
| `platform.tenant.deactivated` | Tenant deactivated | tenantId, reason |
| `platform.tenant.deleted` | Tenant removed | tenantId |
| `platform.desk.created` | New Desk created | deskId, tenantId, templateId |
| `platform.desk.published` | Desk configuration published | deskId, version, environment |
| `platform.desk.deployed` | Desk deployed to environment | deskId, version, environment |
| `platform.desk.archived` | Desk archived | deskId, reason |
| `platform.configuration.changed` | Configuration updated | context, changed fields |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `builder.desk.published` | Builder | Trigger deployment of published configuration |
| `identity.organization.created` | Identity | Provision tenant for new organization |

#### Dependencies

- Identity Service (tenant administrators, authorization)
- Infrastructure Layer (data storage)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Tenant Isolation | Enforce that no operation crosses tenant boundaries |
| Publishing Authorization | Only authorized users may publish or deploy |
| Configuration Integrity | Prevent unauthorized modification of configurations |

#### Non-Responsibilities

- Platform Service does not manage user authentication or authorization (Identity Service).
- Platform Service does not know what capabilities a Desk has enabled (Capability Service).
- Platform Service does not render Desks (Runtime Service).

---

### 3.3 Runtime Service

| Field | Value |
|-------|-------|
| **Purpose** | Provides the execution environment for Desks. Manages the lifecycle, state, configuration, and capability loading for every running Desk. |
| **Domain** | Runtime |

#### Responsibilities

- Manage Desk application lifecycle (initialize, start, suspend, resume, terminate).
- Load and resolve Manifests for active Desks.
- Initialize and manage capability instances for each Desk.
- Manage runtime state and state persistence.
- Handle error recovery and safe mode operation.
- Manage offline execution and synchronization.
- Provide runtime configuration to all Desk components.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Manifest | The resolved configuration for a Desk |
| RuntimeContext | The active execution context for a Desk |
| ApplicationState | The current state of a running Desk |
| CapabilityInstance | An initialized instance of a capability for a Desk |
| SessionState | The user-specific state within a Desk session |

#### Owned Business Rules

- Desk initialization sequence and dependency ordering.
- Capability activation rules.
- State persistence and restoration rules.
- Error recovery escalation policies.
- Offline data synchronization conflict resolution.
- Safe mode entry and exit criteria.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Runtime API | REST | Desk lifecycle management |
| Manifest API | REST | Manifest resolution and access |
| State API | REST | Application state access and mutation |
| Runtime Events | Event | Published when runtime state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `runtime.desk.initializing` | Desk starting initialization | deskId, tenantId |
| `runtime.desk.started` | Desk fully initialized and running | deskId, tenantId, capabilities |
| `runtime.desk.suspended` | Desk execution suspended | deskId, reason |
| `runtime.desk.resumed` | Desk execution resumed | deskId |
| `runtime.desk.terminated` | Desk execution ended | deskId, reason |
| `runtime.capability.loaded` | Capability initialized for Desk | deskId, capabilityId |
| `runtime.capability.failed` | Capability failed to load | deskId, capabilityId, error |
| `runtime.error.recovered` | Runtime error handled gracefully | deskId, error, recoveryAction |
| `runtime.state.saved` | Desk state persisted | deskId, timestamp |
| `runtime.state.restored` | Desk state restored after restart | deskId, timestamp |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `platform.desk.deployed` | Platform | Reload Desk configuration |
| `platform.desk.archived` | Platform | Terminate Desk execution |
| `capability.registered` | Capability | Make new capability available for loading |

#### Dependencies

- Platform Service (tenant and Desk configuration, manifests)
- Capability Service (capability definitions, dependency resolution)
- Infrastructure Layer (data storage for state, caching)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Desk Isolation | No Desk may access another Desk's runtime state, configuration, or data |
| Capability Authorization | Capabilities must be authorized before loading for a Desk |
| State Protection | Runtime state must be encrypted at rest and in transit |

#### Non-Responsibilities

- Runtime Service does not render UI (Renderer Service).
- Runtime Service does not implement business capabilities.
- Runtime Service does not manage user identity or sessions (Identity Service).

---

### 3.4 Renderer Service

| Field | Value |
|-------|-------|
| **Purpose** | Transforms screen definitions into interactive user interfaces across all surfaces. |
| **Domain** | Renderer |

#### Responsibilities

- Render screens from ScreenDefinition data.
- Register and resolve components through the Component Registry.
- Apply Theme definitions to all rendered surfaces.
- Render navigation structures from NavigationDefinition data.
- Execute Actions dispatched by user interactions.
- Manage layout composition and responsive adaptation.
- Support accessibility requirements.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| ScreenDefinition | The data definition for a screen |
| ComponentDefinition | The data definition for a component |
| LayoutDefinition | The data definition for a layout |
| NavigationDefinition | The data definition for navigation structure |
| ThemeDefinition | The complete visual identity definition |
| ActionDefinition | The definition of an executable interaction |

#### Owned Business Rules

- Component rendering order and lifecycle.
- Theme inheritance and override resolution.
- Navigation validation and state management.
- Action dispatch authorization.
- Layout calculation for responsive breakpoints.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Renderer API | REST | Screen rendering requests, component registration |
| Component Registry API | REST | Component type registration and discovery |
| Theme API | REST | Theme resolution and application |
| Renderer Events | Event | Published when rendering state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `renderer.screen.rendered` | Screen rendered to user | screenId, deskId, tenantId |
| `renderer.component.rendered` | Component rendered | componentType, screenId |
| `renderer.action.dispatched` | Action dispatched by user | actionType, screenId, componentKey |
| `renderer.navigation.changed` | User navigated | fromScreen, toScreen, method |
| `renderer.error.rendering` | Rendering error occurred | screenId, componentType, error |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `runtime.capability.loaded` | Runtime | Register capability-specific components |

#### Dependencies

- Runtime Service (screen definitions, runtime context)
- Infrastructure Layer (component registrations, theme data)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Action Authorization | Actions dispatched by users must be validated against the user's authorization context |
| Data Sanitization | User-generated content rendered through components must be sanitized |
| Theme Integrity | Theme definitions must be validated before application |

#### Non-Responsibilities

- Renderer Service does not implement business logic.
- Renderer Service does not manage data persistence.
- Renderer Service does not contain surface-specific code — surface adaptations are handled by surface-specific renderer implementations.

---

### 3.5 Builder Service

| Field | Value |
|-------|-------|
| **Purpose** | Provides the authoring environment for Desk creation and configuration. |
| **Domain** | Builder |

#### Responsibilities

- Manage Desk blueprint authoring and versioning.
- Provide screen design tools.
- Provide form design tools.
- Provide workflow design tools.
- Generate Manifest definitions from visual compositions.
- Manage the publishing pipeline.
- Integrate with the Marketplace for templates and extensions.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| DeskBlueprint | The authored design of a Desk |
| ScreenDesign | A designed screen within a Desk |
| WorkflowDefinition | A defined business workflow |
| FormDefinition | A designed data collection form |
| ThemeDefinition | An authored visual theme |
| PublishedVersion | A published version of a Desk configuration |

#### Owned Business Rules

- Design validation rules (screen structure, component compatibility).
- Publishing workflow rules.
- Version naming and lifecycle rules.
- Template instantiation rules.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Builder API | REST | Desk authoring CRUD |
| Publishing API | REST | Publishing workflows |
| Version API | REST | Version management |
| Template API | REST | Template discovery and instantiation |
| Builder Events | Event | Published when authoring state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `builder.desk.drafted` | Desk design modified | deskId, version |
| `builder.desk.published` | Desk published | deskId, version, environment |
| `builder.version.created` | New version created | deskId, version, parentVersion |
| `builder.template.instantiated` | Template used to create Desk | deskId, templateId |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `capability.registered` | Capability | Make new capability available in builder |
| `marketplace.item.installed` | Marketplace | Make installed extension available in builder |
| `platform.tenant.created` | Platform | Provision new workspace for tenant |

#### Dependencies

- Platform Service (tenant, Desk context)
- Capability Service (available capability definitions)
- Infrastructure Layer (design data storage, asset storage)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Publishing Authorization | Only authorized users may publish Desk configurations |
| Design Integrity | Prevent concurrent edit conflicts |
| Template Validation | Validate templates before making them available |

#### Non-Responsibilities

- Builder Service does not render Desks at runtime.
- Builder Service does not execute business logic for commerce or booking.
- Builder Service does not manage tenant billing or subscription.

---

### 3.6 Capability Service

| Field | Value |
|-------|-------|
| **Purpose** | Defines, registers, and manages platform capabilities — the units of business functionality that Desks can enable. |
| **Domain** | Capability |

#### Responsibilities

- Maintain the capability registry.
- Manage capability lifecycle (register, version, deprecate, remove).
- Support capability discovery and metadata querying.
- Resolve capability dependencies.
- Define capability permission requirements.
- Integration with the Marketplace for third-party capabilities.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Capability | A registered platform capability |
| CapabilityDefinition | The metadata and contract defining a capability |
| CapabilityVersion | A versioned snapshot of a capability definition |
| CapabilityDependency | A declared dependency between capabilities |
| CapabilityPermission | A permission required by a capability |

#### Owned Business Rules

- Dependency resolution and cycle detection.
- Version compatibility rules.
- Capability deprecation policies.
- Permission requirement validation.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Capability Registry API | REST | Capability registration and management |
| Capability Discovery API | REST | Capability querying and metadata |
| Capability Lifecycle API | REST | Version management, deprecation |
| Capability Events | Event | Published when capability state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `capability.registered` | New capability registered | capabilityId, version, domain |
| `capability.updated` | Capability definition updated | capabilityId, version, changed fields |
| `capability.deprecated` | Capability marked deprecated | capabilityId, deprecationDate, replacement |
| `capability.removed` | Capability removed from registry | capabilityId, reason |
| `capability.dependency.resolved` | Dependency resolution completed | capabilityId, resolvedDependencies |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| Domain-level events | All domains | React to domain state changes affecting capability availability |

#### Dependencies

- All business domains (capability definitions are owned by their respective domains)
- Infrastructure Layer (capability registry storage, caching)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Permission Validation | Capabilities must declare required permissions |
| Dependency Integrity | Prevent circular or broken dependency chains |

#### Non-Responsibilities

- Capability Service does not implement business logic for any capability.
- Capability Service does not manage which capabilities a specific Desk has enabled (Platform Service owns Desk configuration).

---

### 3.7 Commerce Service

| Field | Value |
|-------|-------|
| **Purpose** | Provides commerce capabilities to Desks — catalog, cart, checkout, orders, payments, and related functions. |
| **Domain** | Commerce |

#### Responsibilities

- Manage product and service catalogs.
- Track inventory levels and availability.
- Manage shopping cart lifecycle.
- Process checkout flows.
- Apply coupons and promotions.
- Manage order lifecycle (creation, confirmation, fulfillment, delivery).
- Orchestrate payment processing through third-party providers.
- Process refunds and cancellations.
- Generate invoices and receipts.
- Manage delivery and shipping configuration.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Product | A sellable item in a catalog |
| Catalog | A collection of products |
| Category | A grouping of products |
| InventoryItem | A tracked quantity of a product |
| Cart | A user's pending selections |
| CartItem | An item in a cart |
| Order | A completed purchase record |
| OrderItem | An item in an order |
| Payment | A payment transaction record |
| PaymentTransaction | A raw transaction from a payment provider |
| Invoice | A billing document |
| Refund | A refund transaction |
| Coupon | A promotional discount |
| Delivery | A delivery configuration |
| Shipment | A fulfillment shipment |

#### Owned Business Rules

- Pricing calculations (base price, discounts, taxes).
- Inventory reservation and decrement logic.
- Cart merge rules (for cross-device synchronization).
- Checkout validation (address, payment, inventory).
- Coupon applicability and stackability rules.
- Order state machine (pending → confirmed → shipped → delivered → cancelled).
- Refund eligibility and calculation rules.
- Payment orchestration and idempotency.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Catalog API | REST | Product and catalog management |
| Cart API | REST | Cart operations |
| Checkout API | REST | Checkout flow |
| Order API | REST | Order management |
| Payment API | REST | Payment orchestration |
| Coupon API | REST | Coupon management |
| Inventory API | REST | Inventory queries and updates |
| Delivery API | REST | Delivery configuration |
| Commerce Events | Event | Published when commerce state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `commerce.product.created` | New product added | productId, catalogId, tenantId |
| `commerce.product.updated` | Product details changed | productId, changed fields |
| `commerce.product.deleted` | Product removed | productId |
| `commerce.inventory.changed` | Inventory level changed | productId, oldLevel, newLevel |
| `commerce.cart.updated` | Cart modified | cartId, userId, itemCount |
| `commerce.checkout.started` | Checkout initiated | cartId, userId |
| `commerce.order.created` | Order created | orderId, tenantId, total |
| `commerce.order.confirmed` | Order confirmed | orderId, confirmedAt |
| `commerce.order.shipped` | Order shipped | orderId, shipmentId, carrier |
| `commerce.order.delivered` | Order delivered | orderId, deliveredAt |
| `commerce.order.cancelled` | Order cancelled | orderId, reason |
| `commerce.payment.received` | Payment completed | orderId, paymentId, amount |
| `commerce.payment.failed` | Payment failed | orderId, paymentId, reason |
| `commerce.refund.issued` | Refund processed | orderId, refundId, amount |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `identity.user.created` | Identity | Provision customer profile for commerce |
| `identity.user.authenticated` | Identity | Restore cart from anonymous to identified user |

#### Dependencies

- Identity Service (customer identity, authorization)
- Notification Service (order confirmations, shipping updates)
- Integration Service (payment providers, shipping providers)
- Infrastructure Layer (data storage, message queues)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Payment Data Isolation | Payment data must never be stored in the platform — delegate to PCI-compliant providers |
| Tenant Isolation | All commerce data is scoped by tenant |
| Order Integrity | Orders are immutable once created |
| Idempotency | Payment orchestration must be idempotent to prevent double charges |

#### Non-Responsibilities

- Commerce Service does not process payments directly (delegated to third-party providers).
- Commerce Service does not manage booking or appointments (Booking Service).
- Commerce Service does not send notifications (Notification Service).

---

### 3.8 Booking Service

| Field | Value |
|-------|-------|
| **Purpose** | Provides booking and scheduling capabilities to Desks. |
| **Domain** | Booking |

#### Responsibilities

- Manage appointment scheduling.
- Calculate and expose availability.
- Manage resource allocation.
- Handle reservation lifecycle (create, confirm, reschedule, cancel).
- Support recurring booking patterns.
- Integrate with external calendars.
- Manage booking reminders.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Appointment | A scheduled appointment |
| Schedule | A defined schedule of available times |
| Resource | A bookable resource (staff, room, equipment) |
| Availability | Calculated availability for a time range |
| Reservation | A held but not confirmed booking |
| RecurringPattern | A pattern for recurring appointments |
| Calendar | A tenant's booking calendar |
| TimeSlot | An available time slot |

#### Owned Business Rules

- Availability calculation logic.
- Booking conflict detection.
- Rescheduling rules and constraints.
- Cancellation policies and windows.
- Recurring pattern expansion logic.
- Resource allocation and overbooking prevention.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Booking API | REST | Appointment CRUD |
| Schedule API | REST | Schedule management |
| Availability API | REST | Availability queries |
| Resource API | REST | Resource management |
| Calendar API | REST | Calendar integration |
| Booking Events | Event | Published when booking state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `booking.appointment.created` | New appointment booked | appointmentId, tenantId, time, resourceId |
| `booking.appointment.confirmed` | Appointment confirmed | appointmentId, confirmedAt |
| `booking.appointment.cancelled` | Appointment cancelled | appointmentId, reason |
| `booking.appointment.rescheduled` | Appointment rescheduled | appointmentId, oldTime, newTime |
| `booking.availability.changed` | Schedule availability updated | resourceId, dateRange |
| `booking.reminder.sent` | Appointment reminder delivered | appointmentId, channel |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `commerce.order.created` | Commerce | Link booking to order for payment |
| `platform.tenant.updated` | Platform | Update business hours and scheduling rules |
| `identity.user.created` | Identity | Create customer profile for bookings |

#### Dependencies

- Identity Service (customer identity)
- Commerce Service (booking payment integration)
- Notification Service (reminders, confirmations)
- Infrastructure Layer (data storage, message queues)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Tenant Isolation | Booking data is scoped by tenant |
| Privacy | Customer booking data must respect privacy requirements |

#### Non-Responsibilities

- Booking Service does not process payments (Commerce Service).
- Booking Service does not manage product catalogs (Commerce Service).
- Booking Service does not send notifications (Notification Service).

---

### 3.9 Notification Service

| Field | Value |
|-------|-------|
| **Purpose** | Manages all communication with users across channels — in-app, push, email, SMS. |
| **Domain** | Notification |

#### Responsibilities

- Manage notification templates.
- Orchestrate multi-channel delivery.
- Manage user notification preferences.
- Track delivery status and receipts.
- Handle channel-specific provider integration.
- Support in-app notification rendering.
- Manage notification subscriptions.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Notification | A specific notification message |
| Template | A reusable notification content template |
| Channel | A delivery channel (push, email, SMS, in-app) |
| Subscription | A user's subscription to a notification type |
| Preference | A user's notification channel preferences |
| DeliveryReceipt | A record of successful or failed delivery |

#### Owned Business Rules

- Template rendering and variable substitution.
- Channel selection and fallback logic.
- Preference evaluation and filtering.
- Delivery retry and backoff policies.
- Rate limiting per channel and per user.
- Unsubscribe handling and compliance.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Notification API | REST | Send notifications, query history |
| Template API | REST | Template management |
| Subscription API | REST | Subscription management |
| Preference API | REST | User preference management |
| Notification Events | Event | Published when notification state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `notification.sent` | Notification submitted for delivery | notificationId, channel, recipient |
| `notification.delivered` | Notification confirmed delivered | notificationId, channel, timestamp |
| `notification.failed` | Notification delivery failed | notificationId, channel, error |
| `notification.preferences.updated` | User changed preferences | userId, changedChannels |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| `commerce.order.created` | Commerce | Send order confirmation |
| `commerce.order.shipped` | Commerce | Send shipping update |
| `booking.appointment.confirmed` | Booking | Send confirmation notification |
| `booking.appointment.reminder` | Booking | Send appointment reminder |
| `platform.tenant.updated` | Platform | Send tenant notifications |
| `identity.user.created` | Identity | Send welcome notification |

#### Dependencies

- Identity Service (user identity, contact information)
- Integration Service (provider integrations for push, email, SMS)
- Infrastructure Layer (message queues, template storage)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Content Privacy | Notification content may contain sensitive information |
| Preference Enforcement | Channel delivery must respect user opt-out preferences |
| Compliance | Unsubscribe mechanisms must comply with regulations |

#### Non-Responsibilities

- Notification Service does not manage payment notifications (Commerce Service).
- Notification Service does not generate analytics reports.
- Notification Service does not manage in-app notification UI rendering (Renderer Service).

---

### 3.10 Integration Service

| Field | Value |
|-------|-------|
| **Purpose** | Manages integrations between the platform and external systems — including webhooks, connectors, SDK endpoints, and data synchronization. |
| **Domain** | Integration |

#### Responsibilities

- Manage external API gateway for third-party integrations.
- Manage webhook registration, delivery, and retry.
- Manage connectors to external services.
- Manage import and export pipelines.
- Handle data transformation between platform and external formats.
- Maintain SDK endpoints for third-party developers.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Integration | A configured integration with an external system |
| Webhook | A webhook registration for event delivery |
| Connector | A pre-built connector for a specific external service |
| Plugin | A platform extension registered through integration |
| Extension | A third-party add-on distributed through the Marketplace |
| ImportJob | A data import pipeline |
| ExportJob | A data export pipeline |
| DataMapping | A transformation mapping between data formats |

#### Owned Business Rules

- Webhook delivery and retry policies.
- Connector authentication and credential management.
- Import/export validation rules.
- Rate limiting for external API calls.
- Plugin lifecycle and compatibility rules.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Integration API | REST | Integration CRUD and configuration |
| Webhook API | REST | Webhook registration and management |
| Plugin API | REST | Plugin lifecycle management |
| Import API | REST | Import pipeline management |
| Export API | REST | Export pipeline management |
| Integration Events | Event | Published when integration state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `integration.webhook.triggered` | Webhook delivered to external system | webhookId, eventType, status |
| `integration.import.completed` | Import job finished | jobId, recordCount, status |
| `integration.export.completed` | Export job finished | jobId, recordCount, format |
| `integration.connector.registered` | New connector added | connectorId, provider |
| `integration.connector.error` | Connector error | connectorId, error |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| Platform events (all domains) | All domains | Trigger webhooks for external delivery |
| `commerce.payment.received` | Commerce | Sync payment data to external accounting |
| `identity.user.created` | Identity | Sync user to external CRM |

#### Dependencies

- All business domains (integration definitions reference domain concepts)
- Identity Service (API authentication for external access)
- Infrastructure Layer (webhook storage, message queues)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Credential Encryption | External API credentials must be encrypted at rest |
| Webhook Authentication | Webhook delivery must be verifiable by recipients |
| Import/Export Validation | All imported data must be validated before acceptance |
| Rate Limiting | External API call rates must be limited to prevent abuse |

#### Non-Responsibilities

- Integration Service does not implement business logic from other domains.
- Integration Service does not manage the Marketplace catalog (Marketplace).
- Integration Service does not render UI for integration configuration (Renderer Service).

---

### 3.11 Analytics Service

| Field | Value |
|-------|-------|
| **Purpose** | Collects, processes, and exposes platform metrics, reporting, and insights. |
| **Domain** | Analytics |

#### Responsibilities

- Collect and aggregate platform metrics.
- Generate operational reports.
- Maintain audit logs for all state-changing operations.
- Monitor platform health and performance.
- Provide business intelligence data to dashboards.
- Detect anomalies and threshold violations.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| Metric | A collected data point |
| Report | A generated report definition and output |
| Dashboard | A configured analytics dashboard |
| AuditEvent | An immutable record of a state-changing operation |
| AnalyticsEvent | A collected behavioral event |
| PlatformHealthIndicator | A platform health metric |
| Insight | A generated analytical insight |

#### Owned Business Rules

- Metric aggregation windows and rollup policies.
- Report scheduling and distribution rules.
- Audit log retention and archival policies.
- Anomaly detection thresholds.
- Data retention and privacy policies.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Analytics API | REST | Metrics and insights querying |
| Reporting API | REST | Report generation and management |
| Audit API | REST | Audit log querying |
| Health API | REST | Platform health status |
| Analytics Events | Event | Published when analytical state changes |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `analytics.report.generated` | Report completed | reportId, type, period |
| `analytics.anomaly.detected` | Anomaly in metrics | metric, value, threshold |
| `analytics.threshold.exceeded` | Platform health threshold breached | indicator, value, threshold |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| All domain events | All domains | Collect metrics and audit trails |
| All runtime events | Runtime | Collect platform health data |

#### Dependencies

- All domains (analytics consumes from every domain)
- Infrastructure Layer (time-series storage, log storage, data warehouse)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Data Privacy | Analytics data may contain sensitive business information |
| Access Control | Analytics access must be role-gated |
| Audit Immutability | Audit logs must be immutable once written |

#### Non-Responsibilities

- Analytics Service does not manage commerce data (Commerce Service).
- Analytics Service does not manage user identity (Identity Service).
- Analytics Service does not configure or manage Desks (Platform Service).

---

### 3.12 Documentation Service

| Field | Value |
|-------|-------|
| **Purpose** | Provides the tooling and documentation that enables development on the DUKADESK platform. |
| **Domain** | Developer Experience |

#### Responsibilities

- Maintain the Knowledge Base.
- Generate developer documentation from verified specifications.
- Develop and maintain SDKs.
- Develop and maintain the CLI.
- Create and maintain examples and templates.
- Provide testing utilities for extension developers.
- Manage the developer portal.

#### Owned Entities

| Entity | Description |
|--------|-------------|
| KnowledgeBase | The authoritative engineering reference |
| Documentation | Generated developer documentation |
| SDK | Software Development Kit for a specific language |
| CLI | Command-line interface tool |
| Template | A starter template for development |
| ExampleProject | A reference implementation |
| TestingUtility | A tool for testing extensions |

#### Owned Business Rules

- Documentation generation and publication workflows.
- SDK release and versioning policies.
- CLI command naming and structure conventions.
- Template quality and review standards.

#### Public Interfaces

| Interface | Type | Purpose |
|-----------|------|---------|
| Developer Portal API | REST | Documentation access and search |
| SDK packages | Package | Language-specific libraries |
| CLI commands | CLI | Platform interaction tooling |

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `dx.documentation.updated` | Documentation changed | section, version |
| `dx.sdk.released` | New SDK version published | sdk, language, version |
| `dx.cli.updated` | CLI updated | version, changes |

#### Events Consumed

| Event | Producer | Purpose |
|-------|----------|---------|
| Domain-level API changes | All domains | Trigger documentation and SDK updates |

#### Dependencies

- All domains (documentation and SDKs reflect all domain APIs)
- Infrastructure Layer (documentation storage, CDN)

#### Security Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Sensitive Information | Documentation must not expose internal platform credentials or secrets |
| Accuracy | Documentation must reflect verified specifications |

#### Non-Responsibilities

- Documentation Service does not implement any business capability.
- Documentation Service does not manage the Marketplace catalog.
- Documentation Service does not enforce platform governance.

---

## 4. Ownership Matrix

Every business concept in the DUKADESK platform has exactly one owning service. This matrix is the authoritative reference for ownership.

| Business Concept | Owning Service |
|-----------------|----------------|
| User | Identity |
| Organization | Identity |
| Role | Identity |
| Permission | Identity |
| Session | Identity |
| Authentication Method | Identity |
| Identity Provider | Identity |
| Tenant | Platform |
| Desk | Platform |
| Workspace | Platform |
| Configuration | Platform |
| Publication | Platform |
| Environment | Platform |
| Manifest | Runtime |
| Runtime Context | Runtime |
| Application State | Runtime |
| Capability Instance | Runtime |
| Session State | Runtime |
| Screen Definition | Renderer |
| Component Definition | Renderer |
| Layout Definition | Renderer |
| Navigation Definition | Renderer |
| Theme Definition | Renderer (via Builder for authoring) |
| Action Definition | Renderer |
| Desk Blueprint | Builder |
| Screen Design | Builder |
| Workflow Definition | Builder |
| Form Definition | Builder |
| Published Version | Builder |
| Capability | Capability |
| Capability Version | Capability |
| Capability Dependency | Capability |
| Product | Commerce |
| Catalog | Commerce |
| Category | Commerce |
| Inventory Item | Commerce |
| Cart | Commerce |
| Cart Item | Commerce |
| Order | Commerce |
| Order Item | Commerce |
| Payment | Commerce |
| Payment Transaction | Commerce |
| Invoice | Commerce |
| Refund | Commerce |
| Coupon | Commerce |
| Delivery | Commerce |
| Shipment | Commerce |
| Appointment | Booking |
| Schedule | Booking |
| Resource | Booking |
| Availability | Booking |
| Reservation | Booking |
| Recurring Pattern | Booking |
| Calendar | Booking |
| Time Slot | Booking |
| Notification | Notification |
| Template | Notification |
| Channel | Notification |
| Subscription | Notification |
| Preference | Notification |
| Delivery Receipt | Notification |
| Integration | Integration |
| Webhook | Integration |
| Connector | Integration |
| Plugin | Integration |
| Extension | Integration |
| Import Job | Integration |
| Export Job | Integration |
| Data Mapping | Integration |
| Metric | Analytics |
| Report | Analytics |
| Audit Event | Analytics |
| Analytics Event | Analytics |
| Platform Health Indicator | Analytics |
| Insight | Analytics |
| Knowledge Base | Documentation |
| SDK | Documentation |
| CLI | Documentation |

---

## 5. Communication Rules

### 5.1 Communication Patterns

| Pattern | Type | Latency | Guarantees | When to Use |
|---------|------|---------|------------|-------------|
| **REST API** | Synchronous | Low | At-most-once | CRUD operations, queries, commands requiring immediate confirmation |
| **Events** | Asynchronous | Variable | At-least-once | State change notifications, cross-domain communication |
| **Message Queues** | Asynchronous | Variable | Exactly-once (per queue config) | Reliable processing, retry guarantees, ordered delivery |
| **Webhooks** | Asynchronous | Variable | At-least-once with retry | Notifying external systems of platform events |
| **Internal Service Calls** | Synchronous | Low | At-most-once | Service-to-service queries within the same deployment boundary |
| **Scheduled Jobs** | Asynchronous | Scheduled | Best-effort | Periodic processing, batch operations, cleanup |

### 5.2 Pattern Selection Guide

```text
Does the consumer need an immediate response?
    ├── Yes → REST API or Internal Service Call
    └── No  → Is the consumer an external system?
                ├── Yes → Webhook
                └── No  → Event (via Event Bus or Queue)

Does the work need guaranteed processing?
    ├── Yes → Message Queue
    └── No  → Event (via Event Bus)

Is this periodic or batch?
    └── Yes → Scheduled Job
```

### 5.3 Prohibited Communication Patterns

| Pattern | Why It Is Prohibited |
|---------|---------------------|
| **Direct Database Access** | Creates hidden coupling, bypasses business logic and authorization |
| **Shared Database** | Breaks data ownership, creates implicit dependencies |
| **Shared In-Memory State** | Creates invisible coupling that breaks in distributed deployments |
| **File-Based Integration** | Fragile, unscalable, no contract enforcement |
| **Internal Model Leakage** | Exposing internal types through public interfaces creates downstream coupling |

---

## 6. Data Ownership Rules

### 6.1 Write Access

Only the owning service may write to the data stores that contain its entities. No other service may create, update, or delete data owned by another service.

**Exception:** The Analytics Service may write audit events that reference entities from other domains, because audit events are metadata about state changes, not authoritative state.

### 6.2 Read Access

Any service may read data owned by another service through that service's published interface (API, event, or query endpoint). Direct read access to another service's database is prohibited.

Read access to owned data through APIs must:

- Authenticate the requesting service.
- Authorize the specific read operation.
- Scope the read to the requesting tenant (if applicable).
- Return only the data the requesting service is authorized to see.

### 6.3 Caching Rules

Services may cache data read from other services, subject to the following rules:

| Rule | Description |
|------|-------------|
| **Cache with TTL** | Cached data must have a time-to-live appropriate to its freshness requirements |
| **Event-Driven Invalidation** | Services should subscribe to update events from the owning service to invalidate cached data |
| **No Stale Writes** | Cached data must never be used as the source of truth for write operations |
| **Tenant Scoping** | Cache keys must include tenant ID to prevent cross-tenant data leaks |

### 6.4 Data Lifecycle

| Phase | Responsible Service | Notes |
|-------|--------------------|-------|
| **Creation** | Owning service | Only the owner may create instances of its entities |
| **Reading** | Any authorized service | Through the owning service's published interface |
| **Updating** | Owning service | Only the owner may mutate its entities |
| **Deletion** | Owning service | Only the owner may delete its entities (soft delete recommended) |
| **Archiving** | Owning service | The owner determines archival policy |
| **Auditing** | Analytics Service | Audit events are created by the Analytics Service for all state changes |

---

## 7. Dependency Rules

### 7.1 Allowed Dependency Direction

```text
Experience Layer
      │
      ▼
Presentation Layer
      │
      ▼
   Runtime Layer
      │
      ▼
Capability Layer
      │
      ▼
   Service Layer
      │
      ▼
   Domain Layer
      │
      ▼
Infrastructure Layer
```

Services within the same layer may communicate through events and APIs but must never depend on each other's internal implementation.

### 7.2 Forbidden Dependencies

| Dependency | Why It Is Forbidden |
|------------|---------------------|
| **Commerce → Booking internals** | Breaks domain isolation. Commerce may reference Booking through Booking's published API only |
| **Identity → Notification internals** | Identity must never depend on Notification implementation details |
| **Builder → Runtime state** | Builder must not directly manipulate Runtime state. It publishes configurations that the Runtime consumes |
| **Renderer → Business logic** | Renderer must never implement business rules. It delegates to the Runtime and Services |
| **Surface → Direct Service access** | Surfaces must never access services directly. They go through the Runtime and API Gateway |
| **Service → Shared database** | Services must never share databases. Each service owns its persistence |

### 7.3 Dependency Cycles

Circular dependencies between services are prohibited. If two services appear to need circular communication, the interaction must be redesigned using events or a third coordinating service.

**Detection:** Dependency cycles are detected during architecture review. The service catalog in this document must be checked for cycles whenever new services are added or boundaries change.

---

## 8. Shared Components

### 8.1 What Belongs in Shared Libraries

| Category | Examples | Owner |
|----------|----------|-------|
| **Infrastructure Abstractions** | HTTP client wrappers, database connection helpers, cache interfaces | Infrastructure |
| **Validation Helpers** | Email validation, phone formatting, ID validation | Infrastructure |
| **Common Types** | Pagination types, error types, tenant ID type | Infrastructure |
| **Logging** | Structured logging interface and helpers | Infrastructure |
| **Serialization** | JSON serialization helpers, date formatting | Infrastructure |
| **Error Handling** | Standard error types, error response formatting | Infrastructure |

### 8.2 What Must Never Be in Shared Libraries

| Category | Why |
|----------|-----|
| **Business Rules** | Business rules belong in the owning service, not in shared code |
| **Domain Models** | Domain entities belong in their owning service |
| **Service-Specific Types** | Types used by only one service must not be in shared libraries |
| **Configuration** | Application configuration is per-service, not shared |

---

## 9. Evolution Strategy

### 9.1 When to Create a New Service

A new service should be created when:

1. **A distinct business concept emerges** that does not fit within an existing service's responsibilities.
2. **An existing service's responsibilities become non-cohesive** — it is doing too many unrelated things.
3. **Independent scaling is required** — parts of an existing service need different scaling characteristics.
4. **Independent deployment is required** — parts of an existing service need different release cadences.
5. **A clear boundary emerges** from domain analysis that was not anticipated in the original design.

### 9.2 Process for Introducing a New Service

```
Domain Analysis → Boundary Review → ADR → Ownership Definition → Interface Specification → Alignment Review → Implementation
```

1. **Domain Analysis:** Analyze the business concepts and identify the natural boundaries.
2. **Boundary Review:** Review the proposed boundary against existing services to ensure no overlap.
3. **ADR:** Write an Architecture Decision Record documenting the new service, its responsibilities, owned entities, interfaces, and dependencies.
4. **Ownership Definition:** Update the ownership matrix in this document.
5. **Interface Specification:** Define the new service's public interfaces (APIs, events, webhooks).
6. **Alignment Review:** Review the new service against the Knowledge Base.
7. **Implementation:** Implement the service following the verified specification.

### 9.3 When to Extend an Existing Service

Extending an existing service is preferred when:

- The new functionality is cohesive with the service's existing responsibilities.
- The new functionality does not introduce conflicting ownership.
- The new functionality does not require different scaling or deployment characteristics.

### 9.4 Service Splitting

A service may be split into two or more services when its responsibilities have grown beyond cohesion. The split must follow the same governance process as new service creation.

---

## 10. Anti-Patterns

| Anti-Pattern | Description | Why It Is Discouraged |
|--------------|-------------|----------------------|
| **Shared Database** | Multiple services reading and writing the same database | Creates implicit coupling, no ownership, no contract enforcement, fragile |
| **Duplicate Business Logic** | The same business logic implemented in multiple services | Drifts over time, creates inconsistent behavior, increases testing burden |
| **Circular Dependencies** | Service A depends on Service B which depends on Service A | Impossible to deploy or test independently, creates cascading failures |
| **Cross-Service Writes** | One service writes to another service's data store | Breaks ownership, bypasses business rules and authorization |
| **Leaking Internal Models** | Exposing database schemas or internal types through APIs | Creates downstream coupling to implementation details |
| **God Service** | A service that accumulates too many unrelated responsibilities | Hard to maintain, test, deploy, or reason about |
| **Chatty APIs** | APIs that require many round trips to accomplish a single operation | Poor performance, increased latency, complex client logic |
| **Hidden Dependencies** | Implicit dependencies between services not documented in interfaces | Discovered only when they break, no governance |
| **Implicit Ownership** | Business logic for a concept living outside its owning service | Creates ambiguity about which service is authoritative |
| **Domain Leakage** | A service implementing logic that clearly belongs in another domain | Blurs boundaries, makes future extraction harder |

---

## 11. Alignment with Platform Philosophy

The service boundaries defined in this document realize the principles established in KB-003 (Platform Philosophy).

| Principle | How Service Boundaries Support It |
|-----------|-----------------------------------|
| **Capability First** | Each service owns a cohesive set of capabilities. Capabilities map to services. The capability registry manages capability lifecycle independently of service implementation. |
| **API First** | Every service exposes its capabilities through well-defined APIs. Internal consumers use the same APIs as external consumers. APIs are the contract layer between services. |
| **Multi-Tenant First** | Every service enforces tenant isolation at the data layer. Data ownership rules ensure that cross-tenant access is prevented at every service boundary. |
| **Event Driven** | Services communicate primarily through events. State changes in one service are propagated to interested services through event publication and consumption. |
| **Runtime Before Presentation** | Business logic lives in the Domain Layer services. The Renderer and Experience Layer surfaces contain no business logic — they delegate to the Runtime and Services. |
| **Extensibility First** | The Integration Service manages extension points. The Capability Service allows new capabilities to be registered without core changes. Service interfaces are designed for third-party consumption. |

---

## 12. Relationship to Other Knowledge Base Documents

```
KB-005 (Platform Overview)
    │  Conceptual introduction to the platform.
    │  Read this first.
    ▼
KB-006 (System Architecture)
    │  Architectural domains, layers, communication patterns.
    │  The blueprint this document formalizes.
    ▼
KB-007 (Service Boundaries) ← You are here
    │  Service ownership, data ownership, communication rules.
    │  The authoritative reference for who owns what.
    │
    ├──► KB-008 (Runtime Overview)
    │       Deep dive into the Runtime Service.
    │       Runtime lifecycle, state management, offline execution.
    │
    ├──► KB-010 (Capability System)
    │       Capability lifecycle and ownership.
    │       Capability boundaries must respect service boundaries.
    │
    ├──► KB-013 (API Standards)
    │       API design conventions that all services must follow.
    │       Ensures consistency across service interfaces.
    │
    ├──► KB-014 (Database Standards)
    │       Data storage conventions per service.
    │       Enforces data ownership and isolation.
    │
    ├──► Backend Specification
    │       Concrete service implementations.
    │       Each service section in the spec references this document.
    │
    ├──► All Specifications
    │       Every specification must respect service boundaries.
    │       A spec that crosses a boundary without governance is misaligned.
    │
    └──► Alignment Reviews
            Verify that implementations respect service boundaries.
            Findings include boundary violations.
```

---

## 13. Review Checklist

- [ ] Metadata header: KB-ID, Version, Status, Owner, Review Status, Last Updated, Depends On, Required By
- [ ] Purpose section explains why service boundaries exist
- [ ] Boundary Principles define clear rules for all services
- [ ] Every service in the canonical catalog includes Purpose, Responsibilities, Owned Entities, Business Rules, Interfaces, Events, Dependencies, Security Responsibilities, and Non-Responsibilities
- [ ] Ownership Matrix covers every business concept with exactly one owner
- [ ] Communication Rules define allowed and prohibited patterns
- [ ] Data Ownership Rules define write, read, caching, and lifecycle rules
- [ ] Dependency Rules define allowed and forbidden dependencies
- [ ] Shared Components section clarifies what belongs in shared libraries
- [ ] Evolution Strategy defines when and how to create or split services
- [ ] Anti-Patterns identifies discouraged practices with rationale
- [ ] Alignment with Platform Philosophy references KB-003
- [ ] Relationship to other KB documents is clearly explained
- [ ] Mermaid diagrams are included as specified
- [ ] No technology-specific references
- [ ] All cross-references use canonical IDs
- [ ] No internal contradictions
- [ ] No contradictions with KB-003, KB-005, or KB-006

---

## 14. Revision History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 0.1.0 | 2026-07-10 | Architecture | Initial service boundaries document |

---

*KB-007 (Service Boundaries) — The authoritative reference for service ownership, data ownership, and communication rules. Every backend specification, service implementation, and alignment review references this document. It prevents duplicated business logic, circular dependencies, and ownership confusion across the entire DUKADESK platform.*
