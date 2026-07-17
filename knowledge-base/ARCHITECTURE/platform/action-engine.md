# Action Engine

## Purpose

The Action Engine is a Platform Core capability responsible for executing actions triggered by user interactions, system events, business rules, or automated workflows.

It provides a unified mechanism for invoking behavior across components, services, and domains while maintaining context, permissions, and observability.

The Action Engine is not a business domain. It powers actions used by every business domain and application within DUKADESK.

---

## Responsibilities

The Action Engine owns:

• Action registration

• Action routing

• Action execution

• Action validation

• Action context

• Action permissions

• Action retries

• Action observability

---

## Objectives

The Action Engine ensures that:

• Actions are defined once and reusable across experiences.

• Action execution is secure, authorized, and auditable.

• Actions can be triggered synchronously or asynchronously.

• Action context is preserved and propagated correctly.

• Failures are handled, retried, and reported consistently.

• Action execution remains independent of business logic implementation.

---

## Capabilities

The Action Engine provides:

### Action Registration

Registers actions with identifiers, schemas, handlers, and metadata.

### Action Routing

Routes action invocations to the correct handler based on action type and context.

### Action Execution

Executes action handlers within the appropriate runtime environment.

### Action Validation

Validates action inputs, permissions, and preconditions.

### Action Context

Provides execution context including identity, tenant, session, and state.

### Action Retries

Retries failed actions according to configurable policies.

---

## Interfaces

The Action Engine exposes interfaces for:

Register action

Invoke action

Validate action

Cancel action

List actions

Get action metadata

Subscribe to action events

Query action status

---

## Contracts

Input: Action identifier, payload, context, identity, tenant.

Output: Action result, side effects, events, status.

Errors: Validation errors, permission denied, handler not found, execution failure, timeout.

---

## Request Flow

```text
Action Invocation
  │
  ▼
Permission Check
  │
  ▼
Input Validation
  │
  ▼
Handler Resolution
  │
  ▼
Context Injection
  │
  ▼
Action Execution
  │
  ▼
Result / Side Effects / Events
```

---

## SLAs

Latency: Action execution must meet defined latency thresholds based on action type.

Availability: Action Engine must meet platform availability targets.

Throughput: Must support high volumes of concurrent action invocations.

Reliability: Actions must be executed at least once where required.

---

## Failure Modes

Handler not found

Permission denied

Input validation failure

Execution timeout

Handler exception

Context missing

Retry exhaustion

Circuit breaker open

---

## Recovery

Missing handlers return explicit errors.

Permission failures are logged and surfaced securely.

Validation failures reject the action with detailed errors.

Timeouts trigger cancellation and retry policies.

Retry exhaustion routes actions to dead-letter handling.

---

## Scaling Strategy

Action Engine scales horizontally with stateless execution workers.

Asynchronous actions are queued and processed by background workers.

Synchronous actions are optimized for low-latency response.

Regional deployment reduces latency for global users.

---

## Dependencies

Action Engine depends on Identity for authentication and authorization context.

Action Engine depends on Tenant Management for tenant context.

Action Engine depends on the Event Bus for emitting action-related events.

Action Engine depends on the Runtime Engine for execution context.

Action Engine may depend on Background Processing for asynchronous actions.

---

## Engineering Specification Mapping

Engineering Specifications referencing this capability include:

Action System Specifications

Component System Specifications

Workflow Orchestration Specifications

Security Specifications

Event Specifications

Background Processing Specifications

---

## Ownership

Owner: Platform Engineering

Primary Repository: TBD

---

## Critical Platform Rule

All action execution, routing, validation, and observability within DUKADESK SHALL be coordinated through the Action Engine. No domain or application shall implement independent action invocation logic outside this Platform Core capability.