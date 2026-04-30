import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SetRow from './SetRow.jsx';

const set = { id: '001', title: 'X', bpm: 128, duration: 60, soundcloudUrl: 'https://soundcloud.com/' };

describe('SetRow', () => {
  it('shows PLAY when collapsed and CLOSE when expanded', () => {
    const onToggle = vi.fn();
    const { rerender, getByRole } = render(<SetRow set={set} expanded={false} onToggle={onToggle} />);
    expect(getByRole('button').textContent).toContain('PLAY');
    rerender(<SetRow set={set} expanded={true} onToggle={onToggle} />);
    expect(getByRole('button').textContent).toContain('CLOSE');
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    const { getByRole } = render(<SetRow set={set} expanded={false} onToggle={onToggle} />);
    fireEvent.click(getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
