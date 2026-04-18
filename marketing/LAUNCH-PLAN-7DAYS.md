---
title: Launch Plan 7 días — Build in Public + Waitlist
last_updated: 2026-04-17
languages: ES (cuerpo) + EN (templates tácticos)
audience: founders, operator running ads, content creator
target_event: Presentación ~2026-04-24 (T-7)
---

# Impulso BioCycle — Plan de lanzamiento 7 días (build in public + waitlist)

> **Cambio estratégico vs plan anterior:** reemplazamos entrevistas 1:1 como canal primario de discovery por **waitlist con formulario en thank-you**. Razón: las calls toman 10 días mínimo en producir señal + no son escalables. Una waitlist con anuncios puede generar **100–500 data points cualitativos en 7 días**. Las entrevistas 1:1 quedan como **tier 2** para high-intent signups (ver `CUSTOMER-DISCOVERY-INTERVIEW.md` v2).

---

## 1. El embudo en una imagen

```
┌─────────────────────────────────────────────────────────────┐
│ [1] ANUNCIOS (LinkedIn EN + ES, X/Twitter, founder posts)  │
│     · 5 hooks bilingües rotando                            │
│     · Targeting: HSEQ / Environmental Compliance / Sust.   │
│     · Budget: $20–60 USD/día × 7 días = $140–420 total     │
└─────────────────────────────────────────────────────────────┘
                          ↓ click
┌─────────────────────────────────────────────────────────────┐
│ [2] LANDING PAGE (biocycle.ai o Framer/Carrd rápido)        │
│     · Hero → dolor → cómo funciona → AI moat → waitlist    │
│     · 1 sola CTA: "Join the waitlist" / "Únete"            │
│     · Sin menú, sin distracciones                          │
└─────────────────────────────────────────────────────────────┘
                          ↓ opt-in (email + país)
┌─────────────────────────────────────────────────────────────┐
│ [3] THANK-YOU PAGE + FORMULARIO DISCOVERY                   │
│     · "Estás dentro. Ayúdanos a priorizarte:"              │
│     · 6–8 preguntas Mom-Test-adaptadas (opcional pero      │
│       ancla social: 'los 100 primeros completos tienen     │
│       early access')                                        │
│     · CTA secundaria: "¿Quieres hablar 20 min? Agenda aquí"│
└─────────────────────────────────────────────────────────────┘
                          ↓ segmentación automática
┌─────────────────────────────────────────────────────────────┐
│ [4] POST-FORM SEGMENTATION                                  │
│     🟢 High intent → Calendly call (tier 2 interview)      │
│     🟡 Medium intent → Newsletter + early access pilot     │
│     🔴 Low intent → Updates mensuales                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ [5] BUILD IN PUBLIC — hilo diario                           │
│     · Día N: N signups, M países, top-3 pains, learnings   │
│     · LinkedIn + X (ES) / LinkedIn + X (EN)                │
│     · Fuerza accountability + da social proof a la landing │
└─────────────────────────────────────────────────────────────┘
```

**KPIs objetivo (conservador / realista / stretch):**

| Métrica | Conservador | Realista | Stretch |
|---|---|---|---|
| Ad impressions 7 días | 50K | 150K | 400K |
| CTR al landing | 0.6% | 1.2% | 2.5% |
| Landing → waitlist opt-in | 8% | 15% | 25% |
| Waitlist → form completo | 35% | 55% | 75% |
| **Signups totales** | **25** | **120** | **500** |
| **Forms completos** | **9** | **65** | **375** |
| 🟢 High-intent calls agendadas | 2 | 8 | 25 |

---

## 2. Plan día por día (T-7 → T-0)

### 🟢 Día 1 (T-7, jueves 17-abr) — FOUNDATION

