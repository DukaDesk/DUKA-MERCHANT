import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { compileDesignToPublishedApp, containsPublishedSnapshot } from './compilePublishedApp';
const fixture = name => JSON.parse(readFileSync(resolve(process.cwd(), 'src/services/fixtures/' + name), 'utf8'));
describe('published reconstruction contract', () => {
  it('produces the exact snapshot consumed by mobile', () => {
    const project = fixture('merchant-project.json');
    const before = JSON.stringify(project);
    const result = compileDesignToPublishedApp(project, '1.2.3', '2026-09-19T00:00:00.000Z');
    expect(JSON.parse(JSON.stringify(result))).toEqual(fixture('published-app.json'));
    expect(JSON.stringify(project)).toBe(before);
    expect(result.screens.home.layout.children[0].layout).toMatchObject({ backgroundColor: '#ABCDEF', padding: 9 });
    expect(result.screens.home.fixedTop).toHaveLength(1);
    expect(result.screens.home.fixedBottom).toHaveLength(2);
    expect(result.screens.details.fixedTop).toHaveLength(0);
    expect(result.splash.screen.layout.children[0].props.source).toBe('/uploads/splash.webp');
    expect(result.screens.home.layout.children[0].layout.children[2].actions.default).toEqual({ type: 'navigate', payload: { screen: '/details' } });
  });
  it('fails compilation for unresolved saved sections instead of dropping content', () => {
    const project = fixture('merchant-project.json'); project.savedSections = [];
    expect(() => compileDesignToPublishedApp(project, '1', 'now')).toThrow('Missing saved section');
  });
  it('does not duplicate a tab bar already published in the component tree', () => {
    const project = fixture('merchant-project.json');
    project.shared.footer.components = [{ type: 'tab_bar', props: {} }];
    const result = compileDesignToPublishedApp(project, '1', 'now');
    expect(result.screens.home.fixedBottom).toHaveLength(1);
  });
  it('publishes bottom tabs in the arranged navigation order', () => {
    const project = fixture('merchant-project.json');
    project.navigation.tabs = [
      { id: 't2', label: 'Orders', icon: 'Cart', screenId: 'details' },
      { id: 't1', label: 'Home', icon: 'Home', screenId: 'home' },
    ];
    const result = compileDesignToPublishedApp(project, '1', 'now');
    const bar = result.screens.home.fixedBottom.find(node => node.type === 'tab_bar');
    expect(bar.props.tabs.map(tab => tab.screenId)).toEqual(['details', 'home']);
  });
});

it('read-back verification detects dropped nested fields despite matching version and screen IDs', () => {
  const expected = fixture('published-app.json');
  const actual = structuredClone(expected);
  actual.tenantId = 'backend-enrichment';
  expect(containsPublishedSnapshot(actual, expected)).toBe(true);
  actual.screens.home.layout.children[0].layout.children = [];
  expect(containsPublishedSnapshot(actual, expected)).toBe(false);
});

it('preserves splash enablement and explicitly authored content, with fixed 2s timing', () => {
  const project = fixture('merchant-project.json');
  project.splash = { enabled: false, durationMs: 1800, screen: { screenId: 'custom-splash', layout: { kind: 'column', children: [{ type: 'text_block', props: { text: 'Brand launch' } }] } } };
  const result = compileDesignToPublishedApp(project, '1', 'now');
  expect(result.splash.enabled).toBe(false);
  expect(result.splash.durationMs).toBe(2000);
  expect(result.splash.screen.screenId).toBe('custom-splash');
  expect(result.splash.screen.layout.children[0].props.text).toBe('Brand launch');
});

it("publishes press attachments and merges edited event actions", () => {
  const project = fixture("merchant-project.json");
  project.screens.home.bodySections = [{ id: "section", components: [{ id: "menu", type: "menu_grid", actions: { selectItem: { type: "pop" }, search: { type: "refresh" } }, props: { actions: { selectItem: JSON.stringify({ type: "navigate", payload: { screenId: "details" } }) }, tapAction: JSON.stringify({ type: "pop" }), items: [{ name: "Meal", tapAction: JSON.stringify({ type: "navigate", payload: { screenId: "details" } }) }] } }] }];
  const node = compileDesignToPublishedApp(project, "1", "now").screens.home.layout.children[0].layout.children[0];
  expect(node.actions.selectItem.payload.screenId).toBe("details");
  expect(node.actions.search.type).toBe("refresh");
  expect(node.props.tapAction.type).toBe("pop");
  expect(node.props.items[0].tapAction.payload.screenId).toBe("details");
  project.screens.home.bodySections[0].components[0].props.tapAction = "{";
  expect(() => compileDesignToPublishedApp(project, "1", "now")).toThrow("Invalid component action");
});

