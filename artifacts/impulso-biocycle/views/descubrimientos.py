import streamlit as st
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from data import DISCOVERIES, CATEGORY_COLORS


CSS = """
<style>
.discovery-card {
    background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10); border-left: 5px solid #1B5E20;
    transition: box-shadow 0.2s;
}
.discovery-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.18); }
.card-badge {
    display: inline-block; padding: 3px 12px; border-radius: 20px;
    font-size: 13px; font-weight: 600; color: white; margin-bottom: 8px;
}
.card-title { font-size: 20px; font-weight: 700; color: #1B4332; margin: 6px 0; }
.card-meta { font-size: 13px; color: #666; margin-bottom: 10px; }
.card-result {
    background: #F1F8E9; border-radius: 8px; padding: 10px 14px;
    font-size: 14px; font-weight: 600; color: #1B5E20; margin: 10px 0;
}
.stat-box {
    background: linear-gradient(135deg, #1B5E20, #2E7D32); border-radius: 12px;
    padding: 18px 24px; color: white; text-align: center;
    font-size: 18px; font-weight: 600; margin-bottom: 10px;
}
</style>
"""


def render():
    st.markdown(CSS, unsafe_allow_html=True)
    st.markdown("""
    <div class="page-breadcrumb">
        <div class="bc-dot"></div>
        <div class="bc-title">Descubrimientos</div>
        <div class="bc-sub">investigación peer-reviewed</div>
    </div>
    """, unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("""
        <div class="stat-box">
            🔬 10 descubrimientos
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="stat-box">
            🧫 50+ microorganismos
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown("""
        <div class="stat-box">
            🌍 12 países
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")
    st.subheader("Filtrar por categoría")

    categories = ["Todas", "Enzima", "Bacteria", "Consorcio", "Proyecto", "IA"]
    cols = st.columns(len(categories))
    selected = st.session_state.get("filter_cat", "Todas")

    for i, cat in enumerate(categories):
        with cols[i]:
            if st.button(cat, key=f"filter_{cat}", use_container_width=True,
                         type="primary" if selected == cat else "secondary"):
                st.session_state["filter_cat"] = cat
                st.rerun()

    selected = st.session_state.get("filter_cat", "Todas")

    if selected == "Todas":
        filtered = DISCOVERIES
    else:
        filtered = [d for d in DISCOVERIES if d["category"] == selected]

    st.markdown(f"<p style='color:#666; font-size:14px;'>Mostrando <b>{len(filtered)}</b> resultados</p>", unsafe_allow_html=True)
    st.markdown("---")

    cols_grid = st.columns(2)
    for i, discovery in enumerate(filtered):
        color = CATEGORY_COLORS.get(discovery["category"], "#1B5E20")
        with cols_grid[i % 2]:
            st.markdown(f"""
            <div class="discovery-card" style="border-left-color: {color};">
                <div>
                    <span class="card-badge" style="background-color: {color};">{discovery['category']}</span>
                    <span style="font-size:13px; color:#888; margin-left:10px;">📅 {discovery['year']}</span>
                </div>
                <div class="card-title">{discovery['title']}</div>
                <div class="card-meta">🏛️ {discovery['institution']}</div>
                <p style="font-size:14px; color:#444; margin-bottom:10px;">{discovery['description']}</p>
                <div class="card-result">
                    📊 <b>Resultado clave:</b> {discovery['result']}
                </div>
                <a href="{discovery['link']}" target="_blank" style="
                    display: inline-block;
                    background: {color};
                    color: white;
                    padding: 6px 16px;
                    border-radius: 20px;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    margin-top: 6px;
                ">Ver paper →</a>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("""
    <div style="background:#F1F8E9; border-radius:10px; padding:14px 18px; color:#1B4332; font-size:13px;">
    📚 <b>Fuentes:</b> Todos los descubrimientos están basados en publicaciones revisadas por pares en revistas como <i>Nature</i>, <i>Science</i>, y bases de datos como PubMed y Scopus.
    Los enlaces abren los artículos originales en nuevas pestañas.
    </div>
    """, unsafe_allow_html=True)
