import { describe, it, expect, vi } from "vitest";

vi.mock("axios", () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    defaults: {},
  };
  return { default: mockAxios };
});

import axios from "axios";
import "./httpClient";

describe("httpClient instance", () => {
  it("creates axios instance with baseURL and headers", () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: import.meta.env.VITE_API_URL,
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("registers response interceptor", () => {
    expect(axios.interceptors.response.use).toHaveBeenCalled();
  });
});


it('preserves every backend validation error in the displayed message', async () => {
  const reject = axios.interceptors.response.use.mock.calls[0][1];
  const error = { config: { url: '/publishing/publish', silent: true }, response: {
    status: 422, data: { code: 'INCOMPATIBLE_RUNTIME', errors: ['Runtime compatibility check failed', 'component: unsupported widget', 'asset: missing image'] }
  } };
  await expect(reject(error)).rejects.toMatchObject({ message: 'Runtime compatibility check failed\ncomponent: unsupported widget\nasset: missing image' });
});
