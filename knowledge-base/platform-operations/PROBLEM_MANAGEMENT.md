# Problem Management

This document defines how recurring or root-cause issues are tracked and resolved.

## Purpose

Problem Management identifies, tracks, and eliminates the root causes of incidents. It complements Incident Management, which focuses on immediate restoration.

## Problem Sources

- Recurring incidents
- Postmortem action items
- Trend analysis of alerts
- Capacity or performance degradation

## Problem Lifecycle

```text
Identify
    ↓
Record
    ↓
Investigate
    ↓
Root Cause Analysis
    ↓
Plan Fix
    ↓
Implement Fix
    ↓
Verify
    ↓
Close
```

## Root Cause Analysis

Use techniques such as:

- 5 Whys
- Fishbone diagrams
- Timeline reconstruction
- Dependency mapping

## Problem Records

Each problem is recorded with:

- Related incidents
- Impact assessment
- Root cause hypothesis
- Action plan
- Owner
- Status

## Verification

A problem is closed only when:

- The fix is implemented.
- Monitoring confirms resolution.
- Related incident frequency decreases.

## Knowledge Base

Resolved problems are candidates for Knowledge Base updates, runbooks, and architecture changes.
