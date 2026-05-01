import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import SectionHeader from './SectionHeader.jsx';
import RevealImage from '../components/RevealImage.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { gallery } from '../data/gallery.js';

const PARALLAX = [-20, 10, -10, 20, -15, 5, -25, 15];

export default function Gallery() {
  const [index, setIndex] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const items = gridRef.current?.querySelectorAll('[data-tile]');
    if (!items) return;
    const triggers = [];
    items.forEach((item, i) => {
      const offset = PARALLAX[i % PARALLAX.length];
      const t = ScrollTrigger.create({
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
        animation: gsap.fromTo(item, { y: -offset }, { y: offset, ease: 'none' }),
      });
      triggers.push(t);
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const onPrev = () => setIndex((i) => (i + gallery.length - 1) % gallery.length);
  const onNext = () => setIndex((i) => (i + 1) % gallery.length);

  return (
    <section id="gallery" className="relative px-6 sm:px-12 py-32 overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 -left-20 w-[420px] h-[420px] rounded-full bg-blood/40 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[360px] h-[360px] rounded-full bg-red/20 blur-[120px]" />
      <SectionHeader index="03" label="GALLERY" />

      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-8 lg:grid-cols-12 auto-rows-[minmax(180px,auto)] gap-4"
      >
        {gallery.map((g, i) => (
          <button
            key={g.src}
            data-tile
            data-cursor="hover"
            type="button"
            onClick={() => setIndex(i)}
            style={{ gridColumn: `span ${g.col}`, gridRow: `span ${g.row}` }}
            className="group relative overflow-hidden bg-fg/5 ring-0 hover:ring-2 hover:ring-red/70 transition-all"
          >
            <RevealImage
              src={g.src}
              alt={g.alt}
              direction={i % 2 === 0 ? 'top' : 'bottom'}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute right-3 top-3 font-body text-xs tracking-[0.3em] text-fg/0 group-hover:text-spark bg-bg/0 group-hover:bg-bg/70 px-2 py-1 transition-all">
              {String(i + 1).padStart(3, '0')} / {String(gallery.length).padStart(3, '0')}
            </span>
            <span className="absolute left-0 bottom-0 right-0 h-1 bg-gradient-to-r from-blood via-crimson to-red scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
          </button>
        ))}
      </div>

      <Lightbox
        images={gallery}
        index={index}
        onClose={() => setIndex(null)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </section>
  );
}
