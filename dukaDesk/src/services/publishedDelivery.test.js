import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('./httpClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));
import http from './httpClient';
import fixture from './fixtures/published-app.json';
import { submitPublication, verifyPublication, pendingPublication, rollbackPublication } from './publishedDelivery';
let manifest;
beforeEach(() => {
  vi.resetAllMocks(); sessionStorage.clear(); manifest = structuredClone(fixture);
  http.post.mockResolvedValue({ data: { releaseId: 'r1', version: manifest.version, checksum: 'abc' } });
  http.get.mockImplementation(async url => ({ data: url.endsWith('/publishing/releases') ? [{ id: 'r1', version: manifest.version }] : url.includes('/publishing/releases/') ? { id: 'r1', version: manifest.version, checksum: 'abc', manifest } : manifest }));
});
describe('canonical publication delivery', () => {
  it('confirms both public paths and returns the server release identity', async () => {
    const result = await submitPublication('tenant', manifest);
    expect(result).toMatchObject({ success: true, releaseId: 'r1', receipt: { checksum: 'abc' } });
    expect(http.get).toHaveBeenCalledWith('/api/v1/merchants/tenant/definition');
    expect(http.get).toHaveBeenCalledWith('/api/v1/bff/mobile/tenant/tenant/manifest');
    expect(http.post.mock.calls[0][2].headers['Idempotency-Key']).toBeTruthy();
    expect(pendingPublication('tenant')).toBeNull();
  });
  it('stale BFF stays pending and checking again does not resend the POST', async () => {
    const live = http.get.getMockImplementation();
    http.get.mockImplementation(url => url.includes('/bff/') ? Promise.resolve({ data: { ...manifest, version: 'old' } }) : live(url));
    expect(await submitPublication('tenant', manifest)).toMatchObject({ success: false, pending: true });
    expect(await submitPublication('tenant', { ...manifest, version: 'newer' })).toMatchObject({ pending: true });
    expect(http.post).toHaveBeenCalledTimes(1);
    http.get.mockImplementation(live);
    expect(await verifyPublication('tenant')).toMatchObject({ success: true });
  });
  it('recovers an unknown POST outcome from the matching persisted release', async () => {
    http.post.mockRejectedValue(new Error('connection lost'));
    expect(await submitPublication('tenant', manifest)).toMatchObject({ pending: true });
    expect(await verifyPublication('tenant')).toMatchObject({ success: true, releaseId: 'r1' });
    expect(http.post).toHaveBeenCalledTimes(1);
  });
  it('rejected publication clears the journal without changing images', async () => {
    http.post.mockRejectedValue({ response: { status: 413 } });
    expect(await submitPublication('tenant', manifest)).toMatchObject({ success: false, status: 'rejected' });
    expect(pendingPublication('tenant')).toBeNull();
    expect(http.post.mock.calls[0][1].manifest).toEqual(manifest);
  });
  it('performs real backend rollback with the stored compiled manifest', async () => {
    const result = await rollbackPublication('tenant', 'r1');
    expect(result.success).toBe(true);
    expect(http.post.mock.calls[0][0]).toBe('/api/v1/merchants/tenant/publishing/rollback/' + manifest.version);
  });
  it('does not accept a receipt with a conflicting version', async () => {
    http.post.mockResolvedValue({ data: { releaseId: 'r1', version: 'different', checksum: 'abc' } });
    expect(await submitPublication('tenant', manifest)).toMatchObject({ pending: true });
  });
  it('a lost receipt cannot be reconstructed from an unrelated release', async () => {
    http.post.mockResolvedValue({});
    const live = http.get.getMockImplementation();
    http.get.mockImplementation(url => url.includes('/publishing/releases/') ? Promise.resolve({ data: { id: 'r1', manifest: { ...manifest, screens: {} } } }) : live(url));
    expect(await submitPublication('tenant', manifest)).toMatchObject({ pending: true });
  });
});
