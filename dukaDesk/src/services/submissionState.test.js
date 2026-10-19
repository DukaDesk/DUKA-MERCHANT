import { beforeEach, describe, expect, it } from 'vitest';
import { designFingerprint, readSubmissionState, writeSubmissionState, clearSubmissionState } from './submissionState';

beforeEach(() => {
  localStorage.clear();
});

describe('submission fingerprint state', () => {
  it('is stable regardless of object key order', () => {
    const a = { meta: { appName: 'Shop', slug: 'shop' }, screens: { home: { sections: [1, 2] } } };
    const b = { screens: { home: { sections: [1, 2] } }, meta: { slug: 'shop', appName: 'Shop' } };
    expect(designFingerprint(a)).toBe(designFingerprint(b));
    expect(designFingerprint(a)).not.toBe(null);
  });

  it('changes when the design changes', () => {
    const design = { meta: { appName: 'Shop' }, screens: { home: { sections: [] } } };
    const edited = { meta: { appName: 'Shop' }, screens: { home: { sections: [{ type: 'button' }] } } };
    expect(designFingerprint(design)).not.toBe(designFingerprint(edited));
  });

  it('persists and clears the submitted fingerprint per tenant', () => {
    writeSubmissionState('tenant-1', { fingerprint: 'abc', version: '1.0.1' });
    expect(readSubmissionState('tenant-1')).toMatchObject({ fingerprint: 'abc', version: '1.0.1' });
    expect(readSubmissionState('tenant-2')).toBeNull();
    clearSubmissionState('tenant-1');
    expect(readSubmissionState('tenant-1')).toBeNull();
  });
});
