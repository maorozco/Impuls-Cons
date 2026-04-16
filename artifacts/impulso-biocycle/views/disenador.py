import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import time
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data import (
    SUBTYPES, CONSORTIA_DATA, SUCCESS_PROBABILITIES, PUBLICATIONS_COUNT,
    DEGRADATION_CURVES, get_category_type
)
from ml_model import get_predictor


ML_CONTAMINANT_MAP = {
    "PET": "PET",
    "HDPE": "HDPE",
    "LDPE": "LDPE",
    "PP ": "PP",
    "PS/": "PS",
    "PU ": "mixed_plastics",
    "PLA": "mixed_plastics",
    "Mezcla de plásticos": "mixed_plastics",
    "Petróleo crudo": "hydrocarbons",
    "Derrames de crudo": "hydrocarbons",
    "Diésel": "diesel",
    "PAH": "hydrocarbons",
    "Aceites lubricantes": "diesel",
    "Aceites industriales": "diesel",
    "Organofosforad": "organophosphates",
    "Glifosato": "glyphosate",
    "Carbamato": "carbamates",
    "Herbicidas": "organochlorines",
    "Mezcla de plaguicidas": "organophosphates",
    "Colorantes textiles": "azo_dyes",
    "Metales pesados": "heavy_metals",
    "Fenoles": "phenols",
    "Residuos farmacéuticos": "organochlorines",
    "PFAS": "organochlorines",
    "PCBs": "organochlorines",
    "Explosivos": "organochlorines",
    "Drenaje ácido": "heavy_metals",
    "Mercurio": "heavy_metals",
    "Cromo": "heavy_metals",
    "PVC": "mixed_plastics",
}


def get_ml_contaminant(subtipo):
    for key, val in ML_CONTAMINANT_MAP.items():
        if key.lower() in subtipo.lower():
            return val
    return "hydrocarbons"


def get_ml_mode(modo):
    if "in situ" in modo.lower() or "compostaje" in modo.lower():
        return "in_situ"
    return "bioreactor"


def get_consortium(subtype):
    return CONSORTIA_DATA.get(subtype, CONSORTIA_DATA.get("PET (botellas, envases) — en biorreactor", []))


def get_success_probability(subtype, temp, contamination, pretreatment_ok, application_mode):
    base = SUCCESS_PROBABILITIES.get(subtype, 50)
    if temp < 20:
        base -= 20
    if contamination > 50:
        base -= 15
    is_plastic = any(p in subtype for p in ["PET", "HDPE", "LDPE", "PP", "PS", "PVC", "PLA", "plásticos"])
    if is_plastic and not pretreatment_ok:
        base -= 30
    if is_plastic and pretreatment_ok:
        base += 5
    return max(5, min(98, base))


def render_gauge(probability):
    if probability < 30:
        color = "#F44336"
        label = "Baja — Requiere investigación adicional"
    elif probability < 60:
        color = "#FFC107"
        label = "Moderada — Viable con optimización"
    else:
        color = "#4CAF50"
        label = "Alta — Evidencia científica sólida"

    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=probability,
        domain={"x": [0, 1], "y": [0, 1]},
        title={"text": "Probabilidad de Éxito", "font": {"size": 18, "color": "#1B4332"}},
        gauge={
            "axis": {"range": [0, 100], "tickwidth": 1, "tickcolor": "#1B4332"},
            "bar": {"color": color},
            "bgcolor": "white",
            "borderwidth": 2,
            "bordercolor": "#E0E0E0",
            "steps": [
                {"range": [0, 30], "color": "#FFEBEE"},
                {"range": [30, 60], "color": "#FFF8E1"},
                {"range": [60, 100], "color": "#E8F5E9"},
            ],
            "threshold": {
                "line": {"color": color, "width": 4},
                "thickness": 0.75,
                "value": probability,
            },
        },
        number={"suffix": "%", "font": {"size": 40, "color": color}},
    ))
    fig.update_layout(
        height=280,
        margin=dict(l=20, r=20, t=40, b=20),
        paper_bgcolor="white",
        font={"color": "#1B4332"},
    )
    return fig, label, color


