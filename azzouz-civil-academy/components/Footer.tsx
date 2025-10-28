import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

import siteConfig from '@/config/site.config.json';
import type {Locale} from '@/lib/i18n';

type FooterProps = {
  locale: Locale;
};

type LinkHref = Parameters<typeof Link>[0]['href'];

function buildHref(path: string, locale: string): LinkHref {
  const suffix = path === '/' ? '' : path;
  return {pathname: `/${locale}${suffix}`};
}

export async function Footer({locale}: FooterProps) {
  const t = await getTranslations({locale, namespace: 'navigation'});
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:justify-between">
        <div className="max-w-md space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p className="text-base font-semibold text-[var(--foreground)]">
            {siteConfig.name}
          </p>
          <p>
            {siteConfig.tagline?.[locale as keyof typeof siteConfig.tagline] ??
              siteConfig.tagline.fr}
          </p>
          <p>
            © {currentYear} {siteConfig.author.name}. Tous droits réservés.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-[var(--foreground)]">
              {t('standards')}
            </p>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>
                <Link className="hover:text-accent" href={buildHref('/standards', locale)}>
                  {t('standards')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent" href={buildHref('/essais', locale)}>
                  {t('essais')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent" href={buildHref('/geotech', locale)}>
                  {t('geotech')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-[var(--foreground)]">
              {t('contact')}
            </p>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>
                <Link className="hover:text-accent" href={buildHref('/about', locale)}>
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent" href={buildHref('/contact', locale)}>
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent" href={buildHref('/legal', locale)}>
                  {t('legal')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-[var(--foreground)]">Contact</p>
          <div className="flex flex-col gap-1">
            <a
              className="hover:text-accent"
              href={siteConfig.social.email}
              rel="noopener noreferrer"
            >
              {siteConfig.author.email}
            </a>
            <a
              className="hover:text-accent"
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
