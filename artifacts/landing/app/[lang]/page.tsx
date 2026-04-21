import { notFound } from 'next/navigation';
import { isLocale, getMessages } from '@/lib/i18n';
import { getWaitlistCount } from '@/app/actions';
import { Nav } from '@/components/sections/nav';
import { Hero } from '@/components/sections/hero';
import { BuildInPublicWidget } from '@/components/sections/build-in-public';
import { ProductPreview } from '@/components/sections/product-preview';
import { SocialProof } from '@/components/sections/social-proof';
import { Problem } from '@/components/sections/problem';
import { Video } from '@/components/sections/video';
import { Dream } from '@/components/sections/dream';
import { WhatYouGet } from '@/components/sections/what-you-get';
import { Solutions } from '@/components/sections/solutions';
import { How } from '@/components/sections/how';
import { What } from '@/components/sections/what';
import { Founder } from '@/components/sections/founder';
import { Alliances } from '@/components/sections/alliances';
import { FinalCta } from '@/components/sections/final-cta';
import { Footer } from '@/components/sections/footer';

export const revalidate = 60;

export default async function LandingPage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const t = getMessages(params.lang);
  const { total, countries } = await getWaitlistCount();

  return (
    <>
      <Nav locale={params.lang} t={t.nav} />
      <main>
        <Hero
          locale={params.lang}
          t={t.hero}
          initialCount={total}
          initialCountries={countries}
        />
        <BuildInPublicWidget locale={params.lang as 'es' | 'en'} />
        <ProductPreview />
        <SocialProof t={t.socialProof} />
        <Problem t={t.problem} />
        <Video t={t.video} />
        <Dream t={t.dream} />
        <WhatYouGet t={t.whatYouGet} />
        <Solutions t={t.solutions} />
        <How t={t.how} />
        <What t={t.what} />
        <Founder t={t.founder} />
        <Alliances t={t.alliances} />
        <FinalCta
          locale={params.lang}
          t={t.finalCta}
          initialCount={total}
          errors={t.hero.errors}
        />
      </main>
      <Footer locale={params.lang} t={t.footer} />
    </>
  );
}