it("rejects attachments to missing pages", () => {
  const project = fixture("merchant-project.json");
  project.screens.home.bodySections = [{ id: "section", components: [{ id: "button", type: "button", props: { tapAction: { type: "navigate", payload: { screenId: "deleted-page" } } } }] }];
  expect(() => compileDesignToPublishedApp(project, "1", "now")).toThrow("Choose an existing destination page");
});

it("canonicalizes path-style push destinations to screenId", () => {
  const project = fixture("merchant-project.json");
  project.screens.home.bodySections = [{ id: "section", components: [{ id: "button", type: "button", props: { tapAction: { type: "navigate", payload: { push: "/details" } } } }] }];
  const node = compileDesignToPublishedApp(project, "1", "now").screens.home.layout.children[0].layout.children[0];
  expect(node.props.tapAction.payload.screenId).toBe("details");
});

it("canonicalizes legacy product detail aliases and preserves route IDs", () => {
  const project = fixture("merchant-project.json");
  project.screens.home.archetype = "catalog";
  project.screens.home.bodySections = [{ id: "section", components: [{
    id: "product-link",
    type: "button",
    props: { tapAction: { type: "navigate", payload: { push: "/product-detail?productId=real-product" } } },
  }] }];

  const result = compileDesignToPublishedApp(project, "1", "now");
  const action = result.screens.home.layout.children[0].layout.children[0].props.tapAction;

  expect(result.screens[action.payload.screenId].archetype).toBe("product_detail");
  expect(action.payload).toMatchObject({ screenId: action.payload.screenId, productId: "real-product" });
});

it("rejects dead path-style navigation targets before publication", () => {
  const project = fixture("merchant-project.json");
  project.screens.home.bodySections = [{ id: "section", components: [{
    id: "dead-link",
    type: "button",
    props: { tapAction: { type: "navigate", payload: { push: "/deleted-screen" } } },
  }] }];

  expect(() => compileDesignToPublishedApp(project, "1", "now")).toThrow(/deleted-screen.*not a page/);
});

it("parses per-service tap actions on laundry_booking components", () => {
  const project = fixture("merchant-project.json");
  project.screens.home.bodySections = [{ id: "section", components: [{ id: "booking", type: "laundry_booking", actions: { confirm: { type: "book_service" } }, props: { services: [{ name: "Wash & Fold", price: 2500, tapAction: JSON.stringify({ type: "view_item", payload: { id: "svc1" } }) }] } }] }];
  const node = compileDesignToPublishedApp(project, "1", "now").screens.home.layout.children[0].layout.children[0];
  expect(node.actions.confirm.type).toBe("book_service");
  expect(node.props.services[0].tapAction.type).toBe("view_item");
  expect(node.props.services[0].tapAction.payload.id).toBe("svc1");
});

it('preserves the merchant data request in the published definition', () => {
 const project = fixture('merchant-project.json');
 project.meta.dataRequest = { enabled: true, purpose: 'Delivery updates', fields: ['name','phone'], requiredFor: ['checkout'] };
 expect(compileDesignToPublishedApp(project, '1', 'now').dataRequest).toEqual(project.meta.dataRequest);
});

it('injects commerce archetypes, roles, bindings, and missing screens', () => {
  const project = fixture('merchant-project.json');
  project.screens.home.archetype = 'catalog';
  project.screens.home.bodySections = [{ id: 'section', components: [{ id: 'grid', type: 'menu_grid', props: { items: [] } }] }];
  const result = compileDesignToPublishedApp(project, '1', 'now');
  const node = result.screens.home.layout.children[0].layout.children[0];
  expect(result.screens.home.archetype).toBe('catalog');
  expect(node.role).toBe('select_product');
  expect(node.binding).toEqual({ source: 'commerce.products' });
  expect(node.actions.viewDetails.type).toBe('view_item');
  expect(node.actions.addItem.type).toBe('add_to_cart');
  for (const archetype of ['product_detail', 'cart', 'checkout', 'orders', 'order_detail']) {
    expect(Object.values(result.screens).some(screen => screen.archetype === archetype)).toBe(true);
  }
});
