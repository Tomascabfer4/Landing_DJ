import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { Play, X } from 'lucide-react';

const ACCENTS = ['text-magenta', 'text-cyan', 'text-lime', 'text-orange', 'text-purple'];

export default function SetRow({ set, expanded, onToggle, index = 0 }) {
  const rowRef = useRef(null);
  const titleRef = useRef(null);
  const accent = ACCENTS[index % ACCENTS.length];

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.from(el, {
        x: -60,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
      }),
    });
    return () => st.kill();
  }, []);

  const onMouseMove = (e) => {
    const t = titleRef.current;
    if (!t) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    gsap.to(t, { x: px, duration: 0.5, ease: 'power3.out' });
  };

  const onMouseLeave = () => {
    const t = titleRef.current;
    if (!t) return;
    gsap.to(t, { x: 0, duration: 0.6, ease: 'power3.out' });
  };

  const scUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(set.soundcloudUrl)}&color=%23ff00d4&auto_play=true`;

  return (
    <div ref={rowRef} className="border-t border-fg/15 last:border-b last:border-fg/15">
      <button
        type="button"
        onClick={onToggle}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        data-cursor="hover"
        aria-expanded={expanded}
        className={`group relative w-full grid grid-cols-12 items-center gap-4 py-8 px-2 overflow-hidden transition-colors ${expanded ? 'bg-magenta/10' : 'hover:bg-fg/5'}`}
      >
        <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-magenta via-purple to-cyan scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />
        <span className={`col-span-2 sm:col-span-1 font-body ${accent} text-sm tracking-widest`}>#{set.id}</span>
        <span
          ref={titleRef}
          className={`col-span-7 sm:col-span-6 font-display text-[clamp(1.5rem,4vw,3.5rem)] leading-none text-left transition-colors ${expanded ? accent : `text-fg group-hover:${accent}`}`}
        >
          {set.title}
        </span>
        <span className="hidden sm:block sm:col-span-3 font-body text-fg/60 tracking-widest text-sm">
          <span className="text-lime">{set.bpm}</span> BPM · <span className="text-yellow">{set.duration}</span> MIN
        </span>
        <span className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 font-body text-sm tracking-widest">
          {expanded ? <X size={18} /> : <Play size={18} />}
          {expanded ? 'CLOSE' : 'PLAY'}
        </span>
      </button>

      {expanded && (
        <div className="px-2 pb-8">
          <iframe
            title={`${set.title} — SoundCloud`}
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="0"
            allow="autoplay"
            src={scUrl}
          />
        </div>
      )}
    </div>
  );
}
