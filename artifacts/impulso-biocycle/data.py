DISCOVERIES = [
    {
        "title": "FAST-PETase",
        "category": "Enzima",
        "year": 2022,
        "institution": "U. Texas Austin",
        "description": "Enzima diseñada por machine learning que degrada PET plástico a temperatura ambiente. Variante mejorada de PETase con 5 mutaciones clave que aumentan la estabilidad térmica y la velocidad de reacción.",
        "result": "51 productos PET degradados en 1 semana a 50°C — velocidad 6x mayor que PETase nativa",
        "link": "https://www.nature.com/articles/s41586-022-04532-6",
        "color": "#1B5E20",
    },
    {
        "title": "LCC-ICCG",
        "category": "Enzima",
        "year": 2021,
        "institution": "INRAE/Carbios",
        "description": "Variante cuádruple de cutinasa de compost. El benchmark industrial de hidrólisis enzimática de PET. Desarrollada para escala industrial con alta estabilidad a 72°C.",
        "result": ">90% PET post-consumo degradado en 10 horas a 72°C — récord mundial",
        "link": "https://www.nature.com/articles/s41586-020-2149-4",
        "color": "#1B5E20",
    },
    {
        "title": "Ideonella sakaiensis",
        "category": "Bacteria",
        "year": 2016,
        "institution": "Inst. Tecnología Kyoto",
        "description": "Primera bacteria descubierta que usa PET como fuente de carbono y energía. Produce dos enzimas (PETase y MHETase) que trabajan en cascada para descomponer el plástico.",
        "result": "Degrada PET completamente con PETase + MHETase — primer organismo PET-trópico conocido",
        "link": "https://www.science.org/doi/10.1126/science.aad6359",
        "color": "#2E7D32",
    },
    {
        "title": "Consorcio Pseudomonas-Bacillus-Acinetobacter",
        "category": "Consorcio",
        "year": 2022,
        "institution": "Múltiples",
        "description": "Consorcio de tres especies con roles complementarios: Pseudomonas degrada HC aromáticos, Bacillus produce biosurfactantes, Acinetobacter mineraliza productos intermedios.",
        "result": ">80% degradación en 60 días vs <40% con especies individuales — sinergia demostrada",
        "link": "https://www.sciencedirect.com/science/article/pii/S0269749122006340",
        "color": "#4CAF50",
    },
    {
        "title": "Deepwater Horizon — Alcanivorax",
        "category": "Proyecto",
        "year": 2010,
        "institution": "NOAA / Múltiples",
        "description": "Tras el mayor derrame de la historia, bacterias marinas Alcanivorax borkumensis proliferaron masivamente y degradaron hidrocarburos subsuperficiales. Caso de biorremediación natural documentado.",
        "result": ">90% de HC subsuperficiales degradados en 5 meses — el mayor evento de biorremediación registrado",
        "link": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3155981/",
        "color": "#1565C0",
    },
    {
        "title": "AlphaFold + ProteinMPNN",
        "category": "IA",
        "year": 2024,
        "institution": "Premio Nobel Química 2024",
        "description": "Modelos de diseño computacional de proteínas. Revolucionan el descubrimiento de nuevas enzimas degradadoras. Permiten diseñar enzimas a medida para contaminantes específicos.",
        "result": "89% precisión en clasificación de enzimas plástico-activas — acelera descubrimiento 1000x",
        "link": "https://www.nobelprize.org/prizes/chemistry/2024/summary/",
        "color": "#6A1B9A",
    },
    {
        "title": "Proyecto EiCLaR",
        "category": "Proyecto",
        "year": 2024,
        "institution": "Comisión Europea",
        "description": "4 tecnologías de biorremediación in situ probadas en campo real. Incluye bioaumentación, bioestimulación, fitorremediación asistida y encapsulación de consorcios.",
        "result": "Todas las tecnologías listas para mercado (TRL 7-8) — primer proyecto EU con 4 tecnologías simultáneas",
        "link": "https://cordis.europa.eu/project/id/101037492",
        "color": "#1565C0",
    },
    {
        "title": "Encapsulación alginato para HC",
        "category": "Consorcio",
        "year": 2023,
        "institution": "Múltiples",
        "description": "Bacterias inmovilizadas en alginato-carbón activado para degradación de crudo de petróleo. La encapsulación protege los microorganismos y mejora la transferencia de masa.",
        "result": "75.1% degradación crudo en 7 días vs ~40% libre — eficiencia 2x con cápsulas",
        "link": "https://link.springer.com/article/10.1007/s10532-023-10019-2",
        "color": "#4CAF50",
    },
    {
        "title": "Biorremediación Colombia — Revisión",
        "category": "Proyecto",
        "year": 2022,
        "institution": "Colombia / PMC",
        "description": "Revisión sistemática de 37 estudios colombianos sobre biorremediación de suelos contaminados con hidrocarburos. Documenta géneros más efectivos en condiciones tropicales.",
        "result": "Pseudomonas y Bacillus son los géneros más efectivos en suelos tropicales colombianos",
        "link": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8913000/",
        "color": "#E65100",
    },
    {
        "title": "Allonnia — Biorremediación comercial",
        "category": "Proyecto",
        "year": 2023,
        "institution": "Allonnia (EE.UU.)",
        "description": "Primera empresa en comercializar biorremediación microbiana para 1,4-dioxano — contaminante emergente extremadamente persistente. Usa consorcios diseñados por ingeniería metabólica.",
        "result": "99% degradación de 1,4-dioxano en campo abierto — primer caso comercial documentado",
        "link": "https://allonnia.com",
        "color": "#E65100",
    },
]

