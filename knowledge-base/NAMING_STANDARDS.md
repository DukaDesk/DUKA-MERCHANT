# DUKADESK Naming Standards

**Last Updated:** 2026-07-09

## Screen IDs

- Use lowercase, singular nouns
- Hyphen-separated for compound words
- Examples: `menu`, `orders`, `notifications`, `checkout`, `products`

## File Names

- **Screen JSON files:** `{screenId}-screen.json` (e.g., `menu-screen.json`, `orders-screen.json`)
- **Component files:** PascalCase (e.g., `CategoryPillsSection.tsx`, `DynamicCard.tsx`, `PrimaryButton.tsx`)
- **Store files:** camelCase (e.g., `tenantStore.ts`, `cartStore.ts`, `sessionStore.ts`)
- **Type files:** camelCase (e.g., `types.ts`, `runtimeContext.ts`)
- **Utility files:** camelCase (e.g., `image.ts`, `EventBus.ts`)

## Runtime Nodes

- `key` field: kebab-case, descriptive (e.g., `category-pills`, `menu-items`, `notification-list`)
- `type` field: snake_case, matches the registered component name (e.g., `category_pills`, `menu_grid`, `primary_button`)
- `actions` keys: camelCase (e.g., `addItem`, `selectOrder`, `markAllRead`)

## Action Types

- snake_case (e.g., `add_to_cart`, `switch_screen`, `api_request`, `submit_form`)

## Event Names

- Namespaced with colon separator: `{domain}:{action}`
- Examples: `navigation:switch_screen`, `filter:changed`, `form:submit`

## Tenant IDs

- kebab-case, matches the directory name
- Examples: `mamas-kitchen`, `grace-pharmacy`

## API Endpoints

- Lowercase, forward-slash separated
- Examples: `/orders`, `/notifications/n1/dismiss`, `/bookings`

## Git Branches

- Feature branches: lowercase, hyphen-separated
- No personal namespaces in branch names
- Examples: `feat/splash-screen`, `fix/action-type`, `docs/knowledge-base`
