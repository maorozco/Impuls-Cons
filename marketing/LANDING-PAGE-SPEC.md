---
title: Landing Page Spec — Waitlist build-in-public
last_updated: 2026-04-17
languages: ES + EN paralelo
audience: designer, copywriter, developer building the page
framework: Simon Sinek Golden Circle (Why → How → What) adaptado a B2B biotec
---

# Landing Page Spec — Impulso BioCycle

## 0. Decisión estratégica antes de diseñar

### ¿VSL, enterprise landing, o híbrido?

**VSL clásico (Video Sales Letter)** funciona en B2C high-emotion (coaching, info-products, DTC). En B2B biotec con avatar de Gerente HSEQ + 10 años de experiencia + ingeniera con escepticismo alto = **un VSL puro quema credibilidad**. El avatar huele marketing-y y se va.

**Landing enterprise aburrida** (feature list + logos + "Enterprise-ready") **tampoco funciona aquí** porque no tenemos logos Fortune 500 ni producto deployado. Somos pre-revenue con una visión ambiciosa.

**La síntesis correcta: landing "movement-driven"** — híbrido entre:
- **Golden Circle de Sinek** (Why → How → What) — empezar por la creencia, no el producto.
- **Build in public** — la waitlist no es una feature, es una invitación a sumarse a un movimiento.
- **Evidencia técnica B2B** — las credenciales (papers, stack AI, ciencia citada) respaldan la visión para que el avatar skeptical no dude.

Esta estrategia la usaron Linear (cuando lanzaron waitlist desde creencia vs "issue tracker #427"), Notion, Superhuman, Arc Browser, Granola. Todas B2B/prosumer que empezaron con waitlist aspiracional.

### ¿Video AI-generated o video de fundadora?

**Recomendación firme: fundadora-led mobile video 60–90s + visuales complementarios simples.** Razones:

| Opción | Costo | Tiempo | Pros | Contras | Recomendación |
|---|---|---|---|---|---|
| **Fundadora-led 60–90s mobile** | $0 | 2h grabación + 1h edición | Autenticidad B2B, credibilidad, "skin in the game" | Calidad variable | ✅ **#1** |
| **AI-generated (Runway / Synthesia / HeyGen)** | $20–50/mes | 3–4h | Estético | Huele a fake, genera desconfianza en B2B biotec skeptical | ❌ Evitar para Hero |
| **Animación Lottie / After Effects** | $200–500 freelancer · 8h dev | 1–2 días | Profesional | Time-boxed | #2 — para explainer del "How" |
| **Screenshots + GIFs del producto** | $0 | 2h | Realismo | Menos emoción | Complementario en sección "What" |

**Decisión propuesta:**
- Video Hero: fundadora 60–90s mobile (iPhone + LAV mic $30 + luz natural)
- Video "How it works": GIF animado 15–20s mostrando el flujo de la app (Streamlit → input → consortium design → output)
- No videos AI para nada crítico. Úsalos como fondo ambiental en hero SI el shot es ilustrativo (no avatares hablando).

### ¿Qué inspira signups masivos? (Sinek bien aplicado)

Sinek dijo: *"People don't buy what you do, they buy why you do it."* En B2B biotec esto significa:

1. **Empezar por creencia, no por tecnología.** "Creemos que la contaminación es un problema de inteligencia aplicada, no un destino inevitable."
2. **Enmarcar como movimiento, no como producto.** Los signups no son leads, son *co-conspiradores* de una visión que el avatar comparte secretamente pero no ha nombrado.
3. **Demostrar skin in the game.** Build in public diario = "yo también arriesgo". Genera reciprocidad.
4. **FOMO por pertenencia, no por precio.** "147 teams from 23 countries joined" > "early bird pricing 50% off". El avatar senior no responde a descuentos; responde a pertenencia a una vanguardia.

---

## 1. Estructura ideal (secciones en orden)

