import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap.js';
import { useLenis } from '../../lib/lenis.jsx';
import { setIntroReady } from '../../lib/useIntroGate.js';
import Counter from './Counter.jsx';
import DiagonalMarquees from './DiagonalMarquees.jsx';
import LogoMark from './LogoMark.jsx';

export default function Intro() {
  const [phase, setPhase] = useState('counting');
  const flashRef = useRef(null);
  const counterWrapRef = useRef(null);
  const taglineRef = useRef(null);
  const hintRef = useRef(null);
  const { unlock } = useLenis();

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setPhase('done');
      setIntroReady(true);
      unlock();
    }
  }, [unlock]);

  const onCounterDone = () => {
    const flash = flashRef.current;
    const cw = counterWrapRef.current;
    if (!flash || !cw) { setPhase('reveal'); return; }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('reveal'); return; }

    gsap.timeline()
      .to(flash, { opacity: 1, duration: 0.06 })
      .to(flash, { opacity: 0, duration: 0.12 })
      .to(cw, { scale: 1.4, opacity: 0, duration: 0.25 }, '<')
      .add(() => setPhase('reveal'));
  };

  const onLogoDone = () => {
    const tagline = taglineRef.current;
    const hint = hintRef.current;
    gsap.timeline({
      onComplete: () => {
        setPhase('done');
        setIntroReady(true);
        unlock();
      },
    })
      .from(tagline, { opacity: 0, y: 20, duration: 0.8 })
      .from(hint, { opacity: 0, y: 10, duration: 0.6 }, '-=0.4');
  };

  useEffect(() => {
    if (phase !== 'done') return;
    const hint = hintRef.current;
    if (!hint) return;
    const tween = gsap.to(hint, { y: 6, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' });
    return () => tween.kill();
  }, [phase]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: phase === 'counting' ? 1 : 0.18 }}
      >
        <DiagonalMarquees blur={phase === 'counting' ? 4 : 8} />
      </div>

      <div className="relative z-10 grid h-full place-items-center">
        {phase === 'counting' && (
          <div ref={counterWrapRef} className="text-center text-fg">
            <Counter onComplete={onCounterDone} />
          </div>
        )}

        {(phase === 'reveal' || phase === 'done') && (
          <div className="flex flex-col items-center gap-12 text-center">
            <LogoMark play onDone={phase === 'reveal' ? onLogoDone : undefined} />
            <div ref={taglineRef} className="font-body text-fg/70 tracking-[0.5em] text-xs sm:text-sm uppercase">
              Más que música · Una experiencia
            </div>
            {phase === 'done' && (
              <div ref={hintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-fg/60 font-body text-xs tracking-[0.4em]">
                SCROLL ↓
              </div>
            )}
          </div>
        )}
      </div>

      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 bg-white opacity-0 z-20"
        aria-hidden="true"
      />
    </section>
  );
}
