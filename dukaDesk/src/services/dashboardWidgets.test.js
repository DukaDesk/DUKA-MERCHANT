import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('./httpClient', () => ({ default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() } }));
import httpClient from './httpClient';
import {
  desiredDashboardWidgets,
  getOrCreateDefaultDashboard,
  syncDashboardWidgets,
  getDashboardWidgetData,
  listDashboards,
  resetDashboardCache,
  setMerchant,
} from './api';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  resetDashboardCache();
  setMerchant({ merchantId: '9307a10c-f0d3-4f90-860b-d4f3fd404a27' });
});

describe('desiredDashboardWidgets', () => {
  it('always includes the core base widgets', () => {
    const metrics = desiredDashboardWidgets([]).map((s) => s.metric);
    expect(metrics).toEqual(['revenue', 'revenue_trend']);
  });

  it('adds widget specs from enabled modules and never duplicates a metric', () => {
    const specs = desiredDashboardWidgets(['orders', 'products', 'orders']);
    const metrics = specs.map((s) => s.metric);
    expect(metrics).toEqual(['revenue', 'revenue_trend', 'order_count', 'recent_orders', 'product_count', 'top_products']);
    expect(new Set(metrics).size).toBe(metrics.length);
  });

  it('ignores unknown module ids', () => {
    expect(desiredDashboardWidgets(['paystack', null, 'not-a-module'])).toHaveLength(2);
  });
});

describe('getOrCreateDefaultDashboard', () => {
  it('creates the default dashboard when the merchant has none', async () => {
    httpClient.get.mockResolvedValue({ data: [] });
    httpClient.post.mockResolvedValue({ data: { id: 'd1', slug: 'overview' } });
    const dashboard = await getOrCreateDefaultDashboard();
    expect(httpClient.post).toHaveBeenCalledWith('/api/v1/app/analytics/dashboards', expect.objectContaining({ slug: 'overview', name: 'Overview' }));
    expect(dashboard.id).toBe('d1');
  });

  it('reuses an existing dashboard instead of creating a duplicate', async () => {
    httpClient.get.mockResolvedValue({ data: [{ id: 'd9', slug: 'overview', isDefault: true }] });
    const dashboard = await getOrCreateDefaultDashboard();
    expect(httpClient.post).not.toHaveBeenCalled();
    expect(dashboard.id).toBe('d9');
  });

  it('coalesces concurrent bootstraps into a single create call', async () => {
    httpClient.get.mockResolvedValue({ data: [] });
    httpClient.post.mockResolvedValue({ data: { id: 'd1' } });
    const [a, b] = await Promise.all([getOrCreateDefaultDashboard(), getOrCreateDefaultDashboard()]);
    expect(httpClient.post).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it('returns null for demo tenants without touching the API', async () => {
    setMerchant({ merchantId: 'merchant_demo_1' });
    expect(await getOrCreateDefaultDashboard()).toBeNull();
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(httpClient.post).not.toHaveBeenCalled();
  });
});

describe('syncDashboardWidgets', () => {
  it('creates missing widgets for enabled modules and removes widgets whose module is off', async () => {
    httpClient.get.mockResolvedValue({ data: { id: 'd1', widgets: [
      { id: 'w-rev', metric: 'revenue' },
      { id: 'w-old', metric: 'user_count' },
    ] } });
    httpClient.post.mockResolvedValue({ data: { id: 'w-new' } });
    httpClient.delete.mockResolvedValue({ data: {} });

    const result = await syncDashboardWidgets('d1', ['orders']);

    const widgetPosts = httpClient.post.mock.calls.filter(([url]) => String(url).includes('/widgets'));
    expect(widgetPosts.map(([, body]) => body.metric)).toEqual(['revenue_trend', 'order_count', 'recent_orders']);
    expect(httpClient.delete).toHaveBeenCalledWith('/api/v1/app/analytics/dashboards/d1/widgets/w-old');
    expect(result).toEqual({ created: ['revenue_trend', 'order_count', 'recent_orders'], removed: ['user_count'] });
  });

  it('is a no-op when the dashboard already matches the module set', async () => {
    httpClient.get.mockResolvedValue({ data: { id: 'd1', widgets: [
      { id: 'w1', metric: 'revenue' },
      { id: 'w2', metric: 'revenue_trend' },
    ] } });
    const result = await syncDashboardWidgets('d1', []);
    expect(httpClient.post).not.toHaveBeenCalled();
    expect(httpClient.delete).not.toHaveBeenCalled();
    expect(result).toEqual({ created: [], removed: [] });
  });

  it('skips syncing for demo tenants', async () => {
    setMerchant({ merchantId: 'tenant_demo_9' });
    expect(await syncDashboardWidgets('d1', ['orders'])).toBeNull();
    expect(httpClient.get).not.toHaveBeenCalled();
  });
});

describe('dashboard reads', () => {
  it('listDashboards unwraps the envelope into a dashboard array', async () => {
    httpClient.get.mockResolvedValue({ data: [{ id: 'd1' }, { id: 'd2' }] });
    const list = await listDashboards();
    expect(httpClient.get).toHaveBeenCalledWith('/api/v1/analytics/dashboards', { silent: true });
    expect(list.map((d) => d.id)).toEqual(['d1', 'd2']);
  });

  it('getDashboardWidgetData returns the resolved widget payloads for rendering', async () => {
    httpClient.get.mockResolvedValue({ data: {
      dashboardId: 'd1',
      name: 'Overview',
      widgets: [{ widgetId: 'w1', type: 'chart', metric: 'revenue_trend', data: [{ period: '2026-10-01', value: 5 }] }],
    } });
    const data = await getDashboardWidgetData('d1');
    expect(httpClient.get).toHaveBeenCalledWith('/api/v1/app/analytics/dashboards/d1/data', { silent: true });
    expect(data.widgets[0]).toEqual(expect.objectContaining({ metric: 'revenue_trend', type: 'chart' }));
  });
});
