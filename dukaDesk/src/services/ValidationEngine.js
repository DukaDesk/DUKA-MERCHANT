import { getRegisteredTypes } from "../runtime/ComponentRegistry";
import { getTypeNames } from "../components/canvas-editor/componentTypes";
const supportedDraftTypes = () => [...new Set([...getTypeNames(), ...getRegisteredTypes()])];

export function validateProject(projectData) {
  const errors = [];
  const warnings = [];

  if (!projectData) {
    errors.push({ path: "root", message: "Project data is empty", severity: "error" });
    return { valid: false, errors, warnings };
  }

  const { meta, navigation, shared, screens } = projectData;

  /* ── Meta checks ── */
  if (!meta) {
    errors.push({ path: "meta", message: "Missing app metadata", severity: "error" });
  } else {
    if (!meta.appName || !meta.appName.trim()) {
      errors.push({ path: "meta.appName", message: "App name is required", severity: "error", fix: "Enter a desk or app name in the Branding step" });
    }
    if (meta.appName && meta.appName.length > 50) {
      warnings.push({ path: "meta.appName", message: "App name is too long (max 50 characters)", severity: "warning" });
    }
    if (meta.slug && !/^[a-z0-9-]+$/.test(meta.slug)) {
      errors.push({ path: "meta.slug", message: "Slug must contain only lowercase letters, numbers and hyphens", severity: "error", fix: "Use e.g. my-app" });
    }
    if (meta.slug && meta.slug.length > 50) {
      warnings.push({ path: "meta.slug", message: "Slug is too long (max 50 characters)", severity: "warning" });
    }
    if (!meta.primaryColor) {
      warnings.push({ path: "meta.primaryColor", message: "No brand color set — default will be used", severity: "warning" });
    }
  }

  /* ── Navigation checks ── */
  if (!navigation) {
    errors.push({ path: "navigation", message: "Missing navigation definition", severity: "error" });
  } else {
    if (!navigation.initialScreen) {
      errors.push({ path: "navigation.initialScreen", message: "Initial screen is not set", severity: "error", fix: "Set a home screen in navigation settings" });
    }
    const screenIds = screens ? Object.keys(screens) : [];
    if (navigation.initialScreen && !screenIds.includes(navigation.initialScreen)) {
      errors.push({ path: "navigation.initialScreen", message: `Initial screen "${navigation.initialScreen}" does not exist`, severity: "error", fix: "Create a screen with that ID or change the initial screen" });
    }
    if (navigation.tabs) {
      navigation.tabs.forEach((tab, i) => {
        if (!tab.label || !tab.label.trim()) {
          errors.push({ path: `navigation.tabs[${i}].label`, message: `Tab ${i + 1} has no label`, severity: "error" });
        }
        if (tab.screenId && !screenIds.includes(tab.screenId)) {
          errors.push({ path: `navigation.tabs[${i}].screenId`, message: `Tab "${tab.label}" points to screen "${tab.screenId}" which does not exist`, severity: "error" });
        }
      });
    }
  }

  /* ── Shared checks ── */
  // Mobile apps often have no header/footer chrome — shared sections are optional.
  // Only validate them when they actually contain components; empty is intentional, not a warning.
  const allScreenIds = screens ? Object.keys(screens) : [];
  if (shared) {
    const regTypes = supportedDraftTypes();
    if (shared.header?.components?.length > 0) {
      validateSection(shared.header, "shared.header", errors, warnings, regTypes, allScreenIds);
    }
    if (shared.footer?.components?.length > 0) {
      validateSection(shared.footer, "shared.footer", errors, warnings, regTypes, allScreenIds);
    }
  }

  /* ── Screen checks ── */
  if (!screens || Object.keys(screens).length === 0) {
    errors.push({ path: "screens", message: "No screens defined", severity: "error", fix: "Add at least one screen to your app" });
  } else {
    const regTypes = supportedDraftTypes();
    Object.entries(screens).forEach(([screenId, screen]) => {
      const prefix = `screens.${screenId}`;
      if (!screen.name || !screen.name.trim()) {
        errors.push({ path: `${prefix}.name`, message: `Screen "${screenId}" has no name`, severity: "error" });
      }
      if (!screen.backgroundColor) {
        warnings.push({ path: `${prefix}.backgroundColor`, message: `Screen "${screen.name || screenId}" has no background color`, severity: "warning" });
      }
      const sections = screen.bodySections || [];
      if (sections.length === 0) {
        warnings.push({ path: `${prefix}.bodySections`, message: `Screen "${screen.name || screenId}" is empty — add sections or components`, severity: "warning" });
      }
      sections.forEach((sec, i) => {
        validateSection(sec, `${prefix}.bodySections[${i}]`, errors, warnings, regTypes, allScreenIds);
      });
    });
  }

  /* ── Summary ── */
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateSection(section, path, errors, warnings, regTypes, screenIds = []) {
  if (!section) return;


  if (!section.components || section.components.length === 0) {
    warnings.push({ path: `${path}.components`, message: `Section "${section.name || path}" has no components`, severity: "warning" });
    return;
  }

  const validateComponent = (comp, compPath) => {
    if (!comp.type) {
      errors.push({ path: `${compPath}.type`, message: "Component type is missing", severity: "error" });
    } else if (!regTypes.includes(comp.type)) {
      errors.push({ path: `${compPath}.type`, message: `Unknown component type "${comp.type}"`, severity: "error", fix: `Register "${comp.type}" or use one of: ${regTypes.join(", ")}` });
    }
    if (comp.type === "menu_grid" && Array.isArray(comp.props?.items)) {
      const unlinked = comp.props.items.filter(item => item && typeof item === "object" && !item.productId).length;
      if (unlinked > 0) {
        warnings.push({ path: `${compPath}.props.items`, message: `${unlinked} menu item${unlinked === 1 ? "" : "s"} ${unlinked === 1 ? "was" : "were"} typed by hand — pick store products so prices, photos and stock stay in sync`, severity: "warning" });
      }
    }
    validateComponentActions(comp, compPath, screenIds, errors);
    (comp.children || []).forEach((child, i) => validateComponent(child, compPath + '.children[' + i + ']'));
    (comp.layout?.children || []).forEach((child, i) => validateComponent(child, compPath + '.layout.children[' + i + ']'));
  };
  section.components.forEach((comp, i) => validateComponent(comp, path + '.components[' + i + ']'));
}

/* ── Action destination checks (mirrors compilePublishedApp.parse) ── */
// A navigate/push/replace/switch_screen whose payload names a screenId must
// point at an existing screen — otherwise publish fails late with
// "Choose an existing destination page". Surface it here with a location.
const NAV_ACTION_TYPES = ["navigate", "push", "replace", "switch_screen"];

function asActionObject(value) {
  if (value == null || value === "") return null;
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return { __invalid: true, __raw: value };
    }
  }
  return null;
}

