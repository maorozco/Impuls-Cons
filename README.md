# Impulso BioCycle

> **Accelerating the Natural Cycle through Intelligence**

Plataforma global de inteligencia artificial para diseño de soluciones biológicas de biorremediación. Conecta 2,000+ publicaciones científicas con empresas y laboratorios que necesitan tratar contaminantes.

---

## Tabla de contenidos

- [¿Qué hace la app?](#qué-hace-la-app)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correr la app localmente](#cómo-correr-la-app-localmente)
- [Cómo contribuir sin romper nada](#cómo-contribuir-sin-romper-nada)
- [Reglas críticas de diseño](#reglas-críticas-de-diseño)
- [Paleta de colores y estilo](#paleta-de-colores-y-estilo)
- [Modelo de Machine Learning](#modelo-de-machine-learning)
- [Datos científicos](#datos-científicos)

---

## ¿Qué hace la app?

Impulso BioCycle tiene **5 páginas** accesibles desde el sidebar:

| Página | Descripción |
|--------|-------------|
| **Inicio** | Landing page global con imagen de marca, dos rutas de acción y animación de cápsula microbiana |
| **Descubrimientos** | Feed de investigaciones científicas recientes sobre biodegradación |
| **Construye tu Consorcio** | Diseñador técnico paso a paso: selección de contaminante → microorganismos → predicción ML → cápsula |
| **Gestiona tus Residuos** | Portal para empresas: elige industria y país → recibe plan de producto, cronograma, ROI y regulación |
| **Asesoría IA** | Chatbot con respuestas basadas en keywords sobre biorremediación |

---

## Estructura del proyecto

```
artifacts/impulso-biocycle/
│
├── app.py                  # Punto de entrada — configura Streamlit, sidebar y enruta a cada vista
├── data.py                 # Datos científicos: microorganismos, contaminantes, papers
├── ml_model.py             # Modelo ML (Gradient Boosting Regressor) para predicción de éxito
│
├── views/                  # ⚠️ Carpeta de vistas — NO renombrar a "pages/" (Streamlit lo detectaría como rutas)
│   ├── inicio.py           # Landing page principal
│   ├── descubrimientos.py  # Feed de descubrimientos científicos
│   ├── disenador.py        # Diseñador de consorcios (Construye tu Consorcio)
│   ├── portal_cliente.py   # Portal empresarial (Gestiona tus Residuos)
│   └── asesoria_ia.py      # Chat de asesoría IA
│
├── static/                 # Archivos estáticos servidos por Streamlit en /app/static/
│   └── hero.png            # Imagen de marca del hero (NO reemplazar sin actualizar el CSS)
│
└── .streamlit/
    └── config.toml         # Configuración: puerto, tema, static serving
```

**Archivos en la raíz del workspace:**
```
artifact.toml     # Configuración de artefactos Replit (no modificar manualmente)
```

---

## Cómo correr la app localmente

### Prerequisitos

- Python 3.11+
- pip

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/maorozco/impulso-biocycle.git
cd impulso-biocycle

# 2. Instalar dependencias
pip install streamlit plotly pandas scikit-learn streamlit-lottie

# 3. Ir a la carpeta de la app
cd artifacts/impulso-biocycle

# 4. Correr la app
streamlit run app.py --server.port 5000 --server.address 0.0.0.0
```

La app abre en `http://localhost:5000`

---

## Cómo contribuir sin romper nada

### Para agregar o modificar una página existente

1. Edita el archivo correspondiente en `artifacts/impulso-biocycle/views/`
2. Cada vista tiene una función `render()` — no cambies el nombre de esa función
3. Prueba que la navegación desde el sidebar sigue funcionando

### Para agregar una nueva página

1. Crea un nuevo archivo en `views/`, por ejemplo `views/mi_pagina.py`
2. Define la función `render()` dentro
3. Abre `app.py` y agrega el nombre al array `NAV_PAGES`
4. Agrega el `elif` correspondiente al bloque de enrutamiento

Ejemplo mínimo de una vista nueva:

```python
# views/mi_pagina.py
import streamlit as st

def render():
    st.markdown("""
    <div class="hero-section">
        <div class="hero-title">Mi Página</div>
    </div>
    """, unsafe_allow_html=True)
    
    st.write("Contenido aquí")
```

### Para modificar datos científicos

Los datos de microorganismos, contaminantes y papers están en `data.py`. Agrega entradas siguiendo el mismo formato de diccionario existente. No elimines campos — el diseñador y el modelo ML dependen de ellos.

### Para modificar el modelo ML

El modelo está en `ml_model.py`. Actualmente usa un `GradientBoostingRegressor` entrenado con 43 muestras. Si agregas datos de entrenamiento, mantén las mismas features de entrada.

---

## Reglas críticas de diseño

Estas reglas existen por razones técnicas o científicas. **No romperlas:**

### 1. La carpeta de vistas se llama `views/`, no `pages/`
Streamlit detecta automáticamente una carpeta llamada `pages/` y la convierte en navegación multi-página nativa, rompiendo el sistema de navegación manual del sidebar. La carpeta **siempre debe llamarse `views/`**.

### 2. Solo microorganismos BSL-1 o GRAS
Nunca usar *Pseudomonas aeruginosa* ni ningún organismo de nivel de bioseguridad BSL-2 o superior. La plataforma garantiza que todas las recomendaciones son de uso seguro sin instalaciones especializadas.

### 3. El CSS global va en `app.py`
El CSS del sidebar, las clases `.hero-section`, `.discovery-card`, `.result-section`, etc. están definidos en `app.py` y aplican globalmente. Si una vista necesita estilos adicionales, los define localmente al inicio de su función `render()`.

### 4. Los archivos estáticos van en `static/` y se referencian como `/app/static/`
Streamlit sirve la carpeta `static/` en la ruta `/app/static/`. No usar rutas relativas ni paths de sistema de archivos en atributos `src` o `url()` de CSS.

### 5. La navegación usa `session_state`
La app usa `st.session_state["nav_page"]` para navegación programática (por ejemplo, desde el botón CTA del home). Si agregas botones que deben navegar a otra página, sigue el mismo patrón:
```python
st.session_state["nav_page"] = "🧬 Construye tu Consorcio"
st.rerun()
```

---

## Paleta de colores y estilo

| Variable | Hex | Uso |
|----------|-----|-----|
| Verde profundo | `#004D2C` | Fondos oscuros, tarjetas principales, footer |
| Verde medio | `#006633` | Sidebar, secciones secundarias |
| Verde brillante | `#00C853` | Bordes de tarjetas, acentos primarios |
| Cian eléctrico | `#00D9F5` | Botones CTA, números de métricas, badges |
| Amarillo-lima | `#C4FF00` | Highlights sutiles |
| Blanco | `#FFFFFF` | Texto sobre fondos oscuros |

**Fuente:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

**Sin emojis** en títulos, tarjetas ni botones — la interfaz usa tipografía y color para jerarquía visual.

---

## Modelo de Machine Learning

- **Algoritmo:** Gradient Boosting Regressor (scikit-learn)
- **Features de entrada:** tipo de contaminante, subtipo, temperatura, pH, % contaminación mixta
- **Output:** probabilidad de éxito de degradación (0–100%)
- **Datos de entrenamiento:** 43 casos documentados en literatura científica
- **Archivo:** `ml_model.py`

El modelo se entrena al iniciar la app (no hay archivo `.pkl` guardado). Si modificas `ml_model.py`, asegúrate de que la función de predicción siga devolviendo un número entre 0 y 100.

---

## Datos científicos

- **847** microorganismos catalogados (BSL-1/GRAS únicamente)
- **2,000+** papers indexados como base de conocimiento
- **Fuentes:** Nature, Science, ACS Catalysis, Springer, PNAS, PubMed Central, Addgene
- Los datos están hardcodeados en `data.py` — actualizaciones requieren editar ese archivo directamente

---

## Equipo

Desarrollado para **Red Bull Basement** — Colombia 🇨🇴

---

*Impulso BioCycle © 2026*
