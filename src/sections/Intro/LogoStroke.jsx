import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap.js';

const GLYPHS = [
  // K
  { d: 'M22,10 L22,70 M22,40 L52,10 M22,40 L52,70', len: 130 },
  // 1
  { d: 'M82,18 L92,12 L92,70 M76,70 L108,70', len: 110 },
  // D
  { d: 'M124,10 L124,70 L150,70 C168,70 172,55 172,40 C172,25 168,10 150,10 Z', len: 200 },
  // T
  { d: 'M200,10 L240,10 M220,10 L220,70', len: 110 },
  // 0
  { d: 'M276,10 C260,10 256,25 256,40 C256,55 260,70 276,70 C292,70 296,55 296,40 C296,25 292,10 276,10 Z', len: 180 },
  // M
  { d: 'M310,70 L310,10 L330,50 L350,10 L350,70', len: 180 },
  // 1
  { d: 'M372,18 L382,12 L382,70 M366,70 L398,70', len: 110 },
];

export default function LogoStroke({ play = false, onDone }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!play) return;
    const paths = wrapRef.current?.querySelectorAll('path[data-len]');
    if (!paths || paths.length === 0) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      paths.forEach((p) => p.setAttribute('stroke-dashoffset', '0'));
      onDone?.();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'cubic-bezier(0.5,0,0.5,1)', duration: 0.6 },
      onComplete: onDone,
    });
    paths.forEach((p, i) => {
      const len = Number(p.dataset.len);
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(p, { strokeDashoffset: 0 }, i * 0.08);
    });
    return () => tl.kill();
  }, [play, onDone]);

  return (
    <div ref={wrapRef} className="w-[min(80vw,720px)]">
      <svg
        viewBox="0 0 480 80"
        fill="none"
        stroke="var(--color-cyan)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 12px rgba(0,240,255,0.65))' }}
        role="img"
        aria-label="K1D T0M1"
      >
        {GLYPHS.map((g, i) => (
          <path key={i} d={g.d} data-len={g.len} />
        ))}
      </svg>
    </div>
  );
}
