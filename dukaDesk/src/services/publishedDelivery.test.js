import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('./httpClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));
import http from './httpClient';
import fixture from './fixtures/published-app.json';
import { submitPublication, submitAppForReview, pendingPublication, rollbackPublication } from './publishedDelivery';
let manifest;
beforeEach(() => {
  vi.resetAllMocks(); sessionStorage.clear(); manifest = structuredClone(fixture);
  http.post.mockResolvedValue({ data: { releaseId: 'r1', version: manifest.version, checksum: 'abc', status: 'pending_review' } });
  http.get.mockImplementation(async url => ({ data: url.endsWith('/publishing/submission') ? { status: 'in_review', release: { id: 'r1', version: manifest.version } } : url.endsWith('/publishing/releases') ? [{ id: 'r1', version: manifest.version }] : url.includes('/publishing/releases/') ? { id: 'r1', version: manifest.version, checksum: 'abc', manifest } : manifest }));
});
describe('canonical publication delivery', () => {
  it('submits for admin review without claiming the app is live', async () => {
    const result = await submitPublication('tenant', manifest);
    expect(result).toMatchObject({ success: true, status: 'in_review', pendingReview: true, releaseId: 'r1' });
    expect(http.get).not.toHaveBeenCalled();
    expect(http.post.mock.calls[0][0]).toBe('/api/v1/app/merchants/review/submit');
    expect(http.post.mock.calls[0][2].headers['Idempotency-Key']).toBeTruthy();
    expect(pendingPublication('tenant')).toBeNull();
  });
  it('returns the submitted version when the review endpoint only returns tenant fields', async () => {
    http.post.mockResolvedValue({ data: { id: 'tenant', appStatus: 'in_review' } });
    expect(await submitAppForReview(manifest)).toMatchObject({
      success: true,
      status: 'in_review',
      version: manifest.version,
    });
  });
  it('accepts the in_review status returned by the review submission endpoint', async () => {
    http.post.mockResolvedValue({ data: { releaseId: 'r1', version: manifest.version, checksum: 'abc', status: 'in_review' } });
    expect(await submitPublication('tenant', manifest)).toMatchObject({ success: true, status: 'in_review' });
  });
  it('recovers an unknown POST outcome from review status without resending', async () => {
    http.post.mockRejectedValue(new Error('connection lost'));
    expect(await submitPublication('tenant', manifest)).toMatchObject({ success: true, status: 'in_review' });
    expect(http.get).toHaveBeenCalledWith('/api/v1/merchants/tenant/publishing/submission', { silent: true });
    expect(http.post).toHaveBeenCalledTimes(1);
  });
  it('resubmits when the previous request never reached the backend', async () => {
    http.post.mockRejectedValueOnce(new Error('connection lost'));
    const defaultGet = http.get.getMockImplementation();
    http.get.mockImplementation(url => url.endsWith('/publishing/submission')
      ? Promise.resolve({ data: { status: 'draft', release: null } })
      : defaultGet(url));

    expect(await submitPublication('tenant', manifest)).toMatchObject({ pending: true });
    expect(await submitPublication('tenant', manifest)).toMatchObject({ success: true, status: 'in_review' });
    expect(http.post).toHaveBeenCalledTimes(2);
  });
  it('rejected publication clears the journal without changing images', async () => {
    http.post.mockRejectedValue({ response: { status: 413 } });
    expect(await submitPublication('tenant', manifest)).toMatchObject({ success: false, status: 'rejected' });
    expect(pendingPublication('tenant')).toBeNull();
    expect(http.post.mock.calls[0][1].manifest).toEqual(manifest);
  });
  it('performs real backend rollback with the stored compiled manifest', async () => {
    http.post.mockResolvedValue({ data: { releaseId: 'r1', version: manifest.version, checksum: 'abc' } });
    http.get.mockImplementation(async url => ({ data: url.endsWith('/publishing/releases') ? [{ id: 'r1', version: manifest.version }] : url.includes('/publishing/releases/') ? { id: 'r1', version: manifest.version, checksum: 'abc', manifest } : url.endsWith('/publishing/submission') ? { status: 'live', release: { id: 'r1', version: manifest.version } } : manifest }));
    const result = await rollbackPublication('tenant', 'r1');
    expect(result.success).toBe(true);
    expect(http.post.mock.calls[0][0]).toBe('/api/v1/merchants/tenant/publishing/rollback/' + manifest.version);
  });
  it('does not accept a submission receipt with a conflicting version', async () => {
    http.post.mockResolvedValue({ data: { releaseId: 'r1', version: 'different', checksum: 'abc', status: 'pending_review' } });
    expect(await submitPublication('tenant', manifest)).toMatchObject({ pending: true });
  });
  it('a lost receipt cannot be reconstructed from an unrelated release', async () => {
    http.post.mockResolvedValue({});
    const live = http.get.getMockImplementation();
    http.get.mockImplementation(url => url.endsWith('/publishing/submission') ? Promise.resolve({ data: { status: 'in_review', release: { id: 'r1', version: 'different' } } }) : live(url));
    expect(await submitPublication('tenant', manifest)).toMatchObject({ pending: true });
  });
});