**Entregables (hoy):**
- [x] `LAUNCH-PLAN-7DAYS.md` (este archivo) aprobado
- [ ] `LANDING-PAGE-SPEC.md` finalizado (siguiente archivo)
- [ ] `WAITLIST-FORM.md` con las 6–8 preguntas aprobadas
- [ ] Decisión de stack: Framer / Carrd / HTML en Vercel (ver §4)
- [ ] Compra dominio o subdominio (sugerido: `biocycle.ai`, `impulsobiocycle.com`, o `biocycle.waitlistr.com` para velocidad)
- [ ] Cuenta Formspree / Tally / Typeform / Google Forms para el form
- [ ] Analytics: Plausible (privacy-friendly, $9/mes) o GA4 + Hotjar trial

**Meta del día:** dominio + stack decidido + spec aprobado. **NO construir aún.**

---

### 🟢 Día 2 (T-6, viernes 18-abr) — BUILD DAY

**Entregables:**
- [ ] Landing page en producción (v1.0 — EN + ES duplicado con `/en` y `/es` paths, o toggle)
- [ ] Waitlist form conectado (Mailchimp / ConvertKit / Beehiiv — gratis hasta 500–1K contactos)
- [ ] Thank-you page con formulario de 6–8 preguntas (ver `WAITLIST-FORM.md`)
- [ ] Evento "waitlist_signup" tracked en Plausible/GA
- [ ] Calendly link para tier-2 calls (link oculto, solo en thank-you)
- [ ] Preview social OG card (EN + ES) — imagen hero + tagline

**Test interno:** signup con 3 emails personales desde móvil EN y desktop ES. Confirmar email delivery + form submit + calendario.

**Meta:** landing LIVE accessible via URL. Fix bugs antes de pautar.

---

### 🟠 Día 3 (T-5, sábado 19-abr) — PRE-LAUNCH CONTENT

Hoy aún no se compran ads — se "prepara el terreno" orgánico.

**Entregables:**
- [ ] 2 posts en LinkedIn de fundadora (ES + EN separados):
  - Anuncio de waitlist + "build in public commitment" de 7 días
  - Link a landing page (el primer tráfico es orgánico del network)
- [ ] 2 posts en X/Twitter (ES + EN)
- [ ] Warm email a 20 contactos personales pidiendo "¿me ayudas? comparte este link con 1 persona que lo necesite"
- [ ] Drafts de los 5 hooks ganadores de `ADS-HOOKS.md` con CTA actualizada → landing (los 5 ángulos: regulatorio USA, regulatorio LATAM, tiempo, económico, AI moat)

**Meta:** primeros 10–30 signups orgánicos antes de pagar ads. Validar que el embudo funciona end-to-end.

---

### 🟠 Día 4 (T-4, domingo 20-abr) — ADS SETUP

**Entregables:**
- [ ] LinkedIn Campaign Manager: 2 campaigns (EN + ES), 5 ad creatives cada una, targeting definido
- [ ] X Ads: 1 promoted post por idioma para testear CTR (cheap A/B)
- [ ] Pixel de LinkedIn Insight + X tracking pixel instalados en landing
- [ ] Audience retargeting configurada (landing visitors without opt-in)

**Targeting LinkedIn EN:**
- Job titles: "Remediation Project Manager", "Environmental Compliance Manager", "HSE Director", "Sustainability Director"
- Industries: Oil, Gas & Mining · Chemicals · Utilities · Manufacturing · Defense
- Countries: USA, UK, Germany, Netherlands, Australia, Singapore

**Targeting LinkedIn ES:**
- Job titles: "Gerente HSEQ", "Director Ambiental", "Coordinador Ambiental", "VP HSEQ"
- Industries: Oil & Gas · Química · Minería · Tratamiento de Aguas · Agroindustria
- Countries: Colombia, México, Brasil, Chile, Argentina, España

**Budget:**
- Día 4 sólo setup (no spend). Revisión final antes de activar.

**Meta:** todo listo para activar lunes temprano.

---

