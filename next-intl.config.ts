import {getRequestConfig} from "next-intl/server";

const SUPPORTED_LOCALES = ['fr', 'en', 'ar'] as const;
const FALLBACK_LOCALE = 'fr';

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = (await requestLocale) as SupportedLocale | undefined;
  const resolvedLocale = locale && SUPPORTED_LOCALES.includes(locale) ? locale : FALLBACK_LOCALE;

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});
