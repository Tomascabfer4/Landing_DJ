import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIntroGate, setIntroReady, getIntroReady } from './useIntroGate.js';

describe('useIntroGate', () => {
  beforeEach(() => setIntroReady(false));

  it('starts as false', () => {
    const { result } = renderHook(() => useIntroGate());
    expect(result.current).toBe(false);
  });

  it('updates when setIntroReady is called', () => {
    const { result } = renderHook(() => useIntroGate());
    act(() => setIntroReady(true));
    expect(result.current).toBe(true);
    expect(getIntroReady()).toBe(true);
  });
});
