# DUKA-BACKEND API Endpoints Reference

**Version:** 0.3.5
**Knowledge Base Version:** KB v0.3.5
**Last Updated:** 2026-09-18
**Repository:** [DUKA-BACKEND](https://github.com/DukaDesk/DUKA-BACKEND)

## Overview

This document catalogs all REST API endpoints exposed by the DUKA-BACKEND service.

- **Global Prefix:** `/api`
- **Versioning:** URI-based, default version `v1`
- **Full Path Pattern:** `/api/v1/{resource}`
- **Swagger Docs:** `/api/docs`
- **Framework:** NestJS (TypeScript/Node.js)

### Three-Tier Endpoint Architecture

| Tier | Path Prefix | Audience | Auth | Purpose |
|------|-------------|----------|------|---------|
| **Website (Platform)** | `/admin/*`, `/auth/*`, `/discovery/*`, `/templates/*`, `/bff/website/*` | Platform operators | JWT / Public | Registration, tenant creation, admin |
| **App (Tenant Self-Service)** | `/app/*` | Tenant owners/managers | JWT + `@CurrentUser` | Write + config for own tenant |
| **Mobile/Consumer** | `/merchants/:merchantId/*` | End users (public) | `@Public()` or JWT | Read-only catalog, booking, checkout |

**Tenant Resolution:** `TenantResolverService` resolves `tenantId` from authenticated user's `TenantUser` membership (`owner` or `manager` role, `active` status).

**Controller Pattern:**
- `*AppController` — `@Controller({ path: 'app/<module>' })` + `JwtAuthGuard` + `TenantResolverService`
- `*PublicController` — `@Controller({ path: 'merchants/:merchantId/<module>' })` + `@Public()` or JWT

---

## Table of Contents

1. [Auth & IAM](#1-auth--iam)
2. [Profile & Users](#2-profile--users)
3. [Merchants](#3-merchants)
4. [Templates](#4-templates)
5. [Builder (SDUI)](#5-builder-sdui)
6. [Renderer](#6-renderer)
7. [Commerce](#7-commerce)
8. [Media / DAM](#8-media--dam)
9. [QR Codes](#9-qr-codes)
10. [Discovery](#10-discovery)
11. [Admin](#11-admin)
12. [Notifications](#12-notifications)
13. [Publishing](#13-publishing)
14. [Booking & Scheduling](#14-booking--scheduling)
15. [Forms & Workflow](#15-forms--workflow)
16. [Payments](#16-payments)
17. [Theme](#17-theme)
18. [Integrations](#18-integrations)
19. [Analytics & BI](#19-analytics--bi)
20. [Search & Discovery](#20-search--discovery)
21. [AI Platform](#21-ai-platform)
22. [Platform Administration](#22-platform-administration)
23. [Infrastructure & DevOps](#23-infrastructure--devops)
24. [Security & Compliance](#24-security--compliance)
25. [Developer Platform](#25-developer-platform)
26. [Marketplace & Plugins](#26-marketplace--plugins)
27. [Asset Platform Enhanced](#27-asset-platform-enhanced)
28. [BFF - Website](#28-bff---website)
29. [BFF - Tenant Dashboard](#29-bff---tenant-dashboard)
30. [BFF - Mobile](#30-bff---mobile)
31. [BFF - Business Dashboard](#31-bff---business-dashboard)
32. [Health](#32-health)

---

## 1. Auth & IAM

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login with email and password |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout and revoke refresh tokens |
| POST | `/api/v1/auth/send-otp` | Send OTP to email |
| POST | `/api/v1/auth/verify-otp` | Verify OTP code |
| POST | `/api/v1/auth/google` | Sign in / register with Google ID token |
| POST | `/api/v1/auth/apple` | Sign in / register with Apple identity token |

### Recovery

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |

### Device Management

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/devices/register` | Register a device |
| GET | `/api/v1/devices` | List all devices |
| PUT | `/api/v1/devices/:id` | Update device metadata |
| DELETE | `/api/v1/devices/:id` | Revoke a device |

---

## 2. Profile & Users

### Admin - User Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/users` | List all users (paginated, filter: email, role, tenant, status) |
| GET | `/api/v1/admin/users/:id` | Get user detail |
| POST | `/api/v1/admin/users/:id/approve` | Approve a pending/suspended user (set status to active) |
| POST | `/api/v1/admin/users/:id/reject` | Reject a user (set status to suspended) |
| POST | `/api/v1/admin/users/:id/invite` | Invite user to tenant |
| POST | `/api/v1/admin/users/:id/roles` | Assign/update roles for user |
| DELETE | `/api/v1/admin/users/:id` | Remove user from platform |
| GET | `/api/v1/admin/users/merchant/:merchantId` | Users scoped to a merchant |
| GET | `/api/v1/admin/users/tenant/:tenantId` | Users scoped to a tenant (legacy alias) |

### Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/bff/mobile/profile` | Get aggregated current-user profile |
| POST | `/api/v1/app/security/consent` | Record mobile app security/consent state |
| POST | `/api/v1/bff/mobile/profile/deactivate` | Deactivate profile (30-day soft delete) |
| POST | `/api/v1/bff/mobile/profile/reactivate` | Reactivate within 30-day window |
| DELETE | `/api/v1/bff/mobile/profile` | Immediate permanent deletion |
| GET | `/api/v1/bff/mobile/profile/deactivation-status` | Check deactivation status |

---

## 3. Merchants

### Platform (Website)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/merchants` | Create a new merchant (JWT) |
| GET | `/api/v1/merchants/:id` | Get merchant by ID (public) |
| GET | `/api/v1/merchants/:id/features` | Get enabled capabilities (public) |

### App Self-Service (Merchant Owner)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/app/merchants` | Get apps owned by the authenticated merchant |
| PUT | `/api/v1/app/merchants` | Update the current app |
| POST | `/api/v1/app/merchants/publish` | Publish the current app |
| GET | `/api/v1/app/merchants/config` | Get the current app runtime configuration |
| PUT | `/api/v1/app/merchants/config` | Update the current app runtime configuration |
| GET | `/api/v1/app/merchants/subscription` | Get current merchant subscription |
| POST | `/api/v1/app/merchants/subscribe` | Subscribe to a plan |
| POST | `/api/v1/app/merchants/subscription/cancel` | Cancel subscription |

---

## 4. Templates

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/templates` | List all templates (optional `?category=`, `?page=`, `?limit=` filters) |
| GET | `/api/v1/templates/:id` | Get template by ID (rejects inactive templates) |
| POST | `/api/v1/templates/:id/use` | Apply template to a merchant (preserves existing branding: logo, favicon, colors) |

---

## 5. Builder (SDUI)

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/draft/initialize` | Initialize drafts from published state |
| GET | `/api/v1/app/draft/status` | Get draft workspace status |
| POST | `/api/v1/app/draft/discard` | Discard all drafts and reset |
| GET | `/api/v1/app/pages` | Get all draft pages for current merchant |
| PUT | `/api/v1/app/pages/:pageId` | Update a draft page |
| DELETE | `/api/v1/app/pages/:pageId` | Delete a draft page |
| POST | `/api/v1/app/pages/:pageId/sections` | Add a section to a draft page |
| PUT | `/api/v1/app/sections/:sectionId` | Update a draft section |
| DELETE | `/api/v1/app/sections/:sectionId` | Delete a draft section |
| POST | `/api/v1/app/sections/:sectionId/components` | Add a component to a draft section |
| PUT | `/api/v1/app/components/:componentId` | Update a draft component |
| DELETE | `/api/v1/app/components/:componentId` | Delete a draft component |
| GET | `/api/v1/app/navigation` | Get navigation for current merchant |
| PUT | `/api/v1/app/navigation` | Update navigation |
| GET | `/api/v1/app/component-types` | Get all registered component definitions |
| GET | `/api/v1/app/component-types/:type` | Get a specific component type definition |
| GET | `/api/v1/app/action-types` | Get all registered action definitions |
| POST | `/api/v1/app/actions/execute` | Execute an action with given context |
| POST | `/api/v1/app/conditions/evaluate` | Evaluate conditional visibility |
| POST | `/api/v1/app/data-binding/resolve` | Resolve a data binding against context |
| POST | `/api/v1/app/preview` | Preview full merchant rendering (from drafts) |
| POST | `/api/v1/app/pages/:pageId/preview` | Preview a single draft page |
| POST | `/api/v1/app/component-preview` | Validate and preview a component |
| GET | `/api/v1/app/theme` | Get theme for current merchant |
| PUT | `/api/v1/app/theme` | Update theme |

### Public (Mobile/Consumer)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:merchantId/pages` | Get all pages for a merchant |
| PUT | `/api/v1/merchants/:merchantId/pages/:pageId` | Update a page |
| POST | `/api/v1/merchants/:merchantId/pages/:pageId/sections` | Add a section to a page |
| PUT | `/api/v1/merchants/:merchantId/sections/:sectionId` | Update a section |
| POST | `/api/v1/merchants/:merchantId/sections/:sectionId/components` | Add a component to a section |
| PUT | `/api/v1/merchants/:merchantId/components/:componentId` | Update a component |
| GET | `/api/v1/merchants/:merchantId/navigation` | Get navigation for a merchant |
| PUT | `/api/v1/merchants/:merchantId/navigation` | Update navigation |

---

## 6. Renderer

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:id/definition` | Get deployed published app definition (reads from Release.manifest; optional `?version=X.Y.Z`) |
| GET | `/api/v1/resolve/:slug` | Resolve merchant by slug |

---

## 7. Commerce

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/commerce/categories` | Create category |
| GET | `/api/v1/app/commerce/categories` | List categories |
| PUT | `/api/v1/app/commerce/categories/:id` | Update category |
| DELETE | `/api/v1/app/commerce/categories/:id` | Delete category |
| POST | `/api/v1/app/commerce/products` | Create product with variants |
| GET | `/api/v1/app/commerce/products` | List products with filter, sort, pagination |
| PUT | `/api/v1/app/commerce/products/:id` | Update product |
| DELETE | `/api/v1/app/commerce/products/:id` | Delete product |
| PUT | `/api/v1/app/commerce/products/:id/extended-pricing` | Set multi-currency pricing |
| POST | `/api/v1/app/commerce/products/:id/variants` | Add variant to product |
| PUT | `/api/v1/app/commerce/variants/:id` | Update variant |
| DELETE | `/api/v1/app/commerce/variants/:id` | Delete variant |
| POST | `/api/v1/app/commerce/products/:id/reserve` | Reserve inventory |
| POST | `/api/v1/app/commerce/reservations/:id/release` | Release inventory reservation |
| POST | `/api/v1/app/commerce/reservations/:id/confirm` | Confirm reservation and deduct inventory |
| POST | `/api/v1/app/commerce/products/:id/adjust-stock` | Adjust stock level |
| POST | `/api/v1/app/commerce/coupons` | Create coupon |
| GET | `/api/v1/app/commerce/coupons` | List coupons |
| PUT | `/api/v1/app/commerce/coupons/:id` | Update coupon |
| DELETE | `/api/v1/app/commerce/coupons/:id` | Delete coupon |
| POST | `/api/v1/app/commerce/tax-rules` | Create tax rule |
| GET | `/api/v1/app/commerce/tax-rules` | List tax rules |
| PUT | `/api/v1/app/commerce/tax-rules/:id` | Update tax rule |
| DELETE | `/api/v1/app/commerce/tax-rules/:id` | Delete tax rule |
| GET | `/api/v1/app/commerce/orders` | List orders |
| POST | `/api/v1/app/commerce/orders/:id/status` | Update order status |
| POST | `/api/v1/app/commerce/orders/:orderId/fulfillments` | Create fulfillment |
| PATCH | `/api/v1/app/commerce/fulfillments/:id` | Update fulfillment status |

### Public (Mobile/Consumer)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:merchantId/categories` | List categories |
| GET | `/api/v1/merchants/:merchantId/products` | List products |
| GET | `/api/v1/products/:id` | Get product with variants |
| GET | `/api/v1/product-types` | List valid product types |
| GET | `/api/v1/merchants/:merchantId/products/type/:type` | List products by type |
| GET | `/api/v1/products/:id/price` | Get product price in specific currency |
| GET | `/api/v1/products/:id/stock` | Get available stock for product/variant |
| POST | `/api/v1/app/commerce/cart` | Get or create authenticated cart |
| GET | `/api/v1/app/commerce/cart/:id` | Get cart with items |
| POST | `/api/v1/app/commerce/cart/:id/items` | Add item to cart |
| PATCH | `/api/v1/app/commerce/cart/items/:itemId` | Update cart item quantity |
| DELETE | `/api/v1/app/commerce/cart/items/:itemId` | Remove item from cart |
| POST | `/api/v1/app/commerce/cart/:id/coupon` | Apply coupon to cart |
| DELETE | `/api/v1/app/commerce/cart/:id/coupon` | Remove coupon from cart |
| POST | `/api/v1/app/commerce/cart/:id/checkout` | Convert cart to order |
| GET | `/api/v1/app/commerce/orders` | List authenticated orders |
| GET | `/api/v1/app/commerce/orders/:id` | Get order detail |
| GET | `/api/v1/app/commerce/tax-calc` | Calculate tax |

---

## 8. Media / DAM

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/media/upload` | Upload file with optimization & variant generation |
| GET | `/api/v1/app/media` | List media files (optionally filtered by folder) |
| GET | `/api/v1/app/media/:id` | Get media details with versions |
| PATCH | `/api/v1/app/media/:id` | Update media metadata |
| DELETE | `/api/v1/app/media/:id` | Delete media file and all variants |
| GET | `/api/v1/app/media/:id/cdn-url` | Get CDN delivery URL |
| POST | `/api/v1/app/media/folders` | Create asset folder |
| GET | `/api/v1/app/media/folders` | List asset folders |
| PATCH | `/api/v1/app/media/folders/:id` | Update folder |
| DELETE | `/api/v1/app/media/folders/:id` | Delete empty folder |

---

## 9. QR Codes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/qr/generate/:merchantId` | Generate QR code data for a merchant (JWT) |
| GET | `/api/v1/qr/resolve/:slug` | Resolve QR code slug to merchant (public) |

---

## 10. Discovery

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/discovery/featured` | Get featured / popular merchants |
| GET | `/api/v1/discovery/search` | Search merchants |
| GET | `/api/v1/discovery/categories` | Get discover categories |
| GET | `/api/v1/discovery/nearby` | Get nearby merchants |

---

## 11. Admin

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/admin/merchants` | Create a new merchant |
| POST | `/api/v1/admin/merchants/:id/approve` | Approve a merchant |
| POST | `/api/v1/admin/merchants/:id/suspend` | Suspend a merchant |
| DELETE | `/api/v1/admin/merchants/:id` | Soft-delete a merchant (30-day deactivation) |
| GET | `/api/v1/admin/merchants` | Get all merchants |
| GET | `/api/v1/admin/merchants/:id` | Get merchant detail |
| PUT | `/api/v1/admin/merchants/:id` | Update merchant |
| GET | `/api/v1/admin/merchants/:merchantId/settings` | Get merchant settings |
| PUT | `/api/v1/admin/merchants/:merchantId/settings/:key` | Update merchant setting |
| GET | `/api/v1/admin/stats` | Get platform stats |
| POST | `/api/v1/admin/cleanup-deactivated` | Purge expired deactivated users and tenants |

---

## 12. Notifications

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/notifications/templates` | Create notification template |
| GET | `/api/v1/app/notifications/templates` | List templates for current merchant |
| PUT | `/api/v1/app/notifications/templates/:id` | Update template |
| DELETE | `/api/v1/app/notifications/templates/:id` | Delete template |
| POST | `/api/v1/app/notifications/send-from-template` | Send notification from template |
| POST | `/api/v1/app/notifications/preferences` | Set notification preference |
| POST | `/api/v1/app/notifications/sms` | Send SMS notification |
| POST | `/api/v1/app/notifications/campaigns` | Send push/email campaign |
| POST | `/api/v1/app/notifications/campaigns/sms` | Send SMS campaign |
| POST | `/api/v1/app/notifications/:id/click` | Track notification click |
| GET | `/api/v1/app/notifications/analytics` | Notification click analytics |
| POST | `/api/v1/app/notifications/send` | Send notification directly |

### Public (User-Facing)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/notifications` | List user notifications |
| GET | `/api/v1/notifications/unread-count` | Get unread notification count |
| PUT | `/api/v1/notifications/:id/read` | Mark notification as read |
| POST | `/api/v1/notifications/mark-all-read` | Mark all notifications as read |
| GET | `/api/v1/notifications/templates` | List templates (optional tenant filter) |
| GET | `/api/v1/notifications/preferences` | Get notification preferences |
| POST | `/api/v1/notifications/devices` | Register device for push notifications |
| DELETE | `/api/v1/notifications/devices/:token` | Unregister device |
| GET | `/api/v1/notifications/analytics` | Notification click analytics |

---

## 13. Publishing

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/merchants/:id/publishing/validate` | Validate current draft tables |
| POST | `/api/v1/merchants/:id/publishing/publish` | Validate, compile drafts, create Release, clear drafts (owner/manager only) |
| GET | `/api/v1/merchants/:id/publishing/releases` | Get release history |
| GET | `/api/v1/merchants/:id/publishing/releases/:version` | Get specific release |
| POST | `/api/v1/merchants/:id/publishing/rollback/:version` | Rollback to a previous version |
| GET | `/api/v1/merchants/:id/publishing/draft` | Get current compiled draft state |

---

## 14. Booking & Scheduling

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/booking/services` | Create booking service |
| GET | `/api/v1/app/booking/services` | List booking services |
| PUT | `/api/v1/app/booking/services/:id` | Update booking service |
| DELETE | `/api/v1/app/booking/services/:id` | Delete booking service |
| POST | `/api/v1/app/booking/locations` | Create booking location |
| GET | `/api/v1/app/booking/locations` | List booking locations |
| PUT | `/api/v1/app/booking/locations/:id` | Update booking location |
| DELETE | `/api/v1/app/booking/locations/:id` | Delete booking location |
| POST | `/api/v1/app/booking/cancellation-policies` | Create cancellation policy with refund tiers |
| GET | `/api/v1/app/booking/cancellation-policies` | List cancellation policies |
| POST | `/api/v1/app/booking/staff` | Create staff member with service assignments |
| GET | `/api/v1/app/booking/staff` | List staff members |
| PUT | `/api/v1/app/booking/staff/:id` | Update staff member |
| DELETE | `/api/v1/app/booking/staff/:id` | Delete staff member |
| POST | `/api/v1/app/booking/resources` | Create booking resource |
| GET | `/api/v1/app/booking/resources` | List resources |
| PUT | `/api/v1/app/booking/resources/:id` | Update resource |
| DELETE | `/api/v1/app/booking/resources/:id` | Delete resource |
| POST | `/api/v1/app/booking/schedules` | Create schedule |
| GET | `/api/v1/app/booking/schedules` | List schedules |
| PUT | `/api/v1/app/booking/schedules/:id` | Update schedule |
| DELETE | `/api/v1/app/booking/schedules/:id` | Delete schedule |
| GET | `/api/v1/app/booking/availability` | Get available time slots |
| GET | `/api/v1/app/booking` | List bookings |
| POST | `/api/v1/app/booking/:id/status` | Update booking status |
| GET | `/api/v1/app/booking/calendar` | Get booking timeline for a date range |
| GET | `/api/v1/app/booking/waiting-list` | Get waiting list |
| POST | `/api/v1/app/booking/waiting-list/:id/notify` | Mark waiting list entry as notified |

### Public (Mobile/Consumer)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:merchantId/booking/services` | List booking services |
| GET | `/api/v1/booking/services/:id` | Get booking service with assigned staff |
| GET | `/api/v1/merchants/:merchantId/booking/locations` | List booking locations |
| GET | `/api/v1/merchants/:merchantId/booking/cancellation-policies` | List cancellation policies |
| GET | `/api/v1/booking/:id/cancellation-refund` | Calculate refund amount |
| POST | `/api/v1/booking/:id/reminders` | Schedule reminders for a booking |
| POST | `/api/v1/booking/reminders/process` | Process pending reminders |
| POST | `/api/v1/merchants/:merchantId/booking` | Create booking (public) |
| GET | `/api/v1/booking/:id` | Get booking detail with history |
| GET | `/api/v1/merchants/:merchantId/booking/availability` | Get available time slots |
| POST | `/api/v1/merchants/:merchantId/booking/waiting-list` | Add to waiting list |
| GET | `/api/v1/booking/staff/:id` | Get staff member |

---

## 15. Forms & Workflow

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/forms` | Create form with fields |
| GET | `/api/v1/app/forms` | List forms for current merchant |
| PUT | `/api/v1/app/forms/:id` | Update form (auto-increments version) |
| DELETE | `/api/v1/app/forms/:id` | Delete form |
| GET | `/api/v1/app/forms/:id/submissions` | List submissions for a form |
| GET | `/api/v1/app/forms/submissions/:id` | Get submission detail |
| POST | `/api/v1/app/forms/:id/workflow` | Set approval workflow steps |
| POST | `/api/v1/app/forms/submissions/:id/approve` | Approve or reject a submission |

### Public (Mobile/Consumer)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:merchantId/forms` | List forms for a merchant |
| GET | `/api/v1/forms/:id` | Get form with fields and workflow (public) |
| POST | `/api/v1/merchants/:merchantId/forms/:id/submit` | Submit form answers (public) |
| GET | `/api/v1/forms/:id/submissions` | List submissions for a form |
| GET | `/api/v1/submissions/:id` | Get submission detail |

---

## 16. Payments

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/payments/initialize` | Initialize a payment with provider |
| POST | `/api/v1/app/payments/:intentId/verify` | Verify payment intent with provider |
| POST | `/api/v1/app/payments/:intentId/refund` | Process a refund (partial or full) |
| POST | `/api/v1/app/payments/settlements` | Record a settlement entry |
| POST | `/api/v1/app/payments/settlements/:id/confirm` | Confirm a settlement as received |

### Public (Mobile/Consumer)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:merchantId/payments` | List payment intents |
| GET | `/api/v1/merchants/:merchantId/payments/settlements` | List settlements |
| GET | `/api/v1/merchants/:merchantId/payments/transactions` | List payment transactions |
| GET | `/api/v1/merchants/:merchantId/payments/accounts` | Get payment accounts for merchant |
| GET | `/api/v1/merchants/:merchantId/payments/health/:provider` | Check health of a payment provider |
| GET | `/api/v1/merchants/:merchantId/payments/health` | Check health of all payment providers |
| POST | `/api/v1/merchants/:merchantId/payments/webhook/:provider` | Provider webhook endpoint (public) |

---

## 17. Theme

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/app/theme` | Get current theme configuration |
| PUT | `/api/v1/app/theme` | Update theme configuration with versioning |
| GET | `/api/v1/app/theme/versions` | Get theme version history |
| GET | `/api/v1/app/theme/versions/:version` | Get a specific theme version snapshot |
| POST | `/api/v1/app/theme/versions/:version/restore` | Restore a previous theme version |
| POST | `/api/v1/app/theme/reset` | Reset theme to factory defaults |

### Public (Mobile/Consumer)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:merchantId/theme/compiled` | Get compiled theme token bundle (light + dark) |
| GET | `/api/v1/merchants/:merchantId/theme/preview` | Get theme tokens for live preview |

---

## 18. Integrations

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/integrations/connect` | Connect an integration provider |
| POST | `/api/v1/app/integrations/:provider/disconnect` | Disconnect an integration |
| POST | `/api/v1/app/integrations/:provider/test` | Test integration connection |
| POST | `/api/v1/app/integrations/:provider/sync` | Trigger a data sync |
| POST | `/api/v1/app/integrations/webhook` | Queue an outgoing webhook |
| POST | `/api/v1/app/integrations/webhooks/process` | Process pending outgoing webhooks |

### Public (Mobile/Consumer)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/merchants/:merchantId/integrations/available` | List available integration connectors |
| GET | `/api/v1/merchants/:merchantId/integrations` | List connected integrations |
| GET | `/api/v1/merchants/:merchantId/integrations/:provider` | Get integration details |
| GET | `/api/v1/merchants/:merchantId/integrations/:provider/sync-history` | Get sync job history |

---

## 19. Analytics & BI

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/analytics/events` | Track an analytics event |
| POST | `/api/v1/app/analytics/reports` | Create a saved report |
| POST | `/api/v1/app/analytics/reports/:id` | Update saved report |
| DELETE | `/api/v1/app/analytics/reports/:id` | Delete saved report |
| POST | `/api/v1/app/analytics/dashboards` | Create a dashboard |
| POST | `/api/v1/app/analytics/dashboards/:id` | Update dashboard |
| DELETE | `/api/v1/app/analytics/dashboards/:id` | Delete dashboard |
| GET | `/api/v1/app/analytics/widget-types` | Get available widget types and metrics |
| GET | `/api/v1/app/analytics/dashboards/:id/data` | Resolve all widget data for a dashboard |
| GET | `/api/v1/app/analytics/dashboards/:dashboardId/widgets/:widgetId/data` | Resolve data for a single widget |
| POST | `/api/v1/app/analytics/dashboards/:dashboardId/widgets` | Add widget to dashboard |
| POST | `/api/v1/app/analytics/dashboards/:dashboardId/widgets/:widgetId` | Update widget |
| DELETE | `/api/v1/app/analytics/dashboards/:dashboardId/widgets/:widgetId` | Remove widget |

### Public (Read-Only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/analytics/events` | Get analytics events with filters (tenantId optional, resolved from JWT) |
| GET | `/api/v1/analytics/events/aggregate` | Aggregate events by period (tenantId optional) |
| GET | `/api/v1/analytics/reports/revenue` | Revenue report (tenantId optional) |
| GET | `/api/v1/analytics/reports/users` | User analytics (tenantId optional) |
| GET | `/api/v1/analytics/reports/bookings` | Booking analytics (tenantId optional) |
| GET | `/api/v1/analytics/summary` | Dashboard summary (tenantId optional) |
| GET | `/api/v1/analytics/reports/saved` | List saved reports (tenantId optional) |
| GET | `/api/v1/analytics/reports/:id` | Get saved report (tenantId optional) |
| GET | `/api/v1/analytics/dashboards` | List dashboards (tenantId optional) |
| GET | `/api/v1/analytics/dashboards/:id` | Get dashboard with widgets (tenantId optional) |
| GET | `/api/v1/analytics/dashboards/:id/data` | Resolve all widget data for a dashboard (tenantId optional) |

---

## 20. Search & Discovery

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/app/search/index` | Index a document |
| DELETE | `/api/v1/app/search/index/:entityType/:entityId` | Remove from index |
| POST | `/api/v1/app/search/index/bulk` | Bulk index documents |
| POST | `/api/v1/app/search/synonyms` | Create search synonym |
| DELETE | `/api/v1/app/search/synonyms/:id` | Delete search synonym |

### Public (Read-Only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/search` | Full-text search |
| GET | `/api/v1/search/autocomplete` | Autocomplete suggestions |
| GET | `/api/v1/search/facets` | Get search facets |
| GET | `/api/v1/search/analytics/popular` | Popular search terms |
| GET | `/api/v1/search/analytics/no-results` | Queries with no results |
| GET | `/api/v1/search/synonyms` | List search synonyms |

---

## 21. AI Platform

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/ai/providers` | List available AI providers |
| POST | `/api/v1/ai/complete` | Generate completion |
| POST | `/api/v1/ai/embed` | Generate embedding |
| POST | `/api/v1/ai/prompts` | Create prompt template |
| GET | `/api/v1/ai/prompts` | List prompt templates |
| GET | `/api/v1/ai/prompts/:slug` | Get prompt by slug |
| POST | `/api/v1/ai/prompts/:slug/render` | Render prompt with variables |
| PUT | `/api/v1/ai/prompts/:id` | Update prompt template |
| DELETE | `/api/v1/ai/prompts/:id` | Delete prompt template |
| POST | `/api/v1/ai/providers/config` | Save provider configuration |
| GET | `/api/v1/ai/providers/config` | Get provider configurations |
| GET | `/api/v1/ai/completions` | Get completion history |
| GET | `/api/v1/ai/usage` | Get AI usage statistics |

---

## 22. Platform Administration

### Settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/settings` | Get all platform settings |
| GET | `/api/v1/admin/settings/:key` | Get a platform setting |
| PUT | `/api/v1/admin/settings/:key` | Set a platform setting |
| DELETE | `/api/v1/admin/settings/:key` | Delete a platform setting |

### Announcements

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/admin/announcements` | Create system announcement |
| GET | `/api/v1/admin/announcements` | List all announcements |
| GET | `/api/v1/admin/announcements/active` | Get active announcements |
| PUT | `/api/v1/admin/announcements/:id` | Update announcement |
| DELETE | `/api/v1/admin/announcements/:id` | Delete announcement |

### Feature Flags

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/admin/feature-flags` | Create feature flag |
| GET | `/api/v1/admin/feature-flags` | List feature flags |
| GET | `/api/v1/admin/feature-flags/:key` | Get feature flag |
| PUT | `/api/v1/admin/feature-flags/:key` | Update feature flag |
| DELETE | `/api/v1/admin/feature-flags/:key` | Delete feature flag |

### Plans & Subscriptions

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/admin/plans` | Create plan |
| GET | `/api/v1/admin/plans` | List plans |
| GET | `/api/v1/admin/plans/:id` | Get plan |
| PUT | `/api/v1/admin/plans/:id` | Update plan |
| DELETE | `/api/v1/admin/plans/:id` | Delete plan |
| GET | `/api/v1/admin/quotas/:merchantId` | Get merchant API quota |
| PUT | `/api/v1/admin/quotas/:merchantId` | Update merchant API quota |
| GET | `/api/v1/admin/subscriptions` | List all subscriptions |
| PUT | `/api/v1/admin/subscriptions/:id` | Update subscription |

### Stats

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/stats` | Get platform statistics |

---

## 23. Infrastructure & DevOps

### Deployments

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/infra/deployments` | Create a deployment |
| GET | `/api/v1/infra/deployments` | List deployments |
| GET | `/api/v1/infra/deployments/:id` | Get deployment details |
| PUT | `/api/v1/infra/deployments/:id/status` | Update deployment status |

### Environments

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/infra/environments` | Create environment |
| GET | `/api/v1/infra/environments` | List environments |
| GET | `/api/v1/infra/environments/:id` | Get environment details |
| PUT | `/api/v1/infra/environments/:id` | Update environment |
| DELETE | `/api/v1/infra/environments/:id` | Delete environment |

### Health & Monitoring

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/infra/health` | Record health check |
| GET | `/api/v1/infra/health/history` | Health check history |
| GET | `/api/v1/infra/status` | Current service status |

### Backups

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/infra/backups` | Create backup |
| GET | `/api/v1/infra/backups` | List backups |
| PUT | `/api/v1/infra/backups/:id/status` | Update backup status |

### Cache

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/infra/cache/clear` | Clear cache |
| GET | `/api/v1/infra/cache/stats` | Cache statistics |

### Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/infra/overview` | Infrastructure overview |

---

## 24. Security & Compliance

### Tenant Self-Service (App)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/app/security/policy` | Get security policy for current merchant |
| PUT | `/api/v1/app/security/policy` | Update security policy |
| POST | `/api/v1/app/security/api-keys` | Create API key |
| GET | `/api/v1/app/security/api-keys` | List API keys |
| DELETE | `/api/v1/app/security/api-keys/:id` | Revoke API key |
| POST | `/api/v1/app/security/events` | Record security event |
| GET | `/api/v1/app/security/events` | Get security events |
| GET | `/api/v1/app/security/summary` | Security summary |
| POST | `/api/v1/app/security/consent` | Record consent action |
| GET | `/api/v1/app/security/consent/:userId` | Get consent history |

### Public

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/security/validate-password` | Validate password against policy |

---

## 25. Developer Platform

### Apps

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/developer/apps` | Create developer app |
| GET | `/api/v1/developer/apps` | List developer apps |
| GET | `/api/v1/developer/apps/:id` | Get developer app |
| PUT | `/api/v1/developer/apps/:id` | Update developer app |
| POST | `/api/v1/developer/apps/:id/regenerate-secret` | Regenerate client secret |
| DELETE | `/api/v1/developer/apps/:id` | Delete developer app |

### Webhooks

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/developer/webhooks` | Create webhook endpoint |
| GET | `/api/v1/developer/webhooks` | List webhook endpoints |
| GET | `/api/v1/developer/webhooks/:id` | Get webhook endpoint |
| PUT | `/api/v1/developer/webhooks/:id` | Update webhook endpoint |
| DELETE | `/api/v1/developer/webhooks/:id` | Delete webhook endpoint |
| POST | `/api/v1/developer/webhooks/:id/trigger` | Test trigger webhook |
| GET | `/api/v1/developer/webhook-logs` | Webhook event logs |
| GET | `/api/v1/developer/webhooks/:id/retries` | Get failed webhook retries |

### Resources & Limits

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/developer/resources` | API resources and info |
| GET | `/api/v1/developer/rate-limit` | Rate limit status |

---

## 26. Marketplace & Plugins

### Listings

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/marketplace/listings` | Create marketplace listing |
| GET | `/api/v1/marketplace/listings` | Get published listings |
| GET | `/api/v1/marketplace/listings/all` | Get all listings (admin) |
| GET | `/api/v1/marketplace/listings/:slug` | Get listing by slug |
| PUT | `/api/v1/marketplace/listings/:slug` | Update listing |
| DELETE | `/api/v1/marketplace/listings/:slug` | Delete listing |
| POST | `/api/v1/marketplace/listings/:slug/download` | Record download |

### Installation

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/marketplace/install` | Install plugin |
| GET | `/api/v1/marketplace/installed` | Get installed plugins |
| PUT | `/api/v1/marketplace/installed/:listingSlug/config` | Update plugin config |
| POST | `/api/v1/marketplace/installed/:listingSlug/toggle` | Toggle plugin active state |
| DELETE | `/api/v1/marketplace/installed/:listingSlug` | Uninstall plugin |
| GET | `/api/v1/marketplace/stats` | Marketplace statistics |

---

## 27. Asset Platform Enhanced

### Collections

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/assets/collections` | Create asset collection |
| GET | `/api/v1/assets/collections` | List collections |
| GET | `/api/v1/assets/collections/:id` | Get collection with media |
| PUT | `/api/v1/assets/collections/:id` | Update collection |
| DELETE | `/api/v1/assets/collections/:id` | Delete collection |
| POST | `/api/v1/assets/collections/:collectionId/media` | Add media to collection |
| DELETE | `/api/v1/assets/collections/:collectionId/media/:mediaId` | Remove media from collection |

### Sharing

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/assets/shares` | Create share link |
| GET | `/api/v1/assets/shares` | List share links |
| GET | `/api/v1/assets/shares/:token` | Resolve share token (public) |
| DELETE | `/api/v1/assets/shares/:id` | Deactivate share link |

### Storage

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/assets/storage` | Create storage provider |
| GET | `/api/v1/assets/storage` | List storage providers |
| PUT | `/api/v1/assets/storage/:id` | Update storage provider |
| GET | `/api/v1/assets/storage/stats` | Storage statistics |

### Transforms

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/assets/transforms` | Get transformation presets |
| POST | `/api/v1/assets/transforms/:mediaId` | Transform asset |

---

## 28. BFF - Website

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/bff/website/categories` | Get public categories for website |
| GET | `/api/v1/bff/website/featured` | Get featured merchants for landing page |
| GET | `/api/v1/bff/website/pricing` | Get pricing plans |

---

## 29. BFF - Tenant Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/bff/tenant/:id/summary` | Get merchant dashboard summary |
| GET | `/api/v1/bff/tenant/:id/analytics` | Get merchant analytics (30d) |
| GET | `/api/v1/bff/tenant/:id/integrations` | Get connected integration status |

---

## 30. BFF - Mobile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/bff/mobile/tenant/:slug/manifest` | Get aggregated app manifest for mobile customers (legacy route name; response represents an app) |
| GET | `/api/v1/bff/mobile/discovery` | Get discovery feed (featured + categories) |
| GET | `/api/v1/bff/mobile/merchants/:merchantId/catalog` | Get merchant catalog with products |
| GET | `/api/v1/bff/mobile/profile` | Get aggregated user profile |
| GET | `/api/v1/bff/mobile/notifications` | Get notifications with unread count |
| POST | `/api/v1/bff/mobile/profile/deactivate` | Deactivate profile via BFF |
| POST | `/api/v1/bff/mobile/profile/reactivate` | Reactivate profile via BFF |
| DELETE | `/api/v1/bff/mobile/profile` | Immediate permanent deletion via BFF |
| GET | `/api/v1/bff/mobile/profile/deactivation-status` | Check deactivation status via BFF |

---

## 31. BFF - Business Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/bff/admin/overview` | Get platform overview stats |
| GET | `/api/v1/bff/admin/tenants` | Get paginated merchant list |
| GET | `/api/v1/bff/admin/audit` | Get recent audit logs |
| GET | `/api/v1/bff/admin/analytics` | Dashboard analytics: revenue trend, user growth, order volume, GMV, active merchants |
| GET | `/api/v1/bff/admin/revenue` | Revenue report with filters: dateFrom, dateTo, merchantId, groupBy (day/week/month) |
| GET | `/api/v1/bff/admin/tenants/:merchantId/analytics` | Per-merchant analytics (for drill-down) |

---

## 32. Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check (DB connectivity, uptime) |

---

## Endpoint Summary

| # | Module | Endpoints |
|---|--------|-----------|
| 1 | Auth & IAM | 14 |
| 2 | Profile & Users | 20 |
| 3 | Merchants | 11 |
| 4 | Templates | 3 |
| 5 | Builder (SDUI) | 28 |
| 6 | Renderer | 2 |
| 7 | Commerce | 46 |
| 8 | Media / DAM | 10 |
| 9 | QR Codes | 2 |
| 10 | Discovery | 4 |
| 11 | Admin | 13 |
| 12 | Notifications | 21 |
| 13 | Publishing | 6 |
| 14 | Booking & Scheduling | 40 |
| 15 | Forms & Workflow | 13 |
| 16 | Payments | 12 |
| 17 | Theme | 8 |
| 18 | Integrations | 10 |
| 19 | Analytics & BI | 24 |
| 20 | Search & Discovery | 11 |
| 21 | AI Platform | 13 |
| 22 | Platform Administration | 27 |
| 23 | Infrastructure & DevOps | 18 |
| 24 | Security & Compliance | 11 |
| 25 | Developer Platform | 16 |
| 26 | Marketplace & Plugins | 13 |
| 27 | Asset Platform Enhanced | 17 |
| 28 | BFF - Website | 3 |
| 29 | BFF - Tenant Dashboard | 3 |
| 30 | BFF - Mobile | 9 |
| 31 | BFF - Business Dashboard | 6 |
| 32 | Health | 1 |
| | **TOTAL** | **~447** |