```
┌────────────────────────────────────┐
│ NAV (mínima)                       │ ← logo + language toggle + 1 CTA
├────────────────────────────────────┤
│ HERO — EL WHY                      │ ← belief statement + video + CTA
│   · Belief headline                │
│   · Sub (qué hacemos en 1 frase)   │
│   · Email-only signup              │
│   · Video founder 60–90s           │
│   · Counter: "X joined from Y"     │
├────────────────────────────────────┤
│ SOCIAL PROOF STRIP                 │ ← universidades/revistas
├────────────────────────────────────┤
│ EL PROBLEMA                        │ ← pain del avatar con datos
│   · 3 stats duras                  │
│   · 1 quote del avatar real        │
├────────────────────────────────────┤
│ EL SUEÑO (la visión)               │ ← qué pasa cuando funciona
│   · "Imagina..." storytelling      │
│   · Visual/animación               │
├────────────────────────────────────┤
│ EL HOW (metodología)               │ ← 3 pasos con diagrama
├────────────────────────────────────┤
│ EL WHAT (AI moat)                  │ ← stack frontera + ciencia
│   · AlphaFold 3, RFDiffusion, etc  │
│   · Papers referenced              │
│   · GIF/screenshot del producto    │
├────────────────────────────────────┤
│ QUIÉN LO CONSTRUYE                 │ ← fundadora + team brief
├────────────────────────────────────┤
│ BUILD IN PUBLIC                    │ ← últimos 3 posts LinkedIn/X
├────────────────────────────────────┤
│ FINAL CTA                          │ ← email form + urgencia real
├────────────────────────────────────┤
│ FOOTER                             │ ← legal, contact, RSS
└────────────────────────────────────┘
```

**Principio de diseño:** **una sola CTA (waitlist). En todas las secciones.** No navegación tipo "Features / Pricing / About" — eso dispersa. El visitante puede ir a la waitlist desde 5 puntos de la página, pero nunca a otra página.

---

## 2. Copy bilingüe sección por sección

### SECCIÓN 1 — NAV

**Estructura:**
```
[Logo: Impulso BioCycle]      [ES | EN]     [Join waitlist →]
```

- **Altura:** 64px, sticky en scroll (fade-in opaco después de 80px scroll)
- **CTA nav:** igual que la del Hero — refuerza la acción única

---

### SECCIÓN 2 — HERO (el Why)

**Layout:** grid 2 columnas desktop / stack móvil. Izquierda texto, derecha video 60–90s.

#### Copy ES

```
[Kicker:] PARA EQUIPOS HSEQ QUE NO PUEDEN ESPERAR 8 AÑOS MÁS

[H1 — belief statement, 2 líneas max:]
La contaminación no es inevitable.
Es un problema de inteligencia aplicada.

[Sub — 1–2 líneas, explica el qué:]
Diseñamos consorcios microbianos con IA de frontera para cerrar sitios contaminados en meses, no décadas. Sin plantas de €230M. Sin cápsulas para playas. Solo ciencia aplicada a tu sitio específico.

[CTA primaria — botón + input de email inline:]
┌──────────────────────────────────────┐
│ tu@correo.com              [Join →]  │
└──────────────────────────────────────┘
[Sub-CTA:] Entra a la waitlist. Los 100 primeros reciben early access + piloto con 50% de descuento.

[Social proof counter — pequeño, debajo del CTA:]
🌎 147 profesionales se unieron desde 23 países esta semana
```

#### Copy EN

```
[Kicker:] FOR HSE TEAMS WHO CAN'T WAIT 8 MORE YEARS

[H1:]
Contamination isn't inevitable.
It's a problem of applied intelligence.

[Sub:]
We design microbial consortia with frontier AI to close contaminated sites in months, not decades. No €230M plants. No beach capsules. Just real science applied to your specific site.

[CTA:]
┌──────────────────────────────────────┐
│ you@work.com               [Join →]  │
└──────────────────────────────────────┘
[Sub-CTA:] Join the waitlist. The first 100 get early access + 50% off on the pilot.

[Counter:]
🌎 147 professionals joined from 23 countries this week
```

