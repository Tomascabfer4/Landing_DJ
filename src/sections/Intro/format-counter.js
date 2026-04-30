export const GLITCH_CHARS = ['#', '&', '%', '@', '?', '$', '*', '∆'];

export function formatCounter(n) {
  return String(Math.max(0, Math.min(100, Math.round(n)))).padStart(3, '0');
}

export function maybeGlitch(str, rng = Math.random) {
  // chance threshold: 0.08 of glitching
  if (rng() > 0.08) return str;
  const arr = str.split('');
  const idx = Math.floor(rng() * arr.length);
  const ch = GLITCH_CHARS[Math.floor(rng() * GLITCH_CHARS.length)];
  arr[idx] = ch;
  return arr.join('');
}
