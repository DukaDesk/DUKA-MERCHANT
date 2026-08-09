import { loadAllTemplateScreens } from "./TemplateLoader";

const catalogCache = new Map();

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

export async function getTemplateCatalog() {
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
            return {
              id: `${folder}/${id}`,
              name: manifest.name || id,
              category: manifest.category || cat.name,
              tags: manifest.tags || [],
              features: manifest.features || [],
              preview: manifest.preview || null,
              primaryColor: manifest.theme?.primaryColor || "#1B4332",
              secondaryColor: manifest.theme?.secondaryColor || "#F4A026",
            };
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

function buildComponents(screenId, children) {
  return (Array.isArray(children) ? children : []).map((child, i) => ({
    id: child.key || `comp_${screenId}_${i}`,
    type: child.type || "text_block",
    props: child.props || {},
    fills: [{ type: "solid", color: "#E8E5E0", opacity: 100 }],
    strokes: [],
    effects: [],
    cornerRadius: 0,
    opacity: 1,
    rotation: 0,
    locked: false,
    visible: true,
    zIndex: i,
  }));
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
      tabs: Array.isArray(nav.tabs)
        ? nav.tabs.map((t, i) => ({ id: `tab_${i}_${Date.now()}`, label: t.label || "Tab", icon: t.icon || "\uD83D\uDCCB", screenId: t.screenId || "" }))
        : [],
    },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: bgColor, components: [] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: bgColor, components: [] },
    },
    screens: screensOut,
  };
}

export async function loadTemplateForCanvas(templateId) {
  const { manifest, screens } = await loadAllTemplateScreens(templateId);
  return convertManifestToDesign(manifest, screens);
}