**Video hero (60–90s) — script de fundadora:**
- 0–10s: "Soy [Nombre], construí Impulso BioCycle porque llevo 8 años viendo cómo equipos ambientales se quedan atrapados entre multas de millones y contratistas que cobran $40M por 8 años."
- 10–30s: "El problema real no es la falta de ciencia. FAST-PETase existe. Los consorcios microbianos funcionan. Lo que falta es la inteligencia que diseña la receta exacta para tu sitio específico."
- 30–60s: "Usamos los mismos modelos que DeepMind y el Baker Lab — AlphaFold 3, RFDiffusion 2, ESM-3 — aplicados a algo que ellos no tocan: qué 4 bacterias degradan TU contaminante bajo TUS condiciones."
- 60–90s: "Estamos construyendo esto en público durante 7 días. Si eres parte del equipo que cierra sitios, quiero tu email. Los primeros 100 reciben early access. Únete."

**Grabación sugerida:** iPhone vertical O landscape 1920×1080, luz natural lateral, micro LAV $30, fondo neutro o brand green. Re-tomar hasta sonar conversacional, no memorizado.

---

### SECCIÓN 3 — SOCIAL PROOF STRIP

**Layout:** banda horizontal con logos en grayscale.

```
CIENCIA PUBLICADA EN · PUBLISHED IN

[Nature] [Science] [ACS Catalysis] [PNAS] [Nobel Química 2024]

ALIANZAS EN DISCUSIÓN · PARTNERSHIPS IN DISCUSSION

[Logo Javeriana] [Logo UNAL] [Logo UTB Bolívar]
```

**Nota legal:** "en discusión" es honesto si aún no hay MoU firmado. No usar logos sin permiso — reemplazar con texto "Universidad Javeriana · UNAL · UTB" en tipografía institucional si no hay permiso escrito.

---

### SECCIÓN 4 — EL PROBLEMA (emotional anchor con datos)

**Layout:** 3 columnas con stat card + 1 quote grande abajo.

#### Copy ES

```
[H2:] El problema ya cuesta demasiado.

┌──────────────┬──────────────┬──────────────┐
│   $175B      │   6 meses    │   13%        │
│ Remediación  │ promedio en  │ de empresas  │
│ PFAS USA al  │ "monitoreo   │ cumple ESG   │
│ 2027         │ activo" sin  │ regulations  │
│              │ avance       │              │
└──────────────┴──────────────┴──────────────┘

[Quote grande, itálica, del avatar verificado:]
"Nuestro contratista cobró $2M y el sitio sigue contaminado.
El VP me pidió un plan. No tengo uno que le guste."
— Gerente HSEQ, petrolera mid-size, Colombia
```

#### Copy EN

```
[H2:] The problem costs too much already.

┌──────────────┬──────────────┬──────────────┐
│   $175B      │   6 months   │   13%        │
│ Projected    │ average in   │ of companies │
│ PFAS cleanup │ "active      │ on track     │
│ cost by 2027 │ monitoring"  │ with ESG     │
│ (US)         │ with no      │ regulations  │
│              │ progress     │              │
└──────────────┴──────────────┴──────────────┘

[Quote:]
"Our contractor charged $2M and the site is still contaminated.
The VP asked me for a plan. I don't have one he'll like."
— HSE Manager, mid-size oil & gas, USA
```

**Fuentes (pie pequeño):** "Minnesota Pollution Control 2024 · GAO Superfund Report 2024 · A&M ESG Fatigue Report 2025"

---

### SECCIÓN 5 — EL SUEÑO (visión aspiracional)

**Layout:** texto narrativo + visual/GIF central.

#### Copy ES

