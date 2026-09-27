# Section plus insertion — 2026-09-26

Replaced internal Add a section buttons with a centered plus icon. Clicking it offers Inner section or Components. Inner section opens Layouts; Components opens category choices in General. Both preserve the original section/container and layout slot. New components open their properties after insertion. Empty nested sections center the plus control.

Validation: SectionHierarchy tests passed (8 tests), covering both choices and targeted component insertion. Merchant production build passed.

## Selection-only correction
The plus now selects its containing section or layout using the existing solid selection outline. It no longer opens Inner section or Components buttons. Content remains managed through the existing panels. This supersedes the chooser behavior above.
