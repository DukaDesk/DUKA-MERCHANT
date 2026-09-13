# Changelog

All notable changes to the business-dashboard repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Dashboard Primitives catalog (`src/config/primitives.js`) — the sidebar and dashboard now render from the tenant's installed module set (preset ∪ user-added − user-removed).
- Integrations page: **Dashboard Primitives** section with add/remove toggles and a **Request a feature** modal (stub — dispatches `feature:requested` event; backend endpoint tracked in `backend/DASHBOARD_PRIMITIVES_BACKEND_TODO.md`).
- Persistence: `getDashboardModules` / `saveDashboardModules` write `app.modules` to tenant config with a local `dukadesk_setup` / `dd_merchant` mirror.
- Onboarding is fully integrated: business-name step (with prefilled name via tenant patch) → "What are you building?" picker. **Skip for now** removed from the desk-name step.

### Changed
- `Onboarding.jsx` "What should we call this?" → "What should we call your desk?" with non-skippable Continue.
- Signup no longer collects business name; the desk name is patched onto the tenant during onboarding.

### Changed

### Deprecated

### Removed

### Fixed

### Security
