import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

/**
 * Single global ambient lighting layer. Fixed full-viewport, behind everything.
 * Replaces the per-section blobs that caused visible color edges between sections.
 * Three large radials drift slowly to keep the mood alive without abrupt breaks.
 */
export default function AmbientField() {
  const a = useRef(null);
  const b = useRef(null);
  const c = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const tweens = [
      gsap.to(a.current, { x: 80, y: -60, duration: 22, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
      gsap.to(b.current, { x: -90, y: 70, duration: 28, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
      gsap.to(c.current, { x: 60, y: -80, duration: 32, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
    ];
    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={a}
        className="absolute -left-[15%] top-[10%] h-[80vh] w-[80vh] rounded-full bg-red/10 blur-[180px] will-change-transform"
      />
      <div
        ref={b}
        className="absolute right-[-15%] top-[55%] h-[70vh] w-[70vh] rounded-full bg-blood/15 blur-[200px] will-change-transform"
      />
      <div
        ref={c}
        className="absolute left-[30%] bottom-[-15%] h-[60vh] w-[60vh] rounded-full bg-crimson/10 blur-[220px] will-change-transform"
      />
    </div>
  );
}
