import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap.js';

const TICKS_TOP = [
  { x: 14, h: 38, rot: -18 },
  { x: 22, h: 30, rot: -14 },
  { x: 30, h: 46, rot: -10 },
  { x: 38, h: 28, rot: -8 },
  { x: 46, h: 50, rot: -6 },
  { x: 54, h: 34, rot: -2 },
  { x: 62, h: 44, rot: 2 },
  { x: 70, h: 28, rot: 6 },
  { x: 78, h: 50, rot: 10 },
  { x: 86, h: 32, rot: 14 },
];

const TICKS_BOTTOM = [
  { x: 12, h: 30, rot: 18 },
  { x: 20, h: 42, rot: 14 },
  { x: 28, h: 26, rot: 10 },
  { x: 36, h: 48, rot: 6 },
  { x: 44, h: 30, rot: 2 },
  { x: 52, h: 44, rot: -2 },
  { x: 60, h: 28, rot: -6 },
  { x: 68, h: 50, rot: -10 },
  { x: 76, h: 30, rot: -14 },
  { x: 84, h: 38, rot: -18 },
];

export default function LogoMark({ play = false, onDone }) {
  const rootRef = useRef(null);
  const tickTopRef = useRef(null);
  const tickBotRef = useRef(null);
  const boxLRef = useRef(null);
  const boxRRef = useRef(null);
  const txtLRef = useRef(null);
  const txtRRef = useRef(null);

  useEffect(() => {
    if (!play) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      gsap.set([boxLRef.current, boxRRef.current, txtLRef.current, txtRRef.current], { opacity: 1, scaleX: 1, y: 0 });
      gsap.set(tickTopRef.current?.children || [], { opacity: 1, scaleY: 1 });
      gsap.set(tickBotRef.current?.children || [], { opacity: 1, scaleY: 1 });
      onDone?.();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => onDone?.() });

    tl.from([boxLRef.current, boxRRef.current], {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.55,
      ease: 'expo.out',
      stagger: 0.08,
    });

    tl.from([txtLRef.current, txtRRef.current], {
      yPercent: 110,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.06,
    }, '-=0.25');

    if (tickTopRef.current) {
      tl.from(tickTopRef.current.children, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'bottom center',
        duration: 0.45,
        ease: 'back.out(2)',
        stagger: { each: 0.025, from: 'random' },
      }, '-=0.5');
    }
    if (tickBotRef.current) {
      tl.from(tickBotRef.current.children, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'top center',
        duration: 0.45,
        ease: 'back.out(2)',
        stagger: { each: 0.025, from: 'random' },
      }, '<');
    }

    return () => tl.kill();
  }, [play, onDone]);

  return (
    <div ref={rootRef} className="relative inline-block select-none" aria-label="K1D TOM1">
      <div ref={tickTopRef} className="absolute inset-x-0 -top-12 h-12 pointer-events-none">
        {TICKS_TOP.map((t, i) => (
          <span
            key={`tt-${i}`}
            className="absolute bottom-0 block bg-white"
            style={{
              left: `${t.x}%`,
              width: '3px',
              height: `${t.h}px`,
              transform: `rotate(${t.rot}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>

      <div className="flex items-stretch">
        <div
          ref={boxLRef}
          className="relative bg-white px-6 sm:px-10 py-3 sm:py-5 border-y-4 border-l-4 border-white overflow-hidden"
        >
          <span
            ref={txtLRef}
            className="block font-display font-black text-bg leading-none text-[clamp(2.5rem,9vw,7rem)] tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900 }}
          >
            K1D
          </span>
        </div>
        <div
          ref={boxRRef}
          className="relative px-6 sm:px-10 py-3 sm:py-5 border-4 border-white border-l-0 overflow-hidden"
        >
          <span
            ref={txtRRef}
            className="block font-display font-black text-fg leading-none text-[clamp(2.5rem,9vw,7rem)] tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900 }}
          >
            TOM1
          </span>
        </div>
      </div>

      <div ref={tickBotRef} className="absolute inset-x-0 -bottom-12 h-12 pointer-events-none">
        {TICKS_BOTTOM.map((t, i) => (
          <span
            key={`tb-${i}`}
            className="absolute top-0 block bg-white"
            style={{
              left: `${t.x}%`,
              width: '3px',
              height: `${t.h}px`,
              transform: `rotate(${t.rot}deg)`,
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>
    </div>
  );
}
