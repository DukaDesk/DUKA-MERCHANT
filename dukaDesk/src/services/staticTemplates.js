import { loadAllTemplateScreens } from "./TemplateLoader";
import httpClient from "./httpClient";
import { getComponentType } from "../components/canvas-editor/componentTypes";

const catalogCache = new Map();

const TAB_EMOJI_MAP = {
  "home-outline": "\uD83C\uDFE0",
  "storefront-outline": "\uD83C\uDFEA",
  "shop-outline": "\uD83C\uDFEA",
  "cart-outline": "\uD83D\uDED2",
  "receipt-outline": "\uD83D\uDCCB",
  "clipboard-outline": "\uD83D\uDCCB",
  "order-outline": "\uD83D\uDCCB",
  "person-outline": "\uD83D\uDC64",
  "parent-outline": "\uD83D\uDC64",
  "calendar-outline": "\uD83D\uDCC5",
  "tag-outline": "\uD83C\uDFF7\uFE0F",
  "restaurant-outline": "\uD83C\uDF5F",
  "information-outline": "\u2139\uFE0F",
  "megaphone-outline": "\uD83D\uDCE3",
  "trophy-outline": "\uD83C\uDFC6",
  "heart-outline": "\uD83D\uDC96",
  "book-outline": "\uD83D\uDCD6",
  "people-outline": "\uD83C\uDF32",
  "videocam-outline": "\uD83D\uDCF9",
  "bag-outline": "\uD83D\uDC5C",
  "card-outline": "\uD83D\uDCB3",
  "grid-outline": "\uD83D\uDCCB",
  "phone-outline": "\uD83D\uDCDE",
  "bookings-outline": "\uD83D\uDCC5",
};

function tabEmoji(icon) {
  if (!icon || typeof icon !== "string") return null;
  if (TAB_EMOJI_MAP[icon]) return TAB_EMOJI_MAP[icon];
  return null;
}

