import {getRequestConfig} from "next-intl/server";

import {normalizeLocale} from "../lib/i18n";
import ar from "../messages/ar.json";
import en from "../messages/en.json";
import fr from "../messages/fr.json";

const messagesMap = {
  fr,
  en,
  ar,
};

export default getRequestConfig(async ({locale, requestLocale}) => {
  const candidate = (locale ?? (await requestLocale)) as string | undefined;
  const resolvedLocale = normalizeLocale(candidate);

  return {
    locale: resolvedLocale,
    messages: messagesMap[resolvedLocale],
  };
});
