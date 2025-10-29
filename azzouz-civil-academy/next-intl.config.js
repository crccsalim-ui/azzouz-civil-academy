const {getRequestConfig} = require("next-intl/server");
const {normalizeLocale} = require("./lib/i18n");
const ar = require("./messages/ar.json");
const en = require("./messages/en.json");
const fr = require("./messages/fr.json");

const messagesMap = {
  fr,
  en,
  ar,
};

module.exports = getRequestConfig(async ({locale, requestLocale}) => {
  const candidate = locale ?? (await requestLocale);
  const resolvedLocale = normalizeLocale(candidate);

  return {
    locale: resolvedLocale,
    messages: messagesMap[resolvedLocale],
  };
});
