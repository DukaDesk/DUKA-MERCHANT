# DUKADESK Core Principles

**KB-004 — Part I: Foundation | Core Principles**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-004 |
| Title | Core Principles |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Engineering |
| Depends On | KB-003 (Platform Philosophy) |
| Required By | All KB documents, all specifications, all implementations |
| Review Status | Not Reviewed |
| Last Updated | 2026-07-09 |

## Meta-Principles

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | **One concept has one definition.** | Every term has a single, authoritative definition. No synonyms. No redefinitions. |
| 2 | **Architecture precedes implementation.** | Architecture decisions are made before code is written. Implementation validates architecture; it does not define it. |
| 3 | **Alignment precedes verification.** | A specification must be reviewed against the Knowledge Base before it can be marked Verified. |
| 4 | **Verified specifications precede implementation.** | Code is written from Verified specifications. Implementation that deviates is a defect. |
| 5 | **The Knowledge Base is the product's memory.** | If a conflict exists, it is resolved through the Knowledge Base — not through code or conversation. |

## Platform Design Principles

### 1. Server-Driven UI (SDUI) First
The client renders what the server defines. JSON is the source of truth for screen structure, component composition, and action definitions. The client should never hardcode screen layouts or navigation flows.

### 2. Data-Driven Actions
All interactive behavior is expressed through the Action System. Components dispatch named actions from their RuntimeNode. Handlers are registered in ActionEngine. This keeps behavior declarative and server-configurable.

### 3. Decoupled Components
Components are independent and communicate only through props (from JSON data via RegistryRenderer), EventBus (for cross-component communication), and Action System (for user-triggered behavior). Components never import or reference each other directly.

### 4. Backend-Compatible Data
JSON data files mirror what a real backend would serve. The mock client can be swapped for an HTTP client without data format changes.

### 5. Progressive Enhancement
Capabilities are declared in the manifest. Module default screens provide baseline functionality. Tenant-specific screens override module defaults.

### 6. Architecture Consistency over Convenience
When implementation convenience conflicts with architectural consistency, the architecture wins. Patterns are applied universally, even when a simpler direct solution exists.

### 7. Traceability
Every architectural decision has an ADR. The Knowledge Base is the primary source of truth. All implementation repositories reference the Knowledge Base version they align with.
