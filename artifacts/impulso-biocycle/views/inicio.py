import streamlit as st


def render():
    st.markdown("""
    <style>
    /* Remove default Streamlit top padding for this page */
    .block-container { padding-top: 0 !important; padding-bottom: 0 !important; }
    section[data-testid="stMain"] > div { padding-top: 0 !important; }

    * { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }

    /* ── HERO ── */
    .lp-hero {
        min-height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
            linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
            url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920')
            center/cover no-repeat;
        text-align: center;
        padding: 4rem 2rem;
        margin: -1rem -1rem 0 -1rem;
    }
    .lp-hero-inner { max-width: 800px; margin: 0 auto; }
    .lp-hero h1 {
        font-size: 3.5rem;
        font-weight: 900;
        color: #ffffff;
        margin: 0 0 0.5rem 0;
        line-height: 1.1;
        letter-spacing: -1px;
    }
    .lp-hero h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #FFD600;
        margin: 0 0 1.2rem 0;
    }
    .lp-hero p {
        font-size: 1.1rem;
        color: rgba(255,255,255,0.92);
        max-width: 700px;
        margin: 0 auto 2rem auto;
        line-height: 1.7;
    }
    .lp-cta-btn {
        display: inline-block;
        background: linear-gradient(135deg, #00C853, #1B5E20);
        color: white !important;
        font-size: 1.1rem;
        font-weight: 700;
        padding: 0.85rem 2.2rem;
        border-radius: 50px;
        text-decoration: none;
        box-shadow: 0 4px 20px rgba(0,200,83,0.45);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        border: none;
    }
    .lp-cta-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(0,200,83,0.55);
    }

    /* ── Section wrapper ── */
    .lp-section {
        padding: 3rem 1rem;
    }
    .lp-section-title {
        font-size: 2rem;
        font-weight: 800;
        color: #1B4332;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    .lp-section-sub {
        text-align: center;
        color: #666;
        font-size: 1.05rem;
        margin-bottom: 2.5rem;
    }

    /* ── What is section (3 cols) ── */
    .lp-feature-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.8rem;
        box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        border-top: 4px solid #00C853;
        text-align: center;
        height: 100%;
        transition: transform 0.25s, box-shadow 0.25s;
    }
    .lp-feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(27,94,32,0.15);
    }
    .lp-feature-icon { font-size: 2.5rem; margin-bottom: 0.8rem; }
    .lp-feature-title { font-size: 1.15rem; font-weight: 800; color: #1B4332; margin-bottom: 0.6rem; }
    .lp-feature-desc { font-size: 0.95rem; color: #555; line-height: 1.65; }

    /* ── Problem cards grid ── */
    .lp-problem-card {
        background: #1B4332;
        color: white;
        border-radius: 14px;
        padding: 1.5rem 1.6rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.22);
        transition: transform 0.25s, box-shadow 0.25s;
    }
    .lp-problem-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 28px rgba(0,0,0,0.30);
    }
    .lp-problem-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .lp-problem-title { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.4rem; color: #A5D6A7; }
    .lp-problem-desc { font-size: 0.9rem; opacity: 0.88; line-height: 1.6; }

    /* ── Metrics bar ── */
    .lp-metrics {
        background: #1B5E20;
        padding: 3rem 1rem;
        margin: 0 -1rem;
    }
    .lp-metric-item { text-align: center; }
    .lp-metric-num {
        font-size: 3rem;
        font-weight: 900;
        color: #FFD600;
        line-height: 1;
    }
    .lp-metric-label {
        font-size: 0.95rem;
        color: rgba(255,255,255,0.85);
        margin-top: 0.4rem;
    }

    /* ── How it works ── */
    .lp-step-wrap {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    .lp-step {
        background: #fff;
        border-radius: 14px;
        padding: 1.5rem;
        box-shadow: 0 2px 14px rgba(0,0,0,0.08);
        border-top: 4px solid #00C853;
        text-align: center;
        flex: 1;
        min-width: 180px;
        max-width: 240px;
    }
    .lp-step-num {
        background: linear-gradient(135deg,#00C853,#1B5E20);
        color: white;
        width: 36px; height: 36px;
        border-radius: 50%;
        display: inline-flex; align-items: center; justify-content: center;
        font-weight: 900; font-size: 1rem;
        margin-bottom: 0.7rem;
    }
    .lp-step-icon { font-size: 1.7rem; margin-bottom: 0.5rem; }
    .lp-step-title { font-size: 1rem; font-weight: 800; color: #1B4332; margin-bottom: 0.4rem; }
    .lp-step-desc { font-size: 0.85rem; color: #666; line-height: 1.55; }
    .lp-arrow { font-size: 1.8rem; color: #00C853; align-self: center; padding: 0 0.3rem; }

    /* ── References bar ── */
    .lp-refs {
        background: #F5F5F5;
        padding: 2rem 1rem;
        text-align: center;
    }
    .lp-refs-title {
        font-size: 0.85rem;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    .lp-refs-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem 2rem;
    }
    .lp-ref-item {
        font-size: 0.95rem;
        font-weight: 700;
        color: #757575;
        border: 1px solid #DDD;
        border-radius: 8px;
        padding: 6px 16px;
        background: white;
    }

    /* ── Footer ── */
    .lp-footer {
        background: #0A1F0A;
        color: rgba(255,255,255,0.80);
        text-align: center;
        padding: 2.5rem 1rem;
        font-size: 0.9rem;
        line-height: 2;
        margin: 0 -1rem -4rem -1rem;
    }
    .lp-footer b { color: #A5D6A7; }
    </style>

    <!-- ══════════════ SECTION 1: HERO ══════════════ -->
    <div class="lp-hero">
        <div class="lp-hero-inner">
            <h1>Impulso BioCycle</h1>
            <h2>Biorremediación Inteligente con IA</h2>
            <p>Diseñamos consorcios microbianos optimizados por inteligencia artificial para degradar contaminantes.
            Basados en ciencia publicada en Nature, Science y 2,000+ papers revisados por pares.</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # CTA button — clicking it navigates via session_state
    col_l, col_btn, col_r = st.columns([2, 1, 2])
    with col_btn:
        if st.button("🧬 Diseñar mi primer consorcio →", type="primary", use_container_width=True):
            st.session_state["nav_page"] = "🧪 Diseñador de Consorcios"
            st.rerun()

    st.markdown('<div style="height:0.5rem;"></div>', unsafe_allow_html=True)

    # ══════════════ SECTION 2: ¿QUÉ ES? ══════════════
    st.markdown('<div class="lp-section">', unsafe_allow_html=True)
    st.markdown('<div class="lp-section-title">¿Qué es Impulso BioCycle?</div>', unsafe_allow_html=True)
    st.markdown('<div class="lp-section-sub">Ciencia + IA al servicio del medio ambiente</div>', unsafe_allow_html=True)

    f1, f2, f3 = st.columns(3)
    for col, icon, title, desc in [
        (f1, "🧬", "Diseño Inteligente",
         "Nuestra IA analiza 847 microorganismos catalogados y diseña el consorcio óptimo para tu contaminante específico. No recetas genéricas — soluciones personalizadas."),
        (f2, "📊", "Basado en Ciencia Real",
         "Cada recomendación se respalda con publicaciones científicas de Nature, Science, ACS. Probabilidad de éxito calculada con Machine Learning entrenado en datos reales."),
        (f3, "💰", "Ahorro Comprobado",
         "La biorremediación es 3-10x más económica que la excavación. Para empresas textiles, 30-50% menos que tratamiento químico. Convertimos residuos en valor."),
    ]:
        with col:
            st.markdown(f"""
            <div class="lp-feature-card">
                <div class="lp-feature-icon">{icon}</div>
                <div class="lp-feature-title">{title}</div>
                <div class="lp-feature-desc">{desc}</div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

    # ══════════════ SECTION 3: PROBLEMAS ══════════════
    st.markdown('<div class="lp-section" style="background:#F9FBF9; margin:0 -1rem; padding:3rem 2rem;">', unsafe_allow_html=True)
    st.markdown('<div class="lp-section-title">¿Qué problemas resolvemos?</div>', unsafe_allow_html=True)
    st.markdown('<div class="lp-section-sub">De la contaminación al ecosistema restaurado</div>', unsafe_allow_html=True)

    problems = [
        ("🛢️", "Hidrocarburos y Derrames",
         "Degradación in situ con décadas de evidencia. 60-80% eliminación en 60-180 días. Colombia tiene 6,371 sitios petroleros sin remediar."),
        ("🏭", "Aguas Residuales Textiles",
         "Decoloración 85-99%. 200 plantas textiles en Medellín necesitan cumplir Resolución 631/2015."),
        ("🌾", "Suelos Agrícolas Contaminados",
         "Detoxificación de organofosforados, glifosato, carbamatos. Suelo recuperado para uso agrícola."),
        ("♻️", "Plásticos en Biorreactor",
         "Degradación enzimática de PET a monómeros vendibles (TPA $680-850/ton). Reciclaje biológico de nueva generación."),
        ("⛏️", "Contaminación Minera",
         "Metales pesados, drenaje ácido, mercurio. Biosorción y biotransformación."),
        ("💊", "Residuos Farmacéuticos",
         "Degradación de compuestos recalcitrantes en efluentes hospitalarios e industriales."),
    ]

    p_col1, p_col2 = st.columns(2)
    for i, (icon, title, desc) in enumerate(problems):
        col = p_col1 if i % 2 == 0 else p_col2
        with col:
            st.markdown(f"""
            <div class="lp-problem-card">
                <div class="lp-problem-icon">{icon}</div>
                <div class="lp-problem-title">{title}</div>
                <div class="lp-problem-desc">{desc}</div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

    # ══════════════ SECTION 4: MÉTRICAS ══════════════
    st.markdown("""
    <div class="lp-metrics">
        <div style="text-align:center; margin-bottom:0.5rem;">
            <span style="font-size:1rem; color:rgba(255,255,255,0.7); text-transform:uppercase;
                         letter-spacing:2px; font-weight:600;">Números que hablan</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    m1, m2, m3, m4 = st.columns(4)
    for mcol, num, label in [
        (m1, "847+", "Microorganismos catalogados"),
        (m2, "2,000+", "Papers científicos indexados"),
        (m3, "43", "Datos de entrenamiento ML"),
        (m4, "12", "Países con evidencia"),
    ]:
        with mcol:
            st.markdown(f"""
            <div style="background:#1B5E20; padding:1.5rem 1rem; text-align:center;">
                <div class="lp-metric-num">{num}</div>
                <div class="lp-metric-label">{label}</div>
            </div>
            """, unsafe_allow_html=True)

    # ══════════════ SECTION 5: CÓMO FUNCIONA ══════════════
    st.markdown('<div class="lp-section">', unsafe_allow_html=True)
    st.markdown('<div class="lp-section-title">¿Cómo funciona?</div>', unsafe_allow_html=True)
    st.markdown('<div class="lp-section-sub">Tres pasos simples, ciencia de clase mundial</div>', unsafe_allow_html=True)

    s1, arr1, s2, arr2, s3 = st.columns([3, 1, 3, 1, 3])
    steps = [
        (s1, "📋", "Describe tu problema", "Tipo de contaminante, condiciones ambientales, volumen"),
        (s2, "🧬", "La IA diseña tu consorcio", "Microorganismos compatibles, cápsulas, protocolo"),
        (s3, "📊", "Recibe tu plan", "Predicción ML, costos, protocolo de despliegue, probabilidad de éxito"),
    ]
    for i, (col, icon, title, desc) in enumerate(steps):
        with col:
            st.markdown(f"""
            <div class="lp-step">
                <div class="lp-step-num">{i+1}</div>
                <div class="lp-step-icon">{icon}</div>
                <div class="lp-step-title">{title}</div>
                <div class="lp-step-desc">{desc}</div>
            </div>
            """, unsafe_allow_html=True)
    for arrow_col in [arr1, arr2]:
        with arrow_col:
            st.markdown('<div class="lp-arrow" style="text-align:center; padding-top:3rem;">→</div>', unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

    # ══════════════ SECTION 6: REFERENCIAS ══════════════
    st.markdown("""
    <div class="lp-refs">
        <div class="lp-refs-title">Respaldados por ciencia de clase mundial</div>
        <div class="lp-refs-row">
            <span class="lp-ref-item">Nature</span>
            <span class="lp-ref-item">Science</span>
            <span class="lp-ref-item">ACS Catalysis</span>
            <span class="lp-ref-item">Springer</span>
            <span class="lp-ref-item">PubMed Central</span>
            <span class="lp-ref-item">Addgene</span>
            <span class="lp-ref-item">Premio Nobel Química 2024</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ══════════════ SECTION 7: FOOTER ══════════════
    st.markdown("""
    <div class="lp-footer">
        <b>Impulso BioCycle</b> © 2026 | Red Bull Basement Colombia<br>
        Todos los datos basados en publicaciones científicas revisadas por pares<br>
        Hecho con 🧬 en Colombia 🇨🇴
    </div>
    """, unsafe_allow_html=True)
