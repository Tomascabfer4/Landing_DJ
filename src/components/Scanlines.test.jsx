import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Scanlines from './Scanlines.jsx';

describe('Scanlines', () => {
  it('renders a fixed aria-hidden overlay', () => {
    const { container } = render(<Scanlines />);
    const div = container.firstChild;
    expect(div.getAttribute('aria-hidden')).toBe('true');
    expect(div.className).toContain('fixed');
  });
});
