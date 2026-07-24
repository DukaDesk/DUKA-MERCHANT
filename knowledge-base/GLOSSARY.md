# DUKADESK Platform Terminology & Glossary

**KB-002 — Part I: Foundation | Platform Terminology & Glossary**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-002 |
| Title | Platform Terminology & Glossary |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Engineering |
| Review Status | Not Reviewed |
| Last Updated | 2026-07-09 |
| Depends On | KB-001, KB-003 |
| Required By | All KB documents, all specifications, all implementations |

---

## 1. Purpose

Standardized terminology is the foundation of architectural consistency. Every specification, implementation, review, and AI-generated artifact in the DUKADESK ecosystem depends on shared language. When terms are used inconsistently, architectural drift follows.

This document establishes the official vocabulary of the DUKADESK platform. It is the single source of truth for platform language. No specification, implementation, or documentation may redefine terminology established here without an approved Architecture Decision Record (ADR).

Every engineer, architect, AI assistant, technical writer, and implementation team must use these definitions as the authoritative reference. Introducing synonyms, redefining established terms, or using platform terms in conflicting ways is a violation of the One Concept Has One Definition principle (KB-003 §3.1).

AI assistants must treat this document as the definitive source for platform vocabulary. Before generating any output that references a platform concept, AI assistants must verify their terminology against this glossary.

New terminology requires governance. Adding a new term to the platform vocabulary — or changing the definition of an existing term — requires an ADR and updates to this document. Uncontrolled terminology growth leads to the same fragmentation the platform is designed to solve.

---

## 2. Naming Philosophy

The following principles govern the naming of all platform concepts.

**One concept has one name.** Every platform concept has exactly one canonical term. No synonyms are permitted in official documentation, specifications, or implementation references.

**One name has one meaning.** Every term has exactly one definition. No term is reused to mean different things in different contexts. If a term appears ambiguous, it must be qualified (e.g., "tenant user" vs. "platform user") rather than redefined.

**Avoid synonyms.** If a concept already has a canonical term, use that term. Do not introduce alternative names, abbreviations, or colloquial variations. For example, use "Desk" not "storefront", "app", or "tenant application".

**Prefer business-oriented terminology over technical jargon.** Platform terms should reflect business concepts wherever possible. For example, "Publication" is preferred over "deployment", "Capability" is preferred over "feature module". Technical implementation details are named separately from the platform concepts they implement.

**Names should remain stable over time.** Once a term is established in this glossary, it should not be changed. Renaming a core concept causes cascading updates across the entire Knowledge Base, specifications, implementations, and documentation. Stability is more important than finding the perfect name.

**Names should reflect platform concepts rather than implementation details.** A term should describe what the concept means in the platform, not how it is implemented. For example, "Action" describes what happens (an interaction is triggered), not how it is implemented (a handler function is called).

---

## 3. Core Platform Terminology

### 3.1 Platform Concepts

---

#### Platform

| Field | Value |
|-------|-------|
| **Definition** | The complete DUKADESK ecosystem — including the runtime, backend services, builder, renderers, marketplace, APIs, SDKs, CLI, documentation, and governance processes — that enables the creation, deployment, and operation of business software across multiple tenants and surfaces. |
| **Purpose** | To serve as the digital operating system for organizations, providing a unified, composable, multi-tenant environment for business digitization. |
| **Responsibilities** | Providing shared infrastructure, capabilities, runtime, tooling, and governance for all tenant desks. |
| **Relationships** | Contains all other platform concepts. A Platform hosts multiple Tenants. A Platform provides the Runtime. A Platform includes the Builder, Marketplace, and all Services. |
| **Examples** | DUKADESK itself is the Platform. There is one Platform per deployment. |
| **Related Terms** | Tenant, Desk, Runtime, Builder, Marketplace |
| **Notes** | The Platform is not a single application. It is the complete system. References to "the platform" in technical documentation always refer to the DUKADESK platform. |

---

#### Knowledge Base

| Field | Value |
|-------|-------|
| **Definition** | The collection of documents that serve as the single source of truth for all architectural decisions, engineering standards, platform conventions, and governance processes across the DUKADESK ecosystem. |
| **Purpose** | To ensure that every engineering artifact — specifications, code, documentation, alignment reports — is built with a consistent architectural philosophy. |
| **Responsibilities** | Defining principles, standards, governance, and terminology. Serving as the authoritative reference for all engineering work. |
| **Relationships** | References and is referenced by all Specifications, ADRs, and Alignment Reviews. |
| **Examples** | This document is part of the Knowledge Base. README.md, PLATFORM_PHILOSOPHY.md, and all ADRs are part of the Knowledge Base. |
| **Related Terms** | Specification, Architecture Decision Record (ADR), Alignment Review |
| **Notes** | The Knowledge Base is the product's memory. If a conflict exists, it is resolved through the Knowledge Base — not through code or conversation (KB-001). |

---

#### Specification

| Field | Value |
|-------|-------|
| **Definition** | A formal document that describes a specific system, service, capability, or feature in the DUKADESK platform — including its purpose, behavior, contracts, data model, and alignment with the Knowledge Base. |
| **Purpose** | To provide detailed, implementation-ready descriptions of platform components that can be reviewed, verified, and used as the basis for implementation. |
| **Responsibilities** | Defining functional and non-functional requirements, API contracts, data models, security considerations, and alignment references. |
| **Relationships** | Specifications extend the Knowledge Base for specific domains. Specifications are verified through Alignment Reviews. Implementations are built from Verified Specifications. |
| **Examples** | runtime-engine.md, tenant-model.md, component-system.md, action-system.md |
| **Related Terms** | Knowledge Base, Alignment Review, Architecture Decision Record (ADR) |
| **Notes** | A Specification is complete only when it has undergone Alignment Review and been marked Verified. An unverified Specification is provisional. |

---

#### Architecture Decision Record (ADR)

| Field | Value |
|-------|-------|
| **Definition** | An immutable document that records a significant architectural decision, including its context, the decision itself, its consequences, and compliance criteria. |
| **Purpose** | To ensure that every architectural decision is justified, documented, and traceable to the principles that motivated it. |
| **Responsibilities** | Documenting the rationale for architectural decisions. Providing a permanent record that future engineers and AI assistants can reference. |
| **Relationships** | ADRs reference the Knowledge Base principles they satisfy. ADRs are referenced by Specifications and implementations that depend on the decisions. |
| **Examples** | ADR-001: Runtime Engine Architecture, ADR-003: Action System Design, ADR-004: Event Bus for Cross-Component Communication |
| **Related Terms** | Knowledge Base, Specification, Alignment Review |
| **Notes** | ADRs are immutable once accepted. Errors are corrected with a superseding ADR. Breaking changes require an ADR explicitly marked as `[BREAKING]`. |

---

#### Alignment Review

| Field | Value |
|-------|-------|
| **Definition** | A formal evaluation of a Specification against the Knowledge Base to determine whether the Specification satisfies every applicable principle, standard, and convention. |
| **Purpose** | To ensure that every Specification is architecturally consistent before it can be marked as Verified and used as the basis for implementation. |
| **Responsibilities** | Identifying findings (deviations from the Knowledge Base), rating their severity, and determining an alignment verdict. |
| **Relationships** | A Specification undergoes Alignment Review. The results are documented in an Alignment Report. The Review Agent conducts the review. |
| **Related Terms** | Specification, Knowledge Base, Review Agent, Alignment Report |
| **Notes** | Alignment Reviews may be conducted by human reviewers or AI Review Agents. Each Review Agent focuses on a specific domain (mobile, backend, dashboard, etc.). |

---

#### Version

| Field | Value |
|-------|-------|
| **Definition** | A named or numbered snapshot of a platform artifact (Knowledge Base document, Specification, ADR, API, SDK, Desk, Publication) at a specific point in its lifecycle. |
| **Purpose** | To enable controlled evolution of platform artifacts, track changes over time, and provide compatibility guarantees to consumers. |
| **Responsibilities** | Identifying which version of an artifact is in use. Enabling consumers to depend on specific versions. |
| **Relationships** | Versions apply to all governed artifacts: Knowledge Base documents, Specifications, ADRs, APIs, Publications, SDKs, and the CLI. |
| **Related Terms** | Publication, Environment, API |
| **Notes** | The Knowledge Base as a whole follows semantic versioning (MAJOR.MINOR.PATCH). Individual documents carry their own version numbers. |

---

#### Environment

