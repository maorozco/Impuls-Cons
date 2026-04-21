/**
 * LLM provider abstraction — supports Anthropic (prod) and OpenRouter (dev).
 *
 * Resolution order:
 *   LLM_PROVIDER=anthropic  → require ANTHROPIC_API_KEY
 *   LLM_PROVIDER=openrouter → require OPENROUTER_API_KEY
 *   LLM_PROVIDER=auto (or unset) → prefer Anthropic if key present, else OpenRouter
 *
 * In FIXTURE_MODE, the stub is used regardless — enables offline dev/CI.
 *
 * OpenRouter is API-compatible with OpenAI, so we call it via `fetch`
 * (no SDK needed) to avoid pulling in a second client library.
 */

import Anthropic from '@anthropic-ai/sdk';
import { LLM_MOCK_MODE, log } from './config';

export type Provider = 'anthropic' | 'openrouter' | 'ollama' | 'none';

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';

export function getProvider(): Provider {
  const pref = (process.env.LLM_PROVIDER ?? 'auto').toLowerCase();
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY?.trim();
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY?.trim();
  const hasOllama = process.env.OLLAMA_ENABLED !== 'false';

  if (pref === 'anthropic' && hasAnthropic) return 'anthropic';
  if (pref === 'openrouter' && hasOpenRouter) return 'openrouter';
  if (pref === 'ollama' && hasOllama) return 'ollama';
  if (pref === 'auto') {
    if (hasAnthropic) return 'anthropic';
    if (hasOpenRouter) return 'openrouter';
    if (hasOllama) return 'ollama';
  }
  return 'none';
}

/** Full resolution chain for callLlm — primary first, fallbacks in order. */
function getProviderChain(): Provider[] {
  const primary = getProvider();
  const chain: Provider[] = [];
  if (primary !== 'none') chain.push(primary);
  // Add any other available providers as fallback (skip duplicates + explicit pref)
  const pref = (process.env.LLM_PROVIDER ?? 'auto').toLowerCase();
  if (pref !== 'auto' && process.env.LLM_NO_FALLBACK === 'true') return chain;

  const candidates: Provider[] = ['anthropic', 'openrouter', 'ollama'];
  for (const c of candidates) {
    if (chain.includes(c)) continue;
    if (c === 'anthropic' && !process.env.ANTHROPIC_API_KEY?.trim()) continue;
    if (c === 'openrouter' && !process.env.OPENROUTER_API_KEY?.trim()) continue;
    if (c === 'ollama' && process.env.OLLAMA_ENABLED === 'false') continue;
    chain.push(c);
  }
  return chain;
}

export function isLlmMock(): boolean {
  return LLM_MOCK_MODE || getProvider() === 'none';
}

let anthropicClient: Anthropic | undefined;

export function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' });
  }
  return anthropicClient;
}

export interface LlmMessage {
  system: string;
  user: string;
  maxTokens?: number;
  modelHint?: 'classifier' | 'synthesizer' | 'feeder' | 'chat';
  cacheSystem?: boolean; // Anthropic only
}

/**
 * Shared wrapper — call whichever provider is active and return the text.
 * Iterates the provider chain so a transient failure (rate limit, 5xx,
 * network) falls through to the next available backend automatically.
 * Final fallback is '' which callers treat as "use the stub".
 */
