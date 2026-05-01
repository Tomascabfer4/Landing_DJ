import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap.js';
import { useLenis } from '../../lib/lenis.jsx';
import { setIntroReady } from '../../lib/useIntroGate.js';
import Counter from './Counter.jsx';
import DiagonalMarquees from './DiagonalMarquees.jsx';
import LogoMark from './LogoMark.jsx';
import GraffitiBar from './GraffitiBar.jsx';

export default function Intro() {
  const [phase, setPhase] = useState('counting');
  const [progress, setProgress] = useState(0);

  const curtainLRef = useRef(null);
  const curtainRRef = useRef(null);
  const counterStackRef = useRef(null);
  const taglineRef = useRef(null);
  const hintRef = useRef(null);
  const stagePhotoRef = useRef(null);

  const { unlock } = useLenis();

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setProgress(100);
      setPhase('done');
      setIntroReady(true);
      unlock();
    }
  }, [unlock]);

  const onCounterDone = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('reveal'); return; }

    const tl = gsap.timeline({ onComplete: () => setPhase('reveal') });

    tl.to(counterStackRef.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' });

    tl.to(curtainLRef.current, {
      xPercent: -101,
      duration: 1.05,
      ease: 'expo.inOut',
    }, '-=0.1');

    tl.to(curtainRRef.current, {
      xPercent: 101,
      duration: 1.05,
      ease: 'expo.inOut',
    }, '<');
  };

  const onLogoDone = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('done');
        setIntroReady(true);
        unlock();
      },
    });
    tl.from(taglineRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' });
    tl.from(hintRef.current, { opacity: 0, y: 10, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    if (stagePhotoRef.current) {
      tl.from(stagePhotoRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
      }, 0);
    }
  };

  useEffect(() => {
    if (phase !== 'done') return;
    const hint = hintRef.current;
    if (!hint) return;
    const tween = gsap.to(hint, { y: 6, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' });
    return () => tween.kill();
  }, [phase]);

  const onlyCounting = phase === 'counting';

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg">
      <div
        ref={stagePhotoRef}
        className="pointer-events-none absolute inset-0 grid place-items-end"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-red/30 blur-[160px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blood/40 blur-[180px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-crimson/25 blur-[140px]" />
        </div>
        <img
          src="/images/cutout/1_SinFondo.png"
          alt=""
          aria-hidden
          className="relative z-[2] max-h-[90vh] object-contain mix-blend-luminosity opacity-70 translate-y-4"
          style={{ filter: 'drop-shadow(0 0 80px rgba(255,45,45,0.35))' }}
        />
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-700 z-[3]"
        style={{ opacity: onlyCounting ? 0.5 : 0.18 }}
      >
        <DiagonalMarquees blur={onlyCounting ? 6 : 10} />
      </div>

      <div className="relative z-[10] grid h-full place-items-center px-6">
        {(phase === 'reveal' || phase === 'done') && (
          <div className="flex flex-col items-center gap-10 text-center">
            <LogoMark play onDone={phase === 'reveal' ? onLogoDone : undefined} />
            <div ref={taglineRef} className="font-body text-fg/80 tracking-[0.5em] text-xs sm:text-sm uppercase">
              <span className="text-spark">Más que música</span>
              <span className="mx-3 text-fg/40">·</span>
              <span className="text-red">Una experiencia</span>
            </div>
            {phase === 'done' && (
              <div ref={hintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-fg/70 font-body text-xs tracking-[0.4em]">
                SCROLL ↓
              </div>
            )}
          </div>
        )}
      </div>

      <div
        ref={curtainLRef}
        className="absolute top-0 left-0 h-full w-1/2 z-[20] bg-bg overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-blood via-bg to-bg" />
        <div className="absolute inset-y-0 right-0 w-px bg-red/60" />
        <div className="absolute -top-10 -left-10 w-[420px] h-[420px] rounded-full bg-crimson/20 blur-[120px]" />
        <div className="absolute bottom-12 left-12 font-graffiti text-fg/15" style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', transform: 'rotate(-90deg)', transformOrigin: 'left bottom' }}>
          K1D
        </div>
      </div>

      <div
        ref={curtainRRef}
        className="absolute top-0 right-0 h-full w-1/2 z-[20] bg-bg overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 opacity-40 bg-gradient-to-bl from-red via-bg to-bg" />
        <div className="absolute inset-y-0 left-0 w-px bg-red/60" />
        <div className="absolute -bottom-12 -right-10 w-[420px] h-[420px] rounded-full bg-red/25 blur-[120px]" />
        <div className="absolute top-12 right-12 font-graffiti text-fg/15" style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', transform: 'rotate(90deg)', transformOrigin: 'right top' }}>
          T0M1
        </div>
      </div>

      {onlyCounting && (
        <div ref={counterStackRef} className="absolute inset-0 z-[30] flex flex-col items-center justify-center gap-10 px-6">
          <Counter
            onComplete={onCounterDone}
            onProgress={setProgress}
            className="text-fg drop-shadow-[0_0_30px_rgba(255,45,45,0.35)]"
          />
          <GraffitiBar progress={progress} />
          <div className="font-body text-fg/40 text-[10px] sm:text-xs tracking-[0.6em] uppercase">
            Cargando experiencia · Hold tight
          </div>
        </div>
      )}
    </section>
  );
}
