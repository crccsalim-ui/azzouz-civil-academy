'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import type {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';

import {SearchBar} from '@/components/SearchBar';
import type {Locale} from '@/lib/i18n';

type HeroSearchProps = {
  locale: Locale;
};

type RouterPushHref = Parameters<AppRouterInstance['push']>[0];

export function HeroSearch({locale}: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const t = useTranslations('common');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    const target = `/${locale}/standards${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ''}`;
    router.push(target as RouterPushHref);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <SearchBar query={query} onChange={setQuery} autoFocus />
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('searchAction')}
        </button>
      </div>
    </form>
  );
}