CATEGORY_COLORS = {
    "Enzima": "#1B5E20",
    "Bacteria": "#2E7D32",
    "Consorcio": "#4CAF50",
    "Proyecto": "#1565C0",
    "IA": "#6A1B9A",
}

SUBTYPES = {
    "Plásticos": [
        "PET (botellas, envases) — en biorreactor",
        "HDPE (envases rígidos) — en biorreactor",
        "LDPE (bolsas, film) — en biorreactor",
        "PP (tapas, empaques) — en biorreactor",
        "PS/Icopor (vasos, bandejas) — en biorreactor",
        "PVC (tuberías, cables) — en biorreactor",
        "PLA (bioplástico) — compostaje",
        "Mezcla de plásticos — en biorreactor",
    ],
    "Hidrocarburos y petróleo": [
        "Petróleo crudo / derrames",
        "Diésel y gasolina",
        "PAHs (hidrocarburos aromáticos policíclicos)",
        "Aceites industriales usados",
    ],
    "Suelos agrícolas contaminados": [
        "Organofosforados (clorpirifos, malatión)",
        "Glifosato y AMPA",
        "Carbamatos (carbofurán, carbarilo)",
        "Metales pesados (Pb, Cd, Cr, As)",
    ],
    "Aguas residuales industriales": [
        "Colorantes textiles azo",
        "Metales pesados (Cr, Cu, Zn, Pb)",
        "Fenoles industriales",
        "Residuos farmacéuticos",
    ],
    "Contaminantes químicos": [
        "PFAS (químicos eternos)",
        "PCBs y dioxinas",
        "Explosivos (TNT, RDX)",
    ],
}

