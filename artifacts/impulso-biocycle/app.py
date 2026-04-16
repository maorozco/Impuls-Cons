import streamlit as st

st.set_page_config(
    page_title="Impulso BioCycle",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
.discovery-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    border-left: 5px solid #1B5E20;
    transition: box-shadow 0.2s;
}
.discovery-card:hover {
    box-shadow: 0 4px 18px rgba(0,0,0,0.18);
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
    border-radius: 12px;
    padding: 18px 24px;
    color: white;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
}
.step-box {
    background: #F1F8E9;
    border-radius: 10px;
    padding: 14px 18px;
    margin: 8px 0;
    border-left: 4px solid #00C853;
    font-size: 15px;
}
.result-section {
    background: white;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.capsule-card {
    background: linear-gradient(135deg, #F1F8E9, #E8F5E9);
    border-radius: 12px;
    padding: 18px 22px;
    border: 2px solid #00C853;
    margin-bottom: 12px;
}
.metric-box {
    background: #1B5E20;
    color: white;
    border-radius: 10px;
    padding: 14px;
    text-align: center;
}
.big-number {
    font-size: 32px;
    font-weight: 800;
}
.big-label {
    font-size: 13px;
    opacity: 0.85;
}
</style>
""", unsafe_allow_html=True)

with st.sidebar:
    st.markdown("## 🧬 Impulso BioCycle")
    st.markdown("*Biorremediación de vanguardia 🇨🇴*")
    st.divider()

    pagina = st.radio(
        "Navegación",
        ["🏠 Descubrimientos", "🧪 Diseñador de Consorcios"],
        label_visibility="collapsed"
    )

    st.divider()
    st.markdown("""
    <div style="font-size:12px; color:#666; line-height:1.5;">
    <b>Impulso BioCycle</b><br>
    Plataforma de diseño de consorcios microbianos para la biodegradación de contaminantes.<br><br>
    Todos los datos están basados en publicaciones científicas revisadas por pares.
    </div>
    """, unsafe_allow_html=True)

if pagina == "🏠 Descubrimientos":
    import views.descubrimientos as desc
    desc.render()
else:
    import views.disenador as dis
    dis.render()
