export function resolveInsertionTarget(section, selectedComponentId, explicitTarget) {
  if (!section) return null;
  if (explicitTarget?.sectionId === section.id && explicitTarget.parentId) return explicitTarget;
  let found = null;
  function visit(nodes, parent = null) {
    for (const node of nodes || []) {
      const container = ['row', 'nested_section', 'carousel'].includes(node.type) ? node : parent;
      if (node.id === selectedComponentId && container) found = { sectionId: section.id, parentId: container.id, index: container.children?.length || 0 };
      visit(node.children, container);
    }
  }
  visit(section.components);
  return found;
}
