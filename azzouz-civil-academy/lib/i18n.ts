export const locales = ['fr', 'en', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const rtlLocales: Locale[] = ['ar'];

export function normalizeLocale(value?: string): Locale {
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

export async function resolveLocaleParam(
  params?: Promise<{locale?: string}>,
): Promise<Locale> {
  const raw = params ? await params : {};
  return normalizeLocale(raw.locale);
}

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};
