---
title: Waitlist Form — Thank-you page discovery survey (EN + ES)
last_updated: 2026-04-17
languages: ES + EN paralelo
audience: anyone building the form (Tally / Typeform / Formspree / Google Forms)
principle: The Mom Test adapted to async form — preguntas de comportamiento pasado, nunca hipotéticas
---

# Waitlist Form — preguntas del Thank-You page

> **Principio operativo:** cada pregunta pregunta por **comportamiento pasado u observable**, nunca por opinión hipotética. El Mom Test aplicado a formularios (`CUSTOMER-DISCOVERY-INTERVIEW.md` §5) sigue valiendo: "¿pagarías?" = trampa; "¿cuánto pagaste la última vez?" = oro.

---

## 1. Filosofía del form

### Lo que estamos optimizando

1. **Completion rate >55%.** Si el form es muy largo, lo abandonan y perdemos la señal.
2. **Señal cualitativa > volumen de campos.** 6–8 preguntas focalizadas > 20 checkboxes genéricos.
3. **Segmentación automática a 🟢🟡🔴.** El form clasifica al signup para priorizar outreach tier 2.
4. **Quote library generator.** La pregunta abierta ("¿qué es lo más frustrante?") produce los quotes textuales que van a `ADS-HOOKS v2`.

### Lo que NO hacemos

- ❌ Pedir teléfono, cargo completo, tamaño de empresa — crea fricción y el avatar con pocos minutos abandonará.
- ❌ Dropdowns largos (más de 8 opciones).
- ❌ Preguntas hipotéticas ("¿pagarías por esto?").
- ❌ Preguntas sobre nuestra solución ("¿te gusta la idea de…?").

### Mecánica de incentivo

> **"Los primeros 100 que completen el formulario reciben early access + piloto con 50% de descuento."**

Esto activa reciprocidad + scarcity sin mentir: el early access y el descuento del piloto son legítimos para los primeros 100 que muestren intención real.

---

## 2. Thank-you page — copy de framing

### ES

```
[H1:]
¡Estás dentro!

[Sub:]
Recibirás actualizaciones semanales del build-in-public y un aviso
cuando abramos early access.

───────────────────────────────────────────────────────────────

[H2, destacado:]
Ayúdanos a priorizarte: 2 minutos que importan.

[Copy corto — honesto:]
Somos un equipo pequeño y vamos a atender manualmente a los primeros
100 signups que completen este formulario. Responderlo te pone en esa
fila — además de early access + 50% de descuento en el piloto.

[Progress bar: "0 de 6 preguntas"]

[Form abajo ↓]
```

### EN

```
[H1:]
You're in!

[Sub:]
You'll get weekly build-in-public updates and a heads-up when
we open early access.

───────────────────────────────────────────────────────────────

[H2:]
Help us prioritize you: 2 minutes that matter.

[Copy:]
We're a small team manually onboarding the first 100 signups who
complete this form. Filling it puts you in that queue — plus early
access and 50% off on the pilot.

[Progress bar: "0 of 6 completed"]

[Form below ↓]
```

---

## 3. Las 6 preguntas core (versión corta, recomendada)

> **Por qué 6 y no 10:** data interna de Typeform 2024 muestra drop-off del 8–12% por cada pregunta después de la #6. 6 es el sweet spot completion/señal.

### Pregunta 1 — Rol (obligatoria)

**ES:** ¿Cuál es tu cargo actual?
**EN:** What's your current role?

**Tipo:** Multiple choice con "Otro" — opción libre al final.

**Opciones (el mismo array en ambos idiomas, las etiquetas cambian):**
```
[ ] Gerente HSEQ / HSE Manager / Director
[ ] Coordinador HSEQ / Environmental Engineer
[ ] Remediation Project Manager
[ ] Sustainability Director / CSO
[ ] Environmental Consultant
[ ] Investigador / Académico / Researcher / Academic
[ ] Founder / CEO / Investor
[ ] Otro (especifica) / Other (specify)
```

**Por qué esta pregunta:** segmentación inmediata. Académicos e investigadores → tier amarillo, anti-avatar parcial. Founder/CEO/Investor → tier verde si también tienen pain real, tier rojo si son solo curiosos.

**Scoring auto:**
- Gerente HSEQ / Remediation PM / Sustainability Director = +2
- Coordinator / Engineer = +1
- Consultant = 0
- Investigador / Founder = −1 (no son comprador primario)

