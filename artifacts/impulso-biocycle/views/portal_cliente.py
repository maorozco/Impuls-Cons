import streamlit as st
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

CSS = """
<style>
.portal-header {
    background: linear-gradient(135deg, #1B5E20, #2E7D32, #00C853);
    border-radius: 16px; padding: 28px 32px; color: white; margin-bottom: 24px;
}
.portal-header h2 { font-size: 28px; font-weight: 800; margin: 0 0 6px 0; }
.portal-header p { font-size: 15px; opacity: 0.9; margin: 0; }
.product-card {
    background: linear-gradient(135deg, #E8F5E9, #F1F8E9);
    border: 2px solid #00C853; border-radius: 16px; padding: 24px 28px; margin-bottom: 20px;
}
.product-name {
    font-size: 28px; font-weight: 900; color: #1B5E20; letter-spacing: 1px;
}
.product-badge {
    display: inline-block; background: #00C853; color: white;
    padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;
    margin-left: 10px; vertical-align: middle;
}
.timeline-box {
    display: flex; gap: 0; margin: 16px 0;
}
.timeline-step {
    flex: 1; padding: 16px 12px; text-align: center; border-top: 4px solid #00C853;
    background: white; margin: 0 4px; border-radius: 0 0 10px 10px;
}
.timeline-month { font-size: 13px; font-weight: 700; color: #00C853; }
.timeline-label { font-size: 13px; color: #333; margin-top: 4px; }
.fin-metric {
    background: white; border-radius: 12px; padding: 18px; text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.09); border-top: 4px solid #00C853;
}
.fin-value { font-size: 26px; font-weight: 800; color: #1B5E20; }
.fin-label { font-size: 12px; color: #666; margin-top: 4px; }
.env-metric {
    background: #E8F5E9; border-radius: 12px; padding: 18px; text-align: center;
    border: 1px solid #A5D6A7;
}
.env-value { font-size: 26px; font-weight: 800; color: #2E7D32; }
.env-label { font-size: 12px; color: #555; margin-top: 4px; }
.reg-box {
    background: #FFF8E1; border: 2px solid #FFC107; border-radius: 12px;
    padding: 20px 24px; margin-top: 8px;
}
.result-section {
    background: white; border-radius: 12px; padding: 20px 24px;
    margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
</style>
"""

RESIDUOS_POR_TIPO = {
    "Planta de reciclaje": [
        "PET post-consumo (botellas, envases)",
        "HDPE/PP mixto (tapas, tuberías)",
        "Película LDPE (bolsas, empaque)",
        "Poliuretano (espumas, colchones)",
        "Multilaminar / residuo complejo",
    ],
    "Empresa petrolera": [
        "Suelo contaminado por crudo pesado",
        "Agua producida con hidrocarburos",
        "Lodos de perforación",
        "Gasoil / Diésel derramado",
        "PAHs en sedimentos",
    ],
    "Planta textil": [
        "Aguas con colorantes azo",
        "Efluentes con metales (Cr, Cu, Zn)",
        "Aguas con tensoactivos y surfactantes",
        "Mezcla de colorantes + solventes",
    ],
    "Empresa agrícola": [
        "Suelos con residuos de glifosato",
        "Suelos con organofosforados",
        "Suelos con carbamatos",
        "Aguas de lavado de plaguicidas",
        "Mezcla de plaguicidas múltiples",
    ],
    "Consultora ambiental": [
        "Sitios con hidrocarburos (pasivo ambiental)",
        "Suelos con metales pesados",
        "Sitio multipoluente (hidrocarburos + metales)",
        "Aguas subterráneas contaminadas",
        "PFAS / Contaminantes emergentes",
    ],
    "Relleno sanitario": [
        "Lixiviados con metales y materia orgánica",
        "Biogás con compuestos azufrados",
        "Residuos orgánicos complejos",
    ],
    "Laboratorio": [
        "Residuos de solventes orgánicos",
        "Fenoles y compuestos aromáticos",
        "Mezcla de reactivos vencidos",
    ],
}

CIUDADES_COLOMBIA = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena",
    "Bucaramanga", "Pereira", "Manizales", "Cúcuta", "Ibagué",
    "Santa Marta", "Villavicencio", "Montería", "Pasto", "Neiva",
    "Armenia", "Popayán", "Valledupar", "Sincelejo", "Tunja",
    "Riohacha", "Quibdó", "Florencia", "Yopal", "Leticia",
]

