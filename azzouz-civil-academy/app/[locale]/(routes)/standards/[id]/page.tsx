import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";

import {DownloadButton} from "@/components/DownloadButton";
import {MDXRenderer} from "@/components/MDXRenderer";
import {getDocumentById} from "@/lib/content/documents";
import {normalizeLocale} from "@/lib/i18n";
import type {DocumentWithContent} from "@/lib/types";

function formatSize(bytes?: number) {
  if (!bytes) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(1)} ${units[unit]}`;
}

type PageProps = {
  params?: Promise<{locale?: string; id?: string}>;
};

export default async function StandardDetailPage({params}: PageProps) {
  const rawParams = params ? await params : {};
  const locale = normalizeLocale(rawParams.locale);
  const id = rawParams.id;
  if (!id) {
    notFound();
  }

  const record = (await getDocumentById(id)) as DocumentWithContent | null;

  if (!record) {
    notFound();
  }

  const [tFilters, tCommon] = await Promise.all([
    getTranslations({locale, namespace: 'filters'}),
    getTranslations({locale, namespace: 'common'}),
  ]);

  const jurisdictionKey = record.jurisdiction.toLowerCase();
  const domainLabel = tFilters(`domain.${record.domain}`);
  const jurisdictionLabel = tFilters(`jurisdiction.${jurisdictionKey}`);
  const rightsLabel = tFilters(`rightsStatus.${record.rights_status}`);
  const statusLabel = tFilters(`status.${record.status}`);
  const sizeLabel = formatSize(record.file?.size_bytes);
  const canDownload = record.distribution_mode === 'host_file';

  return (
    <main className="mx-auto max-w-5xl space-y-12 px-6 pb-16 pt-12">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
          <span>{domainLabel}</span>
          <span>•</span>
          <span>
            {jurisdictionLabel} · {record.year}
          </span>
        </div>
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {record.title}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          {record.summary}
        </p>
        <div className="flex flex-wrap gap-3">
          {canDownload ? (
            <DownloadButton documentId={record.id} />
          ) : (
            <a
              href={record.source_official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-accent hover:text-accent"
            >
              {tCommon('viewSource')}
            </a>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {statusLabel}
          </span>
        </div>
      </header>

      <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
        <article className="space-y-8">
          {record.body ? (
            <MDXRenderer source={record.body} />
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {record.summary}
            </p>
          )}

          {record.citations?.length ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {tCommon('rights')}
              </h2>
              <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {record.citations.map((citation, index) => (
                  <li
                    key={`${citation.ref}-${index}`}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"
                  >
                    <p className="font-medium">“{citation.quote}”</p>
                    <p className="text-xs text-slate-500">
                      {citation.page} · {citation.ref}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </article>

        <aside className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-[var(--foreground)]">
              {tCommon('rights')}
            </p>
            <p>{rightsLabel}</p>
            {record.file?.mime ? <p>{record.file.mime}</p> : null}
            {sizeLabel ? <p>{sizeLabel}</p> : null}
          </div>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-[var(--foreground)]">
              {tCommon('documentDetails')}
            </p>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {tCommon('publisher')}
                </dt>
                <dd>{record.publisher}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {tCommon('identifier')}
                </dt>
                <dd>{record.id}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {tCommon('lastUpdated')}
                </dt>
                <dd>{new Date(record.updated_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
          {record.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {record.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}



