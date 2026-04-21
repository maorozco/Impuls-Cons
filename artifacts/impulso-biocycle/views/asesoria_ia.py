import streamlit as st
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

CSS = """
<style>
.chat-header {
    background: linear-gradient(135deg, #1B5E20, #2E7D32, #00C853);
    border-radius: 16px; padding: 24px 28px; color: white; margin-bottom: 20px;
}
.chat-header h2 { font-size: 26px; font-weight: 800; margin: 0 0 4px 0; }
.chat-header p { font-size: 14px; opacity: 0.9; margin: 0; }
.suggestion-label {
    font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px;
}
</style>
"""

SUGGESTED = [
    "¿Qué bacterias degradan PET?",
    "¿Cuánto cuesta por tonelada?",
    "¿Es seguro para humanos?",
    "¿Cómo funciona para textiles?",
    "¿Qué diferencia a BioCycle?",
    "¿Cómo empiezo un piloto?",
]

RESPONSES = {
    "pet_plastic": """🧫 **Biodegradación de PET con BioCycle**

El PET (tereftalato de polietileno) es degradado por un consorcio de microorganismos especializados:

**Organismos clave:**
- 🦠 *Ideonella sakaiensis* — produce PETasa y MHETasa, enzimas que cortan las cadenas del PET
- 🦠 *Thermobifida fusca* — termofílica, degrada PET a temperaturas de 40-60°C
- 🦠 *Bacillus subtilis* — apoya la hidrólisis y controla el pH del consorcio

**Proceso en biorreactor:**
1. Pretratamiento: trituración del plástico a partículas < 2mm + amorfización UV
2. Inoculación del consorcio a 10⁸-10⁹ UFC/mL
3. Degradación enzimática en 8–16 semanas según grado de cristalinidad

**Productos obtenidos:**
- 📦 TPA (ácido tereftálico): $680–850/ton — materia prima para nuevo PET
- 📦 EG (etilenglicol): $500–650/ton — solvente y anticongelante industrial

**Dato clave:** La enzima FAST-PETase (2022, Universidad de Texas) opera a 50°C y degrada PET **en días bajo condiciones controladas de laboratorio — PET amorfo, triturado fino, biorreactor termostatizado**. En campo abierto (geometría sin triturar + UV + temperatura variable) la degradación cae a 10–20%. BioCycle incorpora cepas con ingeniería enzimática compatible y vende **biorreactor contenido**, no degradación in-situ de plástico.

📚 *Más de 150 publicaciones peer-reviewed respaldan la degradación enzimática del PET.*""",

    "costo": """💰 **Comparación de costos por tipo de residuo**

| Tipo de residuo | Método conv. | BioCycle | Ahorro |
|---|---|---|---|
| Plástico PET (biorreactor) | $55/ton | $28/ton | **49%** |
| Hidrocarburos en suelo | $160/m³ | $75/m³ | **53%** |
| Efluentes textiles (colorantes) | $220/m³ | $95/m³ | **57%** |
| Suelos agrícolas (plaguicidas) | $85/m³ | $40/m³ | **53%** |
| Lixiviados de relleno | $130/m³ | $60/m³ | **54%** |
| Residuos de laboratorio | $300/kg | $140/kg | **53%** |

**¿Por qué es más económico?**
- ✅ Sin reactivos químicos costosos (ácidos, oxidantes)
- ✅ Sin energía de incineración (~800–1200°C)
- ✅ Los microorganismos se reproducen — el inóculo no se consume totalmente
- ✅ Subproductos vendibles en plásticos (TPA, EG)

**Piloto inicial:** $500–3,000 USD según volumen y tipo de residuo.

📞 *Contacte a nuestro equipo para una cotización específica para su operación.*""",

    "seguro": """🛡️ **Seguridad de los consorcios BioCycle**

**Todos los microorganismos son BSL-1 o GRAS** (Generally Recognized As Safe):

| Organismo | Clasificación | Uso habitual |
|---|---|---|
| *Bacillus subtilis* | BSL-1 / GRAS | Suplementos probióticos, panaderías |
| *Ideonella sakaiensis* | BSL-1 | Solo degrada PET, sin patogenicidad |
| *Rhodococcus erythropolis* | BSL-1 | Biorremediación industrial certificada |
| *Phanerochaete chrysosporium* | BSL-1 | Biopulpa en industria papelera |
| *Chlorella vulgaris* | GRAS | Alimento humano, suplementos |
| *Trichoderma harzianum* | BSL-1 / GRAS | Biofungicida en agricultura |

**¿Qué significa BSL-1?**
> Organismos que no causan enfermedades en humanos sanos. Se pueden manejar sin equipo especial de protección (solo guantes y gafas básicos).

**Lo que BioCycle NUNCA usa:**
- ❌ *Pseudomonas aeruginosa* (BSL-2, oportunista)
- ❌ Organismos genéticamente modificados sin evaluación de riesgo
- ❌ Patógenos oportunistas de ningún tipo

**Contención:** Las cápsulas de alginato-CaCl₂ retienen los microorganismos en el sitio de tratamiento, evitando dispersión no controlada.

📋 *Todo consorcio BioCycle puede ser revisado por el Comité de Bioseguridad institucional antes de la aplicación.*""",

    "textil": """🎨 **Tratamiento de efluentes textiles con BioCycle**

Los colorantes azo representan el 70% de los tintes textiles y son altamente recalcitrantes. BioCycle los degrada mediante un consorcio mixto hongo-bacteria:

**Consorcio para textiles:**
- 🍄 *Phanerochaete chrysosporium* — produce lacasa y Mn-peroxidasa, oxida el anillo azo
- 🍄 *Trametes versicolor* — mayor producción de lacasa a temperatura ambiente
- 🦠 *Bacillus subtilis* — controla pH y provee nutrientes para los hongos
- 🦠 *Acinetobacter baumannii* *(cepa ambiental)* — mineraliza los intermedios aromáticos

**Proceso:**
1. Ajuste de pH a 5.5–6.5 (óptimo para lacasas)
2. Inoculación en reactor batch o continuo
3. Decoloración visible en 48–96 horas
4. Mineralización completa en 10–21 días

**Parámetros que mejora:**
| Parámetro | Antes | Después | Límite Res. 631/2015 |
|---|---|---|---|
| Color | Intenso | Decolorado >90% | No apreciable |
| DBO₅ | 800–2000 mg/L | <80 mg/L | 200 mg/L |
| DQO | 1500–4000 mg/L | <200 mg/L | 400 mg/L |

**Normativa:** La **Resolución 631/2015** (MADS) establece los límites de vertimiento para la industria textil. BioCycle ayuda a cumplir los artículos 12 y 13 sin necesidad de tratamiento fisicoquímico adicional.

💧 *Resultado final: agua decolorizada con potencial de reutilización en proceso industrial.*""",

    "diferencia": """🚀 **¿Qué diferencia a BioCycle de otras soluciones?**

**1. 🤖 Diseño asistido por IA — no empírico**
La mayoría de proveedores usan inóculos genéricos probados en campo. BioCycle usa un modelo de **Gradient Boosting** calibrado con muestras curadas extraídas de literatura peer-reviewed (**4,700+ referencias científicas agregadas**) para predecir la combinación óptima de microorganismos para *sus* condiciones exactas. *R²≈0.55 sobre 43 muestras de entrenamiento; mejora con cada proyecto real integrado.*

**2. 🧬 Consorcios multi-especie, no monocultivos**
Los monocultivos son frágiles y se inhiben ante variaciones de pH o temperatura. Los consorcios BioCycle son robustos: si una especie falla, las otras compensan.

| Característica | Monocultivo típico | Consorcio BioCycle |
|---|---|---|
| Rango de pH tolerado | ±0.5 unidades | ±2.0 unidades |
| Recuperación ante perturbación | Baja | Alta |
| Cobertura de rutas metabólicas | 1–2 | 4–8 |
| Eficiencia vs. monocultivo | 1x | **1.4–1.8x** |

**3. 💊 Encapsulación en alginato**
Los microorganismos libres se dispersan y pierden viabilidad en días. Las cápsulas BioCycle protegen el consorcio hasta **6 meses** en suelo o agua, con liberación controlada.

**4. 🇨🇴 Formulación para clima colombiano**
Cada consorcio se ajusta al rango térmico del clima de su ciudad (Andino-Frío, Caribe-Cálido, Eje-Cafetero, etc.), garantizando rendimiento en condiciones locales.

**5. 📋 Soporte regulatorio incluido**
Identificamos qué normativa colombiana aplica a su caso y cómo nuestro tratamiento ayuda a cumplirla, agilizando trámites ante la ANLA o la Corporación Autónoma Regional.""",

    "piloto": """🧪 **Cómo iniciar un piloto con BioCycle**

Un piloto es la forma más eficiente de validar la tecnología en sus condiciones reales antes de escalar. Aquí el proceso en 5 pasos:

**Paso 1 — Diagnóstico (Semana 1)**
- Tomamos muestras de su residuo/suelo/agua
- Caracterización: tipo de contaminante, concentración, pH, temperatura, microbioma nativo
- Selección del consorcio óptimo para su caso
- 💰 Costo: incluido en el paquete piloto

**Paso 2 — Prueba de tratabilidad (Semanas 1–2)**
- Microcosmos de laboratorio: 3 réplicas × 1L
- Comparación BioCycle vs. control sin tratamiento
- Medición de degradación a los 7 y 14 días
- 💰 Costo: $500–800 USD según tipo de análisis

**Paso 3 — Diseño del piloto de campo (Semana 2)**
- Dimensionamiento del sistema (parcela, biorreactor, reactor batch)
- Protocolo de aplicación y monitoreo
- Selección de indicadores: TPH, DBO, DQO, metales, etc.

**Paso 4 — Ejecución del piloto (Mes 1)**
- Aplicación del consorcio encapsulado
- Muestreos semanales
- 💰 Costo total piloto: **$1,500–3,000 USD** (según volumen y complejidad)

**Paso 5 — Informe y decisión de escalamiento (Fin del Mes 1)**
- Informe técnico con resultados vs. línea base
- Proyección de costos y tiempos para escala completa
- Propuesta de contrato de operación

**Tiempo total piloto → escala:** 3–4 meses

📧 *Escríbanos a contacto@impulso-biocycle.co para agendar su diagnóstico gratuito.*""",

    "hidrocarburo": """🛢️ **Biorremediación de hidrocarburos con BioCycle**

La biorremediación de hidrocarburos es la aplicación más documentada en biología ambiental: **más de 40 años de evidencia científica** y miles de proyectos exitosos en todo el mundo.

**Consorcio hidrocarbonoclástico BioCycle:**
- 🦠 *Rhodococcus erythropolis* — degrada alcanos ramificados y PAHs de cadena corta
- 🦠 *Bacillus subtilis* — produce biosurfactantes que aumentan la biodisponibilidad del crudo
- 🦠 *Mycobacterium vanbaalenii* — especialista en PAHs de alto peso molecular (pireno, benzo[a]pireno)
- 🦠 *Sphingomonas paucimobilis* — mineraliza compuestos aromáticos policíclicos

**Comparación de costos vs. métodos convencionales:**
| Método | Costo estimado | Tiempo | Eficiencia |
|---|---|---|---|
| Excavación + disposición | $800–1,500/m³ | 1–4 semanas | 100% remoción física |
| Oxidación química (Fenton) | $400–700/m³ | 4–12 semanas | 60–90% |
| Biorrremediación tradicional | $150–310/m³ | 6–24 meses | 50–80% |
| **BioCycle (cápsulas)** | **$50–75/m³** | **8–20 semanas** | **65–90%** |

**Ventaja clave:** Las cápsulas de alginato permiten aplicación *in situ* sin excavación, reduciendo costos de logística en un 70%.

**Resultado:** El contaminante se **MINERALIZA** — CO₂ + H₂O. No hay traslado de problema, el hidrocarburo desaparece del ambiente.

📊 *TPH (Total Petroleum Hydrocarbons): reducciones documentadas de 65–90% en 16 semanas en condiciones colombianas.*""",

    "regulacion": """⚖️ **Marco regulatorio colombiano para biorremediación**

**¿Necesito permisos especiales para usar BioCycle?**

En la mayoría de casos: **NO**. Los sistemas contenidos (biorreactores, reactores batch) no requieren permisos adicionales porque los microorganismos BSL-1 están exentos de los requisitos del Decreto 4741/2005.

**Normativa principal por sector:**

🏭 **Industria (vertimientos):**
- Resolución 631/2015 — Límites de vertimiento al agua
- Decreto 3930/2010 — Uso del agua y residuos líquidos
- *BioCycle ayuda a cumplir los límites sin necesidad de PSMV adicional*

🌱 **Suelos contaminados:**
- Resolución 2184/2019 — Criterios de calidad del suelo
- *BioCycle reduce TPH, metales y plaguicidas bajo los umbrales permitidos*

🛢️ **Sector petrolero:**
- Decreto 4741/2005 — RESPEL
- Planes de Manejo Ambiental (PMA) ante la ANLA
- *BioCycle se incorpora como medida de remediación dentro del PMA existente*

🔬 **Laboratorios y RESPEL:**
- Resolución 1362/2007 — Registro de generadores
- *BioCycle reduce la categoría de peligrosidad antes de la disposición final*

**Para aplicaciones en campo abierto con suelos o aguas:**
Se recomienda notificación a la Corporación Autónoma Regional (CAR) del departamento. BioCycle le provee toda la documentación técnica necesaria.

📋 *Soporte regulatorio incluido en todos nuestros paquetes — no enfrenta trámites solo.*""",

    "default": """🤖 **Bienvenido a Asesoría IA de BioCycle**

Estoy aquí para responder sus preguntas sobre biorremediación, consorcios microbianos y soluciones BioCycle.

**Puedo ayudarle con:**

🧫 **Biodegradación** — ¿Qué bacterias degradan PET, petróleo, colorantes?
💰 **Costos** — Comparaciones por tipo de residuo y volumen
🛡️ **Seguridad** — Clasificación BSL-1/GRAS de todos los organismos
🎨 **Textiles** — Tratamiento de colorantes azo con Res. 631/2015
🚀 **Ventajas** — Qué diferencia a BioCycle de otras soluciones
🧪 **Pilotos** — Cómo iniciar, costos, plazos
🛢️ **Hidrocarburos** — Décadas de evidencia, costos vs. excavación
⚖️ **Regulación** — Marco normativo colombiano, permisos

**Pruebe una de las preguntas sugeridas arriba** o escriba su consulta específica en el campo de texto.""",
}


