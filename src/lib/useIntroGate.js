// src/lib/useIntroGate.js
import { useEffect, useState } from 'react';

const listeners = new Set();
let ready = false;

export function setIntroReady(value) {
  ready = value;
  listeners.forEach((l) => l(value));
}

export function getIntroReady() {
  return ready;
}

export function useIntroGate() {
  const [r, setR] = useState(ready);
  useEffect(() => {
    listeners.add(setR);
    return () => listeners.delete(setR);
  }, []);
  return r;
}