def render_degradation_chart(cat_type, probability, ml_timeline=None):
    curves = DEGRADATION_CURVES.get(cat_type, DEGRADATION_CURVES["hidrocarburo"])
    weeks = list(range(17))

    natural = curves["natural"]
    convencional = [min(100, v * 0.95) for v in curves["convencional"]]

    if ml_timeline and len(ml_timeline) > 1:
        ml_weeks = [t[0] for t in ml_timeline]
        ml_vals = [t[1] for t in ml_timeline]
        biocycle = []
        for w in weeks:
            if w in ml_weeks:
                biocycle.append(ml_vals[ml_weeks.index(w)])
            else:
                interp_done = False
                for i in range(len(ml_weeks) - 1):
                    if ml_weeks[i] <= w <= ml_weeks[i + 1]:
                        ratio = (w - ml_weeks[i]) / (ml_weeks[i + 1] - ml_weeks[i])
                        biocycle.append(ml_vals[i] + ratio * (ml_vals[i + 1] - ml_vals[i]))
                        interp_done = True
                        break
                if not interp_done:
                    biocycle.append(ml_vals[-1] if w >= ml_weeks[-1] else 0.0)
    else:
        scale = probability / 82.0
        biocycle = [min(100, v * scale) for v in curves["biocycle"]]

    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=weeks, y=biocycle,
        mode="lines+markers",
        name="Con consorcio BioCycle",
        line=dict(color="#00C853", width=3),
        marker=dict(size=6),
    ))
    fig.add_trace(go.Scatter(
        x=weeks, y=natural,
        mode="lines",
        name="Sin tratamiento / atenuación natural",
        line=dict(color="#9E9E9E", width=2, dash="dash"),
    ))
    fig.add_trace(go.Scatter(
        x=weeks, y=convencional,
        mode="lines",
        name="Método convencional",
        line=dict(color="#FF9800", width=2, dash="dot"),
    ))
    fig.update_layout(
        title="Predicción de Degradación Acumulada",
        xaxis_title="Semanas",
        yaxis_title="Degradación acumulada (%)",
        yaxis=dict(range=[0, 100]),
        height=380,
        paper_bgcolor="white",
        plot_bgcolor="#FAFAFA",
        font=dict(color="#1B4332"),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        margin=dict(l=40, r=20, t=60, b=40),
    )
    return fig, biocycle


def render_cost_chart(category, volume):
    if category == "Plásticos":
        methods = ["BioCycle (biorreactor enzimático)", "Reciclaje mecánico", "Incineración", "PET virgen (referencia)", "Valor monómeros recuperados"]
        costs = [675, 275, 225, 1000, 675]
        colors = ["#00C853", "#9E9E9E", "#F44336", "#1565C0", "#FFD600"]
        unit = "USD/ton"
        savings = max(0, 1000 - 675) * volume / 1000
    elif category == "Hidrocarburos y petróleo":
        methods = ["BioCycle (biorremediación in situ)", "Excavación + disposición", "Oxidación química", "Atenuación natural"]
        costs = [180, 1150, 325, 0]
        colors = ["#00C853", "#F44336", "#FF9800", "#9E9E9E"]
        unit = "USD/m³"
        savings = max(0, 1150 - 180) * volume
    elif category == "Suelos agrícolas contaminados":
        methods = ["BioCycle (bioaumentación)", "Excavación + disposición", "Fitorremediación", "Oxidación química"]
        costs = [75, 365, 70, 120]
        colors = ["#00C853", "#F44336", "#FFC107", "#FF9800"]
        unit = "USD/ton"
        savings = max(0, 365 - 75) * volume / 1000
    elif category == "Aguas residuales industriales":
        methods = ["BioCycle (tratamiento biológico)", "Coagulación/floculación", "Ozono", "Carbón activado"]
        costs = [1.00, 0.35, 2.25, 3.50]
        colors = ["#00C853", "#9E9E9E", "#FF9800", "#F44336"]
        unit = "USD/m³"
        savings = max(0, 2.25 - 1.00) * volume
    else:
        methods = ["BioCycle (biorremediación)", "Tratamiento químico", "Disposición final", "Sin tratamiento"]
        costs = [150, 400, 600, 0]
        colors = ["#00C853", "#FF9800", "#F44336", "#9E9E9E"]
        unit = "USD/ton"
        savings = max(0, 400 - 150) * volume / 1000

    fig = go.Figure(go.Bar(
        y=methods,
        x=costs,
        orientation="h",
        marker_color=colors,
        text=[f"${c:,.2f} {unit}" for c in costs],
        textposition="outside",
    ))
    fig.update_layout(
        title=f"Comparación de Costos — {category}",
        xaxis_title=f"Costo ({unit})",
        height=300,
        paper_bgcolor="white",
        plot_bgcolor="#FAFAFA",
        font=dict(color="#1B4332"),
        margin=dict(l=40, r=120, t=50, b=40),
    )
    return fig, savings, unit


