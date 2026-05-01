import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap.js';

const SOURCES = [
  '/video/loop/v1.mp4',
  '/video/loop/v2.mp4',
  '/video/loop/v3.mp4',
  '/video/loop/v4.mp4',
];

const STRIP_COUNT = 9;

export default function VideoLoop({ active = true }) {
  const [current, setCurrent] = useState(0);
  const aRef = useRef(null);
  const bRef = useRef(null);
  const transitionRef = useRef(null);
  const stripsRef = useRef([]);
  const slotRef = useRef('a');
  const animatingRef = useRef(false);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  useEffect(() => {
    if (!active) return;
    [aRef.current, bRef.current].forEach((v) => {
      if (!v) return;
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    });
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const a = aRef.current;
    if (!a) return;
    a.src = SOURCES[0];
    a.load();
    a.play().catch(() => {});
  }, [active]);

  const playTransition = () => {
    return new Promise((resolve) => {
      const strips = stripsRef.current.filter(Boolean);
      const transition = transitionRef.current;
      if (!strips.length || !transition) { resolve(); return; }

      gsap.set(transition, { autoAlpha: 1 });

      const tl = gsap.timeline({ onComplete: resolve });

      tl.fromTo(strips, {
        xPercent: (i) => (i % 2 === 0 ? -130 : 130),
      }, {
        xPercent: 0,
        duration: 0.55,
        ease: 'expo.inOut',
        stagger: 0.04,
      });

      tl.add('held', '+=0.05');

      tl.to(strips, {
        xPercent: (i) => (i % 2 === 0 ? 130 : -130),
        duration: 0.6,
        ease: 'expo.inOut',
        stagger: 0.04,
      }, 'held');

      tl.set(transition, { autoAlpha: 0 });
    });
  };

  const swap = async (nextIdx) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const fromSlot = slotRef.current;
    const toSlot = fromSlot === 'a' ? 'b' : 'a';
    const fromEl = fromSlot === 'a' ? aRef.current : bRef.current;
    const toEl = toSlot === 'a' ? aRef.current : bRef.current;

    if (toEl) {
      toEl.src = SOURCES[nextIdx];
      toEl.load();
      try { await toEl.play(); } catch {}
    }

    if (reduceRef.current) {
      gsap.set(fromEl, { autoAlpha: 0 });
      gsap.set(toEl, { autoAlpha: 1 });
    } else {
      const trans = playTransition();
      gsap.set(toEl, { autoAlpha: 1 });
      gsap.set(fromEl, { autoAlpha: 0 });
      await trans;
    }

    slotRef.current = toSlot;
    setCurrent(nextIdx);
    animatingRef.current = false;
  };

  useEffect(() => {
    if (!active) return;
    const el = slotRef.current === 'a' ? aRef.current : bRef.current;
    if (!el) return;

    const handleEnded = () => {
      const next = (current + 1) % SOURCES.length;
      swap(next);
    };

    el.addEventListener('ended', handleEnded);
    return () => el.removeEventListener('ended', handleEnded);
  }, [active, current]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={aRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.55) contrast(1.1) saturate(0.7)', opacity: 1 }}
      />
      <video
        ref={bRef}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.55) contrast(1.1) saturate(0.7)', opacity: 0 }}
      />

      <div className="pointer-events-none absolute inset-0 z-[2]" style={{
        background:
          'radial-gradient(circle at 30% 30%, rgba(255,45,45,0.28), transparent 60%),' +
          'radial-gradient(circle at 70% 70%, rgba(122,0,25,0.55), transparent 65%),' +
          'linear-gradient(180deg, rgba(10,7,7,0.55) 0%, rgba(10,7,7,0.7) 100%)',
      }} />

      <div
        ref={transitionRef}
        className="pointer-events-none absolute inset-[-25%] z-[10] opacity-0 invisible"
        style={{ transform: 'rotate(-22deg)' }}
        aria-hidden
      >
        {Array.from({ length: STRIP_COUNT }).map((_, i) => {
          const goesLeft = i % 2 === 0;
          const colors = goesLeft
            ? 'bg-gradient-to-r from-blood via-crimson to-red text-fg'
            : 'bg-gradient-to-l from-red via-crimson to-blood text-fg';
          const text = goesLeft ? 'K1D' : 'T0M1';
          const word = `${text} · `.repeat(20);
          return (
            <div
              key={i}
              ref={(el) => { stripsRef.current[i] = el; }}
              className={`relative ${colors} flex items-center overflow-hidden`}
              style={{
                height: `${100 / STRIP_COUNT}%`,
                width: '160%',
                marginLeft: '-30%',
                borderTop: '1px solid rgba(255,45,45,0.4)',
                borderBottom: '1px solid rgba(0,0,0,0.4)',
              }}
            >
              <span
                className="font-graffiti whitespace-nowrap leading-none px-4 select-none"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  letterSpacing: '0.08em',
                  textShadow: '0 0 16px rgba(0,0,0,0.6)',
                  transform: 'translateY(2px)',
                }}
              >
                {word}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
