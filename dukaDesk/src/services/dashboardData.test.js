import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('./httpClient', () => ({ default: { get: vi.fn() } }));
import httpClient from './httpClient';
import { getDashboardStats, getRevenueData, getActivity, getProducts, getOrders, getCurrentPlan, getBillingHistory, getTopProducts, getOrderStats, getPlans, setMerchant } from './api';
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
describe('dashboard data', () => {
  it('does not display persisted demo records or generated analytics', async () => {
    localStorage.setItem('dukadesk_demo_store', JSON.stringify({ products: [{ name: 'Sample product' }], orders: [{ customer: 'Sample customer' }], subscription: { plan: 'Business' } }));
    for (const read of [getRevenueData, getActivity, getProducts, getOrders, getBillingHistory, getTopProducts, getOrderStats, getPlans]) expect(await read()).toEqual([]);
    expect(await getCurrentPlan()).toBeNull();
  });
  it('maps real totals and preserves zero without inventing missing metrics', async () => {
    setMerchant({ merchantId: '9307a10c-f0d3-4f90-860b-d4f3fd404a27' });
    httpClient.get.mockResolvedValue({ data: { revenue: { totalRevenue: 0, currency: 'NGN' }, orderCount: 0 } });
    const stats = await getDashboardStats();
    expect(stats.revenue).toBe(0); expect(stats.orders).toBe(0);
    expect(stats.customers).toBeUndefined(); expect(stats.avgRating).toBeUndefined();
    expect(httpClient.get).toHaveBeenCalledWith('/api/v1/analytics/summary', expect.any(Object));
  });
  it('propagates backend errors rather than showing fabricated zero totals', async () => {
    setMerchant({ merchantId: '9307a10c-f0d3-4f90-860b-d4f3fd404a27' });
    httpClient.get.mockRejectedValue(new Error('Unavailable'));
    await expect(getDashboardStats()).rejects.toThrow('Unavailable');
  });
});
