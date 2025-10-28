'use client';

import {useEffect, useMemo, useState} from 'react';

import type MiniSearch from 'minisearch';
import {useLocale, useTranslations} from 'next-intl';

import {Card} from '@/components/Card';
import {Filters, type FiltersValue} from '@/components/Filters';
import {SearchBar} from '@/components/SearchBar';
import {getSearchEngine} from '@/lib/search/indexing';
import type {DocumentMetadata, SearchableDocument} from '@/lib/types';

const initialFilters: FiltersValue = {
  domains: [],
  jurisdictions: [],
  rights: [],
  yearFrom: null,
  sortOrder: 'desc',
};

type StandardsExplorerProps = {
  documents: DocumentMetadata[];
  initialQuery?: string;
};

export function StandardsExplorer({documents, initialQuery = ''}: StandardsExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FiltersValue>(initialFilters);
  const [engine, setEngine] = useState<MiniSearch<SearchableDocument> | null>(null);
  const [isLoadingIndex, setIsLoadingIndex] = useState(false);
  const locale = useLocale();
  const tFilters = useTranslations('filters');
  const tCommon = useTranslations('common');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let active = true;
    setIsLoadingIndex(true);

    getSearchEngine()
      .then((instance) => {
        if (active) {
          setEngine(instance);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingIndex(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const searchIds = useMemo(() => {
    if (!query.trim() || !engine) return null;
    const results = engine.search(query, {
      prefix: true,
      fuzzy: 0.2,
      boost: {title: 4, tags: 2},
    });
    return new Set(results.map((result) => result.id));
  }, [engine, query]);

  const availableYears = useMemo(
    () => Array.from(new Set(documents.map((doc) => doc.year))).sort((a, b) => b - a),
    [documents],
  );

  const filteredDocs = useMemo(() => {
    let result = documents;

    if (searchIds) {
      result = documents.filter((doc) => searchIds.has(doc.id));
    }

    result = result.filter((doc) => {
      if (filters.domains.length && !filters.domains.includes(doc.domain)) {
        return false;
      }
      if (filters.jurisdictions.length && !filters.jurisdictions.includes(doc.jurisdiction)) {
        return false;
      }
      if (filters.rights.length && !filters.rights.includes(doc.rights_status)) {
        return false;
      }
      if (filters.yearFrom && doc.year < filters.yearFrom) {
        return false;
      }
      return true;
    });

    result = [...result].sort((a, b) =>
      filters.sortOrder === 'desc' ? b.year - a.year : a.year - b.year,
    );

    return result;
  }, [documents, filters, searchIds]);

  function resetFilters() {
    setFilters(initialFilters);
  }

  const domainLabels: Record<string, string> = {
    ba: tFilters('domain.ba'),
    acier: tFilters('domain.acier'),
    sismique: tFilters('domain.sismique'),
    geotech: tFilters('domain.geotech'),
    essais: tFilters('domain.essais'),
  };

  const jurisdictionLabels: Record<string, string> = {
    FR: tFilters('jurisdiction.fr'),
    DZ: tFilters('jurisdiction.dz'),
    INT: tFilters('jurisdiction.int'),
  };

  const rightsLabels: Record<string, string> = {
    own: tFilters('rightsStatus.own'),
    licensed: tFilters('rightsStatus.licensed'),
    public_domain: tFilters('rightsStatus.public_domain'),
    unclear: tFilters('rightsStatus.unclear'),
  };

  const statusLabels: Record<string, string> = {
    active: tFilters('status.active'),
    withdrawn: tFilters('status.withdrawn'),
    draft: tFilters('status.draft'),
    unknown: tFilters('status.unknown'),
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[2fr,1fr] md:items-start">
        <SearchBar query={query} onChange={setQuery} />
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
          {isLoadingIndex
            ? tCommon('loading')
            : `${filteredDocs.length} ${tCommon('results')}`}
        </div>
      </div>

      <Filters
        value={filters}
        onChange={setFilters}
        onReset={resetFilters}
        availableYears={availableYears}
      />

      {filteredDocs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center text-sm text-slate-500">
          {tCommon('noResults')}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              document={doc}
              href={{pathname: `/${locale}/standards/${doc.id}`}}
              labels={{
                domain: domainLabels[doc.domain],
                jurisdiction: jurisdictionLabels[doc.jurisdiction],
                rights: rightsLabels[doc.rights_status],
                status: statusLabels[doc.status],
                action: tCommon('viewDetails'),
              }}
            />
          ))}
        </div>
      )}

      {query && searchIds && searchIds.size > filteredDocs.length ? (
        <p className="text-xs text-slate-400">{tCommon('filteredMessage')}</p>
      ) : null}
    </div>
  );
}
