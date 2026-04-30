import { describe, it, expect } from 'vitest';
import { formatCounter, GLITCH_CHARS, maybeGlitch } from './format-counter.js';

describe('formatCounter', () => {
  it('zero pads to 3 digits', () => {
    expect(formatCounter(0)).toBe('000');
    expect(formatCounter(7)).toBe('007');
    expect(formatCounter(42)).toBe('042');
    expect(formatCounter(100)).toBe('100');
  });
});

describe('maybeGlitch', () => {
  it('returns original string when chance fails', () => {
    expect(maybeGlitch('042', () => 1)).toBe('042');
  });
  it('replaces a single char with a glitch char when chance hits', () => {
    const out = maybeGlitch('042', () => 0); // always trigger; pick first index, first char
    expect(out).not.toBe('042');
    expect(out.length).toBe(3);
    expect(GLITCH_CHARS.includes(out[0])).toBe(true);
  });
});
