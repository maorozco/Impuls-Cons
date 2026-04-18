import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, getMessages, type Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const t = getMessages(params.lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://biocycle.ai';
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `${siteUrl}/${params.lang}`,
      languages: {
        es: `${siteUrl}/es`,
        en: `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url: `${siteUrl}/${params.lang}`,
      type: 'website',
      locale: params.lang === 'es' ? 'es_CO' : 'en_US',
      siteName: 'Impulso BioCycle',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  return <>{children}</>;
}
