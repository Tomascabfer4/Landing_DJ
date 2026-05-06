import { useLayoutEffect, useRef } from 'react';
import { revealOnEnter } from '../lib/reveal.js';
import GraffitiPressure from './GraffitiPressure.jsx';

export default function SectionDivider({ text, height = 'clamp(120px, 14vh, 170px)' }) {
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
      className="relative z-40 isolate w-full overflow-visible"
      style={{ height }}
      aria-hidden="true"
    >
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-fg/15 to-transparent" />

      <div className="pointer-events-none absolute left-12 top-1/2 hidden -translate-y-1/2 font-body text-[10px] tracking-[0.6em] text-fg/35 md:block">
        // SECTION
      </div>
      <div className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 font-body text-[10px] tracking-[0.6em] text-red/55 md:block">
        K1D / T0M1
      </div>

      <div className="relative flex h-full items-center justify-center px-6 py-6 md:px-32 md:py-8">
        <div className="relative w-full max-w-[620px] drop-shadow-[0_0_20px_rgba(255,45,45,0.18)]" style={{ height: 'clamp(48px, 7vh, 80px)' }}>
          <GraffitiPressure
            text={text}
            flex={false}
            minFontSize={24}
            maxFontSize={76}
            maxScale={1.16}
            minScale={0.96}
            letterSpacing="0.12em"
          />
        </div>
      </div>
    </div>
  );
}
