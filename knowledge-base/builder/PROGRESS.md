# Builder Progress

This file tracks the current state of the builder repository.

**Last Updated:** 2026-09-27

## Active Work

| Task | Specification | Status | Owner |
|------|---------------|--------|-------|
| Published app delivery W1–W3 | `PUBLISHED_APP_DELIVERY_MERCHANT_TODO.md` | Complete (code) — backend deployed 2026-09-27 | Merchant |
| Published app delivery W4–W5 | Backend B7 compatibility contract + live release | W4 contract now live (`GET /api/v1/compatibility`); client consumption + W5 live evidence open | Merchant / Backend |
| App sections + press actions | `APP_SECTIONS_AND_PRESS_ACTIONS_TODO.md` | Complete (code) / device verify pending | Merchant / Mobile |

## Completed Milestones

| Date | Milestone | Notes |
|------|-----------|-------|
| 2026-09-24 | Published app delivery W1–W3 | Receipt + idempotency, history≠production, real rollback endpoint — awaiting backend deploy for live proof |
| 2026-07-17 | Template Gallery | 21 templates, search, filter chips, color-block cards, "Create your own" |
| 2026-07-17 | Section Editor Redesign | PageFly-inspired inline editing, floating toolbars, editorTheme design system, 6 files rewritten |

## Blockers

| Issue | Impact | Owner |
|-------|--------|-------|
| Backend deployed (B4 migration applied, B7 contract live 2026-09-27); merchant re-publish + W5 live evidence open | W4 preflight wiring + W5 live evidence | Merchant / Release |

## Next Up

- Republish the intended latest template, capture receipt + dual-read evidence (W5)
- Consume the backend runtime-support contract (live at `GET /api/v1/compatibility`) for W4 preflight
- Device/browser verification for press actions and sections TODOs

## Last Updated

2026-09-24

## 2026-09-24 - Published app delivery W1–W3 code complete
Idempotent publish receipt, editor history separated from production activation, real backend rollback wired. Depends on backend deploy. See [merchant delivery TODO](PUBLISHED_APP_DELIVERY_MERCHANT_TODO.md).

## 2026-09-20 - App sections and navigation authoring
Implemented local builder labels, press/page attachments and editable slug persistence. Details: [implementation](APP_SECTIONS_AND_PRESS_ACTIONS_2026-09-20.md); [separate TODO](APP_SECTIONS_AND_PRESS_ACTIONS_TODO.md).

## 2026-09-20 - Merchant browser prompts replaced
Replaced all four native alert/confirm/prompt calls with shared in-app dialogs: template-save failure, oversized upload, screen deletion, and section rename. Dialogs queue concurrent requests, use native dialog focus containment, restore focus on close, support Escape/cancel, and reject blank rename submissions. Three dialog regression tests and the merchant production build passed. Source scan found no remaining native prompt calls. Existing toast notifications are unchanged.

