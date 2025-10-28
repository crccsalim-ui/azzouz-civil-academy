import {Locale, isRtlLocale} from './i18n';

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

export function getLanguageAttributes(locale: Locale) {
  const dir = getDirection(locale);
  return {
    lang: locale,
    dir,
    className: dir === 'rtl' ? 'rtl' : 'ltr',
    bodyClassName: dir === 'rtl' ? 'rtl font-arabic' : 'ltr font-latin',
  };
}
