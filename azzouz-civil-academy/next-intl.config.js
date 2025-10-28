const {getRequestConfig} = require("next-intl/server");

const SUPPORTED_LOCALES = ["fr", "en", "ar"];
const FALLBACK_LOCALE = "fr";

function normalizeLocale(input) {
  if (typeof input === "string" && SUPPORTED_LOCALES.includes(input)) {
    return input;
  }
  return FALLBACK_LOCALE;
}

module.exports = getRequestConfig(async ({locale, requestLocale}) => {
  const candidate = locale ?? (await requestLocale);
  const resolvedLocale = normalizeLocale(candidate);

  const messagesModule = await import(`./messages/${resolvedLocale}.json`);

  return {
    locale: resolvedLocale,
    messages: messagesModule.default,
  };
});
