import Image from 'next/image';

export function ProductPreviewV2() {
  return (
    <section className="pb-16 sm:pb-20 -mt-4">
      <div className="mx-auto max-w-5xl px-6">
        <figure className="relative">
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: '6px',
              border: '1px solid hsl(44 14% 84%)',
              background: 'hsl(0 0% 100%)',
              boxShadow: '0 1px 2px hsl(44 14% 60% / 0.08), 0 20px 50px -20px hsl(150 20% 8% / 0.12)',
            }}
          >
            <Image
              src="/imagenes/hero-dashboard-light.png"
              alt="Impulso BioCycle — editorial preview of the Consortium Designer"
              width={1024}
              height={1024}
              priority
              className="w-full h-auto"
            />
          </div>
          <figcaption className="v2-serif mt-6 text-center text-sm italic v2-ink-faint">
            Consortium Designer — vista previa temprana
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
