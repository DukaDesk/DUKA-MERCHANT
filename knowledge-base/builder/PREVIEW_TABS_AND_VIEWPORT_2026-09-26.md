# Preview tabs and viewport — 2026-09-26

Implemented in DUKA-MERCHANT/dukaDesk.

- Builder canvas, builder preview, and standalone template preview share PreviewTabBar.
- Tabs render icons (including legacy icon aliases), use equal-width columns, truncate long labels, and navigate to the manifest screenId.
- Manifest tab colors and sizing are respected. Missing destinations are disabled.
- Removed simulated clock/battery bars and phone notches. App content fills the phone viewport.
- Content scrolls within a fixed phone viewport; tabs remain below content without covering it.
- Actual app headers and published splash behavior are retained.

Validation: production build passed. Added tab icon/navigation/layout regression tests. Browser visual verification is pending; see the separate TODO file.
