import { pendingPublication, verifyPublication, submitAppForReview, readHistory, readPublished, rollbackPublication } from './publishedDelivery';
import { compileDesignToPublishedApp } from "./compilePublishedApp";
import { validateProject } from "./ValidationEngine";
import { getReleases, getCurrentDeployment as getLegacyDeployment, saveReleases, saveDeployment, uploadMediaAsset, getSetupData } from "./api";
import { getMerchant, isDemoId, getProducts, hydrateDesignWithProducts } from "./api";

function generateId() {
  return `rel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

async function getLastVersion(releasesOverride) {
  const releases = releasesOverride ?? await getReleases();
  if (!Array.isArray(releases)) throw new Error("Invalid release history");
  const versions = releases
    .map(release => String(release.version || "").match(/^(\d+)\.(\d+)\.(\d+)$/))
    .filter(Boolean)
    .map(match => match.slice(1).map(Number));
  if (releases.length > 0 && versions.length === 0) {
    throw new Error("Release history does not contain a valid app version");
  }
  if (versions.length === 0) return null;
  const sorted = versions.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const last = sorted[sorted.length - 1];
  return `${last[0]}.${last[1]}.${last[2]}`;
}

function incrementVersion(version) {
  if (!version) return "1.0.0";
  const [major, minor, patch] = version.split(".").map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "published-app";
}

// Convert the editor model into the runtime contract consumed by the mobile app.
// Editor-only fields (shared sections, chrome modes and saved-section references)
// must not be the source of truth for a published app.
export function buildManifestPreview(projectData) {
  const publishedAt = new Date().toISOString();
  return compileDesignToPublishedApp(projectData, "draft", publishedAt);
}

function dataUrlToFile(dataUrl, name) {
  const [header, encoded] = String(dataUrl).split(",");
  const mime = (header.match(/^data:([^;]+)/) || [])[1] || "image/png";
  const extension = mime.split("/")[1]?.replace("jpeg", "jpg") || "bin";
  const safeName = String(name || "builder-asset").replace(/\.[a-z0-9]+$/i, "");
  const binary = atob(encoded || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], `${safeName}.${extension}`, { type: mime });
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
  const publishingMerchant = getMerchant() || {};
  const publishingId = publishingMerchant.merchantId || publishingMerchant.tenantId;
  if (!publishingId) return { success: false, error: 'Sign in to a merchant before publishing' };
  if (publishingId && !isDemoId(publishingId) && pendingPublication(publishingId)) return { ...await verifyPublication(publishingId), verifiedPrevious: true };
  const validation = validateProject(projectData);
  if (!validation.valid) {
    return { success: false, error: "Validation failed", validation };
  }

   // If screens are missing/empty (e.g. new merchant with no draft), generate a sensible default from the merchant's category/template
   let ensuredProject = projectData;
   if (!projectData?.screens || Object.keys(projectData.screens).length === 0) {
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
        // generateShopTemplate already returns screens in builder-ish shape; build a minimal project
        ensuredProject = {
          ...projectData,
          meta: { ...projectData?.meta, appName: fallback.branding?.appName || fallback.meta?.appName, category: fallback.category, primaryColor: fallback.theme?.primaryColor },
          navigation: fallback.navigation,
          screens: Object.fromEntries(fallback.screens.map(s => [s.screenId, { name: s.title, bodySections: [{ id: `sec_${s.screenId}`, name: s.title, backgroundColor: "#FFFFFF", components: s.layout.children.map((c, i) => ({ id: `c_${s.screenId}_${i}`, type: c.type, props: c.props })) }] }])),
          splash: projectData?.splash || { backgroundColor: fallback.theme?.backgroundColor || "#FFFFFF", backgroundImage: "", logo: fallback.assets?.logo?.url || null },
        };
        // Scan-and-fix like template select: fill menu grids from the live catalog.
        try {
          ensuredProject = hydrateDesignWithProducts(ensuredProject, await getProducts());
        } catch { /* placeholders stay as fallback */ }
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
   const appName = sourceMeta.appName || sourceMeta.slug || setup.appName || "published-app";
   const appSlug = sourceMeta.slug || appName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "published-app";
   const sourceLogo = sourceMeta.logo || ensuredProject?.splash?.logo || setup.logo || null;
   const normalizedProject = {
     ...ensuredProject,
     meta: { ...sourceMeta, appName, slug: appSlug, businessName: sourceMeta.businessName || merchant.business || "", logo: sourceLogo },
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

   const history = await getReleaseHistory();
   const lastVersion = await getLastVersion(history);
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



  try {
    if (publishingId && !isDemoId(publishingId)) {
      return { ...(await submitAppForReview(manifest)), pendingReview: true, validation };
    }

    // Record a successful deployment only after the backend read-back matches.
    const releaseHistory = Array.isArray(history) ? [...history, release] : [release];
    await saveReleases(releaseHistory);
    await saveDeployment(manifest);
  } catch (error) {
    const status = error?.response?.status;
    return { success: false, pending: true, error: status ? `Submission failed (HTTP ${status})` : error?.message || 'Submission failed', validation };
  }

  return { success: true, version, releaseId: release.id, validation, manifest };
}
export async function getReleaseHistory() {
  const merchant = getMerchant() || {};
  const id = merchant.merchantId || merchant.tenantId;
  if (id && !isDemoId(id)) return readHistory(id);
  return getReleases();
}
export async function getCurrentDeployment() {
  const merchant = getMerchant() || {};
  const id = merchant.merchantId || merchant.tenantId;
  return id && !isDemoId(id) ? readPublished(id) : getLegacyDeployment();
}

export async function rollbackToRelease(releaseId) {
  try {
    const merchant = getMerchant() || {};
    const id = merchant.merchantId || merchant.tenantId;
    if (id && !isDemoId(id)) return await rollbackPublication(id, releaseId);
    const history = await getReleases();
    const release = history.find(r => r.id === releaseId);
    if (!release) {
      return { success: false, error: `Release "${releaseId}" not found` };
    }

    const version = incrementVersion(await getLastVersion(history));
    const timestamp = new Date().toISOString();
    const rollbackRelease = {
      ...release,
      id: generateId(),
      version,
      timestamp,
      status: "published",
      rollbackFrom: releaseId,
    };
    const updated = [
      ...history.map(r => r.status === "published" ? { ...r, status: "rolled_back" } : r),
      rollbackRelease,
    ];

    await saveReleases(updated);
    await saveDeployment({
      ...release.project,
      publishedAt: timestamp,
      version,
      status: "published",
      rollbackFrom: releaseId,
    });

    return { success: true, version, releaseId: rollbackRelease.id };
  } catch (e) {
    return { success: false, error: "Failed to rollback: " + e.message };
  }
}
