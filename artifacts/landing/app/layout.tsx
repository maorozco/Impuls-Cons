import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://biocycle.ai'),
  title: 'Impulso BioCycle',
  description: 'AI for bioremediation. Join the waitlist.',
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // NOTE: do NOT render a manual <head> with conditional children in App Router —
  // it triggers hydration mismatches that strip Next's lazy CSS link injection.
  // Use the metadata API + next/script instead.
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        {plausibleDomain && (
          <Script
            defer
            strategy="afterInteractive"
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.outbound-links.js"
          />
        )}
      </body>
    </html>
  );
}
