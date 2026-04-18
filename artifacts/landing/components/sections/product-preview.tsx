import Image from 'next/image';

export function ProductPreview() {
  return (
    <section className="relative isolate overflow-hidden pb-20 -mt-8 sm:-mt-12">
      <div className="container-tight relative">
        <div className="relative mx-auto max-w-5xl rounded-xl border border-border bg-card/40 p-2 sm:p-3 shadow-[0_0_0_1px_hsl(var(--emerald)/0.08),0_24px_60px_-20px_hsl(var(--emerald)/0.18)]">
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-emerald/8 via-transparent to-transparent blur-2xl" aria-hidden />
          <Image
            src="/imagenes/hero-dashboard-dark.png"
            alt="Impulso BioCycle — Consortium Designer dashboard preview"
            width={1024}
            height={1024}
            priority
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
