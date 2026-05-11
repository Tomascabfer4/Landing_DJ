import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap.js';

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function Cursor() {
  const dotRef = useRef(null);
  const [mode, setMode] = useState('default'); // 'default' | 'hover' | 'glitch'

  useEffect(() => {
    if (isTouchDevice()) return;
    const dot = dotRef.current;
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3.out' });

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e) => {
      const m = e.target?.closest?.('[data-cursor]')?.dataset?.cursor;
      if (m) setMode(m);
    };
    const onOut = (e) => {
      if (e.target?.closest?.('[data-cursor]')) setMode('default');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (typeof window !== 'undefined' && isTouchDevice()) return null;

  const size = mode === 'hover' ? 36 : mode === 'glitch' ? 28 : 14;
  const bg =
    mode === 'hover'
      ? 'var(--color-cyan)'
      : mode === 'glitch'
      ? 'var(--color-magenta)'
      : 'transparent';
  const border = mode === 'default' ? '1.5px solid var(--color-cyan)' : 'none';
  const filter = mode === 'glitch' ? 'url(#cursor-glitch-filter)' : 'none';

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="cursor-glitch-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2">
            <animate attributeName="baseFrequency" dur="0.5s" values="0.9;1.4;0.9" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="6" />
        </filter>
      </svg>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-difference"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: '50%',
          background: bg,
          border,
          filter,
          transition: 'width 0.2s, height 0.2s, background 0.2s, border 0.2s',
        }}
      />
    </>
  );
}
