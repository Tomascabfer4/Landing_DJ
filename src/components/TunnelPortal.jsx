import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import GraffitiPressure from './GraffitiPressure.jsx';
import SectionDivider from './SectionDivider.jsx';

/**
 * Tunnel portal: a pre-rendered red letter tunnel image scales, rotates and
 * blurs into the camera as the user scrolls, dissolving to reveal the
 * children section (About) behind it. The word "ABOUT" sits in the dead
 * center of the tunnel and zooms with it.
 *
 * Animation values mirror the reference (`tunnel-fullscreen.png`) flow:
 * 1.0 → 1.12 (settle), 1.52 (advance), 3.4 + drift (zoom-through),
 * 9.2 + opacity 0 + heavy blur (dissolve).
 */
export default function TunnelPortal({
  src = '/images/tunnel.png',
  mobileSrc = '/images/tunnel-mobile.png',
  label = 'ABOUT',
  children,
}) {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const labelRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const label = labelRef.current;
    if (!wrap || !stage || !scene) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia?.('(min-width: 768px)').matches ?? false;

    if (reduce || !desktop) {
      // Mobile / reduced-motion: tunnel becomes a static hero image, the
      // children section flows below normally without any pin or scrub.
      gsap.set(scene, { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, filter: 'none' });
      if (label) gsap.set(label, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(scene, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.92,
        opacity: 0,
        filter: 'blur(8px) brightness(0.7)',
        transformOrigin: '50% 50%',
        force3D: true,
      });
      if (label) {
        gsap.set(label, { opacity: 0, scale: 0.96, y: 16 });
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=2600',
          scrub: 0.55,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0 → 0.12 : fade-in from Intro to soften abrupt color jump
      tl.to(
        scene,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px) brightness(1)',
          duration: 0.12,
          ease: 'power1.out',
        },
        0
      );
      if (label) {
        tl.to(
          label,
          { opacity: 1, scale: 1, y: 0, duration: 0.14, ease: 'power2.out' },
          0
        );
      }

      tl.to(scene, { scale: 1.12, rotate: 7, duration: 0.13 }, 0.12)
        .to(
          scene,
          {
            scale: 1.52,
            rotate: 15,
            filter: 'blur(0px) brightness(0.82)',
            duration: 0.36,
          },
          0.25
        )
        .to(
          scene,
          {
            scale: 3.4,
            rotate: 22,
            x: '18vw',
            y: '-3vh',
            opacity: 0.32,
            filter: 'blur(6px) brightness(0.46)',
            duration: 0.28,
          },
          0.68
        )
        .to(
          scene,
          {
            scale: 9.2,
            rotate: 29,
            x: '42vw',
            y: '-6vh',
            opacity: 0,
            filter: 'blur(20px) brightness(0.12)',
            duration: 0.22,
          },
          0.94
        );

      // label stays centered while the tunnel zooms past, then fades out near
      // the end so it doesn't sit awkwardly over the dissolved tunnel
      if (label) {
        tl.to(
          label,
          { opacity: 0, scale: 0.92, duration: 0.18, ease: 'power2.in' },
          0.78
        );
      }

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="relative w-full" aria-label={label}>
      {/* DESKTOP: pinned hero with scrubbed tunnel + GraffitiPressure label */}
      <div
        ref={stageRef}
        className="hero relative hidden h-screen w-full overflow-hidden bg-bg md:block"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[40] h-40 bg-gradient-to-b from-bg via-bg/70 to-transparent" />

        <div
          ref={sceneRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: '50% 50%' }}
        >
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            draggable={false}
          />
        </div>

        <div className="absolute inset-0 z-[35] flex items-center justify-center">
          <div
            ref={labelRef}
            className="relative w-full max-w-[620px] px-6 drop-shadow-[0_0_30px_rgba(255,45,45,0.6)]"
            style={{ height: 'clamp(60px, 9vh, 110px)' }}
          >
            <GraffitiPressure
              text={label}
              flex={false}
              minFontSize={32}
              maxFontSize={96}
              maxScale={1.2}
              minScale={0.96}
              letterSpacing="0.06em"
            />
          </div>
        </div>
      </div>

      {/* MOBILE: image fits naturally (full width, auto height) so it shows
          completely, followed by the same SectionDivider used by LIVE / SETS
          / BOOKING for the ABOUT label, then the children section */}
      <div className="md:hidden">
        <div className="relative w-full bg-bg">
          <img
            src={mobileSrc}
            alt=""
            aria-hidden="true"
            className="block h-auto w-full select-none"
            draggable={false}
          />
        </div>
        <SectionDivider text={label} />
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
