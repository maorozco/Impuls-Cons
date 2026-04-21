# Consortia Validation — Multi-Agent Findings

> Sintetizado de 4 research agents paralelos (Apr 21). Se actualiza conforme completan.
> **Estado:** Agente 1 ✓ · Agentes 2/3/4 en curso.

## Agent 1 · Hydrocarbons (Pseudomonas + Rhodococcus base)

### Correcciones CRÍTICAS

1. **`Bacillus subtilis 168` → cambiar en TODOS los consorcios**. El strain 168 es lab-domesticated con frameshift en `sfp` → NO produce surfactina. Sustituir por:
   - `Bacillus subtilis ATCC 21332` (surfactin producer canónico)
   - `Bacillus subtilis OKB105` (sfp+)
   - `Bacillus subtilis natto` (GRAS, sfp+)

2. **Lead species por contaminante** (no reusar un solo consorcio):
   - **TPH general** → `P. putida KT2440` ok como lead
   - **BTEX** → `P. putida F1` (tod operon, gold standard)
   - **PAH livianos (naftaleno, fenantreno)** → `P. putida G7` (NAH7 plasmid) o elevar `R. jostii RHA1` a 35-40%
   - **Aceites lubricantes (>C20)** → `R. erythropolis` o `Acinetobacter baylyi ADP1`
   - **Diesel dominante** → consorcio actual con fix sfp+
   - **Gasolina dominante** → usar lead F1 (BTEX), drop Trichoderma

3. **Trichoderma harzianum para BTEX/gasolina → REJECT**. Volatilidad > uptake fúngico.
   - Para PAH pesados, considerar `Pleurotus ostreatus` (BSL-1) en vez de Trichoderma.

4. **Calibración del 75% en 12 semanas**: plausible en lab/mesocosmo, field real 30-55%. Mantener número pero agregar banda "lab/mesocosm" vs "field realistic".

### Citaciones clave
- Belda et al., *Environ Microbiol* 2016 (KT2440 genome)
- Nikel & de Lorenzo, *Metab Eng* 2018 (KT2440 chassis)
- McLeod et al., *PNAS* 2006 (Rhodococcus jostii RHA1 genome)
- Koshlaf & Ball, *AIMS Microbiol* 2017 (meta-analysis TPH)
- Varjani, *Bioresource Technol* 2017 (field vs lab TPH)
- Habe & Omori, *Biosci Biotechnol Biochem* 2003 (naphthalene pathways)
- Ghosal et al., *Front Microbiol* 2016 (PAH degradation)
- Auffret et al., *Microb Biotechnol* 2015 (diesel Rhodococcus)
- Laczi et al., *Front Microbiol* 2020 (used oil Acinetobacter)

### Impacto en consortia-rules.ts
- Separar `HC_CONSORTIUM` en al menos 3 variants: `TPH_SOIL`, `BTEX_VOLATILE`, `PAH_HEAVY` (o solo cambiar lead species + proportions)
- Cambiar `Bacillus subtilis 168` → `Bacillus subtilis ATCC 21332` globalmente
- Documentar strain exacto (pWW0+, NAH7+, sfp+) en el campo `species` (e.g. `Pseudomonas putida F1 (tod+)`)

---

## Agent 2 · Textiles + Water Treatment

### Correcciones CRÍTICAS
1. **Strain specificity obligatoria** — `Pseudomonas fluorescens` sin strain es ambiguo (siblings clínicos pueden ser BSL-2). Especificar:
   - `Pseudomonas fluorescens Pf-5` (ATCC BAA-477) o `SBW25`
   - `Bacillus subtilis 168` → `B. subtilis ZWL` o `SHS 0133` para textile (168 no es el mejor azo-degrader)
   - `Aspergillus niger` → confirmar strain non-ochratoxigenic (ATCC 1015 o CBS 513.88)
2. **Regime anaerobic→aerobic** para azo dyes — azoreductasa bacteriana necesita microaerofilia; fungal peroxidasa aerobia. Agregar campo `regime` a consortia: `sequential` / `co-culture` / `compartmentalized`. Actualmente se presentan como co-culture, lo cual es termodinámicamente inconsistente.
3. **Case 6 (textile DQO >1500)**: CONSORTIO ACTUAL NO APLICA. `T. versicolor` no degrada sizing agents + surfactantes + PVA. Construir hybrid: Trametes 30% + B. licheniformis 25% + P. putida 25% + A. niger 20%.
4. **Metales pesados**: disclaimer obligatorio "bioabsorción ≠ mineralización · biomasa cargada = residuo Clase I". Considerar agregar `Cupriavidus necator H16` (BSL-1, gold standard Cr(VI)→Cr(III), permite narrativa de co-producción de PHA bioplástico).
5. **Mature leachate pH >8** — flag para pH adjustment upstream.

### Citaciones clave
- Legerská et al., 2018 (Trametes laccase azo)
- Chmelová et al., 2024 (laccase decolorización)
- Nikel & de Lorenzo, 2018 (KT2440)
- Si et al., 2013 / Iark et al., 2019 (antraquinona)
- Kurniawan et al., 2021 (B. licheniformis leachate)
- Dusengemungu et al., 2020 (A. niger chelation metales)
- Machado et al., 2020 (EPS Pb binding)

