'use client';

import { useMemo, useState } from 'react';

export interface Paper {
  id: string;
  category: string; // "Plásticos" | "Hidrocarburos" | "PFAS" | "Textiles" | "Pesticidas" | "Minería" | "Suelos"
  catSlug: 'plastic' | 'hydro' | 'pfas' | 'textile' | 'pest' | 'mining' | 'soil';
  year: number;
  journal: string;
  institution: string;
  authors: string;
  title: string;
  body: string;
  result: string;
  resultDetail?: string;
  doi: string;
  featured?: boolean;
}

const CATEGORIES: Array<{ label: string; key: string | 'all'; slug: string }> = [
  { label: 'Todos', key: 'all', slug: 'all' },
  { label: 'Plásticos', key: 'Plásticos', slug: 'plastics' },
  { label: 'Hidrocarburos', key: 'Hidrocarburos', slug: 'hydro' },
  { label: 'PFAS', key: 'PFAS', slug: 'pfas' },
  { label: 'Textiles', key: 'Textiles', slug: 'textile' },
  { label: 'Pesticidas', key: 'Pesticidas', slug: 'pest' },
  { label: 'Minería', key: 'Minería', slug: 'mining' },
  { label: 'Suelos', key: 'Suelos', slug: 'soil' },
];

type SortOption = 'recent' | 'oldest' | 'category';

const SORT_LABEL: Record<SortOption, string> = {
  recent: 'Reciente',
  oldest: 'Antiguo',
  category: 'Categoría',
};

export function DescubrimientosFeed({ papers }: { papers: Paper[] }) {
  const [activeCat, setActiveCat] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: papers.length };
    for (const p of papers) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, [papers]);

  const filtered = useMemo(() => {
    const list = activeCat === 'all' ? papers : papers.filter((p) => p.category === activeCat);
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => b.year - a.year);
    else if (sortBy === 'oldest') sorted.sort((a, b) => a.year - b.year);
    else sorted.sort((a, b) => a.category.localeCompare(b.category));
    return sorted;
  }, [papers, activeCat, sortBy]);

  return (
    <section className="container" style={{ paddingTop: 24 }}>
      <div className="filters" role="tablist" aria-label="Filtrar por categoría">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            role="tab"
            aria-selected={activeCat === c.key}
            className={`filt ${activeCat === c.key ? 'active' : ''}`}
            onClick={() => setActiveCat(c.key)}
            data-testid={`filter-${c.slug}`}
          >
            {c.label}{' '}
            <span className="c">{counts[c.key] ?? 0}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          className="filt"
          style={{ background: '#fff' }}
          onClick={() => {
            const next: SortOption =
              sortBy === 'recent' ? 'oldest' : sortBy === 'oldest' ? 'category' : 'recent';
            setSortBy(next);
          }}
          aria-label="Cambiar orden"
          data-testid="sort-btn"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            width="12"
            height="12"
            style={{ marginRight: 4, verticalAlign: -1 }}
          >
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
          Ordenar · {SORT_LABEL[sortBy]}
        </button>
      </div>

      <div className="feed-meta">
        <span data-testid="results-count">{filtered.length} resultados</span>
        <span>Actualizado · 18 abr 2026</span>
      </div>

      <div className="feed" data-testid="paper-feed">
        {filtered.map((p) => (
          <PaperCard key={p.id} paper={p} />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: 'span 2',
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--muted)',
              border: '1px dashed var(--line)',
              borderRadius: 'var(--r-lg)',
            }}
          >
            Sin resultados para esta categoría.
          </div>
        )}
      </div>
    </section>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  const className = `paper ${paper.featured ? 'featured' : ''}`;
  return (
    <article className={className} data-testid={`paper-${paper.id}`}>
      {paper.featured ? (
        <div className="bc-img-wrap p-cover-featured">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/biocycle/img/featured-paper@2x.webp"
            alt="FAST-PETase enzima escindiendo una cadena de PET con monómeros brillando"
            className="bc-img"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="p-top">
        <span className={`p-cat cat-${paper.catSlug}`}>
          <span className="sq" />
          {paper.category}
        </span>
        <span className="p-year">{paper.year}</span>
      </div>
      <div className="p-journal">
        <b>{paper.journal}</b> · {paper.institution} · {paper.authors}
        {paper.featured && paper.body ? (
          <span style={{ opacity: 0.7 }}>
            {' · '}
            {shortenAuthors(paper)}
          </span>
        ) : null}
      </div>
      <h3>{paper.title}</h3>
      <p className="p-body">{paper.body}</p>
      <div className="p-result">
        {paper.featured ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="16"
            height="16"
            style={{ color: 'var(--forest-deep)', flex: 'none', marginTop: 1 }}
          >
            <path d="M3 3v18h18M7 14l4-4 3 3 5-6" />
          </svg>
        ) : null}
        <div>
          <b>{paper.result}</b>
          {paper.resultDetail ? ` · ${paper.resultDetail}` : ''}
        </div>
      </div>
      <div className="p-foot">
        <span className="p-doi">DOI · {paper.doi}</span>
        <a className="p-link" href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener">
          Ver paper
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </a>
      </div>
    </article>
  );
}

function shortenAuthors(p: Paper): string {
  if (p.id === '1') return 'Machine learning-aided engineering of hydrolases for PET depolymerization';
  return '';
}
