import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { revealOnEnter } from '../lib/reveal.js';
import { Play, X } from 'lucide-react';

const ACCENTS = ['text-red', 'text-crimson', 'text-spark', 'text-ember', 'text-blood'];

export default function SetRow({ set, expanded, onToggle, index = 0 }) {
  const rowRef = useRef(null);
  const titleRef = useRef(null);
  const accent = ACCENTS[index % ACCENTS.length];

  useLayoutEffect(() => {
    const st = revealOnEnter(rowRef.current, { y: 28, duration: 0.95, start: 'top 90%' });
    return () => st?.kill();
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

  const scUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(set.soundcloudUrl)}&color=%23ff2d2d&auto_play=true`;

  return (
    <div ref={rowRef} className="border-t border-fg/15 last:border-b last:border-fg/15">
      <button
        type="button"
        onClick={onToggle}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        data-cursor="hover"
        aria-expanded={expanded}
        className={`group relative grid w-full grid-cols-12 gap-3 overflow-hidden px-2 py-6 transition-colors sm:items-center sm:gap-4 sm:py-8 ${expanded ? 'bg-magenta/10' : 'hover:bg-fg/5'}`}
      >
        <span className="absolute inset-y-0 left-0 origin-top scale-y-0 bg-gradient-to-b from-red via-crimson to-blood transition-transform duration-500 group-hover:scale-y-100 w-1" />
        <span className={`col-span-3 font-body text-xs tracking-[0.25em] sm:col-span-1 sm:text-sm sm:tracking-widest ${accent}`}>#{set.id}</span>
        <span
          ref={titleRef}
          className={`col-span-9 font-display text-[clamp(1.45rem,8vw,3.5rem)] leading-none text-left transition-colors sm:col-span-6 ${expanded ? accent : `text-fg group-hover:${accent}`}`}
        >
          {set.title}
        </span>
        <span className="col-span-9 col-start-4 row-start-2 font-body text-[11px] tracking-[0.28em] text-fg/60 sm:col-span-3 sm:col-start-auto sm:row-start-auto sm:text-sm sm:tracking-widest">
          <span className="text-red">{set.bpm}</span> BPM / <span className="text-spark">{set.duration}</span> MIN
        </span>
        <span className="col-span-12 row-start-3 flex items-center justify-end gap-2 font-body text-xs tracking-[0.3em] sm:col-span-2 sm:row-start-auto sm:text-sm sm:tracking-widest">
          {expanded ? <X size={18} /> : <Play size={18} />}
          {expanded ? 'CLOSE' : 'PLAY'}
        </span>
      </button>

      {expanded && (
        <div className="px-2 pb-8 pt-1">
          <iframe
            title={`${set.title} - SoundCloud`}
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