---

### Pregunta 2 — País y sector (obligatoria)

**ES:** ¿En qué país trabajas y en qué sector?
**EN:** Which country do you work in, and in which sector?

**Tipo:** 2 campos en una fila.
- Campo 1: Dropdown país (lista corta — top 20 países: USA, UK, DE, NL, ES, AU, SG, JP, Colombia, México, Brasil, Chile, Argentina, Perú, India, China, Canada, France, Italy, "Other").
- Campo 2: Dropdown sector (Oil & Gas · Chemicals · Mining · Water Utilities · Manufacturing · Agriculture · Textile · Defense/Military · Consulting · Government/Public · Academia · Other).

**Por qué:** valida el mapa de avatar regional (`AVATAR-IDEAL.md` §1). Si 50% de signups son India + Academia, el avatar real no es LATAM petróleo — debemos replantear.

---

### Pregunta 3 — ¿Cuál es el problema? (open text — la joya)

**ES:** En una frase: ¿cuál es el mayor dolor de cabeza ambiental en tu equipo hoy?
**EN:** In one sentence: what's your team's biggest environmental headache right now?

**Tipo:** Text area, 300 char max.

**Placeholder ES:** Ejemplo: "Tengo un sitio con PCBs que lleva 3 años abierto y la CAR pidió plan en 60 días."

**Placeholder EN:** Example: "I have a PCB site that's been open for 3 years and the state EPA wants a plan in 60 days."

**Por qué:** **esta es la pregunta más valiosa de todo el form.** Produce los quotes textuales que alimentan `ADS-HOOKS v2`. También identifica pain intensity — las respuestas de 1 línea genérica son rojo/amarillo; las de 3 líneas con números y nombres son verde.

**Scoring auto:**
- Respuesta con contaminante específico + fecha/deadline = +2 (verde fuerte)
- Respuesta con sitio contaminante pero sin fecha = +1
- Respuesta genérica "mejorar sostenibilidad" = 0
- Respuesta vacía o "no tengo uno ahorita" = −1

---

### Pregunta 4 — Experiencia pasada (comportamiento, no hipótesis)

**ES:** En los últimos 12 meses, ¿qué has probado para remediar sitios contaminados?
**EN:** In the last 12 months, what have you tried for site remediation?

**Tipo:** Checkbox múltiple.

**Opciones:**
```
[ ] Biorremediación tradicional (bioestimulación / bioaumentación)
    Traditional bioremediation (biostimulation / bioaugmentation)
[ ] Incineración / disposición en relleno
    Incineration / landfill disposal
[ ] Oxidación química / tratamiento físico-químico
    Chemical oxidation / physical-chemical treatment
[ ] Excavación + tratamiento fuera de sitio
    Excavation + off-site treatment
[ ] Fitorremediación
    Phytoremediation
[ ] Atenuación natural monitoreada
    Monitored natural attenuation
[ ] Nada todavía — estamos evaluando opciones
    Nothing yet — still evaluating options
[ ] Otro (especifica) / Other (specify)
```

**Por qué:** revela category awareness + experiencia previa. Si marcó "Nada todavía" = probable tier amarillo (sin urgencia). Si marcó 3+ métodos = alguien que lleva tiempo luchando = tier verde.

**Scoring auto:**
- 3+ métodos marcados = +2
- 1–2 métodos = +1
- "Nada todavía" = 0

---

### Pregunta 5 — Timeline + presupuesto (aproximado, no exacto)

**ES:** ¿Cuándo necesitas resolver este problema?
**EN:** When do you need to solve this?

**Tipo:** Single choice.

**Opciones:**
```
[ ] Esta semana — tengo un plazo regulatorio / board request
    This week — I have a regulatory deadline / board request
[ ] En los próximos 3 meses
    In the next 3 months
[ ] En 6–12 meses
    In 6–12 months
[ ] El próximo año fiscal o más tarde
    Next fiscal year or later
[ ] No hay un timeline claro aún
    No clear timeline yet
```

**Por qué:** la urgencia del timeline es el predictor #1 de cierre en B2B. "Esta semana" + "1-3 meses" = tier verde inmediato. "Sin timeline" = rojo o amarillo.

