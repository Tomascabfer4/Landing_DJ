import Lenis from '@studio-freight/lenis';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger } from './gsap.js';

const LenisContext = createContext(null);

export function LenisProvider({ children, startLocked = true }) {
  const lenisRef = useRef(null);
  const [locked, setLocked] = useState(startLocked);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    if (startLocked) lenis.stop();

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [startLocked]);

  const lock = useCallback(() => { lenisRef.current?.stop(); setLocked(true); }, []);
  const unlock = useCallback(() => { lenisRef.current?.start(); setLocked(false); }, []);

  const value = useMemo(() => ({ lock, unlock, locked }), [lock, unlock, locked]);

  return (
    <LenisContext.Provider value={value}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error('useLenis must be used inside <LenisProvider>');
  return ctx;
}
