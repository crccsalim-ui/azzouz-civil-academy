import type {Metadata} from 'next';

import {Locale, defaultLocale, locales} from './i18n';

const titles: Record<Locale, string> = {
  fr: 'AZ-CIVIL-ACADEMY · Ingénierie & Savoir',
  en: 'AZ-CIVIL-ACADEMY · Engineering & Knowledge',
  ar: 'أكاديمية AZ للمدني · هندسة ومعرفة',
};

const descriptions: Record<Locale, string> = {
  fr: "Ressources, normes et fiches pratiques pour l'ingénierie civile en Algérie et en France.",
  en: 'Civil engineering resources, standards, and field guides for professionals and students.',
  ar: 'مكتبة للمعايير والموارد الهندسية المدنية للمهندسين والطلاب والمتدربين.',
};

const siteUrl = 'https://az-civil-academy.vercel.app';

export function buildSiteMetadata(locale: Locale): Metadata {
  const title = titles[locale];
  const description = descriptions[locale];

  return {
    title,
    description,
    alternates: {
      canonical: locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          loc === defaultLocale ? siteUrl : `${siteUrl}/${loc}`,
        ]),
      ),
    },
    openGraph: {
      type: 'website',
      url: locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
      title,
      description,
      siteName: 'AZ-CIVIL-ACADEMY',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