| Field | Value |
|-------|-------|
| **Definition** | A named deployment context for a Desk or platform component — typically one of development, staging, or production — with its own configuration, data, and access controls. |
| **Purpose** | To isolate changes at different stages of maturity and provide safe spaces for development, testing, and operation. |
| **Responsibilities** | Providing environment-specific configuration, data isolation, and access boundaries. |
| **Relationships** | Desks are deployed to Environments. Publications promote changes across Environments. |
| **Examples** | Development, Staging, Production |
| **Related Terms** | Publication, Version, Desk |
| **Notes** | Environment boundaries are enforced at the infrastructure level. Cross-environment data access must be explicitly authorized. |

---

#### Publication

| Field | Value |
|-------|-------|
| **Definition** | A versioned, deployable release of a Desk, Capability, Theme, or Extension that has been built from the Builder and published to an Environment or the Marketplace. |
| **Purpose** | To provide a formal mechanism for promoting platform artifacts from development through staging to production, or for distributing artifacts through the Marketplace. |
| **Responsibilities** | Packaging configuration, assets, and definitions into a deployable unit. Recording the version history of artifacts. |
| **Relationships** | A Publication is created by the Builder. It is deployed to an Environment or distributed through the Marketplace. |
| **Related Terms** | Version, Environment, Marketplace, Builder |
| **Notes** | Every Publication is immutable once created. Changes to a Desk or Extension produce a new Publication, not a modification of an existing one. |

---

### 3.2 Organizational Concepts

---

#### Organization

| Field | Value |
|-------|-------|
| **Definition** | A legal or business entity that contracts with DUKADESK to use the platform. An Organization may own one or more Tenants. |
| **Purpose** | To represent the business entity that holds the commercial relationship with the platform provider. |
| **Responsibilities** | Managing billing, subscription plans, user accounts, and tenant portfolio. |
| **Relationships** | An Organization owns one or more Tenants. An Organization has Users who administer the Organization and its Tenants. |
| **Examples** | A restaurant chain owns one Organization that contains Tenants for each franchise location. |
| **Related Terms** | Tenant, User, Workspace |
| **Notes** | Organization is the top-level entity in the platform's commercial hierarchy. Most platform interactions are at the Tenant level, not the Organization level. |

---

#### Tenant

| Field | Value |
|-------|-------|
| **Definition** | An independent operational entity within the DUKADESK platform. A Tenant represents a single business, business unit, or franchise that operates its own Desk with its own branding, configuration, users, and data. Tenant data is strictly isolated from all other Tenants at the data layer. |
| **Purpose** | To provide a fully isolated operational environment for each platform consumer. Every Tenant experiences the platform as their own private instance. |
| **Responsibilities** | Owning its own branding, configuration, capabilities, users, content, orders, and data. Isolating its data from all other Tenants. |
| **Relationships** | A Tenant belongs to an Organization. A Tenant has one or more Desks. A Tenant has a Manifest. A Tenant has Users. A Tenant has a Theme. |
| **Examples** | Mama's Kitchen (a restaurant), Grace Pharmacy (a pharmacy). Each is a Tenant with its own Desk. |
| **Related Terms** | Organization, Workspace, Desk, Manifest, User |
| **Notes** | Tenant is one of the most important concepts in the platform. Every architectural decision assumes multiple Tenants operating independently. Tenant isolation is enforced at every layer: data, configuration, authentication, resource usage. |

---

#### Workspace

| Field | Value |
|-------|-------|
| **Definition** | A collaborative environment within the Builder where a team configures and customizes a Desk for a specific Tenant. |
| **Purpose** | To provide a shared, controlled space for Desk authoring — distinct from the Desk itself (which is the running application). |
| **Responsibilities** | Containing the configuration, screens, theme, capabilities, and content being authored for a Desk. Managing collaboration between team members. |
| **Relationships** | A Workspace belongs to a Tenant. A Workspace produces a Publication. A Workspace is accessed through the Builder. |
| **Related Terms** | Tenant, Desk, Builder, Publication |
| **Notes** | The Workspace is the authoring environment. The Desk is the running application. Changes made in a Workspace are published to create or update a Desk. |

---

#### User

