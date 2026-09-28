import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("axios", () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: {},
  };
  return { default: mockAxios };
});

import axios from "axios";
import {
  resolveTemplateId,
  isBackendTemplateId,
  convertBackendTemplateToDesign,
  loadTemplateForCanvas,
  getTemplateCatalog,
} from "./staticTemplates";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

const BACKEND_TEMPLATE = {
  id: UUID,
  name: "Modern Store",
  category: "commerce",
  config: {
    pages: [
      {
        name: "Home",
        slug: "home",
        isHome: true,
        sections: [
          {
            type: "hero",
            config: {},
            components: [
              { type: "HeroBanner", props: { title: "Welcome", backgroundImage: "https://x/y.png", alignment: "center" } },
            ],
          },
          {
            type: "grid",
            config: { columns: 2 },
            components: [{ type: "ProductGrid", props: { limit: 6 } }],
          },
        ],
      },
      { name: "About", slug: "about", sections: [] },
    ],
    navigation: [
      { label: "Home", target: "/home", icon: "home" },
      { label: "About", target: "/about", icon: "info" },
    ],
    theme: { primaryColor: "#0066FF", backgroundColor: "#FFFFFF" },
  },
};

describe("resolveTemplateId", () => {
  it("passes backend UUIDs through untouched", () => {
    expect(resolveTemplateId("commerce", UUID)).toBe(UUID);
    expect(resolveTemplateId(null, UUID)).toBe(UUID);
  });
  it("builds folder/id paths for local template names", () => {
    expect(resolveTemplateId("Ecommerce", "Storefront")).toBe("ecommerce/storefront");
  });
  it("passes through ids that already contain a path", () => {
    expect(resolveTemplateId("Ecommerce", "ecommerce/storefront")).toBe("ecommerce/storefront");
  });
});

describe("isBackendTemplateId", () => {
  it("detects UUIDs without paths", () => {
    expect(isBackendTemplateId(UUID)).toBe(true);
    expect(isBackendTemplateId("ecommerce/storefront")).toBe(false);
    expect(isBackendTemplateId("storefront")).toBe(false);
  });
});

describe("convertBackendTemplateToDesign", () => {
  it("maps pages to canvas screens with mapped component types", () => {
    const design = convertBackendTemplateToDesign(BACKEND_TEMPLATE);
    expect(Object.keys(design.screens)).toEqual(["home", "about"]);
    expect(design.navigation.initialScreen).toBe("home");
    expect(design.meta.appName).toBe("Modern Store");
    const types = design.screens.home.bodySections.flatMap(s => s.components.map(c => c.type));
    expect(types).toContain("hero_banner");
    expect(types).toContain("menu_grid");
    expect(design.navigation.tabs.map(t => t.screenId)).toEqual(["home", "about"]);
  });
  it("falls back to a blank home screen when pages are missing", () => {
    const design = convertBackendTemplateToDesign({ name: "Empty", config: {} });
    expect(Object.keys(design.screens)).toEqual(["screen_1"]);
  });
});

describe("loadTemplateForCanvas with backend templates", () => {
  beforeEach(() => vi.clearAllMocks());

  it("converts backend detail responses to canvas designs", async () => {
    axios.get.mockResolvedValue({ data: BACKEND_TEMPLATE });
    const design = await loadTemplateForCanvas(UUID);
    expect(axios.get).toHaveBeenCalledWith(`/api/v1/templates/${encodeURIComponent(UUID)}`);
    expect(design.screens.home.bodySections).toHaveLength(2);
  });

  it("throws a clear error when the backend template has no pages", async () => {
    axios.get.mockResolvedValue({ data: { id: UUID, name: "Empty", config: {} } });
    await expect(loadTemplateForCanvas(UUID)).rejects.toThrow(`Template ${UUID} has no content`);
  });
});

describe("getTemplateCatalog", () => {
  beforeEach(() => vi.clearAllMocks());

  it("merges backend and local catalogs instead of replacing", async () => {
    axios.get.mockResolvedValue({
      data: { data: [{ id: UUID, name: "Modern Store", category: "commerce" }], meta: {} },
    });
    global.fetch = vi.fn(async (url) => {
      if (String(url).endsWith("/templates/manifest.json")) {
        return { ok: true, json: async () => ({ categories: [{ name: "Ecommerce", templates: ["storefront"] }] }) };
      }
      return { ok: true, json: async () => ({ name: "Storefront", screens: [{ id: "shop", path: "screens/shop.json" }] }) };
    });
    const catalog = await getTemplateCatalog();
    const ids = catalog.flatMap(c => c.templates.map(t => t.id));
    expect(ids).toContain(UUID);
    expect(ids).toContain("ecommerce/storefront");
    delete global.fetch;
  });
});
