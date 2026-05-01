import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import SectionHeader from './SectionHeader.jsx';
import RevealImage from '../components/RevealImage.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import StatNumber from './StatNumber.jsx';

export default function About() {
  const headlineRef = useRef(null);
  const para1Ref = useRef(null);
  const para2Ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const h = headlineRef.current;
    if (!h) return;

    const text = h.dataset.text || h.textContent;
    h.dataset.text = text;
    h.innerHTML = text
      .split('')
      .map((c) => c === ' ' ? ' ' : `<span class="inline-block">${c}</span>`)
      .join('');

    const chars = h.querySelectorAll('span');
    const triggers = [];

    triggers.push(ScrollTrigger.create({
      trigger: h,
      start: 'top 80%',
      once: true,
      onEnter: () => gsap.from(chars, {
        yPercent: 110,
        opacity: 0,
        rotateX: -90,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.04,
      }),
    }));

    [para1Ref, para2Ref].forEach((r, i) => {
      const el = r.current;
      if (!el) return;
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          delay: 0.15 * i,
          ease: 'power3.out',
        }),
      }));
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section id="about" className="relative px-6 sm:px-12 py-32 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-crimson/30 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-blood/40 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full bg-red/20 blur-[120px]" />

      <SectionHeader index="01" label="ABOUT" />

      <div className="relative grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-3 bg-gradient-to-br from-red via-crimson to-blood opacity-70 blur-xl" />
          <RevealImage
            src="/images/portrait/1.png"
            alt="K1D T0M1 portrait"
            direction="top"
            className="relative aspect-[4/5] w-full"
            imgClassName="h-full w-full object-cover"
          />
          <span className="absolute -bottom-4 -right-4 font-graffiti text-spark text-2xl tracking-[0.2em] bg-bg px-3 py-1 border border-spark/40" style={{ transform: 'rotate(-4deg)' }}>
            EST · MMXX
          </span>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2
            ref={headlineRef}
            className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.9] bg-gradient-to-br from-fg via-red to-blood bg-clip-text text-transparent"
          >
            K1D T0M1
          </h2>
          <p ref={para1Ref} className="font-body text-fg/80 text-lg leading-relaxed max-w-prose">
            Productor y DJ moviéndose entre <span className="text-red font-medium">techno crudo</span> y energía <span className="text-spark font-medium">urbana</span>. Cada set construye un viaje físico: graves cargados, texturas oxidadas, momentos hipnóticos.
          </p>
          <p ref={para2Ref} className="font-body text-fg/60 leading-relaxed max-w-prose">
            Más que música — una experiencia. Sesiones en clubs, warehouses y eventos privados por toda Europa.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <MagneticButton
              as="a"
              href="https://instagram.com/"
              className="font-body uppercase tracking-[0.3em] text-sm border border-fg/30 px-6 py-3 hover:border-red hover:text-red hover:bg-red/10 transition-all"
            >
              + Instagram
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://soundcloud.com/"
              className="font-body uppercase tracking-[0.3em] text-sm border border-fg/30 px-6 py-3 hover:border-spark hover:text-spark hover:bg-spark/10 transition-all"
            >
              + SoundCloud
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="relative mt-24 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-fg/10 pt-10">
        <Stat label="YEARS"   value={5}   suffix=""  color="text-red" />
        <Stat label="SETS"    value={120} suffix="+" color="text-crimson" />
        <Stat label="TRACKS"  value={30}  suffix=""  color="text-spark" />
        <Stat label="TOUR"    value="EU"  suffix=""  color="text-ember" />
      </div>
    </section>
  );
}

function Stat({ label, value, suffix, color }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`text-[clamp(2.5rem,6vw,5rem)] leading-none font-display ${color}`}>
        {typeof value === 'number'
          ? <StatNumber to={value} suffix={suffix} colorClass={color} />
          : <span>{value}</span>}
      </span>
      <span className="font-body text-xs tracking-[0.3em] text-fg/50 uppercase">{label}</span>
    </div>
  );
}
