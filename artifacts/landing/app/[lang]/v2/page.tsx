import { notFound } from 'next/navigation';
import { isLocale, getMessages } from '@/lib/i18n';
import { getWaitlistCount } from '@/app/actions';
import { NavV2 } from '@/components/v2/nav';
import { HeroV2 } from '@/components/v2/hero';
import { ProductPreviewV2 } from '@/components/v2/product-preview';
import { SocialProofV2 } from '@/components/v2/social-proof';
import { ProblemV2 } from '@/components/v2/problem';
import { DreamV2 } from '@/components/v2/dream';
import { WhatYouGetV2 } from '@/components/v2/what-you-get';
import { SolutionsV2 } from '@/components/v2/solutions';
import { HowV2 } from '@/components/v2/how';
import { WhatV2 } from '@/components/v2/what';
import { FounderV2 } from '@/components/v2/founder';
import { AlliancesV2 } from '@/components/v2/alliances';
import { FinalCtaV2 } from '@/components/v2/final-cta';
import { FooterV2 } from '@/components/v2/footer';

export const revalidate = 60;

export default async function LandingPageV2({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const t = getMessages(params.lang);
  const { total, countries } = await getWaitlistCount();

  return (
    <div className="v2-theme min-h-screen">
      <NavV2 locale={params.lang} t={t.nav} />
      <main>
        <HeroV2
          locale={params.lang}
          t={t.hero}
          initialCount={total}
          initialCountries={countries}
        />
        <ProductPreviewV2 />
        <SocialProofV2 t={t.socialProof} />
        <ProblemV2 t={t.problem} />
        <DreamV2 t={t.dream} />
        <WhatYouGetV2 t={t.whatYouGet} />
        <SolutionsV2 t={t.solutions} />
        <HowV2 t={t.how} />
        <WhatV2 t={t.what} />
        <FounderV2 t={t.founder} />
        <AlliancesV2 t={t.alliances} />
        <FinalCtaV2
          locale={params.lang}
          t={t.finalCta}
          initialCount={total}
          errors={t.hero.errors}
        />
      </main>
      <FooterV2 locale={params.lang} t={t.footer} />
    </div>
  );
}
