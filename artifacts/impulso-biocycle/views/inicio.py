import streamlit as st


def _css():
    st.markdown("""
<style>
* { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.block-container { padding-top: 0 !important; }
section[data-testid="stMain"] > div { padding-top: 0 !important; }

/* ─── HERO ─── */
.lp-hero {
    min-height: 500px;
    display: flex; align-items: center; justify-content: center;
    background:
        linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
        url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920')
        center / cover no-repeat;
    text-align: center;
    padding: 4.5rem 2rem 3.5rem 2rem;
    margin: -1rem -1rem 0 -1rem;
}
.lp-hero-inner { max-width: 820px; margin: 0 auto; }
.lp-hero h1 {
    font-size: 3.5rem; font-weight: 900; color: #fff;
    margin: 0 0 .4rem 0; line-height: 1.05; letter-spacing: -1.5px;
}
.lp-hero h2 {
    font-size: 1.3rem; font-weight: 500; font-style: italic;
    color: #FFD600; margin: 0 0 1.1rem 0;
}
.lp-hero p {
    font-size: 1.1rem; color: rgba(255,255,255,.9);
    max-width: 680px; margin: 0 auto 2.2rem auto; line-height: 1.75;
}

/* ─── WHAT IS ─── */
.lp-what {
    background: #fff;
    padding: 3.5rem 2rem;
    text-align: center;
}
.lp-what-title {
    font-size: 1.8rem; font-weight: 800; color: #1B4332; margin-bottom: 1.2rem;
}
.lp-what-body {
    font-size: 1.1rem; color: #444; max-width: 760px;
    margin: 0 auto; line-height: 1.8;
}

/* ─── TWO PATHS ─── */
.lp-path-card-green {
    background: #1B5E20; color: white;
    border-radius: 18px; padding: 2.2rem 2rem;
    height: 100%; box-sizing: border-box;
    box-shadow: 0 6px 28px rgba(27,94,32,0.32);
    transition: transform .25s, box-shadow .25s;
}
.lp-path-card-green:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(27,94,32,0.42); }
.lp-path-card-dark {
    background: #263238; color: white;
    border-radius: 18px; padding: 2.2rem 2rem;
    height: 100%; box-sizing: border-box;
    box-shadow: 0 6px 28px rgba(38,50,56,0.30);
    transition: transform .25s, box-shadow .25s;
}
.lp-path-card-dark:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(38,50,56,0.40); }
.lp-path-icon { font-size: 2.4rem; margin-bottom: .7rem; }
.lp-path-title { font-size: 1.35rem; font-weight: 900; margin-bottom: .3rem; letter-spacing: -.3px; }
.lp-path-sub { font-size: .92rem; opacity: .8; margin-bottom: 1.1rem; }
.lp-path-list { list-style: none; padding: 0; margin: 0 0 1.4rem 0; }
.lp-path-list li { font-size: .93rem; opacity: .9; margin-bottom: .5rem; padding-left: .3rem; }
.lp-path-list li::before { content: "✓ "; font-weight: 700; opacity: .7; }

/* ─── PROBLEM GRID ─── */
.lp-prob-item {
    background: white; border-radius: 14px; padding: 1.4rem 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    border-left: 4px solid #00C853;
    transition: transform .2s, box-shadow .2s;
}
.lp-prob-item:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(27,94,32,0.14); }
.lp-prob-icon { font-size: 1.6rem; margin-bottom: .35rem; }
.lp-prob-title { font-size: 1rem; font-weight: 800; color: #1B4332; margin-bottom: .3rem; }
.lp-prob-desc { font-size: .88rem; color: #666; line-height: 1.55; }

/* ─── CAPSULE ANIMATION ─── */
.capsule-scene {
    position: relative; width: 260px; height: 260px;
    margin: 0 auto;
}
.capsule-outer {
    position: absolute; top: 50%; left: 50%;
    width: 200px; height: 200px;
    transform: translate(-50%, -50%);
    border: 3px solid rgba(0,200,83,0.55);
    border-radius: 50%;
    background: rgba(0,200,83,0.07);
    animation: capsule-pulse 3s ease-in-out infinite;
}
.bact {
    position: absolute; border-radius: 50%;
    width: 38px; height: 38px;
    animation-duration: 3s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}
.b1 { background: rgba(0,200,83,.85);  top: 68px; left: 52px;  animation-name: float1; }
.b2 { background: rgba(33,150,243,.8); top: 52px; left: 148px; animation-name: float2; }
.b3 { background: rgba(255,193,7,.85); top: 150px;left: 60px;  animation-name: float3; }
.b4 { background: rgba(156,39,176,.8); top: 145px;left: 150px; animation-name: float4; }
.b-label {
    position: absolute; font-size: 8px; font-weight: 700;
    color: white; width: 100%; text-align: center; top: 50%;
    transform: translateY(-50%); line-height: 1.2; padding: 0 3px;
}
@keyframes capsule-pulse {
    0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: .9; }
    50%      { transform: translate(-50%,-50%) scale(1.08); opacity: 1; }
}
@keyframes float1 {
    0%,100% { top: 68px;  left: 52px; }
    50%     { top: 78px;  left: 62px; }
}
@keyframes float2 {
    0%,100% { top: 52px;  left: 148px; }
    50%     { top: 62px;  left: 138px; }
}
@keyframes float3 {
    0%,100% { top: 150px; left: 60px; }
    50%     { top: 140px; left: 70px; }
}
@keyframes float4 {
    0%,100% { top: 145px; left: 150px; }
    50%     { top: 155px; left: 140px; }
}

/* ─── METRICS BAR ─── */
.lp-metrics-bar {
    background: #1B5E20; padding: 3rem 1rem;
    margin: 0 -1rem; text-align: center;
}
.lp-metric-num  { font-size: 3rem; font-weight: 900; color: #FFD600; line-height: 1; }
.lp-metric-label { font-size: .92rem; color: rgba(255,255,255,.82); margin-top: .4rem; }

/* ─── REFS ─── */
.lp-refs-bar {
    background: #F5F5F5; padding: 2.2rem 1rem; text-align: center;
    margin: 0 -1rem;
}
.lp-refs-title {
    font-size: .78rem; color: #AAA; text-transform: uppercase;
    letter-spacing: 2.5px; font-weight: 700; margin-bottom: 1.1rem;
}
.lp-refs-row { display: flex; flex-wrap: wrap; justify-content: center; gap: .8rem 1.6rem; }
.lp-ref-chip {
    font-size: .88rem; font-weight: 700; color: #666;
    border: 1px solid #DDD; border-radius: 8px;
    padding: 5px 14px; background: white;
}

/* ─── FOOTER ─── */
.lp-footer-full {
    background: #0A1F0A; color: rgba(255,255,255,.78);
    text-align: center; padding: 2.8rem 1rem;
    font-size: .9rem; line-height: 2.1;
    margin: 0 -1rem -4rem -1rem;
}
.lp-footer-full b { color: #A5D6A7; }

/* ─── STEP CARDS ─── */
.lp-step-card {
    background: #F1F8E9; border-radius: 14px; padding: 1.3rem 1.5rem;
    margin-bottom: 1rem; border-left: 4px solid #00C853;
}
.lp-step-num-badge {
    display: inline-flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg,#00C853,#1B5E20);
    color: white; width: 28px; height: 28px; border-radius: 50%;
    font-weight: 900; font-size: .9rem; margin-right: .6rem;
    flex-shrink: 0; vertical-align: middle;
}
.lp-step-text { font-size: .95rem; color: #1B4332; font-weight: 600; display: inline; vertical-align: middle; }
.lp-step-sub  { font-size: .85rem; color: #555; margin-top: .35rem; padding-left: 2.2rem; line-height: 1.55; }
</style>
""", unsafe_allow_html=True)


