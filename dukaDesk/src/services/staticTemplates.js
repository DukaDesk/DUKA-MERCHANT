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
  // Backend template UUIDs must pass through untouched — never slugify them
  // into a `category/uuid` path (that path only exists for local templates).
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(templateName)) return templateName;
  if (!category) return templateName;
  const slug = templateName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `${categoryFolder(category)}/${slug}`;
}

export function isBackendTemplateId(templateId) {
  return typeof templateId === "string" && !templateId.includes("/") && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(templateId);
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
        source: "backend",
        slug: tpl.slug || null,
        thumbnail: tpl.thumbnail || null,
      });
    }
    const catalog = [...byCategory.values()].filter(c => c.templates.length > 0);
    return catalog.length ? catalog : null;
  } catch {
    return null;
  }
}

export async function getTemplateCatalog() {
  const [backendCatalog, localCatalog] = await Promise.all([
    fetchBackendCatalog(),
    fetchLocalCatalog(),
  ]);
  const merged = [];
  const seen = new Set();
  for (const cat of [...(backendCatalog || []), ...(localCatalog || [])]) {
    const fresh = { ...cat, templates: [] };
    for (const tpl of cat.templates || []) {
      if (!tpl || seen.has(tpl.id)) continue;
      seen.add(tpl.id);
      fresh.templates.push(tpl);
    }
    if (fresh.templates.length > 0) merged.push(fresh);
  }
  catalogCache.set("root", merged);
  return merged;
}

async function fetchLocalCatalog() {
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
              source: "local",
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

// Backend templates (GET /api/v1/templates/:id) use a different shape from the
// local manifests: `{ id, name, category, config: { pages: [{ name, slug,
// sections: [{ type, config, components: [{ type, props }] }] }], navigation:
// [{ label, target, icon }], theme } }`. Convert that shape into the same
// canvas design object that convertManifestToDesign produces.
const BACKEND_COMPONENT_MAP = {
  HeroBanner: "hero_banner",
  CategoryGrid: "category_pills",
  ProductCarousel: "menu_grid",
  ProductGrid: "menu_grid",
  ContactForm: "text_block",
  hero: "hero_banner",
  grid: "menu_grid",
  carousel: "menu_grid",
  text: "text_block",
};

function mapBackendComponent(comp, screenId, index) {
  const rawType = comp?.type || "text_block";
  const type = BACKEND_COMPONENT_MAP[rawType] || rawType;
  const rawProps = { ...(comp?.props || {}) };
  if (type === "hero_banner") {
    if (rawProps.backgroundImage && !rawProps.fill) rawProps.fill = rawProps.backgroundImage;
    if (rawProps.alignment && !rawProps.variant) {
      rawProps.variant = ["center", "left", "overlay", "split"].includes(rawProps.alignment) ? rawProps.alignment : "center";
    }
  }
  if (type === "text_block" && rawType === "ContactForm") {
    rawProps.text = rawProps.title || rawType;
  }
  if (rawProps.cta && typeof rawProps.cta === "object" && !rawProps.actions) {
    const cta = rawProps.cta;
    rawProps.actions = { default: { type: "navigate", payload: { push: cta.target || "/" } } };
  }
  return { type, props: rawProps, actions: comp?.actions, key: `comp_${screenId}_${index}` };
}

export function convertBackendTemplateToDesign(template) {
  const config = template?.config || {};
  const theme = config.theme || {};
  const bgColor = theme.backgroundColor || "#FCF8FA";
  const pages = Array.isArray(config.pages) ? config.pages : [];
  const screensOut = {};

  pages.forEach((page, pi) => {
    const id = page.slug || page.id || `screen_${pi}`;
    const sections = Array.isArray(page.sections) ? page.sections : [];
    screensOut[id] = {
      name: page.name || id,
      backgroundColor: bgColor,
      bodySections: sections.map((section, si) => ({
        id: `sec_${id}_${si}`,
        type: "custom",
        name: section.type || `Section ${si + 1}`,
        backgroundColor: bgColor,
        backendType: section.type || null,
        components: (Array.isArray(section.components) ? section.components : []).map((comp, ci) =>
          buildComponents(id, [mapBackendComponent(comp, id, ci)])[0]
        ),
      })),
    };
  });

  if (Object.keys(screensOut).length === 0) {
    screensOut.screen_1 = { name: "Home", backgroundColor: bgColor, bodySections: [] };
  }

  const screenIds = Object.keys(screensOut);
  const homePage = pages.find(p => p.isHome && (p.slug || p.id) && screensOut[p.slug || p.id]);
  const initialScreen = (homePage && (homePage.slug || homePage.id)) || screenIds[0];
  const navEntries = Array.isArray(config.navigation) ? config.navigation : [];
  const tabs = navEntries
    .map((t, i) => {
      const target = String(t.target || "").replace(/^\//, "");
      return {
        id: `tab_${i}_${Date.now()}`,
        label: t.label || "Tab",
        icon: tabEmoji(t.icon) || t.icon || "\uD83D\uDCCB",
        screenId: screensOut[target] ? target : "",
        color: t.color || undefined,
      };
    })
    .filter(t => t.screenId);

  return {
    meta: {
      appName: template?.name || "My App",
      category: template?.category || "",
      primaryColor: theme.primaryColor || "#1B4332",
      logo: null,
    },
    navigation: { initialScreen, style: {}, tabs },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: bgColor, components: [] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: bgColor, components: [] },
    },
    screens: screensOut,
  };
}

function isValidBackendTemplate(template) {
  const pages = template?.config?.pages;
  return template && typeof template === "object" && Array.isArray(pages) && pages.length > 0;
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
  // Local templates live under /templates/<folder>/<id>/ and are addressed as
  // `folder/id`. Anything else is a backend template UUID.
  if (!isBackendTemplateId(templateId)) {
    const { manifest, screens } = await loadAllTemplateScreens(templateId);
    if (!isValidTemplateManifest(manifest, screens)) throw new Error(`Template ${templateId} has no content`);
    return convertManifestToDesign(manifest, screens);
  }
  try {
    const res = await httpClient.get(`/api/v1/templates/${encodeURIComponent(templateId)}`);
    const body = res?.data ?? res;
    const template = body?.data ?? body;
    if (isValidBackendTemplate(template)) return convertBackendTemplateToDesign(template);
  } catch {
    // backend template unavailable — fall through to the error below
  }
  throw new Error(`Template ${templateId} has no content`);
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
