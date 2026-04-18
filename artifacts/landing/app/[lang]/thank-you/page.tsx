import { notFound, redirect } from 'next/navigation';
import { isLocale, getMessages } from '@/lib/i18n';
import { Nav } from '@/components/sections/nav';
import { Footer } from '@/components/sections/footer';
import { ThankYouForm } from '@/components/thank-you-form';

export default function ThankYouPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { email?: string };
}) {
  if (!isLocale(params.lang)) notFound();

  const email = searchParams.email?.trim();
  if (!email || !email.includes('@')) {
    // No email in URL — bounce back to the landing page
    redirect(`/${params.lang}`);
  }

  const t = getMessages(params.lang);

  return (
    <>
      <Nav locale={params.lang} t={t.nav} />
      <main className="pt-24 pb-32">
        <ThankYouForm locale={params.lang} t={t.thankYou} email={email} />
      </main>
      <Footer locale={params.lang} t={t.footer} />
    </>
  );
}
