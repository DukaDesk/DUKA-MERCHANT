# Specification: Component System

**Last Updated:** 2026-07-10

## Scope

This document describes the **implementation** of the component system for a specific platform target. For the authoritative architecture specification — registration, resolution, versioning, metadata, and platform-wide contract — see:

➡ **[`ARCHITECTURE/component-registry.md`](../ARCHITECTURE/component-registry.md)** (KB-012 — Component Registry)

KB-012 is the single source of truth for how components are registered, discovered, resolved, and rendered across all DUKADESK surfaces. This document provides platform-specific implementation details that conform to that architecture.

## Overview

Components are the building blocks of screens. They are registered in the Component Registry by type name and rendered by RegistryRenderer.

## Registration

Components register via `registerComponent(type, component)` in `src/components/register.ts`. This is a platform-specific implementation of the Registration Manager contract defined in KB-012.

## Contract

Components receive merged props (node.props + node.actions) and access `dispatchAction` through `useRuntimeContext()`.

## Patterns

- **Section Components**: CategoryPillsSection, MenuGridSection, OrderHistorySection, InfoListSection, ReportActionSection, EmptyStateSection, NotificationListSection
- **Interactive Components**: PrimaryButton (dispatches actions.default), DynamicCard (dispatches actions.addItem), Notification items (dispatch actions.tap/dismiss)

## Brand Context

Components use `useBrand()` to access theme colors from BrandThemeProvider.
