import { useLayoutEffect, useRef } from 'react';
import { revealOnEnter } from '../lib/reveal.js';
import GraffitiPressure from './GraffitiPressure.jsx';

export default function SectionDivider({ text, height = '20vh' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const st = revealOnEnter(ref.current, {
      y: 20,
      duration: 0.95,
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
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-fg/25" />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-fg/25" />

      <div className="relative w-full max-w-[640px]" style={{ height: 'clamp(56px, 8vh, 96px)' }}>
        <GraffitiPressure
          text={text}
          minFontSize={32}
          maxScale={1.5}
          minScale={0.9}
        />
      </div>
    </div>
  );
}