export function categoryFolder(category) {
  return String(category || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

export function resolveTemplateId(category, templateName) {
  if (!templateName) return "";
  if (templateName.includes("/")) return templateName;
  if (!category) return templateName;
  const slug = templateName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `${categoryFolder(category)}/${slug}`;
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

function isValidCatalogTemplate(tpl) {
  if (!tpl || typeof tpl !== "object") return false;
  if (!tpl.id && !tpl.templateId) return false;
  return true;
}

async function fetchBackendCatalog() {
  try {
    const res = await httpClient.get("/api/v1/templates", { params: { limit: 100 } });
    const body = res?.data ?? res;
    const list = Array.isArray(body) ? body : body?.data ?? body?.items ?? body?.templates ?? [];
    if (!Array.isArray(list) || list.length === 0) return null;
    const byCategory = new Map();
    for (const tpl of list) {
      if (!isValidCatalogTemplate(tpl)) continue;
      const cat = tpl.category || "General";
      if (!byCategory.has(cat)) byCategory.set(cat, { name: cat, desc: "", icon: null, templates: [] });
      byCategory.get(cat).templates.push({
        id: tpl.id || tpl.templateId,
        name: tpl.name || tpl.id || tpl.templateId,
        category: cat,
        tags: tpl.tags || [],
        features: tpl.features || [],
        preview: tpl.preview || null,
        primaryColor: tpl.theme?.primaryColor || tpl.primaryColor || "#1B4332",
        secondaryColor: tpl.theme?.secondaryColor || tpl.secondaryColor || "#F4A026",
      });
    }
    const catalog = [...byCategory.values()].filter(c => c.templates.length > 0);
    return catalog.length ? catalog : null;
  } catch {
    return null;
  }
}

export async function getTemplateCatalog() {
  const backendCatalog = await fetchBackendCatalog();
  if (backendCatalog) {
    catalogCache.set("root", backendCatalog);
    return backendCatalog;
  }
  const root = await fetchJSON("/templates/manifest.json");
  const categories = Array.isArray(root.categories) ? root.categories : [];

  const entries = await Promise.all(
    categories.map(async (cat) => {
      const folder = categoryFolder(cat.name);
      const ids = Array.isArray(cat.templates) ? cat.templates : [];
      const items = await Promise.all(
        ids.map(async (id) => {
          try {
            const manifest = await fetchJSON(`/templates/${folder}/${id}/manifest.json`);
            const tpl = {
              id: `${folder}/${id}`,
              name: manifest.name || id,
              category: manifest.category || cat.name,
              tags: manifest.tags || [],
              features: manifest.features || [],
              preview: manifest.preview || null,
              primaryColor: manifest.theme?.primaryColor || "#1B4332",
              secondaryColor: manifest.theme?.secondaryColor || "#F4A026",
            };
            const screens = manifest.screens || [];
            if (!Array.isArray(screens) || screens.length === 0) return null;
            return tpl;
          } catch {
            return null;
          }
        })
      );
      return {
        icon: cat.icon || null,
        name: cat.name,
        desc: cat.desc || "",
        templates: items.filter(Boolean),
      };
    })
  );

   const catalog = entries.filter(cat => cat.templates.length > 0);
  catalogCache.set("root", catalog);
  return catalog;
}

export function getCachedTemplateCatalog() {
  return catalogCache.get("root") || null;
}

function normalizeTemplateProps(child, type) {
  const def = getComponentType(type);
  const raw = child.props || {};
  const props = { ...(def?.defaultProps || {}), ...raw };

  if (type === "hero_banner" && raw.image && !props.fill) {
    props.fill = raw.image;
  }

  if (type === "menu_grid" && Array.isArray(props.items)) {
    props.items = props.items.map((item) => {
      if (item.img && !item.image) return { ...item, image: item.img };
      return item;
    });
  }

  if (type === "category_pills" && Array.isArray(raw.categories)) {
    props.cats = raw.categories.map((label, i) => ({ label, active: i === 0 }));
  }

  if (child.actions && typeof child.actions === "object") {
    props.actions = child.actions;
  }

  return props;
}

function buildComponents(screenId, children) {
  return (Array.isArray(children) ? children : []).map((child, i) => {
    const type = child.type || "text_block";
    const props = normalizeTemplateProps(child, type);
    return {
      id: child.key || `comp_${screenId}_${i}`,
      type,
      props,
      fills: [{ type: "solid", color: "#E8E5E0", opacity: 100 }],
      strokes: [],
      effects: [],
      cornerRadius: props.radius ?? 0,
      opacity: 1,
      rotation: 0,
      locked: false,
      visible: true,
      zIndex: i,
    };
  });
}

export function convertManifestToDesign(manifest, screens) {
  const nav = manifest.navigation || {};
  const bgColor = manifest.theme?.bgColor || "#FCF8FA";
  const screensOut = {};
  const allScreens = screens || {};

  const screenEntries = Array.isArray(nav.screens)
    ? nav.screens.map(s => ({ id: s.id, data: allScreens[s.id] }))
    : Object.entries(allScreens).map(([id, data]) => ({ id, data }));

  screenEntries.forEach(({ id, data }) => {
    const name = data?.title || id;
    screensOut[id] = {
      name,
      backgroundColor: bgColor,
      bodySections: [
        {
          id: `sec_${id}`,
          type: "custom",
          name,
          backgroundColor: bgColor,
          components: buildComponents(id, data?.layout?.children),
        },
      ],
    };
  });

  if (Object.keys(screensOut).length === 0) {
    screensOut.screen_1 = {
      name: "Home",
      backgroundColor: bgColor,
      bodySections: [],
    };
  }

  return {
    meta: {
      appName: manifest.name || "My App",
      category: manifest.category || "",
      primaryColor: manifest.theme?.primaryColor || "#1B4332",
      logo: null,
    },
    navigation: {
      initialScreen: nav.initialScreen || Object.keys(screensOut)[0],
      style: nav.style || {},
      tabs: Array.isArray(nav.tabs)
        ? nav.tabs.map((t, i) => ({ id: `tab_${i}_${Date.now()}`, label: t.label || "Tab", icon: tabEmoji(t.icon) || t.icon || "\uD83D\uDCCB", screenId: t.screenId || "", color: t.color || undefined }))
        : [],
    },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: bgColor, components: [] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: bgColor, components: [] },
    },
    screens: screensOut,
  };
}

function isValidTemplateManifest(manifest, screens) {
  if (!manifest || typeof manifest !== "object") return false;
  const screenMap = screens || manifest.screens;
  const hasScreens = Array.isArray(manifest.screens)
    ? manifest.screens.length > 0
    : screenMap && typeof screenMap === "object" && Object.keys(screenMap).length > 0;
  if (!hasScreens) return false;
  return true;
}

export async function loadTemplateForCanvas(templateId) {
  try {
    const res = await httpClient.get(`/api/v1/templates/${encodeURIComponent(templateId)}`);
    const body = res?.data ?? res;
    const manifest = body?.data ?? body;
    const screens = manifest.screens || body?.screens || {};
    if (isValidTemplateManifest(manifest, screens)) {
      const screenMap = Array.isArray(screens)
        ? Object.fromEntries(screens.map(s => [s.id || s.screenId, s]))
        : screens;
      return convertManifestToDesign(manifest, screenMap);
    }
  } catch {
    // backend template unavailable, fallback to local
  }
  const { manifest, screens } = await loadAllTemplateScreens(templateId);
  if (!isValidTemplateManifest(manifest, screens)) throw new Error(`Template ${templateId} has no content`);
  return convertManifestToDesign(manifest, screens);
}

export async function applyBackendTemplate(templateId) {
  try {
    const res = await httpClient.post(`/api/v1/templates/${encodeURIComponent(templateId)}/use`);
    return res?.data ?? res;
  } catch {
    // backend template use unavailable
    return null;
  }
}
