# Roadmap 10x — Impulso BioCycle

> **Origen:** síntesis de `.research-synthesis.md` (~30 docs de investigación + pivote 16-abr-2026) + QA visual de la app actual (`.qa-screenshots/`).
>
> **Premisa:** la app actual es un MVP de pitch. Para escalar 10x necesitamos (a) alinear UI con el pivote honesto, (b) cerrar la brecha "feed de demo → producto que un cliente pagaría", (c) construir hacia la arquitectura del proyecto hermano (BioSync Studio) aplicada a biorremediación.

---

## Capa 0 — Hotfixes para la final nacional Red Bull (≤ 1 día)

Cosas que el jurado va a notar y rompen el pitch. Atacarlas YA.

| # | Fix | Archivo | Por qué |
|---|---|---|---|
| 0.1 | Reconciliar "847 microorganismos" vs "50+" entre Inicio y Descubrimientos | `inicio.py:379-389`, `descubrimientos.py:49-61` | Contradicción visible — bandera roja en Q&A |
| 0.2 | Quitar el botón muerto "Descargar reporte" o conectarlo a un endpoint email/PDF real | `disenador.py:827` | Toast "Próximamente" mata credibilidad |
| 0.3 | Cambiar el `st.warning` de "plástico + in-situ" a `st.error` + deshabilitar botón Diseñar | `disenador.py:357-358` | El pivote del 16-abr dice explícitamente: cápsulas NO funcionan para plástico en campo |
| 0.4 | Agregar disclaimer "respuestas pre-cargadas, no IA generativa" en Asesoría IA | `asesoria_ia.py` (header) | El chat es keyword-match — vendiéndolo como IA es overclaim |
| 0.5 | Agregar al footer del Diseñador y Portal: "Estimaciones basadas en literatura peer-reviewed; resultados reales pueden variar según condiciones del sitio" | `disenador.py`, `portal_cliente.py` | Cierra el flanco del Q&A técnico |
| 0.6 | Reescribir copy del Hero: incluir el modelo económico real ("monómeros vendibles a $800–1,600/ton") en lugar de marketing genérico | `inicio.py:208-216` | Diferenciador real vs Carbios — el jurado no lo va a sacar solo |

**Costo total estimado:** 2–4 horas de desarrollo. Impacto en pitch: alto.

---

## Capa 1 — Producto en 30 días (post-Basement, hacia primer piloto)

Estos cambios convierten la demo en algo con lo que se puede pedir un piloto pagado de $3K.

### 1.1 Re-arquitectura de la narrativa de la app

- **Página nueva: "Modo de aplicación"** — selector explícito al iniciar el Diseñador: "(A) biorreactor de laboratorio · (B) biorreactor industrial · (C) suelo in-situ con cápsulas · (D) agua in-situ con cápsulas". Cada opción presenta de antemano qué es realista (gauge de probabilidad cambia automáticamente).
- **Reemplazar la tarjeta "Diseñador de Consorcios Microbianos"** del hero secundario en cada vista por contexto que importe al usuario (ej: en Portal mostrar "Tu industria · Tu país · Tu plan operativo en 60s").
- **Sección "Prueba antes de comprar"**: en cada resultado del Diseñador, agregar bloque "Hipótesis falsable que un piloto de 90 días puede probar" con: KPI, control, periodo, costo estimado del piloto.

### 1.2 De keyword-chat a IA real

- Reemplazar `views/asesoria_ia.py` con un chat real:
  - Backend: llamar a Anthropic (`claude-haiku-4-5` o `claude-sonnet-4-6`) vía SDK con prompt caching.
  - Contexto: cargar `data.DISCOVERIES` + `data.CONSORTIA_DATA` + síntesis de los 30 docs de research como contexto cacheado (~50K tokens — beneficio enorme del cache).
  - Tool calling: dejar que el LLM llame `get_predictor().predict(...)` cuando el usuario pregunte por un escenario.
  - Mantener las "preguntas sugeridas" como prompts iniciales.
- Costo estimado: $5–20/mes en API. Mucho menos que mantener el dict.

### 1.3 Generación de reporte PDF real

