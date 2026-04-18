import type { Messages } from '@/messages/types';

export function SocialProofV2({ t }: { t: Messages['socialProof'] }) {
  const journals = ['Nature', 'Science', 'Cell', 'PNAS', 'ACS', 'Elsevier'];
  return (
    <section className="py-16 sm:py-20 border-t" style={{ borderColor: 'hsl(44 14% 84%)' }}>
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="v2-eyebrow">{t.publishedIn}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {journals.map((j) => (
            <span
              key={j}
              className="v2-serif italic text-xl v2-ink-faint tracking-tight"
            >
              {j}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
