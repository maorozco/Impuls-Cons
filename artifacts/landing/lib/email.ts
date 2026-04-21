/**
 * Transactional email via Resend.
 *
 * Mock mode: when RESEND_API_KEY is missing, logs the email to stdout.
 * This keeps the signup flow working end-to-end in dev without any external
 * dependency — we only pay for Resend when we're actually shipping.
 */

type Locale = 'es' | 'en';

export interface SendResult {
  ok: boolean;
  id?: string;
  mocked: boolean;
  error?: string;
}

function isMockEmail(): boolean {
  return !process.env.RESEND_API_KEY?.trim();
}

async function sendRaw(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  if (isMockEmail()) {
    // eslint-disable-next-line no-console
    console.log('[mock-email] would send', {
      to: args.to,
      subject: args.subject,
      textPreview: args.text.slice(0, 140),
    });
    return { ok: true, mocked: true };
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? 'hola@biocycle.ai',
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      // eslint-disable-next-line no-console
      console.error('[email] send failed', resp.status, body);
      return { ok: false, mocked: false, error: `${resp.status}: ${body.slice(0, 200)}` };
    }
    const data = (await resp.json()) as { id?: string };
    return { ok: true, mocked: false, id: data.id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] network error', err);
    return { ok: false, mocked: false, error: String(err) };
  }
}

// ─────────────────────────────────────────────────────────────────
// Welcome email — sent after any signup
// ─────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(args: { to: string; locale: Locale }): Promise<SendResult> {
  const esp = args.locale === 'es';

  const subject = esp
    ? 'Bienvenido a Impulso BioCycle — siguiente paso'
    : 'Welcome to Impulso BioCycle — next step';

  const text = esp
    ? `Hola,

Gracias por unirte a la lista de espera de Impulso BioCycle.

Somos una plataforma de IA que diseña consorcios microbianos para biorremediación — hoy la usan equipos que remedian suelos contaminados con hidrocarburos, pesticidas y aguas residuales industriales. El plástico lo trabajamos exclusivamente en biorreactor contenido (produce monómeros TPA+EG vendibles a $800–1,600/ton).

En los próximos días te mandamos:
  • Acceso anticipado a la plataforma
  • Un resumen curado semanal de los dolores regulatorios que estamos viendo en el mercado (EPA PFAS, Ley 2387, REACH)
  • Si aplicaste al formulario de descubrimiento, un enlace personal para agendar una conversación

Si tienes un sitio específico del que quieres hablar ahora mismo, responde este correo con el tipo de contaminante + región — te respondemos en <24h.

— Equipo Impulso BioCycle
biocycle.ai`
    : `Hi,

Thanks for joining the Impulso BioCycle waitlist.

We're an AI platform that designs microbial consortia for bioremediation — teams use us for hydrocarbon-contaminated soils, pesticides, and industrial wastewater. For plastic, we only operate in contained bioreactors (producing TPA+EG monomers sellable at $800–1,600/ton).

In the coming days you'll receive:
  • Early access to the platform
  • A curated weekly digest of regulatory pain we're tracking (EPA PFAS, Ley 2387, REACH)
  • If you completed the discovery form, a personal link to schedule a call

If you have a specific site you want to discuss now, reply to this email with contaminant type + region — we'll respond in under 24 hours.

— Impulso BioCycle team
biocycle.ai`;

  const html = text
    .split('\n\n')
    .map((p) => `<p style="color:#1B4332;font-family:system-ui;line-height:1.6;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('\n');

  return sendRaw({ to: args.to, subject, html, text });
}

// ─────────────────────────────────────────────────────────────────
// Tier-green Calendly invite — sent when a signup scores tier=green
// ─────────────────────────────────────────────────────────────────

export async function sendTierGreenInvite(args: {
  to: string;
  locale: Locale;
  calendlyUrl: string;
}): Promise<SendResult> {
  const esp = args.locale === 'es';

  const subject = esp
    ? '🟢 Agendemos una conversación de 20 minutos'
    : '🟢 Let\'s schedule a 20-minute conversation';

  const text = esp
    ? `Hola,

Tu respuesta al formulario de descubrimiento fue una de las más claras de esta semana — por lo que describiste, tu caso encaja con los primeros 10 proyectos piloto que estamos priorizando.

Queremos hablar contigo directamente. No es una demo — es una conversación de 20 minutos donde tú nos cuentas el sitio, y nosotras (Manu y Carolina) te damos una primera lectura sobre cómo lo abordaríamos.

Agenda aquí:
${args.calendlyUrl}

Si ninguno de esos horarios te funciona, responde este correo con 2–3 franjas que te sirvan.

— Manu + Carolina
Impulso BioCycle`
    : `Hi,

Your response to the discovery form was one of the sharpest we got this week — based on what you described, you fit the first 10 pilot projects we're prioritizing.

We'd like to talk directly. This isn't a demo — it's a 20-minute conversation where you tell us about the site and we (Manu and Carolina) give you an initial read on how we'd approach it.

Schedule here:
${args.calendlyUrl}

If none of those slots work, reply with 2–3 time windows that do.

— Manu + Carolina
Impulso BioCycle`;

  const html = text
    .split('\n\n')
    .map((p) => `<p style="color:#1B4332;font-family:system-ui;line-height:1.6;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('\n');

  return sendRaw({ to: args.to, subject, html, text });
}

