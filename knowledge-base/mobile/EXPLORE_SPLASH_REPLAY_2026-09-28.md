# Explore splash replay — 2026-09-28

Each explicit app launch from Explore now supplies a unique launchId. The desk route keys PublishedAppShell by tenant and launch, ensuring a fresh release check and splash lifecycle even when the router reuses the same tenant route. Covers app cards, search app results, QR launches, and ad app links in Explore.

Merchant compilePublishedApp already publishes splash.screen, durationMs, and enabled. Mobile continues using that published configuration; the splash timer starts after the renderer is ready. No backend or merchant changes were needed. Disabled or absent published splashes remain disabled/absent. Internal navigation, normal rerenders, and returning from authentication do not create new launch identifiers.

Validation: 14 PublishedAppShell tests passed, including repeated launches of the same app and unique identifiers for launches in the same millisecond. Physical device verification remains in the separate TODO.
