import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom reports `ontouchstart in window` as true, which trips touch-device
// guards in components. Force a non-touch environment for tests.
if (typeof window !== 'undefined' && 'ontouchstart' in window) {
  delete window.ontouchstart;
}