// ─────────────────────────────────────────────────────────────────
// Post-pitch follow-up sequence (Week 4 task 4.7)
// ─────────────────────────────────────────────────────────────────

export async function sendPostPitchFollowup(args: {
  to: string;
  kind: 'panel' | 'network' | 'prospect';
  locale: Locale;
  panelistName?: string;
}): Promise<SendResult> {
  const esp = args.locale === 'es';
  const { kind, panelistName } = args;

  let subject = '';
  let text = '';

  if (kind === 'panel') {
    subject = esp
      ? `Gracias — pitch Capital Semilla Nacional`
      : `Thank you — Capital Semilla Nacional pitch`;
    text = esp
      ? `Hola${panelistName ? ` ${panelistName}` : ''},

Gracias por el tiempo y las preguntas duras del panel hoy. Las anticipamos, pero hay tres en particular donde nuestra respuesta se puede extender más de lo que cupieron los 4 minutos + Q&A:

1. TRL del sistema integrado (3–4) y por qué ese es exactamente el punto del piloto 90 días con un lab universitario.
2. Diferenciación honesta con Carbios (centralizado €230M vs distribuido, no competimos en el mismo plano).
3. Por qué Colombia primero y no USA (validación regulatoria más rápida, IP universitaria existente, beachhead operacional).

Si tienes 15 minutos esta semana, me encantaría ampliar cualquiera de esos.

— Equipo Impulso BioCycle`
      : `Hi${panelistName ? ` ${panelistName}` : ''},

Thanks for the time and the sharp questions today. We anticipated them, but three in particular are where our answer can stretch beyond the 4-minute + Q&A format:

1. Integrated-system TRL (3–4) and why that's exactly the point of a 90-day pilot with a university lab.
2. Honest Carbios differentiation (centralized €230M vs. distributed — we don't compete on the same plane).
3. Why Colombia first, not USA (faster regulatory validation, existing university IP, operational beachhead).

If you have 15 minutes this week, I'd love to go deeper on any of them.

— Impulso BioCycle team`;
  } else if (kind === 'network') {
    subject = esp
      ? `Hoy presentamos Capital Semilla — gracias`
      : `Pitched Capital Semilla today — thank you`;
    text = esp
      ? `Hola,

Hoy presentamos a Capital Semilla Nacional. Fue una de las experiencias más humanas de los últimos 2 años — nos expusimos honestamente sobre lo que prometemos y lo que no, y el panel lo notó.

Si te enteras del resultado antes que nosotros, mándame un WhatsApp. Y si conoces a alguien que esté lidiando con suelos con hidrocarburos o pesticidas y pueda usar un piloto 90 días, es el momento.

Gracias por aguantar el proceso con nosotros.

— Equipo Impulso BioCycle`
      : `Hi,

Today we pitched Capital Semilla Nacional. One of the most human experiences of the last 2 years — we were honest about what we promise and what we don't, and the panel noticed.

If you hear the result before we do, text me. And if you know anyone dealing with hydrocarbon- or pesticide-contaminated soil who could use a 90-day pilot, now's the moment.

Thanks for riding the process with us.

— Impulso BioCycle team`;
  } else {
    subject = esp
      ? `Una actualización sobre BioCycle — y la siguiente ventana`
      : `A BioCycle update — and the next window`;
    text = esp
      ? `Hola,

Actualización breve: esta semana presentamos en la final de Capital Semilla Nacional. Independiente del resultado, abrimos 3 cupos adicionales de piloto 90 días ($3,000 USD) para equipos que remedian suelos con hidrocarburos/pesticidas o que procesan plásticos en biorreactor contenido.

Si te interesa el tuyo, responde este correo con el tipo de sitio.

— Equipo Impulso BioCycle`
      : `Hi,

Quick update: this week we pitched the Capital Semilla Nacional final. Regardless of outcome, we opened 3 additional 90-day pilot slots ($3,000 USD) for teams remediating hydrocarbon/pesticide soils or processing plastics in contained bioreactors.

If you want yours, reply with the site type.

— Impulso BioCycle team`;
  }

  const html = text
    .split('\n\n')
    .map((p) => `<p style="color:#1B4332;font-family:system-ui;line-height:1.6;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('\n');

  return sendRaw({ to: args.to, subject, html, text });
}
