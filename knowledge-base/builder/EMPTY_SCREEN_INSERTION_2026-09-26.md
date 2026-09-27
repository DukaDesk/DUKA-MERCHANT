# Empty builder screen insertion — 2026-09-26

Implemented in DUKA-MERCHANT/dukaDesk.

The component picker and layout gallery previously required a selected section, preventing insertion into an empty screen.

When no section is selected, adding a component or layout now creates a transparent body section containing that item on the current screen. The new item is selected and its properties open. Section creation and insertion are a single undoable store update. Selected sections and nested sections continue receiving components in their existing location. The picker remains category-based and is not shown by default.

Production build passed. Regression coverage was added for empty-screen component insertion, initial layout insertion, selection, and undo. Focused Vitest validation completed successfully: 2 test files, 8 tests passed.


## Empty screen selection
Empty screens now display a centered plus. Selecting it outlines the full phone viewport and opens screen name and component categories in General. Styles uses the existing screen layout and background color controls. Selecting a section or component clears screen selection. Production build passed.