```
[H2:] Imagina un mundo donde...

Un Gerente HSEQ en Bogotá sube el contaminante de su sitio a una plataforma.
En 90 segundos recibe:
 · La combinación exacta de microorganismos BSL-1 que lo degrada
 · La cápsula o biorreactor óptimo para sus condiciones
 · La curva de degradación semana a semana, con incertidumbre calibrada
 · Un protocolo que su equipo ejecuta sin contratista externo
 · Datos auditables que la CAR/ANLA acepta

En 90 días el sitio se cierra. El VP firma el bono. El equipo pasa al próximo sitio.

Eso es lo que estamos construyendo.

[Visual:] GIF animado 15s — screenshots en secuencia de la app actual:
[1] Input: "PET en biorreactor, 50°C, pH 8, 100kg"
[2] Loading: "Diseñando consorcio óptimo..."
[3] Output: receta con 4 microorganismos + gauge 87% éxito
[4] Curva de degradación semana a semana
[5] Protocolo de despliegue
```

#### Copy EN

```
[H2:] Imagine a world where...

A Remediation PM in Houston uploads her site's contaminant to a platform.
In 90 seconds she receives:
 · The exact BSL-1 microorganism combination that degrades it
 · The optimal capsule or bioreactor for her conditions
 · The week-by-week degradation curve, with calibrated uncertainty
 · A protocol her team executes without external contractor
 · Auditable data the EPA accepts

In 90 days the site closes. The VP signs the bonus. The team moves to the next site.

That's what we're building.

[Visual: same GIF animation]
```

---

### SECCIÓN 6 — EL HOW (metodología en 3 pasos)

**Layout:** 3 tarjetas horizontales con ícono + título + bullet.

#### ES

```
[H2:] Cómo funciona

┌─────────────────┬─────────────────┬─────────────────┐
│ 1. DESCRIBE     │ 2. LA IA DISEÑA │ 3. DESPLIEGA    │
│                 │                 │                 │
│ Tu contaminante │ RFDiffusion 2 + │ Recibe el       │
│ + condiciones   │ ESM-3 + búsqueda│ protocolo, la   │
│ del sitio       │ estilo AlphaGo  │ curva predicha  │
│                 │ sobre 800 cepas │ y los datos     │
│                 │ BSL-1           │ auditables      │
└─────────────────┴─────────────────┴─────────────────┘
```

#### EN

```
[H2:] How it works

┌─────────────────┬─────────────────┬─────────────────┐
│ 1. DESCRIBE     │ 2. AI DESIGNS   │ 3. DEPLOY       │
│                 │                 │                 │
│ Your contaminant│ RFDiffusion 2 + │ Get the         │
│ + site          │ ESM-3 + AlphaGo-│ protocol, the   │
│ conditions      │ style search    │ predicted curve │
│                 │ across 800+     │ and auditable   │
│                 │ BSL-1 strains   │ data            │
└─────────────────┴─────────────────┴─────────────────┘
```

---

### SECCIÓN 7 — EL WHAT (AI moat + ciencia)

**Layout:** 2 columnas. Izquierda texto, derecha lista de tech stack con logos pequeños.

#### ES

```
[H2:] No reinventamos la ciencia. La integramos.

Los mejores modelos de biología del mundo se publicaron entre 2024 y 2026:

 · AlphaFold 3 (DeepMind) — predice afinidad enzima-sustrato
 · RFDiffusion 2/3 (Baker Lab) — diseña enzimas de novo
 · ESM-3 (EvolutionaryScale) — protein language model generativo
 · AlphaProteo (DeepMind) — diseña binders para contaminantes nuevos

Nuestro foso no es construir estos modelos. Es aplicarlos al problema
que nadie ataca: **búsqueda combinatoria tipo AlphaGo sobre 800
microorganismos** para encontrar los 4 que degradan tu contaminante bajo
tus condiciones. El espacio de búsqueda es 10^12 combinaciones.

[Pequeño: "Ver paper técnico →" link a un Notion público o PDF con el resumen.]
```