CLIMA_CIUDAD = {
    "Bogotá": "Andino-Frío", "Tunja": "Andino-Frío", "Pasto": "Andino-Frío",
    "Popayán": "Andino-Frío",
    "Medellín": "Andino-Templado", "Bucaramanga": "Andino-Templado",
    "Pereira": "Eje-Cafetero", "Manizales": "Eje-Cafetero", "Armenia": "Eje-Cafetero",
    "Cali": "Valle-Cálido", "Ibagué": "Valle-Cálido", "Neiva": "Valle-Cálido",
    "Barranquilla": "Caribe-Cálido", "Cartagena": "Caribe-Cálido",
    "Santa Marta": "Caribe-Cálido", "Montería": "Caribe-Cálido",
    "Sincelejo": "Caribe-Cálido", "Valledupar": "Caribe-Cálido",
    "Riohacha": "Caribe-Cálido",
    "Cúcuta": "Nororiente-Cálido",
    "Villavicencio": "Orinoquía-Cálido", "Yopal": "Orinoquía-Cálido",
    "Florencia": "Amazónico", "Leticia": "Amazónico",
    "Quibdó": "Pacífico-Húmedo",
}

TIPO_CODIGO = {
    "Planta de reciclaje": "REC",
    "Empresa petrolera": "PET",
    "Planta textil": "TEX",
    "Empresa agrícola": "AGR",
    "Consultora ambiental": "ENV",
    "Relleno sanitario": "SAN",
    "Laboratorio": "LAB",
}

COSTOS_BASE = {
    "Planta de reciclaje": {"convencional": 55, "biocycle": 28, "unidad": "$/ton", "factor_vol": 1.0},
    "Empresa petrolera": {"convencional": 160, "biocycle": 75, "unidad": "$/m³", "factor_vol": 1.0},
    "Planta textil": {"convencional": 220, "biocycle": 95, "unidad": "$/m³", "factor_vol": 1.0},
    "Empresa agrícola": {"convencional": 85, "biocycle": 40, "unidad": "$/m³", "factor_vol": 1.0},
    "Consultora ambiental": {"convencional": 200, "biocycle": 90, "unidad": "$/m³", "factor_vol": 1.0},
    "Relleno sanitario": {"convencional": 130, "biocycle": 60, "unidad": "$/m³", "factor_vol": 1.0},
    "Laboratorio": {"convencional": 300, "biocycle": 140, "unidad": "$/kg", "factor_vol": 1.0},
}

CO2_REDUCCION = {
    "Planta de reciclaje": 2.5,
    "Empresa petrolera": 1.8,
    "Planta textil": 1.2,
    "Empresa agrícola": 0.9,
    "Consultora ambiental": 1.5,
    "Relleno sanitario": 2.0,
    "Laboratorio": 1.1,
}

