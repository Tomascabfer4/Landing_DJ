import { useEffect, useRef, useState } from 'react';
import SectionHeader from './SectionHeader.jsx';
import SetRow from './SetRow.jsx';
import { sets } from '../data/sets.js';

export default function Sets() {
  const [openId, setOpenId] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onEnter = () => document.body.dataset.cursorContext = 'glitch';
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
      className="relative px-6 sm:px-12 py-32"
    >
      <div className="pointer-events-none absolute top-20 right-10 w-[400px] h-[400px] rounded-full bg-red/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 left-10 w-[300px] h-[300px] rounded-full bg-blood/30 blur-[100px]" />
      <SectionHeader index="02" label="SETS" />
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
