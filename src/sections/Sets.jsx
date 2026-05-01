import { useEffect, useRef, useState } from 'react';
import SetRow from './SetRow.jsx';
import { sets } from '../data/sets.js';

export default function Sets() {
  const [openId, setOpenId] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onEnter = () => { document.body.dataset.cursorContext = 'glitch'; };
    const onLeave = () => { delete document.body.dataset.cursorContext; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section
      id="sets"
      ref={sectionRef}
      data-cursor="glitch"
      className="relative px-6 py-24 sm:px-12 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(ellipse_at_center,rgba(122,0,25,0.18),transparent_74%)] blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 h-[400px] w-[400px] rounded-full bg-red/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-[300px] w-[300px] rounded-full bg-blood/30 blur-[100px]" />
      <div className="relative">
        {sets.map((s, i) => (
          <SetRow
            key={s.id}
            set={s}
            index={i}
            expanded={openId === s.id}
            onToggle={() => setOpenId((id) => (id === s.id ? null : s.id))}
          />
        ))}
      </div>
    </section>
  );
}
