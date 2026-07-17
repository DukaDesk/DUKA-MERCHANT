# ADR-012: Provider Adapter Pattern

**Status:** ✅ Accepted  
**Date:** 2026-07-01  
**Author:** Architecture Team

## Context

The platform integrates with multiple third-party providers for payments (Paystack, Flutterwave, Stripe), notifications (SendGrid, Resend, SES, SMTP for email; Twilio, Termii, AfricaTalking for SMS; Expo, FCM, APNS for push), and integrations (SendGrid, Google Calendar). Each provider has a different API, but the platform needs a uniform interface.

## Decision

Use the **Adapter Pattern** — define a common interface per domain, implement adapters for each provider:

### Payment Adapters

```
PaymentAdapter interface:
  initializePayment(request) → PaymentResponse
  verifyPayment(reference) → VerifyResponse
  refundPayment(request) → RefundResponse
  healthCheck() → HealthCheckResult

Implementations: PaystackAdapter, FlutterwaveAdapter, StripeAdapter
```

### Notification Adapters

```
EmailAdapter: send(payload) → EmailResult
  Implementations: sendgrid | resend | ses | smtp | log

PushAdapter: send(payload) → PushResult
  Implementations: expo | fcm | apns | log

SmsAdapter: send(payload) → SmsResult
  Implementations: twilio | termii | africa_talking | log
```

### Integration Connectors

```
IntegrationConnectorInterface:
  connect(config) → ConnectorResult
  disconnect()
  testConnection() → TestResult
  sync(params) → SyncResult

Implementations: SendGridConnector, GoogleCalendarConnector
```

### Provider Selection

- Provider is selected per-tenant via `TenantPaymentAccount` (payments) or env var (notifications)
- Default log provider outputs to console for development
- Adapters are injected via constructor and registered in a Map

## Consequences

- Adding a new provider requires only a new adapter class implementing the interface
- The `log` provider enables development without real API keys
- Provider health checks enable monitoring and graceful degradation
- Each adapter encapsulates its own API quirks and error handling

## Status

Accepted. Implemented for payments (3 providers), notifications (10+ provider variants), and integrations (2 connectors). Log adapters used by default when API keys are absent.