### Verdict
- Todos BSL-1/GRAS (✓ rule #2)
- 86% azo en 6 sem conservador (literatura dice 80-95% en 2-4 sem)
- Swap `A. tubingensis` → `A. niger` (ver Agent 3)

---

## Agent 3 · Pesticides + Mining

### Correcciones CRÍTICAS (IMPACTO ALTO)

1. **`Aspergillus tubingensis` → REJECT GLOBAL** · produce ochratoxina A + fumonisinas en varias cepas. NO es GRAS. Swap por `A. niger` (true GRAS) o `Trametes versicolor`/`Pleurotus ostreatus`. Afecta: Glifosato, Mercurio.

2. **`Bacillus subtilis 168` en Atrazina → REJECT** · strain 168 es lab workhorse, NO es atrazine-degrader. Sustituir por `Arthrobacter aurescens TC1` (textbook atrazine mineralizer, BSL-1; Strong et al. 2002).

3. **Organoclorados (DDT, lindano) → REJECT fallback a Glifosato consortium**. Requieren pathways de dehalogenación ausentes. Consorcio correcto:
   - `Sphingobium indicum B90A` (lin operon, 35%)
   - `Sphingomonas paucimobilis` (25%)
   - `Pseudomonas fluorescens Pf-5` (20%)
   - `Phanerochaete chrysosporium` (20%) — white-rot fungi para DDT
   - Expected 50-75% en 16 sem (más bajo que glifosato)

4. **Cianuro → REJECT fallback a Hg consortium**. Enzimas totalmente diferentes (cyanide hydratase, cyanidase, nitrilase, rhodanese). Consorcio correcto:
   - `Pseudomonas putida` con `cynS` cyanase
   - `Bacillus pumilus C1`
   - `Trichoderma` spp. (cyanide hydratase)

5. **Drenaje ácido (AMD pH 2-4) → REJECT ENTIRELY**. Organismos del Hg consortium mueren <pH 5. Requiere acidófilos:
   - `Acidithiobacillus ferrooxidans` / `thiooxidans` (BSL-1, sulfide oxidation)
   - SRB anaeróbicas (`Desulfovibrio desulfuricans`) en bioreactor pasivo
   - **Recomendación**: marcar AMD como "fuera de scope v1" (engineering-heavy, TRL mismatch) o exponerlo solo con engineering partner.

6. **Hg case — contención obligatoria**. Volatilización Hg²⁺→Hg⁰ NO es remoción, emite atmósfera. Reframe: "reduce biodisponibilidad Hg²⁺, requiere trap en bioreactor sealed". Viola rule #7 (in-situ cápsulas) si se aplica open.

7. **As case — mecanismo honesto**. As(V) < As(III) en toxicidad, pero AÚN soluble. Oxidación sola ≠ remoción. Requiere co-precipitación Fe + sorción en biomasa.

8. **Strain "Bs-15" en Glifosato**: verificar con PubMed — puede ser vendor label sin paper.

### Lo que está bien
- **Glifosato y Atrazina son los casos más fuertes** (con los swaps arriba). Usar de lead en demos.
- `Pseudomonas sp. ADP` en Atrazina = gold standard (atzA/B/C documented).
- `Bacillus megaterium` mer operon en Hg = documented.
- 78% glifosato en 16 sem = realista lab (field 40-70%, agregar banda).

### Citaciones clave
- Zhan et al. 2018, *Chemosphere* (B. subtilis C-P liasa)
- Pérez-Pantoja et al. 2020 (Lysinibacillus sphaericus glifosato)
- Manogaran et al. 2021 (L. sphaericus strain OT4b.31)
- Martinez et al. 2001 (Pseudomonas ADP atzA)
- Strong et al. 2002 (Arthrobacter aurescens TC1 atrazine)
- Lal et al. 2010 (Sphingobium B90A lindane)
- Ortíz-Hernández et al. 2018 (DDT biodegradation)
- Mahbub et al. 2017 (B. megaterium mer operon)
- Luque-Almagro et al. 2005 (cynS cyanase)
- Sánchez-Andrea et al. 2014 (SRB AMD)

## Agent 4 · Plastics + Pharma + PFAS
*(pending)*

---

## Acción inmediata mientras esperan los agentes

1. **Cambio global**: `Bacillus subtilis 168` → `Bacillus subtilis ATCC 21332` en todo el file (appears in HC, AZO, LIXIVIADO, ATRAZINA, HG, AS, PLASTIC, PHARMA — 8 consorcios).
2. **Anotar strain canónico** por lead species: `P. putida KT2440 (alkB+)`, `R. jostii RHA1`, etc.
3. **Fix visual** del gauge (34% montado sobre la curva) — YA HECHO en disenador.css.
4. **Visual differentiation** para que el usuario vea que el consorcio ES diferente: highlight el "signature species" (la que es única de esa combinación) y dar tratamiento secundario a los "workhorses" (Bacillus + Pseudomonas aparecen en casi todos los consorcios porque SON los workhorses de la biotecnología, pero el usuario no sabe eso).
