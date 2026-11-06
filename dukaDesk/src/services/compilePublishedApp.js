import {
  applyArchetypeDefaults,
  archetypeRouteAliases,
  inferScreenArchetype,
  missingCommerceArchetypes,
  REQUIRED_COMMERCE_ARCHETYPES,
} from "./screenArchetypes";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "published-app";
}

function mergeRoutes(routes, screens) {
  const base = Array.isArray(routes) && routes.length
    ? routes
    : Object.keys(screens).map(screenId => ({ routeId: screenId, screenId, path: `/${screenId}` }));
  const known = new Set(base.map(route => route.screenId));
  const generated = Object.keys(screens)
    .filter(screenId => !known.has(screenId) && screens[screenId]?.archetype)
    .map(screenId => ({ routeId: screenId, screenId, path: `/${screenId}` }));
  return [...base, ...generated];
}

function normalizedPath(value) {
  const path = String(value || "").split(/[?#]/)[0];
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

function aliasMatches(alias, path) {
  const expected = normalizedPath(alias).split("/").filter(Boolean);
  const actual = normalizedPath(path).split("/").filter(Boolean);
  return expected.length === actual.length && expected.every((part, index) =>
    part.startsWith(":") || (part.startsWith("[") && part.endsWith("]")) || part.toLowerCase() === actual[index].toLowerCase());
}

function resolveScreenTarget(target, screens, allowGeneratedCommerce) {
  if (screens[target]) return { screenId: target };
  const path = normalizedPath(target);
  const direct = path.replace(/^\//, "");
  if (screens[direct]) return { screenId: direct };
  const byRoute = Object.entries(screens).find(([id, screen]) => [screen?.route, screen?.path, `/${id}`]
    .some(route => route && normalizedPath(route).toLowerCase() === path.toLowerCase()));
  if (byRoute) return { screenId: byRoute[0] };

  const archetypes = ["product_detail", "order_detail", "checkout", "cart", "orders", "catalog", "profile"];
  for (const archetype of archetypes) {
    if (!archetypeRouteAliases(archetype).some(alias => aliasMatches(alias, path))) continue;
    const existing = Object.entries(screens).find(([id, screen]) => inferScreenArchetype(id, screen) === archetype);
    if (existing) return { screenId: existing[0], archetype, path };
    if (allowGeneratedCommerce && REQUIRED_COMMERCE_ARCHETYPES.includes(archetype)) {
      return { screenId: `__archetype_${archetype}__`, archetype, path };
    }
  }
  return null;
}

function routeParamsFor(target, resolved) {
  const query = target.includes("?") ? target.split("?")[1].split("#")[0] : "";
  const params = Object.fromEntries(new URLSearchParams(query));
  const segments = normalizedPath(target).split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (resolved?.archetype === "product_detail" && lastSegment && !["product", "product-detail", "item-detail"].includes(lastSegment)) {
    params.productId ||= lastSegment;
  }
  if (resolved?.archetype === "order_detail" && lastSegment && !["order", "order-detail"].includes(lastSegment)) {
    params.orderId ||= lastSegment;
  }
  return params;
}

function generatedCompiledScreen(archetype) {
  const titles = {
    catalog: "Shop",
    product_detail: "Product",
    cart: "Cart",
    checkout: "Checkout",
    orders: "Orders",
    order_detail: "Order Details",
  };
  const children = {
    catalog: [{ type: "menu_grid", key: "generated-catalog", props: { columns: 2 } }],
    product_detail: [{ type: "product_detail", key: "generated-product-detail" }],
    cart: [{ type: "cart_content", key: "generated-cart" }],
    checkout: [{ type: "checkout_form", key: "generated-checkout" }],
    orders: [{ type: "order_history", key: "generated-orders" }],
    order_detail: [{ type: "order_detail", key: "generated-order-detail" }],
  }[archetype];
  if (!children) return null;
  const screenId = `__archetype_${archetype}__`;
  return {
    screenId,
    archetype,
    title: titles[archetype] || archetype,
    layout: { kind: "scroll", padding: archetype === "product_detail" || archetype === "order_detail" ? 0 : 16, gap: 12, children: applyArchetypeDefaults(children, archetype) },
    fixedTop: [],
    fixedBottom: [],
  };
}

export function compileDesignToPublishedApp(projectData, version, publishedAt, assetCatalog = []) {
  const source = JSON.parse(JSON.stringify(projectData || {}));
  const meta = source.meta || {};
  const sourceScreens = source.screens && typeof source.screens === "object" ? source.screens : {};
  const canGenerateCommerce = Object.values(sourceScreens).some(screen => {
    const archetype = screen?.archetype || inferScreenArchetype(screen?.screenId || screen?.name || "", screen || {});
    return REQUIRED_COMMERCE_ARCHETYPES.includes(archetype);
  });
  const libraries = Array.isArray(source.savedSections) ? source.savedSections : [];
  const libraryById = Object.fromEntries(libraries.map(section => [section.id, section]));

  const compileNode = node => {
    const copy = { ...node, key: node.key || node.id, props: { ...node.props } };
    let action = copy.props.action;
    if (typeof action === 'string' && action) {
      try { action = JSON.parse(action); } catch { throw new Error('Invalid component action: ' + copy.key); }
    }
    const parse = value => {
      if (value == null || value === "") return null;
      let parsed = value;
      if (typeof value === "string") {
        try { parsed = JSON.parse(value); } catch { throw new Error("Invalid component action: " + copy.key); }
      }
      if (!parsed || typeof parsed.type !== "string" || !parsed.type) throw new Error("Invalid component action: " + copy.key);
      if (["navigate", "push", "replace", "switch_screen"].includes(parsed.type)) {
        const payload = { ...(parsed.payload || {}) };
        const targetKey = ["screenId", "screen", "push", "target"].find(key => typeof payload[key] === "string" && payload[key]);
        if (!targetKey) {
          throw new Error("Choose an existing destination page for: " + copy.key + " (no destination page chosen yet)");
        }
        const target = payload[targetKey];
        const resolved = resolveScreenTarget(target, sourceScreens, canGenerateCommerce);
        if (!resolved) {
          throw new Error("Choose an existing destination page for: " + copy.key + " (\"" + target + "\" is not a page — available: " + Object.keys(sourceScreens).join(", ") + ")");
        }
        const params = routeParamsFor(target, resolved);
        parsed.payload = { ...payload, ...(Object.keys(params).length ? params : {}), screenId: resolved.screenId };
      }
      return parsed;
    };
    const merged = { ...node.actions, ...copy.props.actions };
    for (const key of Object.keys(merged)) merged[key] = parse(merged[key]);
    copy.actions = Object.keys(merged).length ? merged : (action ? { default: action } : undefined);
    if (copy.props.tapAction) copy.props.tapAction = parse(copy.props.tapAction);
    for (const key of ["cats", "categories", "items", "offers", "orders", "rows", "services"]) {
      if (Array.isArray(copy.props[key])) copy.props[key] = copy.props[key].map(item => item?.tapAction ? { ...item, tapAction: parse(item.tapAction) } : item);
    }
    if (node.children) copy.children = node.children.map(compileNode);
    if (node.layout) copy.layout = { ...node.layout, children: (node.layout.children || []).map(compileNode) };
    return copy;
  };
  const resolveSection = section => {
    if (section?.kind !== 'saved') return section;
    const saved = libraryById[section.libraryId];
    if (!saved) throw new Error('Missing saved section: ' + section.libraryId);
    return { ...saved, id: section.id };
  };
  const compileSection = section => {
    const resolved = resolveSection(section);
    return { type: 'layout', key: resolved.id, layout: {
      kind: 'section', ...resolved.layout,
      backgroundColor: resolved.backgroundColor ?? resolved.layout?.backgroundColor,
      padding: resolved.padding ?? resolved.layout?.padding ?? { top: 4, bottom: 4 },
      children: (resolved.components || []).map(compileNode),
    } };
  };
  const allSections = [...libraries, ...Object.values(source.shared || {}),
    ...Object.values(sourceScreens).flatMap(screen => screen.bodySections || [])];
  const chrome = (screen, type) => {
    const rule = screen.chrome?.[type] || { mode: 'inherit' };
    if (rule.mode === 'hide') return [];
    const section = rule.mode === 'custom'
      ? allSections.find(item => item.id === rule.sectionId) : source.shared?.[type];
    if (rule.mode === 'custom' && !section) throw new Error('Missing custom ' + type + ': ' + rule.sectionId);
    return section?.components?.length || section?.kind === 'saved' ? [compileSection(section)] : [];
  };
  const screens = Object.fromEntries(Object.entries(sourceScreens).map(([id, screen]) => {
    const layout = screen.layout || {};
    const archetype = inferScreenArchetype(id, screen);
    const bodyChildren = screen.bodySections ? screen.bodySections.map(compileSection) : (layout.children || screen.children || []).map(compileNode);
    return [id, {
      ...screen, screenId: id, title: screen.title || screen.name || id,
      ...(archetype ? { archetype } : {}),
      bodySections: undefined, chrome: undefined,
      layout: { kind: 'scroll', ...layout,
        backgroundColor: screen.backgroundColor ?? layout.backgroundColor,
        children: archetype ? applyArchetypeDefaults(bodyChildren, archetype) : bodyChildren,
      },
      fixedTop: archetype ? applyArchetypeDefaults(screen.fixedTop?.map(compileNode) ?? chrome(screen, 'header'), archetype) : (screen.fixedTop?.map(compileNode) ?? chrome(screen, 'header')),
      fixedBottom: archetype ? applyArchetypeDefaults(screen.fixedBottom?.map(compileNode) ?? chrome(screen, 'footer'), archetype) : (screen.fixedBottom?.map(compileNode) ?? chrome(screen, 'footer')),
      overlay: screen.overlay ? compileNode(screen.overlay) : undefined,
    }];
  }));

  // Commerce apps opt into archetypes: publish functional detail/cart/checkout/
  // orders screens even when the merchant template omitted them.
  const presentArchetypes = Object.values(screens).map(screen => screen.archetype).filter(Boolean);
  if (presentArchetypes.some(archetype => REQUIRED_COMMERCE_ARCHETYPES.includes(archetype))) {
    for (const archetype of missingCommerceArchetypes(presentArchetypes)) {
      const generated = generatedCompiledScreen(archetype);
      if (generated) screens[generated.screenId] = generated;
    }
  }

  const requestedInitial = source.navigation?.root?.initialRoute || source.navigation?.initialScreen || Object.keys(screens)[0] || "home";
  const initialTarget = resolveScreenTarget(requestedInitial, screens, false);
  if (!initialTarget) throw new Error(`Initial screen "${requestedInitial}" does not exist`);
  const initialRoute = initialTarget.screenId;
  const tabs = Array.isArray(source.navigation?.tabs) ? source.navigation.tabs.map((tab, index) => {
    const requestedScreen = tab.screenId || initialRoute;
    const target = resolveScreenTarget(requestedScreen, screens, false);
    if (!target) throw new Error(`Navigation tab "${tab.label || index + 1}" points to missing screen "${requestedScreen}"`);
    return {
      ...tab,
      tabId: tab.id || `tab_${index + 1}`,
      label: tab.label || target.screenId || `Tab ${index + 1}`,
      icon: typeof tab.icon === "string" ? tab.icon : "storefront-outline",
      screenId: target.screenId,
      guest: tab.guest ?? true,
      protected: tab.protected ?? false,
    };
  }) : [];

  const primary = meta.primaryColor || "#1A1A2E";
  const secondary = meta.secondaryColor || "#F4A026";
  // App background comes from what the user specified in the builder: an
  // explicit meta override, else the initial screen's background. The splash
  // background must never leak here — it painted every default publish navy.
  const initialBg = screens[initialRoute]?.backgroundColor;
  const background = meta.backgroundColor || initialBg || "#FCF8FA";
  const text = meta.textColor || "#0F0F1A";
  const fontFamily = meta.fontFamily || "Inter";
  // Merchant/business identity is owner metadata, not the customer-facing app
  // identity. An explicitly edited app name wins; otherwise use its slug.
  const appSlug = meta.slug || slugify(meta.appName || "published-app");
  const appName = meta.appName || appSlug;
  const logo = meta.logo || null;
  const containsTabs = nodes => (nodes || []).some(node => node.type === 'tab_bar' || containsTabs(node.children) || containsTabs(node.layout?.children));
  for (const screen of Object.values(screens)) {
    if (tabs.length && (source.navigation?.root?.type ?? 'tabs') === 'tabs' && !containsTabs([...(screen.layout.children || []), ...screen.fixedTop, ...screen.fixedBottom])) {
      screen.fixedBottom.push({ type: 'tab_bar', key: 'published-navigation', props: { tabs, navigationStyle: source.navigation?.style || {} } });
    }
  }
  const font = (fontSize, fontWeight, lineHeight) => ({ fontFamily, fontSize, fontWeight, lineHeight });

  return {
    manifestVersion: "1.0.0",
    version,
    publishedAt,
    status: "published",
    metadata: {
      ...source.metadata,
      version,
      schemaVersion: "1.0",
      displayName: appName,
      category: meta.category || "",
      publishedAt,
    },
    identity: {
      ...source.identity,
      slug: appSlug,
      displayName: appName,
    },
    capabilities: source.capabilities || {},
    navigation: {
      ...source.navigation,
      root: { type: "tabs", ...source.navigation?.root, initialRoute },
      initialScreen: initialRoute,
      tabs,
      stacks: source.navigation?.stacks || [],
      modals: source.navigation?.modals || [],
      routes: mergeRoutes((source.navigation?.routes || []).map(route => {
        const target = resolveScreenTarget(route.screenId || route.path, screens, false);
        if (!target) throw new Error(`Navigation route "${route.path || route.routeId}" points to missing screen "${route.screenId || route.path}"`);
        return { ...route, screenId: target.screenId };
      }), screens),
      deepLinks: source.navigation?.deepLinks || [],
      guestMode: source.navigation?.guestMode || { enabled: true, allowedScreens: Object.keys(screens), blockedActions: [], authPromptScreens: [] },
    },
    theme: {
      ...source.theme,
      version: { themeVersion: "1.0.0", schemaVersion: "1.0", ...source.theme?.version },
      brand: { ...source.theme?.brand, name: appName, logo: logo || undefined },
      colors: {
        primary, secondary, surface: background, background, card: "#FFFFFF", border: "#E5E7EB",
        success: "#16A34A", warning: "#F59E0B", error: "#EF4444", textPrimary: text,
        textSecondary: "#6B7280", disabled: "#9CA3AF", placeholder: "#9CA3AF",
        ...source.theme?.colors,
      },
      typography: {
        displayLg: font(32, "700", 40), displayMd: font(28, "700", 36), displaySm: font(24, "700", 32),
        headlineLg: font(22, "600", 28), headlineMd: font(20, "600", 24), headlineSm: font(18, "600", 22),
        bodyLg: font(16, "400", 24), bodyMd: font(14, "400", 20), bodySm: font(12, "400", 16),
        labelLg: font(14, "500", 20), labelMd: font(12, "500", 16), labelSm: font(10, "500", 14),
        cta: font(14, "600", 20), caption: font(10, "400", 14),
        ...source.theme?.typography,
      },
      spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, ...source.theme?.spacing },
      roundness: Number(meta.roundness ?? source.theme?.roundness ?? 12),
    },
    runtime: { version: "1.0.0", ...source.runtime },
    permissions: source.permissions || {},
    dataRequest: meta.dataRequest || source.dataRequest,
    localization: { defaultLocale: "en", supportedLocales: ["en"], ...source.localization },
    assets: {
      ...source.assets,
      logo: assetCatalog.find(asset => asset.url === logo) || (logo ? { type: "image", url: logo } : undefined),
      images: [...(source.assets?.images || []).filter(asset => !assetCatalog.some(upload => upload.id === asset.id || upload.url === asset.url)), ...assetCatalog],
    },
    // Compatibility fields for current mobile/template readers during contract migration.
    name: appName,
    appName,
    meta: {
      appName,
      businessName: meta.businessName || appName,
      logo,
      primaryColor: primary,
    },
    branding: {
      appName,
      businessName: meta.businessName || appName,
      tagline: meta.tagline || "",
      logo: logo || undefined,
    },
    content: source.content || {},
    splash: source.splash ? {
      ...source.splash,
      // Fixed product constant: splash always shows 2s, not merchant-configurable.
      durationMs: 2000,
      screen: source.splash.screen ? { ...source.splash.screen, layout: source.splash.screen.layout ? { ...source.splash.screen.layout, children: (source.splash.screen.layout.children || []).map(compileNode) } : undefined } : { screenId: '__published_splash__', layout: {
        kind: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', gap: 18, padding: 24,
        backgroundColor: source.splash.backgroundColor || primary,
        children: [
          ...(source.splash.backgroundImage ? [{ type: 'image', props: { source: source.splash.backgroundImage, style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } } }] : []),
          ...(source.splash.logo || logo ? [{ type: 'image', props: { source: source.splash.logo || logo, style: { width: 88, height: 88, borderRadius: 22 }, resizeMode: 'contain' } }] : []),
          { type: 'heading', props: { children: appName, color: '#FFFFFF', style: { fontSize: 22, fontWeight: '700' } } },
          ...(meta.tagline ? [{ type: 'text', props: { children: meta.tagline, color: '#FFFFFF', style: { fontSize: 13 } } }] : []),
        ],
      } },
    } : undefined,
    screens,
  };
}


// Backend enrichment is allowed; every submitted field must round-trip unchanged.
export function containsPublishedSnapshot(actual, expected) {
  if (expected === null || typeof expected !== 'object') return actual === expected;
  if (!actual || typeof actual !== 'object' || Array.isArray(actual) !== Array.isArray(expected)) return false;
  if (Array.isArray(expected) && actual.length !== expected.length) return false;
  return Object.entries(expected).filter(([, value]) => value !== undefined)
    .every(([key, value]) => Object.prototype.hasOwnProperty.call(actual, key) && containsPublishedSnapshot(actual[key], value));
}
