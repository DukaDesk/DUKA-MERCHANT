# App sections, press actions and editable slugs

Date: 2026-09-20
Status: Implemented locally; production and device verification remain separate.

## Builder behavior
- Renamed Page Content and the screen-specific sections heading to App sections.
- Component properties expose On press / Attach page with Open Screen, Go Back, Refresh and custom action JSON. Existing event actions can also be edited independently. Cart quantity/checkout events are exposed even when the template has no actions yet.
- Category pills, menu cards, promotions, information rows and order rows have individual-item attachments. Item attachments override the component attachment, which overrides its existing press event. Clearing an attachment restores the existing event behavior.
- Pill, menu-card and promotion preview clicks use the selected item attachment without triggering the parent attachment again.
- App slug accepts an empty value and trailing hyphens while editing. Formatting happens on blur; blank remains blank. Loading a design preserves explicit empty/custom slugs. Renaming an app only updates a slug that still matches the old generated name.

## Published contract
- Component props.tapAction and list-item tapAction contain an ActionDef object after compilation; the editor may store JSON text while it is being edited.
- Component props.actions edits merge over node.actions, preserving unrelated events. Null event entries explicitly clear that event.
- Invalid action JSON and attachments with empty/missing payload.screenId destinations fail compilation. Existing action types and payload contracts remain in use.
- Mobile dispatches the selected attachment through the existing published app action engine, retaining the source node. No navigation destinations are hardcoded.
- Backend must preserve these nested props/actions in the exact published snapshot. There is no new endpoint or backend-owned navigation execution.

## Validation
- Merchant full suite: 85 tests passed before final destination validation; final compiler suite: 7 tests passed, including missing destination rejection. Action editor test also passed.
- Mobile PublishedRenderer: 22 tests passed, including single dispatch for individual category/menu attachments.
- Mobile TypeScript check passed. Merchant production build and final rebuild passed.

See [separate verification TODO](APP_SECTIONS_AND_PRESS_ACTIONS_TODO.md).

## Selection-driven properties correction
The repeated per-item attachment editors were removed. Clicking a pill or menu/promotion card in the canvas selects that item and opens its shared General properties channel. A single action editor follows the selected component/event/item; a compact selector allows switching targets. Item content fields and its saved destination load into that editor. Published actions and mobile behavior remain unchanged.


Selected canvas pills, menu cards and promotion cards now receive a 2px selection outline. The outline follows the selected section/component/item, uses inset positioning to avoid layout shifts or clipping, and is editor-only.


## 2026-09-20 - Selection properties and icons

- Text selections now use solid outlines, consistent with selected cards and pills.
- Selected text has one content field in General. Removed the instructional banner, duplicate content field, internal component ID and unrelated reorder/action controls from text selection. Typography remains in Styling; plain text blocks retain their saved font controls.
- Selected list-item content and appearance fields are separated between General and Styling. The shared target selector now updates the canvas selection, and changing tabs retains the selected item. Shared header/footer sections resolve into the same property panel.
- Expanded the shared icon library to over 80 entries. Both tab trays use the expanded bank with bounded scrolling. Content and icon primitives use a searchable Icons picker with an Emoji option inside it. Existing emoji values remain supported.
- Menu/promotion/card placeholders render Lucide icons instead of raw icon-name strings in the merchant. Mobile tabs, published menu cards and promotions resolve these names through an explicit, validated Ionicons alias table, retaining emoji support. Native icon shapes are platform equivalents, not identical Lucide paths.
- Validation: merchant full suite passed 94 tests before the final icon-render regression addition; final focused selection/icon suite passed 6 tests. Final merchant production build passed. Mobile PublishedRenderer passed 22 tests and TypeScript check passed. All added native icon aliases were checked against the installed glyph map.

## Canvas controls cleanup
Removed floating component/section title, delete, duplicate, library, image-upload and color controls from the canvas. Removed row add popovers and empty-section guide text. Selection borders and content selection remain. General properties retain component actions, section naming/delete/library actions, and now include section duplicate/detach plus the full child component picker. Appearance controls remain in Styling.


## Layout and section hierarchy correction
Section is now a variant in the Layout gallery alongside the existing 1/1 and split layouts, rather than a separate Structure palette command. Sections and layout slots again provide inline plus / Add a section controls; insertion selects the new nested section. General shows Add Element only for selected root or nested sections and inserts into the selected nested section. Nothing selected no longer exposes the component picker. Accordion moved from Structure into Components and retains its existing Coming soon status. Existing saved structures and manifest node types are unchanged. This supersedes the earlier removal of inline section insertion controls; floating delete/duplicate/color toolbars remain removed.


## 2026-09-21 - Container layout picker and component categories

- Sections remain real nested containers with a visible empty content area. The inline Add a section control opens Layout and expands/highlights its Elements entry; it no longer immediately inserts a nested section.
- The layout picker retains section, parent-container and insertion position until a choice is made, then inserts and selects that choice. Closing the picker creates nothing.
- Elements now offers Structure (Layout, Screens, Tabs) and Components with icon-bearing category buttons. Choosing a category opens General with only that category. When a child is selected, browsing targets its nearest section container.
- Heading and Paragraph are separate text presets in General's Text dropdown; Accordion remains an unavailable placeholder there. Video remains an unavailable Media placeholder.
- Removed repeated standalone Heading/Paragraph/Button/List/Icon/Divider/Images entries and the duplicate primary-button authoring choice. Layout/tab entries are not repeated in the component catalog. Existing saved types are still supported.
- The previous direct-insertion behavior described above is superseded by this layout-choice flow. No backend or mobile contract changes are required.

Validation for the 2026-09-21 changes: merchant production build passed; full merchant suite passed 99 tests across 16 files. Browser visual verification remains in the separate TODO file.