CONSORTIA_DATA = {
    "PET (botellas, envases) — en biorreactor": [
        {"microorganism": "Ideonella sakaiensis", "safety": "🟢 BSL-1", "role": "Degradador primario de PET — produce PETase y MHETase", "proportion": "35%", "optimal_range": "30-37°C, pH 7.0-7.5"},
        {"microorganism": "Bacillus subtilis (FAST-PETase)", "safety": "🟢 GRAS", "role": "Acelerador enzimático — FAST-PETase x6 más rápida", "proportion": "30%", "optimal_range": "37-50°C, pH 6.5-7.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Metabolizador de productos intermedios (TPA, EG)", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus ruber", "safety": "🟢 BSL-1", "role": "Biosurfactante + estabilizador del consorcio", "proportion": "15%", "optimal_range": "25-35°C, pH 6.0-8.0"},
    ],
    "HDPE (envases rígidos) — en biorreactor": [
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Productor de biosurfactantes — aumenta biodisponibilidad", "proportion": "35%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus ruber", "safety": "🟢 BSL-1", "role": "Degradador principal HDPE — oxidación terminal de cadenas", "proportion": "30%", "optimal_range": "25-35°C, pH 6.0-8.0"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Metabolizador de oligómeros — mineralización completa", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Aspergillus niger", "safety": "🟢 BSL-1", "role": "Hongo: producción de lacasas y peroxidasas", "proportion": "15%", "optimal_range": "25-30°C, pH 4.0-6.5"},
    ],
    "LDPE (bolsas, film) — en biorreactor": [
        {"microorganism": "Bacillus cereus", "safety": "🟢 BSL-1", "role": "Degradador primario LDPE — oxidación de polietileno", "proportion": "30%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus ruber", "safety": "🟢 BSL-1", "role": "Co-degradador — aumenta tasa de biodegradación", "proportion": "30%", "optimal_range": "25-35°C, pH 6.0-8.0"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosurfactante + soporte metabólico", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Streptomyces viridosporus", "safety": "🟢 BSL-1", "role": "Actinobacteria: enzimas ligninolíticas para PE", "proportion": "15%", "optimal_range": "28-37°C, pH 7.0-8.0"},
    ],
    "PP (tapas, empaques) — en biorreactor": [
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Degradador primario PP — oxidación de grupos metilo", "proportion": "35%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus ruber", "safety": "🟢 BSL-1", "role": "Co-degradador — hidrocarbono-oxidante versátil", "proportion": "30%", "optimal_range": "25-35°C, pH 6.0-8.0"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Metabolizador de intermedios — cierra ciclo de carbono", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Aspergillus fumigatus", "safety": "🟢 BSL-1", "role": "Hongo termofílico: enzimas activas a alta T°", "proportion": "15%", "optimal_range": "37-50°C, pH 5.5-7.0"},
    ],
    "PS/Icopor (vasos, bandejas) — en biorreactor": [
        {"microorganism": "Exiguobacterium sp.", "safety": "🟢 BSL-1", "role": "Degradador primario PS — aislado de larvas de tenebrio", "proportion": "35%", "optimal_range": "25-35°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Productor biosurfactantes + co-degradador", "proportion": "30%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Metabolizador estireno y derivados aromáticos", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus ruber", "safety": "🟢 BSL-1", "role": "Co-degradador + estabilizador del consorcio", "proportion": "15%", "optimal_range": "25-35°C, pH 6.0-8.0"},
    ],
    "PVC (tuberías, cables) — en biorreactor": [
        {"microorganism": "Phanerochaete chrysosporium", "safety": "🟢 BSL-1", "role": "Hongo: ligninasa degrada estructura PVC", "proportion": "30%", "optimal_range": "25-30°C, pH 4.5-5.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Eliminación de plastificantes y aditivos", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Degradación de monómeros de cloruro de vinilo", "proportion": "25%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus erythropolis", "safety": "🟢 BSL-1", "role": "Detoxificación de subproductos clorados", "proportion": "20%", "optimal_range": "20-30°C, pH 6.0-8.0"},
    ],
    "PLA (bioplástico) — compostaje": [
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Productor ácido láctico — hidroliza PLA rápidamente", "proportion": "40%", "optimal_range": "50-60°C, pH 6.0-7.5"},
        {"microorganism": "Amycolatopsis sp.", "safety": "🟢 BSL-1", "role": "Actinobacteria productora de proteasas-PLA", "proportion": "30%", "optimal_range": "45-55°C, pH 7.0-8.0"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Metabolizador ácido láctico y oligómeros", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Aspergillus niger", "safety": "🟢 BSL-1", "role": "Hongo: acelera compostaje con celulasas", "proportion": "10%", "optimal_range": "30-40°C, pH 4.0-6.0"},
    ],
    "Mezcla de plásticos — en biorreactor": [
        {"microorganism": "Ideonella sakaiensis", "safety": "🟢 BSL-1", "role": "Degradador específico fracción PET", "proportion": "25%", "optimal_range": "30-37°C, pH 7.0-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosurfactantes + soporte general del consorcio", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus ruber", "safety": "🟢 BSL-1", "role": "Degradador polietilenos (HDPE/LDPE)", "proportion": "25%", "optimal_range": "25-35°C, pH 6.0-8.0"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Metabolizador universal de intermedios aromáticos", "proportion": "25%", "optimal_range": "25-30°C, pH 6.5-7.5"},
    ],
    "Petróleo crudo / derrames": [
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Degradador primario HC alifáticos y aromáticos", "proportion": "30%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Productor biosurfactante — emulsifica el crudo", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus erythropolis", "safety": "🟢 BSL-1", "role": "Co-degradador — especialista en alcanos ramificados", "proportion": "25%", "optimal_range": "20-30°C, pH 6.0-8.0"},
        {"microorganism": "Sphingomonas paucimobilis", "safety": "🟢 BSL-1", "role": "Especialista en PAHs — ligninasa + oxigenasas", "proportion": "20%", "optimal_range": "25-30°C, pH 6.0-7.5"},
    ],
    "Diésel y gasolina": [
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Degradador primario diésel y BTEX (benceno, tolueno)", "proportion": "35%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosurfactante + productor oxidasas", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus erythropolis", "safety": "🟢 BSL-1", "role": "Degradador de alcanos de cadena larga", "proportion": "25%", "optimal_range": "20-30°C, pH 6.0-8.0"},
        {"microorganism": "Acinetobacter baylyi", "safety": "🟢 BSL-1", "role": "Mineralización final — cierra ciclo de carbono", "proportion": "15%", "optimal_range": "25-35°C, pH 6.5-7.5"},
    ],
    "PAHs (hidrocarburos aromáticos policíclicos)": [
        {"microorganism": "Mycobacterium vanbaalenii", "safety": "🟢 BSL-1", "role": "Degradador PAHs alto peso molecular — dioxigenasa multicomponente", "proportion": "30%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Sphingomonas paucimobilis", "safety": "🟢 BSL-1", "role": "Degradador PAHs bajo peso molecular — naftaleno, fenantreno", "proportion": "30%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Phanerochaete chrysosporium", "safety": "🟢 BSL-1", "role": "Hongo: lacasa y manganeso peroxidasa — ataca PAHs persistentes", "proportion": "25%", "optimal_range": "25-30°C, pH 4.5-5.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosurfactante + soporte metabólico del consorcio", "proportion": "15%", "optimal_range": "30-37°C, pH 6.5-7.5"},
    ],
    "Aceites industriales usados": [
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Degradador principal de lípidos y HC lubricantes", "proportion": "35%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Lipasas + biosurfactante — emulsifica aceites", "proportion": "30%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus erythropolis", "safety": "🟢 BSL-1", "role": "Degradador de fracciones aromáticas del aceite", "proportion": "20%", "optimal_range": "20-30°C, pH 6.0-8.0"},
        {"microorganism": "Acinetobacter baylyi", "safety": "🟢 BSL-1", "role": "Mineralización final de ácidos grasos libres", "proportion": "15%", "optimal_range": "25-35°C, pH 6.5-7.5"},
    ],
    "Organofosforados (clorpirifos, malatión)": [
        {"microorganism": "Pseudomonas putida KT2440", "safety": "🟢 BSL-1", "role": "Degradador primario — OPH (organophosphorus hydrolase)", "proportion": "35%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Co-degradador + biosurfactante para biodisponibilidad", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Sphingomonas sp.", "safety": "🟢 BSL-1", "role": "Degradador de metabolitos tóxicos (TCP, 3,5,6-TCPy)", "proportion": "25%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Trichoderma harzianum", "safety": "🟢 BSL-1", "role": "Degradador fúngico — acelera hidrólisis en suelo", "proportion": "15%", "optimal_range": "25-30°C, pH 5.5-7.0"},
    ],
    "Glifosato y AMPA": [
        {"microorganism": "Bacillus subtilis Bs-15", "safety": "🟢 GRAS", "role": "Degradador primario — vía C-P liasa", "proportion": "35%", "optimal_range": "25-35°C, pH 6.5-7.5"},
        {"microorganism": "Lysinibacillus sphaericus", "safety": "🟢 BSL-1", "role": "Vía sarcosina — mineraliza AMPA a fosfato", "proportion": "30%", "optimal_range": "25-35°C, pH 6.5-8.0"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Co-degradador + detoxificación aromática", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Aspergillus niger", "safety": "🟢 BSL-1", "role": "Degradador fúngico — enzimas extracelulares en suelo", "proportion": "15%", "optimal_range": "25-30°C, pH 4.0-6.5"},
    ],
    "Carbamatos (carbofurán, carbarilo)": [
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Degradador primario — carbarilasa + arilesterasas", "proportion": "35%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Co-degradador + biosurfactante", "proportion": "30%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Sphingomonas paucimobilis", "safety": "🟢 BSL-1", "role": "Degradador de metabolitos fenólicos", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Trichoderma viride", "safety": "🟢 BSL-1", "role": "Degradador fúngico en suelo — mejora estructura", "proportion": "15%", "optimal_range": "25-30°C, pH 5.5-7.0"},
    ],
    "Metales pesados (Pb, Cd, Cr, As)": [
        {"microorganism": "Aspergillus niger", "safety": "🟢 BSL-1", "role": "Bioacumulador primario — ácidos orgánicos movilizan metales", "proportion": "30%", "optimal_range": "25-30°C, pH 4.0-6.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosurfactante + biosorción superficial de metales", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Biotransformación Cr(VI)→Cr(III) — menos tóxico", "proportion": "25%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Chlorella vulgaris", "safety": "🟢 BSL-1", "role": "Alga: biosorción masiva — alta capacidad de captación", "proportion": "20%", "optimal_range": "20-28°C, pH 6.5-8.0"},
    ],
    "Colorantes textiles azo": [
        {"microorganism": "Phanerochaete chrysosporium", "safety": "🟢 BSL-1", "role": "Decoloración primaria — lacasa + MnP rompen anillos azo", "proportion": "30%", "optimal_range": "25-30°C, pH 4.5-5.5"},
        {"microorganism": "Trametes versicolor", "safety": "🟢 BSL-1", "role": "Decoloración enzimática — lacasa más eficiente conocida", "proportion": "30%", "optimal_range": "25-30°C, pH 4.5-6.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Reducción enlace azo — azorreductasa bacteriana", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Mineralización aminas aromáticas intermedias", "proportion": "15%", "optimal_range": "25-30°C, pH 6.5-7.5"},
    ],
    "Metales pesados (Cr, Cu, Zn, Pb)": [
        {"microorganism": "Aspergillus niger", "safety": "🟢 BSL-1", "role": "Bioacumulador — ácidos oxálico y glucónico movilizan metales", "proportion": "30%", "optimal_range": "25-30°C, pH 4.0-6.5"},
        {"microorganism": "Chlorella vulgaris", "safety": "🟢 BSL-1", "role": "Alga: biosorción superficial de Cu, Zn, Pb", "proportion": "30%", "optimal_range": "20-28°C, pH 6.5-8.0"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosurfactante + precipitación de sulfuros metálicos", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Biotransformación y quelación de metales pesados", "proportion": "15%", "optimal_range": "25-30°C, pH 6.5-7.5"},
    ],
    "Fenoles industriales": [
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Degradador primario fenoles — catecol 1,2 y 2,3 dioxigenasa", "proportion": "40%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Co-degradador + biosurfactante — aumenta biodisponibilidad", "proportion": "25%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Rhodococcus erythropolis", "safety": "🟢 BSL-1", "role": "Degradador fenoles clorados y nitrofenoles", "proportion": "20%", "optimal_range": "20-30°C, pH 6.0-8.0"},
        {"microorganism": "Phanerochaete chrysosporium", "safety": "🟢 BSL-1", "role": "Hongo: lacasa oxida fenoles recalcitrantes", "proportion": "15%", "optimal_range": "25-30°C, pH 4.5-5.5"},
    ],
    "Residuos farmacéuticos": [
        {"microorganism": "Sphingomonas paucimobilis", "safety": "🟢 BSL-1", "role": "Degradador antibióticos — fluoroquinolonas, sulfonamidas", "proportion": "30%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Degradador ibuprofeno, naproxeno — lacasas inespecíficas", "proportion": "30%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Trametes versicolor", "safety": "🟢 BSL-1", "role": "Lacasa fúngica — amplio espectro de fármacos", "proportion": "25%", "optimal_range": "25-30°C, pH 4.5-6.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Mineralización final de metabolitos farmacéuticos", "proportion": "15%", "optimal_range": "25-30°C, pH 6.5-7.5"},
    ],
    "PFAS (químicos eternos)": [
        {"microorganism": "Acidimicrobium sp. Strain A6", "safety": "🟢 BSL-1", "role": "Única bacteria conocida que rompe enlace C-F de PFOA", "proportion": "40%", "optimal_range": "30-35°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosorción + co-metabolismo PFAS de cadena corta", "proportion": "30%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Phanerochaete chrysosporium", "safety": "🟢 BSL-1", "role": "Oxidoreductasas radicales — ataque parcial cadenas PFAS", "proportion": "20%", "optimal_range": "25-30°C, pH 4.5-5.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Defluorinación co-metabólica con co-sustratos", "proportion": "10%", "optimal_range": "25-30°C, pH 6.5-7.5"},
    ],
    "PCBs y dioxinas": [
        {"microorganism": "Burkholderia xenovorans LB400", "safety": "🟢 BSL-1", "role": "Degradador primario PCBs — biphenyl dioxigenasa", "proportion": "35%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Phanerochaete chrysosporium", "safety": "🟢 BSL-1", "role": "Hongo ligninolítico: degrada PCBs de alto cloro", "proportion": "30%", "optimal_range": "25-30°C, pH 4.5-5.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Biosurfactante — aumenta biodisponibilidad de PCBs", "proportion": "20%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Sphingomonas paucimobilis", "safety": "🟢 BSL-1", "role": "Co-degradador + detoxificación de clorobifenilos", "proportion": "15%", "optimal_range": "25-30°C, pH 6.5-7.5"},
    ],
    "Explosivos (TNT, RDX)": [
        {"microorganism": "Rhodococcus erythropolis", "safety": "🟢 BSL-1", "role": "Reducción nitrogrupos TNT — enzimas nitrorreductasas", "proportion": "35%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Bacillus subtilis", "safety": "🟢 GRAS", "role": "Mineralización productos de reducción — ciclotrimethylenetrinitramine", "proportion": "30%", "optimal_range": "30-37°C, pH 6.5-7.5"},
        {"microorganism": "Pseudomonas putida", "safety": "🟢 BSL-1", "role": "Co-degradador RDX — ring cleavage enzymes", "proportion": "20%", "optimal_range": "25-30°C, pH 6.5-7.5"},
        {"microorganism": "Phanerochaete chrysosporium", "safety": "🟢 BSL-1", "role": "Hongo: ligninasas atacan estructura TNT recalcitrante", "proportion": "15%", "optimal_range": "25-30°C, pH 4.5-5.5"},
    ],
}

SUCCESS_PROBABILITIES = {
    "PET (botellas, envases) — en biorreactor": 82,
    "HDPE (envases rígidos) — en biorreactor": 28,
    "LDPE (bolsas, film) — en biorreactor": 25,
    "PP (tapas, empaques) — en biorreactor": 18,
    "PS/Icopor (vasos, bandejas) — en biorreactor": 35,
    "PVC (tuberías, cables) — en biorreactor": 10,
    "PLA (bioplástico) — compostaje": 75,
    "Mezcla de plásticos — en biorreactor": 45,
    "Petróleo crudo / derrames": 68,
    "Diésel y gasolina": 72,
    "PAHs (hidrocarburos aromáticos policíclicos)": 62,
    "Aceites industriales usados": 70,
    "Organofosforados (clorpirifos, malatión)": 78,
    "Glifosato y AMPA": 72,
    "Carbamatos (carbofurán, carbarilo)": 75,
    "Metales pesados (Pb, Cd, Cr, As)": 80,
    "Colorantes textiles azo": 88,
    "Metales pesados (Cr, Cu, Zn, Pb)": 82,
    "Fenoles industriales": 85,
    "Residuos farmacéuticos": 65,
    "PFAS (químicos eternos)": 22,
    "PCBs y dioxinas": 45,
    "Explosivos (TNT, RDX)": 55,
}

PUBLICATIONS_COUNT = {
    "PET (botellas, envases) — en biorreactor": 127,
    "HDPE (envases rígidos) — en biorreactor": 43,
    "LDPE (bolsas, film) — en biorreactor": 38,
    "PP (tapas, empaques) — en biorreactor": 31,
    "PS/Icopor (vasos, bandejas) — en biorreactor": 52,
    "PVC (tuberías, cables) — en biorreactor": 19,
    "PLA (bioplástico) — compostaje": 89,
    "Mezcla de plásticos — en biorreactor": 61,
    "Petróleo crudo / derrames": 215,
    "Diésel y gasolina": 183,
    "PAHs (hidrocarburos aromáticos policíclicos)": 312,
    "Aceites industriales usados": 97,
    "Organofosforados (clorpirifos, malatión)": 248,
    "Glifosato y AMPA": 176,
    "Carbamatos (carbofurán, carbarilo)": 134,
    "Metales pesados (Pb, Cd, Cr, As)": 289,
    "Colorantes textiles azo": 341,
    "Metales pesados (Cr, Cu, Zn, Pb)": 278,
    "Fenoles industriales": 198,
    "Residuos farmacéuticos": 142,
    "PFAS (químicos eternos)": 67,
    "PCBs y dioxinas": 156,
    "Explosivos (TNT, RDX)": 88,
}

DEGRADATION_CURVES = {
    "plastico": {
        "biocycle": [0, 2, 5, 10, 18, 28, 40, 54, 65, 73, 79, 83, 86, 88, 90, 91, 92],
        "natural": [0, 0.1, 0.2, 0.3, 0.5, 0.8, 1.0, 1.3, 1.5, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.1],
        "convencional": [0, 1, 3, 6, 10, 15, 22, 30, 38, 45, 51, 56, 60, 63, 65, 67, 68],
    },
    "hidrocarburo": {
        "biocycle": [0, 5, 12, 22, 35, 48, 59, 67, 73, 77, 80, 82, 84, 85, 86, 87, 88],
        "natural": [0, 1, 3, 5, 8, 11, 14, 17, 20, 23, 25, 27, 29, 30, 31, 32, 33],
        "convencional": [0, 3, 8, 15, 25, 36, 45, 53, 59, 63, 66, 69, 71, 73, 74, 75, 76],
    },
    "suelo_agricola": {
        "biocycle": [0, 4, 10, 20, 32, 45, 57, 66, 72, 76, 79, 81, 82, 83, 84, 84, 85],
        "natural": [0, 1, 2, 4, 6, 8, 11, 14, 17, 19, 21, 23, 25, 26, 27, 28, 29],
        "convencional": [0, 2, 6, 12, 20, 30, 39, 47, 53, 58, 62, 65, 67, 69, 70, 71, 72],
    },
    "agua_residual": {
        "biocycle": [0, 8, 20, 35, 50, 63, 73, 80, 85, 88, 90, 91, 92, 93, 93, 94, 94],
        "natural": [0, 1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 16, 17, 18, 18, 19, 19],
        "convencional": [0, 5, 12, 22, 33, 44, 53, 61, 67, 72, 75, 77, 79, 80, 81, 82, 82],
    },
    "quimico": {
        "biocycle": [0, 1, 3, 6, 10, 15, 20, 25, 29, 32, 34, 36, 37, 38, 39, 39, 40],
        "natural": [0, 0.0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2],
        "convencional": [0, 1, 2, 4, 7, 10, 14, 18, 21, 24, 26, 28, 29, 30, 31, 31, 32],
    },
}

def get_category_type(category):
    if category == "Plásticos":
        return "plastico"
    elif category == "Hidrocarburos y petróleo":
        return "hidrocarburo"
    elif category == "Suelos agrícolas contaminados":
        return "suelo_agricola"
    elif category == "Aguas residuales industriales":
        return "agua_residual"
    else:
        return "quimico"
