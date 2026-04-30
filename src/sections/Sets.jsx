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
      <SectionHeader index="02" label="SETS" />
      <div>
        {sets.map((s) => (
          <SetRow
            key={s.id}
            set={s}
            expanded={openId === s.id}
            onToggle={() => setOpenId((id) => (id === s.id ? null : s.id))}
          />
        ))}
      </div>
    </section>
  );
}
