import Link from 'next/link';
import { BiocycleImage } from '@/components/biocycle/biocycle-image';

export const metadata = {
  title: 'Inicio · Impulso BioCycle',
};

export default function InicioPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-inner">
          <div className="rise">
            <Link className="hero-tag" href="/biocycle/portal?tab=escucha" data-testid="hero-nuevo-link">
              <span className="t-badge">NUEVO</span>
              <span>Escucha Activa — dolor verbatim del mercado, 4,797 posts</span>
              <svg className="t-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>

            <h1>
              Diseñamos la <em>receta microbiana</em>
              <br />
              <span className="accent">óptima</span> para degradar un
              <br />
              contaminante específico.
            </h1>

            <p className="hero-lede">
              Impulso BioCycle es la plataforma de IA que diseña consorcios
              de bacterias y hongos BSL‑1/GRAS para biorremediación — apoyada
              en 4,797 referencias peer‑reviewed y 33 contaminantes modelados.
            </p>

            <div className="cta-row">
              <Link className="btn btn-primary" href="/biocycle/disenador">
                Construye tu Consorcio
                <span className="arr">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
              <Link className="btn btn-ghost" href="/biocycle/portal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                </svg>
                Gestiona tus Residuos
              </Link>
            </div>

            <div className="hero-meta">
              <span><b>BSL‑1 / GRAS</b> sólo</span>
              <span className="sep">·</span>
              <span><b>33</b> contaminantes modelados</span>
              <span className="sep">·</span>
              <span><b>Bogotá</b> → LATAM</span>
            </div>
          </div>

          <HeroViz />
        </div>
      </section>

      <section className="section container tight">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">01 · ¿Qué es?</div>
            <h2>Una alternativa a excavar, transportar y enterrar.</h2>
          </div>
          <p className="lede">
            Cuando una empresa tiene suelo con hidrocarburos o una planta vierte
            colorantes azo, el camino convencional es costoso y fisicoquímico.
            BioCycle diseña la receta biológica — y predice su desempeño.
          </p>
        </div>

        <div className="value-grid">
          <article className="value-cell">
            <div className="v-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3-8 3 8M6 11h12M8 21l2-10M16 21l-2-10"/></svg></div>
            <div className="v-num">01 / Diseño</div>
            <h3>Consorcio óptimo por sitio</h3>
            <p>4 microorganismos con proporción, rol y rango de tolerancia — ajustados a temperatura, pH y contaminación mixta del sitio real.</p>
          </article>
          <article className="value-cell">
            <div className="v-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18M7 14l4-4 3 3 5-6"/></svg></div>
            <div className="v-num">02 / Predicción</div>
            <h3>Curva de degradación</h3>
            <p>Predicción de degradación de consorcio vs. método convencional y atenuación natural, con citaciones a papers y tooltips cuantitativos.</p>
          </article>
          <article className="value-cell">
            <div className="v-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v6m0 8v6M2 12h6m8 0h6M5 5l4 4m6 6l4 4M5 19l4-4m6-6l4-4"/></svg></div>
            <div className="v-num">03 / Protocolo</div>
            <h3>Cápsula + despliegue</h3>
            <p>Formulación de cápsula, pasos de preparación, proveedor local y cronograma de monitoreo para el piloto.</p>
          </article>
        </div>
      </section>

      <section className="section container tight">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">02 · Dos caminos, un objetivo</div>
            <h2>Laboratorios diseñan. Empresas cotizan.</h2>
          </div>
          <p className="lede">
            Dos productos distintos sobre el mismo motor de IA. Ambos parten del
            mismo corpus de 4,797 referencias y los mismos 28 microorganismos aprobados.
          </p>
        </div>

        <div className="paths">
          <article className="path lab">
            <div className="p-glow" />
            <span className="p-tag">B2C</span>
            <div className="p-cover bc-img-wrap">
              <BiocycleImage
                id="path-lab"
                alt="Científica de laboratorio examinando un fermentador con biomasa teal"
                width={1080}
                height={1350}
                sizes="(max-width: 768px) 100vw, 440px"
              />
            </div>
            <div className="p-head">
              <div className="p-badge"><span className="dot" /> Laboratorio</div>
              <div className="p-role">Para investigadores</div>
            </div>
            <h3>Construye tu Consorcio</h3>
            <p className="p-desc">
              Wizard de 3 pasos con selector de 33 contaminantes, condiciones del entorno y validación de compatibilidad. Diseñado para papers, tesis y pilotos académicos.
            </p>
            <ul className="p-list">
              {['Matriz de compatibilidad entre 4 especies','Probabilidad de éxito con gauge animado','Citación exportable a BibTeX · DOIs'].map((i) => (
                <li key={i}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l4 4L19 7"/></svg>{i}</li>
              ))}
            </ul>
            <Link className="p-cta" href="/biocycle/disenador">Abrir diseñador<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
          </article>

          <article className="path biz">
            <div className="p-glow" />
            <span className="p-tag">B2B</span>
            <div className="p-cover bc-img-wrap">
              <BiocycleImage
                id="path-biz"
                alt="Biorreactor modular contenido instalado junto a tanques de refinería al atardecer"
                width={1080}
                height={1350}
                sizes="(max-width: 768px) 100vw, 440px"
              />
            </div>
            <div className="p-head">
              <div className="p-badge"><span className="dot" /> Empresa</div>
              <div className="p-role">Para HSEQ / Remediation PM</div>
            </div>
            <h3>Gestiona tus Residuos</h3>
            <p className="p-desc">
              Cotiza por tipo de operación, país y volumen. Obtén plan, inversión mensual, ROI, CO₂ evitado y mapeo a ANLA · EPA · Res. 631/2015.
            </p>
            <ul className="p-list">
              {['Escucha Activa: 4,797 posts clasificados','Caso ilustrativo: Refinería Andina S.A.','Piloto 90 días — costo sujeto a alianza con laboratorio o industria productora de biológicos'].map((i) => (
                <li key={i}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l4 4L19 7"/></svg>{i}</li>
              ))}
            </ul>
            <Link className="p-cta" href="/biocycle/portal">Cotizar operación<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
          </article>
        </div>
      </section>

      <section className="section container tight">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">03 · Problemas que resolvemos</div>
            <h2>El costo de no actuar es más alto que el piloto.</h2>
          </div>
          <p className="lede">Cifras actuales del mercado LATAM y global que enmarcan por qué la biorremediación basada en datos es el siguiente paso.</p>
        </div>

        <div className="problems">
          <article className="prob p1">
            <div className="p-cat">Residuos · Colombia</div>
            <div className="p-stat">11.6<span className="u">M t/año</span></div>
            <div className="p-headline">Residuos sólidos sin tratamiento</div>
            <div className="p-body">Solo 17% se aprovecha; el resto termina en rellenos al borde de su vida útil regulatoria.</div>
            <div className="p-src">Fuente · Supersevicios 2024</div>
          </article>
          <article className="prob p2">
            <div className="p-cat">Hidrocarburos</div>
            <div className="p-stat">3.8<span className="u">M t/año</span></div>
            <div className="p-headline">Suelos contaminados global</div>
            <div className="p-body">Derrames y operación crónica. Mercado de remediación: USD $110 B proyectado al 2030.</div>
            <div className="p-src">Fuente · USEPA · Grand View</div>
          </article>
          <article className="prob p3">
            <div className="p-cat">Textiles</div>
            <div className="p-stat">20<span className="u">%</span></div>
            <div className="p-headline">De la contaminación hídrica industrial</div>
            <div className="p-body">Colorantes azo resistentes. Tratamiento fisicoquímico costoso; la vía biológica reduce lodos.</div>
            <div className="p-src">Fuente · UN Environment 2019</div>
          </article>
          <article className="prob p4">
            <div className="p-cat">Regulación</div>
            <div className="p-stat">2027<span className="u"> · deadline</span></div>
            <div className="p-headline">Cierre de rellenos en LATAM</div>
            <div className="p-body">13 de las 32 capitales sin plan B. Presión regulatoria crea ventana de adopción para vías biológicas.</div>
            <div className="p-src">Fuente · BID, 2024</div>
          </article>
        </div>
      </section>

      <section className="section container tight">
        <div className="section-head">
          <div className="left">
            <div className="eyebrow">04 · Cómo funciona</div>
            <h2>De contaminante a cápsula desplegable en tres pasos.</h2>
          </div>
          <Link className="btn btn-ghost" href="/biocycle/disenador" style={{ height: 36 }} data-testid="hero-demo-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 5v14l11-7z" /></svg>
            Abrir demo interactiva
          </Link>
        </div>

        <div className="steps">
          <article className="step featured">
            <div className="s-num"><span className="bullet">01</span> Describe el sitio</div>
            <h3>Contaminante · condiciones · volumen</h3>
            <p>33 subtipos organizados en 7 categorías. Condiciones de campo: temperatura, pH, medio, mezcla, volumen a tratar.</p>
            <div className="s-vis">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="chip"><span className="dot" />Hidrocarburo · TPH</span>
                  <span className="chip info"><span className="dot" />In-situ suelo</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="chip">pH 6.8</span>
                  <span className="chip">28 °C</span>
                  <span className="chip">120 m³</span>
                  <span className="chip warn"><span className="dot" />Mixto 12%</span>
                </div>
              </div>
            </div>
          </article>

          <article className="step">
            <div className="s-num"><span className="bullet">02</span> Motor de diseño</div>
            <h3>ML + verificación de compatibilidad</h3>
            <p>Crunching sobre 4,797 referencias, filtros BSL‑1/GRAS y predicción de degradación con intervalos de confianza.</p>
            <div className="s-vis">
              <svg viewBox="0 0 260 80" style={{ width: '100%', height: 70 }}>
                <defs>
                  <linearGradient id="curveG" x1="0" x2="1"><stop offset="0" stopColor="#00C853" /><stop offset="1" stopColor="#00D9F5" /></linearGradient>
                </defs>
                <path d="M4 70 Q 70 55 120 30 T 256 12" fill="none" stroke="url(#curveG)" strokeWidth="2" />
                <path d="M4 70 Q 70 55 120 30 T 256 12 L 256 74 L 4 74 Z" fill="url(#curveG)" opacity="0.12" />
                <g fontFamily="Geist Mono, monospace" fontSize="9" fill="#6A8A74">
                  <text x="4" y="10">degradación</text>
                  <text x="230" y="10" fontWeight="500" fill="#1B4332">78%</text>
                </g>
                <g stroke="#E2ECE5" strokeDasharray="2 3"><line x1="4" y1="36" x2="256" y2="36" /></g>
              </svg>
            </div>
          </article>

          <article className="step">
            <div className="s-num"><span className="bullet">03</span> Cápsula + protocolo</div>
            <h3>Receta, costo y plan de monitoreo</h3>
            <p>Alginato de sodio · proveedor local · 5 pasos de preparación · cronograma de muestreo semanal para el piloto de 90 días.</p>
            <div className="s-vis">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: 9.5 }}>Costo / cápsula</div>
                  <div className="display-num" style={{ fontSize: 26, color: 'var(--forest-deep)', marginTop: 4 }}>$0.0008</div>
                </div>
                <div>
                  <div className="eyebrow" style={{ fontSize: 9.5 }}>Éxito previsto</div>
                  <div className="display-num" style={{ fontSize: 26, color: 'var(--forest-deep)', marginTop: 4 }}>52%</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section container">
        <div className="metrics">
          <div className="metric"><div className="m-label">Microorganismos</div><div className="m-num">28</div><div className="m-sub">BSL‑1 / GRAS curados</div></div>
          <div className="metric"><div className="m-label">Referencias</div><div className="m-num">4,797</div><div className="m-sub">Peer‑reviewed · 2019–2025</div></div>
          <div className="metric"><div className="m-label">Contaminantes</div><div className="m-num">33</div><div className="m-sub">En 7 categorías</div></div>
          <div className="metric"><div className="m-label">Cobertura</div><div className="m-num">30+</div><div className="m-sub">Países referenciados</div></div>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="brand-mark" style={{ width: 32, height: 32 }} />
              <div>
                <div className="brand-name" style={{ fontSize: 15 }}>Impulso BioCycle</div>
                <div className="brand-sub">Accelerating the Natural Cycle through Intelligence</div>
              </div>
            </div>
            <p>Plataforma de IA para biorremediación basada en datos. Bogotá · operando en LATAM.</p>
          </div>
          <div className="footer-col">
            <h5>Producto</h5>
            <Link href="/biocycle/disenador">Construye tu Consorcio</Link>
            <Link href="/biocycle/portal">Gestiona tus Residuos</Link>
            <Link href="/biocycle/asesoria">Asesoría IA</Link>
            <Link href="/biocycle/descubrimientos">Descubrimientos</Link>
          </div>
          <div className="footer-col"><h5>Empresa</h5><a href="#">Sobre · Pivote A+C</a><a href="#">Piloto 90 días</a><a href="#">Lab aliado</a><a href="#">Contacto</a></div>
          <div className="footer-col"><h5>Legal</h5><a href="#">Disclaimer científico</a><a href="#">ANLA · Res. 631/2015</a><a href="#">EPA compliance</a><a href="#">Privacidad</a></div>
        </div>
        <div className="container legal">
          <div className="disclaimer">
            BioCycle diseña recetas microbianas — no fabrica ni comercializa los microorganismos.
            Todo trabajo se realiza dentro de biorreactores contenidos o cápsulas de alginato in‑situ,
            con microorganismos BSL‑1/GRAS. TRL del sistema integrado: 3–4. Estimaciones basadas en literatura peer‑reviewed.
            <br /><br />
            Estamos abiertos a alianzas con laboratorios e industrias que fabriquen el mix biológico como estrategia win-win.
            Esta plataforma también recibe retroalimentación técnica — si detectas una inconsistencia o quieres contribuir
            evidencia, escríbenos a <a href="mailto:hola@biocycle.ai" style={{ color: 'var(--forest-deep)', textDecoration: 'underline' }}>hola@biocycle.ai</a>.
          </div>
          <div>© 2026 Impulso BioCycle · Bogotá, Colombia</div>
        </div>
      </footer>
    </>
  );
}

function HeroViz() {
  return (
    <div className="hero-viz">
      <div className="bc-img-wrap">
        <BiocycleImage
          id="hero-inicio"
          alt="Cápsula de alginato translúcida con un consorcio de bacterias y hongos en su interior, iluminada por luz cálida"
          width={1920}
          height={1080}
          priority
          sizes="(max-width: 960px) 100vw, 540px"
        />
      </div>
    </div>
  );
}
