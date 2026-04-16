import streamlit as st


# ── Brand palette (extracted from the Impulso BioCycle identity image) ──
C_DEEP   = "#004D2C"   # deep forest green  (background, footer)
C_MID    = "#006633"   # medium green       (sidebar, sections)
C_BRIGHT = "#00C853"   # bright green       (borders, primary accents)
C_CYAN   = "#00D9F5"   # electric cyan      (CTA buttons, metric numbers)
C_LIME   = "#C4FF00"   # yellow-green       (subtle highlights)
C_WHITE  = "#FFFFFF"
C_OFFWH  = "#F4FBF7"   # near-white section bg
C_DARK_T = "#0A1F12"   # footer bg


def _css():
    st.markdown(f"""
<style>
* {{ font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; box-sizing: border-box; }}
.block-container {{ padding-top: 0 !important; max-width: 100% !important; }}
section[data-testid="stMain"] > div {{ padding-top: 0 !important; }}

/* ── Streamlit primary button override ── */
button[kind="primary"] {{
    background: {C_CYAN} !important;
    color: {C_DEEP} !important;
    font-weight: 800 !important;
    border: none !important;
    border-radius: 6px !important;
}}
button[kind="secondary"] {{
    background: transparent !important;
    color: {C_CYAN} !important;
    font-weight: 700 !important;
    border: 2px solid {C_CYAN} !important;
    border-radius: 6px !important;
}}

/* ─── HERO ─── */
.lp-hero {{
    min-height: 420px;
    background: url('/app/static/hero.png') center / cover no-repeat;
    margin: -1rem -1rem 0 -1rem;
}}

/* ─── WHAT IS ─── */
.lp-what {{
    background: {C_WHITE};
    padding: 3.5rem 2rem;
    text-align: center;
    border-bottom: 1px solid #E8F5EC;
}}
.lp-what-title {{
    font-size: 1.7rem; font-weight: 800; color: {C_DEEP}; margin-bottom: 1rem;
}}
.lp-what-body {{
    font-size: 1.05rem; color: #3A5A45;
    max-width: 740px; margin: 0 auto; line-height: 1.85;
}}

/* ─── TWO PATHS ─── */
.lp-section-label {{
    text-align: center; margin-bottom: 1.6rem;
}}
.lp-section-label h3 {{
    font-size: 1.65rem; font-weight: 800; color: {C_DEEP}; margin: 0 0 .3rem 0;
}}
.lp-section-label p {{
    font-size: .95rem; color: #6A8A74; margin: 0;
}}
.lp-path-green {{
    background: {C_DEEP}; color: white;
    border-radius: 12px; padding: 2rem 1.8rem;
    box-shadow: 0 6px 28px rgba(0,77,44,0.28);
    transition: transform .2s, box-shadow .2s;
}}
.lp-path-green:hover {{ transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,77,44,0.38); }}
.lp-path-slate {{
    background: #1C2A22; color: white;
    border-radius: 12px; padding: 2rem 1.8rem;
    box-shadow: 0 6px 28px rgba(28,42,34,0.28);
    transition: transform .2s, box-shadow .2s;
}}
.lp-path-slate:hover {{ transform: translateY(-3px); box-shadow: 0 12px 36px rgba(28,42,34,0.38); }}
.lp-path-kicker {{
    font-size: .72rem; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: {C_CYAN}; margin-bottom: .5rem;
}}
.lp-path-title {{ font-size: 1.3rem; font-weight: 900; margin-bottom: .3rem; }}
.lp-path-sub {{ font-size: .88rem; opacity: .72; margin-bottom: 1.2rem; }}
.lp-path-list {{ list-style: none; padding: 0; margin: 0 0 1.5rem 0; }}
.lp-path-list li {{
    font-size: .9rem; opacity: .88; margin-bottom: .55rem; padding-left: .1rem;
    border-left: 2px solid {C_CYAN}; padding-left: .7rem;
}}

/* ─── PROBLEMS ─── */
.lp-probs-section {{
    background: {C_OFFWH}; margin: 0 -1rem; padding: 3.5rem 2rem;
}}
.lp-prob-card {{
    background: white; border-radius: 10px; padding: 1.4rem 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    border-top: 3px solid {C_BRIGHT};
    transition: transform .2s, box-shadow .2s;
}}
.lp-prob-card:hover {{ transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,77,44,0.12); }}
.lp-prob-title {{ font-size: .98rem; font-weight: 800; color: {C_DEEP}; margin-bottom: .3rem; }}
.lp-prob-desc {{ font-size: .85rem; color: #5A7A65; line-height: 1.55; }}

/* ─── CAPSULE ANIMATION ─── */
.capsule-scene {{
    position: relative; width: 240px; height: 240px; margin: 0 auto;
}}
.capsule-outer {{
    position: absolute; top: 50%; left: 50%;
    width: 190px; height: 190px;
    transform: translate(-50%,-50%);
    border: 2px solid rgba(0,217,245,.50);
    border-radius: 50%;
    background: rgba(0,217,245,.06);
    animation: cap-pulse 3.2s ease-in-out infinite;
}}
.bact {{
    position: absolute; border-radius: 50%;
    width: 36px; height: 36px;
    animation-duration: 3.2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}}
.b1 {{ background: {C_BRIGHT}; top:68px; left:50px; animation-name: fl1; }}
.b2 {{ background: {C_CYAN};   top:50px; left:148px; animation-name: fl2; }}
.b3 {{ background: {C_LIME};   top:148px; left:56px; animation-name: fl3; }}
.b4 {{ background: #5CE0C8;    top:144px; left:148px; animation-name: fl4; }}
.b-lbl {{
    position:absolute; font-size:7px; font-weight:700; color:{C_DEEP};
    width:100%; text-align:center; top:50%; transform:translateY(-50%); padding:0 2px;
    line-height:1.2;
}}
@keyframes cap-pulse {{
    0%,100% {{ transform:translate(-50%,-50%) scale(1);    opacity:.85; }}
    50%      {{ transform:translate(-50%,-50%) scale(1.08); opacity:1; }}
}}
@keyframes fl1 {{ 0%,100% {{top:68px;left:50px}} 50% {{top:76px;left:60px}} }}
@keyframes fl2 {{ 0%,100% {{top:50px;left:148px}} 50% {{top:60px;left:138px}} }}
@keyframes fl3 {{ 0%,100% {{top:148px;left:56px}} 50% {{top:140px;left:66px}} }}
@keyframes fl4 {{ 0%,100% {{top:144px;left:148px}} 50% {{top:154px;left:138px}} }}

/* ─── HOW IT WORKS steps ─── */
.lp-step-row {{
    background: {C_OFFWH}; border-radius: 10px; padding: 1.2rem 1.4rem;
    margin-bottom: .9rem;
    border-left: 3px solid {C_CYAN};
}}
.lp-step-num {{
    display: inline-flex; align-items:center; justify-content:center;
    background: {C_CYAN}; color: {C_DEEP};
    width: 26px; height: 26px; border-radius: 50%;
    font-weight: 900; font-size: .85rem; margin-right: .6rem;
    flex-shrink: 0; vertical-align: middle;
}}
.lp-step-title {{ font-size: .95rem; font-weight: 700; color: {C_DEEP}; display:inline; vertical-align:middle; }}
.lp-step-desc  {{ font-size: .84rem; color: #5A7A65; margin-top: .3rem; padding-left: 2rem; line-height:1.55; }}

/* ─── METRICS ─── */
.lp-metrics-bg {{
    background: {C_DEEP}; padding: 3rem 1rem;
    margin: 0 -1rem; text-align: center;
}}
.lp-metric-num   {{ font-size: 2.8rem; font-weight: 900; color: {C_CYAN}; line-height: 1; }}
.lp-metric-label {{ font-size: .88rem; color: rgba(255,255,255,.75); margin-top: .4rem; }}

/* ─── REFS ─── */
.lp-refs-bg {{
    background: #F0F4F2; padding: 2rem 1rem; text-align: center;
    margin: 0 -1rem;
}}
.lp-refs-title {{
    font-size: .72rem; color: #8AA898; text-transform: uppercase;
    letter-spacing: 2.5px; font-weight: 700; margin-bottom: 1rem;
}}
.lp-refs-row {{ display:flex; flex-wrap:wrap; justify-content:center; gap:.7rem 1.4rem; }}
.lp-ref-chip {{
    font-size: .84rem; font-weight: 700; color: #4A7060;
    border: 1px solid #C8DDD2; border-radius: 6px;
    padding: 4px 13px; background: white;
}}

/* ─── FOOTER ─── */
.lp-footer-full {{
    background: {C_DARK_T}; color: rgba(255,255,255,.72);
    text-align: center; padding: 2.6rem 1rem;
    font-size: .88rem; line-height: 2.1;
    margin: 0 -1rem -4rem -1rem;
}}
.lp-footer-full b {{ color: {C_CYAN}; }}
</style>
""", unsafe_allow_html=True)


