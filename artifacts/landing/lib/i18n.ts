import es from '@/messages/es';
import en from '@/messages/en';
import type { Messages } from '@/messages/types';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<Locale, Messages> = { es, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
