import { createElement } from "react";
import { RuntimeContext } from "./RuntimeContext";

const registry = {};

export function registerComponent(type, component) {
  registry[type] = component;
}

export function getComponent(type) {
  return registry[type];
}

export function getRegisteredTypes() {
  return Object.keys(registry);
}

export function RegistryRenderer({ node, extraProps }) {
  const type = node?.type;
  if (!type || !registry[type]) {
    return createElement(UnsupportedComponent, { type });
  }

  const Component = registry[type];
  const mergedProps = {
    ...(node.props || {}),
    actions: node.actions || {},
    ...extraProps,
  };

  return createElement(
    RuntimeContext.Consumer,
    null,
    (ctx) => createElement(Component, {
      ...mergedProps,
      dispatchAction: ctx?.dispatchAction,
    })
  );
}

function UnsupportedComponent({ type }) {
  return createElement("div", {
    style: {
      padding: "16px",
      background: "#FEF2F2",
      border: "1px dashed #E74C3C",
      borderRadius: 8,
      color: "#991B1B",
      fontSize: 13,
      textAlign: "center",
    },
  }, `Unknown component type: "${type}"`);
}

function SectionHeader({ children, style }) {
  return createElement("div", {
    style: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      fontSize: 16,
      color: "#0F0F1A",
      marginBottom: 16,
      ...style,
    },
  }, children);
}

function EmptyState({ title, description, icon, style = {}, dispatchAction }) {
  return createElement("div", {
    style: {
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 32, gap: 8,
      minHeight: 160, ...style,
    },
  }, [
    icon ? createElement("span", {
      key: "icon", style: { fontSize: 32, opacity: 0.4 },
    }, icon) : null,
    title ? createElement("span", {
      key: "title",
      style: { fontWeight: 600, fontSize: 15, color: "#6B7280" },
    }, title) : null,
    description ? createElement("span", {
      key: "desc",
      style: { fontSize: 13, color: "#9CA3AF", textAlign: "center" },
    }, description) : null,
  ]);
}

function DynamicCard({ title, subtitle, image, badge, actions = {}, style = {}, dispatchAction }) {
  return createElement("div", {
    style: {
      display: "flex", alignItems: "center", gap: 12,
      padding: 12, borderRadius: 12, border: "1px solid #E8E8F0",
      background: "#fff", cursor: actions.default ? "pointer" : "default",
      ...style,
    },
    onClick: actions.default && dispatchAction
      ? () => dispatchAction(actions.default)
      : undefined,
  }, [
    image ? createElement("div", {
      key: "img",
      style: {
        width: 48, height: 48, borderRadius: 8,
        background: `url(${image}) center/cover`,
        flexShrink: 0,
      },
    }) : null,
    createElement("div", {
      key: "body", style: { flex: 1, minWidth: 0 },
    }, [
      badge ? createElement("span", {
        key: "badge",
        style: {
          fontSize: 10, fontWeight: 700, color: "#92400E",
          background: "#FFF8ED", padding: "2px 6px", borderRadius: 6,
          marginBottom: 4, display: "inline-block",
        },
      }, badge) : null,
      title ? createElement("div", {
        key: "title",
        style: { fontWeight: 600, fontSize: 14, color: "#1C1B1D" },
      }, title) : null,
      subtitle ? createElement("div", {
        key: "sub",
        style: { fontSize: 12, color: "#6B7280" },
      }, subtitle) : null,
    ]),
    actions.default ? createElement("span", {
      key: "chevron", style: { color: "#9CA3AF", fontSize: 18 },
    }, "\u203A") : null,
  ]);
}

registerComponent("section_header", SectionHeader);
registerComponent("empty_state", EmptyState);
registerComponent("dynamic_card", DynamicCard);

export { EmptyState, DynamicCard };
