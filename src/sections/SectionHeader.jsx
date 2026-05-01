import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

export default function SectionHeader({ index, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (!el || reduce) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.from(el.children, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
      }),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={ref} className="flex items-baseline gap-4 mb-12">
      <span className="font-body text-red text-xs tracking-[0.4em]">{index}</span>
      <span className="font-body text-fg/60 text-xs tracking-[0.4em] uppercase">/ {label}</span>
      <span className="ml-auto font-body text-fg/40 text-xs">K1D T0M1</span>
    </div>
  );
}
