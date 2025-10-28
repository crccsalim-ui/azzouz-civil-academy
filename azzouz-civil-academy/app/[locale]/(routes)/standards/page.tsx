import {getTranslations} from "next-intl/server";

import {StandardsExplorer} from "@/components/StandardsExplorer";
import {getAllDocuments} from "@/lib/content/documents";
import {resolveLocaleParam} from "@/lib/i18n";

type StandardsSearchParams = Record<string, string | string[] | undefined>;

type StandardsPageProps = {
  params?: Promise<{locale?: string}>;
  searchParams?: Promise<StandardsSearchParams>;
};

export default async function StandardsPage({params, searchParams}: StandardsPageProps) {
  const [locale, resolvedSearchParams] = await Promise.all([
    resolveLocaleParam(params),
    searchParams ?? Promise.resolve<StandardsSearchParams>({}),
  ]);
  const [tPage, tCommon] = await Promise.all([
    getTranslations({locale, namespace: 'pages'}),
    getTranslations({locale, namespace: 'common'}),
  ]);
  const documents = await getAllDocuments({includeSamples: true});

  const queryValue = resolvedSearchParams?.q;
  const initialQuery =
    typeof queryValue === 'string'
      ? decodeURIComponent(queryValue)
      : Array.isArray(queryValue) && typeof queryValue[0] === 'string'
        ? decodeURIComponent(queryValue[0])
        : '';

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 pb-16 pt-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {tPage('standards.title')}
        </h1>
        <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {tPage('standards.intro')}
        </p>
      </header>
      <StandardsExplorer documents={documents} initialQuery={initialQuery} />
      <p className="text-xs text-slate-400">
        {tCommon('rights')}: {tCommon('filters')} · MiniSearch
      </p>
    </main>
  );
}


