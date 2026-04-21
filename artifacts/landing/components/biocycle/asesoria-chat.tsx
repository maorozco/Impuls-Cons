'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface Source {
  doc_id: string;
  title: string;
  source: string;
  score: number;
  url?: string | null;
  excerpt?: string | null;
  excerpt_highlights?: string[];
}
interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: Source[];
  guardrail?: boolean;
  provider?: string;
  pending?: boolean;
}

const SUGGESTIONS = [
  {
    cat: 'Costos',
    q: '¿Cuánto cuesta un piloto de 90 días para 200 m³ de suelo?',
  },
  {
    cat: 'Seguridad',
    q: '¿Qué es BSL-1 y por qué sólo usan ese nivel de bioseguridad?',
  },
  {
    cat: 'Competencia',
    q: '¿En qué se diferencian de Carbios?',
  },
  {
    cat: 'Piloto',
    q: '¿Qué incluye el piloto $3K con lab aliado?',
  },
  {
    cat: 'Hidrocarburos',
    q: '¿Cómo degradan TPH en suelo arcilloso con pH bajo?',
  },
  {
    cat: 'Regulación',
    q: '¿Cumplen con la Res. 631/2015 de ANLA?',
  },
];

// Banned-phrase topics that should fire the pivot A+C guardrail
const BANNED_TOPICS = [
  /pl[aá]stico.*(playa|costa|mar|oc[eé]ano)/i,
  /(playa|costa|mar|oc[eé]ano).*pl[aá]stico/i,
  /limpiar (las )?playas/i,
  /degradar pl[aá]stico en (el )?ambiente/i,
];

// Chat and health calls go through Next.js proxy routes so the browser never
// needs to reach the ml-api directly (it lives on loopback in Replit prod).
// See app/api/rag/answer/route.ts and app/api/healthz/route.ts.
const HEALTH_URL = '/api/healthz';
const RAG_URL = '/api/rag/answer';

