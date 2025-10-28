'use client';

import {ChangeEvent} from 'react';

import {useTranslations} from 'next-intl';

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

export function SearchBar({query, onChange, autoFocus}: SearchBarProps) {
  const t = useTranslations('common');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          d="M15.5 15.5 20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="11"
          cy="11"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <input
        type="search"
        value={query}
        onChange={handleChange}
        autoFocus={autoFocus}
        placeholder={t('searchPlaceholder')}
        className="w-full rounded-full border border-[var(--border)] bg-white/90 py-3 pl-12 pr-4 text-sm shadow-soft outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 dark:bg-slate-800/80"
      />
    </div>
  );
}
