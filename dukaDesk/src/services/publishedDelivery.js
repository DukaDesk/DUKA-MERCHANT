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
const pending = (operation, error) => ({ success: false, pending: true, status: 'verification-pending', version: operation.manifest.version, receipt: operation.receipt, error: 'Submission has not been confirmed. ' + error + ' Submit again to check the previous submission.' });
export async function submitAppForReview(manifest) {
  const response = unwrap(await httpClient.post(
    '/api/v1/app/merchants/review/submit',
    manifest ? { manifest } : {},
    { silentSuccess: true },
  ));
  return {
    ...(response && typeof response === 'object' ? response : {}),
    success: true,
    submitted: true,
    status: 'in_review',
    version: response?.version || manifest?.version,
    releaseId: response?.releaseId || response?.release?.id,
    message: 'App submitted for admin review. It will be published after approval.',
  };
}
export async function readPublished(id) {
  // Probe: NO_PUBLISHED_RELEASE before first publish is an expected outcome,
  // not an error — stay silent so no toast is emitted for it.
  const manifest = unwrap(await httpClient.get(path(id) + '/definition', { silent: true }));
  if (manifest?.manifestVersion !== '1.0.0' || manifest?.status !== 'published' || !manifest?.version || !manifest?.screens || Array.isArray(manifest.screens)) throw new Error('Backend is not serving a canonical published app');
  return manifest;
}
export async function readHistory(id) {
  const history = unwrap(await httpClient.get(path(id) + '/publishing/releases'));
  if (!Array.isArray(history)) throw new Error('Invalid backend release history');
  return history.map(release => ({ ...release, timestamp: release.publishedAt, environment: release.channel }));
}
export async function getSubmissionStatus(id) {
  // Silent: backends deployed before the review-flow endpoint return 404 here.
  return unwrap(await httpClient.get(path(id) + '/publishing/submission', { silent: true }));
}
export async function verifyPublication(id) {
  const operation = pendingPublication(id);
  if (!operation) return { success: false, error: 'No publication is awaiting verification' };
  try {
    const response = await getSubmissionStatus(id);
    const release = response?.release;
    if (release?.version !== operation.manifest.version) {
      if (operation.kind === 'rollback' && release?.rollbackFrom === operation.manifest.version) {
        operation.manifest = { ...operation.manifest, version: release.version };
        remember(id, operation);
      } else {
        throw new Error('The latest backend submission does not match the saved request.');
      }
    }
    if (response.status === 'in_review') {
      sessionStorage.removeItem(key(id));
      return { success: true, status: 'in_review', pendingReview: true, version: release.version, releaseId: release.id };
    }
    if (response.status === 'rejected') {
      sessionStorage.removeItem(key(id));
      return { success: false, status: 'rejected', error: release.releaseNotes || 'The app submission was rejected.' };
    }
    if (response.status !== 'live') throw new Error('The backend has not confirmed this app submission.');

    const [definition, mobile] = await Promise.all([
      readPublished(id),
      httpClient.get('/api/v1/bff/mobile/tenant/' + encodeURIComponent(id) + '/manifest'),
    ]);
    const bff = unwrap(mobile);
    if (!containsPublishedSnapshot(definition, operation.manifest) || !containsPublishedSnapshot(bff, operation.manifest)) throw new Error('Definition and mobile manifest do not both match the approved snapshot.');
    const receipt = operation.receipt || { releaseId: release.id, version: release.version };
    if (receipt.releaseId && receipt.releaseId !== release.id) throw new Error('The approved release does not match the saved receipt.');
    sessionStorage.removeItem(key(id));
    return { success: true, status: 'live', version: release.version, releaseId: release.id, receipt, manifest: definition };
  } catch (error) { return pending(operation, error.message); }
}
export async function submitPublication(id, manifest, rollbackVersion) {
  if (pendingPublication(id)) {
    const verified = await verifyPublication(id);
    if (verified.success || verified.status === 'rejected') {
      return { ...verified, verifiedPrevious: true };
    }
    // The previous request was never confirmed by the backend (for example the
    // connection dropped before it landed). Submit the current snapshot again;
    // tenant/version/checksum uniqueness keeps that retry idempotent.
  }
  const operation = { manifest, idempotencyKey: crypto.randomUUID(), kind: rollbackVersion ? 'rollback' : 'publish' };
  // Persist before sending. A failed journal write must not send an untrackable mutation.
  remember(id, operation);
  try {
    const endpoint = rollbackVersion
      ? path(id) + '/publishing/rollback/' + encodeURIComponent(rollbackVersion)
      : '/api/v1/app/merchants/review/submit';
    const response = unwrap(await httpClient.post(
      endpoint,
      rollbackVersion ? {} : { manifest },
      { headers: { 'Idempotency-Key': operation.idempotencyKey }, silentSuccess: true },
    ));
    operation.receipt = { ...response, releaseId: response?.releaseId ?? response?.id };
    if (response?.status === 'pending_review' || response?.status === 'in_review' || response?.pendingReview) {
      if (response.version && response.version !== manifest.version) {
        if (rollbackVersion) operation.manifest = { ...manifest, version: response.version };
        else {
          remember(id, operation);
          return pending(operation, 'The server returned a different submission version.');
        }
      }
      sessionStorage.removeItem(key(id));
      return { success: true, status: 'in_review', pendingReview: true, version: response.version || manifest.version, releaseId: operation.receipt.releaseId };
    }
    if (!rollbackVersion && !response?.status) {
      remember(id, operation);
      return verifyPublication(id);
    }
    remember(id, operation);
  } catch (error) {
    const status = error.response?.status ?? error.status;
    if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
      sessionStorage.removeItem(key(id));
      // error.message already carries the interceptor-joined backend errors.
      return { success: false, status: 'rejected', error: status === 413 ? 'Backend rejected this manifest (413). Images were not removed.' : error.message || error.response?.data?.message || 'Publication rejected (' + status + ')' };
    }
    return verifyPublication(id);
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
