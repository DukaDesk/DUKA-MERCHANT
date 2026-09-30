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
});