export async function callLlm(
  msg: LlmMessage,
  defaultAnthropicModel: string,
): Promise<string> {
  const chain = getProviderChain();
  for (const provider of chain) {
    try {
      const text = await callOneProvider(provider, msg, defaultAnthropicModel);
      if (text.trim().length > 0) return text;
      log('warn', `[llm] ${provider} returned empty — trying next`);
    } catch (err) {
      log('warn', `[llm] ${provider} threw — trying next`, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return '';
}

async function callOneProvider(
  provider: Provider,
  msg: LlmMessage,
  defaultAnthropicModel: string,
): Promise<string> {
  if (provider === 'anthropic') {
    const resp = await getAnthropic().messages.create({
      model: defaultAnthropicModel,
      max_tokens: msg.maxTokens ?? 2048,
      system: msg.cacheSystem
        ? [{ type: 'text', text: msg.system, cache_control: { type: 'ephemeral' } }]
        : msg.system,
      messages: [{ role: 'user', content: msg.user }],
    });
    const t = resp.content.find((c) => c.type === 'text');
    return t && t.type === 'text' ? t.text : '';
  }

  if (provider === 'openrouter') {
    const model = pickOpenRouterModel(msg.modelHint ?? 'chat');
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://biocycle.ai',
        'X-Title': 'Impulso BioCycle Agents',
      },
      body: JSON.stringify({
        model,
        max_tokens: msg.maxTokens ?? 2048,
        messages: [
          { role: 'system', content: msg.system },
          { role: 'user', content: msg.user },
        ],
      }),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`OpenRouter ${resp.status}: ${text.slice(0, 200)}`);
    }
    const data = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content ?? '';
  }

  if (provider === 'ollama') {
    const model = pickOllamaModel(msg.modelHint ?? 'chat');
    const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        options: { num_predict: msg.maxTokens ?? 2048, temperature: 0.4 },
        messages: [
          { role: 'system', content: msg.system },
          { role: 'user', content: msg.user },
        ],
      }),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Ollama ${resp.status}: ${text.slice(0, 200)}`);
    }
    const data = (await resp.json()) as { message?: { content?: string } };
    return data.message?.content ?? '';
  }

  return '';
}

function pickOllamaModel(hint: 'classifier' | 'synthesizer' | 'feeder' | 'chat'): string {
  switch (hint) {
    case 'classifier':
      return process.env.OLLAMA_CLASSIFIER_MODEL ?? 'qwen2.5:14b';
    case 'synthesizer':
      return process.env.OLLAMA_SYNTHESIZER_MODEL ?? 'qwen2.5:14b';
    case 'feeder':
      return process.env.OLLAMA_FEEDER_MODEL ?? 'qwen2.5:14b';
    default:
      return process.env.OLLAMA_CHAT_MODEL ?? 'qwen2.5:14b';
  }
}

function pickOpenRouterModel(hint: 'classifier' | 'synthesizer' | 'feeder' | 'chat'): string {
  switch (hint) {
    case 'classifier':
      return (
        process.env.OPENROUTER_CLASSIFIER_MODEL ?? 'meta-llama/llama-3.3-70b-instruct:free'
      );
    case 'synthesizer':
      return (
        process.env.OPENROUTER_SYNTHESIZER_MODEL ?? 'deepseek/deepseek-chat:free'
      );
    case 'feeder':
      return process.env.OPENROUTER_FEEDER_MODEL ?? 'google/gemini-2.0-flash-exp:free';
    default:
      return process.env.OPENROUTER_CHAT_MODEL ?? 'google/gemini-2.0-flash-exp:free';
  }
}

export function providerLabel(): string {
  const chain = getProviderChain();
  if (chain.length === 0) return 'stub (fixture mode)';
  const labels = chain.map((p) => {
    if (p === 'anthropic') return `Anthropic · ${process.env.ANTHROPIC_MODEL ?? 'sdk'}`;
    if (p === 'openrouter') return `OpenRouter (dev)`;
    if (p === 'ollama') return `Ollama local (${process.env.OLLAMA_CHAT_MODEL ?? 'qwen2.5:14b'})`;
    return p;
  });
  return labels.join(' → ');
}

/**
 * Deterministic stub used when no provider is available.
 * Matches the shape expected by classifier/synthesizer/feeder.
 */
export function llmStub(
  kind: 'classify' | 'synthesize' | 'feeder',
  input: unknown,
): unknown {
  log('debug', `[llm-stub] ${kind}`, input);
  if (kind === 'classify') {
    const posts = input as Array<{ id: number; title: string; body?: string | null }>;
    return posts.map((p) => {
      const text = `${p.title} ${p.body ?? ''}`.toLowerCase();
      const contaminant = /pfas|forever chemical/.test(text)
        ? 'pfas'
        : /oil|crude|diesel|spill|petroleo/.test(text)
          ? 'hydrocarbons'
          : /plastic|pet|microplastic/.test(text)
            ? 'plastics'
            : /soil|farm|pesticide|agro|glifosato/.test(text)
              ? 'soil_ag'
              : /mining|mercury|tailings|mineria/.test(text)
                ? 'mining'
                : /wastewater|effluent|aguas residuales/.test(text)
                  ? 'water_treatment'
                  : 'none';
      const region = /epa|cercla|superfund|us\b|usa/i.test(text)
        ? 'USA'
        : /colombia|mexico|peru|ecuador|chile|latam|argentina/i.test(text)
          ? 'LATAM'
          : /reach|ue|europe|eu\b/i.test(text)
            ? 'EU'
            : 'global';
      const pain =
        /urgent|deadline|fine|multa|lawsuit|liability/.test(text) ? 4 :
        /worry|concern|need|help|how/.test(text) ? 3 : 2;
      return {
        post_ref: p.id,
        contaminant_type: contaminant,
        region,
        severity: pain,
        pain_intensity: pain,
        avatar_match:
          region === 'USA' && contaminant === 'pfas' ? 'remediation_pm_usa' :
          region === 'LATAM' ? 'hseq_latam' :
          region === 'EU' ? 'compliance_eu' :
          'none',
        banned_phrase_hits: [],
      };
    });
  }
  if (kind === 'synthesize') {
    return {
      themes: [
        {
          theme: 'PFAS liability anxiety (USA)',
          avatar_match: 'remediation_pm_usa',
          quote_count: 5,
          top_quotes: [
            { quote: '[FIXTURE] We got a notice from EPA on PFAS and no one knows the cost.', url: '#', subreddit: 'PFAS' },
          ],
        },
        {
          theme: 'Hidrocarburos en suelos — contratistas poco confiables (LATAM)',
          avatar_match: 'hseq_latam',
          quote_count: 3,
          top_quotes: [
            { quote: '[FIXTURE] Hicimos remediación con biorremediación y en 18 meses nadie nos dio un baseline.', url: '#', subreddit: 'colombia' },
          ],
        },
      ],
      source_posts_count: 10,
    };
  }
  if (kind === 'feeder') {
    return {
      drafts: [
        {
          kind: 'slide_quote',
          content: '[FIXTURE] "We got a notice from EPA on PFAS and no one knows the cost." — r/PFAS',
          sources: ['#'],
          banned_phrase_hits: [],
        },
        {
          kind: 'tweet',
          content: '[FIXTURE] Top dolor detectado esta semana en r/PFAS: parálisis frente al EPA PFAS NPDWR 2027. El $3K piloto vale 1% de la consultora tradicional.',
          sources: ['#'],
          banned_phrase_hits: [],
        },
      ],
    };
  }
  return null;
}
