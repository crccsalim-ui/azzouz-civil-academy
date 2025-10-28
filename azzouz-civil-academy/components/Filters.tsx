'use client';

import {useMemo} from 'react';

import {useTranslations} from 'next-intl';

import type {
  Domain,
  Jurisdiction,
  RightsStatus,
} from '@/lib/types';

export type FiltersValue = {
  domains: Domain[];
  jurisdictions: Jurisdiction[];
  rights: RightsStatus[];
  yearFrom: number | null;
  sortOrder: 'desc' | 'asc';
};

type FiltersProps = {
  value: FiltersValue;
  onChange: (next: FiltersValue) => void;
  onReset: () => void;
  availableYears: number[];
};

const domainOptions: {value: Domain; key: string}[] = [
  {value: 'ba', key: 'ba'},
  {value: 'acier', key: 'acier'},
  {value: 'sismique', key: 'sismique'},
  {value: 'geotech', key: 'geotech'},
  {value: 'essais', key: 'essais'},
];

const jurisdictionOptions: {value: Jurisdiction; key: string}[] = [
  {value: 'FR', key: 'fr'},
  {value: 'DZ', key: 'dz'},
  {value: 'INT', key: 'int'},
];

const rightsOptions: {value: RightsStatus; key: string}[] = [
  {value: 'own', key: 'own'},
  {value: 'licensed', key: 'licensed'},
  {value: 'public_domain', key: 'public_domain'},
  {value: 'unclear', key: 'unclear'},
];

function toggleValue<T>(list: T[], value: T) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function Filters({
  value,
  onChange,
  onReset,
  availableYears,
}: FiltersProps) {
  const t = useTranslations('filters');

  const years = useMemo(() => {
    const sorted = [...availableYears].sort((a, b) => b - a);
    return sorted;
  }, [availableYears]);

  function update(partial: Partial<FiltersValue>) {
    onChange({...value, ...partial});
  }

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {t('title')}
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-slate-500 transition hover:text-accent"
        >
          {t('reset')}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-[var(--foreground)]">
            {t('domains')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {domainOptions.map((option) => {
              const isActive = value.domains.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    update({domains: toggleValue(value.domains, option.value)})
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-[var(--border)] text-slate-600 hover:border-accent/60'
                  }`}
                >
                  {t(`domain.${option.key}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-[var(--foreground)]">
            {t('jurisdictions')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {jurisdictionOptions.map((option) => {
              const isActive = value.jurisdictions.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    update({
                      jurisdictions: toggleValue(
                        value.jurisdictions,
                        option.value,
                      ),
                    })
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-[var(--border)] text-slate-600 hover:border-accent/60'
                  }`}
                >
                  {t(`jurisdiction.${option.key}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-[var(--foreground)]">
            {t('rights')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {rightsOptions.map((option) => {
              const isActive = value.rights.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    update({
                      rights: toggleValue(value.rights, option.value),
                    })
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-[var(--border)] text-slate-600 hover:border-accent/60'
                  }`}
                >
                  {t(`rightsStatus.${option.key}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-[var(--foreground)]">
            {t('year')}
          </legend>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={value.yearFrom ?? ''}
              onChange={(event) =>
                update({
                  yearFrom:
                    event.target.value === ''
                      ? null
                      : Number.parseInt(event.target.value, 10),
                })
              }
              className="min-w-[140px] rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">{t('yearAny')}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  ≥ {year}
                </option>
              ))}
            </select>

            <select
              value={value.sortOrder}
              onChange={(event) =>
                update({sortOrder: event.target.value as FiltersValue['sortOrder']})
              }
              className="min-w-[140px] rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="desc">{t('sort.newest')}</option>
              <option value="asc">{t('sort.oldest')}</option>
            </select>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
