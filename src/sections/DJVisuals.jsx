import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

const SLIDES = [
  { id: '01', src: '/images/cutout/1_SinFondo.png', tag: 'NIGHT TRANSIT',  city: 'BERLIN',    bpm: 132, mood: 'RAW' },
  { id: '02', src: '/images/cutout/2_SinFondo.png', tag: 'WAREHOUSE',      city: 'BARCELONA', bpm: 138, mood: 'HEAVY' },
  { id: '03', src: '/images/cutout/3_SinFondo.png', tag: 'AFTERHOURS',     city: 'AMSTERDAM', bpm: 130, mood: 'HYPNOTIC' },
  { id: '04', src: '/images/cutout/4_SinFondo.png', tag: 'CONCRETE',       city: 'LISBON',    bpm: 128, mood: 'URBAN' },
  { id: '05', src: '/images/cutout/5_SinFondo.png', tag: 'PEAK TIME',      city: 'PARIS',     bpm: 136, mood: 'PEAK' },
  { id: '06', src: '/images/cutout/6_SinFondo.png', tag: 'LIVE PULSE',     city: 'MADRID',    bpm: 134, mood: 'LIVE' },
];

export default function DJVisuals() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

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
    slides.forEach((slide, i) => {
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
      className="relative bg-bg overflow-hidden"
      style={{ height: '100vh' }}
    >
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 pt-8">
        <p className="font-body text-fg/50 text-[10px] sm:text-xs tracking-[0.5em] uppercase">
          Scroll · Each frame is a moment on stage
        </p>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,45,45,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(122,0,25,0.4),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 4px)',
        }} />
      </div>

      <div
        ref={trackRef}
        className="relative z-10 flex h-full will-change-transform"
        style={{ width: 'max-content' }}
      >
        {SLIDES.map((s, i) => (
          <Slide key={s.id} slide={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function Slide({ slide, index }) {
  const flip = index % 2 === 1;
  return (
    <div
      data-slide
      className="relative shrink-0 h-full flex items-end overflow-hidden"
      style={{ width: '100vw' }}
    >
      <div className="absolute inset-0 px-12 sm:px-20">
        <div
          data-num
          className="font-graffiti leading-none text-red/15 select-none"
          style={{
            fontSize: 'clamp(20rem, 50vw, 60rem)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
            textShadow: '0 0 80px rgba(255,45,45,0.25)',
          }}
        >
          {slide.id}
        </div>
      </div>

      <div className={`relative z-10 flex h-full w-full items-end ${flip ? 'flex-row-reverse' : ''} px-10 sm:px-20 pt-20 pb-20 gap-8`}>
        <div className="relative h-full max-h-[78vh] flex items-end">
          <div className="absolute -inset-8 bg-gradient-to-tr from-blood via-crimson to-red opacity-40 blur-3xl" />
          <img
            data-photo
            src={slide.src}
            alt={`${slide.tag} — ${slide.city}`}
            className="relative h-full w-auto max-w-full object-contain object-bottom"
            style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 60px rgba(255,45,45,0.3))' }}
            loading="lazy"
          />
        </div>

        <div className="relative flex-1 flex flex-col justify-end gap-3 pb-8">
          <div data-tag className="font-graffiti text-spark leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'rotate(-2deg)' }}>
            {slide.tag}
          </div>
          <div data-meta className="flex flex-col gap-2">
            <span className="font-body text-fg text-sm tracking-[0.4em]">{slide.city}</span>
            <div className="flex items-center gap-4 font-body text-xs tracking-[0.3em]">
              <span className="text-red">{slide.bpm} BPM</span>
              <span className="text-fg/30">·</span>
              <span className="text-spark">{slide.mood}</span>
            </div>
            <div className="mt-3 h-px w-32 bg-gradient-to-r from-red via-crimson to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 font-body text-[10px] tracking-[0.5em] text-fg/40">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span className="block w-12 h-px bg-fg/30" />
        <span>06</span>
      </div>
    </div>
  );
}