def render():
    _css()

    # ══ HERO (imagen pura, sin texto encima) ══
    st.markdown('<div class="lp-hero"></div>', unsafe_allow_html=True)

    # Descripción debajo de la imagen
    st.markdown("""
<div style="text-align:center; padding: 1.6rem 2rem 0.4rem 2rem; max-width: 780px; margin: 0 auto;">
  <p style="font-size:1.1rem; color:#3A5A45; line-height:1.85; margin:0;">
    Plataforma global de inteligencia artificial para diseño de soluciones biológicas de biorremediación.
    Basada en ciencia publicada en <strong>Nature</strong>, <strong>Science</strong>
    y 2,000+ papers revisados por pares.
  </p>
</div>
""", unsafe_allow_html=True)

    # CTA buttons
    st.markdown('<div style="height:.6rem;"></div>', unsafe_allow_html=True)
    _, cta1, cta2, _ = st.columns([1, 2, 2, 1])
    with cta1:
        if st.button("Construye tu Consorcio — Para laboratorios y productores",
                     type="primary", use_container_width=True, key="cta_cons"):
            st.session_state["nav_page"] = "🧬 Construye tu Consorcio"
            st.rerun()
    with cta2:
        if st.button("Gestiona tus Residuos — Para empresas y operadores",
                     use_container_width=True, key="cta_portal"):
            st.session_state["nav_page"] = "🏭 Gestiona tus Residuos"
            st.rerun()

    # ══ QUÉ ES ══
    st.markdown("""
<div class="lp-what">
  <div class="lp-what-title">¿Qué es Impulso BioCycle?</div>
  <div class="lp-what-body">
    Impulso BioCycle es la primera plataforma de inteligencia artificial que diseña consorcios microbianos
    optimizados para biodegradación de contaminantes. Conectamos el conocimiento de 2,000+ publicaciones
    científicas con las empresas y laboratorios que lo necesitan — en cualquier parte del mundo.
  </div>
</div>
""", unsafe_allow_html=True)

    # ══ DOS CAMINOS ══
    st.markdown("""
<div style="padding: 3rem 0 .5rem 0;">
  <div class="lp-section-label">
    <h3>Dos caminos, un objetivo</h3>
    <p>Elige el que se adapta a tu rol</p>
  </div>
</div>
""", unsafe_allow_html=True)

    dc_l, dc_r = st.columns(2)
    with dc_l:
        st.markdown("""
<div class="lp-path-green">
  <div class="lp-path-kicker">Para laboratorios y productores</div>
  <div class="lp-path-title">Construye tu Consorcio</div>
  <div class="lp-path-sub">Diseña desde cero. Tú defines los organismos y el protocolo.</div>
  <ul class="lp-path-list">
    <li>Consorcios personalizados desde cero</li>
    <li>Microorganismos BSL-1/GRAS verificados</li>
    <li>Verificación de compatibilidad entre especies</li>
    <li>Formulación de cápsula optimizada</li>
    <li>Predicción ML de degradación</li>
    <li>Protocolo de preparación paso a paso</li>
  </ul>
</div>
""", unsafe_allow_html=True)
        if st.button("Empezar a diseñar", type="primary",
                     use_container_width=True, key="path_cons"):
            st.session_state["nav_page"] = "🧬 Construye tu Consorcio"
            st.rerun()

    with dc_r:
        st.markdown("""
<div class="lp-path-slate">
  <div class="lp-path-kicker">Para empresas industriales y consultoras</div>
  <div class="lp-path-title">Gestiona tus Residuos</div>
  <div class="lp-path-sub">Recibe una solución pre-diseñada y probada para tu industria.</div>
  <ul class="lp-path-list">
    <li>Selección por tipo de operación y residuo</li>
    <li>Solución pre-diseñada y validada</li>
    <li>Plan operativo mes a mes</li>
    <li>Análisis financiero: inversión, ahorro, ROI</li>
    <li>Cumplimiento normativo automático</li>
    <li>Impacto ambiental cuantificado</li>
  </ul>
</div>
""", unsafe_allow_html=True)
        if st.button("Ver soluciones", use_container_width=True, key="path_portal"):
            st.session_state["nav_page"] = "🏭 Gestiona tus Residuos"
            st.rerun()

    # ══ PROBLEMAS ══
    st.markdown("""
<div class="lp-probs-section">
  <div class="lp-section-label" style="margin-bottom:1.8rem;">
    <h3>Problemas que resolvemos</h3>
    <p>De la contaminación al ecosistema restaurado</p>
  </div>
</div>
""", unsafe_allow_html=True)

    problems = [
        ("Hidrocarburos y derrames",    "60-80% eliminación in situ. Décadas de evidencia global."),
        ("Aguas residuales industriales","Decoloración 85-99%. Tratamiento biológico más económico."),
        ("Suelos agrícolas contaminados","Detoxificación de plaguicidas. Suelo recuperado para uso."),
        ("Plásticos en biorreactor",    "PET a monómeros vendibles ($680-850/ton)."),
        ("Contaminación minera",        "Metales pesados, drenaje ácido, mercurio."),
        ("Efluentes farmacéuticos",     "Compuestos recalcitrantes en agua hospitalaria."),
    ]
    pb1, pb2, pb3 = st.columns(3)
    for i, (title, desc) in enumerate(problems):
        col = [pb1, pb2, pb3][i % 3]
        with col:
            st.markdown(f"""
<div class="lp-prob-card">
  <div class="lp-prob-title">{title}</div>
  <div class="lp-prob-desc">{desc}</div>
</div>
""", unsafe_allow_html=True)

    # ══ CAPSULE + STEPS ══
    st.markdown("""
<div style="padding: 3rem 0 2rem 0;">
  <div class="lp-section-label">
    <h3>Cómo funciona nuestra IA</h3>
    <p>Microorganismos · Encapsulación · Machine Learning</p>
  </div>
</div>
""", unsafe_allow_html=True)

    anim_col, steps_col = st.columns([2, 3])
    with anim_col:
        st.markdown("""
<div style="display:flex; flex-direction:column; align-items:center; padding: .5rem 0 1rem 0;">
  <div class="capsule-scene">
    <div class="capsule-outer"></div>
    <div class="bact b1"><div class="b-lbl">Bacillus</div></div>
    <div class="bact b2"><div class="b-lbl">Dehalococcoides</div></div>
    <div class="bact b3"><div class="b-lbl">Rhodotorula</div></div>
    <div class="bact b4"><div class="b-lbl">Ideonella</div></div>
  </div>
  <div style="margin-top:.9rem; font-size:.78rem; color:#6A8A74; text-align:center; max-width:200px; line-height:1.5;">
    Microorganismos BSL-1/GRAS encapsulados en alginato de sodio
  </div>
</div>
""", unsafe_allow_html=True)

    with steps_col:
        for num, title, desc in [
            (1, "Describe tu contaminante y condiciones",
             "Tipo de residuo, temperatura, pH, volumen y zona climática."),
            (2, "La IA consulta 847 microorganismos y diseña el consorcio óptimo",
             "Verifica compatibilidad entre especies, sinergias y ausencia de competencia."),
            (3, "Recibe la receta de tu cápsula con predicción de éxito y protocolo completo",
             "Probabilidad ML, cronograma, costos comparativos y protocolo de despliegue."),
        ]:
            st.markdown(f"""
<div class="lp-step-row">
  <span class="lp-step-num">{num}</span>
  <span class="lp-step-title">{title}</span>
  <div class="lp-step-desc">{desc}</div>
</div>
""", unsafe_allow_html=True)

    # ══ METRICS ══
    st.markdown('<div class="lp-metrics-bg">', unsafe_allow_html=True)
    st.markdown("""
<div style="font-size:.75rem; color:rgba(255,255,255,.55); text-transform:uppercase;
            letter-spacing:2.5px; font-weight:700; text-align:center; margin-bottom:1.5rem;">
  Números que hablan
</div>
""", unsafe_allow_html=True)
    m1, m2, m3, m4 = st.columns(4)
    for mc, num, lbl in [
        (m1, "847+",   "Microorganismos catalogados"),
        (m2, "2,000+", "Papers científicos indexados"),
        (m3, "15+",    "Tipos de contaminantes"),
        (m4, "30+",    "Países con evidencia"),
    ]:
        with mc:
            st.markdown(f"""
<div style="text-align:center; padding:.5rem 0;">
  <div class="lp-metric-num">{num}</div>
  <div class="lp-metric-label">{lbl}</div>
</div>
""", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

    # ══ REFERENCES ══
    st.markdown("""
<div class="lp-refs-bg">
  <div class="lp-refs-title">Respaldados por ciencia de clase mundial</div>
  <div class="lp-refs-row">
    <span class="lp-ref-chip">Nature</span>
    <span class="lp-ref-chip">Science</span>
    <span class="lp-ref-chip">ACS Catalysis</span>
    <span class="lp-ref-chip">Springer</span>
    <span class="lp-ref-chip">PNAS</span>
    <span class="lp-ref-chip">PubMed Central</span>
    <span class="lp-ref-chip">Addgene</span>
    <span class="lp-ref-chip">Premio Nobel Química 2024</span>
  </div>
</div>
""", unsafe_allow_html=True)

    # ══ FOOTER ══
    st.markdown("""
<div class="lp-footer-full">
  <b>Impulso BioCycle</b> © 2026 | Red Bull Basement<br>
  Plataforma global de biorremediación inteligente<br>
  Todos los datos basados en publicaciones científicas revisadas por pares
</div>
""", unsafe_allow_html=True)
