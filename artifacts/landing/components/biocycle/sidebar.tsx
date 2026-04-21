'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface View {
  id: string;
  name: string;
  href: string;
  kbd: string;
  icon: React.ReactNode;
}

const VIEWS: View[] = [
  {
    id: 'inicio',
    name: 'Inicio',
    href: '/biocycle/inicio',
    kbd: '1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12l9-8 9 8M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    id: 'descubrimientos',
    name: 'Descubrimientos',
    href: '/biocycle/descubrimientos',
    kbd: '2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5V4.5A1.5 1.5 0 015.5 3H19v18H5.5A1.5 1.5 0 014 19.5zM8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
  },
  {
    id: 'disenador',
    name: 'Construye tu Consorcio',
    href: '/biocycle/disenador',
    kbd: '3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 2v4a5 5 0 0010 0V2M7 22v-4a5 5 0 0110 0v4M7 6h10M7 18h10" />
      </svg>
    ),
  },
  {
    id: 'portal',
    name: 'Gestiona tus Residuos',
    href: '/biocycle/portal',
    kbd: '4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M10 10h4M10 14h4M10 18h4" />
      </svg>
    ),
  },
  {
    id: 'asesoria',
    name: 'Asesoría IA',
    href: '/biocycle/asesoria',
    kbd: '5',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 12a8 8 0 11-3.2-6.4L21 3v6h-6" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
];

export function BiocycleSidebar() {
  const pathname = usePathname();
  const activeId = VIEWS.find((v) => pathname?.startsWith(v.href))?.id ?? 'inicio';

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-name">
            Impulso <span style={{ color: 'var(--forest-deep)' }}>BioCycle</span>
          </div>
          <div className="brand-sub">v0.3 · Piloto</div>
        </div>
      </div>

      <div className="nav-label">Producto</div>
      <nav className="nav">
        {VIEWS.map((v) => (
          <Link
            key={v.id}
            className={`nav-item ${v.id === activeId ? 'active' : ''}`}
            href={v.href}
          >
            {v.icon}
            {v.name}
            <span className="nav-kbd">{v.kbd}</span>
          </Link>
        ))}
      </nav>

      <div className="nav-label" style={{ marginTop: 18 }}>
        Recursos
      </div>
      <nav className="nav">
        <a className="nav-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" />
          </svg>
          Corpus (61 docs)
        </a>
        <a className="nav-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
          </svg>
          30+ países
        </a>
        <a className="nav-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 8v5l3 2M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
          </svg>
          Changelog
        </a>
      </nav>

      <div className="side-foot">
        <div className="side-card">
          <b>Qué hacemos (y qué NO)</b>
          <div style={{ fontSize: 11.5, lineHeight: 1.55, color: 'var(--muted)' }}>
            <span style={{ color: '#00733A' }}>✓</span> Plástico → biorreactor contenido (monómeros vendibles).<br />
            <span style={{ color: '#00733A' }}>✓</span> Hidrocarburos → cápsulas alginato in-situ.<br />
            <span style={{ color: '#C62828' }}>✗</span> No prometemos limpiar playas ni océanos.
          </div>
          <div
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: '1px dashed var(--line)',
            }}
          >
            <div className="side-stat">
              <span>TRL sistema</span>
              <b>3–4</b>
            </div>
            <div className="side-stat">
              <span>Microorganismos</span>
              <b>28</b>
            </div>
            <div className="side-stat">
              <span>Referencias</span>
              <b>4,797</b>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
