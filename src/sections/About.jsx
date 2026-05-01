import { useLayoutEffect, useRef } from 'react';
import { revealOnEnter, revealChildren } from '../lib/reveal.js';

const GENRES = [
  { label: 'EDM', tone: 'red' },
  { label: 'TECH HOUSE', tone: 'fg' },
  { label: 'HARD TECH', tone: 'crimson' },
  { label: 'DEMBOW', tone: 'spark' },
  { label: 'LATIN HOUSE', tone: 'fg' },
  { label: 'REGGAETON', tone: 'red' },
  { label: 'URBANO', tone: 'spark' },
];

const TONE_CLASS = {
  red: 'text-red border-red/50 bg-red/5',
  crimson: 'text-crimson border-crimson/50 bg-crimson/5',
  spark: 'text-spark border-spark/50 bg-spark/5',
  fg: 'text-fg border-fg/30 bg-fg/5',
};

export default function About() {
  const titleRef = useRef(null);
  const photoWrapRef = useRef(null);
  const genresRef = useRef(null);
  const bioRef = useRef(null);

  useLayoutEffect(() => {
    const triggers = [
      revealOnEnter(titleRef.current, { y: 32, duration: 1.1, start: 'top 85%' }),
      revealOnEnter(photoWrapRef.current, { y: 40, duration: 1.2, start: 'top 80%' }),
      revealChildren(genresRef.current, { y: 18, duration: 0.85, stagger: 0.07, start: 'top 88%' }),
      revealOnEnter(bioRef.current, { y: 26, duration: 1.0, start: 'top 88%' }),
    ];
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  return (
    <section id="about" className="relative overflow-hidden px-6 py-24 sm:px-12 sm:py-28 lg:overflow-visible">
      <div className="pointer-events-none absolute -top-36 left-1/4 h-[560px] w-[560px] rounded-full bg-red/16 blur-[190px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-32 h-[620px] w-[620px] rounded-full bg-blood/24 blur-[200px]" />

      <div className="relative grid items-center gap-12 lg:grid-cols-12">
        <div ref={photoWrapRef} className="relative flex justify-center lg:col-span-5">
          <div className="relative flex aspect-[3/4] w-full max-w-[320px] items-end justify-center sm:max-w-[400px] lg:max-w-[460px]">
            <div className="absolute -inset-x-8 inset-y-6 rounded-full bg-gradient-to-br from-red via-crimson to-blood opacity-58 blur-[86px] sm:-inset-x-10 sm:blur-[104px]" />
            <img
              src="/images/cutout/3_SinFondo.png"
              alt="K1D TOM1"
              loading="lazy"
              className="relative h-full w-auto max-w-full object-contain object-bottom"
              style={{ filter: 'drop-shadow(0 35px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 80px rgba(255,45,45,0.3))' }}
            />
            <span
              className="absolute -bottom-3 left-1/2 whitespace-nowrap border border-spark/40 bg-bg/85 px-4 py-1 font-graffiti text-lg tracking-[0.3em] text-spark backdrop-blur sm:text-2xl sm:tracking-[0.35em]"
              style={{ transform: 'translate(-50%, 0) rotate(-3deg)' }}
            >
              EST - 2020
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7 lg:gap-10">
          <h2
            ref={titleRef}
            className="font-graffiti text-[clamp(2.8rem,12vw,7rem)] uppercase leading-[0.88] max-md:text-center lg:max-w-[12ch]"
          >
            Pincho lo que <span className="text-red">mueve</span>.
          </h2>

          <ul ref={genresRef} className="flex flex-wrap gap-2.5 max-md:justify-center sm:gap-3">
            {GENRES.map((g, i) => {
              const rot = (i % 2 === 0 ? -1 : 1) * (1 + (i % 3) * 0.6);
              return (
                <li key={g.label} className="inline-block">
                  <span
                    className={`inline-block border-2 px-3 py-1.5 font-graffiti text-lg uppercase tracking-wide sm:px-5 sm:py-2 sm:text-3xl ${TONE_CLASS[g.tone]}`}
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    {g.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <p ref={bioRef} className="max-w-prose font-body text-base leading-relaxed text-fg/85 max-md:text-center sm:text-lg">
            Me encanta pinchar <span className="text-red font-medium">EDM</span>, tech house, hard tech,{' '}
            <span className="text-spark font-medium">dembow</span>, latin house, reggaeton, y todo el{' '}
            <span className="text-red font-medium">genero urbano</span> en si. Cualquier ritmo que mueva al publico,
            que construya una noche que se recuerde y haga que la gente no quiera irse de la pista.
          </p>
        </div>
      </div>
    </section>
  );
}
