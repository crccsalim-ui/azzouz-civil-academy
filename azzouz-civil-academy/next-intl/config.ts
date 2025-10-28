import {getRequestConfig} from "next-intl/server";

const SUPPORTED_LOCALES = ["fr", "en", "ar"] as const;
const FALLBACK_LOCALE = "fr";

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function normalizeLocale(input: string | undefined): SupportedLocale {
  if (input && SUPPORTED_LOCALES.includes(input as SupportedLocale)) {
    return input as SupportedLocale;
  }
  return FALLBACK_LOCALE;
}

export default getRequestConfig(async ({locale, requestLocale}) => {
  const candidate = (locale ?? (await requestLocale)) as string | undefined;
  const resolvedLocale = normalizeLocale(candidate);


  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});



