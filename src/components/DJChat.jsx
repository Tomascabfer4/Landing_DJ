import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useLenis } from '../lib/lenis.jsx';
import { sets } from '../data/sets.js';
import { socials } from '../data/socials.js';

const WHATSAPP_BASE_URL = 'https://wa.me/34644969162';
const EMAIL = 'booking@k1dt0m1.com';

const CHAT_COPY = {
  title: 'Backstage AI',
  subtitle: 'Booking, sets, colaboraciones, sonido y cualquier duda antes de entrar en contacto.',
  statusReady: 'IA ONLINE',
  statusOffline: 'IA OFFLINE',
  intro:
    'Hola. Soy el asistente de K1D T0M1. Cuéntame qué estás preparando y te ayudo a aterrizar el siguiente paso.',
  promptLabel: 'Ideas para empezar',
  prompts: [
    'Quiero contratarte para un evento',
    'Quiero escuchar tus sets',
    'Necesito info para booking',
    'Quiero colaborar en música',
    'Dónde puedo seguirte',
  ],
  placeholder: 'Escribe tu mensaje...',
  send: 'Enviar',
  sending: 'Enviando...',
  error: 'La cabina ha fallado un momento. Prueba de nuevo o escríbeme por WhatsApp.',
};

function normalizeChatApiUrl(rawUrl) {
  if (!rawUrl) return '';

  try {
    const url = new URL(rawUrl);
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/chat';
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function createMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

function getMessageParts(content) {
  const parts = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > cursor) {
      parts.push({ type: 'text', text: content.slice(cursor, match.index) });
    }

    const label = match[1];
    const markdownUrl = match[2];
    const rawUrl = match[3];
    const url = markdownUrl || rawUrl;
    const trailing = rawUrl ? url.match(/[.,!?;:]+$/)?.[0] || '' : '';
    const href = trailing ? url.slice(0, -trailing.length) : url;

    parts.push({ type: 'link', text: label || href, href });
    if (trailing) parts.push({ type: 'text', text: trailing });
    cursor = match.index + match[0].length;
  }

  if (cursor < content.length) {
    parts.push({ type: 'text', text: content.slice(cursor) });
  }

  return parts;
}

function buildDjContext() {
  return {
    site: 'dj',
    identity: {
      artistName: 'K1D T0M1',
      role: 'DJ y productor',
      offer:
        'Experiencia musical y visual para sesiones, eventos, colaboraciones y bookings.',
    },
    booking: {
      email: EMAIL,
      whatsapp: WHATSAPP_BASE_URL,
    },
    sets: sets.map((set) => ({
      title: set.title,
      location: set.location,
      year: set.year,
      tags: set.tags,
      bpm: set.bpm,
    })),
    socials,
    links: {
      technicalPortfolio: 'https://portfolio-tomas.pages.dev/',
      djWebsite: 'https://landing-dj.pages.dev/',
    },
  };
}

function buildWhatsAppUrl(messages) {
  const summary = messages
    .filter((message) => message.role === 'user')
    .slice(-3)
    .map((message) => message.content)
    .join(' | ');
  const text = encodeURIComponent(
    summary
      ? `Hola Tomas, vengo de tu web DJ. Te escribo por esto: ${summary}`
      : 'Hola Tomas, vengo de tu web DJ y quiero hablar contigo.',
  );

  return `${WHATSAPP_BASE_URL}?text=${text}`;
}

