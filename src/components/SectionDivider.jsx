import { useLayoutEffect, useRef } from 'react';
import { revealOnEnter } from '../lib/reveal.js';
import GraffitiPressure from './GraffitiPressure.jsx';

export default function SectionDivider({ text, height = '32vh' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const st = revealOnEnter(ref.current, {
      y: 20,
      duration: 0.95,
      start: 'top 90%',
    });
    return () => st?.kill();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blood/30 to-transparent" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[55%] bg-bg/85 backdrop-blur-sm" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/60 to-transparent" />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0">
        <div className="absolute -top-[14%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red to-transparent opacity-90" />
        <div className="absolute -bottom-[14%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red to-transparent opacity-90" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/60 to-transparent" />

      <div className="pointer-events-none hidden md:block absolute top-1/2 left-12 -translate-y-1/2 font-body text-fg/40 text-[10px] tracking-[0.6em]">
        // SECTION
      </div>
      <div className="pointer-events-none hidden md:block absolute top-1/2 right-12 -translate-y-1/2 font-body text-red/60 text-[10px] tracking-[0.6em]">
        K1D · T0M1
      </div>

      <div className="relative h-full flex items-center justify-center px-6 md:px-32">
        <div className="relative w-full max-w-[680px]" style={{ height: 'clamp(64px, 9vh, 110px)' }}>
          <GraffitiPressure
            text={text}
            minFontSize={36}
            maxScale={1.55}
            minScale={0.88}
          />
        </div>
      </div>
    </div>
  );
}
