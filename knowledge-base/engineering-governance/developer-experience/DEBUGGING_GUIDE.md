# Debugging Guide

This document provides procedures for debugging issues across DUKADESK OS repositories.

## Debugging Mindset

1. Reproduce the issue.
2. Isolate the cause.
3. Form a hypothesis.
4. Test the hypothesis.
5. Apply and verify the fix.

## Local Debugging

### Logs
- Check application logs at the appropriate log level.
- Use structured logging where available.
- Correlate logs with trace IDs.

### Traces
- Use distributed tracing to follow requests across services.
- Identify latency and failure points.

### Breakpoints
- Use IDE breakpoints for step-by-step inspection.
- Attach to running processes when needed.

### Environment
- Confirm the issue reproduces in a clean environment.
- Check environment variables and configuration.

## Common Issues

| Symptom | Possible Cause | Action |
|---------|----------------|--------|
| Tests fail locally but pass in CI | Environment mismatch | Compare versions and env vars |
| Build fails | Missing dependency | Run bootstrap, check lock files |
| Slow performance | N+1 queries, missing indexes | Profile and optimize |
| Intermittent failures | Race conditions | Add synchronization or retries |
| Authentication errors | Token expiry or misconfiguration | Check secrets and clocks |

## Production Debugging

1. Use observability dashboards.
2. Check recent deployments and releases.
3. Correlate errors with logs and traces.
4. Reproduce in staging if possible.
5. Apply hotfixes through the hotfix process.

## Escalation

Escalate to a human when:

- A security incident is suspected.
- Data loss or corruption is possible.
- The issue affects production users broadly.

## Documentation

After resolving a significant issue:

1. Update runbooks.
2. Add regression tests if applicable.
3. Record findings in the Knowledge Base if architecture changed.