NORMATIVA = {
    "Planta de reciclaje": {
        "resoluciones": [
            "Resolución 1407/2018 — Gestión ambiental de envases y empaques plásticos posconsumo",
            "Ley 1672/2013 — Política Nacional para la Gestión Integral de Residuos de Aparatos Eléctricos",
            "CONPES 3874/2016 — Política Nacional para la Gestión Integral de Residuos Sólidos",
        ],
        "como_ayuda": "BioCycle acelera la degradación de plásticos no reciclables mecánicamente, permitiendo al operador cumplir metas de valorización y evitar sanciones por disposición en relleno sanitario.",
    },
    "Empresa petrolera": {
        "resoluciones": [
            "Resolución 2184/2019 — Remediación de suelos contaminados con hidrocarburos",
            "Decreto 4741/2005 — Gestión de residuos peligrosos (RESPEL)",
            "Resolución 1256/2021 — Vertimientos en cuerpos de agua (requisitos técnicos)",
        ],
        "como_ayuda": "BioCycle reduce tiempos de remediación en hasta un 60% frente a biorremediación tradicional, facilitando el cumplimiento de los plazos establecidos por la ANLA en Planes de Manejo Ambiental (PMA).",
    },
    "Planta textil": {
        "resoluciones": [
            "Resolución 631/2015 — Parámetros y valores límite permisibles en vertimientos puntuales",
            "Decreto 3930/2010 — Uso del agua y residuos líquidos",
            "Resolución 1256/2021 — Actualización de normativa de vertimientos",
        ],
        "como_ayuda": "BioCycle degrada colorantes azo y reduce DBO, DQO y sólidos suspendidos, ayudando a cumplir los límites del artículo 12 de la Res. 631/2015 para la industria textil.",
    },
    "Empresa agrícola": {
        "resoluciones": [
            "Resolución 2184/2019 — Criterios de calidad del suelo y remediación",
            "ICA — Normativa de uso y manejo de plaguicidas (Resolución 3759/2003)",
            "Ley 99/1993 — Principio de precaución ambiental",
        ],
        "como_ayuda": "BioCycle elimina residuos de plaguicidas del suelo para cumplir umbrales ICA, habilitando nuevamente el predio para uso agrícola certificado sin riesgo de trazas en cultivos.",
    },
    "Consultora ambiental": {
        "resoluciones": [
            "Decreto 2820/2010 — Licencias ambientales (EIA y PMA)",
            "ANLA — Términos de referencia para estudios de impacto ambiental",
            "Resolución 2184/2019 — Remediación de suelos",
        ],
        "como_ayuda": "BioCycle puede incorporarse como medida de compensación en EIAs y PMAs, demostrando cumplimiento activo con estándares de remediación exigidos por la ANLA y las Corporaciones Autónomas.",
    },
    "Relleno sanitario": {
        "resoluciones": [
            "Decreto 1713/2002 — Gestión integral de residuos sólidos",
            "RAS 2000 (Título F) — Sistemas de tratamiento de lixiviados",
            "Resolución 154/2014 — Gestión de lixiviados en rellenos sanitarios",
        ],
        "como_ayuda": "BioCycle trata lixiviados complejos con alta carga orgánica y metales, reduciendo costos de tratamiento fisicoquímico convencional y cumpliendo los límites de vertimiento exigidos por la autoridad ambiental.",
    },
    "Laboratorio": {
        "resoluciones": [
            "Decreto 4741/2005 — Gestión de residuos peligrosos",
            "GTC 24/2009 — Gestión ambiental de residuos sólidos en laboratorios",
            "Resolución 1362/2007 — Registro de generadores de RESPEL",
        ],
        "como_ayuda": "BioCycle reduce la peligrosidad de residuos químicos antes de la disposición final, disminuyendo la categoría de riesgo RESPEL y los costos de gestión especializada.",
    },
}

DESCRIPCIONES_PRODUCTO = {
    "Planta de reciclaje": "Consorcio especializado en depolimerización y oxidación de cadenas plásticas, formulado para operar en biorreactores de flujo continuo a temperatura ambiente.",
    "Empresa petrolera": "Consorcio hidrocarbonoclástico de alta eficiencia, adaptado a condiciones de campo: suelos arcillosos, temperatura variable y presencia de salinidad.",
    "Planta textil": "Consorcio lacasa-azorreductasa para mineralización de colorantes azo y reducción de metales en efluentes textiles de alta carga orgánica.",
    "Empresa agrícola": "Consorcio degradador de plaguicidas organofosforados y glifosato, con cepas adaptadas a suelos tropicales y subtropicales colombianos.",
    "Consultora ambiental": "Consorcio multiusos para remediación de sitios con pasivos ambientales complejos. Formulación robusta para condiciones impredecibles de campo.",
    "Relleno sanitario": "Consorcio para tratamiento de lixiviados de alta complejidad. Reduce DBO, metales y compuestos recalcitrantes en sistemas aerobios/anaerobios.",
    "Laboratorio": "Consorcio de degradación de solventes y compuestos aromáticos. Apto para tratamiento de pequeños volúmenes de residuos en condiciones controladas.",
}

