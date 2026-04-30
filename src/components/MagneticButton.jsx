import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { magneticOffset } from './magnetic-math.js';

export default function MagneticButton({
  children,
  as: Tag = 'button',
  strength = 0.4,
  className = '',
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e) => {
      const { x, y } = magneticOffset(
        e.clientX, e.clientY, el.getBoundingClientRect(), strength
      );
      xTo(x); yTo(y);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <Tag ref={ref} data-cursor="hover" className={`inline-block ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