def _keyword_response(msg: str) -> str:
    """Legacy keyword-matched fallback (also feeds the RAG system as hint)."""
    m = msg.lower()
    if any(k in m for k in ["pet", "plástico", "plastico", "polietileno", "hdpe", "ldpe", "pp ", "poliuretano"]):
        return RESPONSES["pet_plastic"]
    if any(k in m for k in ["costo", "precio", "cuánto", "cuanto", "tarifa", "económico", "economico", "barato"]):
        return RESPONSES["costo"]
    if any(k in m for k in ["seguro", "riesgo", "peligro", "tóxico", "toxico", "bsl", "gras", "humano"]):
        return RESPONSES["seguro"]
    if any(k in m for k in ["textil", "colorante", "tinte", "azo", "efluente", "631"]):
        return RESPONSES["textil"]
    if any(k in m for k in ["diferente", "diferencia", "competencia", "mejor", "ventaja", "único", "unico"]):
        return RESPONSES["diferencia"]
    if any(k in m for k in ["piloto", "empezar", "empiezo", "iniciar", "cómo empiezo", "como empiezo", "empezar"]):
        return RESPONSES["piloto"]
    if any(k in m for k in ["hidrocarburo", "petróleo", "petroleo", "crudo", "diesel", "tph", "pah", "suelo"]):
        return RESPONSES["hidrocarburo"]
    if any(k in m for k in ["regulación", "regulacion", "permiso", "norma", "anla", "car ", "resolución", "resolucion", "decreto"]):
        return RESPONSES["regulacion"]
    return RESPONSES["default"]