TIMELINE_POR_TIPO = {
    "Planta de reciclaje": [
        ("Mes 1", "Piloto", "Prueba en lote de 500 kg. Validación de eficiencia y adaptación del consorcio."),
        ("Mes 2–3", "Escalamiento", "Transición a biorreactor continuo. Ajuste de proporciones y monitoreo semanal."),
        ("Mes 4+", "Operación", "Producción plena. Tratamiento integrado al flujo de la planta. Certificación."),
    ],
    "Empresa petrolera": [
        ("Mes 1", "Piloto", "Parcelas piloto de 100 m² en sitio contaminado. Muestreo inicial de TPH."),
        ("Mes 2–3", "Escalamiento", "Expansión a área completa. Instalación de sistema de monitoreo ambiental."),
        ("Mes 4+", "Operación", "Biorremediación activa. Reportes mensuales para ANLA o Corporación Autónoma."),
    ],
    "Planta textil": [
        ("Mes 1", "Piloto", "Tratamiento de efluente en reactor batch de 5 m³. Medición de DBO, DQO y color."),
        ("Mes 2–3", "Escalamiento", "Integración al sistema de tratamiento existente. Ajuste de dosis de inóculo."),
        ("Mes 4+", "Operación", "Tratamiento continuo conforme a Resolución 631/2015. Reporte a PSMV."),
    ],
    "Empresa agrícola": [
        ("Mes 1", "Piloto", "Aplicación en parcela de 1 ha. Muestreo de suelo antes/después (plaguicidas residuales)."),
        ("Mes 2–3", "Escalamiento", "Expansión a predios afectados. Aplicación de cápsulas + bioestimulación."),
        ("Mes 4+", "Operación", "Suelos en recuperación activa. Habilitación progresiva para siembra."),
    ],
    "Consultora ambiental": [
        ("Mes 1", "Piloto", "Diagnóstico y prueba de tratabilidad en sitio. Diseño del sistema de remediación."),
        ("Mes 2–3", "Escalamiento", "Implementación del plan de remediación. Monitoreo de contaminantes clave."),
        ("Mes 4+", "Operación", "Remediación activa hasta cumplir estándares. Entrega de informe final a ANLA."),
    ],
    "Relleno sanitario": [
        ("Mes 1", "Piloto", "Tratamiento de 50 m³ de lixiviado en sistema batch. Análisis fisicoquímico."),
        ("Mes 2–3", "Escalamiento", "Integración al sistema de lixiviados existente. Monitoreo de efluente tratado."),
        ("Mes 4+", "Operación", "Tratamiento continuo. Reducción de costos de disposición de lixiviados."),
    ],
    "Laboratorio": [
        ("Mes 1", "Piloto", "Tratamiento de residuos en reactor de 200 L. Caracterización de efluente."),
        ("Mes 2–3", "Escalamiento", "Ajuste de protocolo a tipos de residuos del laboratorio. Capacitación del personal."),
        ("Mes 4+", "Operación", "Gestión interna de residuos con BioCycle. Reducción de registros RESPEL."),
    ],
}


