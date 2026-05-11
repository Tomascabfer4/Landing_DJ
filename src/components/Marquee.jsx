import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

export default function Marquee({
  text,
  direction = 'left',
  speed = 60,
  rotate = 0,
  className = '',
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const isVertical = direction === 'up' || direction === 'down';
    const dim = isVertical ? track.offsetHeight / 2 : track.offsetWidth / 2;
    const sign = direction === 'left' || direction === 'up' ? -1 : 1;
    const prop = isVertical ? 'y' : 'x';

    const tween = gsap.fromTo(
      track,
      { [prop]: 0 },
      {
        [prop]: sign * dim,
        duration: speed,
        ease: 'none',
        repeat: -1,
      }
    );
    return () => tween.kill();
  }, [direction, speed, text]);

  const items = Array.from({ length: 2 }, (_, i) => (
    <span key={i} className="inline-block whitespace-nowrap px-[0.5em]">
      {text}
    </span>
  ));

  const isVertical = direction === 'up' || direction === 'down';

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className={isVertical ? 'flex flex-col' : 'flex flex-row'}
        style={{ willChange: 'transform' }}
      >
        {items}
      </div>
    </div>
  );
}