**Scoring auto:**
- Esta semana = +3
- 3 meses = +2
- 6–12 meses = +1
- Próximo año = 0
- Sin timeline = −1

---

### Pregunta 6 — ¿Quieres hablar? (qualifier final)

**ES:** ¿Estarías abierto a 20 minutos de conversación esta o la próxima semana?
**EN:** Would you be open to a 20-minute call this week or next?

**Tipo:** Single choice + conditional redirect.

**Opciones:**
```
[ ] Sí — envíame opciones de agenda ahora
    Yes — send me scheduling options now
         → redirect a Calendly al submit
[ ] Sí, pero la próxima semana
    Yes, but next week
         → flag en CRM para outreach día 8
[ ] No ahora, pero mantenme informado
    Not right now, but keep me posted
         → tier amarillo, newsletter
[ ] Prefiero que esperen a que abran early access
    I'd rather wait until early access opens
         → tier verde pasivo
```

**Por qué:** el self-select separa high-intent de curiosos **sin forzar commitment**. No pedir call directamente (presión); dar la opción + mostrar que respetamos el tiempo del avatar.

**Scoring auto:**
- Yes ahora = +3 (🟢 verde fuerte)
- Yes next week = +2 (🟢 verde)
- Keep me posted = 0 (🟡 amarillo)
- Wait for early access = +1 (🟢 verde pasivo — cliente paciente)

---

## 4. Scoring final — clasificación 🟢🟡🔴

Suma los puntos de P1 + P3 + P4 + P5 + P6 (P2 es demográfico, no puntúa).

| Score total | Color | Acción |
|---|---|---|
| ≥ 8 puntos | 🟢 Verde fuerte | Calendly immediate + outreach personal del fundador <24h |
| 5–7 puntos | 🟢 Verde normal | Newsletter + outreach semana 2 + invitación a pilot cohort |
| 2–4 puntos | 🟡 Amarillo | Newsletter mensual + check-in trimestral |
| ≤ 1 punto | 🔴 Rojo | Lista básica de updates, no outreach activo |

**Importante:** el score es visible **solo internamente**. El avatar no lo ve. Después del submit, todos ven el mismo mensaje de gracias.

---

## 5. Mensajes post-submit (condicional por score)

### ES — si score ≥ 8 (🟢 fuerte)

```
[H2:]
Gracias por compartir. Queremos hablar contigo esta semana.

[Copy:]
Con lo que acabas de contarnos, encajas justo en quienes estamos priorizando
para los primeros pilotos. Elige un horario abajo y te envío contexto antes.

[Botón:] → Agendar 20 min ahora (Calendly embed)

[Copy bajo botón:] Si ahora no, respóndeme este email que te mando en
las próximas 2 horas.
```

### EN — if score ≥ 8

```
[H2:]
Thanks for sharing. We want to talk with you this week.

[Copy:]
Based on what you shared, you fit exactly who we're prioritizing for the
first pilots. Pick a time below and I'll send context before the call.

[Button:] → Schedule 20 min now (Calendly embed)

[Below button:] If now doesn't work, just reply to the email landing in
your inbox in the next 2 hours.
```

### ES — si score 2–7 (verde normal o amarillo)

```
[H2:]
Gracias.

[Copy:]
Te acabamos de agregar a la waitlist priorizada. Vas a recibir:
 · Updates semanales del build-in-public
 · Aviso con 1 semana de anticipación cuando abramos early access
 · Invitación al primer pilot cohort (empieza ~Q3 2026)

Responde este correo si quieres algo específico antes.
```

### EN — if score 2–7

```
[H2:]
Thanks.

[Copy:]
You're now on the priority waitlist. You'll get:
 · Weekly build-in-public updates
 · A week's notice before early access opens
 · Invitation to the first pilot cohort (starts ~Q3 2026)

Reply to the confirmation email if you want anything specific before then.
```

### ES/EN — si score ≤ 1 (🔴)

```
(Mismo mensaje genérico que el 2–7, sin diferenciar — el avatar no debe
sentirse descartado. Solo internamente sabemos que no haremos outreach
activo.)
```

---

## 6. Email de bienvenida (enviar automáticamente post-submit)

### Versión ES

