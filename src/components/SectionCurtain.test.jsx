import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionCurtain from './SectionCurtain.jsx';

describe('SectionCurtain', () => {
  it('renders the provided label', () => {
    const { getByText } = render(<SectionCurtain label="K1D T0M1" />);
    expect(getByText('K1D T0M1')).toBeTruthy();
  });
});
