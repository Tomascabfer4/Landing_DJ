import { gsap, ScrollTrigger } from './gsap.js';

const prefersReduce = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function revealOnEnter(el, opts = {}) {
  if (!el) return null;
  const {
    y = 28,
    x = 0,
    duration = 1.0,
    ease = 'power2.out',
    delay = 0,
    start = 'top 88%',
  } = opts;

  if (prefersReduce()) {
    gsap.set(el, { opacity: 1, y: 0, x: 0 });
    return null;
  }

  gsap.set(el, { opacity: 0, y, x, willChange: 'transform, opacity' });

  return ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () =>
      gsap.to(el, {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        ease,
        delay,
        overwrite: 'auto',
        onComplete: () => gsap.set(el, { willChange: 'auto' }),
      }),
  });
}

export function revealChildren(parent, opts = {}) {
  if (!parent) return null;
  const children = parent.children;
  if (!children || children.length === 0) return null;

  const {
    y = 22,
    duration = 0.85,
    ease = 'power2.out',
    stagger = 0.08,
    start = 'top 90%',
  } = opts;

  if (prefersReduce()) {
    gsap.set(children, { opacity: 1, y: 0 });
    return null;
  }

  gsap.set(children, { opacity: 0, y, willChange: 'transform, opacity' });

  return ScrollTrigger.create({
    trigger: parent,
    start,
    once: true,
    onEnter: () =>
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        overwrite: 'auto',
        onComplete: () => gsap.set(children, { willChange: 'auto' }),
      }),
  });
}
