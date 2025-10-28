'use client';

import {useMemo, useState} from 'react';

import {usePathname, useRouter} from 'next/navigation';

import {localeLabels, locales, type Locale} from '@/lib/i18n';
import {cn} from '@/lib/ui';

type LangSwitchProps = {
  locale: Locale;
};

export function LangSwitch({locale}: LangSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() ?? '/';

  const options = useMemo(
    () =>
      locales.map((value) => ({
        value,
        label: localeLabels[value],
      })),
    [],
  );

  function selectLocale(nextLocale: Locale) {
    setIsOpen(false);
    if (nextLocale === locale) return;

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      segments.push(nextLocale);
    } else {
      segments[0] = nextLocale;
    }
    const target = `/${segments.join('/')}`;
    router.replace(target);
  }

  const activeLabel = localeLabels[locale] ?? locale.toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium shadow-sm transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span>{activeLabel}</span>
        <svg
          className={cn(
            'h-3 w-3 transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
          viewBox="0 0 10 6"
          aria-hidden
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen ? (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-soft"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === locale}
                onClick={() => selectLocale(option.value)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-100/80 dark:hover:bg-slate-700/40',
                  option.value === locale
                    ? 'text-accent font-medium'
                    : 'text-slate-600 dark:text-slate-300',
                )}
              >
                {option.label}
                {option.value === locale ? (
                  <span aria-hidden className="text-xs">
                    •
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
