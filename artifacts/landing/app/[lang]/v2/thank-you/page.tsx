import { notFound, redirect } from 'next/navigation';
import { isLocale, getMessages } from '@/lib/i18n';
import { NavV2 } from '@/components/v2/nav';
import { FooterV2 } from '@/components/v2/footer';
import { ThankYouForm } from '@/components/thank-you-form';

export default function ThankYouPageV2({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { email?: string };
}) {
  if (!isLocale(params.lang)) notFound();

  const email = searchParams.email?.trim();
  if (!email || !email.includes('@')) {
    redirect(`/${params.lang}/v2`);
  }

  const t = getMessages(params.lang);

  return (
    <div className="v2-theme min-h-screen">
      <NavV2 locale={params.lang} t={t.nav} />
      <main className="pt-32 pb-32 mx-auto max-w-3xl px-6">
        <ThankYouForm locale={params.lang} t={t.thankYou} email={email!} />
      </main>
      <FooterV2 locale={params.lang} t={t.footer} />
    </div>
  );
}