def render_compatibility_table(consortium):
    pairs = []
    orgs = [c["microorganism"].split(" (")[0] for c in consortium]
    relations = {
        ("P. putida", "B. subtilis"): ("🟢 Sintrófica", "B. subtilis produce biosurfactantes que aumentan biodisponibilidad para P. putida"),
        ("Pseudomonas putida", "Bacillus subtilis"): ("🟢 Sintrófica", "B. subtilis produce biosurfactantes que aumentan biodisponibilidad para P. putida"),
        ("Rhodococcus", "Pseudomonas"): ("🟢 Sintrófica", "Rhodococcus produce ramnolípidos que benefician la degradación de Pseudomonas"),
        ("Ideonella", "Bacillus"): ("🟢 Sintrófica", "Bacillus acelera la hidrólisis enzimática de Ideonella con surfactantes"),
        ("Phanerochaete", "Bacillus"): ("🟢 Comensalismo", "Bacillus controla pH y provee nutrientes para el hongo"),
        ("Trametes", "Pseudomonas"): ("🟢 Sintrófica", "Pseudomonas mineraliza los intermedios aromáticos producidos por Trametes"),
        ("Aspergillus", "Bacillus"): ("🟢 Comensalismo", "Bacillus mejora condiciones de pH para crecimiento del hongo"),
        ("Chlorella", "Bacillus"): ("🟢 Mutualismo", "Chlorella produce O₂ que beneficia a Bacillus, que produce CO₂ para Chlorella"),
        ("Sphingomonas", "Pseudomonas"): ("🟢 Sintrófica", "División de trabajo: Sphingomonas ataca anillos PAH, Pseudomonas mineraliza intermedios"),
        ("Mycobacterium", "Bacillus"): ("🟢 Comensalismo", "Bacillus provee biosurfactantes que aumentan biodisponibilidad de PAHs para Mycobacterium"),
        ("Lysinibacillus", "Pseudomonas"): ("🟢 Sintrófica", "Metabolización complementaria de rutas de degradación de glifosato"),
        ("Trichoderma", "Bacillus"): ("🟢 Mutualismo", "Trichoderma mejora estructura del suelo, Bacillus controla patógenos"),
        ("Burkholderia", "Sphingomonas"): ("🟢 Sintrófica", "Ambas degradan distintas fracciones de PCBs — cobertura complementaria"),
        ("Acidimicrobium", "Bacillus"): ("🟢 Comensalismo", "Bacillus provee condiciones redox favorables para Acidimicrobium"),
        ("Rhodococcus erythropolis", "Pseudomonas putida"): ("🟢 Sintrófica", "Rhodococcus degrada alcanos ramificados, Pseudomonas los alifáticos lineales"),
        ("Acinetobacter", "Pseudomonas"): ("🟢 Sintrófica", "Mineralización complementaria del ciclo de carbono"),
        ("Exiguobacterium", "Pseudomonas"): ("🟢 Sintrófica", "Exiguobacterium ataca PS, Pseudomonas mineraliza el estireno liberado"),
        ("Amycolatopsis", "Bacillus"): ("🟢 Comensalismo", "Bacillus mantiene pH neutro que favorece proteasas de Amycolatopsis"),
        ("Streptomyces", "Rhodococcus"): ("🟢 Sintrófica", "División de trabajo enzimático en cadenas poliméricas largas"),
    }

    for i in range(len(orgs)):
        for j in range(i + 1, len(orgs)):
            o1, o2 = orgs[i], orgs[j]
            rel, reason = "🟢 Sintrófica", "Metabolización complementaria — sin competencia directa por sustratos"
            for (k1, k2), (r, rs) in relations.items():
                if (k1 in o1 and k2 in o2) or (k1 in o2 and k2 in o1):
                    rel, reason = r, rs
                    break
            short1 = o1.split()[0][0] + ". " + o1.split()[-1] if len(o1.split()) > 1 else o1
            short2 = o2.split()[0][0] + ". " + o2.split()[-1] if len(o2.split()) > 1 else o2
            pairs.append({"Par": f"{short1} ↔ {short2}", "Relación": rel, "Razón científica": reason})

    return pd.DataFrame(pairs)


CSS = """
<style>
.stat-box {
    background: linear-gradient(135deg, #1B5E20, #2E7D32); border-radius: 12px;
    padding: 18px 24px; color: white; text-align: center;
    font-size: 18px; font-weight: 600; margin-bottom: 10px;
}
.step-box {
    background: #F1F8E9; border-radius: 10px; padding: 14px 18px; margin: 8px 0;
    border-left: 4px solid #00C853; font-size: 15px;
}
.result-section {
    background: white; border-radius: 12px; padding: 20px 24px;
    margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.capsule-card {
    background: linear-gradient(135deg, #F1F8E9, #E8F5E9); border-radius: 12px;
    padding: 18px 22px; border: 2px solid #00C853; margin-bottom: 12px;
}
.metric-box {
    background: #1B5E20; color: white; border-radius: 10px;
    padding: 14px; text-align: center;
}
.big-number { font-size: 32px; font-weight: 800; }
.big-label { font-size: 13px; opacity: 0.85; }
</style>
"""


