import streamlit as st

st.set_page_config(
    page_title="Impulso BioCycle",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

/* ── Typography system (premium) ── */
html, body, [class*="st-"], [class*="css-"], section[data-testid="stMain"] * {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11", "ss01", "ss02";
}
code, pre, .mono, .tabular, [class*="stCode"] {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace !important;
    font-feature-settings: "zero", "cv01", "cv02";
}
.serif-display {
    font-family: 'Instrument Serif', Georgia, serif !important;
    font-style: italic;
    letter-spacing: -0.02em;
}
h1, h2, h3, h4, h5 {
    letter-spacing: -0.02em !important;
    font-weight: 700 !important;
}
h1 { letter-spacing: -0.035em !important; font-weight: 800 !important; }

/* Tabular nums on metric-like elements */
[data-testid="stMetricValue"],
.big-number, .lp-metric-num, .fin-value, .env-value,
.card-result, .card-meta, .step-title {
    font-feature-settings: "tnum", "cv02", "cv03";
    font-variant-numeric: tabular-nums;
}

/* ── Design tokens (CSS vars) ── */
:root {
    --forest-deep: #004D2C;
    --forest-mid: #1B5E20;
    --forest-soft: #2E7D32;
    --green-bright: #00C853;
    --cyan-electric: #00D9F5;
    --lime-yellow: #C4FF00;
    --ink: #0F2419;
    --ink-soft: #1B4332;
    --muted: #6A8A74;
    --muted-light: #A8BFB0;
    --canvas: #FFFFFF;
    --canvas-soft: #F4FBF7;
    --canvas-warm: #F8FBF9;
    --border: #E0ECE2;
    --border-soft: #EEF4EF;
    --warning: #EF6C00;
    --warning-soft: #FFF3E0;

    /* Elevations */
    --shadow-xs: 0 1px 2px rgba(15,36,25,0.05);
    --shadow-sm: 0 2px 8px rgba(15,36,25,0.06), 0 1px 2px rgba(15,36,25,0.04);
    --shadow-md: 0 4px 16px rgba(15,36,25,0.08), 0 2px 4px rgba(15,36,25,0.05);
    --shadow-lg: 0 12px 28px rgba(15,36,25,0.10), 0 4px 10px rgba(15,36,25,0.06);
    --shadow-xl: 0 20px 50px -12px rgba(27,94,32,0.25);
    --shadow-brand: 0 8px 24px -6px rgba(0,200,83,0.35);
}

/* ── Sidebar gradient ── */
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #1B5E20 0%, #2E7D32 40%, #388E3C 70%, #43A047 100%) !important;
}
[data-testid="stSidebar"] * {
    color: white !important;
}
[data-testid="stSidebar"] .stRadio label {
    color: white !important;
    font-weight: 600;
    font-size: 15px;
}
[data-testid="stSidebar"] .stRadio div[role="radiogroup"] {
    gap: 6px;
}
[data-testid="stSidebar"] hr {
    border-color: rgba(255,255,255,0.3) !important;
}
[data-testid="stSidebarContent"] {
    padding-top: 1.5rem;
}

/* ── Hero section ── */
.hero-section {
    background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #00C853 100%);
    border-radius: 20px;
    padding: 36px 40px;
    color: white;
    margin-bottom: 28px;
    box-shadow: 0 8px 32px rgba(27,94,32,0.35);
    position: relative;
    overflow: hidden;
}
.hero-section::before {
    content: "";
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
}
.hero-section::after {
    content: "";
    position: absolute;
    bottom: -40px; left: -40px;
    width: 160px; height: 160px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
}
.hero-title {
    font-size: 36px;
    font-weight: 900;
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.hero-subtitle {
    font-size: 16px;
    opacity: 0.92;
    margin: 0 0 10px 0;
    font-weight: 400;
}
.hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 600;
    backdrop-filter: blur(4px);
}

