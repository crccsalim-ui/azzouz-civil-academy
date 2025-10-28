import Image from 'next/image';
import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

import siteConfig from '@/config/site.config.json';
import {LangSwitch} from '@/components/LangSwitch';
import {ThemeToggle} from '@/components/ThemeToggle';
import type {Locale} from '@/lib/i18n';

type NavbarProps = {
  locale: Locale;
};

const navItems = siteConfig.menu;

type LinkHref = Parameters<typeof Link>[0]['href'];

function buildNavHref(path: string, locale: string): LinkHref {
  const suffix = path === '/' ? '' : path;
  return {pathname: `/${locale}${suffix}`};
}

export async function Navbar({locale}: NavbarProps) {
  const t = await getTranslations({locale, namespace: 'navigation'});

  return (
    <header className="sticky top-0 z-40 bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--background)_82%,transparent)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href={buildNavHref('/', locale)} className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <Image
              src="/images/logo.png"
              alt="AZ-CIVIL-ACADEMY"
              fill
              sizes="48px"
              className="object-contain p-1.5"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-wide text-[var(--foreground)]">
              AZ-CIVIL-ACADEMY
            </p>
            <p className="text-xs uppercase text-slate-500">
              {siteConfig.tagline?.[locale as keyof typeof siteConfig.tagline] ??
                siteConfig.tagline.fr}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={buildNavHref(item.path, locale)}
              className="text-sm font-medium text-slate-600 transition hover:text-accent dark:text-slate-300"
            >
              {t(item.id)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LangSwitch locale={locale} />
        </div>
      </div>
    </header>
  );
}

