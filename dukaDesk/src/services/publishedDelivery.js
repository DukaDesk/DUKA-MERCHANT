import httpClient from './httpClient';
import { containsPublishedSnapshot } from './compilePublishedApp';
const unwrap = response => response?.data ?? response;
const path = id => '/api/v1/merchants/' + encodeURIComponent(id);
const key = id => 'dukadesk:pending-publication:' + id;
export function pendingPublication(id) {
  const stored = sessionStorage.getItem(key(id));
  if (!stored) return null;
  return JSON.parse(stored);
}
const remember = (id, operation) => sessionStorage.setItem(key(id), JSON.stringify(operation));
const pending = (operation, error) => ({ success: false, pending: true, status: 'verification-pending', version: operation.manifest.version, receipt: operation.receipt, error: 'Publication has not been confirmed live. ' + error + ' Check publication status before publishing again.' });
export async function readPublished(id) {
  const manifest = unwrap(await httpClient.get(path(id) + '/definition'));
  if (manifest?.manifestVersion !== '1.0.0' || manifest?.status !== 'published' || !manifest?.version || !manifest?.screens || Array.isArray(manifest.screens)) throw new Error('Backend is not serving a canonical published app');
  return manifest;
}
export async function readHistory(id) {
  const history = unwrap(await httpClient.get(path(id) + '/publishing/releases'));
  if (!Array.isArray(history)) throw new Error('Invalid backend release history');
  return history.map(release => ({ ...release, timestamp: release.publishedAt, environment: release.channel }));
}
export async function verifyPublication(id) {
  const operation = pendingPublication(id);
  if (!operation) return { success: false, error: 'No publication is awaiting verification' };
  try {
    const [definition, response] = await Promise.all([readPublished(id), httpClient.get('/api/v1/bff/mobile/tenant/' + encodeURIComponent(id) + '/manifest')]);
    const bff = unwrap(response);
    if (!containsPublishedSnapshot(definition, operation.manifest) || !containsPublishedSnapshot(bff, operation.manifest)) throw new Error('Definition and mobile manifest do not both match the submitted snapshot.');
    // Recover a lost receipt only through the backend release record, never editor config.
    let receipt = operation.receipt;
    if (!receipt?.releaseId || !receipt?.checksum) {
      const record = unwrap(await httpClient.get(path(id) + '/publishing/releases/' + encodeURIComponent(operation.manifest.version)));
      if (!containsPublishedSnapshot(record?.manifest, operation.manifest)) throw new Error('Backend release record does not match the submitted snapshot.');
      receipt = { releaseId: record.id, version: record.version, checksum: record.checksum, publishedAt: record.publishedAt };
    }
    if (!receipt.releaseId || !receipt.checksum || receipt.version !== operation.manifest.version) throw new Error('Backend release receipt is missing or conflicts with the submitted version.');
    remember(id, { ...operation, receipt });
    sessionStorage.removeItem(key(id));
    return { success: true, status: 'live', version: receipt.version, releaseId: receipt.releaseId, receipt, manifest: definition };
  } catch (error) { return pending(operation, error.message); }
}
export async function submitPublication(id, manifest, rollbackVersion) {
  if (pendingPublication(id)) return { ...await verifyPublication(id), verifiedPrevious: true };
  const operation = { manifest, idempotencyKey: crypto.randomUUID(), kind: rollbackVersion ? 'rollback' : 'publish' };
  // Persist before sending. A failed journal write must not send an untrackable mutation.
  remember(id, operation);
  try {
    const suffix = rollbackVersion ? '/publishing/rollback/' + encodeURIComponent(rollbackVersion) : '/publishing/publish';
    const response = unwrap(await httpClient.post(path(id) + suffix, rollbackVersion ? {} : { version: manifest.version, manifest }, { headers: { 'Idempotency-Key': operation.idempotencyKey }, silentSuccess: true }));
    operation.receipt = { ...response, releaseId: response?.releaseId ?? response?.id };
    remember(id, operation);
  } catch (error) {
    const status = error.response?.status ?? error.status;
    if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
      sessionStorage.removeItem(key(id));
      return { success: false, status: 'rejected', error: status === 413 ? 'Backend rejected this manifest (413). Images were not removed.' : error.response?.data?.message || error.message || 'Publication rejected (' + status + ')' };
    }
    return pending(operation, error.message || 'The request outcome is unknown.');
  }
  return verifyPublication(id);
}
export async function rollbackPublication(id, releaseId) {
  if (pendingPublication(id)) return { ...await verifyPublication(id), verifiedPrevious: true };
  const history = await readHistory(id);
  const release = history.find(entry => entry.id === releaseId);
  if (!release) return { success: false, error: 'Release not found' };
  const record = unwrap(await httpClient.get(path(id) + '/publishing/releases/' + encodeURIComponent(release.version)));
  if (record?.manifest?.manifestVersion !== '1.0.0' || record.manifest.version !== release.version) return { success: false, error: 'This release does not contain a compatible compiled manifest' };
  return submitPublication(id, record.manifest, release.version);
}
