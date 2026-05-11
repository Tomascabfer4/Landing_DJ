import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Cursor from './Cursor.jsx';

describe('Cursor', () => {
  it('renders a fixed aria-hidden cursor with the glitch filter defined', () => {
    const { container } = render(<Cursor />);
    expect(container.querySelector('filter#cursor-glitch-filter')).toBeTruthy();
    const dot = container.querySelector('div[aria-hidden="true"]');
    expect(dot).toBeTruthy();
    expect(dot.className).toContain('fixed');
  });
});
