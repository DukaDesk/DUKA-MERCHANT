# Splash and manifest tabs - verification TODO

Date: 2026-09-20
Last Updated: 2026-09-27
Status: Client code complete; backend deployed (B4 migration applied 2026-09-27); release/device verification open
Read: [ownership and evidence](SPLASH_AND_MANIFEST_TABS_2026-09-20.md)

- [~] Backend: complete publication delivery fixes and prove that submitted splash.enabled, splash.durationMs, splash.screen and navigation root/tabs/style survive both canonical reads unchanged. Do not add backend timers or inject another startup screen. — **Code landed 2026-09-24** (`ManifestValidator` + `ActiveReleaseService` preserve full snapshot incl. splash/navigation); **deployed 2026-09-27; live proof pending re-publish**.
- [ ] Merchant: publish the intended template with splash enabled and chosen duration; confirm the full submitted snapshot through both read paths. Current live v0.0.7 has no splash to render.
- [ ] Mobile: verify Shop/Cart/Orders/Profile tabs, icons, selected state and actions on Android/iOS for the current root-only-tab manifest and for a release containing an explicit tab bar. Verify exactly one tab bar in each.
- [ ] Mobile: verify splash appears first on each tenant open/reopen, never on tab switches or ordinary foreground resume, and disabled splash skips directly to the initial screen. Confirm loaded images and published theme on device.
- [ ] Mobile: verify published content has no update toolbar or diagnostic labels. Complete separate public-media and font parity work before declaring visual equivalence.
