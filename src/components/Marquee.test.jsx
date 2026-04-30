import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Marquee from './Marquee.jsx';

describe('Marquee', () => {
  it('renders text duplicated for the seamless loop', () => {
    const { container } = render(<Marquee text="HELLO" />);
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(2);
    spans.forEach((s) => expect(s.textContent).toBe('HELLO'));
  });

  it('applies rotate prop as transform', () => {
    const { container } = render(<Marquee text="X" rotate={-22} />);
    const wrapper = container.firstChild;
    expect(wrapper.style.transform).toContain('rotate(-22deg)');
  });
});
