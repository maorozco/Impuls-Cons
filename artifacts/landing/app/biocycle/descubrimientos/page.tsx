import { DescubrimientosFeed, type Paper } from '@/components/biocycle/descubrimientos-feed';
import { BiocycleImage } from '@/components/biocycle/biocycle-image';

export const metadata = {
  title: 'Descubrimientos · Impulso BioCycle',
  description: 'Feed curado de 10 papers peer-reviewed que sustentan los consorcios recomendados.',
};

/**
 * The 10 curated discoveries that back each consortium recommendation.
 *
 * Data copied verbatim from design-source/Descubrimientos.html (source of truth for
 * the page content) and validated against artifacts/impulso-biocycle/data.py
 * DISCOVERIES list. When Python changes, run `./scripts/gen-data-ts.py` and
 * then re-check this file against the new TS constants.
 */
const PAPERS: Paper[] = [
  {
    id: '1',
    category: 'Plásticos',
    catSlug: 'plastic',
    year: 2022,
    journal: 'Nature',
    institution: 'UT Austin',
    authors: 'Lu et al.',
    title:
      'FAST-PETase degrada PET hasta un 90% en 24 horas a 50 °C — rediseño por ML de la enzima natural.',
    body:
      'Mutaciones guiadas por modelos predictivos producen una PETasa estable a temperatura moderada que despolimeriza botellas post-consumo en horas, no semanas. Base del módulo biorreactor enzimático del pivote A+C.',
    result: '90% en 24 h a 50 °C',
    resultDetail:
      'la PETase comercial original llegaba al 10% en 7 días. Monómeros resultantes (TPA + EG) vendibles a $800–1,600/ton',
    doi: '10.1038/s41586-022-04599-z',
    doiVerified: true,
    featured: true,
  },
  {
    id: '2',
    category: 'Plásticos',
    catSlug: 'plastic',
    year: 2020,
    journal: 'Carbios',
    institution: 'Science',
    authors: 'Tournier et al.',
    title: 'LCC-ICCG: cutinasa optimizada despolimeriza 90% de botellas de PET en 10 h.',
    body:
      'Proceso industrial a escala piloto en Clermont-Ferrand. Monómeros reutilizables en resina virgen.',
    result: '90% / 10 h · scale-up 20 m³',
    resultDetail: 'competencia directa del módulo biorreactor',
    doi: '10.1038/s41586-020-2149-4',
    doiVerified: true,
  },
  {
    id: '3',
    category: 'Hidrocarburos',
    catSlug: 'hydro',
    year: 2023,
    journal: 'Env. Sci. Technol.',
    institution: 'ETH Zürich',
    authors: 'Müller et al.',
    title:
      'Consorcio Pseudomonas+Rhodococcus encapsulado degrada TPH a −78% en 90 días in-situ.',
    body:
      'Campo experimental con suelo de refinería clausurada; cápsulas de alginato 2–4 mm con liberación sostenida.',
    result: '−78% TPH / 90 d',
    resultDetail: 'protocolo casi idéntico al de nuestro piloto referencia',
    doi: '10.1021/acs.est.3c00512',
    doiVerified: false,
  },
  {
    id: '4',
    category: 'PFAS',
    catSlug: 'pfas',
    year: 2024,
    journal: 'Nature Microbiol.',
    institution: 'UC Berkeley',
    authors: 'Chen et al.',
    title:
      'Acidimicrobium sp. A6 defluorina PFOS en anaeróbicos — primera vía biológica reportada.',
    body: 'Liberación de F⁻ confirmada en 100 días; aplicable a columnas de agua municipales.',
    result: '60% defluorinación / 100 d',
    resultDetail: 'BSL-1, sin ingeniería genética',
    doi: '10.1038/s41564-024-01627-8',
    doiVerified: true,
  },
  {
    id: '5',
    category: 'Textiles',
    catSlug: 'textile',
    year: 2021,
    journal: 'PNAS',
    institution: 'IIT Delhi',
    authors: 'Sharma et al.',
    title: 'Trametes versicolor inmovilizado decolora 95% de colorantes azo en 72 h.',
    body:
      'Laccasas extracelulares en reactor de lecho empacado; reduce DQO 70% en efluente textil real.',
    result: '95% / 72 h',
    resultDetail: 'reactor fijo, 18 ciclos sin perder actividad',
    doi: '10.1073/pnas.2103498118',
    doiVerified: false,
  },
  {
    id: '6',
    category: 'Pesticidas',
    catSlug: 'pest',
    year: 2022,
    journal: 'Env. Sci. Technol.',
    institution: 'EPFL',
    authors: 'Berger et al.',
    title:
      'Sphingomonas sp. mineraliza atrazina a CO₂ y NH₃ en suelo agrícola contaminado.',
    body:
      'Ruta AtzA-F completa verificada por LC-MS; compatible con siembra directa de maíz 60 días post-aplicación.',
    result: '95% mineralización / 45 d',
    resultDetail: 'compatible BSL-1',
    doi: '10.1021/acs.est.2c01134',
    doiVerified: false,
  },
  {
    id: '7',
    category: 'Minería',
    catSlug: 'mining',
    year: 2023,
    journal: 'Bioresour. Technol.',
    institution: 'U. Nacional Colombia',
    authors: 'Ramírez et al.',
    title:
      'Consorcio sulfato-reductor remueve Hg(II) en lixiviados de minería a pequeña escala.',
    body:
      'Reactor UASB piloto en Antioquia; paso clave para adoptar en relaves post-OFAC.',
    result: '−92% Hg / 21 d',
    resultDetail: 'precipitado como HgS estable',
    doi: '10.1016/j.biortech.2023.128421',
    doiVerified: false,
  },
  {
    id: '8',
    category: 'Hidrocarburos',
    catSlug: 'hydro',
    year: 2019,
    journal: 'Appl. Environ. Microbiol.',
    institution: 'U. São Paulo',
    authors: 'Silva et al.',
    title:
      'Alcanivorax borkumensis degrada hidrocarburos de cadena larga en condiciones marinas simuladas.',
    body:
      'Referencia clásica del taxonomy BSL-1 en derrames marinos; NO aplicamos en campo abierto, sí en modelado de rutas.',
    result: 'n-C₂₀ → 80% / 14 d',
    resultDetail: 'citado en nuestra base de datos interna',
    doi: '10.1128/AEM.01893-19',
    doiVerified: false,
  },
  {
    id: '9',
    category: 'Suelos',
    catSlug: 'soil',
    year: 2024,
    journal: 'Soil Biol. & Biochem.',
    institution: 'Wageningen',
    authors: 'van Dijk et al.',
    title:
      'Micorrizas arbusculares + consorcio bacteriano rehabilitan pastizales degradados por sobrepastoreo.',
    body:
      'Marco complementario para recuperación post-biorremediación; cierra el ciclo "degradación → regeneración".',
    result: '+38% C orgánico / 2 años',
    resultDetail: 'sin fertilización sintética',
    doi: '10.1016/j.soilbio.2024.109312',
    doiVerified: true,
  },
  {
    id: '10',
    category: 'Plásticos',
    catSlug: 'plastic',
    year: 2025,
    journal: 'Science',
    institution: 'NREL',
    authors: 'Beckham et al.',
    title: 'Tándem enzimático PET→TPA→Vanilina upcyclea botellas a químicos de alto valor.',
    body:
      'Prueba de concepto del pivote "monómeros como producto" — no sólo degradar, sino generar insumos con markup.',
    result: 'TPA→Vanilina · 79% rendimiento',
    resultDetail: 'vanilina a $20–30/kg vs. $1.5/kg TPA',
    doi: '10.1126/science.ade1621',
    doiVerified: false,
  },
];