```
Asunto: Estás dentro — así es como va a funcionar

Hola,

Gracias por sumarte a la waitlist de Impulso BioCycle.

Lo que sigue:

1. **Esta semana** (días 1–7 del build-in-public): vas a recibir 2 emails
   con los hallazgos de los primeros signups — pain patterns por país,
   top quotes, lo que estamos aprendiendo.

2. **Semana del 24-abr**: presentamos el proyecto al Basement Colombia.
   Te mando el recap con la data que recolectamos en los 7 días.

3. **Q3 2026**: abrimos early access para los primeros 100. Estás en
   esa lista.

Mientras tanto — responde este correo con lo que más te frustra de tu
trabajo hoy. Lo leo personalmente. Si quieres, agendemos 20 min:
[Link Calendly]

[Firma fundadora]
Fundadora, Impulso BioCycle
[LinkedIn]

PD — si quieres seguir el build-in-public en vivo: [Link LinkedIn] + [Link X]
```

### Versión EN

```
Subject: You're in — here's how this will work

Hi,

Thanks for joining Impulso BioCycle's waitlist.

What happens next:

1. **This week** (days 1–7 of building in public): you'll get 2 emails
   with findings from our first signups — pain patterns by country,
   top quotes, what we're learning.

2. **Week of Apr 24**: we pitch the project at Basement Colombia. I'll
   send you a recap with the data we gathered in the 7 days.

3. **Q3 2026**: we open early access for the first 100. You're on that
   list.

In the meantime — reply to this email with what frustrates you most about
your work right now. I read personally. If you'd rather, let's talk 20 min:
[Calendly link]

[Founder signature]
Founder, Impulso BioCycle
[LinkedIn]

PS — want to follow the build-in-public live? [LinkedIn link] + [X link]
```

---

## 7. Herramienta sugerida para el form

| Tool | Pros | Cons | Recomendación |
|---|---|---|---|
| **Tally.so** | Gratis ilimitado, buen UI, webhook → Google Sheet + ConvertKit, conditional logic | Branding Tally visible en free | ✅ **#1** para 7 días |
| **Typeform** | UX premium, conversational | $25/mes mínimo para features que necesitamos | #2 si hay budget |
| **Google Forms** | Gratis, familiar | UX pobre, no branding propio | Evitar — baja el perceived value |
| **Formspree** | Gratis 50/mes, connect a cualquier HTML | Solo emails + básico | Mejor para form del Hero, no para discovery |

**Recomendación firme:** **Tally** para el thank-you form. Branding tolerable, webhook a Airtable para tracking, integración nativa con ConvertKit para automatizar emails.

---

## 8. Tracking sheet (Airtable / Google Sheet recomendado)

Columnas mínimas:

```
| Timestamp | Email | Country | Sector | Role | Pain (open) | Past methods |
| Timeline | Call intent | Score | Color | Segment (LATAM/EU/USA/APAC) |
| Next step | Owner | Updated |
```

**Airtable automations útiles:**
- Score ≥ 8 → Slack notification al fundador + email inmediato
- Score ≥ 5 → tag "tier 2" para outreach semana 2
- Pain contiene ["PFAS", "Superfund", "CERCLA"] → tag "USA urgency"
- Pain contiene ["Ley 2387", "ANLA", "CAR"] → tag "LATAM urgency"

---

## 9. KPIs del form (medición post-launch)

- **Completion rate:** % que terminan el form después de entrar a thank-you. Objetivo >55%. <40% = simplificar.
- **🟢 rate:** % de completions que scorean ≥ 5. Objetivo >25%. <15% = targeting de ads equivocado.
- **Open-text length promedio:** palabras en P3. Objetivo >15. <8 palabras = pain weak.
- **Call acceptance rate:** % que dicen "Sí ahora" en P6. Objetivo >15% de completions.

Revisar métricas cada 48h los días 4–7. Iterar copy del form si alguno está bajo meta.

---

## 10. Versión simple (de emergencia — si Tally no está listo)

Si el día 2 el form de Tally no está listo y necesitas algo en 20 minutos:

**Google Form con solo 3 preguntas:**
1. Rol (dropdown)
2. País + sector (text)
3. "¿Cuál es tu mayor dolor de cabeza ambiental hoy?" (paragraph)

Esto captura el 80% del valor. Las otras 3 preguntas se pueden enviar en un email follow-up 48h después.

**No uses Google Form para la versión final.** UX barata = menos perceived value. Sirve solo como plan B de 24h.
