import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { Package } from 'lucide-react';
import { Empty } from './States';
it('renders an icon element and preserves its props and empty-state action', () => {
  const action = vi.fn();
  render(<Empty icon={<Package data-testid="icon" size={32} />} message="No products" action={<button onClick={action}>Add product</button>} />);
  expect(screen.getByTestId('icon').getAttribute('width')).toBe('32');
  expect(screen.getByText('No products')).toBeTruthy();
  fireEvent.click(screen.getByText('Add product')); expect(action).toHaveBeenCalledOnce();
});
it('supports component references and named icons', () => {
  const { container, rerender } = render(<Empty icon={Package} />);
  expect(container.querySelector('.lucide-package')).toBeTruthy();
  rerender(<Empty icon="Package" />);
  expect(container.querySelector('.lucide-package')).toBeTruthy();
  rerender(<Empty icon={null} />);
  expect(container.querySelector('.lucide-inbox')).toBeTruthy();
});
