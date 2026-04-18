import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-mono text-xs tracking-wider text-emerald">404</span>
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <Link
        href="/es"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
      >
        ← Volver al inicio · Back home
      </Link>
    </main>
  );
}