def get_response(msg: str) -> tuple[str, list[dict]]:
    """Returns (markdown_answer, source_citations).

    - If ANTHROPIC_API_KEY is present → RAG (TF-IDF retrieval + Claude answer).
    - Else → TF-IDF-backed offline summary OR legacy keyword response.

    `source_citations` is a list of {doc_id, title, source, score, url?} dicts
    — rendered below the assistant message as a source footer in the UI.
    """
    try:
        # Lazy import so Streamlit startup doesn't pay the sklearn cost if never used
        import rag  # type: ignore
        legacy = _keyword_response(msg)
        text, retrievals = rag.answer(msg, legacy_fallback=legacy)
        sources = [
            {
                "doc_id": r.doc.doc_id,
                "title": r.doc.title,
                "source": r.doc.source,
                "score": r.score,
                "url": r.doc.url,
            }
            for r in retrievals
        ]
        return text, sources
    except Exception as e:  # noqa: BLE001 — rag failure must never break the chat
        return _keyword_response(msg), []


def render():
    st.markdown(CSS, unsafe_allow_html=True)

    st.markdown("""
    <div class="page-breadcrumb">
        <div class="bc-dot"></div>
        <div class="bc-title">Asesoría IA</div>
        <div class="bc-sub">RAG sobre literatura peer-reviewed</div>
    </div>
    """, unsafe_allow_html=True)

    # Show LLM status honestly — transparency is the moat
    try:
        import rag  # type: ignore
        n_docs = len(rag.get_retriever().docs)
        if rag.is_llm_available():
            st.success(
                f"🧠 **IA conversacional activa** ({rag.llm_label()}). RAG sobre {n_docs} fuentes "
                "(papers peer-reviewed + consorcios + bases de datos). Las respuestas citan las fuentes utilizadas."
            )
        else:
            st.info(
                f"⚙️ **Modo recuperación offline (TF-IDF).** El chat recupera fuentes relevantes de {n_docs} "
                "documentos y responde con un resumen. Para IA conversacional completa, configure "
                "`ANTHROPIC_API_KEY` u `OPENROUTER_API_KEY` en `.env`."
            )
    except Exception:
        st.info(
            "⚙️ **Modo respuestas pre-cargadas.** El RAG con fuentes citadas llega la próxima semana."
        )

    if "chat_messages" not in st.session_state:
        st.session_state["chat_messages"] = [
            {
                "role": "assistant",
                "content": "👋 Hola, soy el asistente de **Impulso BioCycle**. Estoy aquí para resolver sus dudas sobre biorremediación, consorcios microbianos, costos, seguridad y regulación colombiana.\n\n¿En qué le puedo ayudar hoy? Puede usar las preguntas sugeridas o escribir su consulta.",
            }
        ]

    st.markdown('<p class="suggestion-label">💡 Preguntas frecuentes — haga clic para consultar:</p>', unsafe_allow_html=True)
    row1 = st.columns(3)
    row2 = st.columns(3)

    def _enqueue_query(q: str) -> None:
        """Append user turn + a 'pending' assistant placeholder.
        The next render shows the skeleton loader and runs the LLM."""
        st.session_state["chat_messages"].append({"role": "user", "content": q})
        st.session_state["chat_messages"].append(
            {"role": "assistant", "content": "", "pending": True, "query": q}
        )

    for i, (col, q) in enumerate(zip(list(row1) + list(row2), SUGGESTED)):
        with col:
            if st.button(q, key=f"sugg_{i}", use_container_width=True):
                _enqueue_query(q)
                st.rerun()

    st.markdown("---")

    # Render chat — show skeleton for any pending message, then resolve it
    pending_to_resolve: list[int] = []
    for idx, msg in enumerate(st.session_state["chat_messages"]):
        with st.chat_message(msg["role"], avatar="🤖" if msg["role"] == "assistant" else "👤"):
            if msg.get("pending"):
                # Fase 0 · E2.6 — skeleton loader en lugar del spinner genérico
                st.markdown(
                    """
<div style="padding: 4px 0;">
  <div class="skeleton-line long"></div>
  <div class="skeleton-line long"></div>
  <div class="skeleton-line short"></div>
  <div style="font-size:11px; color:#6A8A74; margin-top:10px; letter-spacing:1px; text-transform:uppercase;">
    Consultando fuentes peer-reviewed…
  </div>
</div>
                    """,
                    unsafe_allow_html=True,
                )
                pending_to_resolve.append(idx)
            else:
                st.markdown(msg["content"])
                srcs = msg.get("sources") or []
                if srcs:
                    with st.expander(f"📚 Fuentes recuperadas ({len(srcs)})"):
                        for s in srcs:
                            line = f"**{s['title']}** — `{s['source']}` (similitud {s['score']:.2f})"
                            if s.get("url"):
                                line += f" · [enlace]({s['url']})"
                            st.markdown(f"- {line}")

    prompt = st.chat_input("Escriba su pregunta sobre biorremediación, costos, seguridad...")
    if prompt:
        _enqueue_query(prompt)
        st.rerun()

    # Resolve any pending messages — after rendering the skeletons this turn,
    # fetch the answer and rerun so the next render shows the real content.
    if pending_to_resolve:
        for idx in pending_to_resolve:
            msg = st.session_state["chat_messages"][idx]
            query = msg.get("query", "")
            text, sources = get_response(query)
            st.session_state["chat_messages"][idx] = {
                "role": "assistant",
                "content": text,
                "sources": sources,
            }
        st.rerun()