#### EN

```
[H2:] We don't reinvent the science. We integrate it.

The best biology models in the world were published between 2024 and 2026:

 · AlphaFold 3 (DeepMind) — predicts enzyme-substrate affinity
 · RFDiffusion 2/3 (Baker Lab) — designs de novo enzymes
 · ESM-3 (EvolutionaryScale) — generative protein language model
 · AlphaProteo (DeepMind) — designs binders for novel contaminants

Our moat isn't building these models. It's applying them to the problem
nobody else attacks: **AlphaGo-style combinatorial search across 800+
microorganisms** to find the 4 that degrade your contaminant under your
conditions. The search space is 10^12 combinations.

[Small: "See technical brief →" link to a public Notion or PDF.]
```

---

### SECCIÓN 8 — QUIÉN LO CONSTRUYE

**Layout:** foto(s) + bio de 2–3 líneas.

#### ES

```
[H2:] Quién lo construye

[Foto redonda de fundadora]

[Nombre Fundadora]
Ingeniera Biológica · 8 años en biorremediación aplicada · Premio Nacional de
Biotecnología 2024 · Ex-[institución].

"Empecé esto porque en 8 años vi suficientes sitios que podrían haberse cerrado
en meses si hubiera existido una IA que diseñara la receta correcta. Ahora la
estoy construyendo."

[Si hay co-founder técnico, agregar segunda tarjeta.]
```

#### EN

```
[H2:] Who's building this

[Founder photo]

[Founder Name]
Biological Engineer · 8 years in applied bioremediation · 2024 National
Biotechnology Prize · Ex-[institution].

"I started this because in 8 years I've seen enough contaminated sites that
could have closed in months if the right AI existed to design the recipe.
Now I'm building it."
```

---

### SECCIÓN 9 — BUILD IN PUBLIC (momentum social)

**Layout:** carousel o grid 3x1 con los últimos 3 posts de LinkedIn/X. Auto-update vía RSS o manual.

```
[H3:] Construyendo en público

┌────────────────┬────────────────┬────────────────┐
│ [Post LinkedIn │ [Post X]       │ [Post LinkedIn │
│  Día 1: N      │  Día 2: pain   │  Día 3: quote  │
│  signups de X  │  del avatar    │  del form      │
│  países]       │  anonimizado]  │  anonimizado]  │
│                │                │                │
│ [Ver en →]     │ [Ver en →]     │ [Ver en →]     │
└────────────────┴────────────────┴────────────────┘
```

**Implementación rápida:** embed manual — reemplazar cada 24h con los 3 posts más recientes.

---

### SECCIÓN 10 — FINAL CTA

**Layout:** ancho completo, fondo verde profundo (brand), texto blanco centrado.

#### ES

```
[H2, grande:]
No es el próximo contratista.
Es el próximo paradigma.

[Sub:]
Si cierras sitios contaminados, te queremos en la waitlist.
Los primeros 100 reciben early access + piloto con 50% de descuento.

[Email form inline:]
┌──────────────────────────────────────┐
│ tu@correo.com              [Join →]  │
└──────────────────────────────────────┘

[Counter dinámico abajo:]
147 profesionales se unieron. 953 plazas restantes para early access.
```

#### EN

```
[H2:]
Not the next contractor.
The next paradigm.

[Sub:]
If you close contaminated sites, we want you on the waitlist.
The first 100 get early access + 50% off on the pilot.

[Form:]
┌──────────────────────────────────────┐
│ you@work.com               [Join →]  │
└──────────────────────────────────────┘

[Counter:]
147 professionals joined. 953 early-access spots left.
```

---

### SECCIÓN 11 — FOOTER

**Layout:** 4 columnas pequeñas + copyright.

```
LEGAL              CONTACT           FOLLOW            LATEST
 · Privacy         · hello@           · LinkedIn        · Blog (post-launch)
 · Terms            biocycle.ai       · X               · Newsletter archive
 · Cookies         · For partners                        · RSS
                    (link form)

© 2026 Impulso BioCycle. Building in public · Red Bull Basement Colombia alumni.
```

