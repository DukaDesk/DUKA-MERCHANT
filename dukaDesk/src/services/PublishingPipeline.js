import { validateProject } from "./ValidationEngine";
import { getReleases, getCurrentDeployment, saveReleases, saveDeployment, uploadMediaAsset, getSetupData } from "./api";
import httpClient from "./httpClient";
import { getMerchant, isDemoId } from "./api";

function generateId() {
  return `rel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

async function getLastVersion() {
  try {
    const releases = await getReleases();
    if (!Array.isArray(releases) || releases.length === 0) return "0.0.0";
    const versions = releases
      .filter(r => r.status === "published")
      .map(r => r.version.split(".").map(Number));
    if (versions.length === 0) return "0.0.0";
    const sorted = versions.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
    const last = sorted[sorted.length - 1];
    return `${last[0]}.${last[1]}.${last[2]}`;
  } catch {
    return "0.0.0";
  }
}

function incrementVersion(version) {
  const [major, minor, patch] = version.split(".").map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

// Convert the editor model into the runtime contract consumed by the mobile app.
// Editor-only fields (shared sections, chrome modes and saved-section references)
// must not be the source of truth for a published app.
function compileDesignToPublishedApp(projectData, version, publishedAt, assetCatalog = []) {
  const source = JSON.parse(JSON.stringify(projectData || {}));
  const meta = source.meta || {};
  const sourceScreens = source.screens && typeof source.screens === "object" ? source.screens : {};
  const libraries = Array.isArray(source.savedSections) ? source.savedSections : [];
  const libraryById = Object.fromEntries(libraries.map(section => [section.id, section]));

  const resolveComponents = (sections) => {
    const components = [];
    for (const section of Array.isArray(sections) ? sections : []) {
      const resolved = section?.kind === "saved" ? libraryById[section.libraryId] : section;
      if (Array.isArray(resolved?.components)) components.push(...resolved.components);
    }
    return components;
  };

  const screens = Object.fromEntries(Object.entries(sourceScreens).map(([id, screen]) => {
    const children = resolveComponents(screen?.bodySections);
    return [id, {
      screenId: id,
      title: screen?.name || id,
      layout: {
        kind: "scroll",
        gap: 16,
        padding: 16,
        children,
      },
    }];
  }));

  const initialRoute = source.navigation?.initialScreen || Object.keys(screens)[0] || "home";
  const tabs = Array.isArray(source.navigation?.tabs) ? source.navigation.tabs.map((tab, index) => ({
    tabId: tab.id || `tab_${index + 1}`,
    label: tab.label || tab.screenId || `Tab ${index + 1}`,
    icon: typeof tab.icon === "string" ? tab.icon : "storefront-outline",
    screenId: tab.screenId || initialRoute,
    guest: true,
    protected: false,
  })) : [];

  const primary = meta.primaryColor || "#1A1A2E";
  const secondary = meta.secondaryColor || "#F4A026";
  const background = meta.backgroundColor || source.splash?.backgroundColor || "#FAFAFA";
  const text = meta.textColor || "#0F0F1A";
  const fontFamily = meta.fontFamily || "Inter";
  const appName = meta.appName || meta.businessName || "Published App";
  const logo = meta.logo || null;
  const font = (fontSize, fontWeight, lineHeight) => ({ fontFamily, fontSize, fontWeight, lineHeight });

  return {
    manifestVersion: "1.0.0",
    version,
    publishedAt,
    status: "published",
    metadata: {
      version,
      schemaVersion: "1.0",
      displayName: appName,
      category: meta.category || "",
      publishedAt,
    },
    identity: {
      slug: meta.slug || appName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") || "published-app",
      displayName: appName,
    },
    capabilities: {},
    navigation: {
      root: { type: "tabs", initialRoute },
      initialScreen: initialRoute,
      tabs,
      stacks: [],
      modals: [],
      routes: Object.keys(screens).map(screenId => ({ routeId: screenId, screenId, path: `/${screenId}` })),
      deepLinks: [],
      guestMode: { enabled: true, allowedScreens: Object.keys(screens), blockedActions: [], authPromptScreens: [] },
    },
    theme: {
      version: { themeVersion: "1.0.0", schemaVersion: "1.0" },
      brand: { name: appName, logo: logo || undefined },
      colors: {
        primary, secondary, surface: background, background, card: "#FFFFFF", border: "#E5E7EB",
        success: "#16A34A", warning: "#F59E0B", error: "#EF4444", textPrimary: text,
        textSecondary: "#6B7280", disabled: "#9CA3AF", placeholder: "#9CA3AF",
      },
      typography: {
        displayLg: font(32, "700", 40), displayMd: font(28, "700", 36), displaySm: font(24, "700", 32),
        headlineLg: font(22, "600", 28), headlineMd: font(20, "600", 24), headlineSm: font(18, "600", 22),
        bodyLg: font(16, "400", 24), bodyMd: font(14, "400", 20), bodySm: font(12, "400", 16),
        labelLg: font(14, "500", 20), labelMd: font(12, "500", 16), labelSm: font(10, "500", 14),
        cta: font(14, "600", 20), caption: font(10, "400", 14),
      },
      spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
      roundness: Number(meta.roundness ?? 12),
    },
    runtime: { version: "1.0.0" },
    permissions: {},
    localization: { defaultLocale: "en", supportedLocales: ["en"] },
    assets: {
      logo: assetCatalog.find(asset => asset.url === logo) || (logo ? { type: "image", url: logo } : undefined),
      images: assetCatalog,
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
    content: {},
    screens,
  };
}

function dataUrlToFile(dataUrl, name) {
  const [header, encoded] = String(dataUrl).split(",");
  const mime = (header.match(/^data:([^;]+)/) || [])[1] || "image/jpeg";
  const binary = atob(encoded || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type: mime });
}

async function materializeAssets(projectData) {
  const clone = JSON.parse(JSON.stringify(projectData || {}));
  const assets = [];
  const uploaded = new Map();
  let assetIndex = 0;

  async function walk(value) {
    if (typeof value === "string" && value.startsWith("data:image/")) {
      if (!uploaded.has(value)) {
        const file = dataUrlToFile(value, `builder-image-${++assetIndex}.jpg`);
        const asset = await uploadMediaAsset(file, { source: "builder" });
        const normalized = {
          id: asset.id,
          type: "image",
          url: asset.url,
          name: asset.name || file.name,
          mimeType: asset.mimeType || file.type,
          checksum: asset.checksum,
        };
        if (!normalized.url) throw new Error(`Media asset ${normalized.id} has no CDN URL`);
        uploaded.set(value, normalized);
        assets.push(normalized);
      }
      return uploaded.get(value).url;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) value[i] = await walk(value[i]);
      return value;
    }
    if (value && typeof value === "object") {
      for (const key of Object.keys(value)) value[key] = await walk(value[key]);
    }
    return value;
  }

  await walk(clone);

  const externalIds = new Map();
  const isImageReference = key => /image|logo|icon|avatar|thumbnail|background|fill|\bsrc\b/i.test(key);
  const addExternalReference = (url, key) => {
    if (!isImageReference(key) || !/^https?:\/\//i.test(url)) return;
    if (assets.some(asset => asset.url === url) || externalIds.has(url)) return;
    let hash = 0;
    for (let i = 0; i < url.length; i++) hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
    const id = `external_${Math.abs(hash)}`;
    externalIds.set(url, id);
    assets.push({ id, type: "image", url, name: url.split("/").pop() || "template-image", source: "template" });
  };
  const collectExternalReferences = (value, key = "") => {
    if (typeof value === "string") {
      addExternalReference(value, key);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(item => collectExternalReferences(item, key));
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([childKey, childValue]) => collectExternalReferences(childValue, childKey));
    }
  };
  collectExternalReferences(clone);
  return { project: clone, assets };
}

export async function publishProject(projectData) {
  const validation = validateProject(projectData);
  if (!validation.valid) {
    return { success: false, error: "Validation failed", validation };
  }

   // If screens are missing/empty (e.g. new merchant with no draft), generate a sensible default from the merchant's category/template
   let ensuredProject = projectData;
   if (!projectData?.screens || Object.keys(projectData.screens).length === 0 || Object.values(projectData.screens).every(s => !s?.bodySections?.length && !s?.layout?.children?.length)) {
     try {
       const { generateShopTemplate } = await import("./TemplateGenerator.js");
       const merchantTmp = getMerchant() || {};
       const setupTmp = getSetupData() || {};
       const fallback = generateShopTemplate({
         category: projectData?.meta?.category || setupTmp.category || merchantTmp.category || "Restaurant",
         template: projectData?.meta?.template || setupTmp.template || "Classic Dine",
         appName: projectData?.meta?.appName || setupTmp.appName || merchantTmp.business || "My Store",
         tagline: projectData?.meta?.tagline || setupTmp.tagline || "",
         color: projectData?.meta?.primaryColor || setupTmp.color || "#0066FF",
         logo: projectData?.meta?.logo || projectData?.splash?.logo || setupTmp.logo || null,
         businessName: projectData?.meta?.businessName || setupTmp.businessName || merchantTmp.business || "",
         bizDesc: setupTmp.bizDesc || "",
         phone: setupTmp.phone || "",
         address: setupTmp.address || "",
         hours: setupTmp.hours || [],
         selectedIntegrations: setupTmp.selectedIntegrations || [],
       });
       // Convert generated template (version/navigation/screens) back to builder project shape
       const { convertManifestToDesign } = await import("./staticTemplates.js");
       // generateShopTemplate already returns screens in builder-ish shape; build a minimal project
       ensuredProject = {
         ...projectData,
         meta: { ...projectData?.meta, appName: fallback.branding?.appName || fallback.meta?.appName, category: fallback.category, primaryColor: fallback.theme?.primaryColor },
         navigation: fallback.navigation,
         screens: Object.fromEntries(fallback.screens.map(s => [s.screenId, { name: s.title, bodySections: [{ id: `sec_${s.screenId}`, name: s.title, backgroundColor: "#FFFFFF", components: s.layout.children.map((c, i) => ({ id: `c_${s.screenId}_${i}`, type: c.type, props: c.props })) }] }])),
         splash: projectData?.splash || { backgroundColor: fallback.theme?.backgroundColor || "#FFFFFF", backgroundImage: "", logo: fallback.assets?.logo?.url || null },
       };
       console.warn("[Publish] No screens found — generated default screens from template", Object.keys(ensuredProject.screens));
     } catch (e) {
       return {
         success: false,
         error: "Cannot publish an app without at least one screen",
         validation: { ...validation, valid: false, errors: [...validation.errors, "At least one screen is required"] },
       };
     }
   }

   const merchant = getMerchant() || {};
   const setup = getSetupData() || {};
   const sourceMeta = ensuredProject?.meta || {};
   const appName = sourceMeta.appName || sourceMeta.businessName || setup.appName || merchant.business || "Published App";
   const sourceLogo = sourceMeta.logo || ensuredProject?.splash?.logo || setup.logo || null;
   const normalizedProject = {
     ...ensuredProject,
     meta: { ...sourceMeta, appName, businessName: sourceMeta.businessName || merchant.business || appName, logo: sourceLogo },
   };

   let publishData = normalizedProject;
   let assetCatalog = [];
   try {
     const materialized = await materializeAssets(normalizedProject);
     publishData = materialized.project;
     assetCatalog = materialized.assets;
   } catch (error) {
     return {
       success: false,
       error: `Image upload failed: ${error?.message || "Unable to store builder assets"}`,
       validation,
     };
   }

   const lastVersion = await getLastVersion();
  const version = incrementVersion(lastVersion);

  const release = {
    id: generateId(),
    version,
    timestamp: new Date().toISOString(),
    status: "published",
     project: JSON.parse(JSON.stringify(publishData)),
    validationResult: { errors: validation.errors.length, warnings: validation.warnings.length },
    environment: "production",
  };

  // ── Generation: compile SDUI manifest for mobile BFF ──
   const manifest = compileDesignToPublishedApp(publishData, release.version, release.timestamp, assetCatalog);

  // ── Console: simple form of data being sent to backend ──
  console.log("%c[Publish] Generating manifest v" + version, "color:#1A1A2E;font-weight:700");
  console.log("[Publish] Simple summary:", {
    version,
    appName: manifest.identity.displayName,
    screens: Object.keys(manifest.screens).length,
    tabs: manifest.navigation.tabs.length,
    splash: projectData?.splash ? { bg: projectData.splash.backgroundColor, hasImage: !!projectData.splash.backgroundImage, hasLogo: !!projectData.splash.logo } : null,
  });
  console.log("[Publish] Full manifest:", JSON.parse(JSON.stringify(manifest)));
  console.log("[Publish] Full projectData:", JSON.parse(JSON.stringify(projectData)));

  try {
     // 1) Keep local editor history; the documented merchant publish endpoint is
     // the only backend write used by the builder.
     const history = await getReleases();
    history.push(release);
    await saveReleases(history);
    await saveDeployment(manifest);

      // 2) Publish to the documented merchant publishing pipeline
      //    POST /api/v1/merchants/:id/publishing/publish (documented compile/publish route)
     const merchantId = merchant?.merchantId || merchant?.tenantId;
      if (merchantId && !isDemoId(merchantId)) {
       // Build minimal payload to avoid 413 (deduplicate: manifest already contains design/navigation/screens)
       // Estimate size before send
       const estimateSize = (obj) => new Blob([JSON.stringify(obj)]).size;
       const publishPayload = { version, manifest };
       const rawSize = estimateSize(publishPayload);
       console.log(`[Publish] → POST /api/v1/merchants/${merchantId}/publishing/publish — payload ${(rawSize/1024).toFixed(1)} KB`, JSON.parse(JSON.stringify(publishPayload)));

        // Images are uploaded to Media before this request, so this payload contains URLs and asset IDs only.
       let payloadToSend = publishPayload;
        if (rawSize > 800 * 1024) {
         console.warn(`[Publish] Payload large (${(rawSize/1024).toFixed(1)} KB) — stripping inline images to avoid 413`);
         const stripDataUrls = (obj) => {
           const clone = JSON.parse(JSON.stringify(obj));
           const walk = (o) => {
             if (!o || typeof o !== 'object') return;
             for (const k of Object.keys(o)) {
               const v = o[k];
               if (typeof v === 'string' && v.startsWith('data:image/') && v.length > 5000) {
                 // Replace large data URL with placeholder; in production, upload via /media/upload first
                 o[k] = `[stripped data URL ${ (v.length/1024).toFixed(1)} KB — use media upload]`;
               } else if (typeof v === 'object') walk(v);
             }
           };
           walk(clone);
           return clone;
         };
         payloadToSend = stripDataUrls(publishPayload);
         console.log(`[Publish] Stripped payload ${(estimateSize(payloadToSend)/1024).toFixed(1)} KB`, JSON.parse(JSON.stringify(payloadToSend)));
       }

       // Attempt SDUI publishing pipeline (primary) — with 413 handling
       try {
         await httpClient.post(`/api/v1/merchants/${merchantId}/publishing/publish`, payloadToSend);
       } catch (e) {
        const status = e?.response?.status || e?.status;
        if (status === 413) {
          console.warn("[Publish] 413 Request Entity Too Large — payload too big, check images. Raw size:", (new Blob([JSON.stringify(publishPayload)]).size/1024).toFixed(1) + " KB");
          // Try again with aggressively stripped payload (remove all data URLs)
          try {
            const stripAll = (obj) => {
              const clone = JSON.parse(JSON.stringify(obj));
              const walk = (o) => {
                if (!o || typeof o !== 'object') return;
                for (const k of Object.keys(o)) {
                  const v = o[k];
                  if (typeof v === 'string' && v.startsWith('data:image/')) o[k] = "";
                  else if (typeof v === 'object') walk(v);
                }
              };
              walk(clone);
              return clone;
            };
            const minimal = stripAll(publishPayload);
            console.log("[Publish] Retrying with stripped images", JSON.parse(JSON.stringify(minimal)));
            await httpClient.post(`/api/v1/merchants/${merchantId}/publishing/publish`, minimal);
            console.log("[Publish] Retry succeeded with stripped payload");
          } catch (retryErr) {
            console.warn("[Publish] Retry also failed:", retryErr?.message || retryErr);
          }
        }
        console.warn("[publishProject] publishing/publish failed (demo fallback):", e?.message || e);
      }

      // Fallback: also persist via App config so that definition has a chance even if publishing draft is empty
      // This is best-effort and merchant-isolated (JWT → current merchant)
      try {
        await httpClient.put(`/api/v1/app/merchants/config`, { config: { deployed: manifest, app: { lastPublished: manifest } } });
        console.log("[Publish] Fallback PUT /api/v1/app/merchants/config succeeded");
      } catch (e) {
        console.warn("[Publish] Fallback config PUT failed:", e?.message || e);
      }

      // Best-effort: try to sync to draft pages if backend uses draft compilation.
      // We don't know exact payload, so we do a minimal no-op initialize to ensure draft exists, then verify.
      try {
        await httpClient.post(`/api/v1/app/draft/initialize`, {}).catch(() => {});
      } catch {}

       // Verify that definition is now non-empty (skip for demo tenants — no real backend merchant)
      try {
        if (!isDemoId(merchantId)) {
          const verifyRes = await httpClient.get(`/api/v1/merchants/${merchantId}/definition`);
          const def = verifyRes?.data ?? verifyRes;
          const screensLen = Object.keys(def?.screens || {}).length;
          const navLen = Array.isArray(def?.navigation) ? def.navigation.length : Object.keys(def?.navigation || {}).length;
          if (screensLen === 0 && navLen === 0) {
            console.warn("[Publish] Verification: definition still empty after publish", def);
          } else {
            console.log("[Publish] Verification: definition OK", { screens: screensLen, navigation: navLen });
          }
        } else {
          console.log("[Publish] Demo tenant — skipping definition verification GET");
        }
      } catch (e) {
        console.warn("[Publish] Verification GET definition failed:", e?.message || e);
      }
    }
  } catch (e) {
    return { success: false, error: "Failed to save: " + e.message, validation };
  }

  return { success: true, version, releaseId: release.id, validation, manifest };
}

export async function getReleaseHistory() {
  try {
    return await getReleases();
  } catch {
    return [];
  }
}

export { getCurrentDeployment };

export async function rollbackToRelease(releaseId) {
  try {
    const history = await getReleases();
    const release = history.find(r => r.id === releaseId);
    if (!release) {
      return { success: false, error: `Release "${releaseId}" not found` };
    }

    const updated = history.map(r => {
      if (r.status === "published" && r.id !== releaseId) {
        return { ...r, status: "rolled_back" };
      }
      return r;
    });

    await saveReleases(updated);
    await saveDeployment({
      ...release.project,
      publishedAt: new Date().toISOString(),
      version: release.version,
      status: "published",
      rollbackFrom: releaseId,
    });

    return { success: true, version: release.version };
  } catch (e) {
    return { success: false, error: "Failed to rollback: " + e.message };
  }
}
