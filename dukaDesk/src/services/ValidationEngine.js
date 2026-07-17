import { getRegisteredTypes } from "../runtime/ComponentRegistry";

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
      errors.push({ path: "meta.appName", message: "App name is required", severity: "error", fix: "Enter a business or app name in the Branding step" });
    }
    if (meta.appName && meta.appName.length > 50) {
      warnings.push({ path: "meta.appName", message: "App name is too long (max 50 characters)", severity: "warning" });
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
  if (shared) {
    const regTypes = getRegisteredTypes();

    if (shared.header) {
      validateSection(shared.header, "shared.header", errors, warnings, regTypes);
    }
    if (shared.footer) {
      validateSection(shared.footer, "shared.footer", errors, warnings, regTypes);
    }
  }

  /* ── Screen checks ── */
  if (!screens || Object.keys(screens).length === 0) {
    errors.push({ path: "screens", message: "No screens defined", severity: "error", fix: "Add at least one screen to your app" });
  } else {
    const regTypes = getRegisteredTypes();
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
        validateSection(sec, `${prefix}.bodySections[${i}]`, errors, warnings, regTypes);
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

function validateSection(section, path, errors, warnings, regTypes) {
  if (!section) return;

  if (!section.type) {
    errors.push({ path: `${path}.type`, message: "Section type is missing", severity: "error" });
  }

  if (!section.components || section.components.length === 0) {
    warnings.push({ path: `${path}.components`, message: `Section "${section.name || path}" has no components`, severity: "warning" });
    return;
  }

  section.components.forEach((comp, i) => {
    const compPath = `${path}.components[${i}]`;
    if (!comp.type) {
      errors.push({ path: `${compPath}.type`, message: "Component type is missing", severity: "error" });
    } else if (!regTypes.includes(comp.type)) {
      errors.push({ path: `${compPath}.type`, message: `Unknown component type "${comp.type}"`, severity: "error", fix: `Register "${comp.type}" or use one of: ${regTypes.join(", ")}` });
    }
  });
}
