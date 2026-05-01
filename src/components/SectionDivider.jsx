import { useLayoutEffect, useRef } from 'react';
import { revealOnEnter } from '../lib/reveal.js';
import GraffitiPressure from './GraffitiPressure.jsx';

export default function SectionDivider({ text, height = 'clamp(170px, 22vh, 240px)' }) {
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
      className="relative z-40 isolate -my-3 w-full overflow-hidden sm:-my-4 md:overflow-visible"
      style={{ height }}
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg via-blood/22 to-transparent md:-top-10 md:h-28 md:from-transparent md:via-blood/18 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg via-blood/20 to-transparent md:-bottom-10 md:h-28 md:from-transparent md:via-blood/16 md:to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[84px] w-[min(78vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,45,45,0.18),rgba(122,0,25,0.08)_54%,transparent_76%)] blur-2xl md:h-[104px]" />

      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-red/30 to-transparent" />
      <div className="absolute left-12 right-12 top-[calc(50%-2.9rem)] h-px bg-gradient-to-r from-transparent via-fg/8 to-transparent" />
      <div className="absolute left-12 right-12 top-[calc(50%+2.9rem)] h-px bg-gradient-to-r from-transparent via-red/14 to-transparent" />

      <div className="pointer-events-none absolute left-12 top-1/2 hidden -translate-y-1/2 font-body text-[10px] tracking-[0.6em] text-fg/35 md:block">
        // SECTION
      </div>
      <div className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 font-body text-[10px] tracking-[0.6em] text-red/55 md:block">
        K1D / T0M1
      </div>

      <div className="relative flex h-full items-center justify-center px-6 py-8 md:px-32 md:py-10">
        <div className="relative w-full max-w-[620px] drop-shadow-[0_0_20px_rgba(255,45,45,0.18)]" style={{ height: 'clamp(52px, 8vh, 92px)' }}>
          <GraffitiPressure
            text={text}
            flex={false}
            minFontSize={24}
            maxFontSize={84}
            maxScale={1.18}
            minScale={0.96}
            letterSpacing="0.12em"
          />
        </div>
      </div>
    </div>
  );
}