/* ── Cards ── */
.discovery-card {
    background: white;
    border-radius: 14px;
    padding: 22px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.09);
    border-left: 5px solid #1B5E20;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.discovery-card:hover {
    box-shadow: 0 8px 28px rgba(27,94,32,0.18);
    transform: translateY(-2px);
}
.result-section {
    background: white;
    border-radius: 14px;
    padding: 22px 26px;
    margin-bottom: 22px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    transition: box-shadow 0.25s ease;
}
.result-section:hover {
    box-shadow: 0 6px 24px rgba(27,94,32,0.13);
}
.card-badge {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
}
.card-title {
    font-size: 20px;
    font-weight: 700;
    color: #1B4332;
    margin: 6px 0;
}
.card-meta {
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
}
.card-result {
    background: #F1F8E9;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 600;
    color: #1B5E20;
    margin: 10px 0;
}
.stat-box {
    background: linear-gradient(135deg, #1B5E20, #2E7D32);
    border-radius: 14px;
    padding: 18px 24px;
    color: white;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    box-shadow: 0 4px 14px rgba(27,94,32,0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(27,94,32,0.30);
}
.step-box {
    background: #F1F8E9;
    border-radius: 10px;
    padding: 14px 18px;
    margin: 8px 0;
    border-left: 4px solid #00C853;
    font-size: 15px;
    transition: background 0.2s;
}
.step-box:hover {
    background: #E8F5E9;
}
.capsule-card {
    background: linear-gradient(135deg, #F1F8E9, #E8F5E9);
    border-radius: 14px;
    padding: 18px 22px;
    border: 2px solid #00C853;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0,200,83,0.12);
}
.metric-box {
    background: linear-gradient(135deg, #1B5E20, #2E7D32);
    color: white;
    border-radius: 12px;
    padding: 18px;
    text-align: center;
    box-shadow: 0 4px 14px rgba(27,94,32,0.25);
}
.big-number { font-size: 36px; font-weight: 900; }
.big-label { font-size: 13px; opacity: 0.85; margin-top: 4px; }

/* ── Loading phase animation ── */
.phase-box {
    background: linear-gradient(135deg, #E8F5E9, #F1F8E9);
    border-radius: 12px;
    padding: 16px 20px;
    border-left: 4px solid #00C853;
    font-size: 15px;
    font-weight: 600;
    color: #1B5E20;
    margin: 4px 0;
    animation: fadeSlide 0.35s ease;
}
@keyframes fadeSlide {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
}

/* ── Footer ── */
.app-footer {
    margin-top: 40px;
    padding: 18px 0 8px 0;
    border-top: 1px solid #E0E0E0;
    text-align: center;
    font-size: 12px;
    color: #999;
    line-height: 1.8;
}
.app-footer b { color: #1B5E20; }
.app-footer a { color: #1B5E20; text-decoration: none; border-bottom: 1px dotted #1B5E20; }
.app-footer a:hover { opacity: 0.75; }

/* ══════════════════════════════════════════════════════════════════ */
/* ─── Micro-animaciones globales (Fase 0 · E2.5) ────────────────── */
/* ══════════════════════════════════════════════════════════════════ */

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
}
@keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0, 217, 245, 0.35); }
    50%      { box-shadow: 0 0 0 12px rgba(0, 217, 245, 0); }
}
@keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
}

/* Aplicar fadeInUp a cards al renderizar */
.discovery-card, .result-section, .capsule-card, .metric-box, .stat-box {
    animation: fadeInUp 0.45s ease both;
}

/* Botones primarios de Streamlit — hover lift + pulso en focus */
[data-testid="stButton"] > button[kind="primary"],
button[kind="primary"] {
    transition: transform 0.18s ease, box-shadow 0.22s ease, filter 0.18s ease !important;
    will-change: transform, box-shadow;
}
[data-testid="stButton"] > button[kind="primary"]:hover,
button[kind="primary"]:hover {
    transform: translateY(-1px) scale(1.015) !important;
    filter: brightness(1.04);
}
[data-testid="stButton"] > button[kind="primary"]:active,
button[kind="primary"]:active {
    transform: translateY(0) scale(0.99) !important;
}

/* Pulso suave en CTA críticos — aplicar vía class .cta-pulse */
.cta-pulse button[kind="primary"] {
    animation: pulseGlow 2.6s ease-in-out infinite;
}

/* Tabs del Portal — transición suave al cambiar */
[data-baseweb="tab-list"] button {
    transition: color 0.2s ease, border-color 0.2s ease !important;
}
[data-baseweb="tab-panel"] > div {
    animation: fadeIn 0.3s ease both;
}

/* Skeleton loader utility (para RAG chat en E2.6) */
.skeleton-line {
    background: linear-gradient(90deg, #eaeaea 0%, #f4f4f4 50%, #eaeaea 100%);
    background-size: 1200px 100%;
    animation: shimmer 1.4s linear infinite;
    border-radius: 4px;
    height: 14px;
    margin: 6px 0;
}
.skeleton-line.short { width: 60%; }
.skeleton-line.long { width: 92%; }

/* Escucha Activa staggered card reveals (E2.8 — aplicado en views/portal_cliente.py) */
.escucha-card {
    animation: fadeInUp 0.5s ease both;
}
.escucha-card:nth-child(1) { animation-delay: 0.05s; }
.escucha-card:nth-child(2) { animation-delay: 0.18s; }
.escucha-card:nth-child(3) { animation-delay: 0.32s; }

/* Streamlit expander — brand styling (reemplaza el look default pobre) */
div[data-testid="stExpander"] {
    border: 1px solid #E0ECE2 !important;
    border-radius: 12px !important;
    background: white !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    margin-bottom: 10px !important;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
div[data-testid="stExpander"]:hover {
    border-color: #00C853 !important;
    box-shadow: 0 4px 16px rgba(0,200,83,0.12) !important;
}
div[data-testid="stExpander"] summary {
    padding: 14px 18px !important;
    font-weight: 600 !important;
    color: #1B4332 !important;
    transition: background 0.18s ease;
}
div[data-testid="stExpander"] summary:hover {
    background: rgba(0,200,83,0.04) !important;
}
div[data-testid="stExpander"] > details[open] > summary {
    border-bottom: 1px solid #EEF4EF;
}

/* Streamlit info/success/warning boxes — cleaner look */
div[data-testid="stAlert"] {
    border-radius: 12px !important;
    border-width: 0 !important;
    border-left-width: 4px !important;
    animation: fadeIn 0.3s ease both;
}

/* Streamlit tabs — brand colors on active */
button[data-baseweb="tab"][aria-selected="true"] {
    color: #00C853 !important;
    border-bottom-color: #00C853 !important;
}
button[data-baseweb="tab"] {
    font-weight: 600 !important;
}

/* Plotly chart container — subtle lift */
div[data-testid="stPlotlyChart"] {
    border-radius: 14px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    padding: 8px;
    transition: box-shadow 0.22s ease;
}
div[data-testid="stPlotlyChart"]:hover {
    box-shadow: 0 6px 24px rgba(27,94,32,0.10);
}

/* Dataframe — cleaner header */
div[data-testid="stDataFrame"] {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #E0ECE2;
}

/* Page breadcrumb — sustituye los hero redundantes en views no-home (E2.3) */
.page-breadcrumb {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 4px 18px 4px;
    margin-bottom: 6px;
    border-bottom: 1px solid #E6EFE9;
    animation: fadeIn 0.25s ease both;
}
.page-breadcrumb .bc-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #00C853;
    box-shadow: 0 0 0 3px rgba(0,200,83,0.18);
}
.page-breadcrumb .bc-title {
    font-size: 20px;
    font-weight: 800;
    color: #1B4332;
    letter-spacing: -0.2px;
}
.page-breadcrumb .bc-sub {
    font-size: 12px;
    color: #6A8A74;
    margin-left: auto;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    font-weight: 600;
}

/* Reduce motion respect */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
""", unsafe_allow_html=True)

NAV_PAGES = [
    "🏠 Inicio",
    "📚 Descubrimientos",
    "🧬 Construye tu Consorcio",
    "🏭 Gestiona tus Residuos",
    "💬 Asesoría IA",
]

# Support CTA button navigation from the home page
if "nav_page" in st.session_state:
    forced = st.session_state.pop("nav_page")
    if forced in NAV_PAGES:
        st.session_state["_current_page"] = forced

default_idx = NAV_PAGES.index(st.session_state.get("_current_page", "🏠 Inicio"))

with st.sidebar:
    # Logo brand hero.png (Fase 0 · E2.1)
    try:
        st.image("static/hero.png", use_container_width=True)
    except Exception:
        # Fallback si la imagen no está accesible en el servidor estático
        st.markdown(
            '<div style="font-size:28px; text-align:center; padding:8px;">🧬</div>',
            unsafe_allow_html=True,
        )
    st.markdown("""
    <div style="text-align:center; padding: 4px 0 12px 0;">
        <div style="font-size:11px; opacity:0.85; letter-spacing:1.2px; text-transform:uppercase;">
            Biorremediación global con IA
        </div>
    </div>
    """, unsafe_allow_html=True)
    st.divider()

    pagina = st.radio(
        "Navegación",
        NAV_PAGES,
        index=default_idx,
        label_visibility="collapsed",
    )
    st.session_state["_current_page"] = pagina

    st.divider()
    from data import AGGREGATE_PUBLICATIONS
    st.markdown(f"""
    <div style="font-size:11px; opacity:0.8; line-height:1.6; text-align:center;">
    Plataforma global de diseño de<br>consorcios microbianos con IA.<br><br>
    Literatura peer-reviewed: {AGGREGATE_PUBLICATIONS:,}<br>referencias científicas agregadas.
    </div>
    """, unsafe_allow_html=True)

if pagina == "🏠 Inicio":
    import views.inicio as inicio
    inicio.render()
elif pagina == "📚 Descubrimientos":
    import views.descubrimientos as desc
    desc.render()
elif pagina == "🧬 Construye tu Consorcio":
    import views.disenador as dis
    dis.render()
elif pagina == "🏭 Gestiona tus Residuos":
    import views.portal_cliente as portal
    portal.render()
else:
    import views.asesoria_ia as asesoria
    asesoria.render()

# ─────────────────────────────────────────────────────────────────
# Footer global y consistente en TODAS las vistas (Fase 0 · E2.2)
# El home tiene su hero propio; el footer aparece siempre al pie.
# ─────────────────────────────────────────────────────────────────
st.markdown("""
<div class="app-footer">
    <b>Impulso BioCycle</b> © 2026 &nbsp;|&nbsp; Capital Semilla Nacional &nbsp;|&nbsp;
    Plataforma global de biorremediación inteligente
    <br>
    Todos los microorganismos son BSL-1 o GRAS &nbsp;·&nbsp;
    <a href="https://github.com/maorozco/impulso-biocycle" target="_blank">GitHub</a>
    &nbsp;·&nbsp;
    <a href="mailto:contacto@impulso-biocycle.com">contacto@impulso-biocycle.com</a>
    <br>
    <span style="font-size:10px; opacity:0.75;">
        Estimaciones basadas en literatura peer-reviewed · los resultados reales varían según condiciones del sitio
    </span>
</div>
""", unsafe_allow_html=True)
