/* Category display helpers — single source for turning the active desk
   category into human-readable UI copy.
   Usage:
     const { vertical, category } = useVertical();
     const catName = getCategoryName(vertical, category); // "Church"
     const catLower = getCategoryLower(vertical, category); // "church"
*/

export function getCategoryName(vertical, category) {
  if (vertical?.label) return vertical.label;
  if (category) return String(category);
  return "Business";
}

export function getCategoryLower(vertical, category) {
  return getCategoryName(vertical, category).toLowerCase();
}

export function getDeskName(vertical, category) {
  if (vertical?.deskLabel) return vertical.deskLabel;
  const name = getCategoryName(vertical, category);
  return `${name} Desk`;
}

/* Build UI strings that previously hardcoded "business"/"Business".
   Keeps copy consistent: "Complete {cat} verification", "{Cat} name", etc. */
export function catText(vertical, category, template) {
  const name = getCategoryName(vertical, category);
  const lower = name.toLowerCase();
  return template.replaceAll("{Cat}", name).replaceAll("{cat}", lower);
}