export default function DescubrimientosPage() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="bc-img-wrap bc-hero-banner">
            <BiocycleImage
              id="hero-descubrimientos"
              alt="Papers científicos fanned-out sobre felt verde bosque con muestra de biofilm"
              width={1920}
              height={1080}
              priority
              sizes="(max-width: 960px) 100vw, 1200px"
            />
          </div>
        </div>
        <div className="container ph-inner">
          <div>
            <div
              className="eyebrow"
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}
            >
              <span
                style={{
                  width: 18,
                  height: 1,
                  background: 'var(--forest-deep)',
                  display: 'inline-block',
                }}
              />
              Feed peer-reviewed
            </div>
            <h1>
              Los <em>papers</em> que sustentan
              <br />
              cada consorcio que recomendamos.
            </h1>
          </div>
          <p className="ph-lede">
            10 descubrimientos curados de Nature, Science, PNAS y Environmental Science &amp;
            Technology — la base científica detrás del motor.
          </p>
        </div>
        <div className="container">
          <div className="stats-row">
            <div className="stat-box">
              <div className="sb-label">Descubrimientos</div>
              <div className="sb-num">10</div>
              <div className="sb-sub">Curados · actualizados semanalmente</div>
            </div>
            <div className="stat-box">
              <div className="sb-label">DOI en vivo</div>
              <div className="sb-num">4/10</div>
              <div className="sb-sub">
                El resto está en reverificación tras validación 2026-04
              </div>
            </div>
            <div className="stat-box">
              <div className="sb-label">Categorías</div>
              <div className="sb-num">7</div>
              <div className="sb-sub">
                Plásticos · Hidrocarburos · PFAS · Textiles · Pesticidas · Minería · Suelos
              </div>
            </div>
            <div className="stat-box">
              <div className="sb-label">Años cubiertos</div>
              <div className="sb-num">2019–2025</div>
              <div className="sb-sub">Ventana de evidencia moderna</div>
            </div>
          </div>
        </div>
      </section>

      <DescubrimientosFeed papers={PAPERS} />
    </>
  );
}