def render():
    st.markdown(CSS, unsafe_allow_html=True)

    st.markdown("""
    <div class="hero-section">
        <div class="hero-title">🧬 Impulso BioCycle</div>
        <div class="hero-subtitle">Biorremediación Inteligente con IA</div>
        <span class="hero-badge">🏭 Portal del Cliente — Soluciones para empresas</span>
    </div>
    """, unsafe_allow_html=True)

    st.markdown('<div class="result-section">', unsafe_allow_html=True)
    st.subheader("Datos de su operación")

    col1, col2 = st.columns(2)
    with col1:
        tipo_op = st.selectbox(
            "Tipo de operación",
            list(RESIDUOS_POR_TIPO.keys()),
            key="portal_tipo_op",
        )
        residuos_opciones = RESIDUOS_POR_TIPO[tipo_op]
        residuo = st.selectbox(
            "Residuo principal",
            residuos_opciones,
            key="portal_residuo",
        )

    with col2:
        ubicacion = st.selectbox(
            "Ubicación (ciudad)",
            CIUDADES_COLOMBIA,
            key="portal_ciudad",
        )
        costos = COSTOS_BASE[tipo_op]
        vol_label = f"Volumen mensual ({costos['unidad'].split('/')[1]})"
        volumen = st.number_input(
            vol_label,
            min_value=1.0,
            value=500.0,
            step=50.0,
            key="portal_volumen",
        )

    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("---")
    col_btn = st.columns([1, 2, 1])
    with col_btn[1]:
        generar = st.button(
            "📋 Generar Plan",
            use_container_width=True,
            type="primary",
            key="portal_generar_btn",
        )

    if generar or st.session_state.get("portal_plan_generado"):
        if generar:
            st.session_state["portal_plan_generado"] = True
            st.session_state["portal_tipo_result"] = tipo_op
            st.session_state["portal_residuo_result"] = residuo
            st.session_state["portal_ciudad_result"] = ubicacion
            st.session_state["portal_volumen_result"] = volumen

            fases = [
                ("🔍 Analizando tipo de operación y residuo...", 1.5),
                ("📍 Adaptando formulación al clima de " + ubicacion + "...", 1.5),
                ("💰 Calculando métricas financieras...", 1.5),
                ("🌿 Estimando impacto ambiental...", 1.0),
                ("📋 Generando plan regulatorio colombiano...", 1.5),
                ("✅ Plan generado exitosamente", 0.8),
            ]
            ph_status = st.empty()
            ph_progress = st.empty()
            for i, (texto, dur) in enumerate(fases):
                with ph_status.container():
                    st.info(texto)
                with ph_progress.container():
                    st.progress((i + 1) / len(fases))
                import time
                time.sleep(dur)
            ph_status.empty()
            ph_progress.empty()

        tipo_r = st.session_state.get("portal_tipo_result", tipo_op)
        residuo_r = st.session_state.get("portal_residuo_result", residuo)
        ciudad_r = st.session_state.get("portal_ciudad_result", ubicacion)
        vol_r = st.session_state.get("portal_volumen_result", volumen)

        clima = CLIMA_CIUDAD.get(ciudad_r, "Tropical")
        codigo = TIPO_CODIGO.get(tipo_r, "ENV")
        nombre_producto = f"BioCycle {codigo}-{clima}"

        costos_r = COSTOS_BASE[tipo_r]
        inversion_mensual = costos_r["biocycle"] * vol_r
        ahorro_mensual = (costos_r["convencional"] - costos_r["biocycle"]) * vol_r
        roi_meses = round(inversion_mensual / max(ahorro_mensual, 1) * 3, 1)
        ahorro_anual = ahorro_mensual * 12
        co2_reducido = CO2_REDUCCION[tipo_r] * vol_r / 1000

        st.success(f"✅ Plan generado para **{tipo_r}** en **{ciudad_r}** — Formulación climática: **{clima}**")

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("🧬 Producto Recomendado")

        st.markdown(f"""
        <div class="product-card">
            <div class="product-name">
                {nombre_producto}
                <span class="product-badge">Formulación {clima}</span>
            </div>
            <div style="margin-top:12px; font-size:15px; color:#2E7D32; font-weight:600;">
                Para: {residuo_r}
            </div>
            <div style="margin-top:10px; font-size:14px; color:#444; line-height:1.6;">
                {DESCRIPCIONES_PRODUCTO[tipo_r]}
            </div>
            <div style="margin-top:14px; display:flex; gap:12px; flex-wrap:wrap;">
                <span style="background:#E8F5E9; border:1px solid #81C784; padding:5px 14px;
                             border-radius:20px; font-size:13px; color:#1B5E20; font-weight:600;">
                    🦠 BSL-1/GRAS — Sin riesgo biológico
                </span>
                <span style="background:#E8F5E9; border:1px solid #81C784; padding:5px 14px;
                             border-radius:20px; font-size:13px; color:#1B5E20; font-weight:600;">
                    💊 Encapsulado en alginato de sodio
                </span>
                <span style="background:#E8F5E9; border:1px solid #81C784; padding:5px 14px;
                             border-radius:20px; font-size:13px; color:#1B5E20; font-weight:600;">
                    📍 Adaptado a clima {clima}
                </span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("🗓️ Cronograma de Implementación")

        timeline = TIMELINE_POR_TIPO.get(tipo_r, TIMELINE_POR_TIPO["Consultora ambiental"])
        t_cols = st.columns(len(timeline))
        for i, (mes, etapa, detalle) in enumerate(timeline):
            with t_cols[i]:
                st.markdown(f"""
                <div class="timeline-step">
                    <div class="timeline-month">{mes}</div>
                    <div style="font-size:15px; font-weight:700; color:#1B5E20; margin:6px 0;">{etapa}</div>
                    <div class="timeline-label">{detalle}</div>
                </div>
                """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("💰 Métricas Financieras")

        f1, f2, f3, f4 = st.columns(4)
        with f1:
            st.markdown(f"""
            <div class="fin-metric">
                <div class="fin-value">${inversion_mensual:,.0f}</div>
                <div class="fin-label">Inversión mensual (USD)</div>
            </div>
            """, unsafe_allow_html=True)
        with f2:
            st.markdown(f"""
            <div class="fin-metric">
                <div class="fin-value" style="color:#00C853;">${ahorro_mensual:,.0f}</div>
                <div class="fin-label">Ahorro vs. método actual (USD/mes)</div>
            </div>
            """, unsafe_allow_html=True)
        with f3:
            st.markdown(f"""
            <div class="fin-metric">
                <div class="fin-value">${ahorro_anual:,.0f}</div>
                <div class="fin-label">Ahorro proyectado anual (USD)</div>
            </div>
            """, unsafe_allow_html=True)
        with f4:
            st.markdown(f"""
            <div class="fin-metric">
                <div class="fin-value" style="color:#2196F3;">{roi_meses:.1f} meses</div>
                <div class="fin-label">Período de retorno (ROI)</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown(f"""
        <div style="background:#F1F8E9; border-radius:10px; padding:14px 18px; margin-top:14px;
                    font-size:13px; color:#1B5E20; border-left:4px solid #00C853;">
            💡 <b>Referencia:</b> Costo convencional estimado <b>${costos_r['convencional']}{costos_r['unidad']}</b>
            vs. BioCycle <b>${costos_r['biocycle']}{costos_r['unidad']}</b>
            — Ahorro del <b>{round((1 - costos_r['biocycle']/costos_r['convencional'])*100)}%</b> por unidad tratada.
            Costos en USD a precios de referencia de mercado colombiano 2024.
        </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("🌿 Impacto Ambiental Estimado")

        e1, e2, e3 = st.columns(3)
        with e1:
            st.markdown(f"""
            <div class="env-metric">
                <div class="env-value">{vol_r:,.0f}</div>
                <div class="env-label">Residuo tratado por mes ({costos_r['unidad'].split('/')[1]})</div>
            </div>
            """, unsafe_allow_html=True)
        with e2:
            st.markdown(f"""
            <div class="env-metric">
                <div class="env-value">{co2_reducido:.1f} t</div>
                <div class="env-label">CO₂eq evitado por mes</div>
            </div>
            """, unsafe_allow_html=True)
        with e3:
            st.markdown(f"""
            <div class="env-metric">
                <div class="env-value">{co2_reducido * 12:.1f} t</div>
                <div class="env-label">CO₂eq evitado por año</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown(f"""
        <div style="background:#E8F5E9; border-radius:10px; padding:14px 18px; margin-top:14px;
                    font-size:13px; color:#1B4332;">
            🌍 El tratamiento con BioCycle elimina la necesidad de incineración o disposición en relleno sanitario,
            reduciendo emisiones de GEI. Equivale a retirar aproximadamente
            <b>{round(co2_reducido * 12 / 2.3)} vehículos</b> de circulación durante un año.
        </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="result-section">', unsafe_allow_html=True)
        st.subheader("⚖️ Marco Regulatorio Colombiano")

        norm = NORMATIVA[tipo_r]
        st.markdown(f"""
        <div class="reg-box">
            <b>📋 Normativa aplicable para {tipo_r}:</b>
            <ul style="margin-top:10px; margin-bottom:10px; padding-left:20px; font-size:14px; color:#333;">
                {"".join(f"<li style='margin-bottom:6px;'>{r}</li>" for r in norm['resoluciones'])}
            </ul>
            <b>✅ ¿Cómo ayuda BioCycle al cumplimiento?</b>
            <div style="margin-top:8px; font-size:14px; color:#555; line-height:1.6;">
                {norm['como_ayuda']}
            </div>
        </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown("---")
        col_cta = st.columns([1, 2, 1])
        with col_cta[1]:
            st.markdown("""
            <div style="background:linear-gradient(135deg,#1B5E20,#2E7D32); border-radius:14px;
                        padding:22px 28px; text-align:center; color:white;">
                <div style="font-size:18px; font-weight:700; margin-bottom:8px;">
                    ¿Listo para implementar BioCycle en su operación?
                </div>
                <div style="font-size:13px; opacity:0.9; margin-bottom:14px;">
                    Nuestro equipo técnico lo acompaña desde el piloto hasta la operación plena.
                </div>
                <div style="font-size:14px; font-weight:600;">
                    📧 contacto@impulso-biocycle.co &nbsp;|&nbsp; 📞 +57 (1) 800-BIOCYCLE
                </div>
            </div>
            """, unsafe_allow_html=True)
