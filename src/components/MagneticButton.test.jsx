import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MagneticButton from './MagneticButton.jsx';

describe('MagneticButton', () => {
  it('renders children with data-cursor=hover', () => {
    const { getByText } = render(<MagneticButton>BOOK</MagneticButton>);
    const btn = getByText('BOOK');
    expect(btn.getAttribute('data-cursor')).toBe('hover');
  });
});