---

## 3. Tono y reglas de copy

**Tono ES:** directo, cálido, confiado. No "plataforma de vanguardia de inteligencia artificial aplicada". Sí: "IA que diseña la receta exacta para tu sitio".

**Tono EN:** punchier, más KPI-driven. Short sentences. Verbs first.

**Reglas universales:**
1. **Ningún hook ni copy contradice `ADS-HOOKS.md` §6 (frases prohibidas).** Especialmente: no decir "AlphaFold diseña tu enzima" (licencia CC-BY-NC-SA); no decir "el plástico desaparece".
2. **Si una cifra aparece, tiene fuente visible (pie de página o tooltip).**
3. **"Waitlist" > "demo" > "trial"** — el avatar B2B senior responde mejor a pertenencia que a consumo.
4. **El email es el único campo obligatorio en Hero CTA.** Todo lo demás va al form del thank-you page (ver `WAITLIST-FORM.md`).
5. **Sin testimonios falsos.** Si no tenemos quotes reales aún, mostrar quotes del research (`.research-external.md` §2) con atribución genérica ("HSE Manager, oil & gas, USA").

---

## 4. Diseño visual — paleta y tipografía

Reusar paleta existente de la app (`artifacts/impulso-biocycle/views/inicio.py:5-12`):

- Fondo principal: blanco `#FFFFFF` (NOT dark mode — genera confianza en B2B)
- Fondo Hero + Final CTA: verde profundo `#004D2C`
- Verde brillante (acentos, links): `#00C853`
- Cian eléctrico (CTAs): `#00D9F5`
- Texto: `#0A1F12` sobre blanco, `#FFFFFF` sobre verde
- Footer: `#0A1F12`

**Tipografía:**
- Headings: Inter Display 800 o similar (alt: system default)
- Body: Inter 400/500
- Monospace (para code snippets / stats): JetBrains Mono

**Espaciado:** generoso. 80–120px vertical entre secciones desktop. No comprimir.

---

## 5. SEO / OG / técnica

### Meta tags (paralelo EN+ES)

```html
<!-- ES (biocycle.ai/es) -->
<title>Impulso BioCycle — IA para biorremediación | Waitlist</title>
<meta name="description" content="Diseñamos consorcios microbianos con IA de frontera para cerrar sitios contaminados en meses, no décadas. Únete a la waitlist.">
<meta property="og:title" content="La contaminación no es inevitable. Es un problema de inteligencia.">
<meta property="og:description" content="IA que diseña la receta exacta de bacterias para tu contaminante y tu sitio. Waitlist abierta — primeros 100 con early access.">
<meta property="og:image" content="https://biocycle.ai/og-es.png">
<meta property="og:locale" content="es_CO">

<!-- EN (biocycle.ai/en) -->
<title>Impulso BioCycle — AI for bioremediation | Join the waitlist</title>
<meta name="description" content="We design microbial consortia with frontier AI to close contaminated sites in months, not decades. Join the waitlist.">
<meta property="og:title" content="Contamination isn't inevitable. It's a problem of applied intelligence.">
<meta property="og:image" content="https://biocycle.ai/og-en.png">
<meta property="og:locale" content="en_US">
```

### OG images

- Tamaño: 1200×630px
- Contenido: tipografía grande con tagline + logo + background green gradient
- Herramienta rápida: Figma template "OG image" o Canva

### Performance

- Lazy-load video Hero (poster frame first)
- WebP para todas las imágenes
- Font-display: swap
- Target: LCP <2.5s móvil 4G

### Analytics events

Eventos a trackear en Plausible/GA:
- `page_view` (landing)
- `video_play` (hero)
- `video_complete` (>80%)
- `cta_click` (cualquier botón waitlist)
- `waitlist_signup` (success form hero)
- `waitlist_form_start` (thank-you page)
- `waitlist_form_complete` (thank-you page)
- `calendly_click` (tier 2)

