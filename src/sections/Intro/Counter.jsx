import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap.js';
import { formatCounter, maybeGlitch } from './format-counter.js';

export default function Counter({ duration = 2.7, onComplete, onProgress, className = '' }) {
  const elRef = useRef(null);
  const valueRef = useRef({ n: 0 });
  const lastGlitchAt = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.textContent = '100';
      onProgressRef.current?.(100);
      onCompleteRef.current?.();
      return;
    }

    const tween = gsap.to(valueRef.current, {
      n: 100,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const now = performance.now();
        let str = formatCounter(valueRef.current.n);
        if (now - lastGlitchAt.current > 80) {
          const glitched = maybeGlitch(str);
          if (glitched !== str) {
            str = glitched;
            lastGlitchAt.current = now;
          }
        }
        el.textContent = str;
        onProgressRef.current?.(valueRef.current.n);
      },
      onComplete: () => {
        el.textContent = '100';
        onProgressRef.current?.(100);
        onCompleteRef.current?.();
      },
    });
    return () => tween.kill();
  }, [duration]);

  return (
    <div
      ref={elRef}
      className={`font-display text-[clamp(8rem,22vw,18rem)] leading-none tabular-nums ${className}`}
      aria-live="polite"
    >
      000
    </div>
  );
}
