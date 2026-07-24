# DUKADESK Naming Standards

**KB-011 — Part III: Engineering Standards**

| Metadata | Value |
|----------|-------|
| KB-ID | KB-011 |
| Title | Naming Standards |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Engineering |
| Depends On | KB-003 (Platform Philosophy), KB-004 (Core Principles) |
| Required By | All specifications, all implementations |
| Review Status | Not Reviewed |
| Last Updated | 2026-07-09 |

## Screen IDs
Lowercase, singular nouns, hyphen-separated. Examples: `menu`, `orders`, `notifications`.

## File Names
- Screen JSON files: `{screenId}-screen.json` (e.g., `menu-screen.json`)
- Component files: PascalCase (e.g., `CategoryPillsSection.tsx`)
- Store files: camelCase (e.g., `tenantStore.ts`)
- Type files: camelCase (e.g., `types.ts`)
- Utility files: camelCase (e.g., `EventBus.ts`)
- KB documents: `{name}.md` (e.g., `GLOSSARY.md`, `CORE_PRINCIPLES.md`)
- ADRs: `ADR-NNN-{kebab-case-title}.md` (e.g., `ADR-001-runtime-engine-architecture.md`)
- Specifications: `{kebab-case-title}.md` (e.g., `runtime-engine.md`)

## Runtime Nodes
- `key` field: kebab-case (e.g., `category-pills`, `menu-items`)
- `type` field: snake_case (e.g., `category_pills`, `menu_grid`)
- `actions` keys: camelCase (e.g., `addItem`, `selectOrder`)

## Action Types
snake_case (e.g., `add_to_cart`, `switch_screen`, `api_request`)

## Event Names
Namespaced with colon separator: `{domain}:{action}` (e.g., `navigation:switch_screen`, `filter:changed`)

## Tenant IDs
kebab-case, matches directory name (e.g., `mamas-kitchen`, `grace-pharmacy`)

## API Endpoints
Lowercase, forward-slash separated (e.g., `/orders`, `/notifications/n1/dismiss`)

## Git Branches
Lowercase, hyphen-separated, no personal namespaces (e.g., `feat/splash-screen`, `fix/action-type`)
