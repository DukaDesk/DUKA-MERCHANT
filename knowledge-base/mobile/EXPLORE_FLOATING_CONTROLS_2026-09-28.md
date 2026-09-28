# Explore and floating shell controls — 2026-09-28

Removed Explore/Apps headings and View all from Explore. Added horizontal borderless category text filters based on discovery app categories, with search directly below. Explore uses assets/icon.png as wallpaper with a 30% dark overlay and white app labels.

Hidden the DukaDesk bottom tab bar. ShellControls at the root provides a draggable menu FAB with Explore, Categories, and Profile. Dragging is bounded by the viewport and safe areas; position survives navigation while root is mounted. Profile retains its guest authentication gate. Leaving a tenant through the menu ends its shell session.

A separate floating bell opens the global /notifications route on shell and published-app routes. It does not use tenant notifications. Published app manifest tabs are retained. Controls are hidden on authentication/onboarding routes.

Validation: 3 ShellControls tests, 14 PublishedAppShell tests, and TypeScript passed. No physical device visual verification performed.

## Bottom search and FAB tools
Explore now renders the app grid above a bottom search area padded by the device bottom inset. Search results appear above the input; keyboard avoidance keeps it accessible. FAB includes live app search and QR scanner with camera permission handling and duplicate-frame protection. Both launch apps through openPublishedApp, preserving splash replay. TypeScript passed.
