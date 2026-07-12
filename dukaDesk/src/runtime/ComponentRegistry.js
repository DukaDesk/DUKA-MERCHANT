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

registerComponent("section_header", SectionHeader);
