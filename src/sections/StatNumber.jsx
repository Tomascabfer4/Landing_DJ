import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

export default function StatNumber({ to, suffix = '', colorClass = 'text-cyan' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.textContent = `${to}${suffix}`; return; }
    const obj = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          n: to,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = `${Math.round(obj.n)}${suffix}`; },
        });
      },
    });
    return () => st.kill();
  }, [to, suffix]);
  return <span ref={ref} className={`font-display ${colorClass}`}>0{suffix}</span>;
}
