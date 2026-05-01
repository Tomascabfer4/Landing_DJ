import { useLayoutEffect, useRef } from 'react';
import { revealChildren } from '../lib/reveal.js';

export default function SectionHeader({ index, label }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const st = revealChildren(ref.current, {
      y: 16,
      duration: 0.9,
      stagger: 0.07,
      start: 'top 92%',
    });
    return () => st?.kill();
  }, []);

  return (
    <div ref={ref} className="flex items-baseline gap-4 mb-12">
      <span className="font-body text-red text-xs tracking-[0.4em]">{index}</span>
      <span className="font-body text-fg/60 text-xs tracking-[0.4em] uppercase">/ {label}</span>
      <span className="ml-auto font-body text-fg/40 text-xs">K1D T0M1</span>
    </div>
  );
}
