import { describe, it, expect } from 'vitest';
import { validateContact } from './contact-validation.js';

describe('validateContact', () => {
  it('returns errors for empty fields', () => {
    const e = validateContact({ name: '', email: '', event: '', message: '' });
    expect(e.name).toBeTruthy();
    expect(e.email).toBeTruthy();
    expect(e.message).toBeTruthy();
  });

  it('rejects malformed email', () => {
    const e = validateContact({ name: 'X', email: 'notanemail', event: '', message: 'Hi' });
    expect(e.email).toBeTruthy();
  });

  it('passes with a valid payload', () => {
    const e = validateContact({ name: 'X', email: 'a@b.co', event: 'club', message: 'Hi' });
    expect(Object.keys(e).length).toBe(0);
  });
});
