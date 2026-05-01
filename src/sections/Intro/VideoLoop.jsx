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
        duration: 1.3,
        ease: 'expo.inOut',
        stagger: 0.08,
      });

      tl.add('held', '+=0.45');

      tl.to(strips, {
        xPercent: (i) => (i % 2 === 0 ? 130 : -130),
        duration: 1.4,
        ease: 'expo.inOut',
        stagger: 0.08,
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
        style={{ opacity: 1 }}
      />
      <video
        ref={bRef}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />

      <div
        ref={transitionRef}
        className="pointer-events-none absolute inset-[-25%] z-[10] opacity-0 invisible"
        style={{ transform: 'rotate(-22deg)' }}
        aria-hidden
      >
        {Array.from({ length: STRIP_COUNT }).map((_, i) => {
          const goesLeft = i % 2 === 0;
          const colors = goesLeft
            ? 'bg-gradient-to-r from-blood via-crimson to-red'
            : 'bg-gradient-to-l from-red via-crimson to-blood';
          const text = goesLeft ? 'K1D' : 'T0M1';
          const word = `${text} · `.repeat(20).toUpperCase();
          return (
            <div
              key={i}
              ref={(el) => { stripsRef.current[i] = el; }}
              className={`relative ${colors} flex items-center overflow-hidden text-bg`}
              style={{
                height: `${100 / STRIP_COUNT}%`,
                width: '160%',
                marginLeft: '-30%',
                borderTop: '2px solid #000',
                borderBottom: '2px solid #000',
              }}
            >
              <span
                className="font-graffiti whitespace-nowrap leading-none px-4 select-none uppercase"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  letterSpacing: '0.08em',
                  color: '#000',
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