export function AsesoriaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ provider: string; online: boolean; latency?: number }>(
    { provider: 'cargando…', online: false },
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Load status on mount
  useEffect(() => {
    const t0 = Date.now();
    fetch(HEALTH_URL)
      .then((r) => r.json())
      .then((d) => setStatus({ provider: d.llm_provider ?? 'unknown', online: true, latency: Date.now() - t0 }))
      .catch(() => setStatus({ provider: 'offline', online: false }));
  }, []);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const send = async (prompt: string) => {
    const q = prompt.trim();
    if (!q || pending) return;

    const banned = BANNED_TOPICS.some((r) => r.test(q));
    const userMsg: Message = { role: 'user', text: q };
    const assistantStub: Message = { role: 'assistant', text: '', pending: true, guardrail: banned };

    setMessages((m) => [...m, userMsg, assistantStub]);
    setInput('');
    setPending(true);

    try {
      // Send last 12 messages as conversation history so the model keeps context
      // across follow-ups (e.g. "¿y a qué pH?" after "¿qué consorcio para TPH?").
      // We exclude the pending stub and the just-appended userMsg to avoid
      // duplicating the current question in the prompt.
      const history = messages
        .filter((m) => !m.pending && m.text)
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.text }));
      const r = await fetch(RAG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, locale: 'es', top_k: 4, history }),
        signal: AbortSignal.timeout(120000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const finalAssistant: Message = {
        role: 'assistant',
        text: data.text ?? '',
        sources: data.sources ?? [],
        provider: data.provider ?? status.provider,
        guardrail: banned,
      };
      setMessages((m) => [...m.slice(0, -1), finalAssistant]);
    } catch (err) {
      const fallback: Message = {
        role: 'assistant',
        text:
          banned
            ? 'Guardrail A+C activado. No proponemos degradación de plástico en ambiente abierto. Te puedo armar un flujo con biorreactor contenido si me das el volumen recolectado.'
            : `No pude conectarme al motor RAG (${err instanceof Error ? err.message : String(err)}). Intenta de nuevo en un momento — el backend puede estar reiniciándose.`,
        sources: [],
        guardrail: banned,
      };
      setMessages((m) => [...m.slice(0, -1), fallback]);
    } finally {
      setPending(false);
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = () => send(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-layout">
      <div className="chat-main">
        <div className="chat-head">
          <div>
            <div
              className="eyebrow"
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}
            >
              <span style={{ width: 18, height: 1, background: 'var(--forest-deep)', display: 'inline-block' }} />
              Asesoría IA · RAG sobre 61 documentos
            </div>
            <h1>
              Pregunta lo que <em>quieras</em> sobre biorremediación.
            </h1>
          </div>
          <div
            className={`status-banner ${!status.online ? 'warn' : ''}`}
            data-testid="status-banner"
          >
            {status.online
              ? `LLM · ${status.provider} · online${status.latency ? ` · ${status.latency} ms` : ''}`
              : 'Backend offline · usa ./scripts/dev.sh'}
          </div>
        </div>

        {messages.length === 0 && (
          <div className="sugg" data-testid="suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.q}
                className="sugg-card"
                onClick={() => send(s.q)}
                data-testid={`sugg-${s.cat.toLowerCase()}`}
              >
                <div className="s-cat">{s.cat}</div>
                <b>{s.q}</b>
              </button>
            ))}
          </div>
        )}

        <div data-testid="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === 'user' ? 'u' : 'a'}`}>
              <div className="av">{m.role === 'user' ? 'JM' : 'BC'}</div>
              <div className="body">
                <div className="meta">
                  <b>{m.role === 'user' ? 'Usuario' : 'BioCycle IA'}</b>
                  {m.role === 'assistant' && m.provider ? ` · ${m.provider}` : ''}
                  {m.pending ? ' · pensando…' : ''}
                </div>
                <div className="bubble">
                  {m.role === 'user' ? (
                    <span>{m.text}</span>
                  ) : m.pending ? (
                    <div className="skeleton" data-testid="skeleton">
                      <div className="line" style={{ width: '88%' }} />
                      <div className="line" style={{ width: '72%' }} />
                      <div className="line" style={{ width: '40%' }} />
                    </div>
                  ) : (
                    <>
                      {m.guardrail && (
                        <div className="guardrail" data-testid="guardrail">
                          <b>⚠ Guardrail activado · pivote A+C</b>
                          No proponemos degradación de plástico en ambientes abiertos (playa, ecosistemas marinos).
                          Eso rompe nuestra política de honestidad científica — la evidencia in‑situ para PET en campo
                          abierto no existe con rigor.
                        </div>
                      )}
                      <div className="md prose prose-sm biocycle-prose max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                          components={{
                            a: ({ href, children }) => (
                              <a href={href ?? '#'} target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                            table: ({ children }) => (
                              <div className="md-table-wrap">
                                <table>{children}</table>
                              </div>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote>
                                <span className="md-quote-mark">“</span>
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {m.text}
                        </ReactMarkdown>
                      </div>
                      {m.sources && m.sources.length > 0 && (
                        <details className="sources" open>
                          <summary>
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              width="14"
                              height="14"
                              style={{ color: 'var(--forest-deep)' }}
                            >
                              <path d="M4 19.5V4.5A1.5 1.5 0 015.5 3H19v18H5.5A1.5 1.5 0 014 19.5z" />
                              <path d="M8 7h8M8 11h8M8 15h5" />
                            </svg>
                            {m.sources.length} fuentes · TF-IDF retrieval
                            <svg
                              className="chev"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              width="14"
                              height="14"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </summary>
                          {m.sources.map((s, j) => (
                            <SourceCard key={s.doc_id} source={s} index={j + 1} />
                          ))}
                        </details>
                      )}
                      <div className="msg-actions">
                        <button className="ma-btn" onClick={() => send(m.text.slice(0, 200))}>
                          ↻ Regenerar
                        </button>
                        <button
                          className="ma-btn"
                          onClick={() => navigator.clipboard?.writeText(m.text)}
                        >
                          📋 Copiar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="composer">
          <div className="comp-in">
            <textarea
              ref={textareaRef}
              placeholder="Pregunta sobre microorganismos, contaminantes, papers del corpus, regulación LATAM/EU/USA…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={pending}
              data-testid="composer-input"
            />
            <button className="tool" title="Adjuntar datos de sitio" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.5V7a4 4 0 00-8 0v9a2.5 2.5 0 005 0V8" />
              </svg>
            </button>
            <button className="tool" title="Plantilla de pregunta" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 12h6M9 8h6M5 21V5a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
              </svg>
            </button>
            <button
              className="comp-send"
              title="Enviar"
              onClick={handleSubmit}
              disabled={pending || !input.trim()}
              data-testid="send-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <div className="comp-hint">
            Shift + ↵ para salto de línea · ⌘↵ para enviar · respuestas con citaciones a papers del corpus (61 docs).
          </div>
        </div>
      </div>

      <aside className="side">
        <div className="bc-img-wrap bc-side-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/biocycle/img/asesoria-corpus@2x.webp"
            alt="Red de 60 papers científicos conectados por hilos lima-verdes — visualización del corpus"
            className="bc-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          <div className="bc-caption">61 documentos · citaciones en vivo</div>
        </div>
        <div className="side-sect">
          <h4>Corpus activo · 61 docs</h4>
          <div className="corpus-item">
            <span>Papers peer-reviewed</span>
            <span className="ci-c">10</span>
          </div>
          <div className="corpus-item">
            <span>Consorcios validados</span>
            <span className="ci-c">33</span>
          </div>
          <div className="corpus-item">
            <span>Bases internas</span>
            <span className="ci-c">18</span>
          </div>
        </div>

        <div className="side-sect">
          <h4>Guardrails activos</h4>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            {[
              'No promete limpiar playas',
              'No dice "plástico desaparece"',
              'No cita AlphaFold comercial',
              'Sólo especies BSL-1 / GRAS',
              'Banned-phrase linter · post-gen',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--green-bright)' }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

/** Clickable source card — expands to reveal the literal passage that matched,
 * with query tokens wrapped in <mark>. Inspired by Perplexity / Elicit citation UIs. */
function SourceCard({ source, index }: { source: Source; index: number }) {
  const [open, setOpen] = useState(false);
  const hasExcerpt = Boolean(source.excerpt && source.excerpt.trim());
  const label =
    source.source === 'discoveries'
      ? 'Paper peer-reviewed'
      : source.source === 'consortia'
        ? 'Consorcio validado'
        : source.source === 'research_docs'
          ? 'Base de conocimiento interna'
          : source.source;
  const tag =
    source.source === 'discoveries'
      ? 'Paper'
      : source.source === 'consortia'
        ? 'Cons.'
        : 'Int.';
  return (
    <div className={`src-card ${open ? 'open' : ''}`} data-testid={`src-card-${source.doc_id}`}>
      <button
        type="button"
        className="src-card-head"
        onClick={() => hasExcerpt && setOpen((v) => !v)}
        aria-expanded={open}
        data-testid={`src-toggle-${index}`}
      >
        <span className="n">{index}</span>
        <div className="s-body">
          <b>{source.title}</b>
          <span>{label}</span>
        </div>
        <span className="s-tag">
          {tag} · {source.score.toFixed(2)}
        </span>
        {hasExcerpt && (
          <svg
            className={`chev ${open ? 'rot' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="14"
            height="14"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>
      {open && hasExcerpt && (
        <div className="src-excerpt" data-testid={`src-excerpt-${index}`}>
          <p>{renderWithHighlights(source.excerpt ?? '', source.excerpt_highlights ?? [])}</p>
          {source.url && (
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="src-open">
              Abrir fuente ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/** Wrap every occurrence of any `keyword` (case-insensitive) in <mark>.
 * Runs in a single pass via a combined regex so overlapping tokens don't
 * double-wrap. */
function renderWithHighlights(text: string, keywords: string[]): React.ReactNode {
  const clean = keywords.filter((k) => k && k.length >= 3);
  if (!clean.length) return text;
  const escaped = clean.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? (
      <mark key={i} className="src-hl">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