---

## 6. Stack técnico recomendado (para construir en 1 día)

**Ruta A — Framer (recomendada para 7 días):**
- Template base: "SaaS Landing with Waitlist" en Framer Marketplace
- Duplicar páginas para `/es` y `/en`
- Form → conectar a ConvertKit o Beehiiv via native integration
- Tiempo estimado: 4–6h día 2

**Ruta B — Next.js + Tailwind + shadcn (si preferimos ownership):**
- Repo nuevo `artifacts/landing/` con Next 14 App Router
- Componentes shadcn: `Button`, `Input`, `Card`
- i18n con next-intl (rutas `/es` y `/en`)
- Form → Formspree endpoint o API route → Resend email
- Deploy en Vercel
- Tiempo estimado: 1–2 días dev

**Ruta C — HTML estático + Alpine.js + Vercel:**
- 1 sola página HTML con toggle ES/EN via Alpine
- Form submit → Formspree
- Tiempo estimado: 6–8h
- Pros: cero lock-in, código propio

**Para 7 días → Ruta A (Framer).** Para el post-launch Q3 2026 migrar a Ruta B si el producto crece.

---

## 7. Checklist de contenido (antes de publicar)

- [ ] Video hero grabado y editado (<10MB)
- [ ] GIF animado "cómo funciona" exportado (<3MB)
- [ ] OG images EN + ES (1200×630)
- [ ] Favicon SVG + PNG 32x32
- [ ] Logo en SVG (reusar el existente o simplificar)
- [ ] Foto(s) de fundadora (mínimo 1 — alta calidad)
- [ ] Privacy policy (generator: Termly / Iubenda, 15 min)
- [ ] Terms of service mínimo (generator)
- [ ] Email de bienvenida redactado (ver `WAITLIST-FORM.md` §5)
- [ ] Calendly configurado con 1 event type "Discovery 20 min"
- [ ] ConvertKit/Beehiiv cuenta creada + automation "signup → welcome email"
- [ ] Counter inicial: manual a 25 (credibilidad mínima para no mostrar "0")
- [ ] Test cross-device: Chrome + Safari + Android + Firefox
- [ ] Test fast path: 30 segundos desde landing load → email enviado

---

## 8. Lo que NO incluimos (para que quepa en 7 días)

- ❌ Menú de navegación tradicional (Features/Pricing/About)
- ❌ Pricing (no vendemos nada)
- ❌ Testimoniales falsos o inventados
- ❌ Multi-idioma más allá de EN+ES
- ❌ Blog integrado (post-launch)
- ❌ Login / account / dashboard (no hay producto aún)
- ❌ Dark mode (añade 30% de tiempo, no mueve conversión en B2B)
- ❌ Chatbot (el avatar no lo quiere)

---

## 9. Tres inspiraciones específicas (referencias de landing)

Para el equipo de diseño, estudiar estas landings **antes** de empezar:

1. **Linear.app** — simplicidad brutal, una CTA, belief-first headline, video Hero.
2. **Arc Browser (arc.net)** — "A better way to use the internet" = belief. Copy corto, visuales aspiracionales.
3. **Superhuman (pre-launch waitlist, archivado)** — ícono de waitlist exclusivo, counter, pain real.

Ninguna es B2B biotec, pero las 3 tienen el patrón "movement + waitlist + simplicidad" que necesitamos.

---

## 10. Próximo paso inmediato

**Después de aprobar este spec:**

1. Decidir herramienta (Framer / Next.js / HTML) — recomendación: Framer.
2. Comprar dominio (`biocycle.ai` o `impulsobiocycle.com`).
3. Grabar video fundadora (2 horas).
4. Construir landing día 2 (T-6).
5. Ver `WAITLIST-FORM.md` para el form del thank-you page.
