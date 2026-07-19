# Screen Specification

## Screen ID

`BD-MSG-001`

## Screen Title

Messages

## Purpose

Enable merchants to read and reply to customer messages, manage conversations, and report inappropriate content.

## Actors

- Merchant (primary)
- Customer (secondary — sends messages)

## Entry Points

- Dashboard KPI: "Unread Messages"
- Sidebar navigation: "Messages"
- Direct URL: `/dashboard/messages`

## Exit Points

- Navigate to other screens via sidebar
- Close report dialog

## Permissions

Authenticated merchant.

## Layout

Three-pane layout: conversation list (left), message thread (center), customer details (right, desktop only). On mobile, panes stack — conversation list or active chat shown at a time. Report dialog is a centered modal.

## Components

| Component | Source | Purpose |
|-----------|--------|---------|
| `Loading` | layout/States | Skeleton while conversations load |
| `Empty` | layout/States | No conversations yet |
| `ErrorState` | layout/States | API fetch failure with retry |
| Conversation list | inline | Sidebar of customer conversations |
| Message bubbles | inline | Chat thread UI |
| Customer sidebar | inline | Customer info panel (desktop) |

## Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Select conversation | Click on conversation row | Loads message thread |
| Send message | Enter key or send button | Posts reply, appends to thread |
| Attach file | Paperclip button | Opens file picker (image/pdf/doc) |
| Report conversation | "Report" button | Opens report reason modal |
| Submit report | "Submit Report" in modal | Sends abuse report |
| Search | Search input | Filters conversations by name or message |

## Business Rules

- Conversations are fetched from notifications API, falling back to mock data
- Messages are mock data (no real-time integration yet)
- Unread count badge shows on conversation items
- Report reasons are predefined in mock data
- Merchant messages have amber background, customer messages have gray

## Navigation

- Dashboard KPI links here
- Customer detail panel shows recent orders

## Loading State

Full-screen `Loading` while conversations fetch.

## Empty State

`Empty` component: "No conversations yet" with explanation.

## Error State

`ErrorState` with "Try Again" button when conversations fetch fails. Calls `loadConversations()` to retry.

## Success State

Conversation list and active chat thread displayed. Real-time message sending.

## Validation

- Message text must be non-empty to send
- Report requires a reason selection

## Notifications

- "File attached!" toast
- "Report submitted" toast
- "Failed to send message" toast
- "Failed to load messages" toast

## Accessibility

- `<h2>` heading in conversation pane
- Message bubbles have clear sender labeling
- Report dialog is focus-trapped modal
- Send button has aria-label

## Acceptance Criteria

- [ ] Conversations list loads
- [ ] Selecting a conversation shows message thread
- [ ] Sending a message appends to thread
- [ ] File attachment triggers file picker
- [ ] Report modal works end-to-end
- [ ] Search filters conversations
- [ ] Error state with retry on fetch failure

## Related Specifications

- depends-on: [BD-CUST-001](./BD-CUST-001.md)

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2026-07-19 | @engineering | Initial screen spec |
