# PITCH-OUTLINE — Capital Semilla Nacional · 4 minutos

> **Target:** panel colombiano, Capital Semilla Nacional (fase **previa** al Red Bull Basement final).
> **Presentadora:** fundadora (ingeniera biológica colombiana).
> **Tono:** humano, personal, storytelling, genuino, transparente. Vender con certeza emocional ("TE PROMETO QUE ESO ES ASI Y TENGO LA SEGURIDAD") — solo sobre claims que podemos sostener.
> **Regla de oro:** todo hook emocional debe ir seguido por un **bridge honesto al producto real** en la misma slide o en la siguiente.

---

## Sequencing (240 segundos totales)

| Seg | Slide | Propósito | Cronograma |
|---|---|---|---|
| 0–20 | 1 — Hook personal | Abrir con anécdota de campo | Pendiente sesión con Manu + fundadora |
| 20–60 | 2 — Problema (hook emocional) + bridge | Contextualizar urgencia + aterrizar en lo que sí vendemos | ~40s |
| 60–90 | 3 — El pivote honesto | "Esto es lo que hacemos. Y esto es lo que no." | ~30s |
| 90–180 | 4 — Demo en vivo (Streamlit) | Prueba de que el producto existe y funciona | ~90s |
| 180–210 | 5 — Traction | Waitlist + Reddit listening + alianzas universitarias | ~30s |
| 210–230 | 6 — Team + ask | Quiénes somos, cuánto pedimos, para qué | ~20s |
| 230–240 | 7 — Cierre con certeza emocional | "TE PROMETO…" — honestidad como moat | ~10s |

**Slide 8** reservada para Q&A (no cuenta en los 4 min).

---

## Slide-by-slide

### Slide 1 · Hook personal (0–20s)
**Objetivo:** ganar atención emocional antes de decir "bioremediación."
**Contenido:** placeholder. Viene de la sesión de storytelling con Manu + fundadora (workstream F, días 2–3).
**Criterio:** anécdota real, primera persona, específica de lugar (río, planta, laboratorio en Colombia). No métrica. No "Hoy vengo a presentarles…"
**Backup candidate** (hasta que tengamos la anécdota real): primera visita a campo donde vio el problema con sus propios ojos.

**Guardrail:** si la fundadora no puede decir este gancho con la entonación "TE PROMETO QUE ESO ES ASI," se reescribe.

---

### Slide 2 · Problema + bridge honesto (20–60s)
**Hook emocional (opción A — Colombia/LATAM):** "Colombia genera 11.6 millones de toneladas de residuos al año. El 83% termina en rellenos sanitarios que llevan décadas sobre-capacidad. Los lixiviados envenenan acuíferos. Y sabemos — cada microorganismo que puede degradar esos contaminantes está documentado en papers peer-reviewed."
**Hook emocional (opción B — Reddit data, validada con datos del agente Classifier en Semana 2):** verbatim quote más impactante detectada por el pipeline, traducida al contexto colombiano.

**Bridge honesto (crítico):** "No venimos a limpiar playas con cápsulas. No venimos a hacer desaparecer el plástico. Venimos a que ese plástico que hoy cuesta $80/ton en relleno **valga $1,000/ton como monómeros en un biorreactor contenido**. Y a que los suelos contaminados con hidrocarburos y pesticidas — donde sí hay décadas de evidencia in-situ — se remedien con la receta correcta de microorganismos para ese sitio específico."

**Visual:** mapa de Colombia con 3 puntos: 1 relleno saturado, 1 derrame de hidrocarburos, 1 suelo agrícola contaminado. No playas.

---

### Slide 3 · El pivote honesto (60–90s)
**Propósito:** diferenciarnos con transparencia. Esta slide construye credibilidad.

**Contenido:**
> "La biorremediación vive en dos mundos:
> — El lab, donde una enzima FAST-PETase degrada PET en días a 50°C.
> — El campo, donde esa misma enzima, sin biorreactor, degrada 10–20%.
>
> Nadie construye el puente entre esos dos mundos. Nosotras sí.
>
> Diseñamos consorcios microbianos optimizados con IA para UN contaminante específico en UN sitio específico — con los caveats honestos de cada pareja contaminante-aplicación."

**Visual:** tabla comparativa 2 columnas:
- **Biorreactor contenido** (plástico→monómeros TPA+EG vendibles) — TRL 7–9 por componente
- **In-situ** (suelos con HC/pesticidas) — décadas de evidencia de campo

**Regla:** esta slide NO menciona playas, NO menciona "el plástico desaparece," NO promete liberación de GMOs.

---

