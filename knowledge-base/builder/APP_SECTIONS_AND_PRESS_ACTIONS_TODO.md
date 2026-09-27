# App sections and press actions - verification TODO

Date: 2026-09-20
Last Updated: 2026-09-24
Read: [implementation and contract](APP_SECTIONS_AND_PRESS_ACTIONS_2026-09-20.md)

- [x] Rename builder section labels and fix empty/custom slug editing and reload.
- [x] Add component and individual-item attachment controls, compilation and mobile dispatch.
- [x] Add compiler, action-editor, slug-store and mobile press regression tests.
- [ ] Release/device verification: deploy updated merchant and mobile clients, publish two pills/menu cards with different destinations, confirm both canonical backend reads preserve their actions, then verify each opens the assigned page on Android/iOS.
- [ ] Browser smoke check: clear and retype slug, blur, save, reload; verify custom slug remains. Preview individual pills/menu cards and verify Back.
- [~] Complete existing backend published delivery work before treating a local/client test as proof that production serves the new release. — **Backend B1–B6 code landed 2026-09-24** (`00baea3`); round-trip unit test covers two pills → different screens. **Deploy + production publish still required** for this gate.

- [x] Replace repeated attachment controls with one selection-driven property editor; cover pill selection, target switching and isolated updates with regression tests.
- [ ] Browser smoke check: click different pills/cards and confirm the same property editor shows each item's saved destination without duplicate attachment controls.


- [x] Solid text selection, simplified text editor, selection-specific General/Styling, expanded icon bank and nested Emoji option.
- [ ] Browser/device verification: inspect text and card selection, switch General/Styling between items, scroll the expanded tab tray, and publish a named icon and emoji to verify native delivery/rendering.


- [x] Restore inline section insertion in layouts/sections; move Section into Layout and Accordion into Components; gate General Add Element on section selection.
- [ ] Browser check: add a section to a split layout, select it, add components through General, then clear selection and confirm Add Element is hidden.


- [x] Replace immediate nested-section insertion with a Layout picker retaining the target container; show components by category in General and remove duplicate palette entries.
- [ ] Browser check: open Layout from an empty nested section, cancel without mutation, reopen and choose a split layout; verify subsequent components go into the selected child section. Check Text and other categories separately.

