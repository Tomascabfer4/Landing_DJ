import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.jsx';

describe('Counter', () => {
  it('renders the initial 000 value', () => {
    const { container } = render(<Counter />);
    expect(container.firstChild.textContent).toBe('000');
  });
});
