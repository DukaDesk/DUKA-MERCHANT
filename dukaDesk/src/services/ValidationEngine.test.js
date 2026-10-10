import { describe, it, expect } from 'vitest';
import { validateProject } from './ValidationEngine';
import { compileDesignToPublishedApp } from './compilePublishedApp';
const project = components => ({ meta: { appName: 'My app' }, navigation: { initialScreen: 'book', tabs: [] }, screens: { book: { name: 'Book', bodySections: [{ id: 'section', components }] } } });
describe('freeform builder validation', () => {
  it('accepts and compiles an app containing only two buttons', () => {
    const draft = project([{ id: 'one', type: 'button', props: { label: 'One' } }, { id: 'two', type: 'button', props: { label: 'Two' } }]);
    expect(validateProject(draft).errors).toEqual([]);
    const result = compileDesignToPublishedApp(draft, '1.0.0', '2026-09-29T00:00:00Z');
    expect(result.screens.book.layout.children[0].layout.children.map(n => n.props.label)).toEqual(['One', 'Two']);
    expect(result.navigation.tabs).toEqual([]);
  });
  it('accepts text and nested sections without a preset section type', () => {
    expect(validateProject(project([{ type: 'text_block', props: { text: 'Hello' } }, { type: 'nested_section', children: [{ type: 'button', props: {} }] }])).errors).toEqual([]);
  });
  it('still identifies unsupported children inside nested sections', () => {
    const result = validateProject(project([{ type: 'nested_section', children: [{ type: 'unknown_widget' }] }]));
    expect(result.valid).toBe(false);
    expect(result.errors[0].path).toContain('children[0].type');
  });
  it('flags tap actions pointing at missing screens before publish', () => {
    const draft = project([
      { id: 'promo-banner', type: 'hero_banner', props: { title: 'Sale', tapAction: JSON.stringify({ type: 'navigate', payload: { screenId: 'ghost-page' } }) } },
      { id: 'ok-btn', type: 'button', props: {}, actions: { tap: { type: 'switch_screen', payload: { screenId: 'book' } } } },
    ]);
    const result = validateProject(draft);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].path).toContain('components[0].props.tapAction');
    expect(result.errors[0].message).toContain('promo-banner');
    expect(result.errors[0].message).toContain('ghost-page');
    expect(result.errors[0].fix).toContain('book');
    expect(() => compileDesignToPublishedApp(draft, '1.0.0', '2026-09-29T00:00:00Z')).toThrow(/ghost-page.*book/);
  });
  it('accepts path-style destinations that name existing screens', () => {
    const draft = project([
      { id: 'banner', type: 'hero_banner', props: { title: 'Hi', tapAction: JSON.stringify({ type: 'push', payload: { push: '/book' } }) } },
    ]);
    expect(validateProject(draft).errors).toEqual([]);
    const result = compileDesignToPublishedApp(draft, '1.0.0', '2026-09-29T00:00:00Z');
    expect(result.screens.book.layout.children[0].layout.children[0].props.tapAction.payload.screenId).toBe('book');
  });
  it('tells the merchant when no destination page was chosen yet', () => {
    const draft = project([
      { id: 'promo-banner', type: 'hero_banner', props: { offers: [{ tapAction: JSON.stringify({ type: 'navigate', payload: { screenId: '' } }) }, {}, {}] } },
    ]);
    const result = validateProject(draft);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('promo-banner › item 1');
    expect(result.errors[0].message).toContain('no destination page chosen yet');
    expect(result.errors[0].fix).toContain('book');
  });
  it('flags malformed action JSON with a located error', () => {    const draft = project([{ id: 'broken', type: 'button', props: { tapAction: '{oops' } }]);
    const result = validateProject(draft);
    expect(result.valid).toBe(false);
    expect(result.errors[0].path).toContain('components[0].props.tapAction');
    expect(result.errors[0].message).toContain('broken');
  });
});
