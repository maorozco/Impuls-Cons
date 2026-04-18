import type { Messages } from '@/messages/types';

const JOURNALS = [
  'Nature',
  'Science',
  'PNAS',
  'ACS Catalysis',
  'Biotechnology & Bioengineering',
  'Trends in Biotechnology',
  'Environmental Science & Technology',
  'Frontiers in Microbiology',
  'Springer Biodegradation',
  'PubMed Central',
  'bioRxiv',
  'ChemSusChem',
  'Applied and Environmental Microbiology',
  'Journal of Hazardous Materials',
  'Bioresource Technology',
  'Nobel de Química 2024',
];

export function SocialProof({ t }: { t: Messages['socialProof'] }) {
  return (
    <section className="py-16 sm:py-20 border-y border-border bg-card/30">
      <div className="container-tight">
        <p className="text-sm sm:text-base text-muted-foreground/80 mb-8 text-center max-w-3xl mx-auto leading-relaxed">
          {t.publishedIn}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {JOURNALS.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tag"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
