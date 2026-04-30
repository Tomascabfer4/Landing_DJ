import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lightbox from './Lightbox.jsx';

const imgs = [
  { src: '/a.png', alt: 'a' },
  { src: '/b.png', alt: 'b' },
];

describe('Lightbox', () => {
  it('renders nothing when index is null', () => {
    const { container } = render(
      <Lightbox images={imgs} index={null} onClose={() => {}} onPrev={() => {}} onNext={() => {}} />
    );
    expect(container.querySelector('[role=dialog]')).toBeNull();
  });

  it('renders the selected image and triggers handlers', () => {
    const onClose = vi.fn();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const { getByAltText, getByLabelText } = render(
      <Lightbox images={imgs} index={0} onClose={onClose} onPrev={onPrev} onNext={onNext} />
    );
    expect(getByAltText('a')).toBeTruthy();
    fireEvent.click(getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
    fireEvent.click(getByLabelText('Next'));
    expect(onNext).toHaveBeenCalled();
    fireEvent.click(getByLabelText('Previous'));
    expect(onPrev).toHaveBeenCalled();
  });
});
