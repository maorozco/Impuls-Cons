/**
 * Curated country list aligned with marketing/AVATAR-IDEAL.md regional segmentation.
 * Top markets first; "Other" at the end.
 */

export type Country = { code: string; name_es: string; name_en: string };

export const COUNTRIES: Country[] = [
  // Avatar primary regions
  { code: 'CO', name_es: 'Colombia', name_en: 'Colombia' },
  { code: 'MX', name_es: 'México', name_en: 'Mexico' },
  { code: 'BR', name_es: 'Brasil', name_en: 'Brazil' },
  { code: 'CL', name_es: 'Chile', name_en: 'Chile' },
  { code: 'AR', name_es: 'Argentina', name_en: 'Argentina' },
  { code: 'PE', name_es: 'Perú', name_en: 'Peru' },
  { code: 'EC', name_es: 'Ecuador', name_en: 'Ecuador' },
  { code: 'US', name_es: 'Estados Unidos', name_en: 'United States' },
  { code: 'CA', name_es: 'Canadá', name_en: 'Canada' },
  { code: 'GB', name_es: 'Reino Unido', name_en: 'United Kingdom' },
  { code: 'DE', name_es: 'Alemania', name_en: 'Germany' },
  { code: 'NL', name_es: 'Países Bajos', name_en: 'Netherlands' },
  { code: 'ES', name_es: 'España', name_en: 'Spain' },
  { code: 'FR', name_es: 'Francia', name_en: 'France' },
  { code: 'IT', name_es: 'Italia', name_en: 'Italy' },
  { code: 'AU', name_es: 'Australia', name_en: 'Australia' },
  { code: 'SG', name_es: 'Singapur', name_en: 'Singapore' },
  { code: 'JP', name_es: 'Japón', name_en: 'Japan' },
  { code: 'IN', name_es: 'India', name_en: 'India' },
  { code: 'CN', name_es: 'China', name_en: 'China' },
  { code: 'OTHER', name_es: 'Otro país', name_en: 'Other country' },
];
