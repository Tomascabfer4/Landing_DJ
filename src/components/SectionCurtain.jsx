import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

export default function SectionCurtain({ label = '' }) {
  const ref = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const trigger = ref.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    gsap.set(panel, { clipPath: 'inset(100% 0 0 0)' });
    const st = ScrollTrigger.create({
      trigger,
      start: 'top 90%',
      end: 'bottom top',
      scrub: 0.6,
      animation: gsap.timeline()
        .to(panel, { clipPath: 'inset(0)', ease: 'none' })
        .to(panel, { clipPath: 'inset(0 0 100% 0)', ease: 'none' }),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={ref} className="relative h-[40vh] w-full overflow-hidden" aria-hidden="true">
      <div ref={panelRef} className="absolute inset-0 bg-bg flex items-center justify-center">
        <span className="font-display text-cyan text-[clamp(3rem,10vw,8rem)] opacity-70">
          {label}
        </span>
      </div>
    </div>
  );
}
