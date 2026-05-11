import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RevealImage from './RevealImage.jsx';

describe('RevealImage', () => {
  it('renders an img with the given src and alt', () => {
    const { getByAltText } = render(<RevealImage src="/x.png" alt="portrait" />);
    const img = getByAltText('portrait');
    expect(img.getAttribute('src')).toBe('/x.png');
    expect(img.getAttribute('loading')).toBe('lazy');
  });
});