- Implementar `disenador.py:827` ("Descargar reporte") con `reportlab` o `weasyprint`:
  - Portada con branding
  - Receta del consorcio
  - Gauge + protocolo de despliegue
  - Disclaimer científico
  - Referencias (links a papers)
- Permite enviar al cliente algo tangible — la diferencia entre "demo" y "consultoría barata".

### 1.4 Captura de leads

- Después del "Diseñar Consorcio Óptimo": modal opcional "¿Quieres que un científico de BioCycle revise tu caso? Déjanos tu correo."
- Persistir en una hoja de Google Sheets vía `gspread` o un Postgres simple. (El stack TS de `lib/db` ya tiene Drizzle — usarlo).
- KPI: % de diseñadores completados que dejan email.

### 1.5 Versión EN

- Toda la app en español hoy. Para vender a Allonnia/Carbios/inversores LATAM bilingues: `i18n` simple con `data/translations.py` + selector en sidebar.

---

## Capa 2 — Producto en 90 días (primer ingreso real)

Aquí pasamos de "MVP" a "se puede cobrar por esto".

### 2.1 Plataforma multi-tenant

- Auth: Supabase Auth o Clerk (rápido vs construir login manual).
- Workspaces: cada cliente tiene su namespace de proyectos (consorcios diseñados, sitios, lotes de cápsulas).
- DB: el `lib/db` con Drizzle ya está esqueletizado — escalarlo. Tablas: `workspaces`, `projects`, `consortium_designs`, `predictions`, `pilots`.
- API: el `artifacts/api-server` (Express 5) ya está esqueletizado — exponer endpoints para predicciones ML + persistencia.

### 2.2 Modelo ML mejorado

- 43 muestras es muy poco (R²=0.55). Acciones:
  - **Scrape automatizado** de PubMed/PMC para extraer condiciones experimentales + degradation_pct (~500–2,000 muestras alcanzables).
  - **Random Forest + LightGBM** comparados con Gradient Boosting actual.
  - **Active learning**: el modelo solicita al usuario datos de pilotos reales (con consentimiento) para reentrenarse.
  - **Confianza calibrada**: el output debería ser una distribución (mean ± std), no un punto.
- Re-entrenamiento: pipeline en GitHub Actions cron semanal. Modelo versionado en S3/R2.

### 2.3 Catálogo real de microorganismos

- Hoy `CONSORTIA_DATA` son consorcios pre-diseñados estáticos. Para escalar:
  - Migrar a tabla DB con metadatos (BSL-level, fuentes, optimal_range, sinergias conocidas).
  - Al diseñar, en lugar de buscar el subtipo en un dict, **resolver via combinatoria + ML** que recomiende los N mejores microorganismos para las condiciones dadas.
  - Origen: combinar Addgene + DSMZ + ATCC catálogos públicos.

### 2.4 Pilotos como producto

- "Pilot Kit" como SKU: por $3,000 USD, BioCycle entrega:
  - Diseño detallado del consorcio para el caso del cliente
  - Protocolo de campo
  - 4 visitas de monitoreo (semana 1, 4, 8, 12)
  - Reporte final con resultados + recomendación de scale-up
- Frontend: página "Solicita un piloto" con calculadora de ROI específica + booking de call.

---

## Capa 3 — Visión 10x (12-24 meses): la stack BioSync aplicada

El proyecto hermano `BioSync Studio` (`Investigacion_BioSync_Studio.md`) ya pensó la **arquitectura de plataforma de biofabricación inteligente**: gemelo digital + edge IoT + ML predictivo + red federada. **Aplicar esa misma arquitectura a biorremediación es el "norte 10x" para BioCycle.**

### 3.1 Gemelo digital del biorreactor de degradación

- Por cada sitio activo, un *digital twin*: simulación física (FEA simplificado) que predice cómo evoluciona el contaminante hora a hora.
- Inputs en tiempo real: pH, temperatura, O₂ disuelto, conductividad (sensores en el biorreactor o en el suelo).
- Output: alertas predictivas ("en 36 horas el pH va a salir de rango — agregar buffer X"), comparación predicción vs real (calibra el modelo).
- Tech base: Python + Pyomo/CasADi + Streamlit/Plotly. O un upgrade a React + Three.js para visualización 3D del reactor.

