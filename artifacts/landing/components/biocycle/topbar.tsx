'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { launchOnboarding } from './onboarding';

// NEXT_PUBLIC_CALENDLY_URL is sometimes defined as empty string in .env.local
// (unset but committed), so use `||` to treat "" as missing and fall back to mailto.
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  'mailto:hola@biocycle.ai?subject=Piloto%2090%20d%C3%ADas%20%C2%B7%20Reservar';

const CRUMBS: Record<string, string> = {
  inicio: 'Inicio',
  descubrimientos: 'Descubrimientos',
  disenador: 'Construye tu Consorcio',
  portal: 'Gestiona tus Residuos',
  asesoria: 'Asesoría IA',
};

export function BiocycleTopbar() {
  const pathname = usePathname() ?? '';
  const segment = pathname.split('/').filter(Boolean)[1] ?? 'inicio';
  const crumb = CRUMBS[segment] ?? 'Inicio';

  return (
    <div className="topbar">
      <div className="crumbs">
        <b>Impulso BioCycle</b>
        <span className="sep">/</span>
        <span>Producto</span>
        <span className="sep">/</span>
        <b style={{ color: 'var(--forest-deep)' }}>{crumb}</b>
      </div>
      <div className="tb-spacer" />
      <div className="tb-search">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          width="14"
          height="14"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" />
        </svg>
        Buscar contaminante, microorganismo, paper…
        <span className="kbd">⌘K</span>
      </div>
      <button
        className="tb-btn"
        onClick={launchOnboarding}
        title="Reabrir tour de onboarding"
        aria-label="Reabrir tour"
        data-testid="topbar-help-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 115 0c0 1.5-1.5 2-2.5 2.5V14" />
          <circle cx="12" cy="17" r=".6" fill="currentColor" />
        </svg>
        Tour
      </button>
      <Link
        className="tb-btn"
        href="/biocycle/descubrimientos"
        aria-label="Ver novedades y papers"
        data-testid="topbar-novedades-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13 21a2 2 0 01-4 0" />
        </svg>
        <span className="tb-btn-label">Novedades</span>
      </Link>
      <a
        className="tb-btn primary"
        href={CALENDLY_URL}
        target={CALENDLY_URL.startsWith('http') ? '_blank' : undefined}
        rel={CALENDLY_URL.startsWith('http') ? 'noopener noreferrer' : undefined}
        aria-label="Reservar piloto 90 días"
        data-testid="topbar-reservar-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span className="tb-btn-label">Reservar piloto</span>
      </a>
    </div>
  );
}
