# Code Style Standards

**Last Updated:** 2026-07-09

## General
- 2-space indentation
- Semicolons required
- Single quotes preferred
- Trailing commas in multiline objects/arrays
- 120 character line limit

## TypeScript
- `strict: true` in tsconfig
- Prefer `type` over `interface` for object types
- Use `unknown` instead of `any`
- Use type guards for narrowing
- Use `as const` for literal types
- Use `satisfies` for type validation

## Imports
Group imports in order, separated by blank lines:
1. React / React Native
2. Third-party libraries (expo, axios, zustand)
3. Internal modules (components, runtime, services, store)
4. Types

## Components
- Use default exports for components
- Function components only (no class components)
- Props type named `Props` (file-private)
- Destructure props in function signature
- StyleSheet.create at bottom of file

## Naming
- React components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types: PascalCase
- Files: PascalCase for components, camelCase for utilities
- Event names: `{domain}:{event}` format

## Testing
- Component tests: React Native Testing Library
- Store tests: test with Zustand directly
- Action tests: unit test handlers with mock actions

## Commit Messages
Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `chore:`
