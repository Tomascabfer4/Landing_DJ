import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap.js';

export default function GraffitiBar({ progress = 0, className = '' }) {
  const fillRef = useRef(null);
  const labelRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    const fill = fillRef.current;
    const label = labelRef.current;
    if (fill) {
      gsap.to(fill, {
        scaleX: Math.max(0, Math.min(progress, 100)) / 100,
        duration: 0.18,
        ease: 'power2.out',
      });
    }
    if (label) {
      label.textContent = `${Math.round(progress)}%`;
    }
  }, [progress]);

  useEffect(() => {
    const tk = tickerRef.current;
    if (!tk) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const tween = gsap.to(tk, { rotate: -2, repeat: -1, yoyo: true, duration: 0.18, ease: 'sine.inOut' });
    return () => tween.kill();
  }, []);

  return (
    <div className={`relative w-full max-w-[640px] flex items-center gap-5 ${className}`}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="brush" x="-5%" y="-50%" width="110%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025 0.6" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>

      <div
        ref={tickerRef}
        className="font-graffiti text-red leading-none drop-shadow-[0_0_18px_rgba(255,45,45,0.55)]"
        style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', transform: 'rotate(-3deg)' }}
      >
        <span ref={labelRef}>0%</span>
      </div>

      <div className="relative flex-1 h-6 sm:h-8">
        <div
          className="absolute inset-0 border-2 border-fg/80"
          style={{ filter: 'url(#brush)' }}
        />
        <div
          ref={fillRef}
          className="absolute inset-y-1 left-1 right-1 origin-left bg-gradient-to-r from-blood via-crimson to-red"
          style={{ filter: 'url(#brush)', transform: 'scaleX(0)' }}
        />
        <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40 bg-[repeating-linear-gradient(45deg,transparent_0_6px,rgba(0,0,0,0.4)_6px_8px)]" />
      </div>

      <span className="font-graffiti text-spark leading-none" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', transform: 'rotate(4deg)' }}>
        LOADING
      </span>
    </div>
  );
}
