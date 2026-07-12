const templateCache = new Map();

export async function loadTemplateManifest(templateId) {
  if (templateCache.has(templateId)) {
    return templateCache.get(templateId);
  }
  const response = await fetch(`/templates/${templateId}/manifest.json`);
  if (!response.ok) throw new Error(`Failed to load template manifest: ${templateId}`);
  const manifest = await response.json();
  templateCache.set(templateId, manifest);
  return manifest;
}

export async function loadTemplateScreen(templateId, screenId) {
  const manifest = await loadTemplateManifest(templateId);
  const screenRef = manifest.screens.find(s => s.id === screenId);
  if (!screenRef) throw new Error(`Screen ${screenId} not found in template ${templateId}`);
  const response = await fetch(`/templates/${templateId}/${screenRef.path}`);
  if (!response.ok) throw new Error(`Failed to load screen: ${screenRef.path}`);
  return response.json();
}

export async function loadAllTemplateScreens(templateId) {
  const manifest = await loadTemplateManifest(templateId);
  const screens = {};
  for (const screenRef of manifest.screens) {
    screens[screenRef.id] = await loadTemplateScreen(templateId, screenRef.id);
  }
  return { manifest, screens };
}

export function clearTemplateCache() {
  templateCache.clear();
}

export function getCachedTemplate(templateId) {
  return templateCache.get(templateId);
}