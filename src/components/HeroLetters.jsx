import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';

/**
 * 3D tunnel portal that wraps the next section with the artist name on 4
 * walls (top / bottom / left / right). The portal is a sticky overlay: as the
 * user scrolls, the camera pulls back, rotates ~40deg clockwise, and the
 * walls fade — revealing the underlying section (passed as children) behind
 * the portal.
 *
 * Uses CSS `perspective` + per-wall rotateX/rotateZ + GSAP scrub. The
 * children render inside the same wrapper but are pulled up under the sticky
 * stage so they sit visually behind the walls during the animation.
 */
const REPEAT_LONG = 'K1D T0M1 · K1D T0M1 · K1D T0M1 · K1D T0M1';

export default function HeroLetters({ text = 'K1D T0M1', children }) {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const sceneRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const scene = sceneRef.current;
    if (!wrap || !scene) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      gsap.set(scene, { scale: 1, opacity: 0.25, rotate: 0 });
      return;
    }

    const tween = gsap.fromTo(
      scene,
      { scale: 2.4, opacity: 1, rotate: 0 },
      {
        scale: 0.4,
        opacity: 0,
        rotate: 40,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=120%',
          scrub: 0.6,
          pin: stageRef.current,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll().forEach((s) => {
        if (s.vars?.trigger === wrap) s.kill();
      });
    };
  }, []);

  const wallText = REPEAT_LONG;
  const wallClass =
    'absolute font-graffiti uppercase whitespace-nowrap text-red leading-[0.85] select-none';
  const baseStyle = {
    fontSize: 'clamp(8rem, 28vw, 26rem)',
    letterSpacing: '-0.03em',
    textShadow: '0 0 50px rgba(255,45,45,0.45)',
  };

  return (
    <section ref={wrapRef} aria-label={text} className="relative w-full">
      <div
        ref={stageRef}
        className="pointer-events-none absolute left-0 top-0 z-30 h-screen w-full overflow-hidden"
        style={{ perspective: '900px' }}
      >
        <div
          ref={sceneRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 50%' }}
        >
          {/* TOP wall */}
          <div
            className={wallClass}
            style={{
              ...baseStyle,
              top: '-4vh',
              left: '50%',
              transform: 'translateX(-50%) rotateX(60deg)',
              transformOrigin: 'center top',
            }}
          >
            {wallText}
          </div>

          {/* BOTTOM wall */}
          <div
            className={wallClass}
            style={{
              ...baseStyle,
              bottom: '-4vh',
              left: '50%',
              transform: 'translateX(-50%) rotateX(-60deg)',
              transformOrigin: 'center bottom',
            }}
          >
            {wallText}
          </div>

          {/* LEFT wall (vertical, reading bottom-to-top) */}
          <div
            className={wallClass}
            style={{
              ...baseStyle,
              top: '50%',
              left: '-4vw',
              transform: 'translateY(-50%) rotate(-90deg) rotateX(60deg)',
              transformOrigin: 'left center',
            }}
          >
            {wallText}
          </div>

          {/* RIGHT wall */}
          <div
            className={wallClass}
            style={{
              ...baseStyle,
              top: '50%',
              right: '-4vw',
              transform: 'translateY(-50%) rotate(90deg) rotateX(60deg)',
              transformOrigin: 'right center',
            }}
          >
            {wallText}
          </div>
        </div>

        {/* center vignette so tunnel reads as depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_22%,rgba(10,7,7,0.92)_82%)]" />
      </div>

      {/* underlying section (e.g. About) renders inside the wrapper so the
          sticky overlay above sits on top during the scroll-driven reveal */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