function checkNavAction(action, actionPath, compLabel, screenIds, errors) {
  if (!action || typeof action.type !== "string" || !action.type) {
    errors.push({ path: actionPath, message: `Component "${compLabel}" has a malformed action (missing type)`, severity: "error", fix: "Re-link the tap action in the editor" });
    return;
  }
  if (!NAV_ACTION_TYPES.includes(action.type)) return;
  const payload = action.payload || {};
  // Path-style destinations ("/shop") are canonicalized at compile time when
  // they name an existing screen — only validate explicit screenIds here.
  if (!Object.prototype.hasOwnProperty.call(payload, "screenId")) return;
  if (!payload.screenId) {
    errors.push({
      path: actionPath,
      message: `Component "${compLabel}" has no destination page chosen yet`,
      severity: "error",
      fix: `Choose one of: ${screenIds.join(", ") || "(no screens yet)"}`,
    });
    return;
  }
  if (!screenIds.includes(payload.screenId)) {
    errors.push({
      path: actionPath,
      message: `Component "${compLabel}" links to page "${payload.screenId}" which does not exist`,
      severity: "error",
      fix: `Point it to one of: ${screenIds.join(", ") || "(no screens yet)"}`,
    });
  }
}

function validateComponentActions(comp, compPath, screenIds, errors) {
  const label = comp.key || comp.id || comp.type || compPath;
  const merged = { ...(comp.actions || {}), ...(comp.props?.actions || {}) };
  for (const [name, raw] of Object.entries(merged)) {
    const action = asActionObject(raw);
    if (raw != null && raw !== "" && !action) continue;
    if (action && action.__invalid) {
      errors.push({ path: `${compPath}.actions.${name}`, message: `Component "${label}" has an unreadable action (not valid JSON)`, severity: "error", fix: "Re-link the tap action in the editor" });
      continue;
    }
    if (action) checkNavAction(action, `${compPath}.actions.${name}`, label, screenIds, errors);
  }
  const propAction = asActionObject(comp.props?.action);
  if (typeof comp.props?.action === "string" && comp.props.action && propAction?.__invalid) {
    errors.push({ path: `${compPath}.props.action`, message: `Component "${label}" has an unreadable action (not valid JSON)`, severity: "error", fix: "Re-link the tap action in the editor" });
  } else if (propAction && !propAction.__invalid) {
    checkNavAction(propAction, `${compPath}.props.action`, label, screenIds, errors);
  }
  const tapAction = asActionObject(comp.props?.tapAction);
  if (typeof comp.props?.tapAction === "string" && comp.props.tapAction && tapAction?.__invalid) {
    errors.push({ path: `${compPath}.props.tapAction`, message: `Component "${label}" has an unreadable tap action (not valid JSON)`, severity: "error", fix: "Re-link the tap action in the editor" });
  } else if (tapAction && !tapAction.__invalid) {
    checkNavAction(tapAction, `${compPath}.props.tapAction`, label, screenIds, errors);
  }
  for (const key of ["cats", "categories", "items", "offers", "orders", "rows"]) {
    const list = comp.props?.[key];
    if (!Array.isArray(list)) continue;
    list.forEach((item, i) => {
      if (!item?.tapAction) return;
      const action = asActionObject(item.tapAction);
      if (action?.__invalid) {
        errors.push({ path: `${compPath}.props.${key}[${i}].tapAction`, message: `Item ${i + 1} in "${label}" has an unreadable tap action`, severity: "error", fix: "Re-link the tap action in the editor" });
      } else if (action) {
        checkNavAction(action, `${compPath}.props.${key}[${i}].tapAction`, `${label} › item ${i + 1}`, screenIds, errors);
      }
    });
  }
}
