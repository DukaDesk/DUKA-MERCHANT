# Service Level Indicators

This document defines the SLIs used to measure SLOs.

## Purpose

Service Level Indicators (SLIs) are the metrics used to calculate whether an SLO is met.

## SLI Categories

| Category | Examples |
|----------|----------|
| Availability | Uptime, successful request ratio |
| Latency | Response time percentiles |
| Quality | Error rate, validation failures |
| Freshness | Data update delay |
| Correctness | Data accuracy |

## SLI Definitions

### Availability

```text
SLI = successful requests / total requests
```

### Latency

```text
SLI = percentage of requests faster than threshold
```

### Error Rate

```text
SLI = error responses / total responses
```

## Measurement

- SLIs are measured from server-side metrics and, where possible, client telemetry.
- Measurement windows align with SLO windows.
- Data is collected continuously and aggregated.

## Instrumentation

Every service must:

- Expose request counts and latency.
- Tag metrics by endpoint, status, and region.
- Log errors with context.

## SLI Dashboards

SLIs are displayed on service dashboards. See [OBSERVABILITY_MODEL.md](OBSERVABILITY_MODEL.md).

## Review

SLIs are reviewed with SLOs quarterly to ensure they remain accurate and relevant.