### 🔴 Día 5 (T-3, lunes 21-abr) — ADS LIVE + DAILY CONTENT RHYTHM

**Entregables diarios (a partir de hoy hasta T-0):**
- [ ] Activar campaigns LinkedIn + X: $40–80 USD/día total (testeo alto, escalar los 2 mejores)
- [ ] Post diario en LinkedIn ES + EN: "Día 1 de la waitlist — X signups, top learning Y, quote del avatar Z" (build in public rhythm)
- [ ] Post diario en X ES + EN equivalente
- [ ] Revisar métricas cada 4h: CTR, CPC, opt-in rate. Pausar creatives <0.4% CTR.
- [ ] Responder DMs en <4h: cada comentario o DM es oro puro para discovery.

**Rule of thumb:** si CPC > $8 USD, rotar creative al siguiente hook. Si opt-in rate <10%, revisar copy de la landing (no el ad).

---

### 🔴 Día 6 (T-2, martes 22-abr) — DOUBLE DOWN + TIER 2 CALLS

**Entregables:**
- [ ] Escalar los 2 top ad creatives +50% budget; pausar los 3 peores
- [ ] Agendar tier-2 calls con los primeros 3–5 🟢 high-intent signups que completaron form
- [ ] Post "Día 2/7" con datos específicos (N signups × país, pain #1 mencionado, quote textual anonimizada)
- [ ] Email de bienvenida al waitlist: copy definido, enviar a todos los signups actuales

**Meta emocional:** el momentum visible pública en LinkedIn/X genera FOMO en siguientes visitantes.

---

### 🔴 Día 7 (T-1, miércoles 23-abr) — SYNTHESIS + DEMO PREP

**Entregables:**
- [ ] Sintetizar data de los 7 días en `marketing/LAUNCH-DAY1-7-RESULTS.md`:
  - Total signups por país/industria/cargo
  - Top 5 pains mencionados en forms
  - 10 quotes textuales para pitch
  - Gráfica de signup-per-hour sobre los 7 días
  - Conversion rate funnel completo
  - ROI: costo por signup, costo por high-intent call
- [ ] Preparar slide de pitch con métricas reales: "En 7 días tenemos X signups en Y países con Z pain validado"
- [ ] Mantener ads corriendo (momentum vivo para el día del pitch)
- [ ] 1 post "Día 6/7 — así se ve la traction real" con screenshot del dashboard analytics

**Meta:** llegar al pitch con **data real**, no slides teóricas.

---

### 🟢 Día 8 (T-0, jueves 24-abr) — PRESENTACIÓN

**Uso de la data en el pitch:**
- Slide 1 (hook): "Hace 7 días publicamos una waitlist. Esto es lo que encontramos."
- Slide 2: gráfica de signups con países + cargos (mapa del avatar validado en vivo)
- Slide 3: top 3 quotes textuales del form ("Nuestro último contratista cobró $X y el sitio sigue contaminado" — frase del avatar real)
- Slide 4: CAC inicial ($X/signup) + proyección siguiente 90 días

**Regla de oro:** no inventar números. Mostrar lo real.

---

## 3. El "build in public" rhythm (un template por día)

### Template post diario — LinkedIn ES

```
Día [N] de 7 construyendo la waitlist de Impulso BioCycle en público.

🎯 Total signups hasta ahora: [N]
🌎 Top 3 países: [A, B, C]
💼 Top cargo: [Gerente HSEQ / Environmental Compliance Manager]
🔥 Pain #1 que veo en los forms: "[quote textual anonimizada]"

Aprendí algo esta semana: [insight específico — no "aprendimos mucho" sino "el avatar LATAM ni menciona ESG, le preocupa la CAR y punto"].

Sigue el hilo →

[Link a landing page]
```

### Template post diario — LinkedIn EN

```
Day [N] of 7 building Impulso BioCycle's waitlist in public.

🎯 Signups: [N]
🌎 Top 3 countries: [A, B, C]
💼 Top role: [Remediation Project Manager]
🔥 Pain #1 from the form: "[textual quote, anonymized]"

What I learned this week: [specific insight].

Follow the thread →

[Link to landing]
```

### Regla de cadencia

- 1 post largo/día (hilo o post LinkedIn con 4–6 líneas)
- 2–3 posts cortos/día en X (ES + EN)
- **No** posts perfectos. Posts reales. Un screenshot del dashboard > una gráfica bonita en Canva.

---

## 4. Decisión de stack técnico (recomendación)

| Opción | Pros | Contras | Recomendación |
|---|---|---|---|
| **Framer** (no-code) | Diseño premium 2h, bilingüe con CMS Locales, analytics built-in, publish en minutos | $20–40/mes · aprender interfaz | ✅ **#1 para velocidad 7 días** |
| **Carrd** | $19/año, ultra-simple, 1 hora de setup | Limitado en secciones, no bilingüe fácil | #3 — si preferencia por costo mínimo |
| **HTML estático + Vercel** | Control total, grátis en Vercel, código propio en repo | 1–2 días de dev, OG images manuales | #2 — si vamos a iterar mucho y queremos ownership |
| **Next.js + Tailwind** | El repo ya tiene stack TS (lib/, artifacts/). Podemos reusar componentes shadcn | Over-engineering para 7 días | Evitar a menos que ya haya componentes listos |
| **Webflow** | Power user-friendly, CMS potente | Aprender 2 días, costo $23/mes | Solo si el equipo ya sabe Webflow |

**Recomendación firme:** **Framer.** Plantillas "SaaS landing + waitlist" listas, CMS para ES/EN, Formspree/Tally embed trivial, publica en `biocycle.framer.website` o dominio custom. Tiempo real de build: 4–6 horas día 2.

**Stack completo sugerido (todo gratis o <$50/mes):**
- Dominio: Namecheap `$12/año` — `biocycle.ai` o `impulsobiocycle.com` (verificar disponibilidad)
- Landing: **Framer** `$20/mes` plan Pro
- Email list: **ConvertKit** free (hasta 1K) o **Beehiiv** free hasta 2.5K
- Form: **Tally** free (unlimited forms, unlimited responses)
- Analytics: **Plausible** $9/mes o **Umami** self-hosted gratis
- Scheduling: **Calendly** free tier (1 event type suficiente)
- Ads: LinkedIn Campaign Manager + X Ads (min $10 day each platform)

**Total monthly cost:** ~$30–40 USD recurring + $140–420 ads.

---

## 5. Qué sacrificar (para que el plan quepa en 7 días)

Cosas tentadoras que **no hacemos** antes del día 7:

- ❌ Producto funcional conectado a la landing (la Streamlit app actual NO debería linkearse — aún no refleja el pivote honesto)
- ❌ Video explainer profesional (usar screenshot/loom de la app actual máximo)
- ❌ Blog / contenido SEO (cero tracción en 7 días; hacerlo post-launch)
- ❌ Integraciones con HubSpot/Salesforce (overkill; Typeform + Google Sheet bastan)
- ❌ Logo profesional nuevo (reusar el actual — el branding se resuelve después)
- ❌ Landing multiidioma con i18n complejo (duplicar `/en` y `/es` paths; decisión de Framer Locales es válida pero time-boxed)

---

## 6. Qué medimos / qué NO medimos

**Sí medimos (crítico):**
- Signups totales + conversion rate full funnel
- Cost per signup (CAC marketing)
- Form completion rate (indicador de calidad de signup)
- High-intent rate (% que agendan call tier 2)
- Quote library: 20+ quotes textuales de forms para update `ADS-HOOKS.md v2`

**No medimos (ruido en 7 días):**
- Vanity metrics: seguidores de LinkedIn, impressions puras
- NPS (muestra insuficiente)
- Retention / activation (no hay producto que retener)
- Revenue (no vendemos nada en la waitlist — intencional)

---

## 7. Riesgos y contingencias

| Riesgo | Probabilidad | Plan B |
|---|---|---|
| Landing no lista día 2 | Media | Usar Carrd single-page + Typeform embed — 2h setup |
| <30 signups día 7 | Media | Pivote copy: ampliar targeting (Environmental Consultant) + aumentar budget ads 50% |
| Ads rechazados por LinkedIn (tema "ambiental" puede trigger review) | Baja | Evitar palabras "EPA fine", "liability" — usar framing positivo ("site closure", "compliance acceleration") |
| Form completion <20% | Media | Reducir preguntas de 8 a 5, marcar todas opcionales excepto email+país |
| Nadie agenda call tier 2 | Alta (primeros 3 días) | El email #2 al waitlist hace el ask con un caso concreto |
| Todo el tráfico viene de países que no son ICP | Media | Re-segmentar ads por country; bloquear países no-target |

---

## 8. Checklist pre-launch (antes de activar ads día 5)

- [ ] Landing carga en <2s móvil 4G
- [ ] CTA "Join waitlist" visible sin scroll en móvil
- [ ] Email de confirmación llega en <30s
- [ ] Thank-you page con form renderiza
- [ ] Form submit envía a Google Sheet / Airtable correctamente
- [ ] Calendly link funciona desde thank-you page
- [ ] Pixel LinkedIn + X tracking fires on "signup" event
- [ ] Version ES y EN ambas en producción
- [ ] OG image renderiza bien en LinkedIn + WhatsApp + Slack preview
- [ ] 404 y redirects configurados
- [ ] Privacy policy básica (gratis en Termly o Iubenda) — LinkedIn Ads lo requiere
- [ ] 3 emails de test enviados y confirmados funcionan

---

## 9. Qué se construye si sobra tiempo (nice-to-have)

Estos son "V1.1" para los días 6–7 si el flow base funciona bien:

1. **Página /es/casos** con 2–3 caso-estudio mocked (Ecopetrol, FEMSA, US Superfund site genérico) — no inventar nombres, usar framing "a mid-size oil & gas operator in Colombia with a legacy Casanare site".
2. **Counter de waitlist visible** en landing ("147 professionals joined from 23 countries") — genera FOMO. Actualizar manual o con counter real.
3. **Exit-intent popup** con oferta "early access" si están por irse sin opt-in.
4. **LinkedIn Lead Gen Forms** (lead forms nativas) — convierte 2–3× mejor que outbound click. Pero requiere aprobación de 48h.
5. **Slack/Discord community** para early signups — genera lockin de los más comprometidos.

---

## 10. Resumen ejecutivo en 5 bullets

1. **Cambio de enfoque:** waitlist = discovery primario; calls 1:1 = tier 2 solo para 🟢.
2. **7 días estructurados:** T-7 spec, T-6 build, T-5 warm-up orgánico, T-4 ads setup, T-3/T-2/T-1 ads + build-in-public diario, T-0 pitch con data real.
3. **Stack:** Framer + ConvertKit + Tally + Plausible + LinkedIn/X Ads. ~$30–40/mes + $140–420 ad spend.
4. **KPI realista:** 120 signups, 65 forms completos, 8 high-intent calls agendadas.
5. **Outputs que quedan:** 20+ quotes textuales reales, CAC medido, segmentación de avatar validada — insumos para `ADS-HOOKS v2` y pilotos post-launch.

---

**Archivos relacionados:**
- Landing wireframe + copy → `LANDING-PAGE-SPEC.md`
- Form questions EN+ES → `WAITLIST-FORM.md`
- Ads hooks con CTAs nuevos → `ADS-HOOKS.md` (actualizado §9)
- Entrevistas tier 2 → `CUSTOMER-DISCOVERY-INTERVIEW.md` (v2)