def render():
    _css()

    # ══ HERO ══
    st.markdown("""
<div class="lp-hero">
  <div class="lp-hero-inner">
    <h1>Impulso BioCycle</h1>
    <h2>creates substances based on living organisms</h2>
    <p>Plataforma global de inteligencia artificial para diseño de soluciones biológicas de biorremediación.
    Basada en ciencia publicada en Nature, Science y 2,000+ papers revisados por pares.</p>
  </div>
</div>
""", unsafe_allow_html=True)

    # CTA buttons
    st.markdown('<div style="height:.8rem;"></div>', unsafe_allow_html=True)
    cta_l, cta1, cta2, cta_r = st.columns([1, 2, 2, 1])
    with cta1:
        if st.button("🧬 Construye tu Consorcio\nPara laboratorios y productores",
                     type="primary", use_container_width=True, key="cta_cons"):
            st.session_state["nav_page"] = "🧬 Construye tu Consorcio"
            st.rerun()
    with cta2:
        if st.button("🏭 Gestiona tus Residuos\nPara empresas y operadores",
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
    st.markdown('<div style="padding: 3rem 0 1rem 0;">', unsafe_allow_html=True)
    st.markdown("""
<div style="text-align:center; margin-bottom:1.8rem;">
  <div style="font-size:1.8rem; font-weight:800; color:#1B4332;">Dos caminos, un objetivo</div>
  <div style="font-size:1rem; color:#666; margin-top:.4rem;">Elige el que se adapta a tu rol</div>
</div>
""", unsafe_allow_html=True)

    dc_l, dc_r = st.columns(2)
    with dc_l:
        st.markdown("""
<div class="lp-path-card-green">
  <div class="lp-path-icon">🧬</div>
  <div class="lp-path-title">CONSTRUYE TU CONSORCIO</div>
  <div class="lp-path-sub">Para laboratorios, investigadores y productores de soluciones</div>
  <ul class="lp-path-list">
    <li>Diseña consorcios personalizados desde cero</li>
    <li>Selecciona microorganismos BSL-1/GRAS verificados</li>
    <li>Verifica compatibilidad entre especies</li>
    <li>Obtén formulación de cápsula optimizada</li>
    <li>Predicción ML de degradación</li>
    <li>Protocolo de preparación paso a paso</li>
  </ul>
</div>
""", unsafe_allow_html=True)
        if st.button("Empezar a diseñar →", type="primary",
                     use_container_width=True, key="path_cons"):
            st.session_state["nav_page"] = "🧬 Construye tu Consorcio"
            st.rerun()

    with dc_r:
        st.markdown("""
<div class="lp-path-card-dark">
  <div class="lp-path-icon">🏭</div>
  <div class="lp-path-title">GESTIONA TUS RESIDUOS</div>
  <div class="lp-path-sub">Para empresas industriales, operadores y consultoras</div>
  <ul class="lp-path-list">
    <li>Selecciona tu tipo de operación y residuo</li>
    <li>Recibe una solución pre-diseñada y probada</li>
    <li>Plan operativo mes a mes</li>
    <li>Análisis financiero: inversión, ahorro, ROI</li>
    <li>Cumplimiento normativo automático</li>
    <li>Impacto ambiental cuantificado</li>
  </ul>
</div>
""", unsafe_allow_html=True)
        if st.button("Ver soluciones →", use_container_width=True, key="path_portal"):
            st.session_state["nav_page"] = "🏭 Gestiona tus Residuos"
            st.rerun()

    st.markdown('</div>', unsafe_allow_html=True)

    # ══ QUÉ PROBLEMAS ══
    st.markdown("""
<div style="background:#F9FBF9; margin: 1rem -1rem 0 -1rem; padding: 3rem 2rem;">
  <div style="text-align:center; margin-bottom:1.8rem;">
    <div style="font-size:1.8rem; font-weight:800; color:#1B4332;">¿Qué problemas resolvemos?</div>
    <div style="font-size:1rem; color:#666; margin-top:.4rem;">De la contaminación al ecosistema restaurado</div>
  </div>
</div>
""", unsafe_allow_html=True)

    problems = [
        ("🛢️", "Hidrocarburos y derrames",
         "60-80% eliminación in situ. Décadas de evidencia global."),
        ("🏭", "Aguas residuales industriales",
         "Decoloración 85-99%. Tratamiento biológico más económico."),
        ("🌾", "Suelos agrícolas contaminados",
         "Detoxificación de plaguicidas. Suelo recuperado para uso."),
        ("♻️", "Plásticos en biorreactor",
         "PET a monómeros vendibles ($680-850/ton)."),
        ("⛏️", "Contaminación minera",
         "Metales pesados, drenaje ácido, mercurio."),
        ("💊", "Efluentes farmacéuticos",
         "Compuestos recalcitrantes en agua hospitalaria."),
    ]
    pb1, pb2, pb3 = st.columns(3)
    cols_cycle = [pb1, pb2, pb3]
    for i, (icon, title, desc) in enumerate(problems):
        with cols_cycle[i % 3]:
            st.markdown(f"""
<div class="lp-prob-item">
  <div class="lp-prob-icon">{icon}</div>
  <div class="lp-prob-title">{title}</div>
  <div class="lp-prob-desc">{desc}</div>
</div>
""", unsafe_allow_html=True)

    # ══ CAPSULE ANIMATION + STEPS ══
    st.markdown("""
<div style="padding: 3rem 0 2rem 0;">
  <div style="text-align:center; margin-bottom:2rem;">
    <div style="font-size:1.8rem; font-weight:800; color:#1B4332;">Cómo funciona nuestra IA</div>
    <div style="font-size:1rem; color:#666; margin-top:.4rem;">Microorganismos + Encapsulación + Machine Learning</div>
  </div>
</div>
""", unsafe_allow_html=True)

    anim_col, steps_col = st.columns([2, 3])
    with anim_col:
        st.markdown("""
<div style="display:flex; flex-direction:column; align-items:center; justify-content:center;
            padding: 1rem 0;">
  <div class="capsule-scene">
    <div class="capsule-outer"></div>
    <div class="bact b1"><div class="b-label">Bacillus</div></div>
    <div class="bact b2"><div class="b-label">Dehalococcoides</div></div>
    <div class="bact b3"><div class="b-label">Rhodotorula</div></div>
    <div class="bact b4"><div class="b-label">Ideonella</div></div>
  </div>
  <div style="margin-top:1rem; font-size:.82rem; color:#888; text-align:center; max-width:220px;">
    Microorganismos BSL-1/GRAS siendo encapsulados en alginato de sodio
  </div>
</div>
""", unsafe_allow_html=True)

    with steps_col:
        for num, icon, title, desc in [
            (1, "📋", "Describe tu contaminante y condiciones",
             "Tipo de residuo, temperatura, pH, volumen y zona climática."),
            (2, "🧬", "Nuestra IA consulta 847 microorganismos y diseña el consorcio óptimo",
             "Verifica compatibilidad entre especies, sinergias y ausencia de competencia."),
            (3, "💊", "Recibe la receta de tu cápsula con predicción de éxito y protocolo completo",
             "Probabilidad ML, cronograma, costos comparativos y protocolo de despliegue."),
        ]:
            st.markdown(f"""
<div class="lp-step-card">
  <span class="lp-step-num-badge">{num}</span>
  <span class="lp-step-text">{icon} {title}</span>
  <div class="lp-step-sub">{desc}</div>
</div>
""", unsafe_allow_html=True)

    # ══ METRICS ══
    st.markdown("""
<div class="lp-metrics-bar">
  <div style="font-size:.8rem; color:rgba(255,255,255,.65); text-transform:uppercase;
              letter-spacing:2.5px; font-weight:700; margin-bottom:1.5rem;">
    Números que hablan
  </div>
</div>
""", unsafe_allow_html=True)

    m1, m2, m3, m4 = st.columns(4)
    for mc, num, lbl in [
        (m1, "847+",   "Microorganismos catalogados"),
        (m2, "2,000+", "Papers científicos"),
        (m3, "15+",    "Tipos de contaminantes"),
        (m4, "30+",    "Países con evidencia"),
    ]:
        with mc:
            st.markdown(f"""
<div style="background:#1B5E20; padding:1.6rem 1rem; text-align:center;">
  <div class="lp-metric-num">{num}</div>
  <div class="lp-metric-label">{lbl}</div>
</div>
""", unsafe_allow_html=True)

    # ══ REFERENCES ══
    st.markdown("""
<div class="lp-refs-bar">
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
