import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap.js';
import { useLenis } from '../../lib/lenis.jsx';
import { setIntroReady } from '../../lib/useIntroGate.js';
import Counter from './Counter.jsx';
import GraffitiBar from './GraffitiBar.jsx';

export default function Intro() {
  const [phase, setPhase] = useState('counting');
  const [progress, setProgress] = useState(0);

  const curtainLRef = useRef(null);
  const curtainRRef = useRef(null);
  const stackRef = useRef(null);

  const { unlock } = useLenis();

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setProgress(100);
      setPhase('open');
      setIntroReady(true);
      unlock();
    }
  }, [unlock]);

  const onCounterDone = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('open'); setIntroReady(true); unlock(); return; }

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('open');
        setIntroReady(true);
        unlock();
      },
    });

    tl.to(stackRef.current, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' });

    tl.to(curtainLRef.current, {
      xPercent: -101,
      duration: 1.2,
      ease: 'expo.inOut',
    }, '-=0.15');

    tl.to(curtainRRef.current, {
      xPercent: 101,
      duration: 1.2,
      ease: 'expo.inOut',
    }, '<');
  };

  const counting = phase === 'counting';

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full bg-red/40 blur-[160px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-32 w-[560px] h-[560px] rounded-full bg-crimson/45 blur-[170px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/3 w-[520px] h-[520px] rounded-full bg-blood/55 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-red/15 blur-[200px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[6] mix-blend-overlay opacity-[0.07]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 4px)',
      }} />

      {phase !== 'open' && (
        <div
          ref={stackRef}
          className="absolute inset-0 z-[30] flex flex-col items-center justify-center gap-6 px-6"
        >
          <img
            src="/images/logo-mark.png"
            alt="K1D TOM1"
            className="w-[clamp(180px,28vw,360px)] h-auto drop-shadow-[0_0_30px_rgba(255,45,45,0.55)]"
          />
          <Counter
            onComplete={onCounterDone}
            onProgress={setProgress}
            className="text-fg drop-shadow-[0_0_40px_rgba(255,45,45,0.55)]"
          />
          <GraffitiBar progress={progress} />
        </div>
      )}

      <div
        ref={curtainLRef}
        className="absolute top-0 left-0 h-full w-1/2 z-[20] overflow-hidden bg-bg"
        aria-hidden
      >
        <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-blood via-bg to-bg" />
        <div className="absolute inset-y-0 right-0 w-px bg-red/70" />
        <div className="absolute -top-16 -left-16 w-[420px] h-[420px] rounded-full bg-crimson/30 blur-[140px]" />
      </div>

      <div
        ref={curtainRRef}
        className="absolute top-0 right-0 h-full w-1/2 z-[20] overflow-hidden bg-bg"
        aria-hidden
      >
        <div className="absolute inset-0 opacity-60 bg-gradient-to-bl from-red via-bg to-bg" />
        <div className="absolute inset-y-0 left-0 w-px bg-red/70" />
        <div className="absolute -bottom-16 -right-16 w-[420px] h-[420px] rounded-full bg-red/30 blur-[140px]" />
      </div>
    </section>
  );
}