### Slide 4 · Demo en vivo Streamlit (90–180s — 90s)
**URL:** Streamlit deployed (a pegar post-Semana 4.1).
**QR code:** visible mientras la fundadora habla.
**Flujo de demo (pre-ensayado en Semana 4.3):**
1. (15s) Abrir Chat de Asesoría IA — preguntar: "¿Qué consorcio recomiendas para suelo contaminado con diésel en clima cálido?"
2. (30s) RAG responde citando 2+ papers reales de `data.DISCOVERIES` + consorcio específico de `CONSORTIA_DATA`. Señalar las citaciones: "Esto no es invención. Esto viene de literatura peer-reviewed que nuestra IA cruza en tiempo real."
3. (20s) Cambiar a Portal Cliente → panel **"Escucha Activa"** → mostrar top-3 dolores detectados esta semana por el agente clasificador sobre quejas reales de Reddit (Semana 2.1–2.2).
4. (15s) Cerrar con el contador de signups en vivo de la landing (build-in-public).
5. (10s) "Esto — lo que acaban de ver — no es una maqueta. Es el producto corriendo en Azure."

**Plan B:** si la URL cae o la red falla → Loom de 45s auto-play (Semana 3.6). La fundadora narra en vivo sobre el Loom con las mismas palabras.

---

### Slide 5 · Traction (180–210s — 30s)
**3 bullets, no más:**
- **Waitlist:** N signups (poblada al cierre de la semana anterior al pitch), X% tier-verde (HSEQ managers / remediation PMs dispuestos a agendar descubrimiento).
- **Escucha activa:** N.NNN quejas clasificadas por nuestro agente multi-agente en M subreddits + foros en 30 días. Top 3 avatares validados empíricamente.
- **Alianzas:** UTB (8 cepas antárticas PET), UNAL (hidrocarburos), Javeriana (biorremediación). Propiedad intelectual existente que integramos.

**Visual:** 3 números grandes + 3 logos universitarios.

---

### Slide 6 · Team + Ask (210–230s — 20s)
**Contenido:**
- Fundadora + co-fundador (Manu) — 1 línea de credenciales cada uno, no CV.
- **Ask:** monto específico de Capital Semilla, 3 hitos medibles a 12 meses:
  1. Primer piloto pagado 90 días ($3,000 USD) con lab universitario — hipótesis "IA degrada 2× más que control aleatorio"
  2. 10 clientes piloto en biorreactor contenido o suelo HC/pesticidas
  3. ML senior contratado (gap declarado en `AI-ML-MOAT.md §5`)
- **"Lo que NO pedimos":** no pedimos resolver el problema mañana. Pedimos 12 meses para demostrar la tesis.

---

### Slide 7 · Cierre con certeza emocional (230–240s — 10s)
**Texto literal:**
> "La ciencia ya tiene las respuestas. Nosotras construimos la inteligencia que las saca del lab al mundo real. **Te prometo que eso es así.**"

O variante personal de la fundadora, extraída de la sesión de storytelling (F).

---

### Slide 8 · Backup — "Lo que NO prometemos" (Q&A)
**Visible solo si el jurado pregunta por overclaims.** Esta slide es nuestra arma de transparencia.

Extraer literal de `.research-synthesis.md §11`:
1. NO cápsulas que degradan plástico en playas/ríos/campo abierto
2. NO "el plástico desaparece" — produce monómeros que requieren recuperación
3. NO tiempos de campo basados en datos de lab
4. NO liberación de GMOs al ambiente
5. NO competimos con Carbios — son categorías distintas
6. NO resultados sin disclaimer "estimación basada en literatura"
7. NO SaaS "listo" — primer cliente es piloto 90 días
8. NO TRL > 4 como sistema integrado (aunque componentes son 7–9)

**Frase de cierre:** "La honestidad es nuestro moat, no nuestra debilidad."

---

## Guardrails de producción del deck

### Lint automático (aplicar antes de cada rehearsal)
Pasar el texto completo del deck por estos filtros:
- `marketing/ADS-HOOKS.md §6` — banned phrases
- `.research-synthesis.md §11` — no-prometer list
- `marketing/AI-ML-MOAT.md §5` — 6 cannot-promise items
- Stress test de tono (workstream F): cada claim pasa el "TE PROMETO" test

### Criterios de reescritura
Una slide/claim se reescribe si falla cualquiera de estos:
- [ ] ¿Una persona sin background biotech lo entiende?
- [ ] ¿Tiene una frase personal/genuina (no corporativa)?
- [ ] Si usa un hook emocional, ¿hay bridge honesto dentro de la misma slide o la siguiente?
- [ ] ¿La fundadora puede decirlo con entonación "TE PROMETO QUE ESO ES ASI"?
- [ ] ¿Respeta el pivote A+C de `PIVOTE_BIOCYCLE_REALISTA.md`?

### Metadata de sourcing (no mostrar en slide, mantener en doc de ensayo)
Cada claim del deck tiene que tener una fila en `marketing/CLAIM-AUDIT.md` (workstream G.2) con: TRL, literatura, evidencia de campo, límite, reescritura si falla.

---

## Pendientes para completar el deck v1 (Semana 3, tarea 3.5)

- [ ] Slide 1: anécdota personal de la sesión de storytelling (F, Semana 1 días 2–3)
- [ ] Slide 2: quote verbatim de Reddit más impactante (disponible Semana 2.2)
- [ ] Slide 4: URL pública del Streamlit en Azure (Semana 4.1)
- [ ] Slide 5: números reales de waitlist + signups clasificadas
- [ ] Slide 6: monto específico de Ask
- [ ] Slide 7: cierre elegido vs. default
