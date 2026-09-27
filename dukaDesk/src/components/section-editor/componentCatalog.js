import { getComponentsByCategory, getComponentType } from "../canvas-editor/componentTypes";

// Authoring choices only: existing saved component types remain supported.
export function getComponentCatalog() {
  const hidden = new Set(["row", "nested_section", "carousel", "tabs", "tab_bar", "primary_button", "text_block", "category_pills"]);
  return getComponentsByCategory().map(category => {
    const seen = new Set();
    const components = category.components.filter(item => {
      if (hidden.has(item.type) || seen.has(item.type)) return false;
      seen.add(item.type);
      return true;
    });
    if (category.key === "buttons") {
      const button = getComponentType("button");
      const preset = (catalogId, label, props) => ({ ...button, catalogId, label, defaultProps: { ...button.defaultProps, ...props, textStyles: {} } });
      components.splice(0, components.length,
        preset("button", "Button", { icon: "", shape: "rectangle" }),
        preset("icon-rectangle", "Icon Rectangle", { icon: "ArrowRight", shape: "rectangle" }),
        preset("round", "Round / FAB", { icon: "Plus", label: "Add", shape: "round", showLabel: "false", width: 56, height: 56, radius: 999, background: "#F4A026", color: "#1A1A2E", elevation: "soft" }),
        preset("pill", "Pill Button", { icon: "", radius: 999 }),
        preset("icon-pill", "Icon Pill", { icon: "Check", radius: 999 }),
        { ...getComponentType("category_pills"), catalogId: "pill-set", label: "Pill Set" },
        { ...getComponentType("category_pills"), catalogId: "icon-pill-set", label: "Icon Pill Set", defaultProps: { cats: [{ label: "Popular", icon: "Star", active: true }, { label: "Favorites", icon: "Heart" }, { label: "Recent", icon: "Clock" }] } },
        preset("text-pressable", "Text Pressable", { icon: "", variant: "ghost", color: "#1A1A2E" }),
        preset("icon-pressable", "Icon Pressable", { icon: "Heart", label: "Favorite", showLabel: "false", variant: "ghost", color: "#1A1A2E", width: 44, height: 44 })
      );
    }
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