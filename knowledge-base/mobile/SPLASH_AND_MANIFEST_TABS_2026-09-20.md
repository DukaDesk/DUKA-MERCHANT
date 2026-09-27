# Tenant splash and manifest tab ownership

Date: 2026-09-20
Status: Client fixes implemented and tested; production republish/device verification outstanding.

## One controller, published configuration

Merchant authors splash content, enabled (defaults true when a splash exists), and durationMs (publisher default 500ms). The compiler preserves an explicitly authored splash.screen instead of replacing it. Backend validates, stores and returns this configuration unchanged as part of the active release; it does not decide when a running device shows it or run a second timer. Mobile PublishedSession is the sole tenant-splash lifecycle controller.

A tenant opening means entering an app from the shell, including closing and reopening it. Splash is initialized before any home screen mounts, displayed once after loading the validated release, and dismissed after the published duration once the theme is ready. Switching tabs, opening a modal, authentication return, or resuming the existing session does not replay it. No splash definition or enabled=false goes straight to the declared initial route. Each newly mounted tenant session starts its own splash. The OS-level DukaDesk startup splash is separate and remains controlled by the native app startup configuration.

The duration is not a guarantee that a broken/slow remote image has loaded; backend public-media correctness is still required. Mobile does not invent a tenant logo or splash when the backend omits them.

## Missing tabs: confirmed cause and fix

The live BFF still serves nested Storefront v0.0.7. Its navigation.root.type is tabs, and navigation.tabs declares Shop/Home, Cart/ShoppingCart, Orders/Wallet and Profile/User. Screens have no fixedBottom tab nodes. The old renderer required embedded tab_bar components and therefore ignored valid root navigation.

ScreenEngine now interprets the root tabs declaration using the published order, labels, targets and navigation.style, placing it below the screen body/footer with the device bottom inset. An existing tab_bar or tabs component in the screen tree takes precedence, preventing duplication with manifests produced by the newer compiler. Synthesized root tabs are excluded from splash overrides and modal surfaces; explicitly authored component trees remain authoritative. Non-tab roots do not gain a tab bar. Merchant icon names are mapped to native equivalents and tab presses dispatch their declared screenId through the existing shell auth/navigation handling.

This is manifest interpretation, not a replacement tenant template. The manifest snapshot is not mutated.

## Clean app screen correction

Removed the injected update toolbar, restart prompt, legacy warning and refresh-error text. Background checks continue quietly; existing sessions keep their loaded snapshot and a newly opened app loads the current backend release. Initial-load retry/authentication/error screens remain when required. This supersedes the earlier client-delivery report's in-screen update controls.

## Validation

Mobile TypeScript passed. Shell/renderer regressions cover first-mounted splash, readiness/duration, reopen replay, no tab/foreground replay, disabled splash, root-tab synthesis, explicit-bar deduplication, no synthesized tabs on splash/modal, native icon mapping and declared target dispatch. Merchant compiler regressions passed (5 tests); production build passed (2,233 modules). Existing golden fixture remains unchanged because compiler-generated explicit tabs remain supported for older runtimes.

No backend writes, deployment or republish occurred. Live v0.0.7 contains no splash field, so displaying the intended tenant splash requires publishing a release that actually contains it through the corrected backend path.

Remaining tasks: [standalone verification TODO](SPLASH_AND_MANIFEST_TABS_TODO.md).