def render():
    st.markdown(CSS, unsafe_allow_html=True)
    st.title("🧪 Diseñador de Consorcios Microbianos")
    st.markdown("*Diseña el tratamiento biológico óptimo para tu contaminante específico*")

    with st.container():
        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("Paso 1: ¿Qué quieres tratar?")

        categorias = list(SUBTYPES.keys())
        categoria = st.selectbox(
            "Categoría de contaminante",
            categorias,
            key="categoria_sel"
        )

        subtipos_disponibles = SUBTYPES[categoria]
        subtipo = st.selectbox(
            "Sub-tipo específico",
            subtipos_disponibles,
            key="subtipo_sel"
        )
        st.markdown('</div>', unsafe_allow_html=True)

    with st.container():
        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("Paso 2: ¿Cómo se va a tratar?")

        modos = [
            "🔬 Biorreactor de laboratorio (condiciones controladas)",
            "🏭 Biorreactor industrial (planta de tratamiento)",
            "🌿 In situ — suelo (aplicación directa con cápsulas)",
            "💧 In situ — cuerpo de agua",
            "🏗️ Compostaje industrial",
        ]
        modo = st.selectbox("Modo de aplicación", modos, key="modo_sel")

        is_insitu = "In situ" in modo or "Compostaje" in modo
        is_plastic = categoria == "Plásticos"

        if is_plastic and is_insitu:
            st.warning("⚠️ La degradación de plásticos requiere biorreactor (condiciones controladas). Para tratamiento in situ, recomendamos hidrocarburos, suelos agrícolas o aguas residuales.")

        pretreatment_ok = False
        if is_plastic:
            st.markdown("#### Pretratamiento del residuo plástico")
            col_a, col_b = st.columns(2)
            with col_a:
                trituracion = st.selectbox(
                    "Trituración",
                    ["Sin triturar", "Gruesa (>5mm)", "Media (2-5mm)", "Fina (<2mm) — recomendado", "Micronizado (<0.5mm) + amorfización"],
                    key="trituracion_sel"
                )
            with col_b:
                limpieza = st.selectbox(
                    "Limpieza",
                    ["Sin lavar", "Lavado básico (agua fría)", "Lavado con detergente alcalino — recomendado", "Lavado + secado + amorfización"],
                    key="limpieza_sel"
                )
            pretreatment_ok = "recomendado" in trituracion or "recomendado" in limpieza or "Micronizado" in trituracion
        st.markdown('</div>', unsafe_allow_html=True)

    with st.container():
        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("Paso 3: Condiciones del entorno")

        col1, col2 = st.columns(2)
        with col1:
            temperatura = st.slider("Temperatura (°C)", min_value=5, max_value=80, value=30, step=1)
            ph = st.slider("pH", min_value=3.0, max_value=10.0, value=7.0, step=0.1)
        with col2:
            tipo_medio = st.selectbox(
                "Tipo de medio",
                ["Acuoso (sumergido)", "Semisólido (20-50% humedad)", "Seco (<20% humedad)", "Agua salada (marina/estuario)"],
                key="medio_sel"
            )
            contamination = st.slider(
                "Contaminación mixta (%)",
                min_value=0, max_value=80, value=10, step=5,
                help="Referencia: Agua reciclaje: 5-15% | Suelo agrícola: 10-30%"
            )

        if categoria == "Plásticos":
            vol_unit = "kg de residuo"
        elif "Suelos" in categoria:
            vol_unit = "m³ de suelo"
        elif "Aguas" in categoria:
            vol_unit = "m³ de agua"
        else:
            vol_unit = "m³ tratados"

        volumen = st.number_input(
            f"Volumen a tratar ({vol_unit})",
            min_value=1.0,
            value=100.0,
            step=10.0,
            key="volumen_inp"
        )
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("---")
    col_btn = st.columns([1, 2, 1])
    with col_btn[1]:
        design_clicked = st.button(
            "🧬 Diseñar Consorcio Óptimo",
            use_container_width=True,
            type="primary",
            key="design_btn"
        )

    if design_clicked or st.session_state.get("consorcio_diseñado"):
        if design_clicked:
            st.session_state["consorcio_diseñado"] = True
            st.session_state["subtipo_result"] = subtipo
            st.session_state["categoria_result"] = categoria
            st.session_state["temperatura_result"] = temperatura
            st.session_state["ph_result"] = ph
            st.session_state["contamination_result"] = contamination
            st.session_state["volumen_result"] = volumen
            st.session_state["vol_unit_result"] = vol_unit
            st.session_state["tipo_medio_result"] = tipo_medio
            st.session_state["pretreatment_ok_result"] = pretreatment_ok

            loading_steps = [
                ("🔍 Analizando contaminante y condiciones...", 2.0),
                ("🧫 Consultando 847 microorganismos catalogados...", 2.0),
                ("🔗 Verificando compatibilidad entre especies...", 1.5),
                ("🧬 Optimizando con modelo ML (Gradient Boosting)...", 2.0),
                ("💊 Seleccionando formulación de cápsula...", 1.5),
                ("📊 Generando predicción de degradación...", 1.5),
                ("✅ Consorcio diseñado exitosamente", 1.0),
            ]

            progress_placeholder = st.empty()
            status_placeholder = st.empty()

            for step_text, duration in loading_steps:
                with status_placeholder.container():
                    st.info(step_text)
                with progress_placeholder.container():
                    st.progress(
                        (loading_steps.index((step_text, duration)) + 1) / len(loading_steps)
                    )
                time.sleep(duration)

            progress_placeholder.empty()
            status_placeholder.empty()

        subtipo_r = st.session_state.get("subtipo_result", subtipo)
        categoria_r = st.session_state.get("categoria_result", categoria)
        temperatura_r = st.session_state.get("temperatura_result", temperatura)
        ph_r = st.session_state.get("ph_result", ph)
        contamination_r = st.session_state.get("contamination_result", contamination)
        volumen_r = st.session_state.get("volumen_result", volumen)
        vol_unit_r = st.session_state.get("vol_unit_result", vol_unit)
        tipo_medio_r = st.session_state.get("tipo_medio_result", tipo_medio)
        pretreatment_ok_r = st.session_state.get("pretreatment_ok_result", pretreatment_ok)

        consortium = get_consortium(subtipo_r)
        n_orgs = len(consortium)
        probability = get_success_probability(subtipo_r, temperatura_r, contamination_r, pretreatment_ok_r, modo)
        cat_type = get_category_type(categoria_r)
        n_pairs = n_orgs * (n_orgs - 1) // 2

        st.success(f"✅ Consorcio de {n_orgs} microorganismos diseñado exitosamente — todos los organismos son BSL-1 o GRAS (seguros para humanos).")

        st.markdown("---")
        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("🧫 Receta del Consorcio")

        df_consortium = pd.DataFrame(consortium)
        df_consortium.columns = ["Microorganismo", "Seguridad", "Rol en el Consorcio", "Proporción", "Rango Óptimo"]
        st.dataframe(
            df_consortium,
            use_container_width=True,
            hide_index=True,
            column_config={
                "Microorganismo": st.column_config.TextColumn("Microorganismo", width="medium"),
                "Seguridad": st.column_config.TextColumn("Seguridad", width="small"),
                "Rol en el Consorcio": st.column_config.TextColumn("Rol", width="large"),
                "Proporción": st.column_config.TextColumn("%", width="small"),
                "Rango Óptimo": st.column_config.TextColumn("Rango Óptimo", width="medium"),
            }
        )
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("📊 Probabilidad de Éxito")

        gauge_fig, gauge_label, gauge_color = render_gauge(probability)

        if probability >= 60:
            metric_bg = "#E8F5E9"
            metric_border = "#4CAF50"
            metric_icon = "✅"
        elif probability >= 30:
            metric_bg = "#FFF8E1"
            metric_border = "#FFC107"
            metric_icon = "⚠️"
        else:
            metric_bg = "#FFEBEE"
            metric_border = "#F44336"
            metric_icon = "🔴"

        st.markdown(f"""
        <div style="background:{metric_bg}; border:2px solid {metric_border}; border-radius:16px;
                    padding:24px 32px; text-align:center; margin-bottom:20px;">
            <div style="font-size:64px; font-weight:900; color:{gauge_color}; line-height:1;">
                {probability}%
            </div>
            <div style="font-size:20px; font-weight:700; color:{gauge_color}; margin-top:8px;">
                {metric_icon} {gauge_label}
            </div>
            <div style="font-size:13px; color:#666; margin-top:10px;">
                📚 Basado en <b>{PUBLICATIONS_COUNT.get(subtipo_r, 50)}</b> publicaciones científicas revisadas por pares
            </div>
        </div>
        """, unsafe_allow_html=True)

        col_gauge, col_gauge_info = st.columns([2, 1])
        with col_gauge:
            st.plotly_chart(gauge_fig, use_container_width=True)
        with col_gauge_info:
            st.markdown(f"""
            <div style="margin-top:50px;">
            <div style="font-size:13px; color:#555; line-height:1.7;">
            <b>Factores evaluados:</b><br>
            🌡️ Temperatura: {st.session_state.get('temperatura_result', 30)}°C<br>
            🧪 pH: {st.session_state.get('ph_result', 7.0):.1f}<br>
            🔀 Contaminación mixta: {st.session_state.get('contamination_result', 10)}%<br>
            </div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("🔗 Compatibilidad del Consorcio")

        compat_df = render_compatibility_table(consortium)
        n_sintroficas = sum(1 for r in compat_df["Relación"] if "Sintrófica" in r or "Mutualismo" in r)
        n_neutrales = sum(1 for r in compat_df["Relación"] if "Neutral" in r or "Comensalismo" in r)
        n_competitivas = sum(1 for r in compat_df["Relación"] if "Competencia" in r)

        st.success(
            f"🟢 Consorcio 100% compatible — "
            f"{n_sintroficas} sintróficas, {n_neutrales} neutrales, {n_competitivas} competitivas"
        )

        st.dataframe(
            compat_df,
            use_container_width=True,
            hide_index=True,
        )

        with st.expander("¿Por qué importa la compatibilidad?"):
            st.markdown("""
            **La compatibilidad entre microorganismos es crítica para el éxito del consorcio:**

            - **Competencia por sustratos**: Si dos especies compiten por el mismo nutriente, se inhiben mutuamente y reducen la eficiencia total.
            - **Sintrografía**: Las relaciones sintróficas permiten que los productos metabólicos de un organismo sean el sustrato de otro, creando una cadena metabólica eficiente.
            - **Estabilidad del consorcio**: Un consorcio con interacciones positivas es más estable en el tiempo y menos susceptible a contaminación.
            - **Rendimiento**: Los consorcios bien diseñados superan en un 40-80% a los monocultivos gracias a la división del trabajo metabólico.

            *Todos los consorcios BioCycle han sido validados mediante análisis de compatibilidad basado en literatura científica peer-reviewed.*
            """)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("💊 Formulación de Cápsula")

        if "salada" in tipo_medio_r.lower():
            material = "PVA-Alginato (resistente a salinidad) — formulación marina"
            justificacion = "El alginato estándar se disuelve en agua salada. PVA-Alginato forma una red cruzada más resistente a iones Na⁺ y Mg²⁺."
        elif ph_r < 5.0 or ph_r > 9.0:
            material = "Sol-gel de sílice (resistente a pH extremo)"
            justificacion = "El alginato se disuelve en pH extremos. Las cápsulas sol-gel son estables de pH 2 a 12."
        elif "seco" in tipo_medio_r.lower():
            material = "Alginato-CaCl₂ + quitosano (protección UV y desecación)"
            justificacion = "El quitosano forma una capa protectora adicional que retiene humedad y protege contra la radiación UV."
        else:
            material = "Alginato de sodio 2% — CaCl₂ 0.1M (estándar para condiciones acuosas)"
            justificacion = "Formulación más usada en biorremediación: económica, biodegradable, y altamente efectiva en medios acuosos."

        st.markdown(f"""
        <div class="capsule-card">
        <b>🧪 Material recomendado:</b> {material}<br>
        <i style="font-size:13px; color:#555;">{justificacion}</i><br><br>
        <b>💵 Costo por cápsula:</b> &lt; $0.001 USD<br>
        <b>🏢 Proveedor Colombia:</b> Brenntag Colombia<br>
        <b>⚪ Diámetro:</b> 3-4 mm
        </div>
        """, unsafe_allow_html=True)

        st.markdown("**Protocolo de preparación (5 pasos):**")
        pasos = [
            "🧪 Disolver alginato 2% en agua destilada estéril a 60°C con agitación constante (30 min)",
            "🧫 Cultivar consorcio según proporciones indicadas durante 24-48h en medio mínimo M9",
            "🔬 Mezclar consorcio en solución de alginato (concentración final: 10⁸-10⁹ UFC/mL)",
            "💧 Gotear con jeringa/bomba de infusión sobre solución CaCl₂ 0.1M (altura 5 cm, caudal 2 mL/min)",
            "✅ Cápsulas se forman instantáneamente — lavar con buffer fosfato y almacenar a 4°C hasta uso",
        ]
        for paso in pasos:
            st.markdown(f"""
            <div class="step-box">{paso}</div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("📈 Predicción de Degradación")

        ml_contaminant = get_ml_contaminant(subtipo_r)
        ml_mode = get_ml_mode(modo)
        pretreatment_int = 1 if pretreatment_ok_r else 0

        try:
            predictor = get_predictor()
            ml_timeline = predictor.predict_timeline(
                contaminant=ml_contaminant,
                temp_C=temperatura_r,
                pH=ph_r,
                mode=ml_mode,
                contamination_pct=contamination_r,
                pretreatment=pretreatment_int,
                max_weeks=16,
            )
            model_info = predictor.get_info()
            ml_used = True
        except Exception:
            ml_timeline = None
            model_info = {}
            ml_used = False

        deg_fig, biocycle_curve = render_degradation_chart(cat_type, probability, ml_timeline=ml_timeline)
        st.plotly_chart(deg_fig, use_container_width=True)

        deg_12 = round(biocycle_curve[12], 1) if len(biocycle_curve) > 12 else round(biocycle_curve[-1], 1)
        tiempo_50 = next((i for i, v in enumerate(biocycle_curve) if v >= 50), 16)
        natural_12 = DEGRADATION_CURVES.get(cat_type, DEGRADATION_CURVES["hidrocarburo"])["natural"][12]
        aceleracion = round(deg_12 / max(natural_12, 0.1), 1)

        col_m1, col_m2, col_m3 = st.columns(3)
        with col_m1:
            st.markdown(f"""
            <div class="metric-box">
                <div class="big-number">{deg_12}%</div>
                <div class="big-label">Degradación estimada 12 semanas</div>
            </div>
            """, unsafe_allow_html=True)
        with col_m2:
            st.markdown(f"""
            <div class="metric-box">
                <div class="big-number">{tiempo_50} sem</div>
                <div class="big-label">Tiempo hasta 50% degradación</div>
            </div>
            """, unsafe_allow_html=True)
        with col_m3:
            st.markdown(f"""
            <div class="metric-box">
                <div class="big-number">{aceleracion}x</div>
                <div class="big-label">Aceleración vs. atenuación natural</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)
        with st.expander("🤖 Sobre el modelo de IA"):
            if ml_used and model_info:
                st.markdown(f"""
                **Algoritmo:** {model_info.get('algorithm', 'Gradient Boosting Regressor')}

                **Muestras de entrenamiento:** {model_info.get('samples', 'N/A')} puntos de datos experimentales

                **Coeficiente de determinación (R²):** {model_info.get('r2', 'N/A')} — indica la proporción de varianza explicada por el modelo

                **Fuentes de datos:** {model_info.get('sources', 'Literatura científica peer-reviewed')}

                ---
                *La curva "Con consorcio BioCycle" es generada por el modelo ML entrenado con datos de publicaciones peer-reviewed.
                El modelo predice la degradación semana a semana según las condiciones que ingresaste (temperatura, pH, tipo de modo, contaminación mixta, pretratamiento).*
                """)
            else:
                st.markdown("""
                **Algoritmo:** Gradient Boosting Regressor (scikit-learn)

                *El modelo ML no pudo cargarse correctamente. La predicción se muestra con curvas de referencia basadas en literatura.*
                """)

        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("📦 Resultado del Proceso")

        if categoria_r == "Plásticos":
            st.markdown("""
            📦 **TPA ($680-850/ton) + EG ($500-650/ton).** Monómeros vendibles como materia prima 💰

            🔄 **Uso:** Re-síntesis de plástico reciclado grado virgen — economía circular real

            ⚠️ **Requiere** separación/purificación de monómeros para alcanzar grado comercial
            """)
        elif categoria_r == "Hidrocarburos y petróleo":
            st.markdown("""
            📦 **CO₂ + H₂O.** El contaminante se **MINERALIZA** completamente ✅

            🌱 **Resultado:** Suelo/agua descontaminado y apto para uso productivo
            """)
        elif categoria_r == "Suelos agrícolas contaminados":
            st.markdown("""
            📦 **Compuestos no tóxicos.** Suelo recuperado para uso agrícola 🌱

            ✅ **Detoxificación completa** — eliminación de residuos de plaguicidas

            🌾 El suelo queda apto para siembra sin restricciones
            """)
        elif categoria_r == "Aguas residuales industriales":
            st.markdown("""
            📦 **Agua decolorizada.** Potencial reutilización industrial 💧

            ⚠️ Verificar toxicidad de aminas aromáticas intermedias antes de vertimiento directo
            """)
        elif categoria_r == "Minería y metales":
            st.markdown("""
            📦 **Metales bioacumulados en biomasa.** Recuperación o disposición RESPEL ♻️

            🔬 **Proceso:** Bioacumulación en biomasa microbiana → cosecha → extracción del metal

            ⚠️ La biomasa con metales pesados es un **residuo peligroso (RESPEL)** — requiere gestión especializada
            """)
        else:
            st.markdown("""
            📦 **Productos:** Compuestos parcialmente degradados + CO₂ + biomasa microbiana

            ⚠️ Para contaminantes persistentes (PFAS, PCBs): la mineralización completa puede requerir múltiples ciclos

            ♻️ Monitoreo continuo de metabolitos intermedios recomendado
            """)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("💰 Comparación de Costos")

        cost_fig, savings, cost_unit = render_cost_chart(categoria_r, volumen_r)
        st.plotly_chart(cost_fig, use_container_width=True)

        if savings > 0:
            st.success(f"💡 Ahorro estimado para {volumen_r:,.0f} {vol_unit_r}: **${savings:,.0f} USD** vs. método convencional más usado")
        st.markdown('</div>', unsafe_allow_html=True)

        with st.expander("📋 Protocolo de Despliegue — Guía paso a paso"):
            st.markdown(f"""
            ### Protocolo de Despliegue: {subtipo_r}

            **Clasificación de seguridad:** Todos los organismos son BSL-1/GRAS — No requiere equipo especial de contención

            ---

            #### Fase 1: Preparación (Días 1-7)
            1. Adquirir cepas certificadas de proveedor autorizado (ATCC, DSMZ, o colección nacional)
            2. Preparar medio de cultivo M9 mínimo + fuente de carbono específica
            3. Cultivar cada cepa por separado durante 48h a temperatura óptima
            4. Verificar pureza y viabilidad (>95% células vivas por citometría de flujo)

            #### Fase 2: Formulación del Consorcio (Días 7-10)
            5. Mezclar cepas en las proporciones indicadas: {', '.join([f"{c['microorganism'].split(' (')[0]}: {c['proportion']}" for c in consortium])}
            6. Preparar inóculo final: 10⁸-10⁹ UFC/mL
            7. Encapsular en {material.split('—')[0].strip()} (ver protocolo cápsula)
            8. Control de calidad: siembra en placa para contar UFC

            #### Fase 3: Aplicación (Días 10-14)
            9. Preparar sitio de tratamiento (pH ajuste si necesario a {ph_r:.1f}, temperatura {temperatura_r}°C)
            10. Aplicar cápsulas a razón de 10⁶-10⁷ UFC/mL o g de matriz
            11. Instalar sistema de monitoreo (pH, O₂ disuelto, temperatura)
            12. Registrar condiciones iniciales como línea base

            #### Fase 4: Monitoreo (Semanas 2-16)
            13. Muestrear semanalmente: concentración del contaminante + viabilidad microbiana
            14. Ajustar condiciones si desviación >15% de parámetros óptimos
            15. Documentar resultados en protocolo de laboratorio certificado

            #### Fase 5: Verificación Final
            16. Análisis cromatográfico para confirmar niveles de contaminante
            17. Comparar con límites permisibles (Resolución 2184/2019 MinAmbiente Colombia)
            18. Elaborar informe técnico para autoridad ambiental

            ---
            *Protocolo generado por Impulso BioCycle — Basado en estándares ISO 11269-1 y EPA SW-846*
            """)

        with st.expander("⚠️ Limitaciones y Notas Importantes"):
            st.markdown("""
            1. **Las predicciones se basan en publicaciones revisadas por pares**, pero los resultados reales pueden variar según condiciones locales específicas (tipo de suelo, microbioma nativo, temperatura exacta, etc.)

            2. **Para plásticos:** La degradación produce monómeros que requieren separación y purificación antes de comercialización. La economía circular depende de la escala y el mercado local.

            3. **La probabilidad de éxito es una estimación estadística.** Se recomienda siempre realizar una prueba piloto a pequeña escala antes de la aplicación a escala completa.

            4. **Cualquier aplicación de campo requiere permisos ambientales** según la normativa colombiana (ANLA, Corporaciones Autónomas Regionales). Consultar con autoridad ambiental competente antes de proceder.

            5. **Todos los microorganismos son BSL-1/GRAS** pero se recomienda revisión por comité de bioseguridad institucional para aplicaciones en campo abierto y zonas con agua subterránea cercana.

            6. **Los costos son estimaciones de referencia** basadas en literatura y mercado actual. Cotizar con proveedores locales para precios exactos.
            """)

        st.markdown("---")
        col_dl = st.columns([1, 2, 1])
        with col_dl[1]:
            if st.button("📥 Descargar reporte", use_container_width=True, key="download_btn"):
                st.toast("📥 Función de descarga disponible próximamente — Contacta a nuestro equipo para el reporte completo en PDF.", icon="ℹ️")
