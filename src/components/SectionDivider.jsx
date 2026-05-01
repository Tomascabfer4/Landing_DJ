import { useLayoutEffect, useRef } from 'react';
import { revealOnEnter } from '../lib/reveal.js';
import TextPressure from './TextPressure.jsx';

export default function SectionDivider({ text, height = '32vh' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const st = revealOnEnter(ref.current, {
      y: 24,
      duration: 1.0,
      start: 'top 92%',
    });
    return () => st?.kill();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full flex items-center justify-center px-6 sm:px-12"
      style={{ height }}
      aria-hidden="true"
    >
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-fg/25" />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-fg/25" />

      <div className="relative w-full max-w-[1100px]" style={{ height: 'clamp(110px, 18vh, 200px)' }}>
        <TextPressure
          text={text}
          flex
          alpha={false}
          stroke={false}
          width
          weight
          italic
          textColor="#f5f5f7"
          strokeColor="#ff2d2d"
          minFontSize={42}
        />
      </div>
    </div>
  );
}
