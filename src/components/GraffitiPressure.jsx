import { useCallback, useEffect, useRef, useState } from 'react';

const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (fn, ms) => {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
};

export default function GraffitiPressure({
  text = 'TITLE',
  className = '',
  textColor = '#f5f5f7',
  fontFamily = '"Sweet Sucker Punch", cursive',
  minFontSize = 28,
  maxFontSize = Infinity,
  maxScale = 1.5,
  minScale = 0.9,
  letterSpacing = '0.04em',
  flex = true,
}) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);

  const chars = text.split('');

  useEffect(() => {
    const move = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const tmove = (e) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', tmove, { passive: true });
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = r.left + r.width / 2;
      mouseRef.current.y = r.top + r.height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', tmove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const widthSize = width / Math.max(chars.length / 1.6, 1);
    const heightSize = height > 0 ? height / Math.max(maxScale, 1) : Infinity;
    const newSize = Math.max(minFontSize, Math.min(widthSize, heightSize, maxFontSize));
    setFontSize(newSize);
  }, [chars.length, maxFontSize, maxScale, minFontSize]);

  useEffect(() => {
    const d = debounce(setSize, 100);
    d();
    window.addEventListener('resize', d);
    return () => window.removeEventListener('resize', d);
  }, [setSize]);

  useEffect(() => {
    let raf;
    const tick = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 14;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 14;
      if (titleRef.current) {
        const r = titleRef.current.getBoundingClientRect();
        const maxDist = r.width / 2;
        spansRef.current.forEach((s) => {
          if (!s) return;
          const sr = s.getBoundingClientRect();
          const c = { x: sr.x + sr.width / 2, y: sr.y + sr.height / 2 };
          const d = dist(mouseRef.current, c);
          const scale = getAttr(d, maxDist, minScale, maxScale);
          s.style.transform = `scale(${scale.toFixed(3)})`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [maxScale, minScale]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent' }}
    >
      <h2
        ref={titleRef}
        className={className}
        style={{
          fontFamily,
          fontSize,
          letterSpacing,
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          color: textColor,
          textTransform: 'uppercase',
          display: flex ? 'flex' : 'block',
          justifyContent: flex ? 'space-between' : 'center',
          alignItems: 'baseline',
          width: '100%',
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            style={{
              display: 'inline-block',
              transformOrigin: 'center',
              transition: 'transform 90ms ease-out',
              minWidth: ch === ' ' ? '0.45em' : undefined,
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </h2>
    </div>
  );
}
