import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./notifier", () => ({
  emit: vi.fn(),
}));

vi.mock("./httpClient", () => {
  const mock = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
  return { default: mock };
});

vi.mock("axios", () => {
  const mock = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(() => mock),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  };
  return { default: mock };
});

import { getProducts, createProduct, updateProduct, adjustProductStock, getProductCategories, createProductCategory, mapProductToMenuItem, mapProductToOffer, hydrateDesignWithProducts } from "./api";
import httpClient from "./httpClient";

const mockHttpClient = vi.mocked(httpClient);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem("dd_merchant", JSON.stringify({ id: "m_1", merchantId: "m_1", tenantId: "m_1" }));
});

describe("live product endpoints", () => {
  it("maps the public catalog to portal shape", async () => {
    mockHttpClient.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          { id: "p1", name: "Beans", price: "1500", compareAtPrice: "2000", stock: 3, category: { id: "c1", name: "Grains" }, categoryId: "c1", images: [{ url: "https://img/1" }], badge: "FLASH SALE", tags: ["staple"] },
        ],
      },
    });
    const [item] = await getProducts();
    expect(mockHttpClient.get).toHaveBeenCalledWith("/api/v1/merchants/m_1/products", expect.objectContaining({ params: { limit: 100 } }));
    expect(item).toMatchObject({
      id: "p1", name: "Beans", cat: "Grains", categoryId: "c1",
      price: 1500, compareAtPrice: 2000, stock: 3,
      badge: "FLASH SALE", tags: ["staple"],
    });
    expect(item.images).toEqual(["https://img/1"]);
  });

  it("returns an empty shelf when the catalog cannot load", async () => {
    mockHttpClient.get.mockRejectedValueOnce(new Error("offline"));
    await expect(getProducts()).resolves.toEqual([]);
  });

  it("creates products through the app commerce API", async () => {
    mockHttpClient.post.mockResolvedValueOnce({ data: { success: true, data: { id: "p9", name: "Rice" } } });
    const created = await createProduct({ name: "Rice", price: 5000, stock: 2, tags: ["a", "b"], badge: "NEW", images: ["https://img/9"] });
    expect(mockHttpClient.post).toHaveBeenCalledWith("/api/v1/app/commerce/products", expect.objectContaining({
      name: "Rice", price: 5000, stock: 2, tags: ["a", "b"], badge: "NEW", images: ["https://img/9"],
    }));
    expect(mockHttpClient.post.mock.calls[0][1].slug).toBe("rice");
    expect(created.id).toBe("p9");
  });

  it("updates products through the app commerce API", async () => {
    mockHttpClient.put.mockResolvedValueOnce({ data: { success: true, data: { id: "p1", stock: 7 } } });
    const updated = await updateProduct("p1", { name: "Beans", price: 1500, stock: 7 });
    expect(mockHttpClient.put).toHaveBeenCalledWith("/api/v1/app/commerce/products/p1", expect.objectContaining({ stock: 7 }));
    expect(updated.stock).toBe(7);
  });

  it("adjusts stock through the adjust-stock endpoint", async () => {
    mockHttpClient.post.mockResolvedValueOnce({ data: { success: true, data: { stock: 12, reservedStock: 2 } } });
    const result = await adjustProductStock("p1", -3);
    expect(mockHttpClient.post).toHaveBeenCalledWith("/api/v1/app/commerce/products/p1/adjust-stock", { delta: -3 });
    expect(result).toEqual({ stock: 12, reservedStock: 2 });
  });

  it("lists and creates product categories", async () => {
    mockHttpClient.get.mockResolvedValueOnce({ data: { success: true, data: [{ id: "c1", name: "Grains", slug: "grains" }] } });
    await expect(getProductCategories()).resolves.toEqual([{ id: "c1", name: "Grains", slug: "grains" }]);
    mockHttpClient.post.mockResolvedValueOnce({ data: { success: true, data: { id: "c2", name: "Oils", slug: "oils" } } });
    await expect(createProductCategory({ name: "Oils" })).resolves.toMatchObject({ id: "c2", name: "Oils" });
  });
});

describe("builder product slots", () => {
  const product = {
    id: "p1", name: "Beans", price: 1500, compareAtPrice: 2000,
    shortDescription: "Staple", description: "Long desc", cat: "Grains",
    images: ["https://img/1"], badge: "HOT", tags: ["staple"],
    weight: 500, weightUnit: "g", sku: "BNS-1",
  };

  it("maps a store product into a menu item slot", () => {
    expect(mapProductToMenuItem(product)).toMatchObject({
      productId: "p1", id: "p1", name: "Beans", price: 1500,
      desc: "Staple", image: "https://img/1", badge: "HOT",
    });
    expect(mapProductToMenuItem(null)).toBeNull();
  });

  it("replaces placeholder grids with the live catalog on template select", () => {
    const design = {
      screens: {
        home: { bodySections: [{ id: "s1", components: [
          { id: "g1", type: "menu_grid", props: { items: [{ name: "Typed by hand", price: "₦9" }] } },
          { id: "t1", type: "text_block", props: { text: "Hello" } },
        ] }] },
      },
    };
    const result = hydrateDesignWithProducts(design, [product]);
    const grid = result.screens.home.bodySections[0].components[0];
    expect(grid.props.items).toHaveLength(1);
    expect(grid.props.items[0]).toMatchObject({ productId: "p1", name: "Beans" });
    expect(result.screens.home.bodySections[0].components[1].props.text).toBe("Hello");
    // Input design is not mutated.
    expect(design.screens.home.bodySections[0].components[0].props.items[0].name).toBe("Typed by hand");
  });

  it("leaves designs untouched when the catalog is empty", () => {
    const design = { screens: { home: { bodySections: [] } } };
    expect(hydrateDesignWithProducts(design, [])).toBe(design);
    expect(hydrateDesignWithProducts(null, [product])).toBeNull();
  });

  it("maps a store product into a promotion offer slot", () => {
    expect(mapProductToOffer(product)).toMatchObject({
      productId: "p1", title: "Beans", subtitle: "Staple",
      image: "https://img/1", badge: "HOT",
    });
    expect(mapProductToOffer(null)).toBeNull();
  });

  it("replaces placeholder offers with the live catalog on template select", () => {
    const design = {
      screens: {
        home: { bodySections: [{ id: "s1", components: [
          { id: "o1", type: "promotion_list", props: { offers: [{ title: "Typed deal" }] } },
        ] }] },
      },
    };
    const result = hydrateDesignWithProducts(design, [product]);
    expect(result.screens.home.bodySections[0].components[0].props.offers).toHaveLength(1);
    expect(result.screens.home.bodySections[0].components[0].props.offers[0]).toMatchObject({
      productId: "p1", title: "Beans",
    });
  });
});
