import streamlit as st

st.set_page_config(
    page_title="Impulso BioCycle",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
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
</style>
""", unsafe_allow_html=True)

NAV_PAGES = [
    "🏠 Inicio",
    "🔬 Descubrimientos",
    "🧪 Diseñador de Consorcios",
    "🏭 Portal del Cliente",
    "💬 Asesoría IA",
]

# Support CTA button navigation from the home page
if "nav_page" in st.session_state:
    forced = st.session_state.pop("nav_page")
    if forced in NAV_PAGES:
        st.session_state["_current_page"] = forced

default_idx = NAV_PAGES.index(st.session_state.get("_current_page", "🏠 Inicio"))

with st.sidebar:
    st.markdown("""
    <div style="text-align:center; padding: 8px 0 16px 0;">
        <div style="font-size:32px;">🧬</div>
        <div style="font-size:18px; font-weight:900; letter-spacing:-0.3px;">Impulso BioCycle</div>
        <div style="font-size:12px; opacity:0.85; margin-top:2px;">Biorremediación Inteligente 🇨🇴</div>
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
    st.markdown("""
    <div style="font-size:11px; opacity:0.8; line-height:1.6; text-align:center;">
    Plataforma de diseño de consorcios<br>microbianos basada en IA.<br><br>
    Datos de +2,000 publicaciones<br>científicas peer-reviewed.
    </div>
    """, unsafe_allow_html=True)

if pagina == "🏠 Inicio":
    import views.inicio as inicio
    inicio.render()
elif pagina == "🔬 Descubrimientos":
    import views.descubrimientos as desc
    desc.render()
elif pagina == "🧪 Diseñador de Consorcios":
    import views.disenador as dis
    dis.render()
elif pagina == "🏭 Portal del Cliente":
    import views.portal_cliente as portal
    portal.render()
else:
    import views.asesoria_ia as asesoria
    asesoria.render()

# Footer only shown on non-home pages (home has its own full footer)
if pagina != "🏠 Inicio":
    st.markdown("""
<div class="app-footer">
    <b>Impulso BioCycle</b> © 2026 &nbsp;|&nbsp; Red Bull Basement &nbsp;|&nbsp;
    Datos basados en publicaciones científicas revisadas por pares<br>
    Todos los microorganismos son BSL-1 o GRAS · Desarrollado en Colombia 🇨🇴
</div>
""", unsafe_allow_html=True)
