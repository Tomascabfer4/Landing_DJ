import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

const FROM = {
  top:    'inset(100% 0 0 0)',
  bottom: 'inset(0 0 100% 0)',
  left:   'inset(0 100% 0 0)',
  right:  'inset(0 0 0 100%)',
};

export default function RevealImage({
  src,
  alt = '',
  direction = 'top',
  className = '',
  imgClassName = '',
  start = 'top 85%',
  end = 'top 40%',
  scrub = 0.6,
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      gsap.set(el, { clipPath: 'inset(0)' });
      return;
    }
    gsap.set(el, { clipPath: FROM[direction] });
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub,
      animation: gsap.to(el, { clipPath: 'inset(0)', ease: 'none' }),
    });
    return () => st.kill();
  }, [direction, start, end, scrub]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className={imgClassName} loading="lazy" />
    </div>
  );
}
