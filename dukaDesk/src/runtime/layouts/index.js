import { createElement } from "react";
import { RegistryRenderer } from "../ComponentRegistry";

const layoutRenderers = {
  column(node, index) {
    return createElement("div", {
      key: index,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: node.gap || 0,
        padding: node.padding || 0,
      },
    }, renderChildren(node.children));
  },

  row(node, index) {
    return createElement("div", {
      key: index,
      style: {
        display: "flex",
        flexDirection: "row",
        gap: node.gap || 0,
        padding: node.padding || 0,
        flexWrap: "wrap",
      },
    }, renderChildren(node.children));
  },

  scroll(node, index) {
    return createElement("div", {
      key: index,
      style: {
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: node.gap || 0,
        padding: node.padding || 0,
      },
    }, renderChildren(node.children));
  },

  grid(node, index) {
    return createElement("div", {
      key: index,
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: node.gap || 8,
        padding: node.padding || 0,
      },
    }, (node.children || []).map((child, i) =>
      createElement("div", {
        key: i,
        style: {
          flex: `0 0 calc(${100 / (node.columns || 2)}% - ${node.gap || 8}px)`,
        },
      }, renderNode(child, i))
    ));
  },

  section(node, index) {
    return createElement("div", {
      key: index,
      style: {
        marginBottom: node.gap || 16,
        padding: node.padding || 0,
      },
    }, [
      node.title ? createElement("h3", {
        key: "title",
        style: {
          fontFamily: "'Sora', sans-serif",
          fontWeight: 600,
          fontSize: 16,
          color: "#0F0F1A",
          marginBottom: 12,
        },
      }, node.title) : null,
      ...renderChildren(node.children),
    ].filter(Boolean));
  },
};

function renderNode(node, index) {
  if (!node) return null;
  if (node.kind) {
    const renderer = layoutRenderers[node.kind];
    if (renderer) return renderer(node, index);
    return createElement("div", { key: index, style: { color: "#E74C3C", fontSize: 12 } },
      `Unknown layout kind: "${node.kind}"`);
  }
  return createElement(RegistryRenderer, { key: node.key || index, node });
}

function renderChildren(children) {
  if (!children || !Array.isArray(children)) return [];
  return children.map((child, i) => renderNode(child, i));
}

export function LayoutRenderer({ layout }) {
  if (!layout) return null;
  return renderNode(layout, 0);
}

export function ScreenRenderer({ screenDef, extraProps }) {
  if (!screenDef) return null;
  if (screenDef.layout) {
    return createElement(LayoutRenderer, { layout: screenDef.layout });
  }
  if (screenDef.children) {
    return createElement("div", {
      style: { display: "flex", flexDirection: "column", gap: 16 },
    }, screenDef.children.map((child, i) =>
      createElement(RegistryRenderer, { key: child.key || i, node: child, extraProps })
    ));
  }
  return null;
}