| Field | Value |
|-------|-------|
| **Definition** | An individual who interacts with the DUKADESK platform. Users exist at multiple levels: platform users (who administer the platform itself), organization users (who manage billing and tenants), tenant users (who use a Desk), and desk end users (who interact with a Desk's customer-facing surfaces). |
| **Purpose** | To represent all individuals who interact with any part of the DUKADESK ecosystem — administration, configuration, or daily operation. |
| **Responsibilities** | Authenticating their identity. Acting within the permissions granted to their Role. Belonging to the appropriate Organization and/or Tenant. |
| **Relationships** | A User has a Role. A User has a Session. A User belongs to an Organization and/or Tenant. |
| **Related Terms** | Identity, Role, Permission, Session |
| **Notes** | The term "User" should be qualified when context is unclear: "tenant user" (user of a specific Tenant), "platform user" (administrator of the platform), "end user" (customer-facing user of a Desk). |

---

#### Identity

| Field | Value |
|-------|-------|
| **Definition** | The digital representation of a User or Service within the DUKADESK platform, including authentication credentials, profile information, and associated claims. |
| **Purpose** | To establish and verify the identity of entities interacting with the platform — whether human users or automated services. |
| **Responsibilities** | Providing authentication. Maintaining profile data. Supporting identity federation with external providers. |
| **Relationships** | A User has an Identity. A Service may have a Service Identity. Identity is verified during Session creation. |
| **Related Terms** | User, Session, Permission |
| **Notes** | Identity is managed by the platform by default. External identity providers (SSO, SAML, OIDC) are integrated through adapters. |

---

#### Session

| Field | Value |
|-------|-------|
| **Definition** | An authenticated interaction context between a User and the platform, established through Identity verification and maintained for the duration of the User's activity. |
| **Purpose** | To maintain authenticated state across user interactions without requiring repeated credential verification. |
| **Responsibilities** | Holding authentication state. Enforcing session expiration. Supporting session revocation. |
| **Relationships** | A Session is created when a User authenticates. A Session is associated with a specific Tenant context (for tenant users) or platform context (for platform users). |
| **Related Terms** | Identity, User, Permission |
| **Notes** | Sessions have configurable timeouts and can be revoked by administrators. Offline-first operation requires local session caching with re-authentication on reconnection. |

---

#### Role

| Field | Value |
|-------|-------|
| **Definition** | A named collection of Permissions that can be assigned to Users to grant them specific levels of access within a Tenant, Organization, or the platform. |
| **Purpose** | To provide a manageable abstraction for permission assignment. Roles group related Permissions so they can be assigned to Users as a unit. |
| **Responsibilities** | Defining what actions a User is authorized to perform. Providing default role templates per capability. Supporting custom role creation. |
| **Relationships** | A Role contains Permissions. A User has a Role. Roles are scoped to a Tenant or the platform. |
| **Examples** | Tenant Administrator, Desk Operator, End User, Platform Administrator |
| **Related Terms** | Permission, User, Capability |
| **Notes** | Roles are tenant-scoped by default. Cross-tenant roles require specific platform-level authorization. The platform provides default roles for common patterns. |

---

#### Permission

| Field | Value |
|-------|-------|
| **Definition** | An atomic authorization grant that allows a User to perform a specific action on a specific resource within the platform. |
| **Purpose** | To provide fine-grained control over what each User can do within the platform, enforced at every action execution point. |
| **Responsibilities** | Defining access rights to specific operations and resources. Enabling capability-level authorization checks. |
| **Relationships** | Permissions are grouped into Roles. Permissions are checked by the Runtime and Services before executing actions. |
| **Related Terms** | Role, User, Capability, Action |
| **Notes** | Permissions follow the principle of least privilege. No action is permitted by default. All authorizations must be explicitly granted. |

---

### 3.3 Application Concepts

---

#### Desk

| Field | Value |
|-------|-------|
| **Definition** | The primary deployable business application within DUKADESK. A Desk is a tenant-specific, branded, screen-driven experience rendered by the Runtime on one or more surfaces (mobile, web, dashboard). Each Tenant has at least one Desk. |
| **Purpose** | To deliver the platform's capabilities to end users as a cohesive, branded application. The Desk is what users see and interact with. |
| **Responsibilities** | Presenting the Tenant's capabilities as a unified user experience. Rendering screens defined in the Manifest. Applying the Tenant's Theme. Executing Actions through the Runtime. |
| **Relationships** | A Desk belongs to a Tenant. A Desk is defined by a Manifest. A Desk is rendered by the Runtime. A Desk is deployed through a Publication. A Desk is authored in a Workspace. |
| **Examples** | Mama's Kitchen Desk (mobile app for a restaurant), Grace Pharmacy Desk (mobile app for a pharmacy) |
| **Related Terms** | Tenant, Manifest, Runtime, Renderer, Publication, Theme |
| **Notes** | The Desk is the primary interface between the platform and end users. A Desk is not a separate application build — it is a configuration of the platform that the Runtime renders dynamically. Different Desks may share the same binary (mobile app) but render completely different experiences. |

---

#### Manifest

| Field | Value |
|-------|-------|
| **Definition** | A structured declaration file for a Tenant that defines version information, enabled Capabilities, Module references, Theme binding, screen definitions, navigation structure, and configuration. The Manifest is the complete description of a Tenant's Desk. |
| **Purpose** | To serve as the single source of truth for what a Tenant's Desk looks like, what it can do, and how it behaves. |
| **Responsibilities** | Declaring all Capabilities a Tenant uses. Defining screen structure and navigation. Referencing Theme and Asset configurations. Specifying Module overrides. |
| **Relationships** | A Manifest belongs to a Tenant. A Manifest is authored in the Builder (through a Workspace). A Manifest is resolved by the Runtime to render the Desk. |
| **Related Terms** | Tenant, Desk, Runtime, Module, Capability, Theme |
| **Notes** | The Manifest is the platform's primary data structure for server-driven UI. Changes to the Manifest are reflected immediately when the Runtime resolves it. A Manifest has a version that is incremented on each Publication. |

---

#### Capability

| Field | Value |
|-------|-------|
| **Definition** | A bounded, independently deployable unit of business functionality that a Tenant can enable or configure within their Desk. Capabilities represent business features — such as catalog, cart, checkout, booking, notifications, orders — rather than technical components. |
| **Purpose** | To provide composable business functionality that Tenants can select, configure, and combine to build their Desk without custom development. |
| **Responsibilities** | Delivering a specific business function through screens, actions, services, and data models. Providing default implementations that Tenants can customize. Defining its own extension points. |
| **Relationships** | A Capability is declared in the Manifest. A Capability may provide a Module. A Capability uses Services. A Capability may depend on other Capabilities. |
| **Examples** | Catalog Capability (browsing products/menu), Cart Capability (managing selections), Checkout Capability (processing orders), Booking Capability (scheduling appointments), Notifications Capability (sending alerts) |
| **Related Terms** | Module, Manifest, Service, Capability (as a principle in KB-003 §3.3) |
| **Notes** | Capability is both a platform concept and an engineering principle (KB-003 §3.3 — Capability First). As a principle, it guides architecture toward composable, bounded functionality. As a platform concept, it describes a specific unit of business functionality. |

---

#### Module

| Field | Value |
|-------|-------|
| **Definition** | A packaged set of default screens, components, actions, services, and configuration that implements a Capability. Modules provide baseline implementations that Tenants can use as-is, customize, or override. |
| **Purpose** | To deliver Capability implementations that are immediately usable while supporting customization. |
| **Responsibilities** | Providing default screens for a Capability. Defining component types and action handlers. Specifying configuration options. Supporting tenant-specific overrides. |
| **Relationships** | A Module implements a Capability. A Module provides default Screens. A Module may reference other Modules. A Module is referenced by the Manifest. |
| **Related Terms** | Capability, Screen, Component, Manifest |
| **Notes** | Modules are first-class platform artifacts. They are versioned, published, and governed. Modules can be provided by the platform, by solution providers, or by marketplace creators. |

---

#### Theme

| Field | Value |
|-------|-------|
| **Definition** | A complete visual identity definition for a Tenant's Desk, including colors, typography, spacing, iconography, imagery, and surface-specific style overrides. A Theme ensures that a Desk reflects the Tenant's brand identity. |
| **Purpose** | To enable full white-label customization of all platform surfaces without code changes. |
| **Responsibilities** | Defining the visual appearance of all components rendered by the Runtime. Providing consistent branding across all surfaces. Supporting surface-specific adaptations (mobile vs. web vs. dashboard). |
| **Relationships** | A Theme is assigned to a Tenant. A Theme is referenced in the Manifest. A Theme is applied by the Runtime to all rendered Surfaces. |
| **Related Terms** | Tenant, Desk, Manifest, Runtime |
| **Notes** | Themes are platform artifacts, not just style files. They are versioned, published through the Builder, and can be shared across Tenants or distributed through the Marketplace. |

---

#### Template

| Field | Value |
|-------|-------|
| **Definition** | A pre-configured blueprint for a Desk, Capability configuration, Screen layout, or Publication that provides a starting point for customization. |
| **Purpose** | To accelerate Desk creation by providing reusable starting configurations that capture best practices and common patterns. |
| **Responsibilities** | Defining a baseline configuration. Reducing the effort required to create a new Desk or add a new Capability. |
| **Relationships** | A Template is used in the Builder. A Template may configure one or more Capabilities. A Template may define initial Screens and Theme settings. |
| **Related Terms** | Builder, Desk, Capability, Screen, Package |
| **Notes** | Templates are distinct from Modules. A Module is an implementation of a Capability. A Template is a starting configuration that may compose multiple Capabilities. |

---

#### Package

| Field | Value |
|-------|-------|
| **Definition** | A distributable bundle of platform artifacts — such as a Capability implementation, Module, Theme, Template, or Extension — packaged for distribution through the Marketplace or deployment to an Environment. |
| **Purpose** | To enable distribution and reuse of platform artifacts across Tenants, Teams, and deployments. |
| **Responsibilities** | Bundling related artifacts into a single distributable unit. Declaring dependencies on other Packages. Declaring compatibility with platform versions. |
| **Relationships** | A Package is published to the Marketplace. A Package may contain Modules, Themes, Templates, or Extensions. |
| **Related Terms** | Marketplace, Module, Theme, Extension, Publication |
| **Notes** | Packages are the unit of distribution. Publications are the unit of deployment. A Package may be published multiple times (different versions). A Publication is a specific deployed instance. |

---

### 3.4 UI Concepts

---

#### Renderer

| Field | Value |
|-------|-------|
| **Definition** | A surface-specific execution layer that translates Runtime UI definitions into native or web user interface components. The Renderer is the thinnest layer in the platform — it contains rendering logic only, not business behavior. |
| **Purpose** | To enable the same Runtime definitions to produce native, platform-idiomatic UI on any surface. |
| **Responsibilities** | Registering and rendering Components. Translating UI definitions into surface-specific widgets. Handling surface-specific interactions. |
| **Relationships** | A Renderer is part of the Runtime. A Renderer interprets Screen definitions. A Renderer uses a Component Registry. |
| **Examples** | Mobile Renderer (React Native), Web Renderer (React/DOM), Dashboard Renderer |
| **Related Terms** | Runtime, Component, Screen, Component Registry |
| **Notes** | The Renderer is surface-agnostic in its core integration with the Runtime and surface-specific in its rendering output. Multiple Renderers can coexist, each targeting a different surface type. |

---

#### Screen

| Field | Value |
|-------|-------|
| **Definition** | A distinct view within a Desk, defined by a structured data definition that describes the screen's Layout, Sections, Components, Actions, and data bindings. Screens are the primary unit of navigation within a Desk. |
| **Purpose** | To present a cohesive set of information and interactions to the user as a single navigable view. |
| **Responsibilities** | Defining the structure and content of a full-page view. Declaring its data requirements. Defining its place in the Navigation hierarchy. |
| **Relationships** | A Screen belongs to a Desk. A Screen has a Layout. A Screen may have a Navigation entry. A Screen is defined in the Manifest. |
| **Examples** | Menu Screen (catalog browsing), Orders Screen (order history), Notifications Screen (alerts), Checkout Screen (order completion) |
| **Related Terms** | Desk, Layout, Section, Component, Navigation, Manifest |
| **Notes** | Screens are server-defined. The client does not hardcode screen implementations — it renders whatever the Screen definition describes. Screens can be added, removed, or modified without client updates. |

---

#### Section

| Field | Value |
|-------|-------|
| **Definition** | A structural subdivision of a Screen that groups related Components and Layout nodes into a named, semantically meaningful region. Sections may represent content areas (header, body, footer) or functional areas (filter bar, results list, action panel). |
| **Purpose** | To provide structural organization within a Screen, enabling partial updates, conditional rendering, and semantic grouping of Components. |
| **Responsibilities** | Grouping related Components. Defining its own layout and styling within the Screen. Supporting visibility toggling and dynamic content. |
| **Relationships** | A Section belongs to a Screen. A Section contains Layout nodes and/or Components. |
| **Examples** | Menu list section, Category filter section, Order summary section |
| **Related Terms** | Screen, Layout, Component |
| **Notes** | Sections enable the Runtime to update parts of a Screen independently (e.g., refreshing only the results section when a filter changes) without re-rendering the entire Screen. |

---

#### Layout

| Field | Value |
|-------|-------|
| **Definition** | A structural definition that describes how Components and Sections are arranged within a Screen — including their positions, sizes, spacing, alignment, and nesting relationships. |
| **Purpose** | To define the spatial organization of a Screen independently of the Components' content. |
| **Responsibilities** | Defining the visual structure of a Screen. Specifying arrangement and spacing of children. Supporting responsive adaptations. |
| **Relationships** | A Layout belongs to a Screen. A Layout contains Sections or Components. A Layout is defined in the Screen's data definition. |
| **Related Terms** | Screen, Section, Component |
| **Notes** | Layouts are declarative. Designers and solution providers compose Layouts visually in the Builder without code. Separating Layout from Component enables reusable component libraries that work in any arrangement. |

---

#### Component

| Field | Value |
|-------|-------|
| **Definition** | A reusable, self-contained UI element registered in the Component Registry and referenced by type in Screen definitions. Components encapsulate a specific rendering behavior — a card, a button, a list, a form field — and expose configuration through props. |
| **Purpose** | To provide a library of reusable UI primitives that the Runtime can compose into any Screen without custom rendering code. |
| **Responsibilities** | Rendering a specific UI pattern. Accepting props for configuration. Dispatching Actions on user interaction. |
| **Relationships** | A Component is registered in the Component Registry. A Component is referenced by Screen definitions. A Component may dispatch Actions. A Component may subscribe to Events. |
| **Examples** | CategoryPills, MenuGrid, DynamicCard, PrimaryButton, NotificationList, CartSummary, CalendarStrip |
| **Related Terms** | Component Registry, Screen, Action, Event |
| **Notes** | Components must be designed for reuse across multiple Screens and Tenants. Components never import or reference each other directly — they communicate through Events and Actions. |

---

#### Component Registry

| Field | Value |
|-------|-------|
| **Definition** | A map of component type names to their runtime implementations. The Renderer uses the Component Registry to resolve Component type references in Screen definitions to actual rendering implementations. |
| **Purpose** | To decouple Screen definitions from rendering implementations. The Registry enables new Components to be added and existing Components to be replaced without changing Screen definitions. |
| **Responsibilities** | Mapping Component type names to implementations. Providing a registration API for platform and extension Components. |
| **Relationships** | The Component Registry is part of the Renderer. Components are registered in the Registry. Screen definitions reference Component types from the Registry. |
| **Related Terms** | Component, Renderer, Screen |
| **Notes** | The Component Registry is extensible. Marketplace Extensions can register new Component types that Screen definitions can reference. |

---

#### Action

| Field | Value |
|-------|-------|
| **Definition** | A declarative description of an interaction triggered by a user gesture on a Component. Actions are defined in Screen data and resolved by the Action Engine — they are not hardcoded in Components. An Action specifies a type, a payload, and optional UI labels. |
| **Purpose** | To enable all user interactions to be defined declaratively at the platform level rather than implemented imperatively in Component code. |
| **Responsibilities** | Describing what should happen when a user interacts with a Component. Providing the payload data needed to execute the interaction. |
| **Relationships** | An Action is defined on a Component. An Action is dispatched by the Runtime's Action Engine. An Action may call an API, navigate, switch Screens, or mutate local state. |
| **Examples** | `add_to_cart` (with product ID as payload), `navigate` (with screen ID), `api_request` (with endpoint and method), `switch_screen`, `submit_form` |
| **Related Terms** | Action Engine, Component, Navigation, Event |
| **Notes** | Actions are part of the Server-Driven UI model. The server defines what actions are available on each Component. The client executes them through the Action Engine. This keeps behavior configurable without client updates. |

---

#### Event

| Field | Value |
|-------|-------|
| **Definition** | A named signal emitted by a Component, Service, or Runtime component to communicate that something has occurred. Events are published through the Event Bus and consumed by subscribers that have registered interest. |
| **Purpose** | To enable loose coupling between platform components. Events allow Components and Services to communicate without direct dependencies. |
| **Responsibilities** | Carrying a namespaced name and optional payload. Being published by a producer. Being consumed by zero or more subscribers. |
| **Relationships** | An Event is published on the Event Bus. An Event may be produced by a Component or Service. An Event may be consumed by other Components or Services. |
| **Examples** | `navigation:switch_screen`, `filter:changed`, `cart:updated` |
| **Related Terms** | Event Bus, Action, Component, Service |
| **Notes** | Events follow a namespaced naming convention: `{domain}:{action}` (KB-011). Events are distinct from Actions: Actions are user-initiated, Events are system-initiated. Events follow the Event Driven principle (KB-003 §3.8). |

---

#### Event Bus

| Field | Value |
|-------|-------|
| **Definition** | A lightweight publish-subscribe messaging system that enables cross-component and cross-service communication through Events without direct coupling. |
| **Purpose** | To provide a standard communication channel for decoupled platform components. |
| **Responsibilities** | Routing Events from producers to subscribers. Supporting typed Event payloads. Managing subscriber lifecycle. |
| **Relationships** | The Event Bus carries Events. Components and Services publish to and subscribe from the Event Bus. |
| **Related Terms** | Event, Component, Service |
| **Notes** | The Event Bus is available in both the client Runtime (for cross-component communication) and the Backend (for cross-service communication). Client Event Bus and Backend Event Bus are separate concerns that may be bridged by Services. |

---

#### Navigation

| Field | Value |
|-------|-------|
| **Definition** | The system that manages Screen transitions within a Desk, including screen hierarchy, history stack, tab structure, and deep linking. Navigation is defined in the Manifest and resolved by the Runtime. |
| **Purpose** | To provide a flexible, server-defined navigation structure that can be customized per Tenant without client changes. |
| **Responsibilities** | Defining the screen hierarchy and transition rules. Managing navigation state and history. Supporting deep linking and external navigation requests. |
| **Relationships** | Navigation is defined in the Manifest. Navigation references Screens. Navigation Actions (navigate, push, pop, switch_screen) control Screen transitions. |
| **Related Terms** | Screen, Manifest, Action, Runtime |
| **Notes** | Navigation is fully server-defined. The structure of tabs, stacks, and modal flows is declared in the Manifest and interpreted by the Runtime. Adding or reordering navigation does not require a client update. |

---

### 3.5 Architecture Concepts

---

#### Runtime

| Field | Value |
|-------|-------|
| **Definition** | The shared execution environment that interprets Server-Driven UI definitions, manages application state, resolves Actions, enforces business rules, handles cross-cutting concerns (authentication, authorization, caching, offline behavior), and coordinates communication between Components, Services, and Renderers. |
| **Purpose** | To provide a consistent, surface-agnostic execution layer that decouples business behavior from rendering. |
| **Responsibilities** | Resolving Manifest data into rendered Screens. Executing Actions through the Action Engine. Managing client-side state. Handling offline data synchronization. Coordinating communication between platform layers. |
| **Relationships** | The Runtime consumes the Manifest. The Runtime drives the Renderer. The Runtime communicates with Services. The Runtime executes Actions and routes Events. |
| **Related Terms** | Manifest, Renderer, Action Engine, Event Bus, Service |
| **Notes** | The Runtime is the heart of the Server-Driven UI architecture. It is designed to be surface-agnostic — the same Runtime logic drives mobile, web, and dashboard Renderers. |

---

#### Service

| Field | Value |
|-------|-------|
| **Definition** | A bounded, independently deployable backend component that owns a specific domain capability, exposes a well-defined API, enforces authorization, manages its own data persistence, and communicates with other Services through Events. |
| **Purpose** | To implement and deliver platform Capabilities at the backend layer with clear ownership boundaries and independent lifecycle. |
| **Responsibilities** | Implementing business logic for its domain. Exposing APIs for its Capabilities. Enforcing tenant isolation and authorization. Managing its own data. Emitting Events when domain state changes. |
| **Relationships** | A Service implements one or more Capabilities. A Service communicates with other Services through Events. A Service is consumed by the Runtime, other Services, and external integrations. |
| **Examples** | Catalog Service, Order Service, Notification Service, Payment Service, User Service |
| **Related Terms** | Capability, API, Event, Queue, Event Bus |
| **Notes** | Services follow the Capability First principle (KB-003 §3.3). Each Service has a bounded domain. Services do not share databases. Cross-service workflows are coordinated through Events. |

---

#### API

| Field | Value |
|-------|-------|
| **Definition** | A well-defined, versioned, documented interface that exposes a Service's capabilities to consumers. APIs follow consistent design conventions across all Services and are accessible to both internal platform consumers and external integrations. |
| **Purpose** | To provide a consistent contract surface for all platform capabilities, enabling decoupled consumption by any authorized consumer. |
| **Responsibilities** | Exposing Service capabilities. Enforcing authentication and authorization. Validating inputs. Returning consistent responses. Maintaining backward compatibility. |
| **Relationships** | An API belongs to a Service. An API is consumed by the Runtime, Renderers, Dashboards, the Builder, and external systems. |
| **Related Terms** | Service, SDK, Webhook |
| **Notes** | APIs follow the API First principle (KB-003 §3.7). Internal consumers use the same APIs as external consumers. APIs are versioned and follow semantic versioning with deprecation policies. |

---

#### Webhook

| Field | Value |
|-------|-------|
| **Definition** | A mechanism for the platform to deliver real-time notifications to external systems when specific Events occur. Webhooks use HTTP callbacks to push Event data to registered URLs. |
| **Purpose** | To enable external systems to react to platform Events in real time without polling. |
| **Responsibilities** | Delivering Event notifications to registered endpoints. Managing retries and delivery guarantees. Supporting endpoint verification and secret-based authentication. |
| **Relationships** | A Webhook is triggered by an Event. A Webhook delivers Event data to an external URL. A Webhook is configured per Tenant. |
| **Related Terms** | Event, API, Integration |
| **Notes** | Webhooks are distinct from the Event Bus. The Event Bus is for internal platform communication. Webhooks are for external system integration. |

---

#### Queue

| Field | Value |
|-------|-------|
| **Definition** | A message buffer that decouples Event producers from Event consumers by allowing messages to be stored and processed asynchronously. Queues provide delivery guarantees, retry logic, and back-pressure management. |
| **Purpose** | To enable reliable asynchronous processing of Events and tasks, ensuring that temporary consumer unavailability does not result in data loss. |
| **Responsibilities** | Buffering messages. Providing delivery guarantees (at-least-once, exactly-once per queue configuration). Managing retries and dead-letter handling. |
| **Relationships** | Services publish to Queues. Services consume from Queues. Events may be delivered through Queues. |
| **Related Terms** | Event, Service, Event Bus |
| **Notes** | Queues are used where delivery guarantees and asynchronous processing are required. Not all Event communication requires a Queue — synchronous Event Bus communication is appropriate for within-service-boundary events. |

---

### 3.6 Commerce Concepts

---

#### Catalog

| Field | Value |
|-------|-------|
| **Definition** | A Capability that manages a Tenant's products, services, or items — including their descriptions, pricing, categorization, media assets, availability, and variants. |
| **Purpose** | To provide a structured, searchable inventory of everything a Tenant offers to its customers. |
| **Responsibilities** | Managing product/service definitions. Organizing items into categories. Supporting search and filtering. Managing pricing and availability. |
| **Relationships** | Catalog is a Capability. The Cart references Catalog items. Orders contain Catalog items. |
| **Related Terms** | Capability, Cart, Order |
| **Notes** | Catalog may be industry-specific in its data model (menu items for restaurants, products for retail, services for booking) but follows a common architectural pattern. |

---

#### Cart

| Field | Value |
|-------|-------|
| **Definition** | A Capability that manages a user's selections before checkout. The Cart tracks items, quantities, modifications, pricing, and promotional adjustments. |
| **Purpose** | To provide a temporary holding area for items a user intends to purchase, with the ability to review and modify selections before order submission. |
| **Responsibilities** | Managing item selection and quantities. Calculating running totals. Applying promotions. Persisting cart state across sessions. |
| **Relationships** | Cart references Catalog items. Cart is consumed by Checkout. Cart is associated with a User Session. |
| **Related Terms** | Capability, Catalog, Checkout, Order |
| **Notes** | Cart state may span multiple devices when the user is authenticated. Cart supports offline operation with synchronization on reconnection. |

---

#### Checkout

| Field | Value |
|-------|-------|
| **Definition** | A Capability that manages the order completion flow — including address collection, payment method selection, order review, and submission. |
| **Purpose** | To provide a structured, configurable flow for converting a Cart into an Order. |
| **Responsibilities** | Managing checkout form data (address, contact, payment method). Validating order data before submission. Coordinating with Payment providers. Producing an Order on completion. |
| **Relationships** | Checkout consumes Cart data. Checkout produces Orders. Checkout integrates with Payment services. |
| **Related Terms** | Capability, Cart, Order, Payment |
| **Notes** | Checkout is a multi-step flow that must support offline data collection with deferred submission. The flow is configurable per Tenant. |

---

#### Order

| Field | Value |
|-------|-------|
| **Definition** | A completed purchase record containing items, pricing, payment details, fulfillment status, and customer information. Orders are immutable once created and serve as the authoritative record of a transaction. |
| **Purpose** | To provide an immutable record of completed transactions for fulfillment, reconciliation, reporting, and customer reference. |
| **Responsibilities** | Recording transaction details. Tracking fulfillment status. Supporting order history and detail views. |
| **Relationships** | An Order is created by Checkout. An Order references Catalog items. An Order has a Payment record. |
| **Related Terms** | Capability, Checkout, Cart, Payment |
| **Notes** | Orders are immutable. Changes after creation (cancellation, refund, modification) are tracked as order events or linked records, not as modifications to the original Order. |

---

#### Payment

| Field | Value |
|-------|-------|
| **Definition** | The processing of a financial transaction associated with an Order. Payment execution is delegated to third-party payment providers. The platform handles payment orchestration, reconciliation, and data storage. |
| **Purpose** | To complete financial transactions securely while maintaining platform independence from payment providers. |
| **Responsibilities** | Orchestrating payment flows. Delegating processing to third-party providers. Recording payment data. Handling reconciliation and refunds. |
| **Relationships** | Payment is associated with an Order. Payment integrates with third-party Payment Providers. |
| **Related Terms** | Order, Checkout, Integration |
| **Notes** | Payment processing is intentionally outside the platform scope (KB-002 §3.7). The platform orchestrates payments but does not process financial transactions directly. |

---

#### Booking

| Field | Value |
|-------|-------|
| **Definition** | A Capability that manages appointment or reservation scheduling — including availability calendars, time slot selection, booking confirmation, rescheduling, and cancellation. |
| **Purpose** | To provide scheduling functionality for service-oriented Tenants (appointments, reservations, rentals). |
| **Responsibilities** | Managing availability calendars. Handling slot selection and booking. Supporting rescheduling and cancellation. |
| **Relationships** | Booking is a Capability. Booking may integrate with Catalog (for bookable services). Booking may integrate with Payment (for prepaid bookings). |
| **Related Terms** | Capability, Catalog, Order, Payment |
| **Notes** | Booking is distinct from Order-based commerce. Booking manages reservations rather than one-time purchases, though a Booking may conclude with an Order for payment. |

---

#### Notification

| Field | Value |
|-------|-------|
| **Definition** | A Capability that manages the delivery of messages to Users across multiple channels — including in-app notifications, push notifications, email, and SMS. The platform handles template management, trigger logic, delivery orchestration, and delivery infrastructure integration. |
| **Purpose** | To provide a unified notification system that keeps Users informed about platform events, order updates, promotions, and administrative messages. |
| **Responsibilities** | Managing notification templates. Triggering notifications from Events. Routing notifications to appropriate channels. Tracking delivery and read status. |
| **Relationships** | Notification is a Capability. Notifications reference Templates. Notifications are triggered by Events. |
| **Related Terms** | Capability, Event, Template |
| **Notes** | Actual message delivery (email, SMS, push) is delegated to third-party providers. The platform handles content, triggering, and delivery orchestration. |

---

### 3.7 Development Concepts

---

#### Builder

| Field | Value |
|-------|-------|
| **Definition** | The low-code visual authoring environment used to compose, configure, and customize Tenants' Desks — including screens, components, themes, workflows, capabilities, and content — without writing code. |
| **Purpose** | To enable non-technical administrators and solution providers to create and maintain Desks through visual composition and configuration. |
| **Responsibilities** | Providing visual tools for Desk composition. Generating structured UI definitions consumed by the Runtime. Managing Workspaces and Publications. Supporting version control and collaboration. |
| **Relationships** | The Builder produces Publications. The Builder manages Workspaces. The Builder configures Capabilities and Themes. The Builder integrates with the Marketplace. |
| **Related Terms** | Workspace, Publication, Desk, Manifest, Theme, Marketplace |
| **Notes** | The Builder is the authoring interface for the platform. It is distinct from the Developer Tooling (SDK, CLI) which targets software engineers building extensions and integrations. |

---

#### Builder Shell

| Field | Value |
|-------|-------|
| **Definition** | The host environment within Builder Studio that integrates all Builder modules, editors, panels, and services into a cohesive user interface. |
| **Purpose** | To provide a consistent workspace framework that coordinates the lifecycle and interaction of all sub-builders. |
| **Responsibilities** | Managing workspace layout, hosting editors and panels, coordinating module lifecycle, providing common services (theming, localization, keyboard shortcuts). |
| **Relationships** | Hosts all Builder modules (Desk Builder, Screen Builder, Workflow Builder, etc.). Integrates with the Plugin Manager for extensions. |
| **Related Terms** | Builder, Manifest Generator, Validation Engine, Preview Runtime, Publishing Pipeline |

#### Manifest Generator

| Field | Value |
|-------|-------|
| **Definition** | The Builder Studio subsystem responsible for translating a project's visual and declarative configuration into valid, schema-compliant Manifest artifacts. |
| **Purpose** | To produce the canonical configuration artifact that the Runtime consumes, ensuring every Manifest is structurally sound and schema-valid before publication. |
| **Responsibilities** | Translating project state into Manifest format, resolving references, inlining assets where appropriate, ensuring schema compliance. |
| **Relationships** | Consumes project state from all Builder modules. Produces Manifests validated by the Validation Engine. |
| **Related Terms** | Builder, Manifest, Validation Engine, Publishing Pipeline |

#### Validation Engine

| Field | Value |
|-------|-------|
| **Definition** | The Builder Studio subsystem responsible for analyzing all project artifacts against schema definitions, platform standards, security policies, accessibility requirements, and publishing readiness criteria. |
| **Purpose** | To ensure that only correct, compliant, and consistent applications reach the Publishing Pipeline by detecting defects at authoring time. |
| **Responsibilities** | Running continuous, on-demand, and pre-publish validation. Reporting errors, warnings, and info messages with actionable fix suggestions. Enforcing the quality gate before publication. |
| **Relationships** | Receives project state from Builder modules. Produces validation reports consumed by the Publishing Pipeline. Complements the Preview Runtime (static analysis vs. dynamic execution). |
| **Related Terms** | Builder, Manifest Generator, Preview Runtime, Publishing Pipeline |

#### Preview Runtime

| Field | Value |
|-------|-------|
| **Definition** | The Builder Studio subsystem that provides a simulated Runtime environment within the Builder for live, interactive preview of applications before publication. |
| **Purpose** | To enable builders to see and interact with their application as it would appear on target platforms before committing to publication. |
| **Responsibilities** | Loading project artifacts, simulating Runtime execution, rendering screens, executing workflows in simulation, providing responsive preview, supporting mock data and diagnostics. |
| **Relationships** | Mirrors production Runtime behavior through shared contracts. Uses mock services instead of real integrations. Complements the Validation Engine (dynamic execution vs. static analysis). |
| **Related Terms** | Builder, Validation Engine, Publishing Pipeline, Runtime |

#### Publishing Pipeline

| Field | Value |
|-------|-------|
| **Definition** | The Builder Studio subsystem responsible for packaging validated project artifacts into deployable releases, submitting them to target environments, managing versioned release history, and supporting rollback. |
| **Purpose** | To transform an authoring project into a deployment-ready, versioned, integrity-verified package that the Runtime can load and execute. |
| **Responsibilities** | Enforcing validation and approval gates, resolving dependencies, bundling assets, assigning versions, registering releases, deploying to target environments, managing rollback. |
| **Relationships** | Receives validated project state from the Validation Engine. Delivers release packages to target environments for Runtime consumption. |
| **Related Terms** | Builder, Validation Engine, Manifest, Runtime, Release |

#### Marketplace

| Field | Value |
|-------|-------|
| **Definition** | The distribution platform for discovering, purchasing, installing, and managing Extensions, Themes, Templates, Capabilities, and Integrations built by third-party developers and solution providers. |
| **Purpose** | To enable ecosystem growth by providing a platform for third-party contributors to distribute their work and for Tenants to discover and adopt extensions. |
| **Responsibilities** | Hosting and distributing Packages. Providing discovery mechanisms (search, categories, reviews, ratings). Managing licensing and monetization. Enforcing quality and security standards. |
| **Relationships** | The Marketplace contains Packages. The Marketplace is accessible from the Builder and Dashboards. The Marketplace connects Extension creators with Tenants. |
| **Related Terms** | Package, Extension, Plugin, Theme, Template |
| **Notes** | The Marketplace is distinct from a Package registry. It includes commerce, review, and governance infrastructure that a simple registry does not. |

---

#### Package (Marketplace)

| Field | Value |
|-------|-------|
| **Definition** | A versioned, signed, self-describing collection of platform artifacts published to the Marketplace. Packages are the unit of distribution, installation, and update. |
| **Purpose** | To package reusable platform assets — capabilities, components, themes, templates, workflows, integrations, AI agents, SDK extensions, or complete Desks — into a standardized format that the Marketplace can distribute and target environments can consume. |
| **Responsibilities** | Declaring package identity, metadata, dependencies, compatibility, license, and content manifest. Enabling integrity verification through digital signatures. |
| **Relationships** | Packages are stored in the Package Registry. Packages are discovered through the Discovery Service. Packages are installed through the Installation Manager. |
| **Related Terms** | Marketplace, Publisher, Package Registry, Certification |

#### Publisher

| Field | Value |
|-------|-------|
| **Definition** | A verified entity — individual, organization, or team — that creates, signs, and distributes packages through the Marketplace. |
| **Purpose** | To establish accountability and trust for all packages in the Marketplace. Every package is traceable to its publisher. |
| **Responsibilities** | Creating and maintaining packages, signing packages with verified identity, responding to certification feedback, providing updates and migration paths, managing deprecation and retirement. |
| **Relationships** | Publishers submit packages through the Publishing Pipeline. Publisher identity is verified by the Trust & Certification Manager. |
| **Related Terms** | Marketplace, Package, Certification, Digital Signature |

#### Package Registry

| Field | Value |
|-------|-------|
| **Definition** | The Marketplace subsystem that stores, indexes, and serves all published packages across all versions, categories, certification levels, and publishers. |
| **Purpose** | To provide a single authoritative source for all platform-distributable artifacts. The Package Registry is the system of record for every version of every package. |
| **Responsibilities** | Storing package metadata and artifacts, maintaining version history, indexing for search, enforcing retention policies, serving package data to discovery, installation, and update services. |
| **Relationships** | Receives packages from the certification pipeline. Serves packages to the Discovery Service and Installation Manager. Retains history for audit and rollback. |
| **Related Terms** | Marketplace, Package, Certification, Publisher |

#### Certification (Marketplace)

| Field | Value |
|-------|-------|
| **Definition** | The process of validating that a Marketplace package meets platform standards for compatibility, security, quality, and metadata completeness before it is made available for distribution. |
| **Purpose** | To protect consumers from incompatible, insecure, or low-quality packages by establishing a quality bar that all Marketplace artifacts must meet. |
| **Responsibilities** | Running automated compatibility checks, verifying security posture, validating metadata completeness, assigning certification levels (certified, verified, trusted), maintaining certification history. |
| **Relationships** | Certification is performed by the Trust & Certification Manager. Certification status is displayed in package metadata and enforced by organization trust policies. |
| **Related Terms** | Marketplace, Package, Publisher, Trust & Certification Manager |

---

#### SDK

| Field | Value |
|-------|-------|
| **Definition** | A set of language-specific client libraries, tools, and documentation that simplify integration with platform APIs for developers building Extensions, Integrations, or custom applications. |
| **Purpose** | To provide a first-class developer experience for building on DUKADESK, reducing the effort required to consume platform APIs and follow platform conventions. |
| **Responsibilities** | Wrapping platform APIs in idiomatic client libraries. Providing authentication, retry, and error handling. Including type definitions and documentation. |
| **Relationships** | An SDK wraps one or more APIs. An SDK is used by developers building Extensions or Integrations. |
| **Related Terms** | API, CLI, Extension, Integration |
| **Notes** | SDKs are generated from API contracts where possible. Multiple SDKs may exist for different languages (TypeScript, Python, etc.). |

---

#### CLI

| Field | Value |
|-------|-------|
| **Definition** | A command-line interface for platform administration, Tenant management, Desk deployment, Extension development, and workflow automation. |
| **Purpose** | To provide developers and platform administrators with a scriptable interface for platform operations. |
| **Responsibilities** | Providing commands for common platform operations. Supporting automation and CI/CD integration. |
| **Relationships** | The CLI consumes Platform APIs. The CLI may invoke Builder functionality. The CLI manages Publications and Environments. |
| **Related Terms** | API, SDK, Platform Administrator |
| **Notes** | The CLI is complementary to the Builder. The Builder is the visual authoring interface. The CLI is the programmatic interface for automation and administration. |

---

### 3.8 Integration Concepts

---

#### Integration

| Field | Value |
|-------|-------|
| **Definition** | A connection between DUKADESK and an external system that enables data exchange or workflow coordination. Integrations use standard mechanisms — APIs, Webhooks, adapters — to connect the platform with external services. |
| **Purpose** | To extend the platform's capabilities by connecting with external systems that Tenants already use. |
| **Responsibilities** | Facilitating data exchange. Translating between platform and external data models. Handling authentication with external systems. Managing synchronization. |
| **Relationships** | An Integration connects a platform Capability to an external System. An Integration may use APIs or Webhooks. |
| **Examples** | Payment Provider Integration (Stripe, PayPal), Communication Provider Integration (Twilio, SendGrid), Accounting Integration (QuickBooks, Xero) |
| **Related Terms** | API, Webhook, Extension, Plugin |
| **Notes** | Integration refers to connecting the platform with external systems. Extension refers to adding new capabilities within the platform. |

---

#### Extension

| Field | Value |
|-------|-------|
| **Definition** | A third-party software component that adds new Capabilities, Components, Services, or Integrations to the DUKADESK platform. Extensions are first-class platform citizens that integrate through standard APIs, Events, and Component Registry mechanisms. |
| **Purpose** | To enable ecosystem contributors to augment the platform's functionality without modifying the platform core. |
| **Responsibilities** | Implementing new Capability or Integration. Registering with platform extension points. Following platform standards and governance. |
| **Relationships** | An Extension is distributed through the Marketplace. An Extension may add Capabilities. An Extension may register Components. An Extension may provide Services. |
| **Related Terms** | Marketplace, Plugin, Capability, Integration, Component Registry |
| **Notes** | Extensions are distinct from Modules. Modules are platform-provided implementations of Capabilities. Extensions are third-party additions to the platform. |

---

#### Plugin

| Field | Value |
|-------|-------|
| **Definition** | A lightweight extension mechanism within a specific platform component — such as a Renderer Plugin, Action Engine Plugin, or Builder Plugin — that adds or modifies behavior at a specific integration point. |
| **Purpose** | To provide focused extension points within platform components without requiring full Capability development. |
| **Responsibilities** | Extending a specific component's behavior. Registering with a specific plugin interface. |
| **Relationships** | A Plugin extends a specific platform component (Renderer, Action Engine, Builder, etc.). |
| **Related Terms** | Extension, Component Registry, Action Engine |
| **Notes** | Plugins are more narrowly scoped than Extensions. An Extension may contain multiple Plugins. A Plugin typically extends a single integration point. |

---

### 3.9 Asset Concepts

---

#### Asset

| Field | Value |
|-------|-------|
| **Definition** | A binary or static resource used by a Desk — including images, icons, fonts, documents, media files, and other downloadable content. Assets are managed through the platform's asset system and referenced by URL or asset ID in Screen definitions. |
| **Purpose** | To provide a centralized, tenant-isolated storage and delivery system for all non-code resources used by Desks. |
| **Responsibilities** | Storing binary resources. Serving assets with appropriate caching. Enforcing access control per Tenant. Supporting asset transformations (resizing, format conversion). |
| **Relationships** | An Asset is referenced by Themes, Screen definitions, and Components. An Asset belongs to a Tenant. |
| **Related Terms** | Theme, Screen, Component, Manifest |
| **Notes** | Assets are distinct from code. Platform code is versioned in repositories. Assets are managed through the platform's asset system and deployed through Publications. |

---

#### Repository

| Field | Value |
|-------|-------|
| **Definition** | A version-controlled storage location for platform source code, specifications, and documentation. Each governed platform surface (backend, mobile, builder, etc.) has its own repository. |
| **Purpose** | To provide a structured, versioned home for each platform component's implementation and specifications. |
| **Responsibilities** | Hosting source code, specifications, and documentation. Enforcing code review and quality standards. Maintaining version history. |
| **Relationships** | A Repository contains implementation code. A Repository may contain Specifications. A Repository references the Knowledge Base version it aligns with. |
| **Examples** | backend, mobile, builder, website, business-dashboard, tenant-dashboard, sdk, cli |
| **Related Terms** | Knowledge Base, Specification, Version |
| **Notes** | Repositories are implementation artifacts. The Knowledge Base is the single source of truth — repositories may never become the primary source of architectural truth. |

---

### 3.10 Platform Governance Terms

---

#### Review Agent

| Field | Value |
|-------|-------|
| **Definition** | A specialized reviewer (human or AI) that evaluates Specifications against the Knowledge Base to determine alignment. Each Review Agent focuses on a specific domain (mobile, backend, dashboard, website, builder, architecture, security, naming, etc.). |
| **Purpose** | To provide domain-expert review of Specifications for architectural consistency. |
| **Responsibilities** | Identifying findings. Rating severity. Producing alignment verdicts. |
| **Related Terms** | Alignment Review, Specification, Knowledge Base |

---

#### Alignment Report

| Field | Value |
|-------|-------|
| **Definition** | A document produced by an Alignment Review that records which Specification was reviewed, which KB documents were used as reference, what findings were identified, how each finding was resolved, and the final alignment verdict. |
| **Purpose** | To provide a permanent record of the alignment status of each Specification. |
| **Responsibilities** | Documenting review findings. Recording resolution decisions. Providing traceability between Specifications and the Knowledge Base. |
| **Related Terms** | Alignment Review, Specification, Knowledge Base |

---

## 4. Relationships Between Terms

### 4.1 Platform Hierarchy

```
Organization
     │
     ▼
Tenant
     │
     ├──────────────────────────────────────────────┐
     │                                              │
     ▼                                              ▼
   Workspace (Builder)                            Desk
     │                                              │
     ▼                                              ▼
   Publication                                   Manifest
                                                    │
                                                    ▼
                                                 Runtime
                                                    │
                                            ┌───────┴───────┐
                                            │               │
                                            ▼               ▼
                                        Renderer         Service
                                            │               │
                                            ▼               ▼
                                      User Interface    Capability
```

### 4.2 Commerce Flow

```
User → Catalog (browse) → Cart (select) → Checkout → Order → Payment
                            │                              │
                            ▼                              ▼
                       Session                         Notification
```

### 4.3 Authoring Flow

```
Builder → Workspace → Configuration → Publication → Environment → Desk
             │
             ├── Theme
             ├── Capabilities
             ├── Screens
             └── Content
```

### 4.4 Ecosystem Flow

```
Developer → SDK/CLI → Extension → Marketplace → Tenant → Desk
                                                      │
                                                      ▼
                                                 Capability
```

### 4.5 UI Hierarchy

```
Screen
  │
  ├── Layout
  │       │
  │       └── Section
  │               │
  │               └── Component
  │                       │
  │                       └── Action → Action Engine → Service/Event/Navigation
  │
  └── Navigation
          │
          └── Screen Reference → Screen
```

### 4.6 Governance Flow

```
Knowledge Base
     │
     ├── Principles (KB-003)
     ├── Terminology (KB-002)
     ├── Standards (KB-011 – KB-017)
     │
     ▼
Specification
     │
     ▼
Alignment Review (Review Agent)
     │
     ├── Aligned → Verified → Implementation
     └── Findings → Revision → Re-review
```

### 4.7 Platform Evolution

```
ADR → Knowledge Base Update → Specification Update → Implementation → Publication → Release
```

---

## 5. Reserved Terms

The following terms are reserved for their specific platform definitions and must not be repurposed for other meanings in any specification, implementation, or documentation.

| Term | Rationale |
|------|-----------|
| **Desk** | The most important consumer-facing concept. Must not be replaced with "app", "storefront", "site", or "application". |
| **Tenant** | The most important multi-tenancy concept. Must not be replaced with "customer", "organization", "client", or "account". |
| **Capability** | A fundamental architectural unit. Must not be replaced with "feature", "module", "plugin", or "functionality". |
| **Runtime** | The core execution engine. Must not be replaced with "engine", "framework", "platform", or "kernel". |
| **Builder** | The low-code authoring environment. Must not be replaced with "editor", "studio", "designer", or "console". |
| **Publication** | The formal deployment unit. Must not be replaced with "deployment", "release", "build", or "publish". |
| **Manifest** | The complete Desk declaration. Must not be replaced with "config", "settings", "definition", or "blueprint". |
| **Action** | The declarative interaction mechanism. Must not be replaced with "event", "handler", "command", or "callback". |
| **Component** | The reusable UI primitive. Must not be replaced with "widget", "element", "block", or "control". |
| **Screen** | The primary navigation unit. Must not be replaced with "page", "view", "route", or "scene". |
| **Workspace** | The collaborative authoring context. Must not be replaced with "project", "space", or "environment". |
| **Module** | The Capability implementation package. Must not be replaced with "addon", "pack", "ext", or "bundle". |
| **Knowledge Base** | The complete engineering reference. Must not be replaced with "wiki", "docs", "handbook", or "manual". |
| **Specification** | The formal description of a system. Must not be replaced with "blueprint", "design doc", "requirements", or "spec". |
| **Architecture Decision Record** | The immutable decision document. Must not be shortened casually or replaced. |

---

## 6. Deprecated Terms

The following terms should no longer be used. Their replacements are specified below.

| Deprecated Term | Replace With | Migration Guidance |
|-----------------|--------------|-------------------|
| Store (when referring to a Desk) | Desk | The term "Store" implies only retail. Desk is surface-agnostic and applies to any industry. |
| App (when a more specific term exists) | Desk, Workspace, or Tool | "App" is too generic. Use Desk for tenant surfaces, Workspace for Builder contexts, Tool for developer utilities. |
| Project (when referring to a Desk or Workspace) | Desk or Workspace | "Project" is ambiguous. It could mean a software project, a construction project, or a platform concept. Use Desk or Workspace as appropriate. |
| Plugin (when referring to an Extension) | Extension | Plugin implies narrow component extension. Extension implies full capability addition. Use Plugin only for specific component extension points. |
| Addon | Extension or Module | Addon is informal. Extension (third-party) or Module (platform-provided) are the correct terms. |
| Skin (when referring to a Theme) | Theme | "Skin" implies superficial appearance changes. Theme encompasses complete visual identity including branding, not just colors. |
| Endpoint (when referring to an API) | API or Operation | Endpoint is an implementation detail of an API. API is the correct platform term. |
| Backend (as a generic term) | Service or Platform | Backend is vague. Use Service for specific backend components or Platform for the complete backend system. |
| Frontend (as a generic term) | Renderer or Surface | Frontend is too generic. Use Renderer (the rendering layer) or Surface (the target platform). |

---

## 7. Naming Governance

### 7.1 Introducing New Terminology

New terminology must follow this process:

1. **Identify the gap.** Determine that an existing term does not cover the concept and that a new term is required.
2. **Check for synonyms.** Verify that the concept is not already covered by an existing term under a different name.
3. **Write a proposal.** Describe the concept, its definition, its relationships to existing terms, and why a new term is needed.
4. **Write an ADR.** Terminology changes require an Architecture Decision Record. The ADR must explain why the new term is necessary, how it relates to existing terms, and how existing documents will be updated.
5. **Submit for review.** The ADR and glossary change are reviewed through the standard governance process.
6. **Update the glossary.** Once approved, the term is added to this document with its full definition.
7. **Update affected documents.** All Specifications, documentation, and implementation references that should use the new term are updated.
8. **Announce the change.** The change is communicated to the engineering team and AI assistants through the Progress Registry.

### 7.2 Modifying Existing Terminology

Changes to existing term definitions follow the same process as new terminology, with additional requirements:

- The ADR must document the rationale for the change and the impact on existing documents.
- A migration plan must be provided for affected Specifications and implementations.
- The old definition and the reason for its change are recorded in the Deprecated Terms section.
- Term renames are strongly discouraged. They cause cascading updates across the entire Knowledge Base.

### 7.3 Compatibility

New terminology must not conflict with existing reserved terms. Existing terms must not be redefined to accommodate new concepts. When a genuinely new concept overlaps with an existing term, the existing term takes precedence and the new concept must find a distinct name.

---

## 8. AI Usage

AI assistants operating within the DUKADESK ecosystem must follow these terminology rules:

1. **Use glossary terminology consistently.** Never substitute synonyms, abbreviations, or informal variations of platform terms.
2. **Avoid introducing synonyms.** When generating output, use the exact canonical term defined in this glossary. Never introduce alternative names for existing concepts.
3. **Reference glossary definitions.** When platform terms are used in generated content, the definitions in this glossary are the authoritative source. AI assistants must not redefine terms inline.
4. **Recommend glossary updates when new concepts emerge.** If an AI assistant identifies a concept that is not covered by existing terminology, it should recommend a glossary addition through the governance process — not create an ad-hoc term.
5. **Flag terminology violations.** AI assistants acting as Review Agents must flag violations of glossary-defined terminology in Specifications, documentation, and implementation artifacts.
6. **Use qualified terms when needed.** When the context is ambiguous (e.g., "user" could mean platform user, tenant user, or end user), AI assistants must use qualified terms to avoid ambiguity.

---

## 9. Future Expansion

This glossary is expected to grow alongside the platform. As new Capabilities, Modules, Services, SDKs, Renderers, and platform features are added, the terminology will expand to cover them.

**Expansion principles:**

- New terms extend existing terminology categories. They do not replace or redefine established terms.
- New Capabilities follow the naming patterns established by existing Capabilities.
- New Services are named for their domain, not their implementation technology.
- New platform components are named for their platform role, not their technical implementation.
- When a new concept bridges multiple existing terms, its definition must explicitly state its relationships to each.

The glossary is never complete. It grows as the platform grows. Each addition strengthens the shared vocabulary and reduces ambiguity.

---

## 10. Compliance

Adherence to this document is mandatory for all platform Specifications, implementations, documentation, and AI-generated output.

- Specifications must use glossary-defined terminology without deviation.
- Implementation code must use glossary-defined names for platform concepts in identifiers, comments, and documentation.
- Documentation must use glossary-defined terms and must not introduce synonyms.
- Alignment Reviews must verify terminology compliance as part of the review process.
- Violations of glossary-defined terminology are findings that must be resolved before a Specification can be marked Verified.

---

## 11. References

| Reference | Relationship |
|-----------|-------------|
| KB-001 | README — defines the Knowledge Base structure and the One Concept Has One Definition principle |
| KB-002 | Platform Terminology & Glossary (this document) — establishes the vocabulary that all platform documents use |
| KB-003 | Platform Philosophy — defines the engineering principles that this terminology operationalizes |
| KB-011 | Naming Standards — defines the naming conventions for identifiers, files, APIs, and events |
| README.md | Repository README — defines the Knowledge Base governance context |

---

## 12. Review Checklist

- [ ] Metadata header: KB-ID, Version, Status, Owner, Review Status, Last Updated, Depends On, Required By
- [ ] Purpose section explains why standardized terminology matters
- [ ] Naming Philosophy defines the principles governing terminology
- [ ] All core platform terms have entries with Definition, Purpose, Responsibilities, Relationships, Examples, Related Terms, and Notes
- [ ] Relationship diagrams clarify connections between terms
- [ ] Reserved Terms identify words that must not be repurposed
- [ ] Deprecated Terms provide migration guidance from old to new terminology
- [ ] Naming Governance defines how new terminology is introduced
- [ ] AI Usage provides specific guidance for AI assistants
- [ ] Future Expansion explains how the glossary grows
- [ ] No internal contradictions between term definitions
- [ ] All cross-references use canonical names
- [ ] No contradictions with KB-003
- [ ] Revision History documents all changes

---

## 13. Revision History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 0.1.0 | 2026-07-09 | Engineering | Initial draft |

---

**Parent:** README.md
**See also:** KB-003 — Platform Philosophy, KB-011 — Naming Standards
