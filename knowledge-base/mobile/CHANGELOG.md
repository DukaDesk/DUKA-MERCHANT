# Changelog

All notable changes to the mobile repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Complete runtime data for Bella Italia tenant — 12 packages (application, authentication, home, menu, cart, orders, reservations, profile, wallet, loyalty, notifications/settings/support, content, publish, validation)
- 10 JSON schemas, 10 validators, 6 integrity checks, 14 runtime tests, 6 renderer tests, 5 publish tests, 3 reports in validation package
- HeroBanner component with dark overlay gradient
- Categories tab with grid/list toggle + search + QR scanner button
- CategoryTenantsScreen for filtered tenant lists by category
- 20 desk categories with slug/icon/color/bg/tenantCount
- 16 nearby stores across 14 categories
- Global action loading store for button double-submit prevention
- AuthPromptModal for guest mode blocking
- Guest mode ("Explore App" on onboarding slide 3)
- ValidationModal with `actions` prop for confirm/cancel dialogs
- EAS auto-submit for Android via `scripts/run-eas.mjs`
- ProGuard/R8 rules for Nitro and MMKV keep
- MMKV storage factory with per-instance error handling + Map fallback

### Changed

- App icon replaced with Dukalogo.png, splash bg set to navy #1a1a2e
- Google auth refactored to lazy-import expo-web-browser and expo-auth-session
- Back button on tenant homepage replaced with DukaDesk logo
- ExploreScreen: fixed header/search, nestedScrollEnabled, opaque backgrounds, no TouchableWithoutFeedback
- Scanner icon moved outside search box to its own 48x48 inline button
- Route warnings silenced, duplicate capability registration suppressed
- Zero Alert.alert — all replaced with ValidationModal

### Fixed

- Google auth static import crash on native module unavailable
- API response envelope unwrapping in getCategories and category pills
- ErrorBoundary logging, duplicate capability registration warnings
- EAS build runner path resolution and EXPO_TOKEN injection
- Stray quote in app.json web block
