import { useState } from 'react';
import SectionHeader from './SectionHeader.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import { socials } from '../data/socials.js';
import { validateContact } from './contact-validation.js';

const EMAIL = 'booking@k1dt0m1.com';
const HEADLINE = ['READY TO', 'EXPERIENCE', 'THE BEAT?'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', event: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validateContact(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStatus('sent');
      setForm({ name: '', email: '', event: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="relative px-6 sm:px-12 py-32 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-orange/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan/15 blur-[120px]" />
      <SectionHeader index="04" label="BOOKING" />

      <div className="relative grid lg:grid-cols-2 gap-16 items-start">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-[clamp(3rem,11vw,11rem)] leading-[0.85] uppercase">
            {HEADLINE.map((line, i) => {
              const colors = ['text-fg', 'bg-gradient-to-r from-magenta via-purple to-cyan bg-clip-text text-transparent', 'text-lime'];
              return <span key={i} className={`block ${colors[i % colors.length]}`}>{line}</span>;
            })}
          </h2>

          <MagneticButton
            as="button"
            type="button"
            onClick={copyEmail}
            className="self-start font-body text-cyan text-2xl tracking-widest hover:text-magenta transition-colors"
          >
            {EMAIL} →
          </MagneticButton>
          {status === 'copied' && (
            <span className="font-body text-xs tracking-[0.4em] text-magenta">COPIED</span>
          )}

          <ul className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  data-cursor="hover"
                  className="font-body text-sm tracking-[0.4em] text-fg/70 hover:text-cyan border-b border-transparent hover:border-cyan transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          {[
            { name: 'name',    label: 'NAME',    type: 'text' },
            { name: 'email',   label: 'EMAIL',   type: 'email' },
            { name: 'event',   label: 'EVENT',   type: 'text' },
            { name: 'message', label: 'MESSAGE', type: 'textarea' },
          ].map(({ name, label, type }) => (
            <label key={name} className="flex flex-col gap-2">
              <span className="font-body text-xs tracking-[0.4em] text-fg/60">{label}</span>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  rows={4}
                  value={form[name]}
                  onChange={onChange}
                  className="bg-transparent border-b border-fg/30 focus:border-cyan outline-none py-2 font-body resize-none"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={onChange}
                  className="bg-transparent border-b border-fg/30 focus:border-cyan outline-none py-2 font-body"
                />
              )}
              {errors[name] && (
                <span className="font-body text-xs text-magenta">{errors[name]}</span>
              )}
            </label>
          ))}

          <MagneticButton
            as="button"
            type="submit"
            className="self-start mt-4 font-body uppercase tracking-[0.4em] text-sm border border-cyan text-cyan px-8 py-4 hover:bg-cyan hover:text-bg transition-colors"
          >
            Send →
          </MagneticButton>

          {status === 'sent' && (
            <span className="font-body text-xs tracking-[0.4em] text-cyan">SENT — TALK SOON</span>
          )}
        </form>
      </div>

      <footer className="mt-32 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-fg/10 pt-8">
        <span className="font-body text-xs tracking-[0.4em] text-fg/40">© K1D T0M1 — {new Date().getFullYear()}</span>
        <span className="font-body text-xs tracking-[0.4em] text-fg/40">MORE THAN MUSIC · AN EXPERIENCE</span>
      </footer>
    </section>
  );
}
