# Architecture Decision Records — Index

<<<<<<< HEAD
**Last Updated:** 2026-07-20
=======
**Last Updated:** 2026-07-17
>>>>>>> origin/main

Template: `ADR-000-template.md`

| ID | Title | Status | Date |
|----|-------|--------|------|
| ADR-001 | Runtime Engine Architecture | ✅ Accepted | 2026-06-01 |
| ADR-002 | Data-Driven Screen System | ✅ Accepted | 2026-06-05 |
| ADR-003 | Action System Design | ✅ Accepted | 2026-06-10 |
| ADR-004 | Event Bus for Cross-Component Communication | ✅ Accepted | 2026-06-30 |
| ADR-005 | Branded Splash Screen | ✅ Accepted | 2026-07-09 |
| ADR-006 | Knowledge Base Initialization | ✅ Accepted | 2026-07-09 |
| ADR-007 | Modular Monolith Architecture | ✅ Accepted | 2026-07-01 |
| ADR-008 | Prisma ORM with PostgreSQL | ✅ Accepted | 2026-07-01 |
| ADR-009 | JWT + Refresh Token Authentication | ✅ Accepted | 2026-07-01 |
| ADR-010 | SDUI Publishing Pipeline | ✅ Accepted | 2026-07-01 |
| ADR-011 | Tenant Resolution Strategy | ✅ Accepted | 2026-07-01 |
| ADR-012 | Provider Adapter Pattern | ✅ Accepted | 2026-07-01 |
<<<<<<< HEAD
| ADR-013 | Account Deactivation & Deletion | ✅ Accepted | 2026-07-20 |

> **ADR-013 Note:** Account deactivation uses a 30-day soft deactivation flow (status = `deactivated`, `deactivatedAt`, `scheduledDeletionAt`) before permanent deletion, plus an immediate hard delete option for GDPR/Apple/Google compliance. Reactivation is permitted within the 30-day window. Admin cleanup endpoint purges expired deactivated accounts. Events: `user.deactivated`, `user.reactivated`, `user.permanently_deleted`, `user.auto_deleted_after_30_days`.
=======
| ADR-013 | Builder Template Gallery and Section Editor Redesign | ✅ Accepted | 2026-07-17 |
>>>>>>> origin/main
