# Button components — 2026-09-26

Builder Buttons & Actions now contains Button, Icon Rectangle, Round / FAB, Pill Button, Icon Pill, Pill Set, Icon Pill Set, Text Pressable, and Icon Pressable. Presets reuse button and category_pills manifest types; existing saved icon_button/fab components remain supported.

General contains label, icon, label visibility, and press/navigation actions. Styling contains shape, icon placement/size, dimensions, radius, typography, fills, and colors. Pill sets support icons per item and active/inactive styling. No explanatory UI copy was added.

Mobile published rendering now supports button icons, icon placement/size, hidden labels, round shapes, and pill icons/colors/radius/type size.

Validation: merchant production build passed; hierarchy and publishing compiler tests passed; mobile TypeScript check passed (npx tsc --noEmit).

## Categorized visual gallery
Button choices now appear in collapsible Rectangle, Round / FAB, Pills, and Pressables groups. Each insertion card renders its actual preset rather than a generic icon. The default FAB is a 56px circle with an amber fill, navy plus, and soft elevation. Fixed icon-only preview padding so circular previews remain circular. General/Styling behavior is unchanged. Production build and 16 existing focused tests passed.
