import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { Play, X } from 'lucide-react';

export default function SetRow({ set, expanded, onToggle }) {
  const rowRef = useRef(null);
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.from(el, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    });
    return () => st.kill();
  }, []);

  const scUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(set.soundcloudUrl)}&color=%2300f0ff&auto_play=true`;

  return (
    <div ref={rowRef} className="border-t border-fg/15 last:border-b last:border-fg/15">
      <button
        type="button"
        onClick={onToggle}
        data-cursor="hover"
        aria-expanded={expanded}
        className="group w-full grid grid-cols-12 items-center gap-4 py-8 px-2 hover:bg-magenta/5 transition-colors"
      >
        <span className="col-span-2 sm:col-span-1 font-body text-cyan text-sm tracking-widest">#{set.id}</span>
        <span className="col-span-7 sm:col-span-6 font-display text-[clamp(1.5rem,4vw,3.5rem)] leading-none text-left group-hover:text-magenta transition-colors">
          {set.title}
        </span>
        <span className="hidden sm:block sm:col-span-3 font-body text-fg/60 tracking-widest text-sm">
          {set.bpm} BPM · {set.duration} MIN
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
