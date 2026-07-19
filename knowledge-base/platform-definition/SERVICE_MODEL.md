# DUKADESK Service Model

**PD-006 — Service Model**

| Metadata | Value |
|----------|-------|
| PD-ID | PD-006 |
| Title | Service Model |
| Version | 0.1.0 |
| Status | Drafting |
| Owner | Architecture |
| Last Updated | 2026-07-12 |

---

## 1. Purpose

This document maps platform capabilities to the services that implement them.

A **service** is a deployable runtime component that owns one or more capabilities or modules.

---

## 2. Service Mapping

| Service | Capabilities | Responsibility |
|---------|--------------|----------------|
| **Identity Service** | Identity | Authentication, authorization, sessions, users, roles |
| **Catalog Service** | Commerce (Catalog) | Products, variants, categories, collections |
| **Inventory Service** | Commerce (Inventory) | Stock tracking, adjustments, transfers |
| **Pricing Service** | Commerce (Pricing) | Prices, discounts, promotions |
| **Cart Service** | Commerce (Cart) | Cart state, checkout orchestration |
| **Order Service** | Orders | Order lifecycle, fulfillment, history |
| **Payment Service** | Payments | Payment processing, refunds, reconciliation |
| **Customer Service** | CRM | Profiles, segments, interactions |
| **Content Service** | CMS | Content creation, publishing, delivery |
| **Messaging Service** | Messaging | Real-time and async communication |
| **Notification Service** | Notifications | Alerts, push, email, SMS |
| **Media Service** | Media | Asset storage, transformation, delivery |
| **Analytics Service** | Analytics | Reporting, dashboards, metrics |
| **Builder Service** | Builder | Design-time metadata, publishing |
| **Runtime Service** | Builder, Applications | SDUI rendering and execution |
| **Automation Service** | Automation | Workflows, rules, scheduled jobs |
| **AI Service** | AI | Models, prompts, agents, inference |
| **Marketplace Service** | Marketplace | Extension discovery, certification, distribution |
| **Storage Service** | Storage | Structured and object storage |
| **Search Service** | Search | Indexing, querying, faceting |
| **Scheduling Service** | Scheduling | Calendars, appointments, availability |
| **Integration Service** | Integration | Connectors, webhooks, APIs |
| **Localization Service** | Localization | Translation, currency, timezone |

---

## 3. Service Principles

1. Each service owns a bounded capability domain.
2. Services do not share databases.
3. Services communicate through APIs and events.
4. Services are independently deployable and scalable.
5. Services enforce tenant isolation at every data access path.

---

## 4. Service Boundaries

Service boundaries align with capability boundaries. When a capability grows too large, it may split into multiple services.

Service boundary changes require an ADR.

---

## 5. Relationship to Architecture

The Service Model is the bridge between the Platform Definition and the system architecture documented in the Knowledge Base.