### 3.2 Edge IoT para campo

- Kit hardware: Raspberry Pi 4 + sensores low-cost (Atlas Scientific pH/EC/DO ~$200 cada uno).
- Software: agente Python que postea a la plataforma vía MQTT.
- Casos de uso: cliente petrolero remoto sin cobertura — el dispositivo guarda offline y sincroniza al volver.
- Diferencial vs incumbentes (Siemens, Pfizer): nuestro kit cuesta <$2K vs $50K de hardware industrial.

### 3.3 Red federada de bio-conocimiento

- Cada cliente que monitorea un sitio aporta datos anonimizados al modelo global (federated learning).
- Privacy: Flower o NVFlare. Cada cliente entrena local, comparte gradientes — nunca datos crudos.
- Beneficio: el modelo de BioCycle mejora con cada piloto, pero ningún cliente expone IP o ubicación.
- Esto es defendible vs Carbios: ellos tienen UN dataset interno; nosotros tenemos un dataset distribuido que crece linealmente con cada cliente.

### 3.4 Tienda B2B de cápsulas pre-diseñadas

- Una vez tengamos 5–10 SKUs de consorcios validados (PET-biorreactor, HC-suelo-tropical, glifosato-suelo-templado, etc), abrir tienda online B2B.
- Cápsulas fabricadas en alianza con Brenntag Colombia (alginato local — costo <$0.001/cápsula) o un fabricante en CDMX para LATAM Norte.
- Modelo: cliente entra al diseñador → app le dice "tu caso encaja con SKU-PET-03 → ¿comprar 100 kg de cápsulas pre-formuladas por $X?".

### 3.5 Marketplace de científicos

- Para casos custom (no caen en SKU), conectar al cliente con un PhD freelance (red de UNAL, Javeriana, UTB, U. Antioquia).
- Take rate 15–25%.
- Esta es la diferencia entre "vendemos software" y "operamos una red de capacidad científica".

---

## Capa 4 — Métricas que importan

Para medir si el escalamiento funciona:

| Métrica | Hoy | 30 días | 90 días | 12 meses |
|---|---|---|---|---|
| Diseños generados/semana | 0 (demo) | 20 | 200 | 2,000 |
| Conversión diseño → email captado | — | 10% | 25% | 40% |
| Pilotos firmados | 0 | 1 | 5 | 30 |
| MRR | $0 | $0 | $5K | $50K |
| Modelos en producción | 1 (estático) | 1 (mejor data) | 3 (especializados) | 10+ federados |
| Sitios con sensores activos | 0 | 0 | 2 | 25 |
| Microorganismos en catálogo | 4 fijos por consorcio | 50 | 200 | 1,000+ |

---

## Cosas que NO hacer (anti-patrones)

Sacadas de `.research-synthesis.md` §11. Cada una le costaría a BioCycle una conversación con jurado o cliente.

1. **No prometer "limpieza de playas con cápsulas"** — la cápsula no funciona en campo abierto para plástico.
2. **No competir frontalmente con Carbios** — categorías distintas (centralizado vs distribuido).
3. **No liberar OGM al ambiente** — la UE no aprueba uno para biorremediación desde los 90s.
4. **No vender SaaS "listo"** — pilotos primero, plataforma después.
5. **No prometer "el plástico desaparece"** — produce monómeros líquidos que requieren recuperación.
6. **No mostrar curvas ML como verdad absoluta** — son estimaciones de una regresión sobre 43 muestras.

---

## Próximos 3 movimientos concretos (mi recomendación)

1. **Esta semana (pre-final Basement):** ejecutar Capa 0 completa. 4 horas de código, máximo impacto.
2. **Próximas 2 semanas:** Capa 1.1 (modo de aplicación) + 1.2 (chat IA real con Claude API + prompt caching). El chat real es quizá el mayor diferenciador de demo a producto. Los costos de Anthropic con caching son <$1/mes a la escala actual.
3. **Próximos 30 días:** Capa 1.3 (PDF) + 1.4 (captura de leads) + outreach a 5 universidades colombianas para piloto académico de validación. Javeriana, UNAL, UTB Bolívar son los más calientes según research.

Cualquier cosa más allá depende de si conseguimos el primer piloto pagado.
