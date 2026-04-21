import type { Metadata } from 'next';
import Script from 'next/script';
import './biocycle.css';
import { BiocycleSidebar } from '@/components/biocycle/sidebar';
import { BiocycleTopbar } from '@/components/biocycle/topbar';
import { BiocycleOnboarding } from '@/components/biocycle/onboarding';

export const metadata: Metadata = {
  title: 'Impulso BioCycle — Plataforma',
  description: 'Consorcios microbianos diseñados por IA · 4,797 referencias peer-reviewed',
};

/**
 * Route group layout for the biocycle product app.
 * Renders the shared sidebar + topbar shell around all /biocycle/* pages.
 * Separate from the marketing landing layout at app/[lang]/.
 */
export default function BiocycleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Google Fonts required by the design system */}
      <Script id="biocycle-fonts" strategy="beforeInteractive">
        {`
        if (!document.getElementById('bc-fonts')) {
          var l = document.createElement('link');
          l.id='bc-fonts';
          l.rel='stylesheet';
          l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500&display=swap';
          document.head.appendChild(l);
        }
        `}
      </Script>
      <div className="app">
        <BiocycleSidebar />
        <main>
          <BiocycleTopbar />
          {children}
        </main>
      </div>
      <BiocycleOnboarding />
    </>
  );
}
