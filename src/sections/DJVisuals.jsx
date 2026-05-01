import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

const SLIDES = [
  { id: '01', src: '/images/cutout/1_SinFondo.png', tag: 'NIGHT TRANSIT', city: 'BERLIN', bpm: 132, mood: 'RAW' },
  { id: '02', src: '/images/cutout/2_SinFondo.png', tag: 'WAREHOUSE', city: 'BARCELONA', bpm: 138, mood: 'HEAVY' },
  { id: '03', src: '/images/cutout/3_SinFondo.png', tag: 'AFTERHOURS', city: 'AMSTERDAM', bpm: 130, mood: 'HYPNOTIC' },
  { id: '04', src: '/images/cutout/4_SinFondo.png', tag: 'CONCRETE', city: 'LISBON', bpm: 128, mood: 'URBAN' },
  { id: '05', src: '/images/cutout/5_SinFondo.png', tag: 'PEAK TIME', city: 'PARIS', bpm: 136, mood: 'PEAK' },
  { id: '06', src: '/images/cutout/6_SinFondo.png', tag: 'LIVE PULSE', city: 'MADRID', bpm: 134, mood: 'LIVE' },
];

export default function DJVisuals() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia?.('(min-width: 768px)').matches ?? false;
    if (reduce || !desktop) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalShift = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -totalShift(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalShift()}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const slides = track.querySelectorAll('[data-slide]');
    slides.forEach((slide) => {
      const photo = slide.querySelector('[data-photo]');
      const tag = slide.querySelector('[data-tag]');
      const num = slide.querySelector('[data-num]');
      const meta = slide.querySelector('[data-meta]');
      if (photo) {
        gsap.fromTo(photo, { y: 50 }, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        });
      }
      if (num) {
        gsap.fromTo(num, { xPercent: -10, opacity: 0.5 }, {
          xPercent: 10,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        });
      }
      if (tag) {
        gsap.fromTo(tag, { x: -120, opacity: 0 }, {
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tween,
            start: 'left center',
            end: 'center center',
            scrub: 0.8,
          },
        });
      }
      if (meta) {
        gsap.fromTo(meta, { x: 120, opacity: 0 }, {
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tween,
            start: 'left center',
            end: 'center center',
            scrub: 0.8,
          },
        });
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll().forEach((s) => {
        if (s.vars?.trigger && section.contains(s.vars.trigger)) s.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visuals"
      className="relative overflow-hidden bg-gradient-to-b from-blood/14 via-bg to-bg md:h-screen"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-16 z-[22] h-32 bg-gradient-to-b from-transparent via-blood/22 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 -top-28 z-[21] h-40 bg-[radial-gradient(ellipse_at_center,rgba(122,0,25,0.26),transparent_72%)] blur-[52px]" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-16 z-[22] h-32 bg-gradient-to-t from-transparent via-blood/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-28 z-[21] h-40 bg-[radial-gradient(ellipse_at_center,rgba(122,0,25,0.24),transparent_72%)] blur-[52px]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 pt-8 sm:px-12">
        <p className="font-body text-[10px] uppercase tracking-[0.45em] text-fg/50 sm:text-xs sm:tracking-[0.5em]">
          Scroll / Each frame is a moment on stage
        </p>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,45,45,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(122,0,25,0.4),transparent_60%)]" />
        <div className="absolute inset-x-0 -top-10 h-28 bg-[radial-gradient(ellipse_at_center,rgba(122,0,25,0.24),transparent_72%)] blur-3xl" />
        <div className="absolute inset-x-0 -bottom-10 h-28 bg-[radial-gradient(ellipse_at_center,rgba(122,0,25,0.22),transparent_72%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-blood/8 to-transparent md:h-14" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-blood/8 to-transparent md:h-14" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 4px)' }}
        />
      </div>

      <div ref={trackRef} className="relative z-10 hidden h-full will-change-transform md:flex" style={{ width: 'max-content' }}>
        {SLIDES.map((s, i) => (
          <Slide key={s.id} slide={s} index={i} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-12 px-5 pb-16 pt-24 sm:px-6 md:hidden">
        {SLIDES.map((s, i) => (
          <MobileSlide key={s.id} slide={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function Slide({ slide, index }) {
  const flip = index % 2 === 1;

  return (
    <div data-slide className="relative flex h-full shrink-0 items-end overflow-hidden" style={{ width: '100vw' }}>
      <div className="absolute inset-0 px-12 sm:px-20">
        <div
          data-num
          className="select-none font-graffiti leading-none text-red/15"
          style={{
            fontSize: 'clamp(18rem, 44vw, 52rem)',
            position: 'absolute',
            top: '54%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
            textShadow: '0 0 80px rgba(255,45,45,0.25)',
          }}
        >
          {slide.id}
        </div>
      </div>

      <div className={`relative z-10 flex h-full w-full items-end gap-8 px-10 pb-24 pt-20 sm:px-20 ${flip ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex h-full max-h-[74vh] items-end">
          <div className="absolute -inset-8 bg-gradient-to-tr from-blood via-crimson to-red opacity-40 blur-3xl" />
          <img
            data-photo
            src={slide.src}
            alt={`${slide.tag} - ${slide.city}`}
            className="relative h-full w-auto max-w-full object-contain object-bottom"
            style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 60px rgba(255,45,45,0.3))' }}
            loading="lazy"
          />
        </div>

        <div className="relative flex flex-1 flex-col justify-end gap-3 pb-8">
          <div data-tag className="font-graffiti leading-none text-spark" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'rotate(-2deg)' }}>
            {slide.tag}
          </div>
          <div data-meta className="flex flex-col gap-2">
            <span className="font-body text-sm tracking-[0.4em] text-fg">{slide.city}</span>
            <div className="flex items-center gap-4 font-body text-xs tracking-[0.3em]">
              <span className="text-red">{slide.bpm} BPM</span>
              <span className="text-fg/30">/</span>
              <span className="text-spark">{slide.mood}</span>
            </div>
            <div className="mt-3 h-px w-32 bg-gradient-to-r from-red via-crimson to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 font-body text-[10px] tracking-[0.5em] text-fg/40">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span className="block h-px w-12 bg-fg/30" />
        <span>06</span>
      </div>
    </div>
  );
}

function MobileSlide({ slide, index }) {
  return (
    <article className="relative overflow-hidden rounded-[28px] border border-fg/10 bg-gradient-to-br from-blood/20 via-bg/95 to-bg px-5 pb-6 pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-red/10 to-transparent" />
      <div
        className="pointer-events-none absolute right-[-0.18em] top-3 select-none font-graffiti leading-none text-fg/[0.08]"
        style={{ fontSize: 'clamp(7rem, 34vw, 10rem)' }}
      >
        {slide.id}
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-graffiti text-[clamp(2.1rem,11vw,3.3rem)] leading-[0.9] text-spark">
              {slide.tag}
            </p>
            <p className="mt-2 font-body text-[11px] uppercase tracking-[0.38em] text-fg/65">
              {slide.city}
            </p>
          </div>
          <div className="pt-2 text-right font-body text-[11px] uppercase tracking-[0.32em] text-fg/65">
            <div><span className="text-red">{slide.bpm}</span> BPM</div>
            <div className="mt-1 text-spark">{slide.mood}</div>
          </div>
        </div>

        <div className="relative mx-auto flex h-[44vh] max-h-[460px] min-h-[280px] w-full items-end justify-center overflow-visible">
          <div className="absolute inset-x-6 inset-y-10 rounded-full bg-gradient-to-tr from-blood via-crimson to-red opacity-55 blur-[70px]" />
          <img
            src={slide.src}
            alt={`${slide.tag} - ${slide.city}`}
            loading="lazy"
            className="relative h-full w-auto max-w-full object-contain object-bottom"
            style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7)) drop-shadow(0 0 50px rgba(255,45,45,0.25))' }}
          />
        </div>

        <div className="flex items-center justify-between border-t border-fg/10 pt-4 font-body text-[10px] uppercase tracking-[0.42em] text-fg/45">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-fg/20 to-transparent" />
          <span>06</span>
        </div>
      </div>
    </article>
  );
}