function buildMailto(messages) {
  const summary = messages
    .filter((message) => message.role === 'user')
    .slice(-3)
    .map((message) => `- ${message.content}`)
    .join('\n');
  const subject = encodeURIComponent('Booking / consulta desde la web DJ');
  const body = encodeURIComponent(
    `Hola Tomas,\n\nVengo desde tu web DJ.\n\nResumen rapido:\n${summary || '- Quiero hablar contigo'}\n\nGracias.`,
  );

  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export default function DJChat() {
  const { lock, unlock } = useLenis();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [createMessage('assistant', CHAT_COPY.intro)]);
  const [input, setInput] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const chatApiUrl = normalizeChatApiUrl(import.meta.env.VITE_CHAT_API_URL || '');
  const isChatAvailable = Boolean(chatApiUrl);
  const context = useMemo(() => buildDjContext(), []);
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(messages), [messages]);
  const emailUrl = useMemo(() => buildMailto(messages), [messages]);

  useEffect(() => {
    if (!isOpen) {
      unlock();
      document.body.classList.remove('dj-chat-open');
      setIsPromptOpen(false);
      return;
    }

    lock();
    document.body.classList.add('dj-chat-open');
    window.setTimeout(() => inputRef.current?.focus(), 60);

    return () => {
      unlock();
      document.body.classList.remove('dj-chat-open');
    };
  }, [isOpen, lock, unlock]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  async function sendMessage(nextMessage) {
    const trimmed = nextMessage.trim();
    if (!trimmed || isLoading) return;

    const userMessage = createMessage('user', trimmed);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsPromptOpen(false);

    if (!isChatAvailable) {
      setMessages([
        ...nextMessages,
        createMessage('assistant', 'El chat IA todavia no esta conectado, pero puedes seguir por WhatsApp o email.'),
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'dj_landing',
          locale: 'es',
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          context,
        }),
      });

      if (!response.ok) throw new Error('chat_failed');
      const data = await response.json();
      const reply = (data.reply || '').trim();
      if (!reply) throw new Error('empty_reply');
      setMessages((current) => [...current, createMessage('assistant', reply)]);
    } catch {
      setError(CHAT_COPY.error);
    } finally {
      setIsLoading(false);
    }
  }

  function onComposerKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    sendMessage(input);
  }

  function selectPrompt(prompt) {
    setSelectedPrompt(prompt);
    sendMessage(prompt);
    window.setTimeout(() => setSelectedPrompt(''), 120);
  }

  return (
    <>
      <div className="dj-chat-floating" data-cursor="hover">
        <button type="button" className="dj-chat-fab dj-chat-fab-ai" onClick={() => setIsOpen(true)}>
          <span>Chat IA</span>
          <Sparkles size={20} strokeWidth={2.2} />
        </button>
        <a className="dj-chat-fab dj-chat-fab-wa" href={whatsappUrl} target="_blank" rel="noreferrer">
          <span>WhatsApp</span>
          <MessageCircle size={20} strokeWidth={2.2} />
        </a>
      </div>

      {isOpen && (
        <div className="dj-chat-shell" role="dialog" aria-modal="true">
          <button className="dj-chat-backdrop" type="button" aria-label="Cerrar chat" onClick={() => setIsOpen(false)} />
          <section className="dj-chat-panel" data-cursor="hover">
            <header className="dj-chat-header">
              <div>
                <p>CHAT IA</p>
                <h2>{CHAT_COPY.title}</h2>
                <span>{CHAT_COPY.subtitle}</span>
              </div>
              <div className="dj-chat-actions">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
                <a href={emailUrl}>Email</a>
                <strong>{isChatAvailable ? CHAT_COPY.statusReady : CHAT_COPY.statusOffline}</strong>
              </div>
              <button type="button" className="dj-chat-close" aria-label="Cerrar chat" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </header>

            <div className="dj-chat-prompts">
              <span>{CHAT_COPY.promptLabel}</span>
              <button
                type="button"
                className={`dj-chat-prompt-trigger ${isPromptOpen ? 'open' : ''}`}
                aria-expanded={isPromptOpen}
                onClick={() => setIsPromptOpen((open) => !open)}
              >
                <span>{selectedPrompt || CHAT_COPY.promptLabel}</span>
                <ChevronDown size={16} />
              </button>
              {isPromptOpen && (
                <div className="dj-chat-prompt-list">
                  {CHAT_COPY.prompts.map((prompt) => (
                    <button key={prompt} type="button" onClick={() => selectPrompt(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dj-chat-messages" data-lenis-prevent>
              {messages.map((message) => (
                <article key={message.id} className={`dj-chat-message ${message.role}`}>
                  <span>{message.role === 'assistant' ? 'K1D AI' : 'TU'}</span>
                  <p>
                    {getMessageParts(message.content).map((part, index) =>
                      part.type === 'link' ? (
                        <a key={`${message.id}-${index}`} href={part.href} target="_blank" rel="noreferrer">
                          {part.text}
                        </a>
                      ) : (
                        <span key={`${message.id}-${index}`}>{part.text}</span>
                      ),
                    )}
                  </p>
                </article>
              ))}
              {isLoading && (
                <article className="dj-chat-message assistant pending">
                  <span>K1D AI</span>
                  <p>Escuchando la pista...</p>
                </article>
              )}
              {error && (
                <article className="dj-chat-error">
                  <p>{error}</p>
                </article>
              )}
            </div>

            <form className="dj-chat-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onComposerKeyDown}
                placeholder={CHAT_COPY.placeholder}
                rows={3}
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Bot size={18} /> : <Send size={18} />}
                <span>{isLoading ? CHAT_COPY.sending : CHAT_COPY.send}</span>
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
