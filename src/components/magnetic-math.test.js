import { describe, it, expect } from 'vitest';
import { magneticOffset } from './magnetic-math.js';

describe('magneticOffset', () => {
  it('returns 0,0 when cursor is dead-centered', () => {
    const r = { left: 0, top: 0, width: 100, height: 50 };
    expect(magneticOffset(50, 25, r, 0.4)).toEqual({ x: 0, y: 0 });
  });

  it('scales offset by strength', () => {
    const r = { left: 0, top: 0, width: 100, height: 100 };
    const o = magneticOffset(100, 50, r, 0.5);
    expect(o.x).toBeCloseTo(25);
    expect(o.y).toBeCloseTo(0);
  });
});
