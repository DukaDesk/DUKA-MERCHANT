import { getComponentsByCategory, getComponentType } from "../canvas-editor/componentTypes";

// Authoring choices only: existing saved component types remain supported.
export function getComponentCatalog() {
  const hidden = new Set(["row", "nested_section", "carousel", "tabs", "tab_bar", "primary_button", "text_block"]);
  return getComponentsByCategory().map(category => {
    const seen = new Set();
    const components = category.components.filter(item => {
      if (hidden.has(item.type) || seen.has(item.type)) return false;
      seen.add(item.type);
      return true;
    });
    if (category.key === "text") {
      const text = getComponentType("text_block");
      components.unshift(
        { ...text, catalogId: "heading", label: "Heading", defaultProps: { ...text.defaultProps, text: "Heading", fontSize: 24, fontWeight: "700" } },
        { ...text, catalogId: "paragraph", label: "Paragraph", defaultProps: { ...text.defaultProps, text: "Paragraph", fontSize: 14, fontWeight: "400" } }
      );
      components.push({ type: "accordion", label: "Accordion", comingSoon: true });
    }
    if (category.key === "media") components.push({ type: "video", label: "Video", comingSoon: true });
    return { ...category, label: category.key === "text" ? "Text" : category.key === "layout" ? "Containers & Spacing" : category.label, components };
  }).filter(category => category.components.length);
}