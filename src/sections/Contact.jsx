import { useState } from 'react';
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
    <section id="contact" className="relative overflow-hidden px-6 py-24 sm:px-12 sm:py-28 lg:overflow-visible">
      <div className="pointer-events-none absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full bg-red/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blood/30 blur-[120px]" />

      <div className="relative grid items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <h2 className="max-w-[7.5ch] font-display text-[clamp(2.8rem,8vw,8.5rem)] uppercase leading-[0.9] sm:max-w-[8.5ch]">
            {HEADLINE.map((line, i) => {
              const colors = ['text-fg', 'bg-gradient-to-r from-red via-crimson to-blood bg-clip-text text-transparent', 'text-spark'];
              return <span key={i} className={`block ${colors[i % colors.length]}`}>{line}</span>;
            })}
          </h2>

          <MagneticButton
            as="button"
            type="button"
            onClick={copyEmail}
            className="self-start font-body text-2xl tracking-widest text-red transition-colors hover:text-spark"
          >
            {EMAIL} -&gt;
          </MagneticButton>
          {status === 'copied' && (
            <span className="font-body text-xs tracking-[0.4em] text-spark">COPIED</span>
          )}

          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  data-cursor="hover"
                  className="border-b border-transparent font-body text-sm tracking-[0.4em] text-fg/70 transition-colors hover:border-red hover:text-red"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 pt-2">
          {[
            { name: 'name', label: 'NAME', type: 'text' },
            { name: 'email', label: 'EMAIL', type: 'email' },
            { name: 'event', label: 'EVENT', type: 'text' },
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
                  className="resize-none border-b border-fg/30 bg-transparent py-2 font-body outline-none focus:border-cyan"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={onChange}
                  className="border-b border-fg/30 bg-transparent py-2 font-body outline-none focus:border-cyan"
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
            className="mt-4 self-start border border-cyan px-8 py-4 font-body text-sm uppercase tracking-[0.4em] text-cyan transition-colors hover:bg-cyan hover:text-bg"
          >
            Send -&gt;
          </MagneticButton>

          {status === 'sent' && (
            <span className="font-body text-xs tracking-[0.4em] text-cyan">SENT - TALK SOON</span>
          )}
        </form>
      </div>

      <footer className="mt-24 flex flex-col items-start justify-between gap-4 border-t border-fg/10 pt-8 sm:flex-row sm:items-center">
        <span className="font-body text-xs tracking-[0.4em] text-fg/40">(c) K1D T0M1 - {new Date().getFullYear()}</span>
        <span className="font-body text-xs tracking-[0.4em] text-fg/40">MORE THAN MUSIC / AN EXPERIENCE</span>
      </footer>
    </section>
  );
}
