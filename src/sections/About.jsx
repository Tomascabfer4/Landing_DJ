import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import SectionHeader from './SectionHeader.jsx';

const GENRES = [
  { label: 'EDM',         tone: 'red' },
  { label: 'TECH HOUSE',  tone: 'fg' },
  { label: 'HARD TECH',   tone: 'crimson' },
  { label: 'DEMBOW',      tone: 'spark' },
  { label: 'LATIN HOUSE', tone: 'fg' },
  { label: 'REGGAETON',   tone: 'red' },
  { label: 'URBANO',      tone: 'spark' },
];

const TONE_CLASS = {
  red:     'text-red border-red/50 bg-red/5',
  crimson: 'text-crimson border-crimson/50 bg-crimson/5',
  spark:   'text-spark border-spark/50 bg-spark/5',
  fg:      'text-fg border-fg/30 bg-fg/5',
};

export default function About() {
  const titleRef = useRef(null);
  const photoWrapRef = useRef(null);
  const genresRef = useRef(null);
  const bioRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const triggers = [];
    const fadeUp = (el, opts = {}) => {
      if (!el) return;
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: () => gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          ...opts,
        }),
      }));
    };

    fadeUp(titleRef.current);
    fadeUp(bioRef.current, { duration: 1.0 });

    if (photoWrapRef.current) {
      triggers.push(ScrollTrigger.create({
        trigger: photoWrapRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => gsap.from(photoWrapRef.current, {
          x: -50,
          opacity: 0,
          duration: 1.3,
          ease: 'expo.out',
        }),
      }));
    }

    if (genresRef.current) {
      triggers.push(ScrollTrigger.create({
        trigger: genresRef.current,
        start: 'top 82%',
        once: true,
        onEnter: () => gsap.from(genresRef.current.children, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.07,
        }),
      }));
    }

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section id="about" className="relative px-6 sm:px-12 py-32 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full bg-red/15 blur-[170px]" />
      <div className="pointer-events-none absolute bottom-0 -right-32 w-[600px] h-[600px] rounded-full bg-blood/35 blur-[180px]" />

      <SectionHeader index="01" label="ABOUT" />

      <div className="relative grid lg:grid-cols-12 gap-12 items-center mt-16">
        <div ref={photoWrapRef} className="lg:col-span-5 relative flex justify-center">
          <div className="absolute inset-x-0 top-6 bottom-10 bg-gradient-to-br from-red via-crimson to-blood opacity-60 blur-3xl rounded-full" />
          <img
            src="/images/cutout/3_SinFondo.png"
            alt="K1D TOM1"
            loading="lazy"
            className="relative max-h-[78vh] w-auto object-contain"
            style={{ filter: 'drop-shadow(0 35px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 80px rgba(255,45,45,0.3))' }}
          />
          <span
            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-graffiti text-spark text-2xl tracking-[0.15em] bg-bg/80 px-4 py-1 border border-spark/40 backdrop-blur"
            style={{ transform: 'translate(-50%, 0) rotate(-3deg)' }}
          >
            EST · MMXX
          </span>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-10">
          <h2
            ref={titleRef}
            className="font-graffiti text-[clamp(3rem,8vw,7rem)] leading-[0.85] uppercase"
          >
            Pincho lo que <span className="text-red">mueve</span>.
          </h2>

          <ul ref={genresRef} className="flex flex-wrap gap-3">
            {GENRES.map((g, i) => (
              <li
                key={g.label}
                className={`inline-block px-5 py-2 font-graffiti text-2xl sm:text-3xl uppercase tracking-wide border-2 ${TONE_CLASS[g.tone]}`}
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3) * 0.6)}deg)` }}
              >
                {g.label}
              </li>
            ))}
          </ul>

          <p ref={bioRef} className="font-body text-fg/85 text-lg leading-relaxed max-w-prose">
            Me encanta pinchar <span className="text-red font-medium">EDM</span>, tech house, hard tech,{' '}
            <span className="text-spark font-medium">dembow</span>, latin house, reggaeton, y todo el{' '}
            <span className="text-red font-medium">género urbano</span> en sí. Cualquier ritmo que mueva al público,
            que construya una noche que se recuerde y haga que la gente no quiera irse de la pista.
          </p>
        </div>
      </div>
    </section>
  );
}
